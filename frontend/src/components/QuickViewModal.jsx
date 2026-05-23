import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RadarChart from './RadarChart';
import PriceHistoryChart from './PriceHistoryChart';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const QuickViewModal = ({ product, onClose }) => {
    const [alertPrice, setAlertPrice] = useState(product.price - 1000);
    const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);
    const [alertStatus, setAlertStatus] = useState(null); // 'success', 'error'

    const handleSetAlert = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setAlertStatus('error');
            return;
        }

        setIsAlertSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/alerts/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    product: product.id, 
                    target_price: alertPrice 
                })
            });
            if (res.ok) {
                setAlertStatus('success');
            } else {
                setAlertStatus('error');
            }
        } catch (err) {
            setAlertStatus('error');
        } finally {
            setIsAlertSubmitting(false);
        }
    };

    return (
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
                        <PriceHistoryChart productId={product.id} currentPrice={product.price} />
                        <div className="img-glow-effect"></div>
                    </div>
                    <div className="quickview-details-side">
                        <span className="category-label">{product.category}</span>
                        <h2 className="modal-title">{product.name}</h2>
                        <div className="modal-price-row">
                            <span className="price-tag-big">₹{product.price?.toLocaleString()}</span>
                            <span className="store-tag">Lowest @ Amazon</span>
                        </div>

                        <div className="recommendation-box glass-card">
                            <h4>Expert's Guide Summary:</h4>
                            <p>{product.description || 'This phone offers the best hardware-to-price ratio in its segment, making it our #1 recommendation for mid-2026.'}</p>
                        </div>

                        <div className="price-alert-section glass-card">
                            <h4>Set Price Alert</h4>
                            <form className="alert-form" onSubmit={handleSetAlert}>
                                <div className="input-group">
                                    <span>₹</span>
                                    <input 
                                        type="number" 
                                        value={alertPrice} 
                                        onChange={(e) => setAlertPrice(e.target.value)}
                                        placeholder="Target Price"
                                    />
                                </div>
                                <button type="submit" className="alert-btn" disabled={isAlertSubmitting}>
                                    {isAlertSubmitting ? 'Setting...' : 'Alert Me'}
                                </button>
                            </form>
                            {alertStatus === 'success' && <p className="status-msg success">Alert set successfully!</p>}
                            {alertStatus === 'error' && <p className="status-msg error">Please login to set alerts.</p>}
                        </div>

                        <div className="specs-detail-list">
                            {product.description && product.description.split('|').map((spec, i) => (
                                <div key={i} className="spec-detail-item">
                                    <p>{spec.trim()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions">
                            {product.amazonLink && (
                                <a href={product.amazonLink} target="_blank" rel="noopener noreferrer" className="primary-btn large jelly-btn full-width">
                                    Buy on Amazon &rarr;
                                </a>
                            )}
                            {product.flipkartLink && (
                                <a href={product.flipkartLink} target="_blank" rel="noopener noreferrer" className="secondary-btn large jelly-btn full-width" style={{marginTop:'10px'}}>
                                    Buy on Flipkart &rarr;
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default QuickViewModal;
