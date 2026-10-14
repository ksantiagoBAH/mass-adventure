import {chromium,webkit} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5190/rosary/';
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
for(const property of ['og:title','og:description','og:url','og:image','og:image:alt','og:image:width','og:image:height'])assert.ok(html.includes(`property="${property}"`),property);
assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
const png=readFileSync(new URL('../public/share-card.png',import.meta.url));assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
mkdirSync('output',{recursive:true});
for(const engine of [chromium,webkit]){
 const browser=await engine.launch(engine===chromium?{channel:'chrome',headless:true}:{headless:true});
 for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();
  await page.goto(base);const footer=page.locator('.rosary-footer');await footer.scrollIntoViewIfNeeded();
  assert.ok((await footer.innerText()).includes('Created by Kenny & Edith Santiago'));
  assert.ok(await footer.locator('a[href="../"]').count());assert.ok(await footer.locator('a[href="../at-the-table/"]').count());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const axe=await new AxeBuilder({page}).include('.rosary-footer').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[]);
  await footer.screenshot({path:`output/footer-${engine.name()}-${width}.png`});
  await footer.getByRole('link',{name:'Divine Mercy Chaplet'}).click();await page.getByRole('button',{name:'Start Chaplet'}).click();
  assert.equal(await footer.isVisible(),false,'Footer stays hidden during meditation');
  const controls=await page.locator('.audio-controls').boundingBox();assert.ok(controls.y+controls.height<=900);
  console.log(`${engine.name()} ${width}: footer links, credit, accessibility, and meditation viewport passed`);await context.close();
 }
 await browser.close();
}
console.log('Sharing metadata and 1200×630 preview image passed.');
