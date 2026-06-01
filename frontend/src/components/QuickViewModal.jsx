import React, { useState, useEffect, lazy, Suspense } from 'react';
import { m } from 'framer-motion';
import { Sparkles, Cpu, Camera, Battery, Smartphone, HardDrive, Zap, Info } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

import { resolveProductImage } from '../utils/imageResolver';

const ThreeDViewer = lazy(() => import('./ThreeDViewer'));

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const buildLocalSummary = (product) => {
    const tag = product.tag ? `${product.tag} pick` : 'solid choice';
    return `AI Verdict: The ${product.name} is a ${tag} at Rs ${product.price?.toLocaleString()}, offering an excellent balance of performance and value.`;
};

const QuickViewModal = ({ product, onClose }) => {
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const amazonUrl = product?.amazon_link || product?.amazonLink;
    const flipkartUrl = product?.flipkart_link || product?.flipkartLink;
    const imageUrl = product ? resolveProductImage(product.image, product.name) : '';

    useEffect(() => {
        if (!product) return;
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

    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!product) return null;

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

                        <div className="unified-specs-section" style={{ marginTop: '24px' }}>
                            <h4 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={18} color="var(--accent-primary)" /> Technical Specifications
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                                {(() => {
                                    const hasSpecsObject = product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0;
                                    let specsList = [];
                                    if (hasSpecsObject) {
                                        specsList = Object.entries(product.specs).map(([k, v]) => ({ label: k, value: v }));
                                    } else if (product.description) {
                                        const parts = product.description.split('|').map(s => s.trim()).filter(s => s.length > 0);
                                        specsList = parts.map(spec => {
                                            const partsColon = spec.split(':');
                                            if (partsColon.length > 1 && partsColon[0].trim() !== '') {
                                                return { label: partsColon[0].trim(), value: partsColon.slice(1).join(':').trim() };
                                            }
                                            let label = "Feature";
                                            const lower = spec.toLowerCase();
                                            if (lower.includes('snapdragon') || lower.includes('dimensity') || lower.includes('bionic') || lower.includes('exynos') || lower.includes('tensor') || lower.includes('chip')) label = "Processor";
                                            else if (lower.includes('mp') || lower.includes('camera')) label = "Camera";
                                            else if (lower.includes('mah') || lower.includes('battery')) label = "Battery";
                                            else if (lower.includes('hz') || lower.includes('amoled') || lower.includes('lcd') || lower.includes('oled') || lower.includes('display')) label = "Display";
                                            else if (lower.includes('gb') || lower.includes('ram') || lower.includes('rom') || lower.includes('storage')) label = "Memory";
                                            else if (lower.includes('w ') || lower.includes('charging')) label = "Charging";
                                            return { label, value: spec };
                                        });
                                    }

                                    return specsList.map((s, idx) => {
                                        let IconComponent = Info;
                                        const labelLower = s.label.toLowerCase();
                                        if (labelLower.includes('processor') || labelLower.includes('chip')) IconComponent = Cpu;
                                        else if (labelLower.includes('camera')) IconComponent = Camera;
                                        else if (labelLower.includes('battery')) IconComponent = Battery;
                                        else if (labelLower.includes('display')) IconComponent = Smartphone;
                                        else if (labelLower.includes('memory') || labelLower.includes('ram') || labelLower.includes('storage')) IconComponent = HardDrive;
                                        else if (labelLower.includes('charging')) IconComponent = Zap;

                                        return (
                                            <div key={idx} className="spec-detail-item glass-card" style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                    <IconComponent size={18} color="var(--accent-primary)" />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</span>
                                                    <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500', lineHeight: '1.4' }}>{s.value}</span>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
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
    );
};

export default QuickViewModal;
