import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer img').evaluate(img => img.decode());
    await page.locator('footer').screenshot({ path: `screenshots/footer-${width}.png` });
    const violations = (await new AxeBuilder({ page }).include('footer').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
    assert.deepEqual(violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) })), []);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal(await page.locator('.mobile-nav').isVisible(), width <= 700);
    console.log('PASS footer layout and accessibility', width);
  }
  for (const lang of ['en', 'es', 'pl', 'fil']) {
    await page.selectOption('#app-language', lang);
    await page.setViewportSize({ width: 320, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const footer = page.locator('footer');
    const violations = (await new AxeBuilder({ page }).include('footer').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
    assert.equal(violations.length, 0);
    assert.equal(await footer.getByRole('link').getAttribute('href'), 'https://ksantiagobah.github.io/at-the-table/');
    await footer.getByRole('button').click();
    assert(await page.locator('main h1').isVisible());
    console.log('PASS footer translation and parent navigation', lang);
  }
} finally {
  await browser.close();
}
