import React from 'react';
import { motion } from 'framer-motion';
import { parseSpecs, calculateValueScore } from '../utils/specsParser';
import { X, Award, Zap, ExternalLink } from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';

const resolveImage = (src, name = '') => {
    return resolveProductImage(src, name);
};

const ComparisonModal = ({ products, onClose }) => {
    // 1. Spec parsing & value scoring for compared products
    const analyzedProducts = products.map(p => {
        const specs = parseSpecs(p.description);
        const valScore = calculateValueScore(p);
        
        // Extract numeric prices for comparison
        const priceNum = typeof p.price === 'string' ? parseInt(p.price.replace(/[^\d]/g, '')) : (p.price || 0);
        
        // Extract numeric battery capacity
        const batMatch = specs.battery.match(/(\d+)mah/i);
        const batteryNum = batMatch ? parseInt(batMatch[1]) : 0;

        // Extract numeric display refresh rate
        const refMatch = specs.display.match(/(\d+)hz/i);
        const refreshNum = refMatch ? parseInt(refMatch[1]) : 60;

        return {
            ...p,
            parsedSpecs: specs,
            valueScoreNum: parseFloat(valScore),
            priceNum,
            batteryNum,
            refreshNum
        };
    });

    // 2. Identify Winners dynamically
    const getWinnerId = (key, type = 'max') => {
        if (analyzedProducts.length < 2) return null;
        
        let targetId = null;
        let targetVal = type === 'max' ? -Infinity : Infinity;

        analyzedProducts.forEach(p => {
            let val = 0;
            if (key === 'price') val = p.priceNum;
            else if (key === 'battery') val = p.batteryNum;
            else if (key === 'refresh') val = p.refreshNum;
            else if (key === 'value') val = p.valueScoreNum;

            if (type === 'max' && val > targetVal) {
                targetVal = val;
                targetId = p.id;
            } else if (type === 'min' && val < targetVal && val > 0) {
                targetVal = val;
                targetId = p.id;
            }
        });

        return targetId;
    };

    const winners = {
        price: getWinnerId('price', 'min'),
        battery: getWinnerId('battery', 'max'),
        refresh: getWinnerId('refresh', 'max'),
        value: getWinnerId('value', 'max')
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
                initial={{ scale: 0.92, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 15 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            >
                <div className="comparison-header">
                    <div className="comp-title-wrapper">
                        <h2>Smartphone Spec Comparison</h2>
                        <p>Comparing {analyzedProducts.length} devices side-by-side</p>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close Comparison">
                        <X size={20} />
                    </button>
                </div>

                <div className="comparison-scroll-wrapper">
                    <div className="comparison-grid">
                        {/* Row Labels Column */}
                        <div className="comparison-labels">
                            <div className="label-cell header-spacer">Model</div>
                            <div className="label-cell">Price</div>
                            <div className="label-cell">Performance / Chip</div>
                            <div className="label-cell">Display & Refresh</div>
                            <div className="label-cell">Camera Specs</div>
                            <div className="label-cell">Battery Capacity</div>
                            <div className="label-cell">Charging Wattage</div>
                            <div className="label-cell">Advisor Value Score</div>
                            <div className="label-cell actions-spacer">Get Best Deal</div>
                        </div>

                        {/* Product Columns */}
                        {analyzedProducts.map(p => {
                            const amazonUrl = p.amazon_link || p.amazonLink;
                            const flipkartUrl = p.flipkart_link || p.flipkartLink;
                            
                            const isPriceWinner = winners.price === p.id;
                            const isBatteryWinner = winners.battery === p.id;
                            const isValueWinner = winners.value === p.id;

                            return (
                                <div key={p.id} className="comparison-col">
                                    {/* Header cell */}
                                    <div className="col-header">
                                        <div className="comp-img-container">
                                            <img src={resolveImage(p.image, p.name)} alt={p.name} />
                                        </div>
                                        <h4>{p.name}</h4>
                                        <span className="comp-category">{p.category}</span>
                                    </div>

                                    {/* Price cell */}
                                    <div className={`spec-val price-val-cell ${isPriceWinner ? 'winner-cell' : ''}`}>
                                        <span className="mobile-only-label">Price:</span>
                                        <span className="val-text">₹{p.price?.toLocaleString()}</span>
                                        {isPriceWinner && <span className="winner-tag price-winner"><Award size={10} /> Budget King</span>}
                                    </div>

                                    {/* Chip cell */}
                                    <div className="spec-val">
                                        <span className="mobile-only-label">Performance:</span>
                                        <span className="val-text">{p.parsedSpecs.chip}</span>
                                    </div>

                                    {/* Display cell */}
                                    <div className="spec-val">
                                        <span className="mobile-only-label">Display:</span>
                                        <span className="val-text">{p.parsedSpecs.display}</span>
                                    </div>

                                    {/* Camera cell */}
                                    <div className="spec-val">
                                        <span className="mobile-only-label">Camera:</span>
                                        <span className="val-text">{p.parsedSpecs.camera}</span>
                                    </div>

                                    {/* Battery cell */}
                                    <div className={`spec-val ${isBatteryWinner ? 'winner-cell' : ''}`}>
                                        <span className="mobile-only-label">Battery:</span>
                                        <span className="val-text">{p.parsedSpecs.battery}</span>
                                        {isBatteryWinner && <span className="winner-tag battery-winner"><Award size={10} /> Battery King</span>}
                                    </div>

                                    {/* Charging cell */}
                                    <div className="spec-val">
                                        <span className="mobile-only-label">Charging:</span>
                                        <span className="val-text">{p.parsedSpecs.charging}</span>
                                    </div>

                                    {/* Value Score cell */}
                                    <div className={`spec-val ${isValueWinner ? 'winner-cell' : ''}`}>
                                        <span className="mobile-only-label">Value Score:</span>
                                        <div className="value-score-badge-comp">
                                            <Zap size={10} className="score-icon-comp" />
                                            <strong>{p.valueScoreNum}/10</strong>
                                        </div>
                                        {isValueWinner && <span className="winner-tag value-winner"><Award size={10} /> Best Value</span>}
                                    </div>

                                    {/* Actions cell */}
                                    <div className="spec-val buy-links-row-comp">
                                        {amazonUrl && (
                                            <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="buy-link-comp amazon">
                                                Amazon <ExternalLink size={12} />
                                            </a>
                                        )}
                                        {flipkartUrl && (
                                            <a href={flipkartUrl} target="_blank" rel="noopener noreferrer" className="buy-link-comp flipkart">
                                                Flipkart <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="share-comparison-container">
                    <h4>Share comparison with friends</h4>
                    <div className="share-buttons-wrapper">
                        <a 
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out this comparison between ${products.map(p => p.name).join(' vs ')} on TechBoy Store! \n\nhttps://techboy-store.vercel.app/`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="share-btn whatsapp-btn"
                        >
                            WhatsApp
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this comparison between ${products.map(p => p.name).join(' vs ')} on TechBoy Store! \n\nhttps://techboy-store.vercel.app/`)}`} 
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
