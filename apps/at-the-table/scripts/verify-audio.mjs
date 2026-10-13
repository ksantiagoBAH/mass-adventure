import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
const raw=await readFile(new URL('src/generated/narration.json',root),'utf8');const manifest=JSON.parse(raw);
const compiled=(await Promise.all(['content.ts','spoken.ts','reading.ts'].map(async file=>{let source=await readFile(new URL(`src/${file}`,root),'utf8');if(file==='spoken.ts')source=source.replace("import supplied from './suppliedPrayers.json';",`const supplied=${await readFile(new URL('src/suppliedPrayers.json',root),'utf8')};`);return ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText}))).join('\n');
const {units,spoken,prayerScript,narrationScript}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const lessons=units.flatMap(u=>u.lessons);assert.equal(Object.keys(manifest).length,28);
for(const lesson of lessons){const script=narrationScript(lesson,prayerScript(spoken[lesson.id]));const entry=manifest[lesson.id];assert.equal(entry.voice,'Emma');assert.equal(entry.accent,'British English');assert.equal(entry.synthetic,true);assert.deepEqual(entry.segments.map(({text,label,row})=>({text,label,row})),script);for(const [i,heading] of ['What happens?','Why does it matter?','What do I do?'].entries()){assert.equal(script[i].label,heading);assert(script[i].text.startsWith(`${heading} `))}assert.equal(script[3].label,'What we say');assert(script[3].text.startsWith('Now, pray with the Church'));for(const clip of entry.segments){assert(clip.duration>.2);assert((await readFile(new URL(`public/${clip.file}`,root))).length>1000)}}
console.log('PASS all 28 scripts match, including every prayer row, headings, and closing notes');
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const requests=[];page.on('request',request=>{if(request.url().includes('/audio/'))requests.push(request.url())});
await page.addInitScript(()=>{window.__audios=[];const NativeAudio=window.Audio;window.Audio=function(...args){const audio=new NativeAudio(...args);window.__audios.push(audio);return audio};Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true})});
try{
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5174/#mass');assert.equal(requests.length,0,'No audio requests before Listen');
 const clips=Object.values(manifest).flatMap(entry=>entry.segments);
 const statistics=await page.evaluate(async clips=>{const context=new AudioContext();const results=[];for(const clip of clips){const response=await fetch(new URL(clip.file,location.href));if(!response.ok)throw new Error(`Missing: ${clip.file}`);const buffer=await context.decodeAudioData(await response.arrayBuffer());const values=buffer.getChannelData(0);let squares=0;let peak=0;for(const sample of values){squares+=sample*sample;peak=Math.max(peak,Math.abs(sample))}results.push({file:clip.file,duration:buffer.duration,rms:Math.sqrt(squares/values.length),peak})}await context.close();return results},clips);
 assert.equal(statistics.length,clips.length);for(const result of statistics){assert(result.rms>.003,`Silent clip: ${result.file}`);assert(result.peak<1,`Clipping: ${result.file}`)}console.log(`PASS ${clips.length} decoded MP3s with audible signal and no clipping`);
 await page.getByRole('button',{name:/Open lesson list. Lesson/}).click();await page.getByRole('dialog').getByRole('button',{name:/Penitential Act/}).click();
 await page.getByLabel('Auto-scroll with audio').check();await page.getByRole('button',{name:'Listen to prayer'}).click();await page.waitForFunction(()=>window.__audios.at(-1)?.currentTime>.01);assert((await page.evaluate(()=>window.__audios.at(-1).src)).includes(manifest.penitential.segments[3].file));
 for(let index=4;index<manifest.penitential.segments.length;index++){
  await page.evaluate(()=>window.__audios.at(-1).onended(new Event('ended')));
  await page.waitForFunction(file=>window.__audios.at(-1)?.src.includes(file),manifest.penitential.segments[index].file);
  const row=manifest.penitential.segments[index].row;
  assert.equal(await page.locator('.spoken-line[data-active=true]').count(),row>=0?1:0);
  if(row>=0)assert.equal(await page.locator('.spoken-line[data-active=true]').getAttribute('data-row'),String(row));
 }
 await page.getByRole('button',{name:'Pause lesson audio'}).click();assert(await page.evaluate(()=>window.__audios.every(audio=>audio.paused)));
 await page.getByRole('button',{name:'Listen to lesson'}).click();await page.waitForFunction(()=>!window.__audios.at(-1).paused);
 await page.getByRole('combobox',{name:'Playback speed'}).selectOption('1.2');assert.equal(await page.evaluate(()=>window.__audios.at(-1).playbackRate),1.2);
 await page.getByRole('slider',{name:'Audio position'}).fill('5');await page.waitForFunction(()=>window.__audios.at(-1)?.currentTime>=5);assert((await page.evaluate(()=>window.__audios.at(-1).src)).includes(manifest.penitential.segments[0].file));
 await page.getByRole('button',{name:'Next lesson',exact:false}).click();assert(await page.evaluate(()=>window.__audios.every(audio=>audio.paused)));
 assert.deepEqual(errors,[]);console.log('PASS prayer-section entry, every prayer highlight, pause/resume, seeking, speed, navigation cancellation, and playback without a speech API');
}finally{await browser.close()}
