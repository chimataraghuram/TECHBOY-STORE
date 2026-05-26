import React from 'react';
import { motion } from 'framer-motion';

// Parse a value from the description string, e.g. "RAM: 8GB" → 8
const parseFromDesc = (description = '', key) => {
    if (!description) return null;
    const regex = new RegExp(`${key}[:\\s]+([\\w.]+)`, 'i');
    const match = description.match(regex);
    return match ? match[1] : null;
};

const resolveImage = (src) => {
    if (!src) return '';
    if (src.startsWith('/')) return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
    return src;
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
                        <div>Processor / OS</div>
                        <div>Camera</div>
                        <div>Battery</div>
                        <div>Value Score</div>
                        <div>Buy Now</div>
                    </div>
                    {products.map(p => {
                        const desc = p.description || '';
                        const amazonUrl = p.amazon_link || p.amazonLink;
                        const flipkartUrl = p.flipkart_link || p.flipkartLink;
                        
                        const extractSpec = (key) => {
                            const regex = new RegExp(`${key}:\\s*([^|]+)`, 'i');
                            const match = desc.match(regex);
                            return match ? match[1].trim() : '—';
                        };

                        const displayVal = extractSpec('Display') !== '—' ? extractSpec('Display') : (desc.match(/(\d+\.\d+"[^|]+)/) ? desc.match(/(\d+\.\d+"[^|]+)/)[1] : '—');
                        const chipVal = extractSpec('Chip') !== '—' ? extractSpec('Chip') : extractSpec('OS');
                        const cameraVal = extractSpec('Camera');
                        const batteryVal = extractSpec('Battery') !== '—' ? extractSpec('Battery') : extractSpec('Charging');
                        
                        // Fake value score for the "Advisor" feel based on price tiers
                        const valScore = p.price < 30000 ? '9.5/10' : p.price < 60000 ? '9.0/10' : '8.5/10';

                        const isWinner = winners.price?.includes(p.id) && winners.ram?.includes(p.id);
                        return (
                            <div key={p.id} className={`comparison-col ${isWinner ? 'winner-card' : ''}`}>
                                <div className="col-header">
                                    <img src={resolveImage(p.image)} alt={p.name} />
                                    <h4>{p.name}</h4>
                                </div>
                                <div className={`spec-val ${winners.price?.includes(p.id) ? 'winner' : ''}`}>
                                    Rs {p.price?.toLocaleString()}
                                </div>
                                <div className="spec-val">{displayVal}</div>
                                <div className="spec-val">{chipVal}</div>
                                <div className="spec-val">{cameraVal}</div>
                                <div className="spec-val">{batteryVal}</div>
                                <div className="spec-val value-score-badge">{valScore}</div>
                                <div className="spec-val buy-links-row">
                                    {amazonUrl && (
                                        <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="buy-link amazon-link">Amazon</a>
                                    )}
                                    {flipkartUrl && (
                                        <a href={flipkartUrl} target="_blank" rel="noopener noreferrer" className="buy-link flipkart-link">Flipkart</a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="share-comparison-container">
                    <h4>Share this Comparison</h4>
                    <div className="share-buttons-wrapper">
                        <a 
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out this comparison between ${products.map(p => p.name).join(' vs ')} on TechBoy Store! Which one is better? \n\nhttps://techboy-store.vercel.app/`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="share-btn whatsapp-btn"
                        >
                            WhatsApp
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this comparison between ${products.map(p => p.name).join(' vs ')} on TechBoy Store! Which one is better? \n\nhttps://techboy-store.vercel.app/`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="share-btn x-btn"
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
