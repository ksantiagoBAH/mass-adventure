import { chromium, webkit } from "playwright";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const base = process.env.TEST_URL || "http://127.0.0.1:4173/";
const source = (await readFile(new URL("../src/data/massParts.ts", import.meta.url), "utf8"))
  .replaceAll("import.meta.env.BASE_URL", '"./"');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { sections, getNarrationText, narratorCopy, responsePractice, churchDiscoveries } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const manifest = JSON.parse(await readFile(new URL("../src/generated/narration.json", import.meta.url), "utf8"));
const expected = [{ id: "preview", text: narratorCopy.sample },
  ...sections.flatMap(s => s.parts.map(p => ({ id: p.id, text: getNarrationText(p) }))),
  ...Object.entries(responsePractice).map(([id, practice]) => ({ id: `response-${id}`, text: practice.cue })),
  ...churchDiscoveries.map(item => ({ id: `explorer-${item.id}`, text: item.text }))];
assert.equal(Object.keys(manifest).length, expected.length);
for (const clip of expected) assert.equal(manifest[clip.id]?.text, clip.text, `Current text: ${clip.id}`);
const browser = process.env.TEST_BROWSER === "webkit"
  ? await webkit.launch() : await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const page = await context.newPage();
const errors = [];
const requests = [];
page.on("pageerror", e => errors.push(e.message));
page.on("request", r => requests.push(r.url()));
await page.addInitScript(() => {
  window.__audios = [];
  window.__utterances = [];
  const NativeAudio = window.Audio;
  window.Audio = function (...args) {
    const audio = new NativeAudio(...args);
    window.__audios.push(audio);
    return audio;
  };
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = u => window.__utterances.push(u);
  }
});
await page.goto(base);
assert.equal(await page.evaluate(() => window.__audios.length), 0, "No autoplay or prefetch");
assert.equal(requests.filter(url => url.includes("/audio/")).length, 0, "Lazy audio requests");

// Decode every shipped MP3 in the browser; check duration and audible signal.
const decoded = await page.evaluate(async manifest => {
  const ctx = new AudioContext();
  const result = [];
  try {
    for (const [id, clip] of Object.entries(manifest)) {
      const response = await fetch(new URL(clip.file, location.href));
      if (!response.ok) throw new Error(`Missing audio: ${id}`);
      const audio = await ctx.decodeAudioData(await response.arrayBuffer());
      const samples = audio.getChannelData(0);
      let squareSum = 0, peak = 0;
      for (const sample of samples) { squareSum += sample * sample; peak = Math.max(peak, Math.abs(sample)); }
      result.push({ id, duration: audio.duration, rms: Math.sqrt(squareSum / samples.length), peak });
    }
  } finally { await ctx.close(); }
  return result;
}, manifest);
for (const clip of decoded) {
  assert(clip.duration > 3 && clip.duration < 120, `Duration: ${clip.id}`);
  assert(clip.rms > 0.005 && clip.peak < 1, `Audible, unclipped recording: ${clip.id}`);
}
console.log(`PASS ${expected.length} current recordings decode with audible, unclipped signal`);
await page.getByRole("button", { name: "Start the Mass Adventure" }).click();
for (let s = 0; s < sections.length; s++) {
  await page.locator(".map-stop").nth(s).click();
  for (let i = 0; i < sections[s].parts.length; i++) {
    const part = sections[s].parts[i];
    await page.getByRole("button", { name: "Read aloud", exact: true }).click();
    await page.waitForFunction(() => window.__audios.at(-1)?.currentTime > 0);
    assert.match(await page.evaluate(() => window.__audios.at(-1).src), new RegExp(manifest[part.id].file));
    const index = await page.evaluate(() => window.__audios.length - 1);
    if (i === 0 && s === 0) {
      await page.getByRole("button", { name: "Stop reading", exact: true }).click();
      assert(await page.evaluate(i => window.__audios[i].paused, index));
      await page.getByRole("button", { name: "Read aloud", exact: true }).click();
      await page.waitForFunction(() => window.__audios.at(-1)?.currentTime > 0);
    }
    if (i < sections[s].parts.length - 1) await page.getByRole("button", { name: "Next part" }).click();
    else await page.getByRole("button", { name: "Adventure Map", exact: true }).filter({ visible: true }).first().click();
    assert(await page.evaluate(() => window.__audios.every(audio => audio.paused)), "Navigation stops audio");
  }
}
assert.equal(await page.evaluate(() => window.__utterances.length), 0, "Recordings are the default");
await page.getByRole("button", { name: "Parent Corner", exact: true }).filter({ visible: true }).first().click();
await page.getByRole("button", { name: "Listen to a preview" }).click();
await page.waitForFunction(() => window.__audios.at(-1)?.currentTime > 0);
await page.getByRole("button", { name: "Stop preview" }).click();
console.log("PASS every lesson plays its own MP3; stop, navigation, preview, and no autoplay");

