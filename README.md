# Mass Adventure

[Live app](https://ksantiagoBAH.github.io/mass-adventure/) · [GitHub repository](https://github.com/ksantiagoBAH/mass-adventure)

A clickable, mobile-first Catholic Mass learning mockup for ages 5–10. Built with Vite, React, TypeScript, and plain CSS. All 26 lessons, four sections, 12 quiz questions, glossary definitions, CCC references, and editable page copy live in `src/data/massParts.ts`.

## Run locally

Requires Node.js 22.12+ (or Node.js 20.19+), npm, and a modern browser.

```sh
npm install
npm run dev
```

Open the local address printed by Vite (normally http://127.0.0.1:5173). The server binds to loopback only.

```sh
npm run build
npm run preview
```

`build` checks TypeScript and produces a static production build in `dist/`. GitHub Pages publishes this build through `.github/workflows/deploy.yml`.

## Explore

- Home → Start → four-stop Adventure Map. Every stop is available immediately.
- Each section has swipeable illustrated lesson cards. Back/Next buttons work with touch and keyboard; larger screens also show a lesson list.
- Read aloud plays locally bundled neural-voice recordings and cancels when you change cards or screens. Browser SpeechSynthesis remains a fallback or an optional device voice. Audio never autoplays.
- Home includes a wide storybook church explorer with an ambo to the left of the altar. Tap seven numbered objects or their named labels to learn about the altar, ambo, candles, chalice, tabernacle (5), crucifix (6), and paten with a host (7), with optional recorded explanations.
- Greeting, First Reading, Second Reading, and Dismissal cards include “What do we say?” response practice. Listen to the cue, choose a response, retry with encouragement, or reset. It has no score, timer, or required completion.
- Selected lessons animate the objects in their own illustration: the Entrance procession arrives at an altar inside the church, Bible pages turn, sung responses glow, candle flames flicker, and Dismissal rays brighten. These scenes finish in under four seconds and have a Replay button. Other illustrations remain still.
- Sign of the Cross shows an original storybook child using their right hand: forehead, chest, left shoulder, right shoulder, then hands together. Next gesture, Play/Pause, and Start again let children follow at their own pace. Reduced-motion mode changes poses without tweening.
- Three questions per section. Incorrect choices in quizzes and response practice turn soft red; correct choices turn green. Helpful retry text also explains the result, so feedback does not rely on color alone. There is no score or penalty.
- Answer the three questions to finish the section, fill the map progress, earn a star and a sticker, and see confetti. Finishing again does not duplicate stickers.
- Open all seven different church explorer items to earn the fifth sticker, Church Explorer. Numbered markers and named labels count equally; revisiting an item does not add progress. The progress bar and earned sticker remain available across screens during the current visit and reset on reload, like the section stickers. No account or storage is used.
- Each collectible has its own original SVG medallion: parish friends around a heart, a Bible and heart, a chalice and host with wheat and grapes, a dove and olive branch, or a church with a compass and magnifying glass. Matching artwork appears when each reward is earned and in the Sticker Book.
- Sticker Book → tap an earned or unearned sticker to revisit that stop.
- Parent Corner contains a reference for every lesson, seasonal notes, Communion guidance, and parish review suggestions. Every CCC number links to the relevant official Vatican section; parent-facing links open in a new tab.

## Structure

- `src/data/massParts.ts`: educational content, section metadata, quizzes, glossary, references, and page copy.
- `src/App.tsx`: screen navigation and visit-only completion state.
- `src/components/Illustration.tsx`: original inline SVG church landscape and 13 reusable illustration motifs, used on every lesson. No external or licensed art.
- `src/components/PartCard.tsx`: accessible card, swipe handling, and read aloud.
- `src/components/Icon.tsx`: original inline SVG interface icons.
- `src/style.css`: responsive layout, palette, focus states, animations, and reduced-motion support.
- `public/fonts/`: locally hosted Nunito variable font, distributed under the included SIL Open Font License. No Google Fonts network requests.
- `public/audio/`: 26 lesson MP3s, one preview, four response cues, and seven church discoveries (38 total), generated offline with a warm AI voice. Provenance and license information are included. `src/generated/narration.json` connects clips to their exact source text.
- `public/artwork/`: two storybook illustrations created from your parish photographs with the built-in image generation tool. The church appears on Home; the altar appears on the Presentation of the Gifts card. The full generation prompts are saved in `public/artwork/README.md`; artwork paths and alt text are editable in `src/data/massParts.ts`.
- `screenshots/`: four captured key screens.
- `scripts/verify.mjs`: reproducible browser checks and screenshot capture.

## Accessibility and privacy

Semantic headings, labeled SVGs, visible focus states, skip link, keyboard-operable buttons, progress labels, live quiz feedback, and reduced-motion support. Automated WCAG A/AA checks cover phone screens and representative tablet/desktop screens. This is not a substitute for a manual assistive-technology audit. Tap controls are at least 44px tall. Decorative illustration colors do not convey essential information.

No backend, login, analytics, ads, cookies, form submission, or local/session storage. External links appear only in Parent Corner’s Catechism guide, labeled for grown-ups and marked as opening a new tab. The Vatican site is opened only when a parent follows a reference. Progress is React state only: refresh resets it. The web app requests only its local assets; optional SpeechSynthesis voice implementation is browser/OS-controlled. No speech recognition or microphone access.

## Browser verification

With the dev server running, and Google Chrome installed:

```sh
npm test
```

Checks all 26 lesson cards, all 12 questions (including retry feedback), four completions and earned stickers, map stars, reset on refresh, read-aloud text, keyboard activation, touch swipe, reduced motion, page errors, external requests, and horizontal overflow. Runs axe WCAG 2 A/AA and 2.1 AA checks and regenerates four screenshots. Chrome is used in an isolated headless profile. Tests stub speech playback to verify narration without audible speech.

## Catechism verification and pastoral review

CCC paragraph numbers were checked against the Holy See’s English Catechism on October 9, 2026. These references support doctrines/themes; the Catechism is not a detailed set of Mass rubrics. See `CONTENT_SOURCES.md` for verified passages, mapping, and relevant liturgical qualifications. The app paraphrases explanations and includes only brief familiar liturgical phrases, not full Missal prayers.

A priest or catechist should review the simplified explanation of the Real Presence (CCC 1374–1376), Eucharistic sacrifice (1367), repentance/confession, First Communion and worthy reception, seasonal omissions, and local posture and peace customs before parish/classroom use. The Eucharistic Prayer card introduces the overall prayer; Sanctus and Consecration cards unpack moments within it rather than implying separate rites.

## Narrator voices

The default is a warm, gently paced AI-generated narrator: Kokoro `af_heart`, recorded offline at 0.92× speed. All 26 lessons include their explanations, actions, and glossary terms. Parent Corner identifies the AI voice and offers a recorded preview, automatic device narration, and individual English device voices. Recordings work without SpeechSynthesis. Failed or outdated recordings fall back to current lesson text through the browser voice. The selected narrator applies to every lesson and resets on refresh. Audio does not autoplay; leaving a card or preview stops it. Voice settings stay in memory.

To regenerate after editing `src/data/massParts.ts`, install the authoring tool in an isolated folder (not an app dependency). Requires Node.js and FFmpeg on your PATH; first generation downloads the open neural model. Generation runs locally and needs no API key.

```sh
npm install --prefix /private/tmp/mass-adventure-narration kokoro-js@1.2.1
NARRATION_RUNTIME=/private/tmp/mass-adventure-narration node scripts/generate-narration.mjs
npm run build
```

Commit the new MP3s and generated manifest together. Unchanged clips are reused. Older hashed MP3s can be removed after confirming the manifest no longer references them. The app checks the exact text before playing a recording, so changes never silently play an old lesson. Listen to regenerated clips to review pronunciation and delivery.

With the production preview server running:

```sh
npm run test:narration
TEST_BROWSER=webkit npm run test:narration
npm run test:activities
TEST_BROWSER=webkit npm run test:activities
```

The narration suite checks that all 38 recordings match current content, decode with an audible and unclipped signal, and play on every card. It also tests lazy loading, stop/navigation, preview, completion, stale callbacks, failed-playback fallback, retry, absence of SpeechSynthesis, and same-origin requests. The activity suite tests every discovery and practice cue, gentle retry/correct feedback, keyboard use, resetting, touch gestures on controls, exclusive audio playback, scene replay, reduced motion, accessibility, and responsive layouts. These suites do not judge voice quality or pronunciation.

## Production stress tests

```sh
npm run build
npm run preview -- --port 4173
# In another terminal:
npm run test:stress
TEST_URL=http://127.0.0.1:4173 npm test
```

The stress suite tests 320–1440px layouts, browser history, scroll position, failed/missing speech services, late speech callbacks, failed artwork, cancelled/multi-touch gestures, repeated quiz completion, 300 deterministic random actions, WCAG AA checks, missing/external asset requests, privacy, swipe bounds, and voice preferences. It writes `stress-results-chrome.json`.

For a second engine, install Playwright WebKit and run:

```sh
npx playwright install webkit
TEST_BROWSER=webkit npm run test:stress
```

This writes `stress-results-webkit.json`. WebKit checks Safari-like engine behavior; it does not replace testing on real iPhones/iPads. The scripts stub speech in failure and selection tests. Actual voice quality needs a listening check on the intended device.

Browser Back/Forward now restores the previous app screen and lesson position. Artwork uses compressed WebP copies; original PNGs are retained. Failed artwork gracefully falls back to original inline SVG. See `TEST_REPORT.md` for findings and limits.

## GitHub Pages deployment

The public repository is `ksantiagoBAH/mass-adventure`. Pushes to `main` and manual workflow runs build the app with Node.js 22 and publish `dist/` using GitHub Actions. Actions are pinned to verified commit SHAs. Pages uses the GitHub Actions build source.

Vite uses a relative `base` and artwork uses `import.meta.env.BASE_URL`, so scripts, images, and fonts load correctly at `/mass-adventure/` and local development remains available at `/`. No app backend or secrets are required.

To publish a change:

```sh
npm run build
git add <changed-files>
git commit -m "Describe your change"
git push origin main
```

Check the Deploy Mass Adventure to GitHub Pages workflow in the repository’s Actions tab. GitHub Pages serves the app publicly; GitHub’s hosting infrastructure may process request logs even though the app contains no analytics or data collection.
