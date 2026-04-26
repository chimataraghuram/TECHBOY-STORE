import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComparisonModal from './ComparisonModal';
import QuickViewModal from './QuickViewModal';
import localPhonesData from '../data/phones.json';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const StoreSection = ({ searchTerm, onSearch }) => {
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
                    const productsList = data.results || data;
                    if (productsList && productsList.length > 0) {
                        setProducts(productsList);
                        const cats = [...new Set(productsList.map(p => p.category))];
                        setCategories(cats);
                        if (cats.length > 0) setSelectedRange(cats[0]);
                    } else {
                        throw new Error("Empty API results");
                    }
                }
            } catch (err) {
                console.error("Fetch failed, falling back to local data", err);
                if (mounted) {
                    setProducts(localPhonesData);
                    const cats = [...new Set(localPhonesData.map(p => p.category))];
                    setCategories(cats);
                    if (cats.length > 0) setSelectedRange(cats[0]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        
        load();
        return () => { mounted = false; };
    }, []); // FIXED: EMPTY ARRAY

    // Auto-scroll when search becomes active
    useEffect(() => {
        if (searchTerm && searchTerm.length > 1) {
            const el = document.getElementById('products');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [searchTerm]);

    // Logic in render - 0 hooks here
    // Advanced filtering logic
    const term = (searchTerm || "").toLowerCase().trim();
    const filteredProducts = term 
        ? products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term) ||
            (p.tag && p.tag.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        )
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
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="badge analyst-badge"
                    >TECHBOY ANALYST PICK</motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >Explore Expert <span className="text-gradient">Recommendations</span></motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                    >Categorized by budget and performance. We do the research, you get the best deal.</motion.p>
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

                {searchTerm && (
                    <div className="search-results-info">
                        <h3>Showing {filteredProducts.length} results for "<span className="text-gradient">{searchTerm}</span>"</h3>
                        {filteredProducts.length > 0 && <p>Found the best tech matches for your query.</p>}
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
                        <div className="no-results-premium glass-card">
                            <div className="no-results-content">
                                <span className="warning-icon">⚠️</span>
                                <h3>No matches found</h3>
                                <p>We couldn't find any products matching "{searchTerm}". Try a different category or name.</p>
                                <button className="secondary-btn mini clear-results-btn" onClick={() => {
                                    onSearch('');
                                    window.scrollTo({top: 0, behavior: 'smooth'});
                                }}>Try Again</button>
                                <button className="jelly-btn mini" onClick={() => (onSearch(''), window.location.hash = '#products')}>Return to Home</button>
                            </div>
                        </div>
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
