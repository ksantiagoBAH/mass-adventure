import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();
async function check(label){await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label}: overflow`);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)})),[],`${label}: accessibility`);console.log('PASS',label)}
try{
 await page.emulateMedia({colorScheme:'dark'});await page.goto(process.env.TEST_URL||'http://127.0.0.1:5174/#home');assert.equal(await page.locator('body').getAttribute('data-reading-theme'),'dark');
 for(const theme of ['dark','light']){
  if(theme==='light')await page.locator('.global-theme-toggle').click();
  for(const width of [375,768,1280]){
   await page.setViewportSize({width,height:900});
   for(const route of ['home','map','journey','resources']){
    await page.goto(`${process.env.TEST_URL||'http://127.0.0.1:5174'}/#${route}`);assert.equal(await page.locator('body').getAttribute('data-reading-theme'),theme);assert(await page.locator('.global-theme-toggle').isVisible());await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert.deepEqual(await page.evaluate(()=>[getComputedStyle(document.documentElement).backgroundColor,getComputedStyle(document.body).backgroundColor]),Array(2).fill(theme==='dark'?'rgb(16, 19, 28)':'rgb(248, 245, 239)'));await check(`${route} ${theme} ${width}`);
   }
  }
 }
 await page.setViewportSize({width:1280,height:1800});await page.goto(`${process.env.TEST_URL||'http://127.0.0.1:5174'}/#home`);await page.locator('.global-theme-toggle').click();await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(await page.evaluate(()=>document.body.getBoundingClientRect().height<innerHeight));assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(16, 19, 28)');await page.screenshot({path:'screenshots/home-dark-tall.png',fullPage:true});await page.locator('.global-theme-toggle').click();console.log('PASS tall home canvas below footer matches dark theme');
 await page.reload();assert.equal(await page.locator('body').getAttribute('data-reading-theme'),'light');await page.emulateMedia({colorScheme:'dark'});assert.equal(await page.locator('body').getAttribute('data-reading-theme'),'light');console.log('PASS global theme persistence and explicit override of system preference');
}finally{await browser.close()}