// Deterministic late callbacks and rejected play() promises.
await page.reload();
await page.evaluate(() => {
  window.__fakeAudios = [];
  window.Audio = class {
    constructor() { window.__fakeAudios.push(this); }
    play() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
    pause() { this.paused = true; }
    removeAttribute() {}
    load() {}
  };
});
await page.getByRole("button", { name: "Start the Mass Adventure" }).click();
await page.locator(".map-stop").first().click();
await page.getByRole("button", { name: "Read aloud", exact: true }).click();
await page.evaluate(() => { window.__lateEnded = window.__fakeAudios[0].onended; });
await page.getByRole("button", { name: "Next part" }).click();
await page.getByRole("button", { name: "Read aloud", exact: true }).click();
await page.evaluate(() => {
  window.__lateEnded();
  window.__fakeAudios[0].reject(new Error("late failure"));
});
assert(await page.getByRole("button", { name: "Stop reading" }).isVisible());
assert.equal(await page.evaluate(() => window.__utterances.length), 0);
await page.evaluate(() => window.__fakeAudios[1].reject(new Error("audio unavailable")));
try {
  await page.waitForFunction(() => window.__utterances.length === 1);
} catch (error) {
  console.error(await page.evaluate(() => ({
    utterances: window.__utterances.map(u => u.text),
    speechAPI: typeof window.speechSynthesis,
    speechConstructor: typeof window.SpeechSynthesisUtterance,
    fakeAudios: window.__fakeAudios.length,
    body: document.querySelector(".part-card")?.innerText,
  })));
  throw error;
}
await page.locator('.part-card [role="status"]').filter({ hasText: "device’s voice" }).waitFor();
assert.match(await page.locator(".part-card").innerText(), /device’s voice/);
await page.getByRole("button", { name: "Stop reading" }).click();
await page.getByRole("button", { name: "Read aloud", exact: true }).click();
await page.evaluate(() => window.__fakeAudios.at(-1).onended());
await page.getByRole("button", { name: "Read aloud", exact: true }).waitFor();
assert(await page.getByRole("button", { name: "Read aloud", exact: true }).isVisible());
console.log("PASS late end/error callbacks, rejected playback fallback, retry, and natural completion");

// Recordings work even without a browser speech API.
await page.addInitScript(() => Object.defineProperty(window, "speechSynthesis", { value: undefined, configurable: true }));
await page.reload();
await page.getByRole("button", { name: "Start the Mass Adventure" }).click();
await page.locator(".map-stop").first().click();
await page.getByRole("button", { name: "Read aloud", exact: true }).click();
await page.waitForFunction(() => window.__audios.at(-1)?.currentTime > 0);
assert.doesNotMatch(await page.locator(".part-card").innerText(), /unavailable/);
assert.deepEqual(errors, []);
assert(requests.every(url => new URL(url).origin === new URL(base).origin));
assert.equal(await page.evaluate(() => document.cookie.length + localStorage.length + sessionStorage.length), 0);
console.log("PASS no speech API required, no external requests, storage, microphone, or browser errors");
await browser.close();
