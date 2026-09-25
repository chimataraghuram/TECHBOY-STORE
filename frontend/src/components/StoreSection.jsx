import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComparisonModal from './ComparisonModal';
import PriceAlertModal from './PriceAlertModal';
import QuickViewModal from './QuickViewModal';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowLeftRight, X } from 'lucide-react';
import localPhonesData from '../data/phones.json';
import BrandStrip from './BrandStrip';
import { matchesSearch } from '../utils/searchHelper';
import { resolveProductImage } from '../utils/imageResolver';
import { getPhoneSlugFromHash, slugifyPhone } from '../utils/deepLink';
import { feedback } from '../utils/haptics';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const PAGE_SIZE = 8;

const ProductCardSkeleton = () => (
    <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl h-[310px] sm:h-[370px] md:h-[390px] animate-pulse p-2 sm:p-3 flex flex-col w-full">
        <div className="w-full h-[135px] sm:h-[180px] md:h-[200px] bg-white/5 rounded-xl mb-2 sm:mb-3"></div>
        <div className="w-1/3 h-2 bg-white/5 rounded mb-1"></div>
        <div className="w-3/4 h-3 bg-white/5 rounded mb-2"></div>
        <div className="w-1/2 h-2.5 bg-white/5 rounded mb-auto"></div>
        <div className="h-7 sm:h-8 bg-white/5 rounded-xl mt-2"></div>
    </div>
);

