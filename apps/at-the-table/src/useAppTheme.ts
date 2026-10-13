import {useEffect,useRef,useState} from 'react';
export function useAppTheme(){
 const [theme,setTheme]=useState<'light'|'dark'>(()=>{try{const saved=localStorage.getItem('ocia-reading-theme');if(saved==='light'||saved==='dark')return saved}catch{}return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'});
 const manual=useRef(false);
 useEffect(()=>{try{manual.current=!!localStorage.getItem('ocia-reading-theme')}catch{}const query=matchMedia('(prefers-color-scheme: dark)');const change=()=>{if(!manual.current)setTheme(query.matches?'dark':'light')};query.addEventListener('change',change);document.body.classList.add('themed-app');document.documentElement.classList.add('themed-app');return()=>query.removeEventListener('change',change)},[]);
 useEffect(()=>{document.body.dataset.readingTheme=theme;document.documentElement.dataset.readingTheme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#10131c':'#f8f5ef')},[theme]);
 function toggleTheme(){const next=theme==='light'?'dark':'light';manual.current=true;setTheme(next);try{localStorage.setItem('ocia-reading-theme',next)}catch{}}
 return {theme,toggleTheme};
}
