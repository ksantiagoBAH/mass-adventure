import { createContext, useContext, useEffect, useId, useState } from "react";
import { useMassContent } from "../hooks/useMassContent";
import { CartoonArm, rightShoulder } from "./StorybookCharacters";
import { lessonFrameRatios } from "../data/lessonFrameRatios";

export const lessonDurations: Record<string, number> = {
  greeting: 9, penitential: 10, gloria: 10, collect: 10,
  first: 11, psalm: 10, second: 11, alleluia: 10, gospel: 15, homily: 11, creed: 10, faithful: 10,
  gifts: 20, offerings: 10, eucharistic: 12, sanctus: 10, consecration: 16, amen: 10,
  ourfather: 12, peace: 11, lamb: 12, communion: 15, blessing: 13, dismissal: 20,
};
const base = `${import.meta.env.BASE_URL}artwork/`;
const clamp = (v:number) => Math.max(0,Math.min(1,v));
const smooth = (v:number) => {v=clamp(v);return v*v*(3-2*v);};
const mix = (a:number,b:number,t:number) => a+(b-a)*t;
type PoseFrame = {at:number;pose:string};
const AnimationTime = createContext({time:0, duration:0});
const numberedFrames = (prefix:string,count:number) => Array.from({length:count},(_,i)=>`${prefix}-${i+1}`);
const childWalk = numberedFrames("child-walk",8);
const priestWalk = numberedFrames("priest-walk",8);
let framesPreloaded=false;
function preloadCartoonFrames() {
  if(framesPreloaded) return;
  framesPreloaded=true;
  for(const pose of [...childWalk,...priestWalk,...numberedFrames("priest-blink",3),"reader",...numberedFrames("reader-blink",3),...numberedFrames("peace-cel",8),...numberedFrames("communion-cel",8),"child-gifts-back","child-bread-turn-back","child-bread-turn-front","child-wine-turn-back","child-wine-turn-front","child-gifts","child-gifts-wine"]) {
    const image=new Image(); image.src=`${base}lessons/${pose}.webp`;
  }
}
// Walk drawings play on twos, while travel and breathing remain continuous.
function walkFrame(poses:string[],time:number,offset=0) {return poses[(Math.floor(time*12)+offset)%poses.length];}
function WalkCycle({poses,time,offset=0,x,y,height,priest=false}:{poses:string[];time:number;offset?:number;x:number;y:number;height:number;priest?:boolean}) {
  const active=walkFrame(poses,time,offset);
  return <g className="pose-sequence walk-cycle" data-walk-frame={active}>
    {poses.map(pose=>priest?<Priest key={pose} pose={pose} x={x} y={y} height={height} opacity={pose===active?1:0} />
      :<ScenePair key={pose} pose={pose} x={x} y={y} height={height} ratio={lessonFrameRatios[pose]} opacity={pose===active?1:0} />)}
  </g>;
}
function blinkFrame(time:number,duration:number) {
  if(time>=duration) return 1;
  const phase=(time+1.4)%4.8;
  return phase<.075?2:phase<.15?3:phase<.225?2:1;
}
function activePoses(frames:PoseFrame[],time:number) {
  let index=0;
  while(index<frames.length-2 && time>=frames[index+1].at) index++;
  const from=frames[index],to=frames[index+1];
  if(from.pose===to.pose) return [{pose:from.pose,opacity:1}];
  // Hold the outgoing drawing opaque. Long two-sided fades expose the
  // church through the characters and make moving faces look doubled.
  const blendDuration=Math.min(.16,to.at-from.at);
  const progress=smooth((time-(to.at-blendDuration))/blendDuration);
  if(progress===0) return [{pose:from.pose,opacity:1}];
  if(progress===1) return [{pose:to.pose,opacity:1}];
  return [{pose:from.pose,opacity:1},{pose:to.pose,opacity:progress}];
}
function Priest({pose="priest-prayer",x=770,y=675,height=450,opacity=1}:{pose?:string;x?:number;y?:number;height?:number;opacity?:number}) {
  const {time,duration}=useContext(AnimationTime);
  if(pose==="priest-prayer") pose=`priest-blink-${blinkFrame(time,duration)}`;
  const heightScale=pose==="priest-host"?1.14:pose==="priest-host-cel-4" || pose==="priest-cup-cel-4"?1.06:1;
  const h=height*heightScale;
  const width=h*lessonFrameRatios[pose];
  const breath=time<duration?1+Math.sin(time*Math.PI/2)*.0025:1;
  return <image className="lesson-priest" href={`${base}lessons/${pose}.webp`} x={x-width/2} y={y-h} width={width} height={h} opacity={opacity}
    transform={`translate(0 ${y*(1-breath)}) scale(1 ${breath})`} />;
}
function Reader() {
  const {time,duration}=useContext(AnimationTime);
  const frame=blinkFrame(time,duration);
  const id=useId().replaceAll(":","");
  // The blink sheets crop the crown. Keep the complete original silhouette
  // and register only their eyelids over the original face, with soft edges.
  return <g className="reader-character" data-blink-frame={frame} transform="translate(112.24 205) scale(1.04)">
    <defs>
      <radialGradient id={`${id}-eye-edge`}>
        <stop offset="0.75" stopColor="white" /><stop offset="1" stopColor="black" />
      </radialGradient>
      <mask id={`${id}-eyes`} maskUnits="userSpaceOnUse" x="0" y="0" width="188" height="500">
        <ellipse cx="76" cy="70" rx="16" ry="13" fill={`url(#${id}-eye-edge)`} />
        <ellipse cx="114" cy="70" rx="16" ry="13" fill={`url(#${id}-eye-edge)`} />
      </mask>
    </defs>
    <image className="lesson-reader" href={`${base}lessons/reader.webp`} x="0" y="0" width="188" height="500" />
    <image className="reader-eyes" href={`${base}lessons/reader-blink-${frame}.webp`} x="1" y="27.5" width="186" height="450" mask={`url(#${id}-eyes)`} />
  </g>;
}
function Book({x,y,turn=0}:{x:number;y:number;turn?:number}) {
  // Congregation view: exterior covers face us; the page hinges toward the reader.
  const width=-68*Math.cos(turn*Math.PI),curl=12*Math.sin(turn*Math.PI);
  const leaf=`M0 1Q${width*.55} ${-5-curl} ${width} ${-10-curl}L${width} ${-7-curl}Q${width*.55} ${-2-curl} 0 4Z`;
  return <g className="lesson-book" transform={`translate(${x} ${y})`} data-spine-x={x} data-spine-y={y} data-page-progress={turn.toFixed(3)} strokeLinejoin="round">
    <ellipse cy="21" rx="77" ry="4" fill="#573b24" opacity=".22" />
    <path d="M-75-10L-5 2Q0 5 5 2L75-10V9L5 20Q0 23-5 20L-75 9Z" fill="#975c30" stroke="#6f4529" strokeWidth="2" />
    <path d="M-73-12L0 0 73-12V-8L0 4-73-8Z" fill="#f6e7c4" stroke="#c9b490" strokeWidth="1" />
    <path d="M0 4V21" stroke="#6f4529" strokeWidth="2" />
    {turn>0 && turn<1 && <path className="turning-page" d={leaf} fill={turn<.5?"#fff2d3":"#edddba"} stroke="#c9b490" strokeWidth="1" />}
  </g>;
}
function GiftBearer({time,lane,wine=false}:{time:number;lane:number;wine?:boolean}) {
  const walk=smooth(time/12),turn=smooth((time-12)/2);
  const front=turn>=.5;
  const x=mix(562+lane*58,562+lane*88,walk);
  const height=mix(280,170,walk),feet=mix(752,518,walk);
  const sway=time<12?Math.sin(time*5.5+lane)*.012*Math.sin(Math.PI*walk):0;
  const bob=time<12?Math.sin(time*11+lane)*1.4*Math.sin(Math.PI*walk):0;
  const frames=[{at:12,pose:"child-gifts-back"},{at:12.65,pose:wine?"child-wine-turn-back":"child-bread-turn-back"},
    {at:13.35,pose:wine?"child-wine-turn-front":"child-bread-turn-front"},{at:14,pose:wine?"child-gifts-wine":"child-gifts"}];
  return <g className="gift-bearer" data-gift={wine?"wine":"bread"} data-facing={front?"congregation":"altar"}
    data-walk-progress={walk.toFixed(3)} data-turn-progress={turn.toFixed(3)}
    transform={`translate(${x} ${feet+bob}) rotate(${sway*180/Math.PI})`}>
    {time<12?<WalkCycle poses={childWalk} time={time} offset={lane>0?4:0} x={0} y={0} height={height} />
      :<PoseSequence frames={frames} time={time} x={0} y={0} height={height} />}
  </g>;
}
function ScenePair({pose,x,y,height,ratio,opacity=1}:{pose:string;x:number;y:number;height:number;ratio:number;opacity?:number}) {
  const width=height*ratio;
  return <image href={`${base}lessons/${pose}.webp`} x={x-width/2} y={y-height} width={width} height={height} opacity={opacity} />;
}
function PoseSequence({frames,time,x,y,height,ratio,priest=false}:{frames:PoseFrame[];time:number;x:number;y:number;height:number;ratio?:number;priest?:boolean}) {
  const active=activePoses(frames,time),poses=[...new Set(frames.map(frame=>frame.pose))];
  return <g className="pose-sequence" style={{isolation:"isolate"}} data-active-poses={active.map(frame=>frame.pose).join(",")}>
    {[...poses.filter(pose=>!active.some(frame=>frame.pose===pose)),...active.map(frame=>frame.pose)].map(pose=> {
      const opacity=active.find(frame=>frame.pose===pose)?.opacity || 0;
      return priest?<Priest key={pose} pose={pose} x={x} y={y} height={height} opacity={opacity} />
        :<ScenePair key={pose} pose={pose} x={x} y={y} height={height} ratio={ratio || lessonFrameRatios[pose]} opacity={opacity} />;
    })}
  </g>;
}
// Keep the anatomy and host contact together in each complete drawing.
// In particular, hold the palm-contact drawing before the priest withdraws.
const communionFrames:PoseFrame[]=[
  {at:0,pose:"communion-cel-1"},
  {at:1.4,pose:"communion-cel-1"},
  {at:1.8,pose:"communion-cel-2"},
  {at:2.3,pose:"communion-cel-3"},
  {at:4.2,pose:"communion-cel-3"},
  {at:4.6,pose:"communion-cel-4"},
  {at:5.05,pose:"communion-cel-5"},
  {at:6.2,pose:"communion-cel-5"},
  {at:6.65,pose:"communion-cel-6"},
  {at:8,pose:"communion-cel-6"},
  {at:8.45,pose:"communion-cel-7"},
  {at:8.9,pose:"communion-cel-8"},
];
function CommunionReception({time:t}:{time:number}) {
  return <g className="communion-reception" data-phase={t>=8.9?"consume":t>=6.65?"received":t>=5.05?"contact":t>=2.3?"amen":"bow"}>
    <PoseSequence frames={communionFrames} time={t} x={562} y={548} height={310} ratio={590/710} />
  </g>;
}
function GospelThumb({time}:{time:number}) {
  const sites=[{name:"forehead",x:130,y:62},{name:"lips",x:130,y:94},{name:"heart",x:130,y:130}];
  const step=Math.min(2,Math.floor(time/4.5)),local=Math.min(4.5,time-step*4.5);
  const site=sites[step],next=sites[Math.min(2,step+1)];
  const points=[{t:0,x:site.x,y:site.y},{t:.6,x:site.x,y:site.y-4},{t:1.4,x:site.x,y:site.y+4},
    {t:1.8,x:site.x,y:site.y},{t:2.2,x:site.x-4,y:site.y},{t:2.8,x:site.x+4,y:site.y},
    {t:3.2,x:site.x,y:site.y},{t:4,x:site.x,y:site.y},{t:4.5,x:next.x,y:next.y}];
  let index=0;while(index<points.length-2 && local>points[index+1].t) index++;
  const from=points[index],to=points[index+1],progress=smooth((local-from.t)/(to.t-from.t));
  const tip={x:mix(from.x,to.x,progress),y:mix(from.y,to.y,progress)};
  return <g className="gospel-thumb-gesture" data-site={site.name} data-thumb-x={tip.x} data-thumb-y={tip.y} transform="translate(210 0) scale(3)">
    <circle cx="130" cy="126" r="111" fill="#e5eff5" />
    <image href={`${base}sign-of-cross/child.webp`} x="90" y="42" width="80" height="200" preserveAspectRatio="none" />
    <CartoonArm shoulder={{x:154,y:113}} hand={{x:162,y:180}} left />
    <CartoonArm shoulder={rightShoulder} hand={{x:tip.x+3,y:tip.y+17}} handOpacity={0} />
    {sites.map((s,i)=> {
      const vertical=step>i?1:step===i?clamp((local-.6)/.8):0;
      const horizontal=step>i?1:step===i?clamp((local-2.2)/.6):0;
      return <g key={s.name} className="gospel-small-cross" data-site={s.name} data-vertical={vertical.toFixed(3)} data-horizontal={horizontal.toFixed(3)} fill="none" strokeLinecap="round">
        {[{d:`M${s.x} ${s.y-4}v8`,progress:vertical},{d:`M${s.x-4} ${s.y}h8`,progress:horizontal}].map((line,n)=><g key={n} opacity={line.progress>0?1:0}>
          <path d={line.d} stroke="#fff5ce" strokeWidth="3" strokeDasharray="8" strokeDashoffset={8*(1-line.progress)} />
          <path d={line.d} stroke="#ac7832" strokeWidth="1.5" strokeDasharray="8" strokeDashoffset={8*(1-line.progress)} />
        </g>)}
      </g>;
    })}
    <image href={`${base}lessons/thumb.webp`} x={tip.x-2} y={tip.y} width="12" height="19" />
  </g>;
}
function Chalice({x,y,scale=1}:{x:number;y:number;scale?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#9a6620" strokeWidth="2.5" fill="#dfb553">
    <path d="M-20-28H20Q18 1 0 2-18 1-20-28Z" /><path d="M-3 0H3V23H-3Z" /><ellipse cy="26" rx="20" ry="5" fill="#f2cc73" /><path d="M-10-21Q-10-8-3-4" fill="none" stroke="#fff0aa" />
  </g>;
}
function Paten({x,y}:{x:number;y:number}) {
  return <g><ellipse cx={x} cy={y} rx="38" ry="7" fill="#dfb657" stroke="#9a702b" strokeWidth="2" /><ellipse cx={x} cy={y-5} rx="19" ry="5" fill="#fff6e4" stroke="#d2c09c" strokeWidth="1.5" /></g>;
}
function HostFingers({right=false}:{right?:boolean}) {
  return <g className="host-fingers" transform={right?"scale(-1 1)":undefined} stroke="#a86945" strokeWidth="1.2" strokeLinejoin="round">
    <path d="M-29 27Q-32 16-28 5L-26-7Q-25-13-20-12-15-11-17-4L-19 11Q-14 17-13 27Z" fill="#eab184" />
    <path d="M-25-7Q-22-10-19-7L-20-2Q-22 0-25-2Z" fill="#f8d4b7" strokeWidth=".8" />
    <path d="M-29 27Q-32 22-33 16" fill="none" />
  </g>;
}
function useSceneTime(duration:number) {
  const [time,setTime]=useState(0),[reduced,setReduced]=useState(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(()=> {
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed=()=>setReduced(media.matches);media.addEventListener("change",changed);
    return ()=>media.removeEventListener("change",changed);
  },[]);
  useEffect(()=> {
    if(reduced) {setTime(duration);return;}
    let frame=0,last=0,elapsed=0;setTime(0);
    const tick=(now:number)=> {
      if(!document.hidden && last) elapsed=Math.min(duration,elapsed+Math.min((now-last)/1000,.08));
      last=now;setTime(elapsed);
      if(elapsed<duration) frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(frame);
  },[duration,reduced]);
  return {time,reduced};
}

export function StorybookLessonScene({partId,alt}:{partId:string;alt:string}) {
  useEffect(preloadCartoonFrames,[]);
  const duration=lessonDurations[partId],{time:t,reduced}=useSceneTime(duration);
  const id=useId().replaceAll(":",""),{parishArtwork}=useMassContent();
  const womanReading=["first","psalm","second","faithful"].includes(partId);
  const reading=womanReading || ["gospel","homily"].includes(partId);
  const bookAtAmbo=["alleluia","creed","offerings","eucharistic","sanctus","consecration","amen","ourfather","lamb"].includes(partId);
  const standing=partId==="dismissal";
  const fullChurch=standing || ["gifts","peace","communion"].includes(partId);
  const background=fullChurch?`${base}procession/church.jpg`:(reading || bookAtAmbo)?`${base}lessons/sanctuary-no-book.webp`:parishArtwork.sanctuary.src;
  const zoom=fullChurch?1:mix(1,1.055,smooth(t/(duration*.8)));
  const pageTurn=smooth((t-2.5)/2);
  function backdrop() {
    if(partId==="gospel") return <rect width="1200" height="780" fill="#edf1dc" />;
    return <image href={background} x="0" y="0" width="1200" height="780" preserveAspectRatio="xMidYMid slice" />;
  }
  function atAltar(pose="priest-prayer",opacity=1) {
    return <g className="priest-at-altar" clipPath={`url(#${id}-altar)`}><Priest pose={pose} opacity={opacity} /></g>;
  }
  function priestSequence(frames:PoseFrame[]) {
    return <g className="priest-at-altar" clipPath={`url(#${id}-altar)`}><PoseSequence frames={frames} time={t} x={770} y={675} height={450} priest /></g>;
  }
  function content() {
    if(partId==="gospel") return <GospelThumb time={t} />;
    if(reading) return <>{partId==="faithful" && atAltar()}<g className={womanReading?"reader-at-ambo":"priest-at-ambo"} data-speaker={womanReading?"woman":"priest"}>
      {womanReading?<Reader />:<Priest x={210} y={725} height={520} />}
      <g clipPath={`url(#${id}-ambo)`}>{backdrop()}</g>
      <Book x={183} y={375} turn={pageTurn} />
      <g className="ambo-microphone" fill="none" stroke="#302a25" strokeLinecap="round">
        <path d="M116 393L133 347Q143 327 163 316L181 308" strokeWidth="5" />
        <path d="M178 309L190 304" strokeWidth="11" />
        <path d="M179 307L188 303" stroke="#625a50" strokeWidth="3" />
      </g>
    </g></>;
    if(partId==="dismissal") {
      const walk=smooth(t/14),moving=t<14;
      return <g transform={`translate(0 ${moving?Math.sin(t*5)*.8:0})`}>
        {moving?<WalkCycle poses={priestWalk} time={t} x={mix(590,600,walk)} y={mix(530,742,walk)} height={mix(300,470,walk)} priest />
          :<Priest x={600} y={742} height={470} />}
      </g>;
    }
    if(partId==="gifts") return <><g className="priest-in-front-of-altar"><Priest x={562} y={480} height={235} /></g><GiftBearer time={t} lane={-1} /><GiftBearer time={t} lane={1} wine /></>;
    if(partId==="peace") {
      const frames=[{at:0,pose:"peace-cel-1"},{at:1.5,pose:"peace-cel-1"},
        ...numberedFrames("peace-cel",8).slice(1).map((pose,i)=>({at:1.5+(i+1)*.22,pose}))];
      return <><Priest x={562} y={480} height={235} /><g className="peace-greeting" data-phase={t>=3?"greeting":"approach"}>
        <PoseSequence frames={frames} time={t} x={600} y={740} height={345} ratio={621/874} />
      </g></>;
    }
    if(partId==="communion") return <CommunionReception time={t} />;
    if(partId==="consecration") {
      return priestSequence([{at:0,pose:"priest-prayer"},{at:1,pose:"priest-prayer"},
        ...numberedFrames("priest-host-cel",4).map((pose,i)=>({at:1.2+i*.4,pose})),
        {at:6,pose:"priest-host-cel-4"},{at:6.3,pose:"priest-host-cel-3"},{at:6.6,pose:"priest-host-cel-2"},
        {at:6.9,pose:"priest-host-cel-1"},{at:7.2,pose:"priest-prayer"},{at:8,pose:"priest-prayer"},
        ...numberedFrames("priest-cup-cel",4).map((pose,i)=>({at:8.2+i*.4,pose}))]);
    }
    if(partId==="amen") return priestSequence([{at:0,pose:"priest-prayer"},{at:1,pose:"priest-prayer"},{at:1.75,pose:"priest-chalice-mid"},{at:2.5,pose:"priest-chalice"}]);
    if(partId==="blessing") return priestSequence([{at:0,pose:"priest-prayer"},{at:1,pose:"priest-prayer"},{at:1.75,pose:"priest-blessing-mid"},{at:2.5,pose:"priest-blessing"}]);
    if(partId==="lamb") {
      const fraction=smooth((t-3)/2);
      return <>{atAltar()}<g className="host-fraction" transform="translate(770 388)">
        <g transform={`translate(${-fraction*13} 0)`}><path d="M0-27A27 27 0 0 0 0 27Z" fill="#fff6e4" stroke="#cdbb98" strokeWidth="2" /><HostFingers /></g>
        <g transform={`translate(${fraction*13} 0)`}><path d="M0-27A27 27 0 0 1 0 27Z" fill="#fff6e4" stroke="#cdbb98" strokeWidth="2" /><HostFingers right /></g>
        <ellipse cy="47" rx="45" ry="8" fill="#ddb556" stroke="#a47430" strokeWidth="2" />
      </g></>;
    }
    if(["offerings","eucharistic"].includes(partId)) return <>{atAltar()}<Paten x={680} y={439} /><Chalice x={880} y={415} scale={.85} /></>;
    return atAltar();
  }
  return <AnimationTime.Provider value={{time:t,duration}}><svg className="storybook-lesson" viewBox="0 0 1200 780" role="img" aria-label={alt}
    data-part={partId} data-duration={duration} data-scene-time={t.toFixed(2)} data-motion={reduced?"reduced":"full"} data-complete={t>=duration}>
    <defs>
      <clipPath id={`${id}-altar`}><rect width="1200" height="439" /></clipPath>
      <clipPath id={`${id}-ambo`}><rect x="0" y="390" width="370" height="390" /></clipPath>
    </defs>
    <g transform={`translate(600 390) scale(${zoom}) translate(-600 -390)`}>{backdrop()}{content()}{bookAtAmbo && <Book x={183} y={375} turn={pageTurn} />}</g>
  </svg></AnimationTime.Provider>;
}
