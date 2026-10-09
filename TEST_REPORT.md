# Mass Adventure test report

Tested October 9, 2026 against the compiled Vite production build on localhost:4173. This report covers the original request to stress-test the mockup and the follow-up request for more natural narration.

## Bugs found and fixed

| Finding | Fix |
| --- | --- |
| Browser Back/Forward did not follow in-app navigation | Added visit-only history entries with validated screen and lesson state |
| Moving to another card could retain the previous card’s scroll position | Reset reading position and focus on card changes |
| Speech API present-but-unavailable caused an exception | Guard capabilities and show a friendly fallback |
| A speech service throwing synchronously could leave the button stuck on Stop | Catch failures and restore the Read aloud button; permit retry |
| Failed parish artwork produced broken images | Fall back to original inline SVG illustrations |
| Cancelled/multi-touch gestures could change a lesson | Clear cancelled gestures and ignore multi-touch or empty touch endings |
| Safari/WebKit crashed under rapid navigation with a History API rate-limit error | Bound history writes to 60 per 10.5 seconds, coalesce excess writes, cancel pending writes on Back/Forward, and catch browser policy failures |

Further hardening: detach cancelled narration callbacks, ignore stale callbacks, avoid announcing deliberate cancellation as an error, announce audio errors only once, and move keyboard/screen-reader focus to quiz questions and completion messages.

## Narration improvement

All 26 lessons and the Parent Corner preview now have locally bundled MP3 recordings generated offline with Kokoro's `af_heart` neural voice at 0.92× speed. The default is this recorded narrator. Parent Corner identifies the AI voice and offers optional device voices. Recordings need no SpeechSynthesis API, backend, API key, microphone, or external audio request. Text matching prevents an outdated recording from playing after a lesson is edited.

`scripts/narration.mjs` passed in Chrome and WebKit: all 27 MP3s match the current source text, decode with audible signal and no clipped peaks, and every lesson plays its own recording. Checks cover no autoplay/prefetch, stop, navigation cancellation, preview, natural completion, late callbacks, playback rejection, browser fallback, retry, and playback with SpeechSynthesis absent. Existing device-voice preference and failure cases also passed. These automated checks verify media playback and file integrity; they do **not** judge pronunciation or subjective voice quality. Listen to Parent Corner’s preview and the liturgical terms on target devices.

## Parent reference links

Every CCC number in the Parent Corner guide now links to the corresponding official Vatican Catechism section. Sources cover all 26 lessons and were checked against the Vatican pages. Links have 44px tap targets, keyboard focus styles, new-tab labels, and `noopener noreferrer`. The guide explains that parents should find the specified paragraph on the linked section page. Lesson cards and other child-facing screens have no external links. The app does not load external pages until a reference is followed.

## Performance

Converted runtime artwork to WebP, retaining the PNG originals:

- Church: approximately 2.7 MB PNG → 338 KB WebP.
- Altar: approximately 2.4 MB PNG → 243 KB WebP.
- Combined runtime artwork: about 89% smaller, with no external image requests.

## Verification

The reproducible suites are `scripts/verify.mjs` and `scripts/stress.mjs`. Final results: **15/15 stress groups pass in Chrome and 15/15 pass in WebKit**. Machine-readable results are saved separately in `stress-results-chrome.json` and `stress-results-webkit.json`. Tests cover:

- All 26 lesson cards, all 12 quiz questions including retry feedback, four section completions, map stars, stickers, and refresh reset.
- 15 stress groups per browser engine, including 300 seeded random actions, 40 rapid swipes, cancelled/multi-touch gestures, out-of-order completion, repeated taps, and browser Back/Forward.
- Layout widths 320, 360, 390, 600, 700, 701, 768, 820, 1024, and 1440px.
- Automated WCAG A/AA checks with axe on representative screens and boundary widths, keyboard activation, reduced motion, narration parameters, and completion focus.
- Missing artwork, absent and failing speech APIs, stale callbacks, asynchronous voices, voice preference reset, loaded assets, browser errors, third-party requests, cookies, and local/session storage.
- Production TypeScript/Vite build.
- npm vulnerability audit: zero known vulnerabilities reported at test time.

WebKit touch-handler tests use portable synthetic touch event payloads because that engine does not allow constructing native Touch objects. They verify handler behavior, not actual touchscreen hardware.

## Remaining release checks

- Listen to narration on real iPhones, iPads, and Android devices; check the installed voice options and pronunciation of liturgical terms.
- Manually check VoiceOver/TalkBack, browser zoom, and actual touchscreen swiping.
- Obtain the priest/catechist review described in `CONTENT_SOURCES.md`.
- When hosting is selected, check that host’s HTTPS, caching, and security headers. This local test does not verify a deployment.

Passing automated tests is useful evidence, not a blanket claim that the app is production-ready on every device.

## GitHub Pages verification

Published at https://ksantiagobah.github.io/mass-adventure/ on October 9, 2026. The initial GitHub Actions build and deployment completed successfully. GitHub Pages reports HTTPS enforced. The complete `scripts/verify.mjs` suite passed against the live HTTPS site, including all 26 cards, 12 quiz questions, four completions, artwork/font loading, responsive checks, narration handling, accessibility checks, and absence of third-party app requests. Screenshots were refreshed from the live site. This verifies deployment; the manual device, listening, and pastoral checks above still apply.
