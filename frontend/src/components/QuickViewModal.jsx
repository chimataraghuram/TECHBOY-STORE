import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import RadarChart from './RadarChart';
import PriceHistoryChart from './PriceHistoryChart';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const QuickViewModal = ({ product, onClose }) => {
    const [alertPrice, setAlertPrice] = useState(product.price - 1000);
    const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);
    const [alertStatus, setAlertStatus] = useState(null); // 'success', 'error'
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    useEffect(() => {
        const fetchAiSummary = async () => {
            setIsLoadingAi(true);
            try {
                const res = await fetch(`${API_BASE_URL}/products/${product.id}/ai_summary/`);
                if (res.ok) {
                    const data = await res.json();
                    setAiSummary(data.summary);
                }
            } catch (err) {
                console.error("Failed to fetch AI summary", err);
            } finally {
                setIsLoadingAi(false);
            }
        };
        fetchAiSummary();
    }, [product.id]);

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

                        <div className="recommendation-box glass-card ai-summary-box">
                            <div className="ai-summary-scanline"></div>
                            <h4 className="ai-summary-header">
                                <Sparkles size={18} /> NVIDIA AI Summary
                            </h4>
                            {isLoadingAi ? (
                                <p className="ai-loading-text">
                                    Analyzing specs and market data <span className="loading-dots">...</span>
                                </p>
                            ) : (
                                <p>{aiSummary || product.description}</p>
                            )}
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
