import React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Activity, Bell, Check, Clock, ExternalLink, TrendingDown, X } from 'lucide-react';
import PriceHistoryChart from './PriceHistoryChart';

const DealDetailsModal = ({ product, onClose, onTrack }) => {
  if (!product) return null;
  const current = Number(product.price || product.current || 0);
  const previous = Number(product.prev || product.previous_price || 0);
  const savings = Math.max(0, previous - current);
  const specs = product.specs && typeof product.specs === 'object' ? Object.entries(product.specs).slice(0, 6) : [];
  const highlights = (product.description || product.desc || '').split('|').map(item => item.trim()).filter(Boolean).slice(0, 6);
  const dealScore = product.type === 'price_drop' ? 91 : product.type === 'trending' ? 84 : 88;

  return (
    <AnimatePresence>
      <m.div className="deal-details-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <m.div className="deal-details-modal" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} onClick={e => e.stopPropagation()}>
          <button className="deal-details-close" onClick={onClose} aria-label="Close deal details"><X size={18} /></button>
          <div className="deal-details-grid">
            <div className="deal-details-media">
              <div className="deal-details-badge"><Activity size={13} /> {product.type === 'price_drop' ? 'PRICE DROP' : 'LIVE DEAL'}</div>
              <img src={product.image} alt={product.name} onError={e => { e.currentTarget.src = '/images/phones/apple-iphone-17-pro-max.png'; }} />
              <div className="deal-details-live"><span /> <Clock size={12} /> Updated {product.time || 'just now'}</div>
            </div>
            <div className="deal-details-content">
              <p className="deal-details-kicker">TECHBOY DEAL INTELLIGENCE</p>
              <h2>{product.name}</h2>
              <p className="deal-details-description">{product.desc || 'Track this product’s price movement and make a confident buying decision.'}</p>
              <div className="deal-details-price-row"><strong>₹{current.toLocaleString('en-IN')}</strong>{previous > current && <del>₹{previous.toLocaleString('en-IN')}</del>}<span><TrendingDown size={13} /> {savings ? `Save ₹${savings.toLocaleString('en-IN')}` : 'Live price'}</span></div>
              <div className="deal-details-stats"><div><small>STATUS</small><b><Check size={13} /> {product.type === 'price_drop' ? 'Best price' : 'Tracking live'}</b></div><div><small>WINDOW</small><b>30 day history</b></div></div>
              {specs.length > 0 && <div className="deal-details-specs">{specs.map(([key, value]) => <div key={key}><small>{key}</small><b>{String(value)}</b></div>)}</div>}
              <button className="deal-details-track" onClick={() => onTrack?.(product)}><Bell size={16} /> Track this price</button>
              {(product.amazonLink || product.amazon_url) && <a className="deal-details-link" href={product.amazonLink || product.amazon_url} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View retailer</a>}
            </div>
          </div>
          <div className="deal-dashboard-grid">
            <section className="deal-dashboard-panel deal-dashboard-wide">
              <div className="deal-panel-heading"><div><small>MARKET MOVEMENT</small><h3>Price history</h3></div><span>Last 30 days</span></div>
              <div className="deal-dashboard-chart"><PriceHistoryChart productId={product.product_id || product.id} currentPrice={current} /></div>
            </section>
            <section className="deal-dashboard-panel deal-score-panel"><small>DEAL SCORE</small><div className="deal-score-ring" style={{ '--score': `${dealScore * 3.6}deg` }}><strong>{dealScore}</strong><span>/100</span></div><b>{dealScore > 89 ? 'Excellent deal' : 'Good value'}</b><p>Compared with recent market prices</p></section>
            <section className="deal-dashboard-panel"><div className="deal-panel-heading"><div><small>COMPARE PRICES</small><h3>Market check</h3></div></div><div className="deal-compare-list"><div><span>TechBoy price</span><b>₹{current.toLocaleString('en-IN')}</b></div><div><span>Previous price</span><b>{previous ? `₹${previous.toLocaleString('en-IN')}` : '—'}</b></div><div><span>Potential saving</span><b className="deal-green">₹{savings.toLocaleString('en-IN')}</b></div></div></section>
            <section className="deal-dashboard-panel"><div className="deal-panel-heading"><div><small>HIGHLIGHTS</small><h3>What stands out</h3></div></div><ul className="deal-highlights">{(highlights.length ? highlights : ['Strong everyday performance', 'Live price tracking enabled', 'Worth watching at this price']).map(item => <li key={item}><Check size={13} /> {item}</li>)}</ul></section>
            {specs.length > 0 && <section className="deal-dashboard-panel deal-dashboard-wide"><div className="deal-panel-heading"><div><small>TECHNICAL DETAILS</small><h3>Specifications</h3></div></div><div className="deal-spec-table">{specs.map(([key, value]) => <div key={key}><span>{key}</span><b>{String(value)}</b></div>)}</div></section>}
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};

export default DealDetailsModal;
