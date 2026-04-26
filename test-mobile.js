const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 }
  });
  const page = await context.newPage();
  page.on('pageerror', error => console.error('PAGE ERROR:', error));
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  await page.goto('https://ecoschool-ai.vercel.app/');
  await page.waitForTimeout(5000);
  await browser.close();
})();
