import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.env.TEST_URL || 'http://127.0.0.1:4173/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:820,height:1000}});
const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400) failed.push(r.url());});
const time=new Date('2026-10-10T18:00:00Z');
await page.clock.install({time});await page.clock.pauseAt(new Date(time.getTime()+1000));
await page.goto(base);
await mkdir('output/lesson-animations',{recursive:true});
await page.getByRole('button',{name:'Start the Mass Adventure',exact:true}).click();
const counts=[6,8,10,2],seen=[],samples=[];
let frameCount=0;const usedPoses=new Set();
for(let stop=0;stop<4;stop++) {
 if(stop) await page.getByRole('button',{name:'Adventure Map',exact:true}).first().click();
 await page.locator('.map-stop').nth(stop).click();
 for(let part=0;part<counts[stop];part++) {
  const svg=page.locator('.storybook-lesson');
  if(await svg.count()) {
   const id=await svg.getAttribute('data-part');seen.push(id);
   const duration=Number(await svg.getAttribute('data-duration'));
   assert(duration>=9 && duration<=20);
   await page.evaluate(()=> {
    window.__frameChecks=[];window.__usedPoses=new Set();
    window.__checking=true;
    const tick=()=> {
     if(!window.__checking) return;
     const svg=document.querySelector('.storybook-lesson');
     const images=[...svg.querySelectorAll('image')];
     const book=svg.querySelector('.lesson-book');
     const bookAnchored=!book || book.getAttribute('transform')==='translate(183 375)';
     for(const image of images) if(Number(image.getAttribute('opacity'))>0) window.__usedPoses.add(image.getAttribute('href').split('/').pop());
     const sequences=[...svg.querySelectorAll('.pose-sequence')];
     const normalized=sequences.every(group=>Math.abs([...group.querySelectorAll('image')].reduce((sum,image)=>sum+Number(image.getAttribute('opacity')),0)-1)<.000001);
     const finite=normalized&&images.every(im=>['x','y','width','height'].every(key=>Number.isFinite(Number(im.getAttribute(key)))));
     window.__frameChecks.push({time:Number(svg.dataset.sceneTime),finite:finite&&bookAnchored,invalid:/NaN|Infinity/.test(svg.innerHTML)});
     requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
   });
   for(const fraction of [.25,.5,.75,1]) {
    await page.clock.runFor(duration*250+8);
    const current=Number(await svg.getAttribute('data-scene-time'));
    assert(Math.abs(current-duration*fraction)<.1,`${id} advances smoothly to ${fraction}`);
    if(['gospel','gifts','consecration','peace','blessing','dismissal'].includes(id)) {
     samples.push({id,fraction,svg:await svg.evaluate(el=>el.outerHTML)});
    }
   }
   await page.clock.runFor(40);
   const checks=await page.evaluate(()=> {window.__checking=false;return window.__frameChecks;});
   frameCount+=checks.length;for(const pose of await page.evaluate(()=>[...window.__usedPoses])) usedPoses.add(pose);
   assert(checks.every(c=>c.finite&&!c.invalid),`${id} has finite image positions and anchored books in every frame`);
   assert.equal(await svg.getAttribute('data-complete'),'true');
   const end=await svg.getAttribute('data-scene-time');await page.clock.runFor(400);
   assert.equal(await svg.getAttribute('data-scene-time'),end,`${id} finishes and holds`);
   if(id==='gifts') {
    assert.equal(await svg.locator('.gift-bearer').count(),2);
    assert.equal(await svg.locator('.priest-in-front-of-altar').count(),1);
    assert.equal(await svg.locator('.priest-at-altar').count(),0);
    assert((await svg.locator('image').first().getAttribute('href')).endsWith('procession/church.jpg'));
    assert.equal(await svg.locator('.gift-bearer[data-facing=congregation]').count(),2);
   } else if(id==='peace') assert.equal(await svg.locator('.peace-greeting').count(),1);
   else if(id==='gospel') assert.equal(await svg.locator('.gospel-thumb-gesture[data-site=heart]').count(),1);
   else if(id==='communion') assert.equal(await svg.locator('.communion-reception[data-phase=consume]').count(),1);
   else assert(await svg.locator('image').evaluateAll(images=>images.every(im=>!im.getAttribute('href').includes('child')&&!im.getAttribute('href').includes('sign-of-cross'))),`${id} has no foreground children`);
   const woman=['first','psalm','second'].includes(id);
   assert(await svg.locator(id==='gospel'?'.gospel-thumb-gesture':id==='communion'?'.communion-reception':woman?'.lesson-reader':'.lesson-priest').count()>0,`${id} includes the correct speaker`);
   if(['first','psalm','second','homily'].includes(id)) {
    assert.equal(await svg.locator(woman?'.reader-at-ambo':'.priest-at-ambo').count(),1);
    assert.equal(await svg.locator('.lesson-book').getAttribute('data-spine-x'),'183');
    assert.equal(await svg.locator('.lesson-book').getAttribute('data-spine-y'),'375');
   }
   await page.getByRole('button',{name:'Replay scene',exact:true}).click();
   assert.equal(await svg.getAttribute('data-complete'),'false');
   assert(Number(await svg.getAttribute('data-scene-time'))<.1);
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(()=>document.querySelector('.storybook-lesson')?.dataset.complete==='true');
   assert.equal(await svg.getAttribute('data-motion'),'reduced');
   const still=await svg.evaluate(el=>el.innerHTML);await page.clock.runFor(1000);
   assert.equal(await svg.evaluate(el=>el.innerHTML),still,`${id} reduced-motion pose stays still`);
   for(const width of [320,390,820]) {
    await page.setViewportSize({width,height:1000});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id} fits ${width}px`);
   }
   await page.setViewportSize({width:820,height:1000});
   await page.emulateMedia({reducedMotion:'no-preference'});
   console.log(`PASS ${id}: motion frames, final hold, replay, reduced motion, responsive layout`);
  }
  if(part<counts[stop]-1) await page.getByRole('button',{name:'Next part',exact:true}).click();
 }
}
assert.equal(seen.length,24);assert.equal(new Set(seen).size,24);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
for(const pose of ['peace-reach','peace-contact','communion-ready-mid','communion-receive-mid','communion-mouth-mid','child-bread-turn-back','child-bread-turn-front','child-wine-turn-back','child-wine-turn-front','priest-host-mid','priest-cup-mid','priest-chalice-mid','priest-blessing-mid']) assert(usedPoses.has(pose+'.webp'),pose+' is displayed during playback');
await page.clock.resume();
await page.setViewportSize({width:1440,height:1000});
await page.setContent(`<style>body{margin:16px;background:#fffaf0;font-family:sans-serif}.grid{display:grid;grid-template-columns:repeat(4,340px);gap:12px}svg{width:340px;height:221px}p{margin:0;text-align:center}.pose-sequence > image{mix-blend-mode:plus-lighter}</style><div class="grid">${samples.map(c=>`<div>${c.svg}<p>${c.id}: ${c.fraction*100}%</p></div>`).join('')}</div>`);
await page.locator('.grid').screenshot({path:'output/lesson-animations/key-sequences-review.png'});
console.log(`PASS all 24 new lessons; ${frameCount} animation frames; no browser errors.`);
await browser.close();
