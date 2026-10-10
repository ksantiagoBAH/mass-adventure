"""Offline authoring only: MLX speech generation, then local transcription checks.
Install mlx-audio==0.5.8 and mlx-whisper==0.4.3 in an isolated Python environment.
Export scripts with scripts/export-narration.mjs first. No models run in the app.
"""
import argparse, hashlib, json, os, subprocess, time, unicodedata, re
from pathlib import Path
from difflib import SequenceMatcher
parser=argparse.ArgumentParser()
parser.add_argument('--runtime',required=True)
parser.add_argument('--root',default=str(Path(__file__).resolve().parent.parent))
parser.add_argument('--language',choices=['es','pl','all'],default='all')
parser.add_argument('--only',nargs='*')
args=parser.parse_args()
runtime=Path(args.runtime).resolve();root=Path(args.root).resolve()
os.environ['HF_HOME']=str(runtime/'model-cache')
import mlx.core as mx
import numpy as np
from mlx_audio.tts.utils import load_model
from mlx_audio.audio_io import write, read
import mlx_whisper
MODEL='mlx-community/chatterbox-multilingual-v3'
PARAMS={'cfg_weight':0.0,'exaggeration':0.25,'temperature':0.7,'repetition_penalty':1.2}
SPEED=0.95
scripts=json.loads((runtime/'scripts.json').read_text())
reference=runtime/'reference.wav'
if not reference.exists():
 english=json.loads((root/'src/generated/narration.json').read_text())['preview']['file']
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(root/'public'/english),'-t','10','-ar','24000','-ac','1',str(reference)],check=True)
reference_hash=hashlib.sha256(reference.read_bytes()).hexdigest()
model=load_model(MODEL)
english_conds=model.prepare_conditionals(str(reference),24000,PARAMS['exaggeration'])
def normalize(text):
 return re.findall(r'\w+', ''.join(c for c in unicodedata.normalize('NFKD',text.lower().replace('massadventure','mass adventure').replace('padrenuestro','padre nuestro')) if not unicodedata.combining(c)))
def boundaries_ok(expected,spoken):
 a=normalize(expected);b=normalize(spoken)
 if not a or not b:return False,False
 matcher=SequenceMatcher(None,a,b,autojunk=False)
 extra_tail=matcher.get_opcodes()[-1][0]=='insert'
 return a[:1]==b[:1], a[-1:]==b[-1:] and not extra_tail

def doctrine_ok(expected,spoken):
 a=set(normalize(expected));b=set(normalize(spoken))
 critical={'cuerpo','sangre','alma','divinidad','realmente','cialo','krew','dusza','bostwo','prawdziwie','mszy','eucharystii','eucharystia','kielich'}
 return (a & critical)<=b

