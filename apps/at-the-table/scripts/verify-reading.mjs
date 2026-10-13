import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('screenshots',{recursive:true});
async function check(name){await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}: overflow ${JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>el.scrollWidth>el.clientWidth+1&&el.clientWidth>0).map(el=>({html:el.outerHTML.slice(0,150),width:el.clientWidth,scroll:el.scrollWidth})).slice(0,40)))}`);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)})),[],`${name}: accessibility`);console.log('PASS',name)}
try{
 await page.emulateMedia({colorScheme:'light'});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5174/#mass');
 await page.getByRole('button',{name:/Open lesson list. Lesson/}).click();
 assert(await page.getByRole('dialog').isVisible());
 await page.getByRole('dialog').getByRole('button',{name:/Penitential Act/}).click();
 assert.equal(await page.locator('.reading-hero h1').textContent(),'Penitential Act & Kyrie');
 assert(await page.locator('.spoken-lines').isVisible());
 for(const theme of ['light','dark']){
  if(theme==='dark')await page.getByRole('button',{name:'Use night prayer mode'}).filter({visible:true}).first().click();
  for(const width of [375,768,1280]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));await check(`Penitential ${theme} ${width}`);
   await page.screenshot({path:`screenshots/reading-${theme}-${width}.png`,fullPage:true});
  }
 }
 await page.reload();assert.equal(await page.locator('body').getAttribute('data-reading-theme'),'dark');await page.getByRole('button',{name:/Open lesson list. Lesson/}).click();await page.getByRole('dialog').getByRole('button',{name:/Penitential Act/}).click();
 await page.setViewportSize({width:375,height:812});
 const guidance=page.locator('.practice-guidance li');assert.equal(await guidance.count(),3);assert.equal(await page.locator('.practice-checklist button').count(),0);
 const before=await page.locator('.spoken-line blockquote').first().evaluate(el=>getComputedStyle(el).fontSize);
 await page.getByRole('button',{name:'Increase prayer text size'}).click();
 assert((await page.locator('.spoken-line blockquote').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)))>parseFloat(before));
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Increase prayer text size'}).click();assert(await page.getByRole('button',{name:'Increase prayer text size'}).isDisabled());
 await page.locator('.editorial-notes>summary').click();await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(await page.locator('.term-chips').isVisible());await page.locator('.term-chips summary').first().click();await page.locator('.term-chips details[open] p').waitFor({state:'visible'});await check('expanded notes and largest prayer text');
 await page.getByRole('button',{name:/Mark as explored/}).click();assert.equal(await page.locator('.completion-button').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.tracker-stops .complete').count(),1);
 await page.getByRole('button',{name:/Open lesson list. Lesson/}).click();await page.keyboard.press('Escape');assert(!(await page.getByRole('dialog').isVisible()));
 await page.locator('.spoken-lines').scrollIntoViewIfNeeded();await page.locator('.compact-reading-header.is-visible').waitFor({state:'visible'});assert(await page.locator('.compact-reading-header').evaluate(el=>getComputedStyle(el).opacity==='1'));
 await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});await page.screenshot({path:'screenshots/reading-zoom.png',fullPage:true});await check('200% text zoom');await page.evaluate(()=>{document.documentElement.style.fontSize=''});
 // Narration playback is verified separately against the generated recordings.
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.completion-button').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 await page.getByRole('button',{name:/Open lesson list. Lesson/}).click();
 await page.getByRole('dialog').getByRole('button',{name:/Gloria/}).click();await check('Gloria dark mobile');
 assert.deepEqual(errors,[]);console.log('PASS themes, zoom, participation guidance, prayer sizes, sheet keyboard dismissal, sticky header, completion, and reduced motion');
}finally{await browser.close()}
