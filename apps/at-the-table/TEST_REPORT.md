# Adult companion verification

October 9, 2026. Local Chrome browser checks against the adult app at port 5174.

- Production build: TypeScript and Vite passed.
- Welcome layout: no horizontal overflow at 320, 390, 768, and 1440 pixels.
- Automated axe WCAG 2 A/AA and 2.1 AA checks passed for those welcome layouts, desktop and mobile lessons, all four knowledge checks, the mobile OCIA journey and resources.
- Verified the simplified four-part illustrated map and all 28 individual lesson cards; confirmed reflection prompts and writing controls are absent.
- All 28 cards have a “What we say” region with speaker labels and prayer/response entries. Prayers and responses expand inline; all 28 disclosures were opened and closed. Confirmed outgoing prayer links are absent and the traditional Our Father appears in full. Full user-supplied Confiteor, Gloria, Creed, Sanctus, and Lamb of God were checked in their lesson disclosures; expanded Gloria and Creed passed mobile accessibility checks. All 21 supplied text entries were compared with the pasted source wording. Day-specific readings retain their source link.
- All eight quiz questions: answer selection and feedback; correct answers expose onward navigation.
- Lesson search opens the relevant lesson.
- Reviewed lesson status survives reload.
- No browser page errors during the suite.
- Desktop welcome and mobile welcome/lesson screenshots captured and visually reviewed.

Verified again after replacing the sidebar with the child-style map and individual illustrated cards, then removing reflection prompts, the notebook, and reflection narration. Fixed narrow-screen card overflow, small-label contrast, and mobile menu visibility during verification. Tests use Chrome; real iOS/Android devices and narration voice quality remain unverified. Adult content has not received pastoral approval. This app is a Mass companion, not a complete OCIA curriculum.

Reproduce with `npm run dev` and `npm test` in separate terminals in this folder. No production deployment was performed.

## ICEL acknowledgment placement — October 9, 2026

Production build and browser verification passed after adding the shared © 2010 Roman Missal acknowledgment. All 28 lessons were checked: prayer sections with verbatim text have one visible credit as their last child when expanded; explanation-only sections do not have unnecessary credits. The Resources page repeats the acknowledgment and adds the policy link and non-endorsement statement. Mobile Gloria and Creed accessibility and overflow checks passed. Prayer wording was not modified.

## CCC source audit — October 9, 2026

Read the live Vatican text on all 12 pages used by the lessons. All 28 existing CCC selections are relevant to the teaching or its broader theme; they do not supply every ritual direction. The General Instruction of the Roman Missal (GIRM), Chapter II, supplies the practical ritual details. Its corresponding paragraph reference is now available in each lesson’s collapsed notes.

Fixed the Eucharistic Prayer, consecration, and memorial links: paragraphs 1352–1354 are on the celebration page, while the later sacrifice/Real Presence references are on a different page. Also split the Lord’s Prayer, Lamb of God, and final blessing citations between their actual source pages. Citations on the same page share one link. No lesson text or prayer wording needed changing.

