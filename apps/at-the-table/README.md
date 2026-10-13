# At the Table: An OCIA Companion

A separate adult version of Mass Adventure with a calm editorial lesson experience for understanding and participating in the Catholic Mass. The original children's application is unchanged.

## Run

From this folder:

```sh
npm ci
npm run dev
```

The adult app uses http://127.0.0.1:5174, so it can run alongside the children's app. During development in the parent workspace, Node can also resolve the existing parent dependencies; an independent checkout should run `npm ci` here.

```sh
npm run build
npm run preview
```

Production files are generated in this folder's `dist/`. The relative Vite base supports static hosting in a subdirectory. No deployment or changes to the children's GitHub Pages workflow have been made.

## Adult experience

- 28 original adult lessons across the Introductory Rites, Liturgy of the Word, Liturgy of the Eucharist, and Concluding Rites.
- Each lesson includes an explanation, practical participation guidance, a Scripture reading, and a Catechism reference.
- Every lesson has a “What we say” section identifying who speaks, short spoken responses, the named prayers, and occasions with no fixed response. Prayers and responses are open by default and can be collapsed inside each lesson. User-supplied Confiteor, Gloria, Nicene Creed, Sanctus, memorial acclamations, Lamb of God, and Communion dialogue appear in full alongside the traditional Our Father and other responses. There are no outgoing prayer links. Texts not supplied, including full Eucharistic Prayers and the Apostles’ Creed, remain identified summaries. Readings and seasonal or daily variations are identified.
- A four-part illustrated Mass map, one lesson card at a time, large Previous/Next controls, locally hosted British female AI narration, and eight knowledge-check questions with explanatory feedback.
- Simple “What happens?”, “Why does it matter?”, and “What do I do?” explanations on one reading surface, with a serif lesson hero, abstract SVG motif, and a call-and-response prayer script. Source reading and searching are optional expandable sections.
- OCIA journey guide, distinctions for baptized adults, six FAQs, glossary, and primary-source reading list.
- Lesson progress saved on this browser. Blocked browser storage leaves the app usable and displays a warning.
- Responsive layouts, keyboard controls, focus indicators, reduced-motion support, and original Mass Adventure SVG illustrations on the map. Lessons use Georgia and system sans serif fonts without additional font downloads.

This is a Mass study companion, not a complete parish OCIA curriculum. Study progress does not establish readiness for the sacraments. A priest or catechist should review the adult content before parish use, particularly sacramental preparation, local posture, Communion guidance, and the handling of baptized candidates.

## Content and sources

Editable lessons and source links: `src/content.ts`. App and persistence: `src/App.tsx`. Lesson design: `src/LessonExperience.tsx` and `src/lesson.css`. Other pages: `src/style.css`. Shared prayer and narration formatting: `src/reading.ts`. Recorded audio player: `src/useRecordedNarration.ts`.

The adaptation draws on the original project's verified thematic reference mapping and new consultation of official USCCB and Vatican sources. Each lesson uses original paraphrases, with fixed prayer text supplied by the user. Prayer names and short responses are mapped in `src/spoken.ts`, checked against the Order of Mass reference hosted by the Archdiocese of Baltimore and USCCB prayer pages. User-provided fixed texts are stored in `src/suppliedPrayers.json`; the pasted copy’s stray “Continued…” layout marker was removed from the Creed. These sources were used for verification; prayer text does not link out. The reference PDF contains the 2011 Order of Mass; for changing prayers and any subsequent updates, follow the current parish Missal. Scripture selections are suggested further study, not claims about the readings assigned on a particular Sunday.

Primary references checked October 9, 2026:

