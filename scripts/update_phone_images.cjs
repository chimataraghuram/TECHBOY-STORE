// Update phones.json to use /images/phones/ public paths for local images
const fs = require('fs');

const phones = JSON.parse(fs.readFileSync('src/data/phones.json', 'utf8'));

// Map phone names to public path images
const localImageMap = {
  'Tecno Spark 30C': '/images/phones/tecno-spark-30c.png',
  'Redmi 13C 5G': '/images/phones/redmi-13c-5g.png',
  'Realme C75': '/images/phones/realme-c75.jpg',
  'Infinix Hot 50i': '/images/phones/infinix-hot-50i.jpg',
  'Google Pixel 9a': '/images/phones/google-pixel-9a.jpg',
  'OnePlus Nord CE 5': '/images/phones/oneplus-nord-ce5.png',
  'Realme GT 7T': '/images/phones/realme-gt7t.webp',
  'Nothing Phone (3a)': '/images/phones/nothing-phone-3a.jpg',
  'Nothing Phone (3a) Pro': '/images/phones/nothing-phone-3a.jpg',
  'Google Pixel 9 Pro': '/images/phones/google-pixel-9-pro.jpg',
  'OnePlus 13': '/images/phones/oneplus-13.jpg',
  'Samsung Galaxy S26+': '/images/phones/samsung-galaxy-s26-plus.jpg',
};

// Amazon CDN fallbacks for phones without local images
const amazonImageMap = {
  'Samsung Galaxy M07': 'https://m.media-amazon.com/images/I/61sC0IcMMrL._SX679_.jpg',
  'iQOO Z9 5G': 'https://m.media-amazon.com/images/I/71wGQJVivVL._SX679_.jpg',
  'Redmi Note 14 5G': 'https://m.media-amazon.com/images/I/71HjKibISBL._SX679_.jpg',
  'Samsung Galaxy A26 5G': 'https://m.media-amazon.com/images/I/71GkPnhJAML._SX679_.jpg',
  'vivo T5x 5G': 'https://m.media-amazon.com/images/I/71z1yg-JcxL._SX679_.jpg',
  'iQOO Neo 10R': 'https://m.media-amazon.com/images/I/71BxrM9FKZL._SX679_.jpg',
  'POCO F7 5G': 'https://m.media-amazon.com/images/I/71HiBVWSwWL._SX679_.jpg',
  'POCO X8 Pro Max': 'https://m.media-amazon.com/images/I/71u8wHNEqcL._SX679_.jpg',
  'vivo V70 FE': 'https://m.media-amazon.com/images/I/71yfkpCeT1L._SX679_.jpg',
  'Samsung Galaxy A37 5G': 'https://m.media-amazon.com/images/I/71xJQo6mvlL._SX679_.jpg',
  'OnePlus Nord 6': 'https://m.media-amazon.com/images/I/71OqD9jtMEL._SX679_.jpg',
  'Realme GT 7 Pro': 'https://m.media-amazon.com/images/I/71lgWn4VHIL._SX679_.jpg',
  'iQOO 13 5G': 'https://m.media-amazon.com/images/I/71Mm2IUAWVL._SX679_.jpg',
  'vivo V70': 'https://m.media-amazon.com/images/I/71qn2RbY-qL._SX679_.jpg',
  'Samsung Galaxy A57 5G': 'https://m.media-amazon.com/images/I/71NZj6C-5SL._SX679_.jpg',
  'OnePlus 13R': 'https://m.media-amazon.com/images/I/71qbVEDFaJL._SX679_.jpg',
  'Samsung Galaxy S25': 'https://m.media-amazon.com/images/I/71c0u6GUTgL._SX679_.jpg',
  'Samsung Galaxy S26': 'https://m.media-amazon.com/images/I/71c0u6GUTgL._SX679_.jpg',
  'Apple iPhone 17': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-finish-select-202509-6-9inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1725370339167',
  'Apple iPhone 17 Pro': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-3inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80',
  'Apple iPhone 17 Pro Max': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-pro-max-finish-select-202509?wid=5120&hei=2880&fmt=p-jpg&qlt=80',
  'Apple iPhone 16': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1724925065270',
  'Apple iPhone 16 Pro Max': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80',
  'Apple iPhone 15': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=80',
  'Apple iPhone 15 Pro Max': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80',
  'Samsung Galaxy Z Flip 7': 'https://images.samsung.com/in/smartphones/galaxy-z-flip7/images/galaxy-z-flip7-highlights-kv.jpg',
  'Samsung Galaxy Z Fold 7': 'https://images.samsung.com/in/smartphones/galaxy-z-fold7/images/galaxy-z-fold7-highlights-kv.jpg',
  'Samsung Galaxy S26 Ultra': 'https://images.samsung.com/in/smartphones/galaxy-s26-ultra/buy/gallery/galaxy-s26-ultra-sm-s938-sm-s938bzkgxfe-thumb-539505826.jpg',
};

const updated = phones.map(p => {
  const localImg = localImageMap[p.name];
  const amazonImg = amazonImageMap[p.name];
  const image = localImg || amazonImg || p.image || null;
  if (image) {
    return { ...p, image };
  }
  const { image: _, ...rest } = p;
  return rest;
});

fs.writeFileSync('src/data/phones.json', JSON.stringify(updated, null, 2));
const withImages = updated.filter(p => p.image).length;
console.log(`Updated phones.json: ${withImages}/${updated.length} phones have images`);
