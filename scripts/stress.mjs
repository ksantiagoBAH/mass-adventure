import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const engine = process.env.TEST_BROWSER || "chrome";
const browser =
  engine === "webkit"
    ? await webkit.launch()
    : await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const only = process.env.TEST_CASE;
async function test(name, fn) {
  if (only && !name.includes(only)) return;
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await fn(page);
    assert.deepEqual(errors, [], "No uncaught browser errors");
    results.push({ name, status: "PASS" });
  } catch (e) {
    await writeFile(
      `/private/tmp/mass-stress-${engine}-failure.json`,
      JSON.stringify(
        {
          name,
          url: page.url(),
          errors,
          body: await page
            .locator("body")
            .innerText()
            .catch(() => "missing"),
        },
        null,
        2,
      ),
    );
    results.push({ name, status: "FAIL", detail: e.message, errors });
  } finally {
    await context.close();
  }
  console.log(results.at(-1).status, name, results.at(-1).detail || "");
}
const nav = async (p, name) => {
  await p
    .getByRole("button", { name, exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await p.evaluate(() => new Promise(requestAnimationFrame));
};
const lesson = async (p, index = 0) => {
  await p.getByRole("button", { name: "Start the Mass Adventure" }).click();
  await p.locator(".map-stop").nth(index).click();
};
await test("Responsive layouts at 320–1440px including navigation breakpoint", async (p) => {
  await p.goto(base);
  const failures = [];
  for (const width of [320, 360, 390, 600, 700, 701, 768, 820, 1024, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    for (const screen of [
      "Home",
      "Adventure Map",
      "Parent Corner",
      "Sticker Book",
    ]) {
      await nav(p, screen);
      const overflow = await p.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      if (overflow > 1)
        failures.push(`${screen}@${width}: ${overflow}px overflow`);
    }
    await nav(p, "Adventure Map");
    await p.locator(".map-stop").nth(2).click();
    if (
      await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )
    )
      failures.push(`lesson@${width} overflow`);
  }
  assert.deepEqual(failures, []);
});
await test("Browser Back/Forward follows app navigation", async (p) => {
  await p.goto(base);
  await lesson(p);
  await p.goBack();
  await p.locator(".adventure-path").waitFor({ timeout: 5000 });
  assert(
    await p.locator(".adventure-path").isVisible(),
    "Back should return to map",
  );
  await p.goForward();
  await p.locator(".part-card").waitFor({ timeout: 5000 });
  assert(
    await p.locator(".part-card").isVisible(),
    "Forward should return to lesson",
  );
});
await test("Next card resets reading position", async (p) => {
  await p.goto(base);
  await lesson(p);
  await p.getByRole("button", { name: "Next part" }).click();
  await p.getByRole("button", { name: "Next part" }).scrollIntoViewIfNeeded();
  await p.getByRole("button", { name: "Next part" }).click();
  assert(
    await p.evaluate(() => scrollY < 100),
    "New card should begin at its heading instead of keeping the previous scroll position",
  );
});
await test("Absent speech API produces a friendly fallback", async (p) => {
  await p.addInitScript(() =>
    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      configurable: true,
    }),
  );
  await p.goto(base);
  await lesson(p);
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  assert.match(await p.locator(".part-card").innerText(), /unavailable/);
});
await test("Synchronous speech failure is recoverable", async (p) => {
  await p.addInitScript(() => {
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = () => {
      throw new Error("voice service unavailable");
    };
  });
  await p.goto(base);
  await lesson(p);
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  assert.match(await p.locator(".part-card").innerText(), /unavailable/);
  assert(
    await p
      .getByRole("button", { name: "Read aloud", exact: true })
      .isVisible(),
  );
});
await test("Stale speech callback cannot overwrite a new card", async (p) => {
  await p.addInitScript(() => {
    window.__voices = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (u) => window.__voices.push(u);
  });
  await p.goto(base);
  await lesson(p);
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  await p.evaluate(() => (window.__stale = window.__voices[0].onerror));
  await p.getByRole("button", { name: "Next part" }).click();
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  await p.evaluate(() => window.__stale?.({ error: "interrupted" }));
  await p.evaluate(() => new Promise(requestAnimationFrame));
  assert(
    await p.getByRole("button", { name: "Stop reading" }).isVisible(),
    "Old callback must not stop new narration",
  );
  assert.doesNotMatch(
    await p.locator(".part-card").innerText(),
    /voice is unavailable/,
  );
});
await test("Missing parish images fall back to inline SVG", async (p) => {
  await p.route("**/artwork/*.webp", (r) => r.abort());
  await p.goto(base);
  assert(
    await p.locator('.hero-art svg[role="img"]').isVisible(),
    "Home needs image fallback",
  );
  await lesson(p, 2);
  await p.locator('.part-art svg[role="img"]').waitFor();
  assert(
    await p.locator('.part-art svg[role="img"]').isVisible(),
    "Altar needs image fallback",
  );
});
await test("Cancelled or multi-touch gestures do not turn cards", async (p) => {
  await p.goto(base);
  await lesson(p);
  await p.locator(".part-card").evaluate((el) => {
    const touchEvent = (type, init) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, {
        touches: { value: init.touches || [] },
        changedTouches: { value: init.changedTouches || [] },
      });
      return event;
    };
    const t = (x, id = 1) => ({
      identifier: id,
      target: el,
      clientX: x,
      clientY: 400,
    });
    el.dispatchEvent(
      touchEvent("touchstart", { bubbles: true, touches: [t(300)] }),
    );
    el.dispatchEvent(touchEvent("touchcancel", { bubbles: true }));
    el.dispatchEvent(
      touchEvent("touchend", { bubbles: true, changedTouches: [t(100)] }),
    );
  });
  assert.match(
    await p.locator(".part-title").innerText(),
    /Entrance Procession/,
  );
  await p.locator(".part-card").evaluate((el) => {
    const touchEvent = (type, init) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, {
        touches: { value: init.touches || [] },
        changedTouches: { value: init.changedTouches || [] },
      });
      return event;
    };
    el.dispatchEvent(
      touchEvent("touchend", { bubbles: true, changedTouches: [] }),
    );
    const a = {
      identifier: 1,
      target: el,
      clientX: 300,
      clientY: 400,
    };
    const b = {
      identifier: 2,
      target: el,
      clientX: 290,
      clientY: 400,
    };
    el.dispatchEvent(
      touchEvent("touchstart", { bubbles: true, touches: [a, b] }),
    );
    el.dispatchEvent(
      touchEvent("touchend", {
        bubbles: true,
        changedTouches: [
          { identifier: 1, target: el, clientX: 100, clientY: 400 },
        ],
      }),
    );
  });
  assert.match(
    await p.locator(".part-title").innerText(),
    /Entrance Procession/,
  );
});
await test("Repeated quiz completion is idempotent, out-of-order sections work", async (p) => {
  await p.goto(base);
  for (let repeat = 0; repeat < 2; repeat++) {
    await lesson(p, 3);
    await p.getByRole("button", { name: "Next part" }).click();
    await p.getByRole("button", { name: "Mini quiz" }).click();
    for (const answer of [1, 0, 2]) {
      await p.locator(".answers button").nth(answer).click();
      await p.locator(".quiz-card .primary").evaluate((el) => {
        el.click();
        el.click();
        el.click();
      });
    }
    await p.evaluate(() => new Promise(requestAnimationFrame));
    assert.equal(
      await p.evaluate(() => document.activeElement?.tagName),
      "H1",
      "Completion should receive screen-reader focus",
    );
    await p.getByRole("button", { name: "See my sticker" }).click();
    assert.equal(await p.locator(".earned-sticker").count(), 1);
    await nav(p, "Home");
  }
  await nav(p, "Adventure Map");
  assert.equal(
    await p.locator(".map-art b").filter({ hasText: "★" }).count(),
    1,
  );
  assert.equal(
    await p.locator(".map-stop").nth(3).locator("b").innerText(),
    "★",
  );
});
await test("300 deterministic random navigation/card actions do not crash", async (p) => {
  await p.goto(base);
  let seed = 49291;
  for (let i = 0; i < 300; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const buttons = p.locator("button:visible:enabled");
    const n = await buttons.count();
    await buttons.nth(seed % n).click();
    await p.evaluate(() => new Promise(requestAnimationFrame));
    assert.equal(await p.locator("h1").count(), 1);
    assert(await p.locator("main").innerText());
  }
  assert.equal(
    await p.evaluate(() => localStorage.length + sessionStorage.length),
    0,
  );
});
await test("WCAG AA on narrow layout and navigation breakpoint", async (p) => {
  await p.goto(base);
  for (const width of [320, 701]) {
    await p.setViewportSize({ width, height: 900 });
    for (const name of [
      "Home",
      "Adventure Map",
      "Parent Corner",
      "Sticker Book",
    ]) {
      await nav(p, name);
      const r = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        r.violations.map((v) => v.id),
        [],
        `${name} @ ${width}`,
      );
    }
  }
});

