import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Loader, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';
import { matchesSearch, filterProducts, TRENDING_SEARCHES } from '../utils/searchHelper';
import localPhonesData from '../data/phones.json';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const SearchModal = ({ isOpen, onClose, onSelectResult }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 120);
        }
        if (!isOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        setIsLoading(true);

        const fetchResults = async () => {
            try {
                // 1. Instant local matching for 0ms responsiveness
                const localMatches = filterProducts(localPhonesData, query);
                if (isMounted && localMatches.length > 0) {
                    setResults(localMatches);
                }

                // 2. Fetch fresh backend search
                const res = await fetch(`${API_BASE_URL}/products/?search=${encodeURIComponent(query)}`);
                if (res.ok && isMounted) {
                    const data = await res.json();
                    const apiList = data.results || data || [];
                    if (apiList.length > 0) {
                        setResults(apiList);
                    } else if (localMatches.length > 0) {
                        setResults(localMatches);
                    } else {
                        setResults([]);
                    }
                }
            } catch (err) {
                console.warn('Search API offline/failed, using local fallback:', err);
                if (isMounted) {
                    setResults(filterProducts(localPhonesData, query));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 180);
        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [query]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[6vh] sm:pt-[10vh] px-3 sm:px-4">
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                    onClick={onClose}
                />
                <m.div
                    initial={{ opacity: 0, y: -25, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -25, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-2xl bg-[#0b0c12] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(255,31,61,0.15)] overflow-hidden"
                >
                    {/* Search Input Bar */}
                    <div className="flex items-center gap-3 p-3.5 sm:p-4.5 border-b border-white/10 bg-white/[0.02]">
                        <Search className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search phones, brands, 5G, specs..."
                            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-gray-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') onClose();
                                if (e.key === 'Enter' && query) {
                                    if (results.length > 0) {
                                        onSelectResult(results[0]);
                                    } else {
                                        onSelectResult({ name: query });
                                    }
                                    onClose();
                                }
                            }}
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                                aria-label="Clear query"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs font-semibold"
                        >
                            ESC
                        </button>
                    </div>

                    {/* Results / Suggestions Container */}
                    <div className="max-h-[65vh] overflow-y-auto divide-y divide-white/5 hide-scrollbar">
                        {/* Empty input state: Trending searches */}
                        {!query && (
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider uppercase mb-3.5">
                                    <TrendingUp size={14} className="text-red-500" />
                                    <span>Trending Searches</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {TRENDING_SEARCHES.map((t) => (
                                        <button
                                            key={t.label}
                                            onClick={() => setQuery(t.query)}
                                            className="text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 px-3.5 py-1.5 rounded-full transition-all"
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
                                    <Sparkles size={14} className="text-red-500" />
                                    <span>Popular Brands</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'iQOO', 'Nothing', 'Vivo', 'Oppo'].map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setQuery(b)}
                                            className="text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-xl transition-all"
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading spinner */}
                        {isLoading && results.length === 0 && (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-red-500">
                                <Loader className="w-6 h-6 animate-spin" />
                                <span className="text-xs text-gray-400">Searching smartphones catalog...</span>
                            </div>
                        )}

                        {/* No results found */}
                        {!isLoading && query && results.length === 0 && (
                            <div className="p-8 text-center">
                                <div className="text-3xl mb-2">🔍</div>
                                <div className="text-white font-bold text-base mb-1">No smartphones found</div>
                                <div className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto mb-4">
                                    No matches for "<span className="text-red-400">{query}</span>". Try searching for brand, processor, or budget range.
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['5G', 'Samsung', 'iPhone', 'Under 20000'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setQuery(s)}
                                            className="text-xs text-gray-300 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10"
                                        >
                                            Try "{s}"
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results list */}
                        {results.length > 0 && (
                            <div className="p-2 sm:p-3">
                                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                                    <span>Matching Smartphones</span>
                                    <span className="text-red-400">{results.length} results</span>
                                </div>
                                {results.map((product) => {
                                    const imgSrc = resolveProductImage(product.image, product.name);
                                    return (
                                        <button
                                            key={product.id || product.name}
                                            onClick={() => {
                                                onSelectResult(product);
                                                onClose();
                                            }}
                                            className="w-full flex items-center gap-3.5 p-2.5 sm:p-3 hover:bg-white/[0.06] rounded-xl sm:rounded-2xl transition-all text-left group"
                                        >
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:border-red-500/40 transition-colors">
                                                <img
                                                    src={imgSrc}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/phones/apple-iphone-16-pro-max.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    {product.brand && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                                            {product.brand}
                                                        </span>
                                                    )}
                                                    {product.tag && (
                                                        <span className="text-[10px] text-gray-400 truncate">
                                                            {product.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-white font-bold text-sm sm:text-base truncate group-hover:text-red-400 transition-colors">
                                                    {product.name}
                                                </div>
                                                {product.category && (
                                                    <div className="text-gray-400 text-xs truncate">
                                                        {product.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-white font-extrabold text-sm sm:text-base bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                                                    {product.price ? `₹${Number(product.price).toLocaleString()}` : 'Check Price'}
                                                </div>
                                                <div className="flex items-center justify-end text-[11px] text-gray-400 group-hover:text-white transition-colors">
                                                    View <ChevronRight size={12} className="ml-0.5" />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </m.div>
            </div>
        </AnimatePresence>
    );
};

export default SearchModal;
