import type {RefObject} from 'react';
import {useLanguage} from '../Language';
import {Illustration} from '../Illustration';
import type {Page} from '../study';
export default function LessonHub({onNavigate,headingRef,compact=false}:{onNavigate:(page:Page)=>void;headingRef?:RefObject<HTMLHeadingElement|null>;compact?:boolean}){
 const {t}=useLanguage();
 const lessons=[{page:'map' as Page,title:t('The Catholic Mass'),detail:t('Understand the celebration, its prayers, and your part in it.'),meta:t('28 guided lessons'),art:'church' as const,label:t('Explore the Mass')},{page:'bible' as Page,title:t('Books of the Bible'),detail:t('Explore Scripture’s library through book discoveries and hands-on activities.'),meta:t('73 books · 4 activities'),art:'bible' as const,label:t('Explore the Bible')},{page:'journey' as Page,title:t('The OCIA journey'),detail:t('Learn about Christian initiation and the path you share with your parish.'),meta:t('Guidance & common questions'),art:'sun' as const,label:t('Explore OCIA')}];
 return <section className={`lesson-hub ${compact?'compact':'page'}`}>
  {compact?<div className="lesson-hub-heading"><p className="eyebrow">{t('LEARN · UNDERSTAND AND EXPLORE')}</p><h2>{t('Choose your learning path.')}</h2></div>:<div className="page-heading"><p className="eyebrow">{t('YOUR OCIA LEARNING SPACE')}</p><h1 ref={headingRef} tabIndex={-1}>{t('Faith, one lesson at a time.')}</h1><p>{t('Choose a subject to explore. Each has its own page, and you can return whenever you like.')}</p></div>}
  <div className="lesson-hub-grid">{lessons.map((lesson,index)=><button className="lesson-hub-card" key={lesson.page} onClick={()=>onNavigate(lesson.page)}><span className="lesson-hub-number">0{index+1}</span><Illustration kind={lesson.art} alt={lesson.title}/><span className="eyebrow">{lesson.meta}</span><h2>{lesson.title}</h2><p>{lesson.detail}</p><strong>{lesson.label} →</strong></button>)}</div>
 </section>;
}
