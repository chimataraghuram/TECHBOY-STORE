import React from 'react';
import { motion } from 'framer-motion';
import RadarChart from './RadarChart';

const QuickViewModal = ({ product, onClose }) => (
    <motion.div 
        className="quickview-overlay" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div 
            className="quickview-content glass-card" 
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
        >
            <button className="close-btn top-right" onClick={onClose}>&times;</button>
            <div className="quickview-body">
                <div className="quickview-image-side">
                    <img src={product.image} alt={product.name} className="floating-img" />
                    <RadarChart product={product} />
                    <div className="img-glow-effect"></div>
                </div>
                <div className="quickview-details-side">
                    <span className="category-label">{product.category}</span>
                    <h2 className="modal-title">{product.name}</h2>
                    <div className="modal-price-row">
                        <span className="price-tag-big">₹{product.price?.toLocaleString()}</span>
                        <span className="store-tag">Lowest @ {product.store || 'Amazon'}</span>
                    </div>

                    <div className="recommendation-box glass-card">
                        <h4>Expert's Guide Summary:</h4>
                        <p>{product.reason || 'This phone offers the best hardware-to-price ratio in its segment, making it our #1 recommendation for mid-2026.'}</p>
                    </div>

                    <div className="specs-detail-list">
                        <div className="spec-detail-item">
                            <span>Display</span>
                            <p>{product.specs.display}</p>
                        </div>
                        <div className="spec-detail-item">
                            <span>Performance</span>
                            <p>{product.specs.ram} RAM / 256GB Storage</p>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <a href={product.dealLink || '#'} target="_blank" rel="noopener noreferrer" className="primary-btn large jelly-btn full-width">
                            Get Deal on {product.store || 'Amazon'} &rarr;
                        </a>
                        <p className="redirect-hint">Redirecting to official {product.store || 'Amazon'} page</p>
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

export default QuickViewModal;
