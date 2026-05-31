import React from 'react';
import { m } from 'framer-motion';
import {
  Flame, TrendingDown,
  Eye, Zap, ChevronUp, Bell
} from 'lucide-react';
import { PREDEFINED_NOTIFICATIONS } from './NotificationSystem';
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

const TrendsCard = ({ id, className, children, variants }) => {
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
      className={`${className} ${theme !== 'default' ? `theme-${theme}` : ''}`}
      onClick={cycleTheme}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </m.div>
  );
};

const TechBoyTrends = () => {
  const [randomAlerts, setRandomAlerts] = React.useState([]);

  React.useEffect(() => {
    // Pick 9 random alerts on mount (refresh)
    const shuffled = [...PREDEFINED_NOTIFICATIONS].sort(() => 0.5 - Math.random());
    setRandomAlerts(shuffled.slice(0, 9));
  }, []);

  const getAlertImage = (text) => {
    const t = text.toLowerCase();
    if (t.includes('iqoo neo')) return '/images/phones/iqoo-neo-10r.jpg';
    if (t.includes('iqoo')) return '/images/phones/iqoo-13-5g.jpg';
    if (t.includes('nothing')) return '/images/phones/nothing-phone-3a.jpg';
    if (t.includes('poco')) return '/images/phones/poco-f7-5g.jpg';
    if (t.includes('samsung') || t.includes('galaxy')) return '/images/phones/samsung-galaxy-s26-ultra.jpg';
    if (t.includes('motorola') || t.includes('edge')) return '/images/phones/google-pixel-9-pro.jpg'; 
    if (t.includes('realme')) return '/images/phones/realme-gt7-pro.jpg';
    if (t.includes('vivo')) return '/images/phones/vivo-v70-fe.jpg';
    if (t.includes('oneplus')) return '/images/phones/oneplus-13.jpg';
    return '/images/phones/apple-iphone-17-pro.jpg';
  };

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

      {/* ══════════════════════════════════════════════════
          MODULE 1 — Trending Phones
      ══════════════════════════════════════════════════ */}
      <div className="tbt-module">
        <div className="tbt-module-heading">
          <Flame size={22} className="tbt-micon red" />
          <h3 className="tbt-module-title">Trending Phones</h3>
          <span className="tbt-live-pill">● LIVE</span>
        </div>

        <m.div className="tbt-trending-grid" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {trendingPhones.map(phone => (
            <TrendsCard key={phone.id} variants={cardVariant} className="tbt-trending-card glass-card">
              {/* rank */}
              <span className="tbt-rank">#{phone.rank}</span>
              {/* badge */}
              <span className={`tbt-t-badge tbt-badge-${phone.badge === 'RISING' ? 'green' : phone.badge === 'VIRAL' ? 'red' : 'white'}`}>{phone.badge}</span>

              <div className="tbt-t-img-wrap">
                <img src={phone.image} alt={phone.name} className="tbt-t-img" onError={onImgErr} />
              </div>

              <div className="tbt-t-info">
                <p className="tbt-t-name">{phone.name}</p>
                <p className="tbt-t-sub">{phone.sub}</p>

                {/* Popularity bar */}
                <div className="tbt-pop-row">
                  <div className="tbt-pop-bar">
                    <m.div
                      className="tbt-pop-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${phone.popularity}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                  <span className="tbt-pop-val">{phone.popularity}%</span>
                </div>

                <div className="tbt-t-info-stats" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span className="tbt-views" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {phone.views} views</span>
                  <span className="tbt-rise" style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#00f2fe' }}><ChevronUp size={12} /> {phone.rise}</span>
                </div>
              </div>
            </TrendsCard>
          ))}
        </m.div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODULE 2 — Price Drops
      ══════════════════════════════════════════════════ */}
      <div className="tbt-module tbt-module-last">
        <div className="tbt-module-heading">
          <TrendingDown size={22} className="tbt-micon green" />
          <h3 className="tbt-module-title">Price Drops</h3>
          <span className="tbt-updated-pill">Updated today</span>
        </div>

        <m.div className="tbt-drops-grid" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {priceDrops.map(phone => (
            <TrendsCard key={phone.id} variants={cardVariant} className="tbt-drop-card glass-card">
              {/* pct badge */}
              <div className="tbt-drop-pct-badge">↓ {phone.pct}%</div>

              <div className="tbt-drop-img-wrap">
                <img src={phone.image} alt={phone.name} className="tbt-drop-img" onError={onImgErr2} />
              </div>

              <div className="tbt-drop-info">
                <p className="tbt-drop-name">{phone.name}</p>
                <p className="tbt-drop-sub">{phone.sub}</p>
                <div className="tbt-price-row">
                  <span className="tbt-price-now">₹{phone.current.toLocaleString('en-IN')}</span>
                  <span className="tbt-price-was">₹{phone.prev.toLocaleString('en-IN')}</span>
                </div>
                <div className="tbt-savings-tag">
                  <Zap size={12} /> Save ₹{phone.savings.toLocaleString('en-IN')}
                </div>
              </div>
            </TrendsCard>
          ))}
        </m.div>
      </div>


      {/* ══════════════════════════════════════════════════
          MODULE 3 — Live Market Alerts
      ══════════════════════════════════════════════════ */}
      <div className="tbt-module">
        <div className="tbt-module-heading" style={{ marginBottom: '24px' }}>
          <Bell size={22} className="tbt-micon red" />
          <h3 className="tbt-module-title">Live Market Alerts</h3>
          <span className="tbt-live-pill">● LATEST ALERTS</span>
        </div>

        <m.div className="tbt-alerts-grid" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {randomAlerts.map(alert => (
            <TrendsCard key={alert.id} id={`trend-alert-${alert.id}`} variants={cardVariant} className="tbt-alert-card notification-item unread" style={{ borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="notif-icon-wrapper" style={{ overflow: 'hidden', padding: 0, background: 'transparent', border: 'none' }}>
                <img src={getAlertImage(alert.title + ' ' + alert.desc)} alt="alert" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} onError={onImgErr} />
              </div>
              <div className="notif-content">
                <div className="notif-title-row">
                  <h5 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 600 }}>{alert.title}</h5>
                  <span className="notif-time">{alert.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#a0aabf' }}>{alert.desc}</p>
              </div>
            </TrendsCard>
          ))}
        </m.div>
      </div>

    </div>
  </section>
  );
};

export default TechBoyTrends;
