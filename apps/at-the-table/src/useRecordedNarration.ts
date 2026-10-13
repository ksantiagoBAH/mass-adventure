import {useEffect,useRef,useState} from 'react';
import manifest from './generated/narration.json';
type Track={text:string;label:string;row:number;file:string;duration:number};
type Recording={voice:string;accent:string;synthetic:boolean;segments:Track[]};
const recordings=manifest as Record<string,Recording>;
export function useRecordedNarration(id:string,script:{text:string}[]){
 const recording=recordings[id];
 const available=!!recording&&recording.segments.length===script.length&&recording.segments.every((track,i)=>track.text===script[i].text);
 const tracks=available?recording.segments:[];
 const offsets=tracks.map((_,i)=>tracks.slice(0,i).reduce((sum,track)=>sum+track.duration,0));
 const total=tracks.reduce((sum,track)=>sum+track.duration,0);
 const [playing,setPlaying]=useState(false);const [position,setPosition]=useState(0);const [time,setTime]=useState(0);const [speed,setSpeed]=useState(1);const [message,setMessage]=useState('');
 const active=useRef<HTMLAudioElement|null>(null);const activeIndex=useRef(-1);const speedRef=useRef(1);const request=useRef(0);const playingRef=useRef(false);const cursor=useRef({index:0,offset:0});
 function release(){const current=active.current;if(current){current.onended=null;current.onerror=null;current.ontimeupdate=null;current.onloadedmetadata=null;current.pause();current.removeAttribute('src');current.load();active.current=null}}
 useEffect(()=>{if(!available){setPlaying(false);setTime(0);setPosition(0)}return()=>{request.current++;playingRef.current=false;release()}},[id,available]);
 function pause(){request.current++;playingRef.current=false;active.current?.pause();setPlaying(false)}
 function fail(){playingRef.current=false;setPlaying(false);setMessage('The recording could not load. Try Listen again.');release()}
 function start(index:number,offset=0){
  if(!available){setMessage('This recording is still being prepared.');return}
  release();const token=++request.current;cursor.current={index,offset};setPosition(index);setTime(offsets[index]+offset);playingRef.current=true;setPlaying(true);setMessage('');
  const clip=new Audio(`${import.meta.env.BASE_URL}${tracks[index].file}`);active.current=clip;activeIndex.current=index;clip.preload='none';clip.playbackRate=speedRef.current;clip.preservesPitch=true;
  clip.onloadedmetadata=()=>{if(active.current===clip&&offset)clip.currentTime=Math.min(offset,clip.duration)};
  clip.ontimeupdate=()=>{if(active.current!==clip)return;cursor.current={index,offset:clip.currentTime};setTime(offsets[index]+clip.currentTime)};
  clip.onended=()=>{if(active.current!==clip)return;if(index<tracks.length-1)start(index+1);else{playingRef.current=false;setPlaying(false);setTime(total);cursor.current={index:0,offset:0};release();setMessage('Listening complete.')}};
  clip.onerror=()=>{if(active.current===clip)fail()};
  void clip.play().catch(()=>{if(token===request.current&&active.current===clip)fail()});
 }
 function play(){
  if(active.current&&activeIndex.current===cursor.current.index){const token=++request.current;playingRef.current=true;setPlaying(true);setMessage('');void active.current.play().catch(()=>{if(token===request.current)fail()});return}
  start(cursor.current.index,cursor.current.offset);
 }
 function seek(seconds:number){const bounded=Math.max(0,Math.min(seconds,total));let index=0;for(let i=0;i<offsets.length;i++){if(offsets[i]<=bounded)index=i;}const offset=bounded-offsets[index];cursor.current={index,offset};setPosition(index);setTime(bounded);if(playingRef.current)start(index,offset);else{release();activeIndex.current=-1}}
 function changeSpeed(value:number){speedRef.current=value;setSpeed(value);if(active.current)active.current.playbackRate=value}
 return {available,playing,position,time,total,speed,message,play,pause,seek,changeSpeed,playSection:(index:number)=>start(index)};
}
export function audioTime(seconds:number){return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`}
