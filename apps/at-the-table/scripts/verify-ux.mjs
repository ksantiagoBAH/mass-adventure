import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.TEST_URL||'http://127.0.0.1:5174';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
await mkdir('screenshots',{recursive:true});
async function check(label){
 await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label}: horizontal overflow`);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)})),[],`${label}: accessibility`);
 console.log('PASS',label);
}
try{
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/#map`);
 await page.getByRole('searchbox').fill('Glory to God');
 assert.equal(await page.locator('.search-results button').count(),1);
 await page.locator('.search-results button').click();assert.equal(new URL(page.url()).hash,'#mass/gloria');
 await page.reload();assert.equal(await page.locator('h1').innerText(),'Gloria');await page.locator('.skip').focus();await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#mass/gloria');assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
 await page.getByRole('button',{name:'Next lesson',exact:false}).click();assert.equal(new URL(page.url()).hash,'#mass/collect');
 await page.goBack();assert.equal(await page.locator('h1').innerText(),'Gloria');await page.goForward();assert.equal(await page.locator('h1').innerText(),'Collect: the opening prayer');
 await page.getByRole('button',{name:'Home',exact:true}).click();
 assert((await page.locator('.resume-card h2').innerText()).includes('Collect'));
 await page.locator('.resume-card .primary').click();assert.equal(new URL(page.url()).hash,'#mass/collect');
 await page.getByRole('button',{name:'Increase reading text size',exact:true}).click();
 const size=await page.locator('.guiding-question p').first().evaluate(el=>getComputedStyle(el).fontSize);
 await page.goto(`${base}/#mass/dismissal`);
 assert.equal(await page.locator('.guiding-question p').first().evaluate(el=>getComputedStyle(el).fontSize),size);
 assert.deepEqual(await page.locator('.practice-guidance li').allTextContents(),['Respond “Thanks be to God.”','Before leaving, choose one concrete way to live the Gospel this week.']);
 await page.getByRole('button',{name:'Mark as explored',exact:true}).click();
 assert.equal(await page.locator('.completion-button').getAttribute('aria-pressed'),'true');
 await page.reload();assert.equal(await page.locator('.completion-button').getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Explore & check',exact:true}).click();assert.equal(new URL(page.url()).hash,'#check/sent');
 await page.reload();assert.equal(await page.locator('h1').innerText(),'Check your understanding');
 const fields=page.locator('fieldset');await fields.nth(0).getByRole('button').nth(0).click();await fields.nth(1).getByRole('button').nth(1).click();
 assert(await page.locator('.section-recap').isVisible());
 await page.goto(`${base}/#mass/not-a-lesson`);assert.equal(await page.locator('.mass-map').count(),1);
 await page.goto(`${base}/#map`);await page.getByRole('searchbox').fill('no-such-lesson-xyz');assert(await page.getByRole('button',{name:'Clear search'}).isVisible());await page.getByRole('button',{name:'Clear search'}).click();assert.equal(await page.getByRole('searchbox').inputValue(),'');
 const locales=[['en','Glory to God'],['es','Gloria a Dios'],['pl','Chwala na wysokosci'],['tl','Luwalhati sa Diyos']];
 for(const [locale,query] of locales){
  await page.goto(`${base}/#map`);await page.getByLabel('Language / Idioma').selectOption(locale);await page.getByRole('searchbox').fill(query);assert(await page.locator('.search-results button').count()>0,`${locale}: prayer search`);
  await page.getByRole('searchbox').fill('');await check(`${locale} mobile map`);
  for(const route of ['home','visit','prayers']){await page.goto(`${base}/#${route}`);await check(`${locale} mobile ${route}`);if(route==='prayers'){await page.locator('.reference-prayers summary').nth(3).click();assert(await page.locator('.reference-prayers details[open] blockquote').isVisible());await check(`${locale} expanded prayer reference`);}}
 }
 await page.getByLabel('Language / Idioma').selectOption('en');
 for(const width of [320,768,1280]){
  await page.setViewportSize({width,height:900});
  for(const route of ['home','map','mass/gloria']){await page.goto(`${base}/#${route}`);await check(`${route} ${width}px`);}
 }
 await page.setViewportSize({width:390,height:844});await page.goto(`${base}/#mass/dismissal`);
 await page.locator('.global-theme-toggle').click();await check('dismissal other theme');
 await page.locator('.practice-guidance').scrollIntoViewIfNeeded();await page.screenshot({path:'screenshots/ux-lesson-mobile.png'});
 await page.goto(`${base}/#map`);await page.screenshot({path:'screenshots/ux-map-mobile.png',fullPage:true});
 await page.setViewportSize({width:1280,height:900});await page.goto(`${base}/#home`);await page.screenshot({path:'screenshots/ux-home-desktop.png',fullPage:true});
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked')}});const blockedPage=await blocked.newPage();await blockedPage.goto(`${base}/#mass/gloria`);await blockedPage.getByRole('button',{name:'Mark as explored',exact:true}).click();assert(await blockedPage.getByText('Explored for this visit',{exact:true}).isVisible());await blocked.close();
 assert.deepEqual(errors,[]);console.log('PASS lesson URLs, history, resume, text preferences, checklist quotes, completion, recaps, search recovery, translated guides, and blocked storage');
}finally{await browser.close()}
