import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser for preview test...');
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
    console.log('Navigating to http://localhost:4173 ...');
    await page.goto('http://localhost:4173', { timeout: 30000 });
    console.log('Navigation call finished. Waiting 12 seconds for page execution...');
    
    await new Promise(r => setTimeout(r, 12000));
    
    const count = await page.evaluate(() => {
      return document.querySelectorAll('.product-card').length;
    });
    console.log('Product cards count found on page:', count);

    const productNames = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product-card .product-title, .product-card h3')).map(el => el.innerText);
    });
    console.log('Product titles found (first 5):', productNames.slice(0, 5));
    
    // Check if trends section is in DOM
    const trendsExists = await page.evaluate(() => {
      const el = document.querySelector('#trends');
      return !!el;
    });
    console.log('Trends section exists in DOM:', trendsExists);
    
    // Check if how it works exists
    const howItWorksExists = await page.evaluate(() => {
      const el = document.querySelector('#how-it-works, .how-it-works-section, .process-card');
      return !!el;
    });
    console.log('How it works exists in DOM:', howItWorksExists);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text length:', bodyText.length);
    
  } catch (err) {
    console.log('Error during execution:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
