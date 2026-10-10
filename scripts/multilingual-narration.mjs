import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const base=process.env.TEST_URL||'http://127.0.0.1:4173/';
const source=(await readFile('src/data/massParts.ts','utf8')).replaceAll('import.meta.env.BASE_URL','"./"');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {getMassContent}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const browser=process.env.TEST_BROWSER==='webkit'?await webkit.launch():await chromium.launch({channel:'chrome',headless:true});
try {
for(const language of (process.env.TEST_LANGUAGES?.split(',') || ['es','pl','fil'])){
 const content=getMassContent(language);
 const manifest=JSON.parse(await readFile(`src/generated/narration-${language}.json`,'utf8'));
 const expected=[{id:'preview',text:content.narratorCopy.sample},...content.sections.flatMap(s=>s.parts.map(p=>({id:p.id,text:content.getNarrationText(p)}))),...Object.entries(content.responsePractice).map(([id,p])=>({id:`response-${id}`,text:p.cue})),...content.churchDiscoveries.map(d=>({id:`explorer-${d.id}`,text:d.text}))];
 assert.equal(Object.keys(manifest).length,38);
 for(const clip of expected){assert.equal(manifest[clip.id]?.text,clip.text);assert(manifest[clip.id].file.startsWith(`audio/${language}/`));}
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.mp3'))requests.push(r.url())});
 await page.goto(base);
 await page.locator('#app-language').selectOption(language);
 assert.equal(requests.length,0,'Audio stays lazy');
 // Decode all files and measure actual signal, duration, and peak amplitude.
 for(const clip of expected){
  const signal=await page.evaluate(async file=>{
   const context=new AudioContext();try{
    const response=await fetch(file);if(!response.ok)throw new Error(`Missing ${file}`);
    const audio=await context.decodeAudioData(await response.arrayBuffer());
    const samples=audio.getChannelData(0);let sum=0,peak=0;
    for(const x of samples){sum+=x*x;peak=Math.max(peak,Math.abs(x));}
    return {duration:audio.duration,rms:Math.sqrt(sum/samples.length),peak};
   }finally{await context.close();}
  },manifest[clip.id].file);
  assert(signal.duration>0.8 && signal.duration<140,`${language} ${clip.id} duration`);
  assert(signal.rms>0.005 && signal.peak<0.99,`${language} ${clip.id} audible, unclipped signal`);
 }
 requests.length=0;
 // Recordings work even when browser speech services do not exist.
 await page.evaluate(()=>{Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true});Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true});window.__played=[];window.__paused=0;window.__audios=[];
  const NativeAudio=window.Audio;
  window.Audio=function(src){const audio=new NativeAudio(src);window.__audios.push(audio);const play=audio.play.bind(audio),pause=audio.pause.bind(audio);audio.play=()=>{window.__played.push(src);return play()};audio.pause=()=>{window.__paused++;pause()};return audio};
 });
 await page.getByRole('button',{name:content.copy.start,exact:true}).click();
 for(let s=0;s<4;s++){
  await page.locator('.map-stop').nth(s).click();
  for(let p=0;p<content.sections[s].parts.length;p++){
   const id=content.sections[s].parts[p].id;
   await page.locator('.part-title .read').click();
   await page.waitForFunction(file=>window.__played.at(-1)?.endsWith(file),manifest[id].file);
   await page.waitForFunction(()=>window.__audios.at(-1).currentTime>0);
   await page.locator('.part-title .read').click();
   assert(await page.evaluate(()=>window.__audios.at(-1).paused));
   if(content.responsePractice[id]){
    await page.locator('.activity-listen').click();
    await page.waitForFunction(file=>window.__played.at(-1)?.endsWith(file),manifest[`response-${id}`].file);
    await page.waitForFunction(()=>window.__audios.at(-1).currentTime>0);
    await page.locator('.activity-listen').click();
    assert(await page.evaluate(()=>window.__audios.at(-1).paused));
   }
   if(p<content.sections[s].parts.length-1)await page.getByRole('button',{name:content.ui.nextPart,exact:true}).click();
  }
  await page.locator('#main').getByRole('button',{name:content.ui.mapBack,exact:true}).click();
 }
 await page.getByRole('button',{name:content.copy.labels.home,exact:true}).first().click();
 for(let i=0;i<7;i++){
  await page.locator('.explorer-hotspot').nth(i).click();
  await page.getByRole('button',{name:content.activityCopy.explorerRead,exact:true}).click();
  assert((await page.evaluate(()=>window.__played.at(-1))).endsWith(manifest[`explorer-${content.churchDiscoveries[i].id}`].file));
  await page.getByRole('button',{name:content.activityCopy.explorerStop,exact:true}).click();
 }
 await page.getByRole('button',{name:content.copy.labels.parents,exact:true}).first().click();
 await page.getByRole('button',{name:content.narratorCopy.preview,exact:true}).click();
 assert((await page.evaluate(()=>window.__played.at(-1))).endsWith(manifest.preview.file));
 await page.locator('#app-language').selectOption('en');
 assert(await page.evaluate(()=>window.__audios.at(-1).paused),'Switching language stops playback');
 for(const request of requests)assert(request.includes(`/audio/${language}/`),'Only selected-language recordings requested');
 assert.deepEqual(errors,[]);
 console.log('PASS',language,'38 current recordings, decoding, real MP3 playback, stop, navigation, language cancellation, no speech service, same-origin audio');
 await context.close();
}
}finally{await browser.close();}
