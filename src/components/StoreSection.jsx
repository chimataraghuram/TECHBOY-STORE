import React, { useState, useEffect, useMemo } from 'react';
import gamingImg from '../assets/gaming-phone.png';
import cameraImg from '../assets/camera-phone.png';
import balancedImg from '../assets/balanced-phone.png';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ProductCard = ({ product, onCompare, isComparing, onView }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 20, y: -y * 20 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

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

    return (
        <div
            className={`product-card glass-card ${isComparing ? 'comparing' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transition: tilt.x === 0 ? 'transform 0.5s ease' : 'none'
            }}
        >
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <div className="product-image-wrapper">
                <img src={product.image || balancedImg} alt={product.name} className="product-real-img" />
                <div className="card-shine" style={{
                    background: `radial-gradient(circle at ${50 + tilt.x * 2}% ${50 - tilt.y * 2}%, rgba(255,255,255,0.1) 0%, transparent 80%)`
                }}></div>
            </div>
            <div className="product-info">
                <span className="category-label">{product.category}</span>
                <h3 className="product-title">{product.name}</h3>

                <div className="product-actions-row">
                    <button className="jelly-btn mini view-phone-btn" onClick={() => onView(product)}>View Phone</button>
                    <button
                        className={`jelly-btn mini compare-btn ${isComparing ? 'active' : ''}`}
                        onClick={() => onCompare(product)}
                    >
                        {isComparing ? 'Selected' : 'Compare'}
                    </button>
                </div>

                <div className="product-meta">
                    <div className="price-info">
                        <span className="price-label">Best Price @ Amazon</span>
                        <span className="price">₹{product.price?.toLocaleString()}</span>
                    </div>
                    <a 
                        href={product.amazon_link || '#'} 
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
        </div>
    );
};

const ComparisonModal = ({ products, onClose }) => {
    const getWinner = (specType) => {
        if (products.length < 2) return null;

        const vals = products.map(p => {
            let val = 0;
            if (specType === 'price') val = parseInt(p.price.replace(/[^\d]/g, ''));
            if (specType === 'ram') val = parseInt(p.specs.ram.replace(/[^\d]/g, ''));
            if (specType === 'refresh') {
                const match = p.specs.display.match(/(\d+)Hz/);
                val = match ? parseInt(match[1]) : 60;
            }
            return { id: p.id, val };
        });

        if (specType === 'price') {
            const min = Math.min(...vals.map(v => v.val));
            return vals.filter(v => v.val === min).map(v => v.id);
        } else {
            const max = Math.max(...vals.map(v => v.val));
            return vals.filter(v => v.val === max).map(v => v.id);
        }
    };

    const winners = {
        price: getWinner('price'),
        ram: getWinner('ram'),
        refresh: getWinner('refresh')
    };

    return (
        <div className="comparison-overlay" onClick={onClose}>
            <div className="comparison-content glass-card" onClick={e => e.stopPropagation()}>
                <div className="comparison-header">
                    <h2>Smartphone Comparison</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="comparison-grid">
                    <div className="comparison-labels">
                        <div>Model</div>
                        <div>Price</div>
                        <div>Display</div>
                        <div>RAM</div>
                        <div>Verdict</div>
                    </div>
                    {products.map(p => (
                        <div key={p.id} className={`comparison-col ${winners.price.includes(p.id) && winners.ram.includes(p.id) ? 'winner-card' : ''}`}>
                            <div className="col-header">
                                <img src={p.image} alt={p.name} />
                                <h4>{p.name}</h4>
                            </div>
                            <div className={`spec-val ${winners.price.includes(p.id) ? 'winner' : ''}`}>
                                {p.price}
                            </div>
                            <div className={`spec-val ${winners.refresh.includes(p.id) ? 'winner' : ''}`}>
                                {p.specs.display}
                            </div>
                            <div className={`spec-val ${winners.ram.includes(p.id) ? 'winner' : ''}`}>
                                {p.specs.ram}
                            </div>
                            <div className="spec-val smaller">{p.reason || 'Expert Selection'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RadarChart = ({ product }) => {
    // Logic to generate scores 0-100 based on product data
    const getScore = (type) => {
        const tag = product.tag.toLowerCase();
        const price = parseInt(product.price.replace(/[^\d]/g, ''));

        if (type === 'Gaming') {
            if (tag.includes('gamer') || tag.includes('performance')) return 95;
            if (product.specs.ram.includes('12GB')) return 85;
            return 70;
        }
        if (type === 'Camera') {
            if (tag.includes('photo') || tag.includes('portrait')) return 95;
            if (product.specs.camera.includes('200MP') || product.specs.camera.includes('Leica')) return 90;
            return 75;
        }
        if (type === 'Battery') {
            if (product.specs.battery.includes('6000mAh')) return 98;
            if (product.specs.battery.includes('5000mAh')) return 85;
            return 75;
        }
        if (type === 'Value') {
            if (price < 15000) return 95;
            if (price < 30000) return 85;
            return 70;
        }
        if (type === 'Display') {
            if (product.specs.display.includes('144Hz') || product.specs.display.includes('QHD')) return 95;
            if (product.specs.display.includes('AMOLED')) return 88;
            return 75;
        }
        return 80;
    };

    const points = [
        { label: 'Gaming', val: getScore('Gaming') },
        { label: 'Camera', val: getScore('Camera') },
        { label: 'Battery', val: getScore('Battery') },
        { label: 'Value', val: getScore('Value') },
        { label: 'Display', val: getScore('Display') }
    ];

    const size = 200;
    const center = size / 2;
    const radius = 70;

    const getCoordinates = (index, total, val) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (radius * val) / 100;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    const polygonPoints = points.map((p, i) => {
        const { x, y } = getCoordinates(i, points.length, p.val);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="radar-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Circles */}
                {[20, 40, 60, 80, 100].map(r => (
                    <circle key={r} cx={center} cy={center} r={(radius * r) / 100} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                ))}
                {/* Spokes */}
                {points.map((p, i) => {
                    const { x, y } = getCoordinates(i, points.length, 100);
                    return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
                })}
                {/* Data Polygon */}
                <polygon points={polygonPoints} fill="rgba(255, 69, 0, 0.3)" stroke="#ff4500" strokeWidth="2" />
                {/* Labels */}
                {points.map((p, i) => {
                    const { x, y } = getCoordinates(i, points.length, 115);
                    return (
                        <text key={i} x={x} y={y} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle" alignmentBaseline="middle">
                            {p.label}
                        </text>
                    );
                })}
            </svg>
            <div className="dna-title">PHONE DNA ANALYTICS</div>
        </div>
    );
};

const QuickViewModal = ({ product, onClose }) => (
    <div className="quickview-overlay" onClick={onClose}>
        <div className="quickview-content glass-card" onClick={e => e.stopPropagation()}>
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
                        <span className="price-tag-big">{product.price}</span>
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
        </div>
    </div>
);

const StoreSection = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState("");
    const [compareList, setCompareList] = useState([]);
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [activeViewProduct, setActiveViewProduct] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/products/`);
                const data = await res.json();
                setProducts(data);
                
                // Extract unique categories (price ranges)
                const uniqueCats = [...new Set(data.map(p => p.category))];
                setCategories(uniqueCats);
                if (uniqueCats.length > 0 && !selectedRange) {
                    setSelectedRange(uniqueCats[0]);
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredProducts = useMemo(() => {
        // Handle search
        if (searchTerm) {
            return products.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // Handle range filter
        return products.filter(p => p.category === selectedRange);
    }, [searchTerm, selectedRange, products]);

    const handleCompare = (product) => {
        if (compareList.find(p => p.id === product.id)) {
            setCompareList(prev => prev.filter(p => p.id !== product.id));
        } else if (compareList.length < 3) {
            setCompareList(prev => [...prev, product]);
        }
    };

    if (loading) return <div className="text-center py-5">Loading TechBoy Analyst Picks...</div>;

    return (
        <section id="products" className="store-section">
            <div className="container">
                <div className="section-header text-center">
                    <span className="badge analyst-badge">TECHBOY ANALYST PICK</span>
                    <h2 className="section-title">Explore Expert <span className="text-gradient">Recommendations</span></h2>
                    <p className="section-subtitle">Categorized by budget and performance. We do the research, you get the best deal.</p>
                </div>

                {!searchTerm && (
                    <div className="price-filter-container">
                        <div className="price-tabs">
                            {categories.map(range => (
                                <button
                                    key={range}
                                    className={`price-tab ${selectedRange === range ? 'active' : ''}`}
                                    onClick={() => setSelectedRange(range)}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="product-grid" style={{ marginTop: '40px' }}>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onCompare={handleCompare}
                            onView={setActiveViewProduct}
                            isComparing={!!compareList.find(p => p.id === product.id)}
                        />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="no-results">No smartphones found matching "{searchTerm}"</div>
                    )}
                </div>

                {compareList.length > 0 && (
                    <div className="comparison-bar glass-card">
                        <div className="comp-info">
                            {compareList.length} products selected for comparison
                        </div>
                        <div className="comp-actions">
                            <button className="clear-btn" onClick={() => setCompareList([])}>Clear</button>
                            <button className="primary-btn" onClick={() => setIsCompModalOpen(true)}>Compare Now</button>
                        </div>
                    </div>
                )}

                {isCompModalOpen && (
                    <ComparisonModal products={compareList} onClose={() => setIsCompModalOpen(false)} />
                )}

                {activeViewProduct && (
                    <QuickViewModal product={activeViewProduct} onClose={() => setActiveViewProduct(null)} />
                )}
            </div>
        </section>
    );
};

export default StoreSection;
