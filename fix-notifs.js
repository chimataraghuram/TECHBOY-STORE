const fs = require('fs');
let text = fs.readFileSync('frontend/src/components/NotificationSystem.jsx', 'utf8');

const prefix = text.substring(0, text.indexOf('export const PREDEFINED_NOTIFICATIONS'));
const suffix = text.substring(text.indexOf('const NotificationSystem = () => {'));

const replacement = `export const PREDEFINED_NOTIFICATIONS = [
    { id: 1, type: 'price_drop', icon: TrendingDown, title: 'Price Drop Alert', desc: 'OnePlus 13R price dropped by ₹7,000', time: 'Just now', unread: true, name: 'OnePlus 13R', specs: 'Snapdragon 8 Gen 2', current: 42999, prev: 49999, pct: 14, savings: 7000, image: '/images/phones/oneplus-13r.jpg', buyLink: 'https://amazon.in/' },
    { id: 2, type: 'launch', icon: Rocket, title: 'New Launch', desc: 'Google Pixel 9 Pro is now available', time: '15 mins ago', unread: true, name: 'Google Pixel 9 Pro', specs: 'Tensor G4', current: 95999, prev: 109999, pct: 12, savings: 14000, image: '/images/phones/google-pixel-9-pro.jpg', buyLink: 'https://flipkart.com/' },
    { id: 3, type: 'trending', icon: Flame, title: 'Trending Now', desc: 'iQOO 13 5G is trending among gamers', time: '1 hour ago', unread: true, name: 'iQOO 13 5G', specs: 'Snapdragon 8 Gen 3', current: 54999, prev: 59999, pct: 8, savings: 5000, image: '/images/phones/iqoo-13-5g.jpg', buyLink: 'https://amazon.in/' },
    { id: 4, type: 'price_drop', icon: TrendingDown, title: 'Price Cut', desc: 'Nothing Phone (3a) now available at a lower price', time: '3 hours ago', unread: true, name: 'Nothing Phone (3a)', specs: 'Dimensity 7200 Pro', current: 25999, prev: 29999, pct: 13, savings: 4000, image: '/images/phones/nothing-phone-3a.jpg', buyLink: 'https://flipkart.com/' },
    { id: 5, type: 'launch', icon: Rocket, title: 'New Market Entry', desc: 'POCO F7 5G added to the market', time: '4 hours ago', unread: true, name: 'POCO F7 5G', specs: 'Snapdragon 8s Gen 3', current: 29999, prev: 34999, pct: 14, savings: 5000, image: '/images/phones/poco-f7-5g.jpg', buyLink: 'https://flipkart.com/' },
    { id: 6, type: 'trending', icon: Flame, title: 'Most Viewed', desc: 'Samsung Galaxy S26 Ultra gaining popularity', time: '5 hours ago', unread: true, name: 'Galaxy S26 Ultra', specs: 'Snapdragon 8 Gen 4', current: 129999, prev: 139999, pct: 7, savings: 10000, image: '/images/phones/samsung-galaxy-s26-ultra.jpg', buyLink: 'https://amazon.in/' },
    { id: 7, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'Realme GT 7 Pro is a top performance pick', time: '8 hours ago', unread: true, name: 'Realme GT 7 Pro', specs: 'Snapdragon 8 Gen 4', current: 45999, prev: 52999, pct: 13, savings: 7000, image: '/images/phones/realme-gt7-pro.jpg', buyLink: 'https://amazon.in/' },
    { id: 8, type: 'price_drop', icon: TrendingDown, title: 'Major Discount', desc: 'Vivo V70 FE received a major discount', time: 'Yesterday', unread: true, name: 'Vivo V70 FE', specs: 'Dimensity 8200', current: 32999, prev: 37999, pct: 13, savings: 5000, image: '/images/phones/vivo-v70-fe.jpg', buyLink: 'https://flipkart.com/' },
    { id: 9, type: 'trending', icon: Flame, title: 'Community Trend', desc: 'iPhone 17 Pro is trending across the community', time: 'Yesterday', unread: true, name: 'iPhone 17 Pro', specs: 'Apple A19 Pro', current: 119999, prev: 129999, pct: 8, savings: 10000, image: '/images/phones/apple-iphone-17-pro.jpg', buyLink: 'https://amazon.in/' }
];

export const CURRENT_LIVE_ALERTS = [...PREDEFINED_NOTIFICATIONS].sort(() => 0.5 - Math.random());

`;
fs.writeFileSync('frontend/src/components/NotificationSystem.jsx', prefix + replacement + suffix);