Primary sources: [Vatican: Eucharistic celebration](https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/iv_the_liturgical_celebration_of_the_eucharist.html), [Vatican: sacrifice, memorial and presence](https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/v_the_sacramental_sacrifice_thanksgiving_memorial_presence.html), [USCCB: GIRM Chapter II](https://www.usccb.org/prayer-and-worship/the-mass/general-instruction-of-the-roman-missal/girm-chapter-2). The other checked Vatican page URLs and their paragraph numbers are recorded in `scripts/ccc-page-index.json`. This index records source availability on the audit date; it does not monitor future website changes.

| Lesson | CCC | What the citation supports |
| --- | --- | --- |
| Entrance & gathering | 1348 | Assembly and active participation. |
| Sign of the Cross | 2157 | Trinitarian prayer and the Sign of the Cross. |
| Liturgical greeting | 1348 | Assembly and the presiding minister; greeting details come from GIRM. |
| Penitential Act & Kyrie | 1431 | Interior conversion; rite and confession distinction come from GIRM. |
| Gloria | 2639 | Prayer of praise; the hymn and calendar rules come from GIRM. |
| Collect: the opening prayer | 1348 | The people’s Amen; silence and Collect details come from GIRM. |
| First Reading | 1349 | Old Testament and apostolic proclamation. |
| Responsorial Psalm | 1154–1156 | Psalm responses, liturgical word and action, and sacred song. |
| Second Reading | 1349 | Apostolic writings. |
| Gospel acclamation | 1154 | Assembly acclamations; Alleluia rules come from GIRM. |
| Gospel | 1349 | Gospels in the Liturgy of the Word. |
| Homily | 1349 | Receiving and practicing the proclaimed Word. |
| Profession of faith | 185 | Common profession of faith; Mass usage comes from GIRM. |
| Universal Prayer | 1349 | Intercessions for all people. |
| Preparation of the gifts | 1350–1351 | Bread, wine, and charitable gifts. |
| Prayer over the offerings | 1350 | Presentation of offerings; this particular prayer comes from GIRM. |
| Eucharistic Prayer | 1352–1354; 1367 | Thanksgiving, consecration, intercession, and the one sacrifice. |
| Sanctus: Holy, Holy, Holy | 1352 | The community’s praise with heaven. |
| Invocation of the Spirit & consecration | 1353; 1374–1376 | Spirit, institution narrative, Real Presence, and transubstantiation. |
| Memorial acclamation & intercessions | 1354; 1362–1364 | Anamnesis, intercession, and sacramental memorial. |
| Doxology & Great Amen | 1348 | Participatory Amen; concluding doxology comes from GIRM. |
| The Lord’s Prayer | 2759; 1355 | Jesus’ prayer and its place before Communion. |
| Sign of peace | 1396 | Eucharistic unity; sign-of-peace directions come from GIRM. |
| Fraction & Lamb of God | 608; 1355 | Christ as Lamb and the breaking of bread. |
| Holy Communion | 1385–1387; 1391; 1396 | Disposition, union with Christ, and ecclesial unity. |
| Silence & prayer after Communion | 1391–1394 | Communion’s spiritual fruits; silence and final prayer come from GIRM. |
| Final blessing | 2627; 2157 | Blessing and the Sign of the Cross; concluding rite comes from GIRM. |
| Dismissal & mission | 1332 | Dismissal and mission in daily life. |

## Editorial design, global themes, and narration verification

The selected direction is Candlelit Editorial. `src/LessonExperience.tsx` contains the new lesson experience; `src/lesson.css` supplies the shared palette and lesson layout; `src/App.tsx` and `src/useAppTheme.ts` apply a persistent global theme. `src/reading.ts` builds the prayer rows and narration script, `src/useRecordedNarration.ts` plays the recordings, and `scripts/generate-narration.mjs` authors them offline. The children’s app remains separate.

The token families cover paper/surface, ink/muted/gold, washes and borders, serif/sans typography, fluid title/body/prayer sizes, spacing, radii, shadows, motion, and reading measure. Light uses parchment #f8f5ef, ink #232a3d, and gold #76541a; dark uses paper #10131c and gold #d8b56d. Global theme checks passed across Home, map, OCIA help, and Resources at 375/768/1280 in both themes, including saved preference overriding the system setting.

Final lesson checks passed at 375/768/1280 in both themes, with expanded notes, largest prayer text, 200% text sizing, reduced motion, checklist toggling, native dialog keyboard dismissal, sticky header, completion, and mobile Gloria. Automated axe A/AA checks and overflow checks passed on those views. Final light mobile and dark desktop screenshots were visually inspected.

All 28 recordings match their current scripts, including every What we say entry and note. Chrome decoded all 245 MP3 segments with audible signal and no clipping. Playback checks passed for entry at the prayer section, each prayer-row highlight, pause/resume, seeking, 1.2× speed, cancellation on navigation, and playback without a browser speech API. Recordings use the synthetic British female Emma voice; they are not recordings of a human speaker. Listening quality on real phones remains unverified.

Potential next polish: a listening review of the longest prayers for pacing; retaining participation checklist selections between visits; a parish catechist’s review of the lesson wording. These are suggestions, not completed work.

Final production build, lint, typecheck, reference coverage (50 cited paragraph occurrences), all 28 browser lesson-link checks, quiz/navigation regression, reading/accessibility checks, and narration checks passed. No deployment was performed.

## Full-height theme canvas correction

Moved theme tokens to the document root and applied the saved theme to both html and body, including the native color scheme. This fixes the pale canvas below the footer in taller windows. Build and lint passed. All 24 global page/theme/width checks passed, plus a 1280 × 1800 home-page check confirming the exposed canvas uses the dark background. Captured `screenshots/home-dark-tall.png`. Reduced-motion settings also disable the root background transition.

## Voice-over heading alignment

Restored the exact visible questions in all 28 recordings: “What happens?”, “Why does it matter?”, and “What do I do?”. Each question is synthesized with the opening explanatory sentence, rather than as a separate short clip. Regenerated the first three sections of every lesson and reused the existing prayer sections. This supersedes the earlier declarative-transition approach. Production build, lint, typecheck, all 28 script comparisons, decoding of all 245 MP3s, and playback regression passed. These checks verify text alignment and playback; they do not establish subjective voice quality.

## Testament labels for the readings

Added the Testament to the visible What happens explanations and regenerated the corresponding audio: First Reading is usually Old Testament, normally Acts in the New Testament during Easter; Second Reading on Sundays and solemnities is a New Testament letter or Revelation. First Reading notes clarify the weekday and special-celebration variations. Checked against USCCB’s Liturgy of the Word and The Old Testament in the Liturgical Life of the Church. Build, lint, reference checks, narration-script alignment, all 245 audio decodes, and playback regression passed.

## Shared-link preview graphic

Added a 1200 × 630 PNG using the existing church illustration and At the Table branding, plus static Open Graph title, description, canonical URL, image dimensions, image type, and alt text. Added large-image card metadata. Visually inspected the graphic and verified its PNG dimensions and inclusion in the built output. Build and lint passed. Actual Messages rendering is controlled by the receiving application and was not tested by sending a message.

## Browser tab icon

Added a simple church favicon in the parchment, midnight, and gold palette. Includes a scalable SVG, a 16/32px ICO fallback, and a 180px Apple touch icon. Visually reviewed the rendered icon and verified the production HTML uses the correct relative asset paths. Build and lint passed.

## Companion-site footer link

Added a single global footer link to the companion site. Production builds passed for both apps, and adult lint passed. Both links were checked at 375px and 1280px for the correct URL, visibility, a minimum 44px tap target, no horizontal overflow, and automated footer WCAG A/AA checks. Adult footer checks covered both light and dark themes.
