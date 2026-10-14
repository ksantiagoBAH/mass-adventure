import {useEffect,useState} from 'react';
import type {RefObject} from 'react';
import {useLanguage} from '../Language';
import './prayer.css';
export type Devotion='rosary'|'chaplet'|'mysteries'|'prayers';
const destinations=[{id:'rosary',label:'The Rosary'},{id:'chaplet',label:'Divine Mercy'},{id:'mysteries',label:'Mysteries'},{id:'prayers',label:'Prayer library'}] as const;
function devotionFromHash():Devotion{return destinations.find(d=>d.id===location.hash.split('/')[1])?.id??'rosary'}
export default function Prayer({headingRef}:{headingRef:RefObject<HTMLHeadingElement|null>}){
 const {t,locale}=useLanguage();const [devotion,setDevotion]=useState(devotionFromHash);const [headerHeight,setHeaderHeight]=useState(100);
 useEffect(()=>{const onHash=()=>setDevotion(devotionFromHash());window.addEventListener('hashchange',onHash);const header=document.querySelector('#root>header');const measure=()=>setHeaderHeight(header?.getBoundingClientRect().height??100);measure();const observer=new ResizeObserver(measure);if(header)observer.observe(header);return()=>{window.removeEventListener('hashchange',onHash);observer.disconnect()}},[]);
 return <section className="prayer-space" style={{height:`max(650px, calc(100dvh - ${headerHeight}px - 16px))`}}><div className="prayer-space-heading"><div><p className="eyebrow">{t('PRAY · A QUIET MOMENT WITH GOD')}</p><h1 ref={headingRef} tabIndex={-1}>{t('Make room for prayer.')}</h1></div><a className="prayer-fullscreen-link" href={`../rosary/#${devotion}`} target="_blank" rel="noreferrer">{t('Open full screen')} ↗</a></div>{locale!=='en'&&<p className="prayer-language-note">{t('Guided prayers and narration are currently in English.')}</p>}<nav className="prayer-tabs" aria-label={t('Choose a prayer')}>
 {destinations.map(d=><button key={d.id} aria-current={devotion===d.id?'page':undefined} onClick={()=>{setDevotion(d.id);location.hash=`prayer/${d.id}`}}>{t(d.label)}</button>)}
 </nav><iframe key={devotion} className="prayer-frame" src={`../rosary/?embedded=1#${devotion}`} title={t('Guided prayer')+': '+t(destinations.find(d=>d.id===devotion)!.label)} allow="fullscreen"/></section>
}