const StoreSection = ({ searchTerm, onSearch }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [compareList, setCompareList] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('tb_compare_list') || '[]');
        } catch {
            return [];
        }
    });
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [priceAlertProduct, setPriceAlertProduct] = useState(null);
    const [activeBrand, setActiveBrand] = useState("All");
    const [activeCategory, setActiveCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [deepLinkedProduct, setDeepLinkedProduct] = useState(null);

    const { user } = useAuth();

    // Deep Linking: Auto open QuickViewModal if #phone=slug is present in URL
    useEffect(() => {
        if (!products || products.length === 0) return;
        const checkHash = () => {
            const slug = getPhoneSlugFromHash();
            if (slug) {
                const match = products.find(p => slugifyPhone(p.name || '') === slug);
                if (match) {
                    setDeepLinkedProduct(match);
                }
            }
        };
        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, [products]);

    useEffect(() => {
        try {
            localStorage.setItem('tb_compare_list', JSON.stringify(compareList));
            window.dispatchEvent(new Event('tb_compare_updated'));
        } catch (e) {}
    }, [compareList]);

    useEffect(() => {
        const syncCompare = () => {
            try {
                const stored = JSON.parse(localStorage.getItem('tb_compare_list') || '[]');
                setCompareList(stored);
            } catch (e) {}
        };
        window.addEventListener('tb_compare_updated', syncCompare);
        return () => window.removeEventListener('tb_compare_updated', syncCompare);
    }, []);

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

        if (searchTerm && searchTerm.trim()) {
            // Smart multi-token, spec, and price-intent matching
            result = result.filter(p => matchesSearch(p, searchTerm));

            // If a specific brand is selected, see if there are matches in that brand
            if (activeBrand !== "All") {
                const brandLower = activeBrand.toLowerCase();
                const brandMatches = result.filter(p =>
                    (p.brand && p.brand.toLowerCase() === brandLower) ||
                    (p.name && p.name.toLowerCase().includes(brandLower))
                );
                // Keep brand filter if matches exist; otherwise show all matching phones
                if (brandMatches.length > 0) {
                    result = brandMatches;
                }
            }
        } else if (activeBrand !== "All") {
            const brandLower = activeBrand.toLowerCase();
            result = result.filter(p =>
                (p.brand && p.brand.toLowerCase() === brandLower) ||
                (p.name && p.name.toLowerCase().includes(brandLower))
            );
        }

        if (activeCategory !== "All") {
            result = result.filter(p => p.category === activeCategory);
        }

        // Prioritize ultra flagship phones (Galaxy S26/S25 Ultra, Z Fold/Flip, iPhone Pro Max, Flagship tier) first
        result.sort((a, b) => {
            const isFlagshipA = (a.category && a.category.includes('Flagship')) || (a.price >= 70000) || /ultra|fold|flip|pro max/i.test(a.name || '');
            const isFlagshipB = (b.category && b.category.includes('Flagship')) || (b.price >= 70000) || /ultra|fold|flip|pro max/i.test(b.name || '');
            if (isFlagshipA && !isFlagshipB) return -1;
            if (!isFlagshipA && isFlagshipB) return 1;
            return (b.price || 0) - (a.price || 0); // highest flagship first
        });

        setFilteredProducts(result);
        setVisibleCount(PAGE_SIZE);
    }, [products, activeBrand, activeCategory, searchTerm]);

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
        <section id="products" className="pt-6 sm:pt-8 md:pt-10 pb-14 sm:pb-16 md:pb-20 bg-[#050505]">
            <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">

                {/* Section Header — Top */}
                <div className="mb-4 sm:mb-5">
                    <div className="relative pl-3.5 sm:pl-4 border-l-2 border-red-500">
                        <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_rgba(255,31,61,0.8)]" />
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                            {activeBrand === 'All' ? (
                                <>Popular <span className="bg-gradient-to-r from-[#ff3350] via-[#ff1f3d] to-[#ff6b81] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,31,61,0.35)]">Smartphones</span></>
                            ) : (
                                <><span className="text-white">{activeBrand}</span> <span className="bg-gradient-to-r from-[#ff3350] via-[#ff1f3d] to-[#ff6b81] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,31,61,0.35)]">Smartphones</span></>
                            )}
                        </h2>
                        <p className="text-neutral-400 text-xs sm:text-sm font-normal mt-1 leading-relaxed">
                            Categorized by budget and performance. Best deals tracked in real-time.
                        </p>
                    </div>
                </div>

                {/* Brand Filter Icon Strip — Directly Under Title */}
                <div className="mb-3 sm:mb-4">
                    <BrandStrip
                        activeBrand={activeBrand}
                        onChange={(b) => {
                            feedback.click();
                            setActiveBrand(b);
                        }}
                    />
                </div>

                {/* Category Pills Strip */}
                <div className="flex flex-nowrap sm:flex-wrap gap-2 items-center justify-start overflow-x-auto pb-2 mb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {['All', 'Under ₹10K', 'Under ₹20K', 'Under ₹30K', 'Under ₹40K', 'Under ₹50K', 'Under ₹60K', 'Under ₹1 Lakh', 'Flagship 1L+'].map((cat) => {
                        const isCatActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => {
                                    feedback.click();
                                    setActiveCategory(cat);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                                    isCatActive
                                        ? 'bg-red-500/20 text-white border-red-500/60 shadow-[0_0_12px_rgba(255,31,61,0.25)]'
                                        : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                                }`}
                            >
                                {cat === 'All' ? 'All Budgets' : cat}
                            </button>
                        );
                    })}
                </div>

                {/* Action Bar Below Filters — Reset, Count & View All */}
                <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                    <div className="flex items-center gap-2">
                        {(activeBrand !== 'All' || activeCategory !== 'All') && (
                            <button
                                onClick={() => {
                                    setActiveBrand('All');
                                    setActiveCategory('All');
                                }}
                                className="text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30"
                            >
                                Reset Filters &times;
                            </button>
                        )}
                        <span className="text-xs text-gray-400 font-semibold px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'phone' : 'phones'}
                        </span>
                    </div>

                    {visibleCount < filteredProducts.length && (
                        <button
                            className="group flex items-center gap-1.5 text-xs font-semibold text-gray-200 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 transition-all whitespace-nowrap shadow-sm hover:shadow-[0_0_15px_rgba(255,31,61,0.2)]"
                            onClick={() => setVisibleCount(filteredProducts.length)}
                        >
                            View All ({filteredProducts.length}) <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                    )}
                </div>

                    {searchTerm && (
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-red-500/10 border border-red-500/25 rounded-xl sm:rounded-2xl">
                            <p className="text-white text-sm sm:text-base">
                                Showing results for <span className="text-red-500 font-bold">"{searchTerm}"</span>
                                <span className="text-gray-400 text-xs ml-2">({filteredProducts.length} {filteredProducts.length === 1 ? 'phone' : 'phones'} found)</span>
                            </p>
                            <button
                                onClick={() => onSearch('')}
                                className="text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-red-500/25 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                            >
                                Clear Search &times;
                            </button>
                        </div>
                    )}

                    {/* Comparison Bar — Placed neatly right at the top of the cards in the user's active view */}
                    <AnimatePresence>
                        {compareList.length > 0 && (
                            <m.div
                                initial={{ opacity: 0, y: -15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                                className="mb-6 w-full rounded-2xl bg-[#090910]/95 border border-red-500/50 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(255,31,61,0.2)] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
                            >
                                {/* Selected phones preview thumbnails */}
                                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                    <div className="flex items-center gap-2">
                                        {[0, 1, 2].map((slotIdx) => {
                                            const item = compareList[slotIdx];
                                            if (item) {
                                                return (
                                                    <m.div 
                                                        key={item.id} 
                                                        initial={{ scale: 0.7, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.7, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 450, damping: 22 }}
                                                        className="relative group/thumb w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.05] border border-red-500/50 p-1 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,31,61,0.2)]"
                                                    >
                                                        <img
                                                            src={resolveProductImage(item.image, item.name)}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCompare(item); }}
                                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md transition-transform hover:scale-110 active:scale-90"
                                                            title={`Remove ${item.name}`}
                                                            aria-label={`Remove ${item.name}`}
                                                        >
                                                            <X size={11} className="stroke-[3]" />
                                                        </button>
                                                    </m.div>
                                                );
                                            }
                                            return (
                                                <div key={`empty-${slotIdx}`} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-gray-500 shrink-0">
                                                    <span className="text-[10px] font-bold text-gray-500">Slot {slotIdx + 1}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="text-left hidden min-[400px]:block">
                                        <p className="text-white text-xs sm:text-[13px] font-bold">Compare Phones</p>
                                        <p className="text-gray-400 text-[10px] sm:text-[11px]">
                                            {compareList.length === 1 ? 'Select 1 more to compare' : `${compareList.length} of 3 selected`}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => setCompareList([])}
                                        className="text-gray-400 hover:text-white px-3 py-2 text-xs font-semibold rounded-xl hover:bg-white/[0.06] transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <m.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        disabled={compareList.length < 2}
                                        onClick={() => setIsCompModalOpen(true)}
                                        className={`relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-[13px] transition-all shadow-md ${
                                            compareList.length >= 2
                                                ? 'bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] text-white shadow-[0_4px_20px_rgba(230,0,35,0.45)] border border-white/20 cursor-pointer animate-pulse'
                                                : 'bg-white/10 text-gray-400 border border-white/10 cursor-not-allowed'
                                        }`}
                                    >
                                        <ArrowLeftRight size={14} className="stroke-[2.5]" />
                                        <span>Compare Now ({compareList.length})</span>
                                    </m.button>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>

                    {/* Product Grid - Native 2-column mobile experience & fluid responsive breakpoints */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
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
                            <div className="col-span-full py-14 text-center bg-white/[0.02] rounded-2xl border border-white/10 p-6">
                                <span className="text-4xl mb-3 block">🔍</span>
                                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">No smartphones found</h3>
                                <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto mb-5">
                                    We couldn't find any smartphones matching <span className="text-red-400 font-semibold">"{searchTerm || activeBrand}"</span>. Try adjusting your query or explore popular searches below:
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <button
                                        onClick={() => { onSearch(''); setActiveBrand('All'); }}
                                        className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(255,31,61,0.3)]"
                                    >
                                        Reset All Filters
                                    </button>
                                    {['5G', 'Samsung', 'iPhone', 'Snapdragon', 'Under ₹20K'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => onSearch(s)}
                                            className="text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                                        >
                                            Try "{s}"
                                        </button>
                                    ))}
                                </div>
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

                    {/* Deep-linked Phone Modal (e.g. from shared link #phone=iphone-16-pro) */}
                    <AnimatePresence>
                        {deepLinkedProduct && (
                            <QuickViewModal
                                product={deepLinkedProduct}
                                onClose={() => {
                                    setDeepLinkedProduct(null);
                                    if (window.location.hash.includes('phone=')) {
                                        history.replaceState(null, '', window.location.pathname);
                                    }
                                }}
                            />
                        )}
                    </AnimatePresence>

                </div>
            </section>
    );
};

export default StoreSection;