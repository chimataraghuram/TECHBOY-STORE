import React from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
  Flame, TrendingDown,
  Eye, Zap, ChevronUp, Bell
} from 'lucide-react';
import { useLiveAlerts } from './NotificationSystem';
import './TechBoyTrends.css';

/* ─────────────────────────── DATA ─────────────────────────── */

const trendingPhones = [
  { id: 1, rank: 1, name: 'Samsung Galaxy S26 Ultra', sub: 'Snapdragon 8 Elite · 200MP', image: '/images/phones/samsung-galaxy-s26-ultra.jpg', popularity: 98, badge: 'VIRAL', views: '142K', rise: '+12%' },
  { id: 2, rank: 2, name: 'Apple iPhone 17 Pro Max', sub: 'A19 Pro Bionic · 48MP', image: '/images/phones/apple-iphone-17-pro-max.jpg', popularity: 95, badge: 'TOP PICK', views: '118K', rise: '+9%' },
  { id: 3, rank: 3, name: 'iQOO 13 5G', sub: 'Snapdragon 8 Gen 3 · 50MP', image: '/images/phones/iqoo-13-5g.jpg', popularity: 91, badge: 'RISING', views: '95K', rise: '+22%' },
  { id: 4, rank: 4, name: 'Nothing Phone (3a)', sub: 'Snapdragon 7s Gen 3 · Glyph', image: '/images/phones/nothing-phone-3a.jpg', popularity: 88, badge: 'TRENDING', views: '88K', rise: '+17%' },
  { id: 5, rank: 5, name: 'OnePlus 13', sub: 'Snapdragon 8 Elite · 50MP', image: '/images/phones/oneplus-13.jpg', popularity: 85, badge: 'HOT', views: '79K', rise: '+8%' },
  { id: 6, rank: 6, name: 'Google Pixel 9 Pro', sub: 'Tensor G4 · AI Camera', image: '/images/phones/google-pixel-9-pro.jpg', popularity: 82, badge: 'AI KING', views: '74K', rise: '+6%' },
];

const priceDrops = [
  { id: 1, name: 'OnePlus 13R', sub: 'Snapdragon 8 Gen 2', image: '/images/phones/oneplus-13r.jpg', current: 42999, prev: 49999, savings: 7000, pct: 14 },
  { id: 2, name: 'Realme GT 7T', sub: 'Snapdragon 7s Gen 3', image: '/images/phones/realme-gt-7t.jpg', current: 26999, prev: 31999, savings: 5000, pct: 15 },
  { id: 3, name: 'Redmi Note 14 5G', sub: 'Snapdragon 6s Gen 3', image: '/images/phones/redmi-note-14-5g.jpg', current: 18999, prev: 22999, savings: 4000, pct: 17 },
  { id: 4, name: 'vivo V70 FE', sub: 'Dimensity 7300', image: '/images/phones/vivo-v70-fe.jpg', current: 37088, prev: 42999, savings: 5911, pct: 13 },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const fallback = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=60';
const fallback2 = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60';

const onImgErr = (e) => { e.target.src = fallback; };
const onImgErr2 = (e) => { e.target.src = fallback2; };

/* ─────────────────────────── ANIMATION VARIANTS ─────────────── */

const sectionVariant = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const cardVariant = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

const TrendsCard = ({ id, className, children, variants, initial, whileInView, viewport, exit, transition, style }) => {
  const [theme, setTheme] = React.useState('default');
  const cycleTheme = (e) => {
    if (e.target.closest('button, a, input, select')) return;
    const themes = ['default', 'cyberpunk', 'matrix', 'aurum', 'nebula', 'inferno'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
  };

  return (
    <m.div
      id={id}
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      exit={exit}
      transition={transition}
      className={`${className} ${theme !== 'default' ? `theme-${theme}` : ''}`}
      onClick={cycleTheme}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </m.div>
  );
};

import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import localPhonesData from '../data/phones.json';

const TechBoyTrends = () => {
  const [activeViewProduct, setActiveViewProduct] = React.useState(null);

  return (
  <section id="trends" className="tbt-section">
    {/* ambient background */}
    <div className="tbt-bg-blob tbt-blob-1" />
    <div className="tbt-bg-blob tbt-blob-2" />

    <div className="container">
      {/* ── Section Header ── */}
      <div className="section-header text-center">
        <m.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="badge analyst-badge">
          MARKET PULSE
        </m.span>
        <m.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="section-title">
          TechBoy <span className="text-gradient">Trends</span> 🔥
        </m.h2>
        <m.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="section-subtitle">
          Live insights on what the smartphone world is buzzing about right now
        </m.p>
      </div>

      <div className="tbt-module">
        <div className="tbt-module-heading" style={{ marginBottom: '24px' }}>
          <Bell size={22} className="tbt-micon red" />
          <h3 className="tbt-module-title">Trending Market Alerts</h3>
          <span className="tbt-live-pill">● ALL PHONES</span>
        </div>

        <div className="products-grid">
          <AnimatePresence mode="popLayout">
            {localPhonesData.map((phone, i) => (
              <ProductCard 
                key={phone.id}
                product={phone}
                index={i}
                searchTerm=""
                onView={(p) => setActiveViewProduct(p)}
                isSaved={false}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>

    <AnimatePresence>
        {activeViewProduct && (
            <QuickViewModal 
                product={activeViewProduct} 
                onClose={() => setActiveViewProduct(null)} 
            />
        )}
    </AnimatePresence>
  </section>
  );
};

export default TechBoyTrends;
