import React, { useState, useEffect, lazy, Suspense } from 'react';
import { m } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import RadarChart from './RadarChart';
import PriceHistoryChart from './PriceHistoryChart';
import { resolveProductImage } from '../utils/imageResolver';
import { CountUp } from './AnimationEngine';

const ThreeDViewer = lazy(() => import('./ThreeDViewer'));

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const buildLocalSummary = (product) => {
    const desc = product.description || 'a balanced spec sheet';
    const tag = product.tag ? `${product.tag} pick` : 'expert pick';
    return `AI Verdict: The ${product.name} is a ${tag} around Rs ${product.price?.toLocaleString()}. Key highlights: ${desc}.`;
};

const QuickViewModal = ({ product, onClose }) => {
    const [alertPrice, setAlertPrice] = useState(product.price - 1000);
    const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);
    const [alertStatus, setAlertStatus] = useState(null); // 'success', 'error'
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const amazonUrl = product.amazon_link || product.amazonLink;
    const flipkartUrl = product.flipkart_link || product.flipkartLink;
    const imageUrl = resolveProductImage(product.image, product.name);

    useEffect(() => {
        const fetchAiSummary = async () => {
            setIsLoadingAi(true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            try {
                const res = await fetch(`${API_BASE_URL}/products/${product.id}/ai_summary/`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const data = await res.json();
                    setAiSummary(data.summary || buildLocalSummary(product));
                } else {
                    setAiSummary(buildLocalSummary(product));
                }
            } catch (err) {
                console.error("Failed to fetch AI summary", err);
                setAiSummary(buildLocalSummary(product));
            } finally {
                setIsLoadingAi(false);
            }
        };
        fetchAiSummary();
    }, [product.id]);

    const handleSetAlert = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('techboy_token');
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
        } catch {
            setAlertStatus('error');
        } finally {
            setIsAlertSubmitting(false);
        }
    };

    return (
        <m.div 
            className="quickview-overlay" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <m.div 
                className="quickview-content glass-card" 
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
            >
                <button className="close-btn top-right" onClick={onClose}>&times;</button>
                <div className="quickview-body">
                    <div className="quickview-image-side">
                        <div className="view-toggle-buttons" style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                            <button 
                                className={`jelly-btn mini ${viewMode === '2d' ? 'active' : ''}`}
                                onClick={() => setViewMode('2d')}
                                style={{ background: viewMode === '2d' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >2D View</button>
                            <button 
                                className={`jelly-btn mini ${viewMode === '3d' ? 'active' : ''}`}
                                onClick={() => setViewMode('3d')}
                                style={{ background: viewMode === '3d' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >3D Interactive</button>
                        </div>
                        
                        <div style={{ position: 'relative', width: '100%', height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {viewMode === '2d' ? (
                                <img src={imageUrl} alt={product.name} className="floating-img" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <Suspense fallback={<div className="loading-dots" style={{color:'white'}}>Initializing WebGL...</div>}>
                                    <ThreeDViewer imageUrl={imageUrl} />
                                </Suspense>
                            )}
                        </div>
                        <RadarChart product={product} />
                        <PriceHistoryChart productId={product.id} currentPrice={product.price} />
                        <div className="img-glow-effect"></div>
                    </div>
                    <div className="quickview-details-side">
                        <span className="category-label">{product.category}</span>
                        <h2 className="modal-title">{product.name}</h2>
                        <div className="modal-price-row">
                            <span className="price-tag-big"><CountUp end={product.price || 0} prefix="Rs " /></span>
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
                                    <span>Rs</span>
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
                            {amazonUrl && (
                                <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="primary-btn large jelly-btn full-width">
                                    Buy on Amazon &rarr;
                                </a>
                            )}
                            {flipkartUrl && (
                                <a href={flipkartUrl} target="_blank" rel="noopener noreferrer" className="secondary-btn large jelly-btn full-width" style={{marginTop:'10px'}}>
                                    Buy on Flipkart &rarr;
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </m.div>
        </m.div>
    );
};

export default QuickViewModal;
