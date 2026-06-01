import React, { useState, useEffect, useRef, Suspense } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
const ComparisonModal = React.lazy(() => import('./ComparisonModal'));
const QuickViewModal = React.lazy(() => import('./QuickViewModal'));
const PriceAlertModal = React.lazy(() => import('./PriceAlertModal'));
const FilterSidebar = React.lazy(() => import('./FilterSidebar'));
import { useAuth } from '../context/AuthContext';
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
    const [priceAlertProduct, setPriceAlertProduct] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(12);
    const [shuffleSeed, setShuffleSeed] = useState(0);

    const { user } = useAuth();

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
            setDisplayLimit(12); // Reset limit on search
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
                const res = await fetch(`${API_BASE_URL}/products/?limit=1000`, { signal: controller.signal });
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
                    if (mounted) {
                        setLoading(false);
                    }
                }, 800);
            }
        };
        
        load();
        return () => { 
            mounted = false; 
        };
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

    const isPureAll = selectedRange === "All" && !searchTerm && selectedBrands.length === 0 && minPrice === 0 && maxPrice === highestPrice;

    const allFilterRandomized = React.useMemo(() => {
        if (isPureAll && filteredProducts.length > 0) {
            // Using a seeded approach or just random based on shuffleSeed
            // Math.random() works well enough here since we want completely new ones
            const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 10);
        }
        return [];
    }, [filteredProducts, shuffleSeed, isPureAll]);

    const handleCategoryClick = (range) => {
        if (range === "All") {
            setShuffleSeed(prev => prev + 1);
        }
        setSelectedRange(range);
    };

    const workerRef = useRef(null);
    const [workerSupported, setWorkerSupported] = useState(true);

    // Initialize Web Worker
    useEffect(() => {
        try {
            workerRef.current = new Worker(new URL('../workers/filter.worker.js', import.meta.url), { type: 'module' });
            workerRef.current.onmessage = (e) => {
                setFilteredProducts(e.data.filteredProducts || []);
                setDisplayLimit(12);
            };
        } catch (err) {
            console.warn("Web Worker is not supported in this browser environment. Falling back to main-thread filtering.", err);
            setWorkerSupported(false);
        }
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    // Local filtering fallback logic (exact match of worker logic)
    const localFilterProducts = (payload) => {
        const { products, debouncedSearch, selectedRange, selectedBrands, minPrice, maxPrice, sortBy } = payload;
        let filtered = [...(products || [])];
        const term = (debouncedSearch || "").toLowerCase().trim();

        if (term) {
            filtered = filtered.filter(p => 
                (p.name && p.name.toLowerCase().includes(term)) || 
                (p.category && p.category.toLowerCase().includes(term)) ||
                (p.tag && p.tag.toLowerCase().includes(term)) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
        } else if (selectedRange && selectedRange !== "All") {
            filtered = filtered.filter(p => p.category === selectedRange);
        }

        if (selectedBrands && selectedBrands.length > 0) {
            filtered = filtered.filter(p => p.brand && selectedBrands.includes(p.brand));
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
        }

        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        return filtered;
    };

    // Dispatch to Web Worker or run local filtering fallback
    useEffect(() => {
        if (products.length === 0) {
            setFilteredProducts([]);
            return;
        }

        const payload = {
            products, 
            debouncedSearch, 
            selectedRange, 
            selectedBrands, 
            minPrice, 
            maxPrice, 
            sortBy
        };

        if (workerSupported && workerRef.current) {
            try {
                workerRef.current.postMessage(payload);
            } catch (err) {
                console.warn("Failed to communicate with Web Worker. Falling back to local filtering.", err);
                const localResult = localFilterProducts(payload);
                setFilteredProducts(localResult);
            }
        } else {
            const localResult = localFilterProducts(payload);
            setFilteredProducts(localResult);
            setDisplayLimit(12); // Reset limit on local fallback filtering
        }
    }, [products, debouncedSearch, selectedRange, selectedBrands, minPrice, maxPrice, sortBy, workerSupported]);

    const handleCompare = (product) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            if (prev.length < 3) return [...prev, product];
            return prev;
        });
    };

    return (
        <m.section 
            id="products" 
            className="store-section"
            onViewportEnter={() => {
                if (isPureAll) {
                    setShuffleSeed(prev => prev + 1);
                }
            }}
            viewport={{ once: false, margin: "-100px" }}
        >
            <div className="container">
                <div className="section-header text-center">

                    <m.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="section-title text-glow-premium section-title-pill"
                    >Premium Smartphone <span className="text-gradient">Collection</span></m.h2>
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
                                    onClick={() => handleCategoryClick(range)}
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
                    <Suspense fallback={<div>Loading Filters...</div>}>
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
                    </Suspense>

                    {loading ? (
                        <div className="product-grid">
                            {[...Array(6)].map((_, idx) => (
                                <ProductCardSkeleton key={idx} />
                            ))}
                        </div>
                    ) : (
                        <div className="product-grid">
                            {(isPureAll ? allFilterRandomized : filteredProducts.slice(0, displayLimit)).map((product, idx) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onCompare={handleCompare}
                                    onOpenCompare={() => setIsCompModalOpen(true)}
                                    onView={(p, rect) => setActiveViewProduct({ product: p, rect })}
                                    onPriceAlert={(p, rect) => setPriceAlertProduct({ product: p, rect })}
                                    isComparing={compareList.some(p => p.id === product.id)}
                                    index={idx}
                                    searchTerm={debouncedSearch}
                                />
                            ))}
                        </div>
                    )}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="no-results-premium glass-card">
                            <div className="no-results-content">
                                <span className="warning-icon">⚠️</span>
                                <h3>No matches found</h3>
                                <p>We couldn't find any products matching "{searchTerm}". Try a different category or name.</p>
                                <button className="secondary-btn mini clear-results-btn" onClick={() => {
                                    setSearchTerm('');
                                    setDebouncedSearch('');
                                }}>
                                    Clear Search
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <Suspense fallback={null}>
                    <AnimatePresence>
                        {isCompModalOpen && (
                            <ComparisonModal products={compareList} onClose={() => setIsCompModalOpen(false)} />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {activeViewProduct && (
                            <QuickViewModal 
                                product={activeViewProduct.product} 
                                triggerRect={activeViewProduct.rect}
                                onClose={() => setActiveViewProduct(null)} 
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {priceAlertProduct && (
                            <PriceAlertModal
                                isOpen={!!priceAlertProduct}
                                onClose={() => setPriceAlertProduct(null)}
                                product={priceAlertProduct.product}
                                triggerRect={priceAlertProduct.rect}
                                user={user}
                            />
                        )}
                    </AnimatePresence>
                </Suspense>
            </div>
        </m.section>
    );
};

export default StoreSection;
