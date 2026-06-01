import React from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { resolveProductImage } from '../utils/imageResolver';
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



const ProductCard = ({ product, onCompare, onOpenCompare, isComparing, onView, onPriceAlert, index, searchTerm }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const [isSaved, setIsSaved] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);
    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [activePopover, setActivePopover] = React.useState(null);
    const [alertEmail, setAlertEmail] = React.useState('');
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
            setActivePopover('alert');
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
                setActivePopover('alert-success');
            } else {
                setActivePopover('alert-exists');
            }
        } catch (err) {
            console.error('Failed to save', err);
            setActivePopover('alert');
        }
    };

    const handleEmailAlert = (e) => {
        e.preventDefault();
        setActivePopover('alert-email');
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
            onClickCapture={(event) => {
                if (event.target.closest('.compare-btn')) {
                    setTimeout(() => setActivePopover('compare'), 0);
                }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={isTouchDevice ? {} : { scale: 1.015 }}
        >
            {activePopover && (
                <div className="product-action-popover" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="product-popover-close"
                        onClick={() => setActivePopover(null)}
                        aria-label="Close popup"
                        title="Close"
                    >
                        ×
                    </button>

                    {activePopover.startsWith('alert') && (
                        <div className="product-popover-content">
                            <div className="product-popover-icon">!</div>
                            <h4>{activePopover === 'alert-success' ? 'Alert Ready' : 'Stay Updated'}</h4>
                            {activePopover === 'alert-success' ? (
                                <p>{product.name} is saved to your watchlist. We will track price movement from your account.</p>
                            ) : activePopover === 'alert-exists' ? (
                                <p>This phone is already in your watchlist. You are covered for future price checks.</p>
                            ) : activePopover === 'alert-email' ? (
                                <p>Thanks. Sign in later with {alertEmail || 'your email'} to manage saved alerts and watchlist phones.</p>
                            ) : (
                                <>
                                    <p>Get notified when {product.name} changes price.</p>
                                    <form className="product-popover-form" onSubmit={handleEmailAlert}>
                                        <input
                                            type="email"
                                            value={alertEmail}
                                            onChange={(event) => setAlertEmail(event.target.value)}
                                            placeholder="you@example.com"
                                            required
                                        />
                                        <button type="submit">Continue</button>
                                    </form>
                                    <span className="product-popover-note">Sign in to save this phone to your full watchlist.</span>
                                </>
                            )}
                        </div>
                    )}

                    {activePopover === 'compare' && (
                        <div className="product-popover-content">
                            <div className="product-popover-icon compare-icon">↔</div>
                            <h4>{isComparing ? 'Ready to Compare' : 'Removed'}</h4>
                            <p>
                                {isComparing
                                    ? `${product.name} is in your compare tray. Pick up to 3 phones, then use Compare Now.`
                                    : `${product.name} was removed from the compare tray.`}
                            </p>
                            {isComparing && (
                                <button
                                    type="button"
                                    className="product-popover-action"
                                    onClick={() => onOpenCompare && onOpenCompare()}
                                >
                                    Compare Now
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

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
                            ★ {parseFloat(product.rating).toFixed(1)}
                        </span>
                    )}
                </div>
                <h3 className="product-title">
                    <HighlightText text={product.name} highlight={searchTerm} />
                </h3>

                <div className="smart-snippet" style={{ marginTop: '12px' }}>
                    {product.description && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px', color: '#ccc' }}>
                            {product.description.split('|').slice(0, 4).map((spec, i) => {
                                const parts = spec.split(':');
                                const val = parts.length > 1 ? parts[1].trim() : spec.trim();
                                let icon = '📌';
                                if (spec.toLowerCase().includes('chip')) icon = '⚡';
                                else if (spec.toLowerCase().includes('display')) icon = '📱';
                                else if (spec.toLowerCase().includes('camera')) icon = '📸';
                                else if (spec.toLowerCase().includes('battery')) icon = '🔋';
                                else if (spec.toLowerCase().includes('ram') || spec.toLowerCase().includes('storage')) icon = '💾';
                                
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={spec.trim()}>
                                        <span style={{ fontSize: '14px' }}>{icon}</span>
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{val}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="product-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 90, pointerEvents: 'auto' }}>
                    <div className="price-info" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="price">₹{(product.price || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', width: '100%', position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
                        <button 
                            className="primary-btn mini" 
                            style={{ flex: 1, padding: '8px 4px', borderRadius: '20px', background: '#ff1f3d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', border: 'none', color: 'white', position: 'relative', zIndex: 101, pointerEvents: 'auto', cursor: 'pointer', textTransform: 'uppercase' }}
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setActivePopover('alert');
                            }}
                        >
                            🔔 Alert
                        </button>
                        <button
                            className="primary-btn mini compare-btn"
                            style={{ flex: 1, padding: '8px 4px', borderRadius: '20px', background: '#ff1f3d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', border: 'none', position: 'relative', zIndex: 101, pointerEvents: 'auto', cursor: 'pointer', textTransform: 'uppercase' }}
                            onClick={(e) => { e.stopPropagation(); onCompare && onCompare(product); setActivePopover('compare'); }}
                        >
                            ⚔️ VS
                        </button>
                        <button 
                            className="primary-btn mini" 
                            style={{ flex: 1, padding: '8px 4px', borderRadius: '20px', background: '#ff1f3d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', border: 'none', color: 'white', position: 'relative', zIndex: 101, pointerEvents: 'auto', cursor: 'pointer', textTransform: 'uppercase' }}
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onView && onView(product, null);
                            }}
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
