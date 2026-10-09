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
- Read aloud uses the browser SpeechSynthesis API and cancels when you change cards or screens. Available voices and actual playback depend on your browser/OS. Speech text is tested; listen on your target device before classroom use. There is a friendly message when speech is unavailable.
- Three questions per section. Incorrect choices get a helpful hint and can be retried; no score or penalty.
- Answer the three questions to finish the section, fill the map progress, earn a star and a sticker, and see confetti. Finishing again does not duplicate stickers.
- Sticker Book → tap an earned or unearned sticker to revisit that stop.
- Parent Corner contains a reference for every lesson, seasonal notes, Communion guidance, and parish review suggestions.

## Structure

- `src/data/massParts.ts`: educational content, section metadata, quizzes, glossary, references, and page copy.
- `src/App.tsx`: screen navigation and visit-only completion state.
- `src/components/Illustration.tsx`: original inline SVG church landscape and 13 reusable illustration motifs, used on every lesson. No external or licensed art.
- `src/components/PartCard.tsx`: accessible card, swipe handling, and read aloud.
- `src/components/Icon.tsx`: original inline SVG interface icons.
- `src/style.css`: responsive layout, palette, focus states, animations, and reduced-motion support.
- `public/fonts/`: locally hosted Nunito variable font, distributed under the included SIL Open Font License. No Google Fonts network requests.
- `public/artwork/`: two storybook illustrations created from your parish photographs with the built-in image generation tool. The church appears on Home; the altar appears on the Presentation of the Gifts card. The full generation prompts are saved in `public/artwork/README.md`; artwork paths and alt text are editable in `src/data/massParts.ts`.
- `screenshots/`: four captured key screens.
- `scripts/verify.mjs`: reproducible browser checks and screenshot capture.

## Accessibility and privacy

Semantic headings, labeled SVGs, visible focus states, skip link, keyboard-operable buttons, progress labels, live quiz feedback, and reduced-motion support. Automated WCAG A/AA checks cover phone screens and representative tablet/desktop screens. This is not a substitute for a manual assistive-technology audit. Tap controls are at least 44px tall. Decorative illustration colors do not convey essential information.

No backend, login, analytics, ads, cookies, form submission, or local/session storage. There are no external links in the app. Progress is React state only: refresh resets it. The web app requests only its local assets; SpeechSynthesis voice implementation is browser/OS-controlled. No speech recognition or microphone access.

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

Parent Corner now includes an English voice picker and a spoken preview. The app prefers voice names marked Natural, Neural, Premium, or Enhanced and uses a conversational 0.95× pace with normal pitch. This is a best-effort choice among browser/device voices, not a guarantee of studio-quality narration. English voices can arrive asynchronously, so the app listens for `voiceschanged`. The selected voice applies to every lesson and resets on refresh. Audio does not autoplay; leaving a card or preview stops it. Voice settings stay in memory.

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
