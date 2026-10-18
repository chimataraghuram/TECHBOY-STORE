import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    Share2, 
    Check, 
    X, 
    ExternalLink, 
    Star, 
    TrendingDown, 
    Layers, 
    ChevronDown, 
    ChevronUp,
    Tag,
    Box,
    Image as ImageIcon
} from 'lucide-react';

import { resolveProductImage, getProductImages } from '../utils/imageResolver';
import { recordRecentView } from '../utils/recentViews';
import { copyPhoneShareLink } from '../utils/deepLink';
import { feedback } from '../utils/haptics';
import { buildSpecGroups, buildHighlights, iconForLabel } from '../utils/specSheet';

const ThreeDViewer = lazy(() => import('./ThreeDViewer'));

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');
const FALLBACK_IMAGE = '/images/phones/apple-iphone-17-pro-max.png';

const buildLocalSummary = (product) => {
    const tag = product.tag ? `${product.tag} pick` : 'flagship choice';
    return `AI Verdict: The ${product.name} is a standout ${tag} at ₹${Number(product.price || 0).toLocaleString('en-IN')}, delivering top-tier performance, stellar display, and enduring battery life.`;
};

const QuickViewModal = ({ product, onClose }) => {
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const [isCopied, setIsCopied] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [imgBroken, setImgBroken] = useState(false);
    const [showAllSpecs, setShowAllSpecs] = useState(false);

    const images = useMemo(() => (product ? getProductImages(product) : []), [product]);
    const baseImage = product ? resolveProductImage(product.image, product.name) : FALLBACK_IMAGE;
    const safeIndex = Math.min(activeImg, Math.max(images.length - 1, 0));
    const imageUrl = imgBroken ? baseImage : (images[safeIndex] || baseImage);

    const amazonUrl = product?.amazonUrl || product?.amazon_url || product?.amazon_link || product?.links?.amazon;
    const flipkartUrl = product?.flipkartUrl || product?.flipkart_url || product?.flipkart_link || product?.links?.flipkart;

    // Reset internal state whenever product changes
    useEffect(() => {
        setActiveImg(0);
        setImgBroken(false);
        setViewMode('2d');
        setAiSummary(null);
        setShowAllSpecs(false);
    }, [product?.id]);

    // Close on Escape & lock background scroll
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handleKey);
        
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = originalOverflow;
        };
    }, [onClose]);

    // Fetch AI Summary
    useEffect(() => {
        if (!product) return undefined;
        recordRecentView(product);
        let cancelled = false;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const run = async () => {
            setIsLoadingAi(true);
            try {
                const res = await fetch(`${API_BASE_URL}/products/${product.id}/ai_summary/`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled) setAiSummary(data.summary || buildLocalSummary(product));
                } else if (!cancelled) {
                    setAiSummary(buildLocalSummary(product));
                }
            } catch (err) {
                if (err?.name !== 'AbortError') console.error('Failed to fetch AI summary', err);
                if (!cancelled) setAiSummary(buildLocalSummary(product));
            } finally {
                if (!cancelled) setIsLoadingAi(false);
            }
        };
        run();
        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [product?.id]);

    if (!product) return null;

    const specGroups = buildSpecGroups(product);
    const highlights = buildHighlights(product);
    const currentPrice = Number(product.price || 0);
    const prevPrice = Number(product.prev_price || product.previous_price || product.mrp || 0);
    const discount = prevPrice > currentPrice ? Math.round(((prevPrice - currentPrice) / prevPrice) * 100) : 0;
    const hasGallery = images.length > 1;
    const hasActions = Boolean(amazonUrl || flipkartUrl);

    return createPortal(
        <m.div
            className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            style={{
                background: 'radial-gradient(circle at 50% 15%, rgba(255,31,61,0.12), transparent 45rem), rgba(3,3,7,0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
            }}
        >
            <m.div
                className="relative flex w-full max-h-[92dvh] sm:max-h-[86vh] sm:max-w-[620px] md:max-w-[800px] lg:max-w-[920px] flex-col overflow-hidden rounded-t-[26px] sm:rounded-[24px] border border-white/12 bg-[#0c0c12]/95 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_35px_rgba(255,31,61,0.15)]"
                initial={{ opacity: 0, y: 35, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 25, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 340 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Subtle Red Neon Ambient Accent */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-gradient-to-r from-transparent via-[#ff1f3d] to-transparent opacity-90" />
                <div className="pointer-events-none absolute -top-16 left-1/2 h-36 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.22),transparent_70%)] blur-2xl" />

                {/* Mobile drag handle */}
                <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

                {/* ── Compact Top Bar ── */}
                <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5 sm:px-6 sm:py-3 backdrop-blur-md">
                    <div className="min-w-0 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#ff4258]">
                            <Tag size={10} />
                            {product.brand || 'SMARTPHONE'}
                        </span>
                        {product.tag && (
                            <span className="hidden sm:inline-block text-[11px] font-semibold text-gray-400 truncate max-w-[260px]">
                                {product.tag}
                            </span>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Share Button */}
                        <button
                            onClick={async () => {
                                feedback.shareSuccess();
                                const res = await copyPhoneShareLink(product);
                                if (res.success) {
                                    setIsCopied(true);
                                    setTimeout(() => setIsCopied(false), 2000);
                                }
                            }}
                            title={isCopied ? 'Link copied!' : 'Share smartphone'}
                            aria-label="Share smartphone"
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                isCopied
                                    ? 'border-green-500/60 bg-green-500/20 text-green-400'
                                    : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-red-500/40 hover:text-white hover:bg-white/[0.08]'
                            }`}
                        >
                            {isCopied ? <Check size={14} strokeWidth={3} /> : <Share2 size={14} />}
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-300 hover:border-red-500/50 hover:bg-red-500/15 hover:text-white transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-3.5 sm:px-6 sm:py-4.5 space-y-4">
                    {/* Top Section: Phone Stage + Key Specs & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_minmax(0,1fr)] md:grid-cols-[260px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
                        {/* Visual Stage Column */}
                        <div className="flex flex-col gap-2">
                            <div className="relative flex h-[210px] sm:h-[250px] md:h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#14141e] via-[#0a0a10] to-[#050508] p-2 shadow-inner">
                                {/* Ambient Stage Lighting */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
                                    <div className="h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.2),transparent_70%)] blur-xl" />
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/85 to-transparent" />
                                </div>

                                {viewMode === '2d' ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        onError={() => setImgBroken(true)}
                                        className="relative z-10 max-h-[92%] w-auto max-w-[92%] object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-105"
                                    />
                                ) : (
                                    <Suspense fallback={
                                        <div className="relative z-10 flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                            Initializing 3D Canvas...
                                        </div>
                                    }>
                                        <ThreeDViewer imageUrl={baseImage} />
                                    </Suspense>
                                )}

                                {/* Top Left: Discount Pill */}
                                {discount > 0 && (
                                    <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full bg-[#ff0d2d] text-white text-[10px] font-black tracking-tight shadow-md flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        -{discount}%
                                    </div>
                                )}

                                {/* Bottom Left: Floating 2D / 3D Segmented Control */}
                                <div className="absolute bottom-2.5 left-2.5 z-30 flex items-center rounded-lg bg-black/75 border border-white/15 p-0.5 backdrop-blur-md shadow-lg">
                                    <button
                                        onClick={() => setViewMode('2d')}
                                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md transition-all ${
                                            viewMode === '2d'
                                                ? 'bg-red-600 text-white shadow-sm'
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        <ImageIcon size={10} />
                                        <span>2D</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('3d')}
                                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md transition-all ${
                                            viewMode === '3d'
                                                ? 'bg-red-600 text-white shadow-sm'
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        <Box size={10} />
                                        <span>3D</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mini Image Carousel Thumbnails */}
                            {hasGallery && (
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 justify-center">
                                    {images.map((src, i) => (
                                        <button
                                            key={src}
                                            onClick={() => { setActiveImg(i); setImgBroken(false); setViewMode('2d'); }}
                                            aria-label={`Thumbnail ${i + 1}`}
                                            className={`h-9 w-9 shrink-0 overflow-hidden rounded-lg border bg-white/[0.02] p-0.5 transition-all ${
                                                i === safeIndex && viewMode === '2d'
                                                    ? 'border-red-500 shadow-[0_0_8px_rgba(255,31,61,0.4)]'
                                                    : 'border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            <img src={src} alt="" className="h-full w-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title, Price, AI Verdict & Highlights */}
                        <div className="flex flex-col gap-2.5 min-w-0">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                                    {product.name}
                                </h2>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                    {product.description || 'Premium design with flagship display and high-speed processor.'}
                                </p>
                            </div>

                            {/* Price Row */}
                            <div className="flex items-baseline gap-2.5 flex-wrap pt-0.5">
                                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    ₹{currentPrice.toLocaleString('en-IN')}
                                </span>
                                {prevPrice > currentPrice && (
                                    <span className="text-xs sm:text-sm font-semibold text-gray-500 line-through">
                                        ₹{prevPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                        <TrendingDown size={11} /> Save ₹{(prevPrice - currentPrice).toLocaleString('en-IN')}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 ml-auto">
                                    <Star size={11} className="fill-amber-400" /> {product.rating || 4.5}
                                </span>
                            </div>

                            {/* AI Verdict Card */}
                            <div className="relative overflow-hidden rounded-xl border border-red-500/25 bg-red-500/[0.04] p-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-400 mb-1">
                                    <Sparkles size={13} className="text-red-400" />
                                    <span>TechBoy AI Verdict</span>
                                </div>
                                {isLoadingAi ? (
                                    <div className="space-y-1.5 py-1" aria-hidden="true">
                                        <div className="h-2.5 w-[90%] animate-pulse rounded bg-white/10" />
                                        <div className="h-2.5 w-[70%] animate-pulse rounded bg-white/10" />
                                    </div>
                                ) : (
                                    <p className="text-xs sm:text-[13px] leading-relaxed text-gray-200 font-medium">
                                        {aiSummary || buildLocalSummary(product)}
                                    </p>
                                )}
                            </div>

                            {/* Top 4 Spec Highlights Pills */}
                            {highlights.length > 0 && (
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                    {highlights.slice(0, 4).map((h) => {
                                        const Icon = iconForLabel(h.label);
                                        return (
                                            <div
                                                key={h.label}
                                                className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2 hover:border-white/15 transition-all"
                                            >
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-red-400">
                                                    <Icon size={12} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold leading-none">
                                                        {h.label}
                                                    </div>
                                                    <div className="text-[11px] font-bold text-white truncate mt-0.5">
                                                        {h.value}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expandable Technical Specification Sheet */}
                    {specGroups.length > 0 && (
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
                            <button
                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs font-bold text-gray-300 hover:text-white hover:bg-white/[0.02] transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Layers size={13} className="text-red-400" />
                                    Full Technical Specifications
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-red-400 font-semibold">
                                    {showAllSpecs ? 'Hide' : 'View all'}
                                    {showAllSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {showAllSpecs && (
                                    <m.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t border-white/[0.06] p-3 sm:p-4 bg-black/20"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {specGroups.map((group) => {
                                                const GroupIcon = group.icon;
                                                return (
                                                    <div key={group.title} className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                                                            <GroupIcon size={12} className="text-red-400" />
                                                            {group.title}
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            {group.rows.map((row, i) => (
                                                                <div key={`${row.label}-${i}`} className="flex items-baseline justify-between gap-2 text-[11px]">
                                                                    <span className="text-gray-500 font-medium shrink-0">{row.label}</span>
                                                                    <span className="text-white font-semibold text-right">{row.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* ── Fixed Clean Action Footer ── */}
                {hasActions && (
                    <div
                        className="relative z-20 flex shrink-0 items-center gap-2 sm:gap-3 border-t border-white/[0.08] bg-[#08080e]/95 px-4 py-2.5 sm:px-6 sm:py-3 backdrop-blur-md"
                        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                    >
                        {amazonUrl && (
                            <a
                                href={amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_4px_16px_rgba(230,0,35,0.4)] hover:shadow-[0_6px_22px_rgba(255,31,61,0.6)] hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                <span>Buy on Amazon</span>
                                <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
                            </a>
                        )}
                        {flipkartUrl && (
                            <a
                                href={flipkartUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:border-red-500/40 active:scale-[0.98]"
                            >
                                <span>Buy on Flipkart</span>
                                <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
                            </a>
                        )}
                    </div>
                )}
            </m.div>
        </m.div>,
        document.body
    );
};

export default QuickViewModal;
