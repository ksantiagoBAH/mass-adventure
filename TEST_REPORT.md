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

Parent Corner now has an English voice picker and spoken preview. Automatic selection prefers natural/neural/enhanced/premium voices when offered, avoids novelty voices as the default, and uses a 0.95× conversational pace with normal pitch. Voice availability updates asynchronously. A parent’s selection applies to all cards for the current visit and resets on refresh. No audio autoplays.

Voice preference, preview parameters, cancellation, asynchronous voice loading, fallback, errors, and retry are tested with controlled speech stubs. Headless Chrome did not expose real English voices on this host, so these checks do **not** confirm audible playback or subjective voice quality. Use Parent Corner’s preview on the intended device. A prerecorded narrator would provide consistent voice quality across devices and still work as static local assets.

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
