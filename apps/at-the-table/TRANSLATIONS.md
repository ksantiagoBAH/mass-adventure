# English, Spanish, Polish and Tagalog text

At the Table uses English (`en`), Spanish (`es`), Polish (`pl`) and Tagalog (`tl`). The selection is saved under
`at-the-table-language`. Stable lesson IDs share the existing completion record.
Spanish, Polish and Tagalog are text-only; English recordings remain available in English. Changing
language unmounts the lesson player and releases any playing audio.

Original educational content is translated in `src/spanish.ts`; interface strings
are in `src/es-ui.json`; Spanish prayers and explanatory speaker notes are in
`src/spanishSpoken.ts`. The educational translation has not yet been reviewed by
a Spanish-speaking parish catechist. Verified Spanish Scripture chapters and Mass instructions are linked where available. Source links that remain English are labeled.
Catechism citations link to the corresponding Spanish Vatican sections.

## Spanish liturgical sources

Use the U.S. **Misal Romano, tercera edición**, rather than translating the English
Missal wording freely. Spain and other territories may use different wording.
Checked October 9, 2026 against the USCCB's official chant/text resources:

- https://www.usccb.org/es/prayer-and-worship/the-mass/musica-para-el-misal-romano
- `saludo.pdf`, `acto-penitencial.pdf`, `gloria.pdf`, `liturgia-de-la-palabra.pdf`,
  `credo-i.pdf`, `orate-fratres.pdf`, `dialogo-del-prefacio.pdf`, `sanctus.pdf`,
  `aclamacion-memorial.pdf`, `doxologia.pdf`, `oracion-del-senor.pdf`,
  `signo-de-paz.pdf`, `agnus-dei.pdf`, `invitacion-a-la-comunion.pdf`,
  `bendicion.pdf`, `despedida.pdf` under https://www.usccb.org/resources/.

The PDFs contain music notation; the website displays only prayer text. The
memorial acclamations retain the Spanish invitation for each corresponding option.
The dismissal presents selected approved options, not an exhaustive list.

Spanish copyright acknowledgment:

> Texto del Misal Romano, tercera edición © 2014 United States Conference of
> Catholic Bishops – Conferencia Episcopal Mexicana. Se reservan todos los derechos.

The owner confirmed in this conversation on October 9, 2026 that they have Spanish
website permission. The permission document and any additional license conditions
have not been supplied or independently reviewed. The public PDF download policy
by itself covers printed reproduction; do not treat it or the English ICEL policy
as blanket permission for Spanish website publication. Preserve any additional
conditions in the owner's license when provided.

## Verification

`npm run test:language` checks both languages, all 28 Spanish lessons, the quizzes,
shared progress, language persistence, text-only Spanish, and accessibility and
layout on four viewport sizes in both themes. Existing English tests continue to
check the English prayer content and audio recordings. Native speaker review is
still needed before describing the educational translation as parish-approved.

## Polish text and sources

Polish educational content is in `src/polish.ts`, interface strings in
`src/pl-ui.json`, and Mass responses in `src/polishSpoken.ts`. Lesson IDs,
completion progress and citation numbers are shared across all three languages.
The educational translation still needs review by a Polish-speaking catechist.

The Polish wording follows *Mszał rzymski dla diecezji polskich* (Pallottinum,
1986), available from the Archdiocese of Warsaw's altar-server ministry:
https://ministranci.waw.pl/wp-content/uploads/docs/Mszal.pdf
Its decree on PDF page 9 explicitly permits use outside Poland for Polish
congregations while requiring the host country's calendar and local customs.
The four Polish memorial acclamations are also documented by the Archdiocese
of Wrocław:
https://www.lso.archidiecezja.wroc.pl/index.php/materialy-formacyjne/liturgika/msza-swieta/obrzedy-mszy-swietej

Polish lessons retain the verified USCCB GIRM links and exact Vatican Catechism
paragraph destinations. These sources and the Scripture links remain in English
and are labeled accordingly. Polish labels use KKK for the Catechism.

