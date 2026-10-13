import {readFile,writeFile,unlink} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {chromium} from 'playwright';
const root=new URL('../',import.meta.url);
const temporary=new URL('src/generated/.share-art.mjs',root);
let browser;
try{
 const source=await readFile(new URL('src/Illustration.tsx',root),'utf8');
 await writeFile(temporary,ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText);
 const {Illustration}=await import(pathToFileURL(fileURLToPath(temporary)));
 const art=renderToStaticMarkup(React.createElement(Illustration,{kind:'church',alt:'A welcoming church',scene:true}));
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><style>
 *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f8f5ef;color:#232a3d;padding:62px 72px;font-family:system-ui,-apple-system,sans-serif;position:relative}
 body::after{content:'';position:absolute;inset:24px;border:1px solid #dcd7cd;border-radius:22px;pointer-events:none}
 .label{font-size:19px;letter-spacing:4px;text-transform:uppercase;color:#76541a;font-weight:650;display:flex;align-items:center;gap:14px}.cross{font-family:Georgia,serif;font-size:29px;letter-spacing:0}
 .content{display:grid;grid-template-columns:590px 420px;gap:46px;align-items:center;margin-top:42px}
 h1{font:normal 82px/1.08 Georgia,serif;letter-spacing:-3px;margin:0 0 28px}.tagline{font-size:40px;line-height:1.3;font-weight:500;letter-spacing:-1px;margin:0}.tagline span{color:#76541a}
 .meta{font-size:18px;color:#606573;margin:31px 0 0}.illustration{display:block;width:420px;height:330px}.caption{text-align:center;font-size:17px;color:#606573;margin-top:22px}
 </style></head><body><div class="label"><span class="cross">✦</span> An OCIA companion</div><div class="content"><div><h1>At the Table</h1><p class="tagline">Understand the Mass.<br/><span>One step at a time.</span></p><p class="meta">28 guided lessons · Scripture &amp; tradition</p></div><div>${art}<div class="caption">Word · Sacrament · Community</div></div></div></body></html>`);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:fileURLToPath(new URL('public/share-card.png',root))});
 console.log('Created public/share-card.png (1200 × 630)');
}finally{await browser?.close();await unlink(temporary).catch(()=>{})}
