// Produce exact localized scripts for the offline multilingual audio authoring tool.
import {readFile,writeFile} from 'node:fs/promises';
import ts from 'typescript';
const source=(await readFile(new URL('../src/data/massParts.ts',import.meta.url),'utf8')).replaceAll('import.meta.env.BASE_URL','"./"');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {getMassContent}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const scripts={};
for(const language of ['es','pl']){
 const c=getMassContent(language);
 scripts[language]=[
  {id:'preview',text:c.narratorCopy.sample},
  ...c.sections.flatMap(s=>s.parts.map(p=>({id:p.id,text:c.getNarrationText(p)}))),
  ...Object.entries(c.responsePractice).map(([id,p])=>({id:`response-${id}`,text:p.cue})),
  ...c.churchDiscoveries.map(p=>({id:`explorer-${p.id}`,text:p.text})),
 ].map(clip=>{
  const sentences=[...new Intl.Segmenter(language,{granularity:'sentence'}).segment(clip.text)].map(s=>s.segment.trim());
  const segments=[];
  for(const sentence of sentences){
   if(sentence.length>350)throw new Error(`Split a long sentence: ${language} ${clip.id}`);
   if(segments.length && `${segments.at(-1)} ${sentence}`.length<=200)segments[segments.length-1]+=` ${sentence}`;
   else segments.push(sentence);
  }
  return {...clip,segments};
 });
}
if(!process.argv[2])throw new Error('Provide an output JSON path in your temporary authoring folder.');
await writeFile(process.argv[2],JSON.stringify(scripts,null,2)+'\n');
console.log('Exported 38 clips per language.');
