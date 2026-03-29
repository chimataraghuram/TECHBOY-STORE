import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComparisonModal from './ComparisonModal';
import QuickViewModal from './QuickViewModal';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const StoreSection = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState("");
    const [compareList, setCompareList] = useState([]);
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [activeViewProduct, setActiveViewProduct] = useState(null);

    // ONE STABLE MOUNT EFFECT
    useEffect(() => {
        let mounted = true;
        
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/`);
                const data = await res.json();
                if (mounted) {
                    setProducts(data);
                    const cats = [...new Set(data.map(p => p.category))];
                    setCategories(cats);
                    if (cats.length > 0) setSelectedRange(cats[0]);
                }
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        
        load();
        return () => { mounted = false; };
    }, []); // FIXED: EMPTY ARRAY

    // Logic in render - 0 hooks here
    const term = (searchTerm || "").toLowerCase();
    const filteredProducts = term 
        ? products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
        : products.filter(p => p.category === selectedRange);

    const handleCompare = (product) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            if (prev.length < 3) return [...prev, product];
            return prev;
        });
    };

    if (loading) return (
        <div className="store-loading-container">
            <div className="loader"></div>
            <p>Scanning Tech Deals...</p>
        </div>
    );

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
                    {filteredProducts.map((product, idx) => (
                        <ProductCard
                            key={product.id || idx}
                            index={idx}
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

                <AnimatePresence>
                    {compareList.length > 0 && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="comparison-bar glass-card"
                        >
                            <div className="comp-info">
                                {compareList.length} products selected for comparison
                            </div>
                            <div className="comp-actions">
                                <button className="clear-btn" onClick={() => setCompareList([])}>Clear</button>
                                <button className="primary-btn" onClick={() => setIsCompModalOpen(true)}>Compare Now</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isCompModalOpen && (
                        <ComparisonModal products={compareList} onClose={() => setIsCompModalOpen(false)} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {activeViewProduct && (
                        <QuickViewModal product={activeViewProduct} onClose={() => setActiveViewProduct(null)} />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default StoreSection;