await test("Cold production load has no failing assets, third-party requests, or storage", async (p) => {
  const failed = [];
  const requests = [];
  p.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  p.on("request", (r) => requests.push(r.url()));
  await p.goto(base);
  await p.locator(".parish-church-art").evaluate((img) => img.decode());
  await lesson(p, 2);
  await p.locator(".parish-altar-art").evaluate((img) => img.decode());
  assert.deepEqual(failed, []);
  assert(requests.every((url) => new URL(url).origin === new URL(base).origin));
  assert.equal(
    await p.evaluate(
      () =>
        document.cookie.length + localStorage.length + sessionStorage.length,
    ),
    0,
  );
});
await test("Speech error feedback recovers on retry", async (p) => {
  await p.addInitScript(() => {
    window.__voices = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (u) => window.__voices.push(u);
  });
  await p.goto(base);
  await lesson(p);
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  await p.evaluate(() => window.__voices[0].onerror({ error: "audio-busy" }));
  await p
    .locator('[role="status"]')
    .filter({ hasText: "unavailable" })
    .waitFor();
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  assert(await p.getByRole("button", { name: "Stop reading" }).isVisible());
  assert.doesNotMatch(await p.locator(".part-card").innerText(), /unavailable/);
});
await test("Swipe bounds remain valid under 40 rapid gestures", async (p) => {
  await p.goto(base);
  await lesson(p);
  const swipe = async (dx) => {
    await p.locator(".part-card").evaluate((el, dx) => {
      const touchEvent = (type, init) => {
        const event = new Event(type, { bubbles: true });
        Object.defineProperties(event, {
          touches: { value: init.touches || [] },
          changedTouches: { value: init.changedTouches || [] },
        });
        return event;
      };
      const a = {
        identifier: 1,
        target: el,
        clientX: 150,
        clientY: 400,
      };
      const b = {
        identifier: 1,
        target: el,
        clientX: 150 + dx,
        clientY: 400,
      };
      el.dispatchEvent(
        touchEvent("touchstart", { bubbles: true, touches: [a] }),
      );
      el.dispatchEvent(
        touchEvent("touchend", { bubbles: true, changedTouches: [b] }),
      );
    }, dx);
  };
  for (let i = 0; i < 20; i++) await swipe(100);
  assert.match(
    await p.locator(".part-title").innerText(),
    /Entrance Procession/,
  );
  for (let i = 0; i < 20; i++) await swipe(-100);
  assert.match(await p.locator(".part-title").innerText(), /Opening Prayer/);
  assert(await p.getByRole("button", { name: "Mini quiz" }).isVisible());
});

