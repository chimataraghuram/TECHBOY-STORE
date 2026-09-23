import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import {
    Heart, Bell, ArrowLeftRight, Star, ArrowRight,
    MemoryStick, Database, Camera, Smartphone, BatteryMedium
} from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';
import { parseSpecs } from '../utils/specsParser';
import QuickViewModal from './QuickViewModal';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const stripEmoji = (text = '') =>
    text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').trim();

const ProductCard = ({ product, onCompare, isComparing, onPriceAlert, index }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showQuick, setShowQuick] = useState(false);

    const imageSrc = resolveProductImage(!imgError ? product.image : null, product.name);

    const currentPrice = product.price || product.current_price || 0;
    const prevPrice = product.prev_price || Math.round(currentPrice * 1.12);
    const discount = prevPrice > currentPrice ? Math.round(((prevPrice - currentPrice) / prevPrice) * 100) : 0;
    const rating = product.rating || 4.5;
    const reviewCount = product.review_count || "1.2K";

    const specs = parseSpecs(product.description || '');
    const firstToken = (s) => (s && s !== '—' ? s.split(' ')[0] : null);
    const displayMatch = (product.description || '').match(/(\d+(?:\.\d+)?)\s*"/);
    const batteryMatch = (product.description || '').match(/(\d+)\s*mAh/i);
    const tagline = stripEmoji(product.tag || '') || product.category || '';

    const specChips = [
        firstToken(specs.ram) && { icon: MemoryStick, value: firstToken(specs.ram), label: 'RAM' },
        firstToken(specs.storage) && { icon: Database, value: firstToken(specs.storage), label: 'Storage' },
        firstToken(specs.camera) && { icon: Camera, value: firstToken(specs.camera), label: 'Camera' },
        displayMatch && { icon: Smartphone, value: `${parseFloat(displayMatch[1]).toFixed(1)}"`, label: 'Display' },
        batteryMatch && { icon: BatteryMedium, value: `${batteryMatch[1]}mAh`, label: 'Battery' }
    ].filter(Boolean);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('tb_wishlist') || '[]');
            if (stored.some(p => p.id === product.id || p.name === product.name)) {
                setIsSaved(true);
            }
        } catch (e) {}
    }, [product.id, product.name]);

    useEffect(() => {
        const handleWishlistChange = () => {
            try {
                const stored = JSON.parse(localStorage.getItem('tb_wishlist') || '[]');
                setIsSaved(stored.some(p => p.id === product.id || p.name === product.name));
            } catch (e) {}
        };
        window.addEventListener('tb_wishlist_updated', handleWishlistChange);
        return () => window.removeEventListener('tb_wishlist_updated', handleWishlistChange);
    }, [product.id, product.name]);

    const handleSaveToWatchlist = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        // 1. Instant local persistence
        try {
            const stored = JSON.parse(localStorage.getItem('tb_wishlist') || '[]');
            const exists = stored.some(p => p.id === product.id || p.name === product.name);
            let updated;
            if (exists) {
                updated = stored.filter(p => p.id !== product.id && p.name !== product.name);
                setIsSaved(false);
            } else {
                updated = [...stored, product];
                setIsSaved(true);
            }
            localStorage.setItem('tb_wishlist', JSON.stringify(updated));
            window.dispatchEvent(new Event('tb_wishlist_updated'));
        } catch (err) {
            console.warn('Wishlist local sync warning', err);
        }

        // 2. Optional backend sync if logged in
        const token = localStorage.getItem('techboy_token');
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/watchlist/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ product: product.id })
                });
            } catch (err) {
                console.error('Failed to sync backend watchlist', err);
            }
        }
    };

    return (
        <>
            <m.div
                className={`group relative bg-[#0a0a0f] border border-red-500/20 rounded-2xl overflow-hidden hover:border-red-500/45 hover:shadow-[0_15px_45px_rgba(230,0,35,0.16)] shadow-[0_0_30px_rgba(255,31,61,0.06)] transition-all duration-300 flex flex-col h-full p-2 sm:p-3 w-full ${isComparing ? 'ring-2 ring-red-500/60' : ''}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 8) * 0.04 }}
                whileHover={{ y: -6, scale: 1.01 }}
            >
                {/* ── Image stage ── */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0e0e16] to-[#07070b] flex items-center justify-center h-[135px] min-[400px]:h-[155px] sm:h-[195px] md:h-[205px] border border-white/[0.04]">
                    {/* Ambient studio lighting */}
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,31,61,0.13),transparent_72%)]" />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[radial-gradient(ellipse_at_bottom,rgba(255,31,61,0.22),transparent_75%)]" />
                    </div>

                    {!imgLoaded && <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />}
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className={`relative z-10 max-h-[90%] w-auto max-w-[92%] object-contain p-1.5 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1.5 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.85))' }}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => { setImgError(true); setImgLoaded(true); }}
                    />

                    {/* Discount pill */}
                    {discount > 0 && (
                        <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full bg-[#e60023] text-white text-[10px] font-extrabold shadow-[0_0_12px_rgba(230,0,35,0.6)] animate-pulse">
                            -{discount}%
                        </div>
                    )}

                    {/* Wishlist button */}
                    <m.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={handleSaveToWatchlist}
                        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                        className={`absolute top-2.5 right-2.5 z-20 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md transition-all duration-300 ${isSaved ? 'bg-red-500/25 border border-red-500/60 text-red-500 shadow-[0_0_12px_rgba(255,31,61,0.5)]' : 'bg-black/50 border border-white/15 text-white hover:border-red-500/60 hover:shadow-[0_0_10px_rgba(255,31,61,0.4)]'}`}
                    >
                        <Heart size={14} className={isSaved ? "fill-current" : ""} />
                    </m.button>
                </div>

                {/* ── Content ── */}
                <div className="px-1 pt-2.5 pb-1 flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                            {product.brand || 'Smartphone'}
                        </span>

                        {/* Price Drop / Market Trend Sparkline */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5" title={discount > 0 ? `${discount}% price drop recently` : 'Stable market price'}>
                            <svg width="34" height="12" viewBox="0 0 34 12" fill="none" className="overflow-visible">
                                <path
                                    d={discount > 0 ? "M 2 2 Q 10 3, 18 7 T 32 10" : "M 2 8 Q 10 3, 20 8 T 32 5"}
                                    fill="none"
                                    stroke={discount > 0 ? "#10b981" : "#818cf8"}
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="32"
                                    cy={discount > 0 ? "10" : "5"}
                                    r="2"
                                    fill={discount > 0 ? "#10b981" : "#818cf8"}
                                />
                            </svg>
                            <span className={`text-[9px] font-bold ${discount > 0 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                {discount > 0 ? `-${discount}%` : 'Stable'}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-white font-bold text-xs min-[400px]:text-sm sm:text-[15px] leading-snug mt-1 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                    {tagline && (
                        <p className="text-gray-400 text-[10px] min-[400px]:text-[11px] mt-0.5 line-clamp-1">{tagline}</p>
                    )}

                    {/* Spec chips */}
                    {specChips.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 sm:mt-2 flex-wrap">
                            {specChips.slice(0, 3).map(({ icon: Icon, value }) => (
                                <div key={value} className="rounded-md border border-white/8 bg-white/[0.03] px-1 sm:px-1.5 py-0.5 flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9px] font-medium text-gray-300">
                                    <Icon size={10} className="text-red-400 shrink-0" />
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Price and Rating row */}
                    <div className="flex items-baseline justify-between gap-1 mt-2 sm:mt-2.5 pt-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[#ff2a3d] font-extrabold text-sm min-[400px]:text-base sm:text-xl tracking-tight">₹{currentPrice.toLocaleString('en-IN')}</span>
                            {discount > 0 && (
                                <span className="text-gray-600 font-semibold line-through text-[10px] sm:text-[11px]">₹{prevPrice.toLocaleString('en-IN')}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-gray-400 font-semibold shrink-0">
                            <Star size={11} className="fill-yellow-400 text-yellow-400 shrink-0" />
                            <span className="text-white font-bold">{rating}</span>
                        </div>
                    </div>

                    {/* Modern Sleek Action Bar */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/[0.07]">
                        {/* View Details — Modern Shimmer Gradient Pill */}
                        <button
                            onClick={() => setShowQuick(true)}
                            className="relative group/btn overflow-hidden flex-1 h-[32px] sm:h-[38px] rounded-lg sm:rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] hover:from-[#ff3350] hover:to-[#d6001c] text-white text-[10.5px] sm:text-[12px] font-bold tracking-wide flex items-center justify-center gap-1 sm:gap-2 shadow-[0_4px_14px_rgba(230,0,35,0.35)] transition-all active:scale-[0.97] border border-white/20"
                        >
                            <span className="relative z-10 font-bold">Details</span>
                            <span className="relative z-10 hidden min-[400px]:inline font-bold">View</span>
                            <ArrowRight size={11} className="relative z-10 stroke-[2.5]" />
                        </button>

                        {/* Track Price — Modern Frosted Icon Button */}
                        <m.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => { e.stopPropagation(); onPriceAlert && onPriceAlert(product, e.currentTarget.getBoundingClientRect()); }}
                            className="group/track relative h-[32px] w-[32px] sm:h-[38px] sm:w-[38px] rounded-lg sm:rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-red-400 flex items-center justify-center transition-all duration-200 shrink-0"
                            title="Track Price"
                            aria-label="Track Price"
                        >
                            <Bell size={13} className="sm:w-[15px] sm:h-[15px]" />
                        </m.button>

                        {/* Compare — Modern Frosted Icon Button */}
                        <m.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => { e.stopPropagation(); onCompare && onCompare(product); }}
                            className={`group/comp relative h-[32px] w-[32px] sm:h-[38px] sm:w-[38px] rounded-lg sm:rounded-xl border transition-all duration-200 flex items-center justify-center shrink-0 ${
                                isComparing
                                    ? 'border-red-500/60 bg-red-500/20 text-red-400 shadow-[0_0_14px_rgba(255,31,61,0.35)]'
                                    : 'border-white/10 bg-white/[0.04] text-gray-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08]'
                            }`}
                            title={isComparing ? 'Remove from compare' : 'Add to compare'}
                            aria-label="Compare"
                        >
                            <ArrowLeftRight size={13} className="sm:w-[15px] sm:h-[15px]" />
                        </m.button>
                    </div>
                </div>
            </m.div>

            {showQuick && (
                <QuickViewModal product={product} onClose={() => setShowQuick(false)} />
            )}
        </>
    );
};

export default ProductCard;