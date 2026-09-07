import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComparisonModal from './ComparisonModal';
import PriceAlertModal from './PriceAlertModal';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import localPhonesData from '../data/phones.json';
import BrandStrip from './BrandStrip';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const PAGE_SIZE = 8;

const ProductCardSkeleton = () => (
    <div className="bg-[#111118] border border-white/5 rounded-2xl h-[440px] animate-pulse p-4 flex flex-col">
        <div className="w-full h-[240px] bg-white/5 rounded-xl mb-4"></div>
        <div className="w-1/4 h-2.5 bg-white/8 rounded mb-2"></div>
        <div className="w-3/4 h-3.5 bg-white/8 rounded mb-4"></div>
        <div className="flex flex-wrap gap-1.5 mb-4">
            <div className="w-[70px] h-4 bg-white/5 rounded"></div>
            <div className="w-[70px] h-4 bg-white/5 rounded"></div>
        </div>
        <div className="w-1/2 h-5 bg-white/8 rounded mb-auto"></div>
        <div className="h-12 bg-white/5 rounded-xl mt-4"></div>
    </div>
);

const StoreSection = ({ searchTerm, onSearch }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [compareList, setCompareList] = useState([]);
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [priceAlertProduct, setPriceAlertProduct] = useState(null);
    const [activeBrand, setActiveBrand] = useState("All");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const { user } = useAuth();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/?limit=100`);
                const data = await res.json();
                if (mounted) {
                    const productsList = data.results || data;
                    if (productsList && productsList.length > 0) {
                        setProducts(productsList);
                    } else {
                        throw new Error("Empty API results");
                    }
                }
            } catch (err) {
                console.warn("Fetch failed, falling back to local JSON", err);
                if (mounted) setProducts(localPhonesData);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        let result = [...products];

        if (activeBrand !== "All") {
            const brandLower = activeBrand.toLowerCase();
            result = result.filter(p =>
                (p.brand && p.brand.toLowerCase() === brandLower) ||
                (p.name && p.name.toLowerCase().includes(brandLower))
            );
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                (p.name && p.name.toLowerCase().includes(term)) ||
                (p.brand && p.brand.toLowerCase().includes(term))
            );
        }

        setFilteredProducts(result);
        setVisibleCount(PAGE_SIZE);
    }, [products, activeBrand, searchTerm]);

    const handleCompare = (product) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            if (prev.length < 3) return [...prev, product];
            return prev;
        });
    };

    const scrollToProducts = () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <BrandStrip activeBrand={activeBrand} onChange={setActiveBrand} />

            <section id="products" className="py-12 md:py-16 lg:py-20 bg-[#050505]">
                <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">

                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Popular Smartphones</h2>
                            <p className="text-gray-400 text-sm sm:text-base">Categorized by budget and performance. Best deals tracked in real-time.</p>
                        </div>
                        <button
                            className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors whitespace-nowrap self-start"
                            onClick={scrollToProducts}
                        >
                            View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {searchTerm && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-white text-base">Showing results for <span className="text-red-500 font-bold">"{searchTerm}"</span></p>
                        </div>
                    )}

                    {/* Product Grid - 4 cols desktop, 2 tablet, 1 mobile — capped at 8 initially */}
                    <div className="mx-auto max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {loading ? (
                            [...Array(PAGE_SIZE)].map((_, idx) => <ProductCardSkeleton key={idx} />)
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.slice(0, visibleCount).map((product, idx) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onCompare={handleCompare}
                                    isComparing={compareList.some(p => p.id === product.id)}
                                    onPriceAlert={(p, rect) => setPriceAlertProduct({ product: p, rect })}
                                    index={idx}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-3xl mb-3 block">🔍</span>
                                <h3 className="text-base font-bold text-white mb-1">No smartphones found</h3>
                                <p className="text-gray-500 text-xs">Try adjusting your filters or search term.</p>
                            </div>
                        )}
                    </div>

                    {/* View More / Show Less */}
                    {!loading && filteredProducts.length > 0 && (
                        <div className="mt-10 flex flex-col items-center gap-3">
                            <p className="text-gray-500 text-xs font-semibold tracking-wide">
                                Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} smartphones
                            </p>
                            <div className="flex items-center gap-3">
                                {visibleCount < filteredProducts.length ? (
                                    <button
                                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                                        className="group flex items-center gap-2 bg-white/[0.04] hover:bg-red-600 border border-white/12 hover:border-red-500 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-[0_0_25px_rgba(255,31,61,0.4)]"
                                    >
                                        View More
                                        <ChevronRight size={16} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
                                    </button>
                                ) : (
                                    filteredProducts.length > PAGE_SIZE && (
                                        <button
                                            onClick={() => { setVisibleCount(PAGE_SIZE); scrollToProducts(); }}
                                            className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 text-gray-300 hover:text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all"
                                        >
                                            Show Less
                                            <ChevronRight size={16} className="-rotate-90" />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {isCompModalOpen && (
                            <ComparisonModal products={compareList} onClose={() => setIsCompModalOpen(false)} />
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

                </div>
            </section>
        </>
    );
};

export default StoreSection;