import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] [${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]:', error.stack || error.message);
  });

  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`[HTTP ERROR] ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('Navigating to http://localhost:5173 ...');
    // Set a long timeout and use no waitUntil so it returns immediately, then we wait manually.
    await page.goto('http://localhost:5173', { timeout: 30000 });
    console.log('Navigation call finished. Waiting 8 seconds for page execution...');
    
    await new Promise(r => setTimeout(r, 8000));
    
    const html = await page.content();
    
    const count = await page.evaluate(() => {
      return document.querySelectorAll('.product-card').length;
    });
    console.log('Product cards count found on page:', count);

    const productNames = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product-card .product-title, .product-card h3')).map(el => el.innerText);
    });
    console.log('Product titles found:', productNames);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text length:', bodyText.length);
    console.log('Body Text snippet:', bodyText);
    
  } catch (err) {
    console.log('Error during execution:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
