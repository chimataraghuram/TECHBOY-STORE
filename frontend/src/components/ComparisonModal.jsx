import React from 'react';
import { motion } from 'framer-motion';

// Parse a value from the description string, e.g. "RAM: 8GB" → 8
const parseFromDesc = (description = '', key) => {
    if (!description) return null;
    const regex = new RegExp(`${key}[:\\s]+([\\w.]+)`, 'i');
    const match = description.match(regex);
    return match ? match[1] : null;
};

const ComparisonModal = ({ products, onClose }) => {
    const getWinner = (specType) => {
        if (products.length < 2) return [];

        const vals = products.map(p => {
            let val = 0;
            const desc = p.description || '';
            if (specType === 'price') {
                val = typeof p.price === 'string' ? parseInt(p.price.replace(/[^\d]/g, '')) : (p.price || 0);
            }
            if (specType === 'ram') {
                const ramStr = parseFromDesc(desc, 'RAM') || '0';
                val = parseInt(ramStr) || 0;
            }
            if (specType === 'refresh') {
                const match = desc.match(/(\d+)Hz/);
                val = match ? parseInt(match[1]) : 60;
            }
            return { id: p.id, val };
        });

        if (specType === 'price') {
            const min = Math.min(...vals.map(v => v.val));
            return vals.filter(v => v.val === min).map(v => v.id);
        } else {
            const max = Math.max(...vals.map(v => v.val));
            return vals.filter(v => v.val === max).map(v => v.id);
        }
    };

    const winners = {
        price: getWinner('price'),
        ram: getWinner('ram'),
        refresh: getWinner('refresh')
    };

    return (
        <motion.div 
            className="comparison-overlay" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="comparison-content glass-card" 
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <div className="comparison-header">
                    <h2>Smartphone Comparison</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="comparison-grid">
                    <div className="comparison-labels">
                        <div>Model</div>
                        <div>Price</div>
                        <div>Display</div>
                        <div>RAM</div>
                        <div>Verdict</div>
                        <div>Buy Now</div>
                    </div>
                    {products.map(p => {
                        const desc = p.description || '';
                        const displayVal = (() => { const m = desc.match(/Display:\s*([^|]+)/i); return m ? m[1].trim() : '—'; })();
                        const ramVal = parseFromDesc(desc, 'RAM') || '—';
                        const isWinner = (winners.price?.includes(p.id) || []).length > 0 && (winners.ram?.includes(p.id) || []).length > 0;
                        return (
                            <div key={p.id} className={`comparison-col ${winners.price?.includes(p.id) && winners.ram?.includes(p.id) ? 'winner-card' : ''}`}>
                                <div className="col-header">
                                    <img src={p.image} alt={p.name} />
                                    <h4>{p.name}</h4>
                                </div>
                                <div className={`spec-val ${winners.price?.includes(p.id) ? 'winner' : ''}`}>
                                    ₹{p.price?.toLocaleString()}
                                </div>
                                <div className={`spec-val ${winners.refresh?.includes(p.id) ? 'winner' : ''}`}>
                                    {displayVal}
                                </div>
                                <div className={`spec-val ${winners.ram?.includes(p.id) ? 'winner' : ''}`}>
                                    {ramVal !== '—' ? `${ramVal} GB` : '—'}
                                </div>
                                <div className="spec-val smaller">{p.tag || 'Expert Selection'}</div>
                                <div className="spec-val buy-links-row">
                                    {p.amazonLink && (
                                        <a href={p.amazonLink} target="_blank" rel="noopener noreferrer" className="buy-link amazon-link">Amazon</a>
                                    )}
                                    {p.flipkartLink && (
                                        <a href={p.flipkartLink} target="_blank" rel="noopener noreferrer" className="buy-link flipkart-link">Flipkart</a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '15px', color: '#aaa' }}>Share this Comparison</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <a 
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out this comparison between ${products.map(p => p.name).join(' vs ')} on TechBoy Store! Which one is better? \n\nhttps://techboy-store.vercel.app/`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#25D366', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            WhatsApp
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this comparison between ${products.map(p => p.name).join(' vs ')} on TechBoy Store! Which one is better? \n\nhttps://techboy-store.vercel.app/`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            𝕏 Post
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ComparisonModal;
