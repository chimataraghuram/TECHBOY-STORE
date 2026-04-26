const fs = require('fs');
const phones = JSON.parse(fs.readFileSync('src/data/phones.json', 'utf8'));

// Complete map of all phone names -> local public image paths
const imageMap = {
  'Tecno Spark 30C':          '/images/phones/tecno-spark-30c.png',
  'Redmi 13C 5G':             '/images/phones/redmi-13c-5g.png',
  'Samsung Galaxy M07':       '/images/phones/samsung-galaxy-m07.jpg',
  'Realme C75':               '/images/phones/realme-c75.jpg',
  'Infinix Hot 50i':          '/images/phones/infinix-hot-50i.jpg',
  'iQOO Z9 5G':               '/images/phones/iqoo-z9-5g.jpg',
  'Redmi Note 14 5G':         '/images/phones/redmi-note-14-5g.jpg',
  'Samsung Galaxy A26 5G':    '/images/phones/samsung-galaxy-a26-5g.jpg',
  'Nothing Phone (3a)':       '/images/phones/nothing-phone-3a.jpg',
  'vivo T5x 5G':              '/images/phones/vivo-t5x-5g.jpg',
  'iQOO Neo 10R':             '/images/phones/iqoo-neo-10r.jpg',
  'Google Pixel 9a':          '/images/phones/google-pixel-9a.jpg',
  'Nothing Phone (3a) Pro':   '/images/phones/nothing-phone-3a.jpg',
  'Realme GT 7T':             '/images/phones/realme-gt7t.webp',
  'POCO F7 5G':               '/images/phones/poco-f7-5g.jpg',
  'OnePlus Nord CE 5':        '/images/phones/oneplus-nord-ce5.png',
  'POCO X8 Pro Max':          '/images/phones/poco-x8-pro-max.jpg',
  'vivo V70 FE':              '/images/phones/vivo-v70-fe.jpg',
  'Samsung Galaxy A37 5G':    '/images/phones/samsung-galaxy-a37-5g.jpg',
  'OnePlus Nord 6':           '/images/phones/oneplus-nord-6.jpg',
  'Realme GT 7 Pro':          '/images/phones/realme-gt7-pro.jpg',
  'vivo V70':                 '/images/phones/vivo-v70.jpg',
  'Samsung Galaxy A57 5G':    '/images/phones/samsung-galaxy-a57-5g.jpg',
  'OnePlus 13R':              '/images/phones/oneplus-13r.jpg',
  'iQOO 13 5G':               '/images/phones/iqoo-13-5g.jpg',
  'OnePlus 13':               '/images/phones/oneplus-13.jpg',
  'Google Pixel 9 Pro':       '/images/phones/google-pixel-9-pro.jpg',
  'Samsung Galaxy S25':       '/images/phones/samsung-galaxy-s25.jpg',
  'Samsung Galaxy S26+':      '/images/phones/samsung-galaxy-s26-plus.jpg',
  'Apple iPhone 17':          '/images/phones/apple-iphone-17.jpg',
  'Samsung Galaxy S26':       '/images/phones/samsung-galaxy-s26.jpg',
  'Samsung Galaxy S26 Ultra': '/images/phones/samsung-galaxy-s26-ultra.jpg',
  'Samsung Galaxy Z Flip 7':  '/images/phones/samsung-galaxy-z-flip-7.jpg',
  'Samsung Galaxy Z Fold 7':  '/images/phones/samsung-galaxy-z-fold-7.jpg',
  'Apple iPhone 17 Pro':      '/images/phones/apple-iphone-17-pro.jpg',
  'Apple iPhone 17 Pro Max':  '/images/phones/apple-iphone-17-pro-max.jpg',
  'Apple iPhone 16':          '/images/phones/apple-iphone-16.jpg',
  'Apple iPhone 16 Pro Max':  '/images/phones/apple-iphone-16-pro-max.jpg',
  'Apple iPhone 15':          '/images/phones/apple-iphone-15.jpg',
  'Apple iPhone 15 Pro Max':  '/images/phones/apple-iphone-15-pro-max.jpg',
};

const updated = phones.map(p => ({ ...p, image: imageMap[p.name] || p.image || null }));
fs.writeFileSync('src/data/phones.json', JSON.stringify(updated, null, 2));

const withLocal = updated.filter(p => p.image && p.image.startsWith('/images/')).length;
const withAny   = updated.filter(p => p.image).length;
console.log(`phones.json updated: ${withLocal} local images, ${withAny}/${updated.length} total`);
