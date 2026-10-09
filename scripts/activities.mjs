import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://127.0.0.1:4173/";
const browser = process.env.TEST_BROWSER === "webkit" ? await webkit.launch() : await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const page = await context.newPage();
const errors = [], requests = [];
page.on("pageerror", e => errors.push(e.message));
page.on("request", r => requests.push(r.url()));
await page.addInitScript(() => {
  window.__audios = [];
  const NativeAudio = window.Audio;
  window.Audio = function (...args) { const a = new NativeAudio(...args); window.__audios.push(a); return a; };
});
const nav = async name => page.getByRole("button", { name, exact: true }).filter({ visible: true }).first().click();
const audioPlaying = () => page.waitForFunction(() => window.__audios.at(-1)?.currentTime > 0);
const axe = async label => {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) })), [], label);
};
await page.goto(base);
assert.equal(await page.evaluate(() => window.__audios.length), 0);
await axe("Home explorer accessibility");
assert(await page.locator('.explorer-art').evaluate(img => img.complete && img.naturalWidth > img.naturalHeight), "Expanded sanctuary image loads in landscape");
assert.equal(await page.locator('.explorer-hotspot').count(), 7);
await page.locator('.explorer-legend').getByRole('button', { name: 'Ambo', exact: true }).click();
assert.equal(await page.locator('.explorer-discovery h3').innerText(), 'Ambo', "Named labels select discoveries");
for (const [i, name] of ["Altar", "Ambo", "Candles", "Chalice", "Tabernacle", "Crucifix", "Paten"].entries()) {
  const hotspot = page.getByRole("button", { name: `${i + 1}. ${name}`, exact: true });
  await hotspot.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".explorer-discovery h3").innerText(), name);
  assert.equal(await page.locator('.explorer-hotspot[aria-pressed="true"]').count(), 1);
  assert(await page.evaluate(() => window.__audios.every(a => a.paused)), "Changing discovery cancels prior audio");
  await nav("Listen to this discovery");
  await audioPlaying();
  assert((await page.evaluate(() => window.__audios.at(-1).src)).includes(`explorer-${name.toLowerCase()}-`));
}
await nav("Stop discovery");
await page.locator(".church-explorer").screenshot({ path: "screenshots/06-church-explorer.png" });
for (const width of [320, 390, 820, 1440]) {
  await page.setViewportSize({ width, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Explorer width ${width}`);
  const spots = await page.locator('.explorer-hotspot').evaluateAll(nodes => nodes.map(n => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }));
  for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++) {
    const a = spots[i], b = spots[j];
    assert(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, `Hotspots do not overlap at ${width}px`);
  }
}
await page.setViewportSize({ width: 390, height: 844 });
console.log("PASS seven discoveries: keyboard, audio, cancellation, selected state, responsive layout, accessibility");
await nav("Start the Mass Adventure");
await page.locator(".map-stop").first().click();
assert.equal(await page.locator(".scene-details").count(), 0, "No unrelated illustration overlays");
await page.locator(".entrance-procession").evaluate(svg => svg.getAnimations({ subtree: true }).forEach(a => a.finish()));
await page.locator(".part-art").screenshot({ path: "screenshots/08-entrance-procession.png" });
await nav("Next part");
await axe("Sign of the Cross person accessibility");
assert.equal(await page.locator(".cross-right-hand").getAttribute("data-step"), "0");
for (const [step, point] of [[1, { x: 130, y: 140 }], [2, { x: 160, y: 115 }], [3, { x: 100, y: 115 }], [4, { x: 130, y: 153 }]]) {
  await nav("Next gesture");
  await page.waitForFunction(({ x, y }) => {
    const hand = document.querySelector(".cross-right-hand circle");
    return Number(hand.getAttribute("cx")) === x && Number(hand.getAttribute("cy")) === y;
  }, point);
  assert.equal(await page.locator(".cross-right-hand").getAttribute("data-step"), String(step));
  if (step === 2) await page.locator(".part-art").screenshot({ path: "screenshots/09-sign-of-cross.png" });
}
assert(await page.getByRole("button", { name: "Next gesture", exact: true }).isDisabled());
await nav("Start again"); await nav("Play the gestures");
await page.locator(".gesture-caption strong").filter({ hasText: "2. Chest" }).waitFor();
await nav("Pause gestures");
const pausedHand = await page.locator(".cross-right-hand circle").getAttribute("cy");
await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 900)));
assert.equal(await page.locator(".cross-right-hand circle").getAttribute("cy"), pausedHand, "Pause freezes movement");
await page.emulateMedia({ reducedMotion: "reduce" });
await nav("Next gesture");
await page.waitForFunction(() => {
  const hand = document.querySelector(".cross-right-hand circle");
  return hand.getAttribute("cx") === "160" && hand.getAttribute("cy") === "115";
});
await page.emulateMedia({ reducedMotion: "no-preference" });
console.log("PASS interior procession, five accurate right-hand gestures, pause, reset, and reduced motion");
await nav("Next part");
await axe("Greeting activity accessibility");
await nav("Hear the words"); await audioPlaying();
assert((await page.evaluate(() => window.__audios.at(-1).src)).includes("response-greeting-"));
const cueAudio = await page.evaluate(() => window.__audios.length - 1);
await nav("Read aloud"); await audioPlaying();
assert(await page.evaluate(i => window.__audios[i].paused, cueAudio), "Lesson and response audio never overlap");
await nav("Stop reading");
await page.locator(".response-options button").first().click();
assert.match(await page.locator(".response-feedback").innerText(), /Let’s discover together/);
assert.equal(await page.locator('.response-options button[aria-pressed="true"]').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 240, 237)', 'Incorrect response is red, not green');
await axe('Incorrect response contrast and accessibility');
await page.locator('.response-practice').screenshot({ path: 'screenshots/10-response-retry.png' });
const right = page.locator(".response-options button").nth(1);
await right.focus(); await page.keyboard.press("Space");
await page.locator(".response-feedback").filter({ hasText: "Yes!" }).waitFor();
assert.equal(await right.getAttribute("aria-pressed"), "true");
assert.equal(await right.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(227, 239, 217)', 'Correct response is green');
await page.locator(".response-practice").screenshot({ path: "screenshots/07-response-practice.png" });

// A horizontal gesture on an activity control must not accidentally turn a card.
await right.evaluate(el => {
  for (const [type, init] of [["touchstart", { touches: [{ clientX: 180, clientY: 200 }] }], ["touchend", { changedTouches: [{ clientX: 50, clientY: 200 }], touches: [] }]]) {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, { touches: { value: init.touches || [] }, changedTouches: { value: init.changedTouches || [] } });
    el.dispatchEvent(event);
  }
});
assert.equal(await page.locator(".part-title h2").innerText(), "Greeting");
await nav("Practice again");
assert.equal(await page.locator(".response-feedback").innerText(), "");
await nav("Next part"); await nav("Back");
assert.equal(await page.locator(".response-feedback").innerText(), "", "Activity resets when revisited");
console.log("PASS response retry, correct feedback, keyboard, reset, swipe isolation, and exclusive narration");

await nav("Adventure Map");
await page.locator(".map-stop").nth(1).click();
await nav("Hear the words"); await audioPlaying();
assert((await page.evaluate(() => window.__audios.at(-1).src)).includes("response-first-"));
await page.locator(".response-options button").first().click();
assert.match(await page.locator(".response-feedback").innerText(), /Yes!/);
await nav("Next part"); await nav("Next part");
assert(await page.evaluate(() => window.__audios.every(a => a.paused)));
await nav("Hear the words"); await audioPlaying();
assert((await page.evaluate(() => window.__audios.at(-1).src)).includes("response-second-"));
await page.locator(".response-options button").nth(2).click();
assert.match(await page.locator(".response-feedback").innerText(), /Yes!/);
await nav("Adventure Map");
await page.locator(".map-stop").nth(3).click(); await nav("Next part");
await nav("Hear the words"); await audioPlaying();
assert((await page.evaluate(() => window.__audios.at(-1).src)).includes("response-dismissal-"));
await page.locator(".response-options button").nth(1).click();
assert.match(await page.locator(".response-feedback").innerText(), /Thanks be to God/);
await nav("Stop listening");
await nav("Replay scene");
assert.notEqual(await page.locator(".sun-rays").evaluate(el => getComputedStyle(el).animationName), "none");
await page.emulateMedia({ reducedMotion: "reduce" });
assert.equal(await page.locator(".sun-rays").evaluate(el => getComputedStyle(el).animationName), "none");
await nav("Adventure Map"); await page.locator(".map-stop").nth(2).click(); await nav("Next part");
assert.equal(await page.locator(".altar-flames").evaluate(el => getComputedStyle(el).animationName), "none");
await page.emulateMedia({ reducedMotion: "no-preference" }); await nav("Replay scene");
assert.notEqual(await page.locator(".altar-flames").evaluate(el => getComputedStyle(el).animationName), "none");
for (const width of [320, 390, 820, 1440]) {
  await page.setViewportSize({ width, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Scene width ${width}`);
}
assert.deepEqual(errors, []);
assert(requests.every(url => new URL(url).origin === new URL(base).origin));
assert.equal(await page.evaluate(() => document.cookie.length + localStorage.length + sessionStorage.length), 0);
console.log("PASS all four practice cues, scene replay, reduced motion, no external requests or storage");
await browser.close();
