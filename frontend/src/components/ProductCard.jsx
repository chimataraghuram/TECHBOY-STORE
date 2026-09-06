import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Heart, Bell, GitCompare, Star } from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const ProductCard = ({ product, onCompare, isComparing, onPriceAlert, index }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const imageSrc = !imgError && product.image ? resolveProductImage(product.image, product.name) : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80";
    
    const currentPrice = product.price || 0;
    const prevPrice = Math.round(currentPrice * 1.1); 
    const discount = Math.round(((prevPrice - currentPrice) / prevPrice) * 100);
    const rating = product.rating || 4.5;
    const reviewCount = "1.2K";

    const handleSaveToWatchlist = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('techboy_token');
        if (!token) {
            alert("Please sign in to add to wishlist."); 
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/watchlist/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product: product.id })
            });
            if (res.ok) {
                setIsSaved(!isSaved);
            }
        } catch (err) {
            console.error('Failed to save', err);
        }
    };

    return (
        <m.div
            className={`bg-[#111118] border border-white/8 rounded-xl overflow-hidden hover:border-white/20 transition-all group flex flex-col h-full ${isComparing ? 'ring-1 ring-red-500' : ''}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
        >
            {/* Image container */}
            <div className="relative h-[160px] sm:h-[180px] bg-[#0a0a10] flex items-center justify-center overflow-hidden">
                {!imgLoaded && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
                <img 
                    src={imageSrc}
                    alt={product.name} 
                    className={`w-full h-full object-contain p-5 transition-transform duration-300 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => { setImgError(true); setImgLoaded(true); }}
                />
                
                {discount > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        -{discount}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5 flex flex-col flex-1">
                <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">{product.brand || 'Smartphone'}</div>
                <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5em]">{product.name}</h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-red-500 font-bold text-base">₹{currentPrice.toLocaleString('en-IN')}</span>
                    {discount > 0 && <span className="text-gray-500 line-through text-xs">₹{prevPrice.toLocaleString('en-IN')}</span>}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-300 text-xs font-medium">{rating}</span>
                    <span className="text-gray-500 text-[10px]">({reviewCount})</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                    <button 
                        onClick={handleSaveToWatchlist}
                        className={`p-2 rounded-lg transition-colors border flex-shrink-0 ${isSaved ? 'bg-red-500/15 text-red-500 border-red-500/30' : 'bg-white/5 text-gray-500 hover:text-white border-white/5 hover:border-white/15'}`}
                        title="Wishlist"
                        aria-label="Add to Wishlist"
                    >
                        <Heart size={14} className={isSaved ? "fill-red-500" : ""} />
                    </button>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPriceAlert && onPriceAlert(product, e.currentTarget.getBoundingClientRect()); }}
                        className="p-2 bg-white/5 text-gray-500 hover:text-white border border-white/5 hover:border-white/15 rounded-lg transition-colors flex-shrink-0"
                        title="Price Alert"
                        aria-label="Set Price Alert"
                    >
                        <Bell size={14} />
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); onCompare && onCompare(product); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all border ${isComparing ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:border-white/15'}`}
                        aria-label="Compare"
                    >
                        <GitCompare size={12} /> {isComparing ? 'Comparing' : 'Compare'}
                    </button>
                </div>
            </div>
        </m.div>
    );
};

export default ProductCard;
