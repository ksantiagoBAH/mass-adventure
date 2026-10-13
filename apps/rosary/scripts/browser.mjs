import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('output', { recursive: true });
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:5178';
for (const engine of ['chromium','webkit']) {
 const browser=await (engine==='chromium' ? chromium.launch({channel:'chrome',headless:true}) : webkit.launch({headless:true}));
 for (const width of [390,768,1440,1920]) {
  const context=await browser.newContext({viewport:{width,height:960},reducedMotion:'reduce'});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base); await page.getByRole('heading',{name:'A moment of peace.'}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${engine} ${width} today overflow`);
  assert.equal(await page.locator('.hero-image').evaluate(e=>getComputedStyle(e).objectFit),'contain');
  await page.screenshot({path:`output/${engine}-${width}-today.png`,fullPage:true});
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${engine} ${width} accessibility`);
  await page.getByRole('button',{name:'Pray the Rosary',exact:false}).click();
  await page.getByRole('button',{name:'Start Rosary'}).click();
  await page.getByRole('heading',{name:'Sign of the Cross',exact:true}).waitFor();
  await page.getByRole('button',{name:'Next prayer',exact:true}).click();
  await page.getByRole('heading',{name:'Apostles’ Creed',exact:true}).waitFor();
  await page.screenshot({path:`output/${engine}-${width}-meditation.png`,fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${engine} ${width} meditation overflow`);
  const sessionAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  assert.deepEqual(sessionAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${engine} ${width} session accessibility`);
  await page.getByRole('button',{name:'Save & exit'}).click(); await page.reload();
  await page.getByRole('button',{name:'Resume saved Rosary'}).click(); await page.getByRole('heading',{name:'Apostles’ Creed',exact:true}).waitFor();
  await page.getByLabel(/^Voice/).selectOption('female');
  assert.match(await page.locator('audio').getAttribute('src'),/female/);
  for (const speed of ['1','1.25','2']) {
    await page.getByLabel(/^Speed/).selectOption(speed);
    await page.waitForFunction(value => document.querySelector('audio')?.playbackRate === Number(value), speed);
  }
  await page.getByRole('button',{name:'Play narration'}).click();
  await page.waitForFunction(()=> { const a=document.querySelector('audio'); return a && !a.paused && a.currentTime>0; });
  await page.getByRole('button',{name:'Pause narration'}).click();
  assert.equal(await page.locator('audio').evaluate(a=>a.paused),true);
  await page.getByRole('button',{name:'Play narration'}).click();
  await page.locator('audio').evaluate(a=>a.dispatchEvent(new Event('ended')));
  await page.getByRole('heading',{name:'Our Father',exact:true}).waitFor();
  assert.equal(await page.getByLabel(/^Speed/).inputValue(),'2');
  await page.getByRole('button',{name:'Save & exit'}).click();
  await page.getByRole('link',{name:'Divine Mercy',exact:false}).click();
  if(width>600){ const video=await page.locator('.chaplet-setup video').boundingBox(); const options=await page.locator('.chaplet-setup .setup-panel').boundingBox(); assert.ok(options.y>=video.y+video.height, 'Chaplet setup text under video'); }
  await page.getByRole('button',{name:'Start Chaplet'}).click();
  const video=await page.locator('.visual-panel video').boundingBox(); const text=await page.locator('.reader').boundingBox(); const controls=await page.locator('.audio-controls').boundingBox(); assert.ok(video.y>=0 && video.y+video.height<=960, 'Chaplet video in viewport'); assert.ok(text.y>=0 && text.y+text.height<=960, 'Chaplet prayer in viewport'); assert.ok(controls.y+controls.height<=960, 'Chaplet controls in viewport');
  for(const speed of ['1','1.25','2']){ await page.getByLabel(/^Speed/).selectOption(speed); await page.waitForFunction(value=>document.querySelector('audio')?.playbackRate===Number(value), speed); }
  await page.getByRole('button',{name:'Next prayer',exact:true}).click(); await page.getByRole('heading',{name:'You expired, Jesus',exact:true}).waitFor();
  await page.getByRole('button',{name:'Save & exit'}).click();
  await page.getByRole('link',{name:'Mysteries',exact:true}).click();
  await page.getByRole('button',{name:'Luminous',exact:true}).click();
  assert.equal(await page.locator('.mystery-card').count(),5);
  await page.locator('.mystery-card').first().click(); await page.getByRole('heading',{name:'The Baptism in the Jordan',exact:true}).waitFor();
  await page.getByRole('link',{name:'Prayers',exact:false}).click();
  assert.equal(await page.locator('.prayer-card').count(),12);
  await page.getByRole('searchbox').fill('Memorare'); assert.equal(await page.locator('.prayer-card').count(),1);
  await page.locator('.prayer-card').click(); await page.getByRole('heading',{name:'Memorare',exact:true}).waitFor();
  assert.deepEqual(errors,[],`${engine} ${width} runtime errors`);
  console.log(`${engine} ${width}: layout, accessibility, resume, voice, playback, auto-advance, chaplet, and libraries passed`);
  await context.close();
 }
 await browser.close();
}
