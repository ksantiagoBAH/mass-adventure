// Offline authoring tool only. No model, generator, or API ships to children.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const runtime = process.env.NARRATION_RUNTIME;
if (!runtime) throw new Error("Set NARRATION_RUNTIME to an isolated folder with kokoro-js@1.2.1 installed.");
const source = (await readFile(join(root, "src/data/massParts.ts"), "utf8"))
  .replaceAll("import.meta.env.BASE_URL", '"./"');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { sections, getNarrationText, narratorCopy } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const { KokoroTTS } = await import(pathToFileURL(join(runtime, "node_modules/kokoro-js/dist/kokoro.js")));
const { env } = await import(pathToFileURL(join(runtime, "node_modules/@huggingface/transformers/dist/transformers.node.mjs")));
env.cacheDir = join(runtime, "model-cache");
const model = "onnx-community/Kokoro-82M-v1.0-ONNX";
const voice = "af_heart";
const speed = 0.92;
console.log("Loading local neural narrator…");
const tts = await KokoroTTS.from_pretrained(model, { dtype: "q8", device: "cpu" });
await mkdir(join(root, "public/audio"), { recursive: true });
await mkdir(join(root, "src/generated"), { recursive: true });
const clips = [
  { id: "preview", text: narratorCopy.sample },
  ...sections.flatMap(section => section.parts.map(part => ({ id: part.id, text: getNarrationText(part) }))),
];
const manifest = {};
for (const clip of clips) {
  const fingerprint = createHash("sha256").update(`${model}:${voice}:${speed}:${clip.text}`).digest("hex").slice(0, 12);
  const filename = `${clip.id}-${fingerprint}.mp3`;
  const output = join(root, "public/audio", filename);
  let exists = true;
  try { await access(output); } catch { exists = false; }
  if (!exists) {
    // Short sentences prevent the model's token limit from truncating a card.
    const segments = [...new Intl.Segmenter("en-US", { granularity: "sentence" }).segment(clip.text)]
      .map(s => s.segment.trim()).filter(s => /[a-z]/i.test(s));
    const chunks = [new Float32Array(2400)];
    for (const sentence of segments) {
      if (sentence.length > 350) throw new Error(`Split this sentence before recording: ${sentence}`);
      const audio = await tts.generate(sentence, { voice, speed });
      chunks.push(audio.audio, new Float32Array(4800));
    }
    const sampleCount = chunks.reduce((count, chunk) => count + chunk.length, 0);
    const wav = Buffer.alloc(44 + sampleCount * 2);
    wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(24000, 24); wav.writeUInt32LE(48000, 28);
    wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36);
    wav.writeUInt32LE(sampleCount * 2, 40);
    let offset = 44;
    for (const chunk of chunks) for (const sample of chunk) {
      wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), offset);
      offset += 2;
    }
    const tempWav = join(runtime, `${clip.id}.wav`);
    await writeFile(tempWav, wav);
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", tempWav,
      "-af", "loudnorm=I=-18:TP=-2:LRA=7", "-ar", "24000", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", output]);
  }
  manifest[clip.id] = { text: clip.text, file: `audio/${filename}` };
  console.log(`${exists ? "Kept" : "Recorded"} ${clip.id}`);
}
await writeFile(join(root, "src/generated/narration.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Ready: ${clips.length} recordings. Run npm run build to include them.`);
