import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Loader } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const SearchModal = ({ isOpen, onClose, onSelectResult }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
        if (!isOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/products/?search=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || data || []);
                }
            } catch (err) {
                console.error('Search error:', err);
            }
            setIsLoading(false);
        };

        const debounceTimer = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                <m.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center p-4 border-b border-white/10">
                        <Search className="w-6 h-6 text-gray-400 mr-3" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search smartphones..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-gray-500"
                            onKeyDown={(e) => e.key === 'Escape' && onClose()}
                        />
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {isLoading && (
                            <div className="p-8 flex justify-center text-red-500">
                                <Loader className="w-6 h-6 animate-spin" />
                            </div>
                        )}
                        {!isLoading && query && results.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                No smartphones found for "{query}"
                            </div>
                        )}
                        {!isLoading && results.length > 0 && (
                            <div className="py-2">
                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => {
                                            onSelectResult(product);
                                            onClose();
                                        }}
                                        className="w-full flex items-center p-4 hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center overflow-hidden mr-4 border border-white/5">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <div className="text-xs text-gray-500">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-semibold">{product.brand} {product.name}</div>
                                            <div className="text-red-500 text-sm font-medium">₹{product.current_price?.toLocaleString() || 'N/A'}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </m.div>
            </div>
        </AnimatePresence>
    );
};

export default SearchModal;
