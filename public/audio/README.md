# Recorded narration

These 26 lesson clips, one Parent Corner preview, four response-practice cues,
and seven church discoveries were synthesized locally
with Kokoro-82M v1.0, voice `af_heart`, using kokoro-js 1.2.1, the ONNX q8 model,
and speed 0.92. They use an AI-generated voice, not a human recording or a
voice cloned for this project. No speech model runs in the children's app.

Editorial source: `src/data/massParts.ts`. `scripts/generate-narration.mjs`
builds the script with `getNarrationText`, inserts short sentence pauses, and
exports mono 24 kHz, 64 kbps MP3s normalized to -18 LUFS with a -2 dB true-peak
target. Hashed filenames allow updated clips to bypass old browser caches.
The generated manifest records the exact text for each clip. If a lesson is
edited without regenerating its audio, the app uses current device narration
rather than playing an outdated recording.

Audio is loaded only after a tap and served from the same GitHub Pages site.
Stop, changing cards, changing narrator, and leaving the screen cancel playback.
A failed recording falls back to the browser voice with a friendly message.

## Model and authoring-library sources

- Kokoro model and weights (Apache 2.0): https://huggingface.co/hexgrad/Kokoro-82M
- ONNX conversion (Apache 2.0): https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
- Authoring library (Apache 2.0): https://github.com/hexgrad/kokoro/tree/main/kokoro.js

The Apache 2.0 license is included alongside the recordings for provenance.
The model, package dependencies, and temporary WAVs are not committed or shipped.
Review pronunciation of liturgical terms and the calm, reverent delivery with
a parent or catechist before classroom use.


## Spanish and Polish

`es/` and `pl/` each contain 38 locally generated MP3s, using Chatterbox Multilingual V3 (`mlx-community/chatterbox-multilingual-v3`, MIT) through mlx-audio 0.5.8. The starting voice reference is the first ten seconds of the existing Kokoro `af_heart` synthetic preview. Polish then uses a Polish-language synthetic sample derived from that voice, to improve pronunciation. No human voice recording was supplied or cloned for these clips. Reference and model files remain in the temporary authoring environment; only MP3s are distributed.

Sources:
- https://github.com/resemble-ai/chatterbox
- https://huggingface.co/mlx-community/chatterbox-multilingual-v3
- https://github.com/Blaizzy/mlx-audio

The generator uses calm delivery (exaggeration 0.25), a 0.95 tempo adjustment, sentence pauses, and the same MP3 loudness/peak targets as English. It transcribes segments locally with Whisper large-v3-turbo and retries speech that does not closely match the script. A fluent speaker should still review pronunciation, phrasing, and the translated Catholic terms. Device narration remains an optional choice and a fallback; the default in all three languages is the recorded narrator.

## Filipino (Tagalog)

`fil/` contains 38 AI-generated recordings authored locally with OmniVoice (`mlx-community/OmniVoice-bfloat16`) through MLX Audio 0.5.8. The language code is `fil`; local Whisper transcription checks use `tl`. A native synthetic voice reference was generated with a warm, calm female voice description. No real person’s voice recording was used.

The exact-text manifest is `src/generated/narration-fil.json`. `scripts/generate-filipino-narration.py` generates short passages, retries failed text checks, adds sentence pauses, slows delivery to 0.97 tempo, and exports mono 24 kHz/64 kbps MP3s normalized to -18 LUFS/-2 dB peak. Transcription is a completeness check, not a substitute for native-speaker listening review.

OmniVoice source: https://github.com/k2-fsa/OmniVoice
MLX model: https://huggingface.co/mlx-community/OmniVoice-bfloat16

OmniVoice is Apache 2.0; its HiggsAudioV2 tokenizer has separate Boson/Meta community license notices included alongside the audio. See `NOTICE-OMNIVOICE.txt`. No model weights, tokenizer, reference WAV, or inference runtime are shipped in the app.

Built with Higgs Materials licensed from Boson AI USA, Inc., Copyright Boson AI USA, Inc., All Rights Reserved and Meta Llama 3 licensed under the Meta Llama 3 Community License, Copyright Meta Platforms, Inc., All Right Reserved. Based on Meta Llama 3.
