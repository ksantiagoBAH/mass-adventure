import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const cache = new Map();
function load(name) {
  const filename = path.resolve(name.endsWith('.ts') ? name : `${name}.ts`);
  if (cache.has(filename)) return cache.get(filename);
  const module = { exports: {} }; cache.set(filename, module.exports);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const require = spec => spec.endsWith('.json') ? JSON.parse(fs.readFileSync(path.resolve(path.dirname(filename), spec))) : spec.includes('assets') ? { asset: p => `assets/${p}` } : load(path.resolve(path.dirname(filename), spec));
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, { Date, Object })(require, module, module.exports);
  return module.exports;
}
const { buildRosarySteps, parseRosarySession, advanceAfterNarration, rosaryMedalPlacement } = load('src/domain/rosary');
const { buildChapletSteps, parseChapletSession, advanceChapletAfterNarration } = load('src/domain/chaplet');
test('Rosary preserves 53 Hail Marys, five meditations, optional Fatima, and completion validation', () => {
  for (const set of ['Joyful','Sorrowful','Glorious','Luminous']) {
    const steps = buildRosarySteps(set, true);
    assert.equal(steps.filter(s => s.prayerId === 'hail-mary').length, 53);
    assert.equal(steps.filter(s => s.id.startsWith('mystery-')).length, 5);
    assert.equal(steps.length - buildRosarySteps(set, false).length, 6);
    assert.ok(parseRosarySession({version:2,set,includeFatima:true,position:steps.length}));
    assert.equal(parseRosarySession({version:2,set,includeFatima:true,position:steps.length+1}), null);
    const session = {version:2,set,includeFatima:true,position:0};
    assert.equal(advanceAfterNarration(session, 'stale').position, 0);
    assert.equal(advanceAfterNarration(session, steps[0].id).position, 1);
  }
});
test('Chaplet preserves fifty invocations and ignores stale audio events', () => {
  const session={version:1,includeOpening:true,includeClosing:true,position:0};
  const steps=buildChapletSteps(session);
  assert.equal(steps.filter(s=>s.narrationId==='sorrowful-passion').length,50);
  assert.equal(steps.filter(s=>s.narrationId==='holy-god').length,3);
  assert.equal(steps.length-buildChapletSteps({includeOpening:false,includeClosing:false}).length,5);
  assert.equal(advanceChapletAfterNarration(session,'stale').position,0);
  assert.equal(advanceChapletAfterNarration(session,steps[0].id).position,1);
  assert.equal(parseChapletSession({...session,position:-1}),null);
});
test('Every narration, animation, and artwork binding points to a shipped file', () => {
  for (const name of ['mysteries','recordings','female-recordings','chaplet-recordings','mystery-videos','chaplet-videos']) {
    const source=fs.readFileSync(`src/data/${name}.ts`,'utf8');
    for (const match of source.matchAll(/asset\(["']([^"']+)["']\)/g)) assert.ok(fs.existsSync(`public/assets/${match[1]}`),match[1]);
  }
});
test('Every audio timing matches its exact recording transcript', () => {
 const {recordings}=load('src/data/recordings'); const {femaleRecordings}=load('src/data/female-recordings');
 for (const [catalog,file] of [[recordings,'narration-timings'],[femaleRecordings,'female-narration-timings']]) {
   const timings=JSON.parse(fs.readFileSync(`src/data/${file}.json`));
   for(const [id,recording] of Object.entries(catalog)) { assert.equal(timings[id].transcript,recording.transcript,id); assert.ok(timings[id].words.length>0); }
 }
});

test('Opening Fatima and medal placement match the app, and old saves resume the same prayer', () => {
 for(const set of ['Joyful','Sorrowful','Glorious','Luminous']) {
  const steps=buildRosarySteps(set,true);
  assert.deepEqual(Array.from(steps.slice(6,9), s=>s.id), ['opening-glory','opening-fatima','mystery-0']);
  const old=steps.filter(s=>s.id!=='opening-fatima');
  for(let position=0;position<=old.length;position++) {
   const saved=parseRosarySession({version:1,set,includeFatima:true,position});
   assert.equal(saved.version,2);assert.equal(steps[saved.position]?.id,old[position]?.id);
   assert.equal(parseRosarySession(saved).position,saved.position);
  }
  for(const step of steps) {
   assert.equal(rosaryMedalPlacement(step),step.phase==='opening'?null:step.phase==='closing'||step.mysteryIndex===4?'after':step.mysteryIndex===0?'after-first-bead':null);
  }
 }
});
