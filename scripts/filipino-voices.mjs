import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=(await readFile('src/data/massParts.ts','utf8')).replaceAll('import.meta.env.BASE_URL','"./"');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {getMassContent,matchesVoiceLanguage}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
assert(matchesVoiceLanguage('fil-PH','fil'));assert(matchesVoiceLanguage('tl-PH','fil'));assert(matchesVoiceLanguage('TL_ph','fil'));assert(!matchesVoiceLanguage('en-PH','fil'));
const content=getMassContent('fil');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const locale of ['fil-PH','tl-PH',null]){
  const context=await browser.newContext();const page=await context.newPage();
  await page.addInitScript(locale=>{
   window.__utterances=[];window.Audio=undefined;
   window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
   window.speechSynthesis.speak=u=>window.__utterances.push({text:u.text,lang:u.lang,voice:u.voice?.voiceURI});
   window.speechSynthesis.cancel=()=>{};
   window.speechSynthesis.getVoices=()=>[{name:'English Philippines',voiceURI:'en-ph',lang:'en-PH'},...(locale?[{name:'Filipino voice',voiceURI:'fil-test',lang:locale}]:[])];
  },locale);
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:5173/');await page.locator('#app-language').selectOption('fil');
  await page.getByRole('button',{name:content.copy.labels.parents,exact:true}).first().click();
  const options=await page.locator('#narrator-voice option').allTextContents();assert(!options.some(x=>x.includes('English Philippines')));
  await page.locator('#narrator-voice').selectOption('device');
  await page.getByRole('button',{name:content.narratorCopy.preview,exact:true}).click();
  const spoken=await page.evaluate(()=>window.__utterances);
  if(locale){assert.equal(spoken.length,1);assert.equal(spoken[0].lang,locale);assert.equal(spoken[0].voice,'fil-test');assert.equal(spoken[0].text,content.narratorCopy.sample);}
  else{assert.equal(spoken.length,0,'Never fall back to an English voice for Filipino');assert((await page.locator('.voice-settings').innerText()).includes(content.ui.voiceUnavailable));}
  await context.close();console.log('PASS Filipino device narration',locale||'missing voice: helpful message, no English fallback');
 }
}finally{await browser.close();}
