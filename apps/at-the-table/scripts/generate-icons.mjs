import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=new URL('../public/',import.meta.url);
const svg=await readFile(new URL('favicon.svg',root),'utf8');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const icons=[];
 for(const size of [16,32,180]){
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  await page.setContent(`<style>html,body{margin:0;background:#232a3d}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const png=await page.screenshot({type:'png'});await page.close();
  if(size===180)await writeFile(new URL('apple-touch-icon.png',root),png);else icons.push({size,png});
 }
 const header=Buffer.alloc(6+icons.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(icons.length,4);let offset=header.length;
 for(const [i,{size,png}] of icons.entries()){const entry=6+i*16;header[entry]=size;header[entry+1]=size;header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(png.length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=png.length}
 await writeFile(new URL('favicon.ico',root),Buffer.concat([header,...icons.map(icon=>icon.png)]));
 console.log('Created favicon.ico (16/32px) and apple-touch-icon.png (180px)');
}finally{await browser.close()}
