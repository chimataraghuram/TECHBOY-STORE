import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComparisonModal from './ComparisonModal';
import PriceAlertModal from './PriceAlertModal';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import localPhonesData from '../data/phones.json';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');
const BRANDS = ["All", "Samsung", "OnePlus", "iQOO", "Nothing", "Xiaomi", "Realme", "Motorola"];

const ProductCardSkeleton = () => (
    <div className="bg-[#111118] border border-white/5 rounded-xl h-[340px] animate-pulse p-3.5 flex flex-col">
        <div className="w-full h-[160px] bg-white/5 rounded-lg mb-3"></div>
        <div className="w-1/3 h-2.5 bg-white/8 rounded mb-1.5"></div>
        <div className="w-3/4 h-3.5 bg-white/8 rounded mb-3"></div>
        <div className="w-1/2 h-4 bg-white/8 rounded mb-auto"></div>
        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="w-8 h-8 bg-white/8 rounded-lg"></div>
            <div className="w-8 h-8 bg-white/8 rounded-lg"></div>
            <div className="flex-1 h-8 bg-white/8 rounded-lg"></div>
        </div>
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
            result = result.filter(p => p.brand?.toLowerCase() === activeBrand.toLowerCase());
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(term) || 
                p.brand?.toLowerCase().includes(term)
            );
        }

        setFilteredProducts(result);
    }, [products, activeBrand, searchTerm]);

    const handleCompare = (product) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.filter(p => p.id !== product.id);
            if (prev.length < 3) return [...prev, product];
            return prev;
        });
    };

    return (
        <section id="products" className="py-12 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Popular Smartphones</h2>
                        <p className="text-gray-500 text-xs">Categorized by budget and performance.</p>
                    </div>
                    <button className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 group">
                        View All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Brand Filters */}
                <div className="flex overflow-x-auto pb-3 mb-6 gap-2 hide-scrollbar">
                    {BRANDS.map(brand => (
                        <button
                            key={brand}
                            onClick={() => setActiveBrand(brand)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${activeBrand === brand ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>

                {searchTerm && (
                    <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-white text-sm">Showing results for <span className="text-red-500 font-bold">"{searchTerm}"</span></p>
                    </div>
                )}

                {/* Product Grid - 4 columns desktop matching reference */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(8)].map((_, idx) => <ProductCardSkeleton key={idx} />)
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, 8).map((product, idx) => (
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
                        <div className="col-span-full py-12 text-center bg-white/5 rounded-xl border border-white/5">
                            <span className="text-2xl mb-3 block">🔍</span>
                            <h3 className="text-base font-bold text-white mb-1">No smartphones found</h3>
                            <p className="text-gray-500 text-xs">Try adjusting your filters or search term.</p>
                        </div>
                    )}
                </div>

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
    );
};

export default StoreSection;