await test("Natural voice selection, asynchronous loading, preview, and visit-only preferences", async (p) => {
  await p.addInitScript(() => {
    window.__voices = [];
    window.__ready = false;
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (utterance) =>
      window.__voices.push(utterance);
    window.speechSynthesis.getVoices = () =>
      window.__ready
        ? [
            {
              voiceURI: "fred",
              name: "Fred",
              lang: "en-US",
              default: true,
              localService: true,
            },
            {
              voiceURI: "samantha",
              name: "Samantha (Enhanced)",
              lang: "en-US",
              default: false,
              localService: true,
            },
            {
              voiceURI: "arthur",
              name: "Arthur",
              lang: "en-GB",
              default: false,
              localService: true,
            },
            {
              voiceURI: "french",
              name: "French",
              lang: "fr-FR",
              default: false,
              localService: true,
            },
          ]
        : [];
  });
  await p.goto(base);
  await nav(p, "Parent Corner");
  assert.equal(
    await p.evaluate(() => window.__voices.length),
    0,
    "Never autoplay",
  );
  await p.evaluate(() => {
    window.__ready = true;
    window.speechSynthesis.dispatchEvent(new Event("voiceschanged"));
  });
  await p
    .locator("#narrator-voice option")
    .filter({ hasText: "Samantha" })
    .first()
    .waitFor({ state: "attached" });
  assert.match(
    await p.locator("#narrator-voice option").first().innerText(),
    /Samantha/,
  );
  assert.equal(
    await p.locator('#narrator-voice option[value="french"]').count(),
    0,
  );
  await p.getByRole("button", { name: "Listen to a preview" }).click();
  assert.equal(
    await p.evaluate(() => window.__voices.at(-1).voice.voiceURI),
    "samantha",
  );
  assert.equal(await p.evaluate(() => window.__voices.at(-1).rate), 0.95);
  await p.getByRole("button", { name: "Stop preview" }).click();
  await p.locator("#narrator-voice").selectOption("arthur");
  await nav(p, "Home");
  await lesson(p);
  await p.getByRole("button", { name: "Read aloud", exact: true }).click();
  assert.equal(
    await p.evaluate(() => window.__voices.at(-1).voice.voiceURI),
    "arthur",
  );
  assert.equal(await p.evaluate(() => window.__voices.at(-1).lang), "en-GB");
  await nav(p, "Parent Corner");
  assert.equal(await p.locator("#narrator-voice").inputValue(), "arthur");
  await p.reload();
  await nav(p, "Parent Corner");
  assert.equal(await p.locator("#narrator-voice").inputValue(), "");
});
await browser.close();
await writeFile(
  `stress-results-${engine}.json`,
  JSON.stringify({ url: base, results }, null, 2),
);
console.log(
  `${results.filter((r) => r.status === "PASS").length}/${results.length} passed`,
);
if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
