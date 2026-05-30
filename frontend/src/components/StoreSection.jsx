import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComparisonModal from './ComparisonModal';
import QuickViewModal from './QuickViewModal';
import FilterSidebar from './FilterSidebar';
import localPhonesData from '../data/phones.json';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const ProductCardSkeleton = () => (
    <div className="product-card skeleton-card">
        <div className="skeleton-img-placeholder shimmer-bg"></div>
        <div className="skeleton-info">
            <div className="skeleton-line short shimmer-bg" style={{ marginBottom: '8px' }}></div>
            <div className="skeleton-line long shimmer-bg" style={{ marginBottom: '16px', height: '20px' }}></div>
            <div className="skeleton-line medium shimmer-bg" style={{ marginBottom: '10px' }}></div>
            <div className="skeleton-line short shimmer-bg"></div>
        </div>
    </div>
);

const StoreSection = ({ searchTerm, onSearch }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState("");
    const [compareList, setCompareList] = useState([]);
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [activeViewProduct, setActiveViewProduct] = useState(null);

    // Advanced Filtering States
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(150000);
    const [sortBy, setSortBy] = useState("featured");

    // Debounced search term for grid filters (prevents laggy re-renders on keystroke)
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // One stable mount effect to load data
    useEffect(() => {
        let mounted = true;
        
        const load = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            try {
                const res = await fetch(`${API_BASE_URL}/products/`, { signal: controller.signal });
                clearTimeout(timeoutId);
                const data = await res.json();
                if (mounted) {
                    const productsList = data.results || data;
                    if (productsList && productsList.length > 0) {
                        setProducts(productsList);
                        const cats = ["All", ...new Set(productsList.map(p => p.category))];
                        setCategories(cats);
                        setSelectedRange("All");
                        const highPrice = Math.max(...productsList.map(p => p.price));
                        setMaxPrice(highPrice);
                    } else {
                        throw new Error("Empty API results");
                    }
                }
            } catch (err) {
                console.warn("Fetch failed, falling back to local JSON database", err);
                if (mounted) {
                    setProducts(localPhonesData);
                    const cats = ["All", ...new Set(localPhonesData.map(p => p.category))];
                    setCategories(cats);
                    setSelectedRange("All");
                    const highPrice = Math.max(...localPhonesData.map(p => p.price));
                    setMaxPrice(highPrice);
                }
            } finally {
                // Keep loader visible for a small window to make transition smooth
                setTimeout(() => {
                    if (mounted) setLoading(false);
                }, 800);
            }
        };
        
        load();
        return () => { mounted = false; };
    }, []);

    // Auto-scroll when search becomes active
    useEffect(() => {
        if (searchTerm && searchTerm.length > 1) {
            const el = document.getElementById('products');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [searchTerm]);

    const highestPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 150000;
    const availableBrands = [...new Set(products.map(p => p.brand).filter(b => b))].sort();

    const workerRef = useRef(null);

    // Initialize Web Worker
    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/filter.worker.js', import.meta.url), { type: 'module' });
        workerRef.current.onmessage = (e) => {
            setFilteredProducts(e.data.filteredProducts || []);
        };
        return () => workerRef.current.terminate();
    }, []);

    // Dispatch to Web Worker on dependencies change
    useEffect(() => {
        if (workerRef.current && products.length > 0) {
            workerRef.current.postMessage({
                products, 
                debouncedSearch, 
                selectedRange, 
                selectedBrands, 
                minPrice, 
                maxPrice, 
                sortBy
            });
        } else if (products.length === 0) {
            setFilteredProducts([]);
        }
    }, [products, debouncedSearch, selectedRange, selectedBrands, minPrice, maxPrice, sortBy]);

    const handleCompare = (product) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            if (prev.length < 3) return [...prev, product];
            return prev;
        });
    };

    return (
        <section id="products" className="store-section">
            <div className="container">
                <div className="section-header text-center">
                    <m.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="badge analyst-badge"
                    >TECHBOY ANALYST PICK</m.span>
                    <m.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >Explore Expert <span className="text-gradient">Recommendations</span></m.h2>
                    <m.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                    >Categorized by budget and performance. We do the research, you get the best deal.</m.p>
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
                        <h3>Showing {loading ? '...' : filteredProducts.length} results for "<span className="text-gradient">{searchTerm}</span>"</h3>
                        {!loading && filteredProducts.length > 0 && <p>Found the best tech matches for your query.</p>}
                    </div>
                )}

                <div className="store-layout" style={{ marginTop: '40px' }}>
                    <FilterSidebar 
                        brands={availableBrands}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        highestPrice={highestPrice}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        onClearFilters={() => {
                            setSelectedBrands([]);
                            setMinPrice(0);
                            setMaxPrice(highestPrice);
                            setSortBy("featured");
                        }}
                    />

                    <div className="product-grid">
                        {loading ? (
                            [...Array(6)].map((_, idx) => (
                                <ProductCardSkeleton key={idx} />
                            ))
                        ) : (
                            filteredProducts.map((product, idx) => (
                                <ProductCard
                                    key={product.id || idx}
                                    index={idx}
                                    product={product}
                                    onCompare={handleCompare}
                                    onView={setActiveViewProduct}
                                    isComparing={!!compareList.find(p => p.id === product.id)}
                                    searchTerm={debouncedSearch}
                                />
                            ))
                        )}
                        {!loading && filteredProducts.length === 0 && (
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
                </div>

                <AnimatePresence>
                    {compareList.length > 0 && (
                        <m.div 
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
                        </m.div>
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
