import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    Heart, Bell, ArrowLeftRight, Star, ArrowRight,
    MemoryStick, Database, Camera, Smartphone, BatteryMedium,
    Share2, Check
} from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';
import { parseSpecs } from '../utils/specsParser';
import QuickViewModal from './QuickViewModal';
import { feedback } from '../utils/haptics';
import { copyPhoneShareLink } from '../utils/deepLink';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const stripEmoji = (text = '') =>
    text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').trim();

const ProductCard = ({ product, onCompare, isComparing, onPriceAlert, index }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showQuick, setShowQuick] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

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
            feedback.heartPop();
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

    const handleShareClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        feedback.shareSuccess();
        const res = await copyPhoneShareLink(product);
        if (res.success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <>
            <m.div
                className={`group relative bg-[#09090d] border border-red-500/35 hover:border-red-500/70 rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(255,20,50,0.12)] hover:shadow-[0_0_40px_rgba(255,20,50,0.3)] transition-all duration-300 flex flex-col h-full p-2.5 sm:p-4 w-full ${isComparing ? 'ring-2 ring-red-500' : ''}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 8) * 0.04 }}
                whileHover={{ y: -4 }}
            >
                {/* Outer subtle red neon edge gradient overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(255,31,61,0.08),transparent_60%)]" />

                {/* ── Image stage ── */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#111118] via-[#09090e] to-[#060609] flex items-center justify-center h-[160px] min-[400px]:h-[185px] sm:h-[220px] md:h-[240px] border border-white/[0.04]">
                    {/* Ambient studio stage glow & curved planet horizon glow */}
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.18),transparent_70%)] blur-2xl" />
                        <div className="absolute -left-10 top-6 w-32 h-32 rounded-full border border-red-500/20 blur-[1px]" />
                        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    {!imgLoaded && <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />}
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className={`relative z-10 max-h-[88%] w-auto max-w-[90%] object-contain p-1 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.92))' }}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => { setImgError(true); setImgLoaded(true); }}
                    />

                    {/* Top Left: Rounded Pill Discount Badge with subtle pulse */}
                    {discount > 0 && (
                        <m.div 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-[#ff0d2d] text-white text-[11px] sm:text-xs font-black tracking-tight shadow-[0_4px_16px_rgba(255,13,45,0.7)]"
                        >
                            <span className="relative flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                -{discount}%
                            </span>
                        </m.div>
                    )}

                    {/* Top Right: Wishlist & Share buttons */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                        {/* Share link button */}
                        <m.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={handleShareClick}
                            aria-label="Share smartphone link"
                            title={isCopied ? "Link copied!" : "Share smartphone"}
                            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md transition-all duration-300 ${
                                isCopied
                                    ? 'bg-green-500/25 border border-green-500/60 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                                    : 'bg-black/60 border border-white/15 text-white hover:border-red-500/60 hover:text-red-400 hover:shadow-[0_0_10px_rgba(255,31,61,0.4)]'
                            }`}
                        >
                            {isCopied ? <Check size={12} className="stroke-[3]" /> : <Share2 size={12} />}
                        </m.button>

                        {/* Wishlist button */}
                        <m.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.82 }}
                            onClick={handleSaveToWatchlist}
                            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md transition-all duration-300 ${
                                isSaved
                                    ? 'bg-red-500/25 border border-red-500/60 text-red-500 shadow-[0_0_12px_rgba(255,31,61,0.5)]'
                                    : 'bg-black/60 border border-white/15 text-white hover:border-red-500/60 hover:text-red-400 hover:shadow-[0_0_10px_rgba(255,31,61,0.4)]'
                            }`}
                        >
                            <m.div
                                animate={isSaved ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 450, damping: 15 }}
                            >
                                <Heart size={13} className={isSaved ? "fill-current" : ""} />
                            </m.div>
                        </m.button>
                    </div>

                    {/* Bottom Right: Mini pagination dots indicator (as in reference image) */}
                    <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1.5 pointer-events-none opacity-80">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff0d2d] shadow-[0_0_6px_rgba(255,13,45,0.8)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                    </div>
                </div>

                {/* ── Content Body ── */}
                <div className="pt-3 pb-1 flex flex-col flex-1">
                    {/* Brand Name (Uppercase tracking) */}
                    <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.16em] text-gray-400 uppercase">
                        {product.brand || 'SMARTPHONE'}
                    </span>

                    {/* Smartphone Title */}
                    <h3 className="text-white font-extrabold text-sm min-[400px]:text-base sm:text-lg leading-tight mt-0.5 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>

                    {/* Tagline / Subtitle */}
                    <p className="text-gray-400 text-[11px] sm:text-xs mt-1 line-clamp-1">
                        {tagline || 'Stylish Design. Smooth Performance. Great Value.'}
                    </p>

                    {/* 5-Column Tech Specs Grid (matching reference image) */}
                    <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mt-2.5">
                        {/* RAM */}
                        <div className="bg-[#121219]/90 border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] transition-all rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center text-center">
                            <MemoryStick size={12} className="text-gray-300 mb-0.5 sm:mb-1 shrink-0" />
                            <span className="text-white text-[9px] sm:text-[10px] font-bold leading-none line-clamp-1">
                                {firstToken(specs.ram) || '8GB'}
                            </span>
                            <span className="text-gray-400 text-[7px] sm:text-[8px] font-medium leading-tight mt-0.5">
                                RAM
                            </span>
                        </div>

                        {/* Storage */}
                        <div className="bg-[#121219]/90 border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] transition-all rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center text-center">
                            <Database size={12} className="text-gray-300 mb-0.5 sm:mb-1 shrink-0" />
                            <span className="text-white text-[9px] sm:text-[10px] font-bold leading-none line-clamp-1">
                                {firstToken(specs.storage) || '128GB'}
                            </span>
                            <span className="text-gray-400 text-[7px] sm:text-[8px] font-medium leading-tight mt-0.5">
                                Storage
                            </span>
                        </div>

                        {/* Camera */}
                        <div className="bg-[#121219]/90 border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] transition-all rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center text-center">
                            <Camera size={12} className="text-gray-300 mb-0.5 sm:mb-1 shrink-0" />
                            <span className="text-white text-[9px] sm:text-[10px] font-bold leading-none line-clamp-1">
                                {firstToken(specs.camera) || '50MP'}
                            </span>
                            <span className="text-gray-400 text-[7px] sm:text-[8px] font-medium leading-tight mt-0.5">
                                Camera
                            </span>
                        </div>

                        {/* Display */}
                        <div className="bg-[#121219]/90 border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] transition-all rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center text-center">
                            <Smartphone size={12} className="text-gray-300 mb-0.5 sm:mb-1 shrink-0" />
                            <span className="text-white text-[9px] sm:text-[10px] font-bold leading-none line-clamp-1">
                                {displayMatch ? `${parseFloat(displayMatch[1]).toFixed(1)}"` : '6.6"'}
                            </span>
                            <span className="text-gray-400 text-[7px] sm:text-[8px] font-medium leading-tight mt-0.5">
                                Display
                            </span>
                        </div>

                        {/* Battery */}
                        <div className="bg-[#121219]/90 border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] transition-all rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center text-center">
                            <BatteryMedium size={12} className="text-gray-300 mb-0.5 sm:mb-1 shrink-0" />
                            <span className="text-white text-[9px] sm:text-[10px] font-bold leading-none line-clamp-1">
                                {batteryMatch ? `${batteryMatch[1]}mAh` : '5000mAh'}
                            </span>
                            <span className="text-gray-400 text-[7px] sm:text-[8px] font-medium leading-tight mt-0.5">
                                Battery
                            </span>
                        </div>
                    </div>

                    {/* Price and Discount Tag Row */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-[#ff0d2d] font-black text-lg min-[400px]:text-xl sm:text-2xl tracking-tight leading-none">
                            ₹{currentPrice.toLocaleString('en-IN')}
                        </span>
                        {discount > 0 && (
                            <>
                                <span className="text-gray-500 font-semibold line-through text-xs sm:text-sm">
                                    ₹{prevPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-[#ff0d2d] text-white text-[10px] sm:text-[11px] font-black leading-tight shadow-[0_2px_10px_rgba(255,13,45,0.4)]">
                                    -{discount}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Star Rating and Reviews Row */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-gray-400">
                        <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                        <span className="text-white font-black">{rating}</span>
                        <span className="text-gray-400 text-xs">({reviewCount} reviews)</span>
                    </div>

                    {/* Bottom Action Grid: Wishlist, Track Price, Compare, and View Details */}
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-3.5 pt-1">
                        {/* Wishlist */}
                        <m.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={handleSaveToWatchlist}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                                isSaved
                                    ? 'bg-red-500/20 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(255,31,61,0.25)]'
                                    : 'bg-[#121219]/90 border-white/[0.08] text-gray-300 hover:border-red-500/35 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <Heart size={14} className={isSaved ? "fill-current" : ""} />
                            <span className="text-[9px] font-semibold mt-1">Wishlist</span>
                        </m.button>

                        {/* Track Price */}
                        <m.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => { e.stopPropagation(); onPriceAlert && onPriceAlert(product, e.currentTarget.getBoundingClientRect()); }}
                            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#121219]/90 border border-white/[0.08] text-gray-300 hover:border-red-500/40 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                        >
                            <Bell size={14} />
                            <span className="text-[9px] font-semibold mt-1 leading-tight text-center">Track Price</span>
                        </m.button>

                        {/* Compare */}
                        <m.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => { e.stopPropagation(); onCompare && onCompare(product); }}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                                isComparing
                                    ? 'bg-red-500/20 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(255,31,61,0.25)]'
                                    : 'bg-[#121219]/90 border-white/[0.08] text-gray-300 hover:border-red-500/35 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <ArrowLeftRight size={14} />
                            <span className="text-[9px] font-semibold mt-1">Compare</span>
                        </m.button>

                        {/* View Details — Solid Red Capsule Button with hover shine */}
                        <m.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setShowQuick(true)}
                            className="group/btn relative overflow-hidden flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#ff0d2d] to-[#e60023] hover:from-[#ff2642] hover:to-[#ff0d2d] text-white font-bold px-2 py-2 text-[10.5px] sm:text-xs shadow-[0_4px_16px_rgba(255,13,45,0.45)] hover:shadow-[0_4px_22px_rgba(255,13,45,0.7)] transition-all"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 pointer-events-none" />
                            <span className="relative z-10 whitespace-nowrap">View</span>
                            <ArrowRight size={12} className="relative z-10 stroke-[2.5] transition-transform group-hover/btn:translate-x-0.5" />
                        </m.button>
                    </div>
                </div>
            </m.div>

            <AnimatePresence>
                {showQuick && (
                    <QuickViewModal product={product} onClose={() => setShowQuick(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;