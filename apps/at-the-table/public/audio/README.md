# British female narration

These files are offline-generated AI narration using Kokoro-82M v1.0 ONNX q8, kokoro-js 1.2.1, British female voice bf_emma (Emma), at speed 0.92. They are not human recordings or a custom cloned voice.

The website only loads MP3 files when the reader starts playback. No neural model, microphone, external voice API, or browser speech service is required at runtime. Loudness is normalized to -18 LUFS with a -2 dB true-peak target; files are mono MP3 at 24 kHz and 64 kbps.

Editorial source: src/content.ts, src/spoken.ts, and src/reading.ts. src/generated/narration.json records exact source text and duration for each segment. Playback rejects stale script matches. Regenerate with scripts/generate-narration.mjs after editing narrated content.

Each lesson includes the three guiding explanations, the What we say introduction, all displayed prayer/response rows, and the closing prayer note. The prayer section can be played directly through Follow along. Narration repeats the exact three visible questions. Each question and its opening explanation share one synthesis call to avoid isolated short question artifacts.

Some long priestly prayers are described rather than recited in full, matching the visible lesson. The recordings do not introduce prayer text that is absent from the screen. The ICEL acknowledgment remains visible with the corresponding prayer excerpts.
