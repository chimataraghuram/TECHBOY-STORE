import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_ERROR:', msg.text());
    } else {
      console.log('BROWSER_LOG:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE_ERROR:', error.message);
  });
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Check if Intro is still showing
    const intro = await page.$('.intro-container');
    console.log('Intro container exists:', !!intro);
    
    if (intro) {
       // Wait for intro to disappear
       await page.waitForSelector('.intro-container', { hidden: true, timeout: 5000 });
       console.log('Intro container disappeared.');
    }

    // Scroll to products
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));

    // Get the HTML of the store section
    const productsHtml = await page.evaluate(() => {
       const section = document.querySelector('#products');
       return section ? section.innerHTML : 'No #products found';
    });
    
    const count = await page.evaluate(() => {
        return document.querySelectorAll('.product-card').length;
    });

    console.log('Product cards found:', count);
    if (count === 0) {
       console.log('Store HTML snippet:', productsHtml.substring(0, 500));
    }
    
  } catch (err) {
    console.log('Error during test:', err.message);
  }
  
  await browser.close();
})();
