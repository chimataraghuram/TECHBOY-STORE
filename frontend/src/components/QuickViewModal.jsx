import React, { useState, useEffect, lazy, Suspense } from 'react';
import { m } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import RadarChart from './RadarChart';
import PriceHistoryChart from './PriceHistoryChart';
import { resolveProductImage } from '../utils/imageResolver';

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

    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!isOpen || !product) return null;

    const desktopVariants = {
      hidden: { opacity: 0, scale: 0.9, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
      exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
    };

    const mobileVariants = {
      hidden: { opacity: 1, y: "100%" },
      visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
      exit: { opacity: 1, y: "100%", transition: { duration: 0.2 } }
    };

    const modalStyle = isMobile ? {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      maxHeight: '90vh',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      overflowY: 'auto'
    } : { width: '100%', maxWidth: '900px', margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' };

    return (
        <AnimatePresence>
          <div className="quickview-overlay" onClick={onClose} style={isMobile ? { alignItems: 'flex-end', padding: 0, zIndex: 99999, background: 'rgba(0, 0, 0, 0.85)' } : { zIndex: 99999, background: 'rgba(0, 0, 0, 0.85)' }}>
            <m.div 
                className="quickview-content glass-card"
                variants={isMobile ? mobileVariants : desktopVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                style={modalStyle}
            >
                <button className="close-btn top-right" onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100, fontSize: '28px', background: 'rgba(255, 31, 61, 0.2)', border: '1px solid rgba(255, 31, 61, 0.5)', borderRadius: '50%', width: '44px', height: '44px', color: '#ff1f3d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>&times;</button>
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
                            <span className="price-tag-big">Rs {(product.price || 0).toLocaleString('en-IN')}</span>
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

                        <div className="specs-detail-list" style={{ marginTop: '20px' }}>
                            <h4 style={{ marginBottom: '12px', fontSize: '18px', color: '#fff' }}>Full Specifications</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                {product.description && product.description.split('|').map((spec, i) => {
                                    const parts = spec.split(':');
                                    const key = parts[0] ? parts[0].trim() : '';
                                    const val = parts[1] ? parts[1].trim() : '';
                                    if (!key) return null;
                                    
                                    let icon = '📌';
                                    if (key.toLowerCase().includes('chip')) icon = '⚡';
                                    else if (key.toLowerCase().includes('display')) icon = '📱';
                                    else if (key.toLowerCase().includes('camera')) icon = '📸';
                                    else if (key.toLowerCase().includes('battery')) icon = '🔋';
                                    else if (key.toLowerCase().includes('ram')) icon = '🧠';
                                    else if (key.toLowerCase().includes('storage')) icon = '💾';

                                    return (
                                        <div key={i} className="spec-detail-item" style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '20px' }}>{icon}</span>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--redline-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{key}</div>
                                                <div style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold' }}>{val || spec.trim()}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
        </div>
        </AnimatePresence>
    );
};

export default QuickViewModal;
