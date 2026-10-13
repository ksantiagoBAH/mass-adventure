import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{const Original=window.Audio;window.testClips=[];window.Audio=class extends Original {constructor(...args){super(...args);window.testClips.push(this)}}});
const base=process.env.TEST_URL||'http://127.0.0.1:5174';
try {
 await mkdir('screenshots',{recursive:true});await page.goto(base+'/#home');
 await page.getByLabel('Language / Idioma').selectOption('tl');
 assert.equal(await page.locator('html').getAttribute('lang'),'tl');assert.match(await page.locator('h1').innerText(),/Unawain ang Misa/);
 for (const theme of ['light','dark']) {
  if(theme==='dark')await page.locator('.global-theme-toggle').click();
  for(const width of [320,375,768,1280]) {
   await page.setViewportSize({width,height:900});
   for(const route of ['home','map','journey','resources']) {
    await page.goto(base+'/#'+route);await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} ${theme} ${width}: overflow`);
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[],`${route} ${theme} ${width}: accessibility`);
   }
  }
 }
 await page.setViewportSize({width:375,height:900});await page.goto(base+'/#home');await page.screenshot({path:'screenshots/tagalog-home-mobile.png',fullPage:true});
 await page.goto(base+'/#map');let total=0;
 for(let unit=0;unit<4;unit++) {
  await page.locator('.map-card').nth(unit).click();
  const count=await page.locator('.lesson-rail .reading-list li').count();
  for(let lesson=0;lesson<count;lesson++) {
   assert.equal(await page.locator('.audio-player').count(),0);assert.equal(await page.locator('.follow-control').count(),0);
   assert.equal(await page.getByRole('heading',{name:'Ano ang nangyayari?',exact:true}).count(),1);
   assert.equal(await page.getByRole('heading',{name:'Ang sinasabi natin',exact:true}).count(),1);
   assert(await page.locator('.spoken-lines').innerText());
   assert(!/Nasa Ingles pa|sa Ingles/.test(await page.locator('.spoken-lines').innerText()));
   if(await page.locator('.spoken-line.exact').count())assert.match(await page.locator('.prayer-credit').innerText(),/Tekstong Filipino.*Our Parish Priest/);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));total++;
   if(unit===1&&lesson===0)assert.match(await page.locator('.guiding-question').first().innerText(),/Lumang Tipan.*Mga Gawa.*Bagong Tipan/s);
   if(unit===1&&lesson===2)assert.match(await page.locator('.guiding-question').first().innerText(),/Bagong Tipan/);
   if(unit===1&&lesson===6)assert.match(await page.locator('.spoken-lines').innerText(),/banal na Simbahang Katolika/);
   if(unit===0&&lesson===4)assert.match(await page.locator('.spoken-lines').innerText(),/pinasasalamatan ka namin/);
   if(unit===2&&lesson===5)assert.match(await page.locator('.spoken-lines').innerText(),/wakas ng panahon/);
   if(unit===2&&lesson===7)assert.match(await page.locator('.spoken-lines').innerText(),/Ama namin, sumasalangit ka/);
   if(lesson<count-1)await page.locator('.next-lesson').click();
  }
  await page.locator('.next-lesson').click();assert.match(await page.locator('.quiz h2').innerText(),/natutuhan/);
  for(let q=0;q<2;q++){await page.locator('.quiz fieldset').nth(q).locator('.answer').nth([[0,1],[2,0],[1,2],[0,1]][unit][q]).click();assert.match(await page.locator('.quiz fieldset').nth(q).locator('.feedback').innerText(),/^Tama/)}
  await page.getByRole('button',{name:'Bumalik sa aralin',exact:true}).click();await page.locator('.back-map').click();
 }
 assert.equal(total,28);
 await page.locator('.map-card').first().click();await page.locator('.completion-button').click();
 await page.getByLabel('Language / Idioma').selectOption('en');
 assert.equal(await page.locator('.creator-credit').innerText(),'Created by Kenny & Edith Santiago');
 assert.equal(await page.locator('h1').innerText(),'Entrance & gathering');assert.equal(await page.locator('.completion-button').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.audio-player').count(),1);
 for(const language of ['es','pl','tl','en']){await page.getByLabel('Language / Idioma').selectOption(language);assert.equal(await page.locator('.completion-button').getAttribute('aria-pressed'),'true');assert((await page.locator('.creator-credit').innerText()).includes('Kenny & Edith Santiago'));assert(!(await page.locator('.creator-credit').innerText()).includes('&amp;'))}
 await page.reload();assert.equal(await page.getByLabel('Language / Idioma').inputValue(),'en');
 await page.getByRole('button',{name:'Listen to lesson',exact:true}).click();
 await page.waitForFunction(()=>window.testClips.some(clip=>!clip.paused));
 await page.getByLabel('Language / Idioma').selectOption('tl');
 assert(await page.evaluate(()=>window.testClips.every(clip=>clip.paused&&!clip.getAttribute('src'))),'English audio is released on switching to Tagalog');
 await page.setViewportSize({width:1280,height:900});await page.goto(base+'/#home');await page.screenshot({path:'screenshots/tagalog-home-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS Tagalog routes in both themes at 4 widths, 28 lessons, prayers, quizzes, language persistence and shared progress');
}finally{await browser.close()}
