import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
    if (t.includes('camera') || t.includes('photo')) return '📸 Camera Beast';
    if (t.includes('battery') || t.includes('king') || t.includes('endurance')) return '🔋 Battery King';
    if (t.includes('value') || t.includes('budget')) return '💰 Value Pick';
    if (t.includes('ui') || t.includes('software')) return '✨ Best UI';
    return tag || '⭐ Premium Choice';
};

const getWhyRecommendedSnippet = (product) => {
    const tag = (product.tag || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    
    if (tag.includes('gaming') || desc.includes('fps') || desc.includes('144hz')) {
        return "Excellent gaming performance and cooling in this price range.";
    }
    if (tag.includes('camera') || desc.includes('ois') || desc.includes('telephoto')) {
        return "Best camera stability and low-light quality under your budget.";
    }
    if (tag.includes('battery') || desc.includes('6000mah') || desc.includes('5500mah') || desc.includes('100w')) {
        return "Strong battery optimization, high capacity, and fast charging.";
    }
    if (tag.includes('value') || tag.includes('pick') || desc.includes('value')) {
        return "Outstanding value-for-money specifications in this segment.";
    }
    if (tag.includes('ui') || desc.includes('updates')) {
        return "Smooth, bloatware-free user interface with long OS support.";
    }
    return "Balanced daily performance and highly reliable build quality.";
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

    const amazonUrl = product.amazon_link || product.amazonLink;
    const flipkartUrl = product.flipkart_link || product.flipkartLink;

    React.useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const resolveImg = (src) => {
        if (!src) return balancedImg;
        if (src.startsWith('/')) return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
        return src;
    };
    const imageSrc = !imgError && product.image ? resolveImg(product.image) : balancedImg;

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
    const whyRecommended = getWhyRecommendedSnippet(product);

    return (
        <motion.div
            className={`product-card glass-card ${isComparing ? 'comparing' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: isTouchDevice ? 0 : rotateX,
                rotateY: isTouchDevice ? 0 : rotateY,
                transformStyle: "preserve-3d",
            }}
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
            <div className="product-image-wrapper" style={{ transform: "translateZ(30px)" }}>
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
            <div className="product-info" style={{ transform: "translateZ(20px)" }}>
                <div className="product-card-top-row">
                    <span className="category-label">
                        <HighlightText text={product.category} highlight={searchTerm} />
                    </span>
                    {product.rating && (
                        <span className="product-rating-badge">
                            ★ {product.rating}
                        </span>
                    )}
                </div>
                <h3 className="product-title">
                    <HighlightText text={product.name} highlight={searchTerm} />
                </h3>

                <div className="product-actions-row">
                    <button className="jelly-btn mini view-phone-btn" onClick={() => onView(product)}>View Details</button>
                    <button
                        className={`jelly-btn mini compare-btn ${isComparing ? 'active' : ''}`}
                        onClick={() => onCompare(product)}
                    >
                        {isComparing ? 'Selected' : 'Compare'}
                    </button>
                </div>

                <div className="smart-snippet">
                    {product.description && (
                        <ul className="spec-list-mini">
                            {product.description.split('|').slice(0, 3).map((spec, idx) => (
                                <li key={idx}>✓ {spec.trim()}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="why-recommended-snippet">
                    <span className="why-recommended-title">💡 Why Recommended</span>
                    <p className="why-recommended-text">{whyRecommended}</p>
                </div>

                <div className="product-meta">
                    <div className="price-info">
                        <span className="price-label">Best Price Online</span>
                        <span className="price">₹{product.price?.toLocaleString()}</span>
                    </div>
                    <a 
                        href={amazonUrl || flipkartUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="get-deal-btn" 
                        title="Get Best Deal"
                        onClick={() => handleTrackClick('amazon')}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
