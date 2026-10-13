import {units, type Unit} from './content';
import {spoken} from './spoken';
import {spanishSpoken} from './spanishSpoken';
import {polishSpoken} from './polishSpoken';
import {tagalogSpoken} from './tagalogSpoken';
import {prayerScript} from './reading';
import type {Locale} from './Language';
export type Page='home'|'map'|'mass'|'journey'|'resources'|'visit'|'prayers';
export type Route={page:Page;unitIndex:number;lessonIndex:number;quiz:boolean};
export function readRoute(hash=location.hash):Route {
 const [page,id]=hash.slice(1).split('/');
 const base:Route={page:'home',unitIndex:0,lessonIndex:0,quiz:false};
 if(page==='mass'&&id){for(const [ui,unit] of units.entries()){const li=unit.lessons.findIndex(l=>l.id===id);if(li>=0)return {...base,page:'mass',unitIndex:ui,lessonIndex:li};}return {...base,page:'map'};}
 if(page==='check'){const ui=units.findIndex(u=>u.id===id);return ui>=0?{...base,page:'mass',unitIndex:ui,lessonIndex:units[ui].lessons.length-1,quiz:true}:{...base,page:'map'};}
 return ['home','map','mass','journey','resources','visit','prayers'].includes(page)?{...base,page:page as Page}:base;
}
export function wordsFor(locale:Locale,id:string){return prayerScript(({en:spoken,es:spanishSpoken,pl:polishSpoken,tl:tagalogSpoken})[locale][id]);}
const aliases:Record<string,string>={
 'our-father':'Our Father Lord’s Prayer Padre Nuestro Ojcze nasz Ama Namin',
 creed:'Creed Nicene Apostles profession of faith Credo Wierzę en Dios sumasampalataya',
 penitential:'Confiteor I confess Kyrie Yo confieso Spowiadam się Ako ay nagkukumpisal',
 gloria:'Gloria Glory to God Gloria a Dios Chwała na wysokości Luwalhati sa Diyos',
 consecration:'Epiclesis consecration transubstantiation konsekracja epikleza konsagrasyon',
 lamb:'Agnus Dei Lamb of God Cordero de Dios Baranku Boży Kordero ng Diyos',
};
const normalize=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
export function findLessons(localUnits:Unit[],locale:Locale,query:string){
 const phrase=normalize(query.trim());
 return localUnits.flatMap((u,ui)=>u.lessons.map((l,li)=>({l,ui,li,unit:u.title}))).filter(({l,unit})=>{
  const words=wordsFor(locale,l.id);
  const text=normalize([l.title,l.summary,l.meaning,l.practice,l.note||'',unit,aliases[l.id]||'',words.intro||'',words.note||'',...words.lines.map(line=>line.text)].join(' '));
  return text.includes(phrase);
 });
}
