import React from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
  Flame, TrendingDown,
  Eye, Zap, ChevronUp, Bell
} from 'lucide-react';
import { useLiveAlerts } from './NotificationSystem';
import PriceAlertModal from './PriceAlertModal';
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

const TechBoyTrends = () => {
  const liveAlerts = useLiveAlerts();
  const [priceAlertProduct, setPriceAlertProduct] = React.useState(null);
  return (
  <section id="trends" className="tbt-section">
    {/* ambient background */}
    <div className="tbt-bg-blob tbt-blob-1" />
    <div className="tbt-bg-blob tbt-blob-2" />

    <div className="container">
      {/* ── Section Header ── */}
      <div className="section-header text-center">

        <m.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="section-title text-glow-premium section-title-pill">
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
          <span className="tbt-live-pill">● LIVE ALERTS</span>
        </div>

        <div className="tbt-drops-grid">
          <AnimatePresence mode="popLayout">
            {liveAlerts.map((phone, i) => (
              <TrendsCard 
                key={phone.id} 
                id={`trend-alert-${phone.id}`} 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true, margin: '-40px' }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                className="tbt-drop-card glass-card" 
                style={{ border: '1px solid #16a34a', boxShadow: '0 0 15px rgba(22, 163, 74, 0.15)', display: 'flex', flexDirection: 'column' }}
              >
              {/* rank badge */}
              <div className="tbt-rank-badge" style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(45deg, #16a34a, #15803d)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', zIndex: 10, border: '1px solid #4ade80' }}>
                🔥 #{phone.rank} HIGHEST DISCOUNT
              </div>
              {/* pct badge */}
              <div className="tbt-drop-pct-badge" style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', zIndex: 10 }}>
                ↓ {phone.pct}%
              </div>

              <div className="tbt-drop-img-wrap" style={{ textAlign: 'center', margin: '20px 0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={phone.image} alt={phone.name} className="tbt-drop-img" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onError={onImgErr} />
              </div>

              <div className="tbt-drop-info" style={{ textAlign: 'left', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{phone.name}</h3>
                <p style={{ margin: '0 0 16px 0', color: '#a0aabf', fontSize: '14px' }}>{phone.specs}</p>
                
                <div style={{ flexGrow: 1 }} />
                
                <div className="tbt-price-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span className="tbt-price-now" style={{ color: '#4ade80', fontSize: '22px', fontWeight: 'bold' }}>₹{phone.current.toLocaleString('en-IN')}</span>
                  <span className="tbt-price-was" style={{ color: '#64748b', fontSize: '15px', textDecoration: 'line-through' }}>₹{phone.prev.toLocaleString('en-IN')}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div className="tbt-savings-tag" style={{ background: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', border: '1px solid rgba(22, 163, 74, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Zap size={14} /> Save ₹{phone.savings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPriceAlertProduct({ product: { id: `alert-${phone.id}`, name: phone.name, price: phone.current, image: phone.image }, rect });
                    }}
                    style={{ display: 'block', flex: 1, padding: '12px 0', textAlign: 'center', background: '#ff1f3d', color: '#fff', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer', border: 'none' }} 
                    onMouseOver={e => { e.target.style.background = '#e01633'; e.target.style.transform = 'translateY(-2px)'; }} 
                    onMouseOut={e => { e.target.style.background = '#ff1f3d'; e.target.style.transform = 'translateY(0)'; }}
                  >
                    🔔 ALERT
                  </button>
                  <a href={phone.buyLink} target="_blank" rel="noreferrer" style={{ display: 'block', flex: 1, padding: '12px 0', textAlign: 'center', background: '#16a34a', color: '#fff', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer' }} onMouseOver={e => { e.target.style.background = '#15803d'; e.target.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.target.style.background = '#16a34a'; e.target.style.transform = 'translateY(0)'; }}>
                    BUY NOW
                  </a>
                </div>
              </div>
              </TrendsCard>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>

    <PriceAlertModal
        isOpen={!!priceAlertProduct}
        onClose={() => setPriceAlertProduct(null)}
        product={priceAlertProduct ? priceAlertProduct.product : null}
        triggerRect={priceAlertProduct ? priceAlertProduct.rect : null}
        user={null}
    />
  </section>
  );
};

export default TechBoyTrends;
