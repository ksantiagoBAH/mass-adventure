import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import ts from 'typescript';
const content=ts.transpileModule(await readFile(new URL('../src/content.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {units:contentUnits,catechismReferences,massReference}=await import(`data:text/javascript;base64,${Buffer.from(content).toString('base64')}`);
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL||'http://127.0.0.1:5174';
await mkdir('screenshots',{recursive:true});
async function check(label){await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} overflows`);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)})),[],`${label} accessibility`);console.log('PASS',label);}
try{
 await page.goto(base);
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await check(`welcome ${width}px`)}
 await page.locator('h1').focus();
 await page.screenshot({path:'screenshots/welcome-desktop.png',fullPage:true});
 await page.locator('.hero .primary').click();
 await check('Mass map desktop');
 await page.getByRole('button',{name:/1.*We gather.*Introductory Rites/}).click();
 await check('lesson desktop');
 await page.getByRole('button',{name:/Mark as explored/}).click();
 await page.reload();
 await assert.equal(await page.locator('.completion-button[aria-pressed=true]').count(),1);
 await page.setViewportSize({width:390,height:844});await check('lesson mobile');await page.locator('h1').focus();await page.screenshot({path:'screenshots/lesson-mobile.png',fullPage:true});
 let count=0;
 const units=[6,8,12,2];
 for(let u=0;u<4;u++){
   await page.getByRole('button',{name:'Mass map',exact:true}).click();
   await check(`Mass map part ${u}`);
   if(u===0){await page.locator('h1').focus();await page.screenshot({path:'screenshots/mass-map-mobile.png',fullPage:true})}
   await page.locator('.map-card').nth(u).click();
   for(let i=0;i<units[u];i++){const lesson=contentUnits[u].lessons[i];const references=[...catechismReferences(lesson),massReference(lesson)];await page.locator('.editorial-notes>summary').click();for(const ref of references){const link=page.getByRole('link',{name:ref.label,exact:true});assert.equal(await link.getAttribute('href'),ref.url);assert(await link.isVisible())}await page.locator('.editorial-notes>summary').click();assert(await page.locator('.lesson h1').textContent());assert.equal(await page.locator('textarea,.reflection-box').count(),0);assert.equal(await page.getByRole('region',{name:'What we say'}).count(),1);assert((await page.locator('.spoken-line').count())>0);assert((await page.locator('.speaker').allTextContents()).every(t=>t.trim()));assert(await page.locator('.spoken-lines').isVisible());await page.locator('.prayer-fold summary').click();await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(!(await page.locator('.spoken-lines').isVisible()));await page.locator('.prayer-fold summary').click();await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert(await page.locator('.spoken-lines').isVisible());const credits=page.locator('.prayer-content>.prayer-credit');const hasText=await page.locator('.spoken-line blockquote').count();assert.equal(await credits.count(),hasText?1:0);if(hasText){assert(await credits.first().isVisible());assert(await credits.last().isVisible());assert((await credits.first().textContent()).includes('© 2010, International Commission on English in the Liturgy Corporation. All rights reserved.'));assert.equal(await page.locator('.prayer-content').evaluate(el=>el.lastElementChild.classList.contains('prayer-credit')),true);}assert.equal(await page.locator('.spoken-lines a[href*="Order-of-Mass"],.spoken-lines a[href*="our-father"],.spoken-lines a[href*="what-we-believe"]').count(),0);if(u===2&&i===7){assert((await page.locator('.spoken-line blockquote').allTextContents()).some(t=>t.includes('Our Father, who art in heaven')));}if(u===0&&i===3){assert((await page.locator('.spoken-line blockquote').allTextContents()).some(t=>t.startsWith('I confess to almighty God')));}if(u===0&&i===4){assert((await page.locator('.spoken-line blockquote').textContent()).endsWith('Amen.'));await check('full Gloria mobile');}if(u===1&&i===6){assert((await page.locator('.spoken-line blockquote').textContent()).includes('consubstantial with the Father'));assert(!(await page.locator('.spoken-line blockquote').textContent()).includes('Continued'));await check('full Creed mobile');}if(u===2&&i===3){assert((await page.locator('.spoken-line blockquote').textContent()).includes('Hosanna in the highest'));}if(u===2&&i===9){assert((await page.locator('.spoken-line blockquote').textContent()).includes('grant us peace'));}await page.locator('.prayer-fold summary').click();count++;if(i<units[u]-1)await page.getByRole('button',{name:'Next lesson'}).click();}
   await page.getByRole('button',{name:'Knowledge check',exact:false}).last().click();
   await check(`quiz ${u}`);
   const fields=page.locator('fieldset');
   await fields.first().getByRole('button').first().click();
   assert(await fields.first().getByRole('status').textContent());
   const answers=[[0,1],[2,0],[1,2],[0,1]][u];
   for(let q=0;q<2;q++)await fields.nth(q).getByRole('button').nth(answers[q]).click();
   assert.equal(await page.getByRole('button',{name:u===3?'Return to Mass map':'Explore the next part',exact:false}).count(),1);
 }
 assert.equal(count,28);
 await page.getByRole('button',{name:'Mass map',exact:true}).click();
 await page.getByLabel('Find a lesson').fill('consecration');
 await page.locator('.search-results button').click();
 assert.equal(await page.locator('.lesson h1').textContent(),'Invocation of the Spirit & consecration');
 await page.getByRole('button',{name:'OCIA & help',exact:true}).click();await check('OCIA mobile');
 await page.locator('summary').first().click();assert(await page.locator('details[open] p').isVisible());
 await page.getByRole('button',{name:'Sources & guidance',exact:false}).click();await check('resources mobile');
 await page.getByRole('button',{name:'Home',exact:true}).click();await page.setViewportSize({width:390,height:844});await page.locator('h1').focus();await page.screenshot({path:'screenshots/welcome-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS all 28 lessons, all quizzes, search, saved progress, navigation, absence of reflection UI, and console');
}finally{await browser.close()}
