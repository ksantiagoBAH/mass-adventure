import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import * as english from './content';
import {spanishUnits,spanishStages,spanishGlossary,spanishQuestions} from './spanish';
import translations from './es-ui.json';
import polishTranslations from './pl-ui.json';
import {polishUnits,polishStages,polishGlossary,polishQuestions} from './polish';
import tagalogTranslations from './tl-ui.json';
import {tagalogUnits,tagalogStages,tagalogGlossary,tagalogQuestions} from './tagalog';
const spanishEucharist='https://www.vatican.va/archive/catechism_sp/p2s2c1a3_sp.html';
export type Locale='en'|'es'|'pl'|'tl';
const LanguageContext=createContext<{locale:Locale;setLocale:(locale:Locale)=>void}>({locale:'en',setLocale:()=>{}});
export function LanguageProvider({children}:{children:ReactNode}){
 const [locale,setLocale]=useState<Locale>(()=>{try{const saved=localStorage.getItem('at-the-table-language');return saved==='es'||saved==='pl'||saved==='tl'?saved:'en'}catch{return 'en'}});
 useEffect(()=>{document.documentElement.lang=locale;try{localStorage.setItem('at-the-table-language',locale)}catch{/* Reading remains available without storage. */}},[locale]);
 return <LanguageContext.Provider value={{locale,setLocale}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){
 const {locale,setLocale}=useContext(LanguageContext);
 const dictionary:Record<string,string>=locale==='tl'?tagalogTranslations:locale==='pl'?polishTranslations:translations;
 const t=(text:string)=>locale==='en'?text:dictionary[text]??text;
 const sources=locale==='tl'?Object.fromEntries(Object.entries(english.sources).map(([key,source])=>[key,{...source,title:({'celebration':'Katekismo · Pagdiriwang ng Eukaristiya','presence':'Katekismo · Sakripisyo, paggunita, at presensiya','communion':'Katekismo · Piging Paskuwal','girm':'USCCB · Pangkalahatang tuntunin sa Misa','ocia':'USCCB · Gabay sa OCIA','baptism':'USCCB · Binyag at pagsisimula sa buhay Kristiyano'} as Record<string,string>)[key]+' (sa Ingles)'}])) as typeof english.sources:locale==='pl'?Object.fromEntries(Object.entries(english.sources).map(([key,source])=>[key,{...source,title:({'celebration':'Katechizm · Celebracja Eucharystii','presence':'Katechizm · Ofiara, pamiątka i obecność','communion':'Katechizm · Uczta paschalna','girm':'USCCB · Ogólne wprowadzenie do Mszału rzymskiego','ocia':'USCCB · Wprowadzenie do OCIA','baptism':'USCCB · Chrzest i wtajemniczenie chrześcijańskie'} as Record<string,string>)[key]+' (po angielsku)'}])) as typeof english.sources:locale==='en'?english.sources:Object.fromEntries(Object.entries(english.sources).map(([key,source])=>[key,{...source,title:({'celebration':'Catecismo · La celebración de la Eucaristía','presence':'Catecismo · Sacrificio, memorial y presencia','communion':'Catecismo · El banquete pascual','girm':'Instrucción General del Misal Romano · Capítulo II','ocia':'USCCB · Introducción a OCIA','baptism':'USCCB · Bautismo e iniciación cristiana'} as Record<string,string>)[key]+(['celebration','presence','communion','girm'].includes(key)?'':' (en inglés)'),url:['celebration','presence','communion'].includes(key)?spanishEucharist:key==='girm'?source.url.replace('usccb.org/','usccb.org/es/'):source.url}])) as typeof english.sources;
 return {locale,setLocale,t,units:locale==='tl'?tagalogUnits:locale==='pl'?polishUnits:locale==='en'?english.units:spanishUnits,stages:locale==='tl'?tagalogStages:locale==='pl'?polishStages:locale==='en'?english.stages:spanishStages,glossary:locale==='tl'?tagalogGlossary:locale==='pl'?polishGlossary:locale==='en'?english.glossary:spanishGlossary,questions:locale==='tl'?tagalogQuestions:locale==='pl'?polishQuestions:locale==='en'?english.questions:spanishQuestions,sources};
}
