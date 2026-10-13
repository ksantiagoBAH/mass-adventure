// Offline authoring only. The website downloads MP3s and does not run a speech model.
import {readFile,writeFile,mkdir,access,readdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
const root=resolve(import.meta.dirname,'..');
const runtime=process.env.NARRATION_RUNTIME||'/private/tmp/mass-adventure-narration';
const sourceFiles=['content.ts','spoken.ts','reading.ts'];
const source=(await Promise.all(sourceFiles.map(async file=>{
 let source=await readFile(join(root,'src',file),'utf8');
 if(file==='spoken.ts')source=source.replace("import supplied from './suppliedPrayers.json';",`const supplied=${await readFile(join(root,'src/suppliedPrayers.json'),'utf8')};`);
 return ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
}))).join('\n');
const {units,spoken,prayerScript,narrationScript}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const {KokoroTTS}=await import(pathToFileURL(join(runtime,'node_modules/kokoro-js/dist/kokoro.js')));
const {env,AutoModel,AutoTokenizer}=await import(pathToFileURL(join(runtime,'node_modules/@huggingface/transformers/dist/transformers.node.mjs')));
env.cacheDir=join(runtime,'model-cache');
const model='onnx-community/Kokoro-82M-v1.0-ONNX';const voice='bf_emma';const speed=.92;
console.log('Loading British female narrator Emma...');
const [network,tokenizer]=await Promise.all([AutoModel.from_pretrained(model,{dtype:'q8',device:'cpu',session_options:{intraOpNumThreads:2,interOpNumThreads:1}}),AutoTokenizer.from_pretrained(model)]);
const tts=new KokoroTTS(network,tokenizer);
console.log(JSON.stringify(tts.voices[voice]));
await mkdir(join(root,'public/audio'),{recursive:true});await mkdir(join(root,'src/generated'),{recursive:true});
const manifest={};const requested=process.env.NARRATION_LESSON;const shard=Number(process.env.NARRATION_SHARD||0);const shardCount=Number(process.env.NARRATION_SHARDS||1);let lessonNumber=0;
const manifestPath=join(root,shardCount===1?'src/generated/narration.json':`src/generated/narration-${shard}.json`);
for(const lesson of units.flatMap(u=>u.lessons)){
 const currentLesson=lessonNumber++;if(currentLesson%shardCount!==shard)continue;
 if(requested&&lesson.id!==requested)continue;
 const segments=narrationScript(lesson,prayerScript(spoken[lesson.id]));const recordings=[];
 for(const [i,segment] of segments.entries()){
  const fingerprint=createHash('sha256').update(`${model}:${voice}:${speed}:${segment.text}`).digest('hex').slice(0,12);
  const filename=`${lesson.id}-${i}-${fingerprint}.mp3`;const output=join(root,'public/audio',filename);
  let exists=true;try{await access(output)}catch{exists=false}
  if(!exists){const cached=(await readdir(join(root,'public/audio'))).find(name=>name.startsWith(`${lesson.id}-`)&&name.endsWith(`-${fingerprint}.mp3`));if(cached){await copyFile(join(root,'public/audio',cached),output);exists=true}}
  if(!exists){
   const phrases=[...new Intl.Segmenter('en-GB',{granularity:'sentence'}).segment(segment.text)].map(s=>s.segment.trim()).filter(s=>/[a-z]/i.test(s));
   // Keep each on-screen question and its opening explanation in one synthesis call.
   if(['What happens?','Why does it matter?','What do I do?'].includes(phrases[0])&&phrases.length>1){const heading=phrases.shift();phrases[0]=`${heading} ${phrases[0]}`}
   const sentences=phrases.flatMap(sentence=>{if(sentence.length<=350)return [sentence];const groups=[];let group='';for(const word of sentence.split(/\s+/)){if(group.length+word.length>350){groups.push(group);group=''}group+=(group?' ':'')+word}if(group)groups.push(group);return groups});
   const chunks=[new Float32Array(2400)];
   for(const sentence of sentences){
    if(sentence.length>400)throw new Error(`Sentence too long in ${lesson.id}: ${sentence.length}`);
    const result=await tts.generate(sentence,{voice,speed});chunks.push(result.audio,new Float32Array(3600));
   }
   const samples=chunks.reduce((total,chunk)=>total+chunk.length,0);const wav=Buffer.alloc(44+samples*2);
   wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(24000,24);wav.writeUInt32LE(48000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
   let offset=44;for(const chunk of chunks)for(const value of chunk){wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),offset);offset+=2}
   const temporary=join(runtime,`ocia-${lesson.id}-${i}.wav`);await writeFile(temporary,wav);
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',temporary,'-af','loudnorm=I=-18:TP=-2:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',output]);
  }
  const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',output],{encoding:'utf8'}).trim());
  recordings.push({...segment,file:`audio/${filename}`,duration});console.log(`${exists?'Kept':'Recorded'} ${lesson.id} ${i+1}/${segments.length}`);
 }
 manifest[lesson.id]={voice:'Emma',accent:'British English',synthetic:true,segments:recordings};
 let existing={};try{existing=JSON.parse(await readFile(manifestPath,'utf8'))}catch{}
 await writeFile(manifestPath,JSON.stringify({...existing,...manifest},null,2)+'\n');
}
console.log(`Ready: ${Object.keys(manifest).length} lessons.`);
