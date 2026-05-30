import React from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { resolveProductImage } from '../utils/imageResolver';
import { CountUp } from './AnimationEngine';
const balancedImg = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const HighlightText = ({ text, highlight }) => {
    if (!highlight || !highlight.trim() || !text) return <>{text}</>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) => 
                part.toLowerCase() === highlight.toLowerCase() ? 
                    <span key={i} className="search-highlight">{part}</span> : part
            )}
        </>
    );
};

const getMappedTag = (tag = '') => {
    const t = tag.toLowerCase();
    if (t.includes('gaming')) return '🎮 Best Gaming';
    if (t.includes('camera') || t.includes('photo')) return '📸 Camera King';
    if (t.includes('battery') || t.includes('king') || t.includes('endurance')) return '🔋 Battery Beast';
    if (t.includes('value') || t.includes('budget')) return '💰 Value Pick';
    if (t.includes('ui') || t.includes('software')) return '✨ Best UI';
    return tag || '⭐ Premium Choice';
};



const ProductCard = ({ product, onCompare, isComparing, onView, index, searchTerm }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const [isSaved, setIsSaved] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);
    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [isTouchDevice, setIsTouchDevice] = React.useState(false);
    const [cardTheme, setCardTheme] = React.useState('default');

    const cycleTheme = () => {
        const themes = ['default', 'cyberpunk', 'matrix', 'aurum', 'nebula', 'inferno'];
        const next = themes[(themes.indexOf(cardTheme) + 1) % themes.length];
        setCardTheme(next);
    };

    const amazonUrl = product.amazon_link || product.amazonLink;
    const flipkartUrl = product.flipkart_link || product.flipkartLink;

    React.useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const imageSrc = !imgError && product.image ? resolveProductImage(product.image, product.name) : balancedImg;

    const handleSaveToWatchlist = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('techboy_token');
        if (!token) {
            alert('Please login to save products to your watchlist!');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/watchlist/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product: product.id })
            });
            if (res.ok) {
                setIsSaved(true);
            } else {
                alert('Already in watchlist or error saving.');
            }
        } catch (err) {
            console.error('Failed to save', err);
        }
    };

    const handleMouseMove = (e) => {
        if (isTouchDevice) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleTrackClick = async (source) => {
        try {
            await fetch(`${API_BASE_URL}/track-click/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id, source })
            });
        } catch (err) {
            console.error('Failed to track click', err);
        }
    };

    const mappedTag = getMappedTag(product.tag);

    return (
        <m.div
            className={`product-card glass-card ${isComparing ? 'comparing' : ''} ${cardTheme !== 'default' ? `theme-${cardTheme}` : ''}`}
            onClick={cycleTheme}
            style={{
                rotateX: isTouchDevice ? 0 : rotateX,
                rotateY: isTouchDevice ? 0 : rotateY,
                cursor: 'pointer'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={isTouchDevice ? {} : { scale: 1.015 }}
        >
            <div className="product-card-header">
                {product.tag && <span className="product-tag">{mappedTag}</span>}
                <button 
                    className={`watchlist-btn ${isSaved ? 'saved' : ''}`}
                    onClick={handleSaveToWatchlist}
                    title="Save to Watchlist"
                >
                    <svg width="20" height="20" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>
            <div className="product-image-wrapper">
                {!imgLoaded && <div className="img-shimmer" />}
                <img 
                    src={imageSrc}
                    alt={product.name} 
                    className={`product-real-img ${imgLoaded ? 'img-loaded' : 'img-loading'}`}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => { setImgError(true); setImgLoaded(true); }}
                />
            </div>
            <div className="product-info">
                <div className="product-card-top-row">
                    <span className="category-label">
                        <HighlightText text={product.category} highlight={searchTerm} />
                    </span>
                    {product.rating && (
                        <span className="product-rating-badge">
                            ★ <CountUp end={parseFloat(product.rating)} decimals={1} />
                        </span>
                    )}
                </div>
                <h3 className="product-title">
                    <HighlightText text={product.name} highlight={searchTerm} />
                </h3>

                <div className="smart-snippet">
                    {product.description && (
                        <p className="spec-list-mini" style={{ margin: 0, padding: 0 }}>
                            {product.description.split('|')[0].trim()}
                        </p>
                    )}
                </div>

                <div className="product-meta">
                    <div className="price-info">
                        <span className="price"><CountUp end={product.price || 0} prefix="₹" /></span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="icon-btn"
                            title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
                            onClick={(e) => { e.stopPropagation(); onCompare(product); }}
                            style={{ 
                                padding: '8px', 
                                background: isComparing ? 'rgba(255, 31, 61, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                color: isComparing ? 'var(--accent-primary)' : 'white'
                            }}
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </button>
                        <button 
                            className="primary-btn mini" 
                            style={{ padding: '8px 16px', borderRadius: '12px' }}
                            onClick={(e) => { e.stopPropagation(); onView(product); }}
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </m.div>
    );
};

export default ProductCard;