report_path=runtime/'quality-report-turbo.json'
report=json.loads(report_path.read_text()) if report_path.exists() else {}
for language in (['es','pl'] if args.language=='all' else [args.language]):
 voice_reference=reference
 params_base=PARAMS
 if language=='pl':
  voice_reference=runtime/'reference-pl.wav'
  if not voice_reference.exists():
   mx.random.seed(42)
   bootstrap=next(model.generate(scripts['pl'][0]['segments'][0],conds=english_conds,lang_code='pl',verbose=False,**PARAMS))
   write(str(voice_reference),np.asarray(bootstrap.audio)[:240000],24000)
  params_base={**PARAMS,'cfg_weight':0.3}
 reference_hash=hashlib.sha256(voice_reference.read_bytes()).hexdigest()
 conds=model.prepare_conditionals(str(voice_reference),24000,PARAMS['exaggeration'])
 out_dir=root/'public/audio'/language;out_dir.mkdir(parents=True,exist_ok=True)
 manifest_path=root/f'src/generated/narration-{language}.json'
 manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
 for clip in scripts[language]:
  if args.only and clip['id'] not in args.only:continue
  started=time.time()
  fingerprint=hashlib.sha256(json.dumps([MODEL,reference_hash,params_base,SPEED,clip['text']],ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:12]
  filename=f"{clip['id']}-{fingerprint}.mp3";output=out_dir/filename
  chunks=[np.zeros(2400,dtype=np.float32)]
  for index,text in enumerate(clip['segments']):
   key=f"{language}/{clip['id']}/{fingerprint}/{index}"
   wav=runtime/f"{language}-{clip['id']}-{fingerprint}-{index}.wav"
   best_samples=None;best_entry=None
   for attempt in range(6):
    if attempt==0 and wav.exists():
     samples,sr=read(str(wav));assert sr==24000
    else:
     mx.random.seed((int(hashlib.sha256(key.encode()).hexdigest()[:8],16))+attempt*997)
     weights=[0.3,0.25,0.4,0.3,0.2,0.5] if language=='pl' else [0.0,0.0,0.25,0.4,0.0,0.3]
     params={**params_base,'temperature':[0.7,0.65,0.7,0.65,0.75,0.6][attempt],'cfg_weight':weights[attempt]}
     result=next(model.generate(text,conds=conds,lang_code=language,max_new_tokens=1000,verbose=False,**params))
     samples=np.asarray(result.audio);sr=result.sample_rate;duration=len(samples)/sr
     if duration<0.5 or duration>45 or not np.isfinite(samples).all() or np.max(np.abs(samples))<0.001:
      continue
    candidate=runtime/'candidate.wav'
    write(str(candidate),samples,sr)
    if attempt==0 and key in report:
     entry=report[key]
     entry['beginning_ok'],entry['ending_ok']=boundaries_ok(text,entry['transcribed'])
     entry['doctrine_ok']=doctrine_ok(text,entry['transcribed'])
    else:
     transcription=mlx_whisper.transcribe(str(candidate),path_or_hf_repo='mlx-community/whisper-large-v3-turbo',language=language,condition_on_previous_text=False)['text'].strip()
     similarity=SequenceMatcher(None,normalize(text),normalize(transcription),autojunk=False).ratio()
     expected_words=normalize(text);spoken_words=normalize(transcription)
     beginning_ok,ending_ok=boundaries_ok(text,transcription)
     entry={'expected':text,'transcribed':transcription,'similarity':round(similarity,3),'duration':len(samples)/sr,'attempt':attempt,'ending_ok':ending_ok,'beginning_ok':beginning_ok,'doctrine_ok':doctrine_ok(text,transcription)}
     print(f"CHECK {key} attempt {attempt}: {similarity:.3f} {transcription}",flush=True)
    if best_entry is None or (entry.get('ending_ok',False) and entry.get('beginning_ok',False) and entry.get('doctrine_ok',False),entry['similarity'])>(best_entry.get('ending_ok',False) and best_entry.get('beginning_ok',False) and best_entry.get('doctrine_ok',False),best_entry['similarity']):
     best_samples=samples;best_entry=entry
    if best_entry['similarity']>=0.90 and best_entry.get('ending_ok',False) and best_entry.get('beginning_ok',False) and best_entry.get('doctrine_ok',False):break
   if best_samples is None:raise RuntimeError(f'Invalid segment: {key}')
   write(str(wav),best_samples,24000)
   report[key]=best_entry;report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
   if best_entry['similarity']<0.90 or not best_entry.get('ending_ok',False) or not best_entry.get('beginning_ok',False) or not best_entry.get('doctrine_ok',False):
    raise RuntimeError(f"Review low-confidence segment {key}: {best_entry}")
   samples=best_samples
   chunks.extend([samples,np.zeros(4800,dtype=np.float32)])
  combined=runtime/f'{language}-{clip["id"]}-{fingerprint}.wav'
  write(str(combined),np.concatenate(chunks),24000)
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(combined),'-af',f'atempo={SPEED},loudnorm=I=-18:TP=-2:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',str(output)],check=True)
  manifest[clip['id']]={'text':clip['text'],'file':f'audio/{language}/{filename}'}
  temporary=manifest_path.with_suffix('.json.tmp')
  temporary.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
  temporary.replace(manifest_path)
  print(f"READY {language} {clip['id']} ({time.time()-started:.1f}s)",flush=True)
print('Generation complete. Review flagged pronunciation, then run narration tests.',flush=True)
