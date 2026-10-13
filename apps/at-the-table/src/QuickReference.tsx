import {useEffect,useRef} from 'react';
import {useLanguage} from './Language';
import {wordsFor} from './study';
import {PrayerCopyright} from './LessonExperience';
const prayerIds=['cross','greeting','penitential','gloria','creed','sanctus','memorial','our-father','lamb','communion','dismissal'];
export default function QuickReference({mode,onOpen,onMap}:{mode:'visit'|'prayers';onOpen:(unit:number,index:number)=>void;onMap:()=>void}){
 const {locale,t,units,questions}=useLanguage();
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true})},[mode]);
 const lessons=units.flatMap((u,ui)=>u.lessons.map((l,li)=>({l,ui,li})));
 function open(id:string){const found=lessons.find(({l})=>l.id===id);if(found)onOpen(found.ui,found.li);}
 const communion=lessons.find(({l})=>l.id==='communion')!.l;
 return <section className="page narrow quick-reference"><button className="text-button" onClick={onMap}>{t('← Back to Mass map')}</button><div className="page-heading"><p className="eyebrow">{t('Quick guides')}</p><h1 ref={heading} tabIndex={-1}>{t(mode==='visit'?'Your first Mass':'Prayer quick reference')}</h1><p>{t(mode==='visit'?'Come as you are. Learn with your parish, at your own pace.':'Use your parish worship aid for the prayers and responses used at this Mass.')}</p></div>
 {mode==='visit'?<>
 <article className="path-note"><h2>{questions[1][0]}</h2><p>{questions[1][1]}</p><button className="text-button" onClick={()=>open('entrance')}>{lessons.find(({l})=>l.id==='entrance')!.l.title} →</button></article>
 <article className="path-note"><h2>{questions[3][0]}</h2><p>{questions[3][1]}</p><button className="text-button" onClick={()=>open('cross')}>{lessons.find(({l})=>l.id==='cross')!.l.title} →</button></article>
 <article className="path-note"><h2>{communion.title}</h2><p>{communion.practice}</p><p>{communion.note}</p><button className="text-button" onClick={()=>open('communion')}>{t('Explore this lesson')} →</button></article>
 <article className="path-note"><h2>{t('Take one small step')}</h2><p>{units[3].lessons[1].practice}</p><button className="primary" onClick={()=>open('entrance')}>{t('Start learning')} →</button></article>
 </>:<div className="reference-prayers">{prayerIds.map(id=>{const entry=lessons.find(({l})=>l.id===id)!;const words=wordsFor(locale,id);return <details key={id}><summary>{entry.l.title}</summary><div className="reference-prayer-body">{words.intro&&<p>{words.intro}</p>}{words.lines.map((line,i)=><div className="reference-response" key={i}><strong>{line.speaker}</strong>{line.exact?<blockquote>{line.text}</blockquote>:<p>{line.text}</p>}</div>)}{words.note&&<p>{words.note}</p>}{words.lines.some(line=>line.exact)&&<PrayerCopyright/>}<button className="text-button" onClick={()=>onOpen(entry.ui,entry.li)}>{t('Explore this lesson')} →</button></div></details>})}</div>}
 </section>;
}
