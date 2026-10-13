import {chromium, webkit} from '../apps/rosary/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('output',{recursive:true});
const base=process.env.TEST_URL || 'http://127.0.0.1:5190/';
for(const engine of [chromium,webkit]){
 const browser=await engine.launch(engine===chromium?{channel:'chrome',headless:true}:{headless:true});
 for(const [width,height] of [[390,844],[390,650],[768,700],[1000,800],[1440,768],[1920,1080]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const devotion of ['rosary','chaplet']){
   await page.goto(`${base}rosary/#${devotion}`);await page.getByRole('button',{name:devotion==='rosary'?'Start Rosary':'Start Chaplet'}).click();
   await page.getByRole('button',{name:'Next prayer'}).click();
   const video=await page.locator('.visual-panel video').boundingBox(),beads=await page.locator('.bead-panel').boundingBox(),text=await page.locator('.reading-panel').boundingBox(),controls=await page.locator('.audio-controls').boundingBox();
   for(const [name,box] of Object.entries({video,beads,text,controls}))assert.ok(box.y>=0&&box.y+box.height<=height+1,`${devotion} ${width}×${height}: ${name} in viewport ${JSON.stringify(box)}`);
   const intersection=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
   assert.equal(intersection(beads,text),0,`${devotion} beads never overlap text`);
   assert.equal(intersection(video,text),0,`${devotion} video never overlaps text`);
   assert.ok(await page.locator('.beads i').first().evaluate(e=>e.getBoundingClientRect().height)>=24);
   assert.ok(await page.locator('.reader').evaluate(e=>e.clientHeight)>=65,`${devotion}: useful reading area`);
   await page.getByRole('button',{name:'Play narration'}).click();
   await page.waitForFunction(()=>document.querySelector('audio')?.currentTime>0);
   await page.waitForTimeout(1200);assert.equal(await page.evaluate(()=>scrollY),0,'Narration scrolls reader, not whole page');
   await page.getByRole('button',{name:'Pause narration'}).click();
   await page.getByText('Prayer contents',{exact:true}).first().click();
   await page.locator('.contents button').filter({hasText:devotion==='rosary'?'Mystery 1':'Decade 1'}).first().click();
   await page.locator('.contents summary').click();
   assert.equal(await page.locator('.beads i').count(),11);
   const decadeBeads=await page.locator('.bead-panel').boundingBox(),decadeText=await page.locator('.reading-panel').boundingBox();
   assert.equal(intersection(decadeBeads,decadeText),0, 'Large decade beads never overlap text');
   await page.screenshot({path:`output/${engine.name()}-${devotion}-${width}-${height}.png`});
   await page.getByRole('button',{name:'Save & exit'}).click();
  }
  assert.deepEqual(errors,[]);console.log(`${engine.name()} ${width}×${height}: both devotions fit; video, text, beads, audio remain visible without overlap`);await context.close();
 }
 const page=await browser.newPage();
 for(const [path,links] of [['',['at-the-table/','rosary/']],['at-the-table/',['../','../rosary/']],['rosary/',['../','../at-the-table/']]]){
  await page.goto(base+path);for(const href of links)assert.ok(await page.locator(`a[href="${href}"], a[href="./${href}"]`).count()>0,`${path} cross-link ${href}`);
 }
 await browser.close();
}
console.log('All three sites are cross-linked.');
