import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../src/content.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {units,catechismReferences,massReference}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const index=JSON.parse(await readFile(new URL('ccc-page-index.json',import.meta.url),'utf8'));
for(const locale of ['en','es','pl','tl']){
 const pages=locale!=='es'?index:JSON.parse(await readFile(new URL('ccc-spanish-page-index.json',import.meta.url),'utf8'));
 let citations=0;
 for(const lesson of units.flatMap(unit=>unit.lessons)){
  const links=catechismReferences(lesson,locale);
  const citationText=link=>link.label.replace(/^(?:CCC|CEC|KKK \(po angielsku\)|Katekismo \(sa Ingles\)) /,'');
  assert.equal(links.map(citationText).join('; '),lesson.ccc,lesson.id);
  for(const link of links){
   const page=pages.pages.find(page=>page.url===link.url);assert(page,`${locale} ${lesson.id}: unverified page`);
   for(const citation of citationText(link).split('; ')){
    const [start,end]=citation.split(/[–-]/).map(Number);
    for(let number=start;number<=(end||start);number++){assert(page.paragraphs.includes(number),`${locale} ${lesson.id}: linked page lacks CCC ${number}`);citations++}
   }
  }
  assert.match(massReference(lesson,locale).label,locale!=='es'?/GIRM \d/:/IGMR \d/);
 }
 console.log(`PASS ${locale}: all 28 lessons, ${citations} cited paragraph occurrences reach verified Vatican pages (checked ${pages.checked}); every lesson has a Mass-instruction source`);
}
