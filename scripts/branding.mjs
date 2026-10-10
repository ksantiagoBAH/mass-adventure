import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
const image = async (path, type) => `data:${type};base64,${(await readFile(path)).toString('base64')}`;
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
  const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  const church=await image('public/artwork/parish-church-storybook.webp','image/webp');
  const font=await image('public/fonts/nunito-latin.woff2','font/woff2');
  const icon=await image('public/branding/favicon.svg','image/svg+xml');
  await page.setContent(`<style>@font-face{font-family:Nunito;src:url('${font}')}*{box-sizing:border-box}body{margin:0;background:#f9f6ee;color:#31473d;font-family:Nunito,sans-serif}.preview{width:1200px;height:630px;padding:58px;display:flex;align-items:center;gap:34px;border-bottom:14px solid #f4ca60}.copy{width:560px;flex-shrink:0}.brand{display:flex;align-items:center;gap:14px;font-weight:900;font-size:25px}.brand img{width:54px;height:54px}h1{font-size:72px;line-height:1.05;letter-spacing:-3px;margin:32px 0 24px;font-weight:900}p{font-size:28px;line-height:1.4;margin:0 0 28px}.tag{display:inline-block;border-radius:24px;background:#e4ebda;padding:12px 21px;font-size:21px;font-weight:800}.art{width:470px;height:470px;object-fit:cover;border-radius:50%;border:10px solid #fffaf0;box-shadow:0 0 0 3px #e2bc61}</style><div class="preview"><div class="copy"><div class="brand"><img src="${icon}"/>LITTLE HEARTS. BIG FAITH.</div><h1>Mass Adventure</h1><p>A joyful journey through the Catholic Mass for children and families.</p><div class="tag">Explore · Learn · Collect stickers</div></div><img class="art" src="${church}"/></div>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'public/branding/social-preview.png'});
  for (const [size, name] of [[32,'favicon-32.png'],[180,'apple-touch-icon.png']]) {
    await page.setViewportSize({width:size,height:size});
    await page.setContent(`<style>body{margin:0}img{display:block;width:100vw;height:100vh}</style><img src="${icon}"/>`);
    await page.screenshot({path:`public/branding/${name}`});
  }
} finally {await browser.close();}
