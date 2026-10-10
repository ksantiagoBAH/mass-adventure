"""Offline Filipino authoring with OmniVoice. Models never ship to the browser.
Requires the temporary MLX Audio/Whisper environment described in README.
"""
import argparse, hashlib, json, os, re, subprocess, unicodedata
from pathlib import Path
from difflib import SequenceMatcher
parser=argparse.ArgumentParser();parser.add_argument('--runtime',required=True);parser.add_argument('--only',nargs='*');args=parser.parse_args()
root=Path(__file__).resolve().parent.parent;runtime=Path(args.runtime).resolve()
os.environ['HF_HOME']=str(runtime/'model-cache')
import mlx.core as mx
import numpy as np
from mlx_audio.tts.utils import load_model
from mlx_audio.tts.models.omnivoice.utils import create_voice_clone_prompt
from mlx_audio.audio_io import write,read
import mlx_whisper
MODEL='mlx-community/OmniVoice-bfloat16';STEPS=48
model=load_model(MODEL)
def transcribe(path):return mlx_whisper.transcribe(str(path),path_or_hf_repo='mlx-community/whisper-large-v3-turbo',language='tl',condition_on_previous_text=False)['text'].strip()
def words(text):
 text=unicodedata.normalize('NFKD',text.lower()).replace('jesus','hesus').replace('massadventure','mass adventure').replace('pamilyang','pamilya ng').replace('maligay ang','maligayang').replace('pagka-diyos','pagkadiyos').replace('prosisyon','prusisyon').replace('biblia','bibliya').replace('homilia','homiliya').replace('homilya','homiliya').replace('diakono','diyakono').replace('credo','kredo').replace('cordero','kordero').replace('eukaristya','eukaristiya').replace('maari','maaari').replace('na konsagra','nakonsagra').replace('kumunyon','komunyon').replace('sumain niyo','sumainyo').replace('sumain nyo','sumainyo')
 # ng and nang are homophones; ASR spelling does not distinguish the audio.
 return ['nang' if word=='ng' else word for word in re.findall(r'\w+',text)]
def checks(expected,spoken):
 a=words(expected);b=words(spoken)
 ratio=SequenceMatcher(None,a,b,autojunk=False).ratio()
 core={'katawan','dugo','kaluluwa','pagkadiyos','diyos','hesus','eukaristiya','konsekrasyon','tunay','naroroon','naroon','nakonsagra'}
 doctrine=(set(a)&core)<=set(b)
 # ASR may omit the linking -g in a title such as Panalanging Eukaristiko.
 first_matches=bool(a and b and (a[0]==b[0] or a[0]==b[0]+'g'))
 boundary=bool(first_matches and a[-1]==b[-1])
 return round(ratio,3),doctrine,boundary
reference=runtime/'filipino-reference.wav'
if not reference.exists():
 # Design a synthetic native Filipino voice; no human recording or cloning input.
 reftext='Sama-sama tayong maglakbay. Sa Misa, nagtitipon tayo bilang pamilya ng Diyos.'
 mx.random.seed(17)
 result=next(model.generate(reftext,language='fil',instruct='Female, young adult, warm, calm, native Filipino accent, clear speech.',duration_s=9,num_steps=STEPS))
 write(str(reference),np.asarray(result.audio),result.sample_rate)
ref_tokens=create_voice_clone_prompt(str(reference),tokenizer=model.audio_tokenizer);mx.eval(ref_tokens)
processed=runtime/'filipino-reference-processed.wav';write(str(processed),np.asarray(model.audio_tokenizer.decode(ref_tokens).astype(mx.float32)),24000)
ref_text=transcribe(processed);print('REFERENCE',ref_text,flush=True)
reportpath=runtime/'filipino-quality.json';report=json.loads(reportpath.read_text()) if reportpath.exists() else {}
scripts=json.loads((runtime/'scripts.json').read_text())['fil']
manifestpath=root/'src/generated/narration-fil.json';manifest=json.loads(manifestpath.read_text()) if manifestpath.exists() else {}
out=root/'public/audio/fil';out.mkdir(parents=True,exist_ok=True)
refhash=hashlib.sha256(reference.read_bytes()).hexdigest()
for clip in scripts:
 if args.only and clip['id'] not in args.only:continue
 fingerprint=hashlib.sha256(json.dumps([MODEL,refhash,ref_text,STEPS,'short-v2' if clip['id']=='explorer-tabernacle' else 'v1',clip['text']],ensure_ascii=False).encode()).hexdigest()[:12]
 # Short passages preserve complete delivery in this lower-resource language.
 sentences=re.split(r'(?<=[.!?])\s+',clip['text']);segments=[]
 limit=60 if clip['id']=='explorer-tabernacle' else 150
 for sentence in sentences:
  if not sentence:continue
  if segments and len(segments[-1]+' '+sentence)<=limit:segments[-1]+=' '+sentence
  else:segments.append(sentence)
 chunks=[np.zeros(2400,dtype=np.float32)]
 for index,text in enumerate(segments):
  key=f'{clip["id"]}/{fingerprint}/{index}';wav=runtime/f'fil-{clip["id"]}-{fingerprint}-{index}.wav'
  success=False;best_entry=None;best_samples=None
  for attempt in range(6):
   if attempt==0 and wav.exists() and key in report:
    entry=report[key];samples,sr=read(str(wav))
    entry['similarity'],entry['doctrine_ok'],entry['boundary_ok']=checks(text,entry['transcribed'])
   else:
    mx.random.seed(int(hashlib.sha256(key.encode()).hexdigest()[:8],16)+997*attempt)
    result=next(model.generate(text,language='fil',ref_tokens=ref_tokens,ref_text=ref_text,duration_s=max(2.2,len(text)/[11,12,10,13,11,12][attempt]),num_steps=STEPS,guidance_scale=[2,2,2.5,2,1.5,3][attempt]))
    samples=np.asarray(result.audio);sr=result.sample_rate;candidate=runtime/'fil-candidate.wav';write(str(candidate),samples,sr)
    spoken=transcribe(candidate);score,doctrine,boundary=checks(text,spoken)
    entry={'expected':text,'transcribed':spoken,'similarity':score,'doctrine_ok':doctrine,'boundary_ok':boundary,'attempt':attempt}
    print('CHECK',key,attempt,score,spoken,flush=True)
   rank=lambda e:(e['doctrine_ok'] and e['boundary_ok'],e['similarity'])
   if best_entry is None or rank(entry)>rank(best_entry):best_entry=entry.copy();best_samples=samples
   if entry['similarity']>=.90 and entry['doctrine_ok'] and entry['boundary_ok'] and np.isfinite(samples).all() and np.max(np.abs(samples))>.001:
    success=True;write(str(wav),samples,24000);report[key]=entry;reportpath.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');break
  if not success:
   entry=best_entry;samples=best_samples
   write(str(wav),samples,24000);report[key]=entry;reportpath.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
   raise RuntimeError(f'Review passage {key}: {entry}')
  chunks.extend([samples,np.zeros(4800,dtype=np.float32)])
 combined=runtime/f'fil-{clip["id"]}-{fingerprint}.wav';write(str(combined),np.concatenate(chunks),24000)
 filename=f'{clip["id"]}-{fingerprint}.mp3'
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(combined),'-af','atempo=0.97,loudnorm=I=-18:TP=-2:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',str(out/filename)],check=True)
 manifest[clip['id']]={'text':clip['text'],'file':f'audio/fil/{filename}'}
 temp=manifestpath.with_suffix('.json.tmp');temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');temp.replace(manifestpath)
 print('READY',clip['id'],flush=True)
print('Filipino recordings complete.',flush=True)
