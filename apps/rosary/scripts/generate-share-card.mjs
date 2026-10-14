import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=new URL('../',import.meta.url);
const picture=await readFile(new URL('public/assets/rosary/joyful-v2-1.jpg',root));
const circles=Array.from({length:11},(_,i)=>`<circle cx="${790+i*25}" cy="${548+Math.sin(i/10*Math.PI)*15}" r="${i===0||i===10?7:5}" fill="#3d2e1b" stroke="#d0ae6b" stroke-width="2"/>`).join('');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><style>
 *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:radial-gradient(ellipse at 0 0,#3b2b19,#17130f 75%);color:#f6eddd;font-family:Arial,sans-serif;padding:66px 66px;position:relative}
 body::after{content:'';position:absolute;inset:22px;border:1px solid #705635;border-radius:22px;pointer-events:none}
 .label{display:flex;align-items:center;gap:16px;color:#d0ae6b;font-size:15px;letter-spacing:3px;text-transform:uppercase}.cross{font:34px Georgia,serif}
 .content{display:grid;grid-template-columns:570px 430px;gap:38px;align-items:center;margin-top:30px}
 h1{font:normal 72px/1.07 Georgia,serif;letter-spacing:-2px;margin:0 0 25px}.tagline{font:normal 34px/1.35 Georgia,serif;color:#d0ae6b;margin:0 0 23px}.details{font-size:17px;line-height:1.8;color:#cbbda9;margin:0}
 .art{padding:7px;border:1px solid #715b3c;border-radius:12px;background:#100e0b}.art img{display:block;width:100%;height:272px;object-fit:contain;border-radius:7px}.caption{color:#cbbda9;font-size:12px;letter-spacing:1px;text-align:center;margin-top:17px}
 .credit{position:absolute;left:66px;bottom:52px;color:#bba88b;font-size:13px;letter-spacing:.4px}.rosary{position:absolute;right:60px;bottom:35px;width:430px;height:70px}
 </style></head><body><div class="label"><span class="cross">✝</span>A moment of peace</div><div class="content"><div><h1>Rosary &amp;<br/>Divine Mercy</h1><p class="tagline">A quiet space for prayer.</p><p class="details">Guided prayer · Sacred videos · Reflections<br/>One prayer at a time.</p></div><div><div class="art"><img src="data:image/jpeg;base64,${picture.toString('base64')}" alt="The Annunciation"/></div><p class="caption">Walk with Mary. Rest in His mercy.</p></div></div><p class="credit">Created by Kenny &amp; Edith Santiago</p><svg class="rosary" viewBox="760 530 360 65" fill="none"><path d="M785 548Q915 581 1045 548" stroke="#8b7047" stroke-width="1.5"/>${circles}<path d="M1080 540v33m-10-22h20" stroke="#d0ae6b" stroke-width="3" stroke-linecap="round"/></svg></body></html>`);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:fileURLToPath(new URL('public/share-card.png',root))});
 console.log('Created public/share-card.png (1200 × 630)');
}finally{await browser.close()}