Polish attribution: Fragmenty Mszału rzymskiego dla diecezji polskich
© 1986 Konferencja Episkopatu Polski. The Missal's copyright page identifies
that rights holder. This attribution does not itself establish website permission;
the earlier owner confirmation concerned Spanish only. No claim of Polish
publication permission or official approval is made.

`npm run test:polish` checks all 28 lessons, text-only presentation, prayers,
quizzes, language persistence, shared progress, audio cleanup on language change,
and accessibility/layout in both themes at 320, 375, 768 and 1280 pixels.
`npm run test:references` checks all three language citation destinations.

## Filipino/Tagalog educational draft

The selector labels this option Tagalog (`tl`). Educational content is in
`src/tagalog.ts`, UI strings in `src/tl-ui.json`, and the prayer-section adapter
in `src/tagalogSpoken.ts`. All 28 lessons, eight quiz questions, formation stages,
glossary, FAQs, navigation, themes, and progress controls are translated.
A Filipino-speaking Catholic catechist has not reviewed the educational draft.

Philippine Church terminology and response context were checked against the
CBCP booklet *Banal na Misa at Pagbubukas ng Sinodo sa Lokal na Simbahan*:
https://cbcponline.net/wp-content/uploads/2021/10/Banal-na-Misa-at-Pagbubukas-ng-Sinodo-sa-Lokal-na-Simbahan.pdf
The booklet is a source reference, not a blanket website reproduction license.
The site makes no claim of CBCP approval or Filipino-text publication permission.

The owner subsequently supplied the full Filipino text in an attachment on
October 9, 2026. The prayer sections now use that supplied text, organized in
`src/suppliedTagalogPrayers.json` and `src/tagalogSpoken.ts`; no English prayer
fallback remains. Long excerpts were extracted from the attachment rather than
imported from the linked website. The original insertion block no longer prevents
working with the newly supplied text.

Editorial corrections: restored the Gloria's missing thanksgiving phrase against
the CBCP booklet; repaired line-break hyphenation in the Apostles' Creed; corrected
“wakes” to “wakas” and “Itinaas na naming” to “Itinaas na namin”; removed gesture
marks from the words to recite. The Gospel's opening response was checked against
the Good Shepherd Catholic parish's Filipino/English worship aid:
https://gscceg.org/sites/goodshepherd/files/simbang_gabi_day_4-5.pdf
The supplied Apostles' Creed is labeled as such; it is not mislabeled Nicene.
The consecration text is explicitly an example from Eucharistic Prayer II, spoken
by the priest. Variable prayers and readings remain explanations instead of
incomplete ellipsis-filled recitation text. The Filipino post-Our-Father response
retains its supplied concluding Amen, while the Our Father itself does not.

Filipino prayer credit identifies the supplied guide and its source without
inventing a copyright year, rightsholder, or claim of official approval. The
English ICEL notice applies to the English edition, not to these Filipino texts.
Publication permission for the Filipino edition has not been independently
verified. Native catechist review of the full educational draft is still needed.

The original USCCB guidance and exact Vatican Catechism paragraph links remain
shared; destinations in English are labeled “sa Ingles.” Local parish norms
continue to govern posture and ritual practice. Audio remains English-only and
stops when the language changes.

`npm run test:tagalog` checks all 28 lessons, all eight quiz answers, Filipino
prayer text, text-only presentation, saved progress across all four languages,
and accessibility and overflow at four widths in both themes.

Additional reference supplied by the owner:
https://www.ourparishpriest.com/2026/03/holy-mass-in-filipino-tagalog/
The March 29, 2026 page is linked only in Tagalog resources. It is a secondary
reference, not treated as the authoritative Missal: its Gloria omits the
thanksgiving line present in the CBCP booklet. The owner supplied the text directly in an attachment, which is the basis for
the local prayer sections. The website link remains a reference only.