- [USCCB introduction to OCIA](https://www.usccb.org/committees/evangelization-catechesis/ocia)
- [General Instruction of the Roman Missal, Chapter II](https://www.usccb.org/prayer-and-worship/the-mass/general-instruction-of-the-roman-missal/girm-chapter-2)
- [CCC 1345–1355: Eucharistic celebration](https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/iv_the_liturgical_celebration_of_the_eucharist.html)
- [CCC: Eucharistic sacrifice and presence](https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/v_the_sacramental_sacrifice_thanksgiving_memorial_presence.html)
- [CCC: Communion](https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/vi_the_paschal_banquet.html)

## Privacy and browser behavior

No account, backend, analytics, ads, or submitted forms. Reflection prompts and notebook features have been removed to keep lessons focused. Lesson progress is stored in localStorage under `ocia-companion-v1`; other users of the same browser profile can access them. Progress is not synchronized. External reading links open in a new tab. Narration uses locally hosted MP3 files generated offline with Kokoro, voice bf_emma. It is an AI voice, not a human recording. No speech model or voice API runs in the browser. Audio is fetched only when playback starts. Narration stops on lesson or screen changes and never autoplays.

## Verification

With the adult dev server running and Chrome installed:

```sh
npm test
npm run test:reading
npm run test:audio
npm run test:theme
npm run test:references
npm run lint
npm run typecheck
```

Tests cover all 28 lessons, all four knowledge checks, search, navigation, persistence after reload, responsive overflow, console errors, and automated WCAG A/AA checks. Screenshots are written to `screenshots/`. Browser checks do not establish pastoral approval, real-device compatibility, or narration voice quality.

### ICEL acknowledgment

Prayer sections containing verbatim responses display one Roman Missal acknowledgment at the bottom of each lesson’s prayer section. Every lesson view displaying prayer text carries its own credit, including the first and last such views. Resources repeats the credit, links to ICEL’s noncommercial website policy (printed page 25), and states that ICEL does not endorse this companion. The © 2010 date and corporate name follow ICEL’s current acknowledgment example at https://www.icelweb.org/copyright.htm. Keep the site noncommercial and free to access, retain exact approved text and these credits, and recheck the policy before changing the publication model. This website permission does not cover other publication formats.

## Editorial reading design

Candlelit Editorial combines parchment, midnight ink, and candlelight gold with Georgia titles and prayer text and system sans serif controls. All lesson colors, typography, spacing scale, surfaces, radii, shadows, and motion defaults are scoped under reading tokens in `src/lesson.css`. The light and true dark palettes apply globally through the shared header toggle and follow system preference until a manual choice is saved as `ocia-reading-theme`. Home, the Mass map, OCIA help, Resources, quizzes, and lessons share this setting. The lesson list sheet uses a native keyboard-accessible dialog; desktop also shows a lesson rail. Participation steps are split at sentence boundaries from the existing practice text and do not change the lesson data model. Checklist selections last while the lesson is open. Module progress still uses the original saved lesson status.

The new reading screen includes an open prayer script, text sizing, local glossary chips, a sticky compact header, mobile bottom navigation, and an animated completion control. Reduced-motion settings disable transitions and haptics. Routing and theological data are unchanged.

## Recorded British female narration

`src/generated/narration.json` maps each lesson to MP3 segments with exact source text, row labels, and durations. Narration covers the three questions, an explicit What we say introduction, every prayer/response/explanation row, and the closing prayer note. Follow along starts at What we say and highlights the current prayer row. The timeline supports real seeking, pause/resume, speed changes without pitch changes, and cancellation on navigation. Stale recordings are not played when source text changes.

Narration uses the exact on-screen questions: What happens?, Why does it matter?, and What do I do?. Each question is synthesized together with the opening explanation to avoid isolated short question artifacts. Speaker cues are joined to their response with a colon. The visible headings and theological text remain unchanged.

Audio authoring is separate from production. Run `npm run generate:narration` with `NARRATION_RUNTIME` pointing to an isolated runtime containing kokoro-js 1.2.1, the cached ONNX q8 model, ffmpeg, and ffprobe. No generation dependencies ship in the browser. Rerun audio verification after regeneration.

## Reference verification

Every lesson’s collapsed notes link to the Vatican page containing each cited CCC paragraph, with separate links when the citations span sections. A GIRM Chapter II reference supplies the corresponding ritual directions. The October 9, 2026 source review and lesson-by-lesson findings are recorded in `TEST_REPORT.md`. `test:references` checks all cited paragraph numbers against the page index captured during that live review; the browser suite checks the actual lesson links. These automated checks verify reference coverage, while the recorded editorial review assesses relevance.

## GitHub Pages

Repository: https://github.com/ksantiagoBAH/at-the-table

Live website: https://ksantiagobah.github.io/at-the-table/

Pushes to `main` and manual runs of `.github/workflows/deploy.yml` install dependencies, verify reference coverage, lint, build, and deploy `dist/` to GitHub Pages. The relative Vite base preserves assets and narration under the repository path. The site is free and public, with no backend or runtime secrets.

## Link previews

The initial HTML includes Open Graph and large-image card metadata with an absolute public PNG URL, so preview fetchers can read it without running React. `public/share-card.png` is a 1200 × 630 branded graphic using the existing church illustration. Regenerate locally with `npm run generate:share-card` (Chrome required), then build and publish. Messaging applications decide whether and when to display a preview.

## Navigation and reading improvements

Each lesson has a shareable URL (`#mass/gloria`); knowledge checks use `#check/gather` (or the corresponding section ID). Refresh and browser Back/Forward restore the selected lesson. The homepage remembers the last visited lesson separately from completion and shows a single Continue reading action in a compact last-lesson card. Existing completion data is retained.

Search is always visible above the Mass map and includes localized prayer text, participation guidance, notes, and familiar prayer names. Accents are optional. Section cards show their own explored counts. Home also links to **Your first Mass** and a **Prayer quick reference**, which reuse the existing guidance and localized prayer texts.

Participation guidance is a plain list. Its explicit entries live in `src/practiceSteps.json`; update the appropriate entries alongside `practice` when editing lesson content. This keeps punctuation inside quoted responses intact. Narration continues to use the original prose, so the current audio manifests remain valid.

Reading text size applies to lesson explanations and prayers and is remembered between lessons. Prayer playback and automatic scrolling are separate controls. The mobile navigation keeps completion beside continuation, while allowing readers to advance without marking a lesson. Explored status distinguishes browser persistence from visit-only storage. Concluding-Rites questions now use daily-life scenarios, followed by a practical section recap.

Run `npm run test:ux` against the local server (or set `TEST_URL`). It covers lesson URLs, history, skip-link focus, resume, text-size persistence, quoted guidance, progress, prayer search, all four languages, quick guides, narrow-screen layouts, WCAG checks, and unavailable browser storage. Existing build, lint, lesson, reading, and audio checks remain available.

The homepage introduces the app as a simple guide to the Catholic Mass, with separate entry points for exploring lessons and attending a first Mass. Original SVG branding uses a cross and shared table; the footer repeats that motif with learning links and creator credits. The lesson audio player uses a neutral label without displaying the narrator’s name or accent.
