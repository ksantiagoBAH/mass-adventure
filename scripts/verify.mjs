import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const external = [];
page.on("request", (r) => {
  if (!r.url().startsWith(base)) external.push(r.url());
});
await page.goto(base);
await page.evaluate(() => document.fonts.ready);
async function check(label) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    result.violations.map((v) => ({
      id: v.id,
      description: v.description,
      nodes: v.nodes.map((n) => n.html),
    })),
    [],
    label + " accessibility",
  );
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    label + " fits viewport",
  );
  console.log("PASS", label);
}
await check("home 390px");
await page.screenshot({ path: "screenshots/01-home-mobile.png" });
await page.getByRole("button", { name: "Start the Mass Adventure" }).click();
await check("map");
await page.setViewportSize({ width: 390, height: 1180 });
await page.screenshot({ path: "screenshots/02-adventure-map.png" });
await page.setViewportSize({ width: 390, height: 844 });
const sectionNames = [
  "Gathering",
  "Listening",
  "Sharing the Gift",
  "Going Out",
];
const counts = [6, 8, 10, 2];
const answers = [
  [0, 1, 2],
  [0, 1, 2],
  [0, 1, 2],
  [1, 0, 2],
];
await page.evaluate(() => {
  // This suite checks the device fallback's text; narration.mjs exercises MP3s.
  window.Audio = undefined;
  window.__utterances = [];
  window.speechSynthesis.speak = (u) =>
    window.__utterances.push({ text: u.text, rate: u.rate });
  window.speechSynthesis.cancel = () => {};
});
for (let s = 0; s < 4; s++) {
  await page.locator(".map-stop").nth(s).click();
  await check(sectionNames[s] + " lesson");
  for (let c = 0; c < counts[s]; c++) {
    assert.equal(
      await page.locator('.part-card [role="img"], .part-card img').count(),
      1,
    );
    assert.match(await page.locator(".part-body details").innerText(), /CCC/);
    await page.getByRole("button", { name: "Read aloud", exact: true }).click();
    assert(
      await page.evaluate(() =>
        window.__utterances.at(-1).text.includes("What is happening?"),
      ),
    );
    await page
      .getByRole("button", { name: "Stop reading", exact: true })
      .click();
    if (s === 2 && c === 4) {
      assert.match(
        await page.locator(".part-card").innerText(),
        /Body, Blood, soul, and divinity/,
      );
      await page.setViewportSize({ width: 390, height: 1380 });
      await page.screenshot({ path: "screenshots/03-consecration-card.png" });
      await page.setViewportSize({ width: 390, height: 844 });
    }
    if (c < counts[s] - 1)
      await page.getByRole("button", { name: "Next part" }).click();
    else await page.getByRole("button", { name: "Mini quiz" }).click();
  }
  await check(sectionNames[s] + " quiz");
  for (let j = 0; j < 3; j++) {
    await page
      .locator(".answers button")
      .nth((answers[s][j] + 1) % 3)
      .click();
    assert.match(
      await page.locator(".feedback").innerText(),
      /Let’s discover together/,
    );
    assert.equal(await page.locator('.answers button.chosen').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 240, 237)', 'Wrong quiz answer is red');
    if (j === 0) await check(sectionNames[s] + ' quiz retry contrast');
    await page.locator(".answers button").nth(answers[s][j]).click();
    assert.match(await page.locator(".feedback").innerText(), /Lovely/);
    await page
      .getByRole("button", {
        name: j === 2 ? "Collect my sticker" : "Next question",
      })
      .click();
  }
  await check(sectionNames[s] + " completed");
  await page.getByRole("button", { name: "See my sticker" }).click();
  assert.equal(await page.locator(".earned-sticker").count(), s + 1);
  await check("stickers " + (s + 1));
  if (s === 3)
    await page.screenshot({ path: "screenshots/04-sticker-book.png" });
  await page.getByRole("button", { name: "Keep exploring" }).click();
  assert.equal(
    await page.locator(".map-art b").filter({ hasText: "★" }).count(),
    s + 1,
  );
}
await page.getByRole('button', { name: 'Home', exact: true }).first().click();
for (let i = 0; i < 7; i++) await page.locator('.explorer-hotspot').nth(i).click();
await page.getByRole('button', { name: 'See my sticker', exact: true }).click();
assert.equal(await page.locator('.earned-sticker').count(), 5, 'All five rewards coexist');
const designs = await page.locator('.sticker-artwork').evaluateAll(images => images.map(svg => [...svg.querySelectorAll('path')].map(path => path.getAttribute('d')).join('|')));
assert.equal(new Set(designs).size, 5, 'Every sticker has distinct artwork geometry');
await check('All five illustrated stickers');
await page.setViewportSize({ width: 1120, height: 900 });
await check('All five illustrated stickers desktop');
await page.screenshot({ path: 'screenshots/12-sticker-collection.png', fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page
  .getByRole("button", { name: "Parent Corner", exact: true })
  .last()
  .click();
await check("parents");
assert.equal(await page.locator("dt").count(), 26);
assert.equal(await page.locator('.reference-group dd > span').count(), 0, "Every CCC reference has a mapped link");
const parentLinks = await page.locator('.reference-group dd a').evaluateAll(links =>
  links.map(link => ({ href: link.href, target: link.target, rel: link.rel, label: link.getAttribute("aria-label"), height: link.getBoundingClientRect().height })),
);
assert(parentLinks.length >= 26);
for (const link of parentLinks) {
  assert(link.href.startsWith("https://www.vatican.va/content/catechism/en/"));
  assert.equal(link.target, "_blank");
  assert.match(link.rel, /noopener/);
  assert.match(link.rel, /noreferrer/);
  assert.match(link.label, /opens in a new tab/);
  assert(link.height >= 44);
}
await page.setViewportSize({ width: 820, height: 1180 });
await check("parents tablet");
await page.getByRole("button", { name: "Home", exact: true }).first().click();
await check("home tablet");
await page.setViewportSize({ width: 1440, height: 1050 });
await check("home desktop");
await page.screenshot({
  path: "/private/tmp/mass-adventure-desktop.png",
  fullPage: true,
});
await page.reload();
await page
  .getByRole("button", { name: "Sticker Book", exact: true })
  .first()
  .click();
assert.equal(await page.locator(".earned-sticker").count(), 0);
// Keyboard activation, touch swipe, and reduced-motion styling.
await page
  .getByRole("button", { name: "Adventure Map", exact: true })
  .first()
  .focus();
await page.keyboard.press("Enter");
assert(await page.locator(".adventure-path").isVisible());
await page.locator(".map-stop").first().click();
await page.locator(".part-card").evaluate((el) => {
  const start = new Touch({
    identifier: 1,
    target: el,
    clientX: 300,
    clientY: 400,
  });
  const end = new Touch({
    identifier: 1,
    target: el,
    clientX: 100,
    clientY: 405,
  });
  el.dispatchEvent(
    new TouchEvent("touchstart", { bubbles: true, touches: [start] }),
  );
  el.dispatchEvent(
    new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }),
  );
});
assert.match(
  await page.locator(".part-title h2").innerText(),
  /Sign of the Cross/,
);
assert.equal(
  await page.evaluate(
    () =>
      getComputedStyle(document.querySelector(".primary")).transitionDuration,
  ),
  "0s",
);
assert.equal(
  await page.evaluate(() => localStorage.length + sessionStorage.length),
  0,
);
assert.deepEqual(external, []);
assert.deepEqual(errors, []);
console.log(
  "PASS all 26 cards, 12 quiz questions, 4 completions, read-aloud text, keyboard, swipe, reduced motion, privacy, and four screenshots",
);
await browser.close();
