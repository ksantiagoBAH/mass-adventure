import type {Lesson} from './content';
import type {SpokenMoment} from './spoken';
export function prayerScript(original:SpokenMoment):SpokenMoment {
 return {...original,lines:original.lines.flatMap(line=>{
  if(!line.exact||!line.text.startsWith('PRIEST:'))return [line];
  return line.text.split('\n').map(text=>({...line,speaker:text.startsWith('PEOPLE:')?'We respond · Form B':'Priest · Form B',text:text.replace(/^(PRIEST|PEOPLE):\s*/,'')}));
 })};
}
export function narrationScript(lesson:Lesson,words:SpokenMoment){
 return [{text:`What happens? ${lesson.summary}`,label:'What happens?',row:-1},
 {text:`Why does it matter? ${lesson.meaning}`,label:'Why does it matter?',row:-1},
 {text:`What do I do? ${lesson.practice}`,label:'What do I do?',row:-1},
 {text:`Now, pray with the Church using these words${words.intro?`: ${words.intro}`:'.'}`,label:'What we say',row:-1},
 ...words.lines.map((line,row)=>({text:`${line.speaker.replaceAll(' · ', ', ')}: ${line.text}`,label:line.speaker,row})),
 ...(words.note?[{text:`A note about this part of Mass. ${words.note}`,label:'Prayer notes',row:-1}]:[])];
}
