import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {transform} from 'esbuild';
import {readFile} from 'node:fs/promises';
const source=(await readFile('src/data/massParts.ts','utf8')).replaceAll('import.meta.env.BASE_URL','"./"');
const code=(await transform(source,{loader:'ts',format:'esm'})).code;
const {getMassContent}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
// Every displayed text field is translated; these words are shared across languages.
const shared = new Set(['Altar', 'Gloria', 'Psalm', 'Sanctus', 'Amen', 'Amen.']);
const technical = new Set(['id','art','kind','color','src','url','ccc','paragraphs','tint','ink','brand','footer']);
const english = getMassContent('en');
for (const language of ['es','pl']) {
 const localized = getMassContent(language);
 function compare(original, translated, path='') {
  if (typeof original === 'string') {
   assert(typeof translated === 'string' && translated.length, `${language} missing ${path}`);
   if (technical.has(path.split('.').at(-1))) assert.equal(translated, original, `${path} remains stable`);
   else assert(original !== translated || shared.has(original), `${language} untranslated ${path}`);
  } else if (original && typeof original === 'object') {
   for (const [key,value] of Object.entries(original)) compare(value, translated[key], `${path}.${key}`);
  }
 }
 compare(english,localized);
}
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
for(const lang of ['es','pl']) {
 const c=getMassContent(lang);
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__utterances=[];window.__audioRequests=[];
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text}};
  window.speechSynthesis.speak=u=>window.__utterances.push({text:u.text,lang:u.lang});
  window.speechSynthesis.cancel=()=>{};
  window.speechSynthesis.getVoices=()=>[{name:'English',voiceURI:'en',lang:'en-US'},{name:'Spanish',voiceURI:'es',lang:'es-MX'},{name:'Polish',voiceURI:'pl',lang:'pl-PL'}];
  // This suite checks device fallback text; multilingual-narration.mjs checks MP3s.
  window.Audio=undefined;
 });
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5173');
 await page.locator('#app-language').selectOption(lang);
 assert.equal(await page.locator('html').getAttribute('lang'),lang);
 async function check(label){
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),lang+' '+label+' fits phone');
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)})),[],lang+' '+label+' accessibility');
 }
 await check('home');
 await page.screenshot({path:`screenshots/translation-${lang}-home.png`,fullPage:true});
 for(let i=0;i<7;i++)await page.locator('.explorer-hotspot').nth(i).click();
 await page.locator('.explorer-reward button').click();
 assert.equal(await page.locator('.earned-sticker').count(),1);
 await page.getByRole('button',{name:c.ui.keepExploring,exact:true}).click();
 for(let s=0;s<4;s++){
  await page.locator('.map-stop').nth(s).click();
  await check('lesson '+s);
  for(let p=0;p<c.sections[s].parts.length;p++){
   const part=c.sections[s].parts[p];
   assert.equal(await page.locator('.part-title h2').innerText(),part.name);
   assert((await page.locator('.part-body').innerText()).includes(part.happening));
   await page.locator('.part-title .read').click();
   const spoken=await page.evaluate(()=>window.__utterances.at(-1));
   assert(spoken, `Narration missing ${lang} ${part.id}: ${await page.locator('.part-body').innerText()}`);
   assert(spoken.text.includes(c.ui.happening));assert(spoken.lang.startsWith(lang));
   await page.locator('.part-title .read').click();
   assert.equal(await page.evaluate(()=>window.__audioRequests.length),0,'No English recordings in translated lessons');
   if(part.id==='consecration'){
    assert.match(part.happening,lang==='es'?/Cuerpo, Sangre, alma y divinidad/:/Ciało, Krew, dusza i Bóstwo/);
    await page.screenshot({path:`screenshots/translation-${lang}-consecration.png`,fullPage:true});
   }
   if(p<c.sections[s].parts.length-1)await page.getByRole('button',{name:c.ui.nextPart,exact:true}).click();
   else await page.getByRole('button',{name:c.ui.miniQuiz,exact:true}).click();
  }
  await check('quiz '+s);
  for(let q=0;q<3;q++){
   const answer=c.sections[s].quiz[q].answer;
   await page.locator('.answers button').nth((answer+1)%3).click();
   assert((await page.locator('.feedback').innerText()).includes(c.copy.retry));
   await page.locator('.answers button').nth(answer).click();
   await page.getByRole('button',{name:q===2?c.ui.collect:c.ui.nextQuestion,exact:true}).click();
  }
  await page.getByRole('button',{name:c.ui.seeSticker,exact:true}).click();
  assert.equal(await page.locator('.earned-sticker').count(),s+2);
  await page.getByRole('button',{name:c.ui.keepExploring,exact:true}).click();
 }
 await page.getByRole('button',{name:c.copy.labels.parents,exact:true}).first().click();
 assert.equal(await page.locator('dt').count(),26);
 await check('parents');
 await page.locator('#narrator-voice').selectOption(lang);
 await page.getByRole('button',{name:c.narratorCopy.preview,exact:true}).click();
 assert((await page.evaluate(()=>window.__utterances.at(-1).lang)).startsWith(lang));
 await page.getByRole('button',{name:c.copy.labels.stickers,exact:true}).first().click();
 await check('stickers');
 await page.locator('#app-language').selectOption('en');
 assert.equal(await page.locator('.earned-sticker').count(),5,'Switching language keeps progress');
 await page.getByRole('button',{name:'Home',exact:true}).first().click();
 await page.locator('.preview-stop').first().click();
 await page.getByRole('button',{name:'Next part',exact:true}).click();
 await page.locator('#app-language').selectOption(lang);
 assert.equal(await page.locator('.part-title h2').innerText(),c.sections[0].parts[1].name,'Switching mid-lesson keeps current part');
 await page.setViewportSize({width:820,height:1180});await check('tablet');
 assert.deepEqual(errors,[]);
 await context.close();console.log('PASS',lang,'26 lessons, 12 quizzes, 7 discoveries, rewards, narration, language switching, mobile/tablet accessibility');
}
} finally {await browser.close();}
