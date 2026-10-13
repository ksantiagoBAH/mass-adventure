# Rosary Web

A quiet space for the Rosary, Divine Mercy Chaplet, and daily prayer. Ported from the Rosary Expo app using the same stack as [Mass Adventure](https://github.com/ksantiagoBAH/mass-adventure): React 19, TypeScript, Vite 7, and plain CSS, hosted on GitHub Pages.

[Open the app](https://ksantiagobah.github.io/mass-adventure/rosary/)

## Develop

Requires Node 22 or newer.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run test:browser` tests Chrome and WebKit at 390, 768, 1440, and 1920 pixels. It requires installed Chrome and Playwright WebKit (`npx playwright install webkit`). It checks WCAG A/AA accessibility, overflow, saved progress, voice switching, playback, automatic advancement, the Chaplet, and both libraries against the local server. Set `PREVIEW_URL` to test a production preview.

## Included

- Today's mystery recommendation, preserving the original simplified seasonal convention.
- All four mystery sets, twenty reflections, twelve traditional prayers, and the full Divine Mercy Chaplet.
- Guided narration or manual reading; male and female AI-generated recordings with synchronized phrase highlighting, playback speeds of 0.85×, 1×, 1.15×, 1.25×, and 2×, replay, seeking, and text-size controls.
- Optional Fatima Prayer and optional Chaplet opening and closing prayers.
- Locally saved separate Rosary and Chaplet sessions, voice preference, playback speed, and reading size.
- All original prayer artwork and silent videos. Videos respect Reduce Motion, can be paused separately, pause while the page is hidden, and fall back to artwork on errors.
- A desktop sidebar and fitted meditation workspace. Video, the current decade’s larger beads, scrolling prayer text, and audio controls stay together in the viewport; phones use a compact stacked layout. All controls support keyboard navigation.
- Hash-based screen navigation works under GitHub Pages without server routing.

Progress is stored only in this browser on this device. Storage errors allow the session to continue with a visible notice. Navigation and backgrounding pause narration. Browsers require pressing Play to start audio. Guided mode advances after each recording; manual mode uses Previous and Next. Starting a new devotion replaces that devotion's saved place.

## Deployment

Pushing the shared repository’s `main` triggers its `.github/workflows/deploy.yml`, which installs locked dependencies, lints, tests, typechecks, builds, and publishes `dist` to GitHub Pages. The Pages source is GitHub Actions. Vite's relative base and the asset URL helper support a repository subpath.

Media is served from this repository, loaded on demand. Unlike the native app, the web port does not promise offline installation or iOS home-screen widgets. It has no backend, account, analytics, or microphone access. Prayer progress is not synchronized across devices.

## Content provenance

Prayer text, mystery reflections, calendar convention, Rosary and Chaplet sequencing, artwork, videos, audio, and audio-derived word timings were copied from the user's current Rosary app. Recordings are identified as AI-generated ElevenLabs narration. Traditional prayer wording follows the existing source app; the calendar is not a complete regional liturgical calendar. Source media rights remain with their respective owners.

`src/data` contains content and media bindings, `src/domain` contains reusable prayer/calendar logic, `src/Player.tsx` handles narration and text, and `src/Media.tsx` handles animations. Native Expo APIs were replaced with browser APIs; the original native app remains separate.
