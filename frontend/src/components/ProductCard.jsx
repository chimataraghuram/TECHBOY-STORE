import React, { useState } from 'react';
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

    const imageSrc = !imgError && product.image ? resolveProductImage(product.image, product.name) : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80";

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

    const handleSaveToWatchlist = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const token = localStorage.getItem('techboy_token');
        if (!token) {
            alert("Please sign in to add to wishlist.");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/watchlist/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ product: product.id })
            });
            if (res.ok) setIsSaved(!isSaved);
        } catch (err) {
            console.error('Failed to save', err);
        }
    };

    const ghostBtn = "flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition-all duration-300 min-w-0";

    return (
        <>
            <m.div
                className={`group relative bg-[#0a0a0f] border border-red-500/20 rounded-[1.75rem] overflow-hidden hover:border-red-500/45 hover:shadow-[0_25px_70px_rgba(230,0,35,0.18)] shadow-[0_0_50px_rgba(255,31,61,0.08)] transition-all duration-500 flex flex-col h-full p-3 sm:p-3.5 ${isComparing ? 'ring-2 ring-red-500/60' : ''}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
                whileHover={{ y: -6 }}
            >
                {/* ── Image stage ── */}
                <div className="relative rounded-[1.3rem] overflow-hidden bg-[#08080d]">
                    {/* Red ambient glows */}
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute -left-24 top-0 w-72 h-full bg-[radial-gradient(ellipse_at_left,rgba(255,31,61,0.32),transparent_70%)]" />
                        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[radial-gradient(ellipse_at_bottom,rgba(255,31,61,0.28),transparent_70%)]" />
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(255,31,61,0.12),transparent_65%)]" />
                    </div>

                    {!imgLoaded && <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />}
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className={`relative z-10 w-full h-[280px] sm:h-[320px] object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.7))' }}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => { setImgError(true); setImgLoaded(true); }}
                    />

                    {/* Discount pill */}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 z-20 px-5 py-2 rounded-full bg-[#e60023] text-white text-sm font-extrabold shadow-[0_0_22px_rgba(230,0,35,0.65)]">
                            -{discount}%
                        </div>
                    )}

                    {/* Wishlist */}
                    <button
                        onClick={handleSaveToWatchlist}
                        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                        className={`absolute top-4 right-4 z-20 flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md transition-all duration-300 ${isSaved ? 'bg-red-500/25 border border-red-500/60 text-red-500 shadow-[0_0_16px_rgba(255,31,61,0.5)]' : 'bg-black/50 border border-red-500/25 text-white hover:border-red-500/60 hover:shadow-[0_0_14px_rgba(255,31,61,0.4)]'}`}
                    >
                        <Heart size={20} className={isSaved ? "fill-current" : ""} />
                    </button>

                    {/* Side tagline */}
                    <div className="absolute right-4 top-[30%] z-20 text-right hidden min-[400px]:block pointer-events-none select-none" aria-hidden="true">
                        <p className="text-[10px] font-semibold tracking-[0.32em] text-gray-500 leading-[2]">BIGGER<br />IDEAS<br />BRIGHTER<br />DAYS</p>
                        <span className="block w-8 h-[2px] ml-auto mt-2 rounded-full bg-gradient-to-l from-red-500 to-transparent" />
                    </div>

                    {/* Carousel dots */}
                    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md" aria-hidden="true">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,31,61,0.9)]" />
                        <span className="w-2 h-2 rounded-full bg-white/25" />
                        <span className="w-2 h-2 rounded-full bg-white/25" />
                        <span className="w-2 h-2 rounded-full bg-white/25" />
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="px-2 sm:px-2.5 pt-5 pb-2 flex flex-col flex-1">
                    <div className="text-[11px] font-bold tracking-[0.3em] text-gray-500 uppercase">
                        {product.brand || 'Smartphone'}
                    </div>
                    <h3 className="text-white font-extrabold text-[26px] sm:text-[28px] leading-tight mt-1">
                        {product.name}
                    </h3>
                    {tagline && (
                        <p className="text-gray-400 text-[13px] sm:text-sm mt-1.5">{tagline}</p>
                    )}

                    {/* Spec chips */}
                    {specChips.length > 0 && (
                        <div className="grid grid-cols-5 gap-1.5 mt-4">
                            {specChips.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] px-1 py-2.5 flex flex-col items-center justify-center gap-1.5 text-center">
                                    <Icon size={17} className="text-gray-200 shrink-0" />
                                    <div className="leading-none">
                                        <div className="text-[9px] min-[400px]:text-[10px] xl:text-[11px] font-bold text-white whitespace-nowrap">{value}</div>
                                        <div className="text-[8px] xl:text-[9px] text-gray-500 mt-1">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Price row */}
                    <div className="flex items-center gap-3 mt-5 flex-wrap">
                        <span className="text-[#ff2a3d] font-extrabold text-4xl tracking-tight">₹{currentPrice.toLocaleString('en-IN')}</span>
                        {discount > 0 && (
                            <>
                                <span className="text-gray-600 font-semibold line-through text-lg">₹{prevPrice.toLocaleString('en-IN')}</span>
                                <span className="px-4 py-1.5 rounded-full bg-[#e60023] text-white text-sm font-extrabold shadow-[0_0_18px_rgba(230,0,35,0.5)]">-{discount}%</span>
                            </>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2.5">
                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-lg font-bold">{rating}</span>
                        <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        <button
                            onClick={handleSaveToWatchlist}
                            className={`${ghostBtn} flex-1 min-w-[62px] bg-white/[0.03] border-white/10 text-gray-200 hover:text-white hover:border-white/25 ${isSaved ? '!border-red-500/50 !text-red-400' : ''}`}
                            aria-label="Wishlist"
                        >
                            <Heart size={19} className={isSaved ? "fill-current" : ""} />
                            <span className="text-[9px] sm:text-[10px] font-semibold">Wishlist</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onPriceAlert && onPriceAlert(product, e.currentTarget.getBoundingClientRect()); }}
                            className={`${ghostBtn} flex-1 min-w-[62px] bg-red-500/10 !border-red-500/50 text-red-400 shadow-[0_0_18px_rgba(255,31,61,0.22)] hover:bg-red-500/20 hover:shadow-[0_0_24px_rgba(255,31,61,0.4)]`}
                            aria-label="Track Price"
                        >
                            <Bell size={19} />
                            <span className="text-[9px] sm:text-[10px] font-semibold">Track Price</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onCompare && onCompare(product); }}
                            className={`${ghostBtn} flex-1 min-w-[62px] bg-white/[0.03] border-white/10 text-gray-200 hover:text-white hover:border-white/25 ${isComparing ? '!border-red-500/50 !text-red-400 !bg-red-500/10' : ''}`}
                            aria-label={isComparing ? "Comparing" : "Compare"}
                        >
                            <ArrowLeftRight size={19} />
                            <span className="text-[9px] sm:text-[10px] font-semibold">{isComparing ? 'Added' : 'Compare'}</span>
                        </button>
                        <button
                            onClick={() => setShowQuick(true)}
                            className="group flex-[2_2_150px] flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#ff3d55] to-[#e60023] hover:from-[#ff4d64] hover:to-[#ff1030] text-white font-bold text-[13px] sm:text-sm shadow-[0_10px_28px_rgba(230,0,35,0.4)] hover:shadow-[0_12px_36px_rgba(255,31,61,0.55)] transition-all active:scale-[0.98] px-3 py-3"
                        >
                            <span className="whitespace-nowrap">View Details</span>
                            <ArrowRight size={17} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
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