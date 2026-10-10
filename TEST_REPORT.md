# Mass Adventure test report

## Release verification — October 9, 2026

All five collectibles now have distinct original SVG medallions in
`StickerArtwork.tsx`, with descriptive alternative text in the single data
file. Build and activity checks passed; the full quiz/reward suite checks
that all five rewards coexist and all five SVG drawings have different
geometry, plus WCAG AA checks for the complete collection. The gallery is
saved as `screenshots/12-sticker-collection.png`.

The Church Explorer reward adds a fifth sticker for opening all seven
unique sanctuary discoveries. The production build, full lesson/quiz
suite, and Chrome/WebKit activity suites passed. Reward checks cover locked state,
six-item boundary, numbered and named controls, duplicate taps, retention
across screens, focus when reopening from the book, no repeated celebration,
WCAG AA checks, and visit-only reset without storage. Updated screenshots
include `screenshots/11-explorer-sticker.png`.

Follow-up correction: incorrect selected answers now have soft red
backgrounds and red borders in both response practice and quizzes;
correct choices remain green. Retry text and a response retry symbol
provide feedback beyond color. Build, interaction checks, all 12 quiz
retry paths, and WCAG AA checks in retry states passed locally. The new
screenshot is `screenshots/10-response-retry.png`.

The release includes seven sanctuary discoveries, including 7 · Paten with
a host, recorded discovery narration, four response activities, the
storybook Sign of the Cross person, accurate part-specific animation,
and reference-matched heart-shaped tabernacles. The production build,
seven-discovery activity suite, and all 38 recording checks passed on the
compiled localhost:4173 preview. The full 26-card/12-question accessibility
suite passed after the reference-matched altar update. The user authorized
the GitHub push and Pages deployment after local review.

## Local interactive preview — October 9, 2026

The sanctuary explorer now uses an expanded storybook image with an ambo on
the left, six numbered discoveries with tappable named labels, including
5 · Tabernacle and 6 · Crucifix. The production build and Chrome activity suite
passed against localhost:5173 after this change. Checks include landscape
artwork loading, named-label selection, accessibility, narration, and
non-overlapping 44px discovery markers at 320, 390, 820, and 1440px widths.
The refreshed explorer screenshot is `screenshots/06-church-explorer.png`.
The six-discovery update also passed the Chrome activity and narration
suites on localhost:5173: all 37 clips decode, the two new discovery clips
play, all six markers respond to keyboard input, and none overlap at the
four tested viewport widths. The production build passed.
The tabernacle door's artwork now shows a gold heart with a decorative
flame above it; marker 5 sits to the left to reveal the detail. The build and
six-discovery activity suite passed again after this artwork update.
The subsequent reference-photo correction replaces that box-shaped
tabernacle in both the explorer and lesson altar illustrations with the
parish's gold heart-shaped tabernacle, red-and-gold sculpted flame, silver
rays, and black plinth. Visual review, production build, six-discovery
activity suite, and the full 26-card/12-question accessibility suite passed
locally after this correction. Marker 5 points to the silver frame without
covering the heart.

This update was developed and tested locally before the user authorized
publication. It adds four narrated response practices,
a seven-object church explorer, and short replayable scenes for selected parts.
The Entrance scene shows a procession arriving at an altar inside the church.
The Sign of the Cross has a storybook child with five poses, manual step
controls, Play/Pause, reset, and reduced-motion support. Other motion is
attached to actual illustration objects rather than unrelated overlays.

The TypeScript/production build, complete lesson/quiz/accessibility suite,
and all 35 recording checks passed. `scripts/activities.mjs` passed in Chrome
and WebKit: all discovery and response clips play; keyboard controls, selected
states, gentle retries, reset on revisit, and swipe isolation work. Starting a
lesson recording cancels an active response cue, so audio never overlaps.
Replay and reduced-motion behavior passed. New screenshots are saved as
`06-church-explorer.png`, `07-response-practice.png`,
`08-entrance-procession.png`, and `09-sign-of-cross.png`.
The latest full lesson/quiz/accessibility suite also passed against localhost:5173.
The activity suite verifies all five right-hand positions, pause freezing
movement, reset, reduced motion, and the interior procession.
New explorer wording and the visual portrayal of the rites still merit the
priest/catechist review described in `CONTENT_SOURCES.md`.

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

## Companion-site footer link

Added a single global footer link to the companion site. Production builds passed for both apps, and adult lint passed. Both links were checked at 375px and 1280px for the correct URL, visibility, a minimum 44px tap target, no horizontal overflow, and automated footer WCAG A/AA checks. Adult footer checks covered both light and dark themes.
