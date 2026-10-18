import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { m } from 'framer-motion';
import { Sparkles, Share2, Check, X, ExternalLink, Star, TrendingDown } from 'lucide-react';

import { resolveProductImage, getProductImages } from '../utils/imageResolver';
import { recordRecentView } from '../utils/recentViews';
import { copyPhoneShareLink } from '../utils/deepLink';
import { feedback } from '../utils/haptics';
import { buildSpecGroups, buildHighlights, iconForLabel } from '../utils/specSheet';

const ThreeDViewer = lazy(() => import('./ThreeDViewer'));

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');
const FALLBACK_IMAGE = '/images/phones/apple-iphone-17-pro-max.png';

const buildLocalSummary = (product) => {
    const tag = product.tag ? `${product.tag} pick` : 'solid choice';
    return `AI Verdict: The ${product.name} is a ${tag} at Rs ${product.price?.toLocaleString()}, offering an excellent balance of performance and value.`;
};

const QuickViewModal = ({ product, onClose }) => {
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const [isCopied, setIsCopied] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [imgBroken, setImgBroken] = useState(false);

    const images = useMemo(() => (product ? getProductImages(product) : []), [product]);
    const baseImage = product ? resolveProductImage(product.image, product.name) : FALLBACK_IMAGE;
    const safeIndex = Math.min(activeImg, Math.max(images.length - 1, 0));
    const imageUrl = imgBroken ? baseImage : (images[safeIndex] || baseImage);

    const amazonUrl = product?.amazonUrl || product?.amazon_url || product?.amazon_link || product?.links?.amazon;
    const flipkartUrl = product?.flipkartUrl || product?.flipkart_url || product?.flipkart_link || product?.links?.flipkart;

    // Reset internal state whenever a different product is opened
    useEffect(() => {
        setActiveImg(0);
        setImgBroken(false);
        setViewMode('2d');
        setAiSummary(null);
    }, [product?.id]);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Fetch the AI summary (with a graceful local fallback + abort handling)
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
                // A timeout/close abort is expected and should not pollute the console.
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
    const prevPrice = Number(product.prev_price || 0);
    const discount = prevPrice > currentPrice ? Math.round(((prevPrice - currentPrice) / prevPrice) * 100) : 0;
    const hasGallery = images.length > 1;
    const hasActions = Boolean(amazonUrl || flipkartUrl);

    return createPortal(
        <m.div
            className="tb-sheet-overlay fixed inset-0 z-[100000] flex items-end justify-center p-0 sm:items-center sm:p-4 lg:p-6"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            style={{
                background: 'radial-gradient(circle at 50% 10%, rgba(255,31,61,0.16), transparent 34rem), rgba(2,2,7,0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
            }}
        >
            <m.div
                className="relative flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-b-0 border-white/10 bg-[linear-gradient(160deg,#141020_0%,#0b0b13_46%,#07070c_100%)] shadow-[0_-10px_60px_rgba(0,0,0,0.7)] sm:max-h-[92dvh] sm:max-w-[640px] sm:rounded-[30px] sm:border-b sm:shadow-[0_30px_90px_rgba(0,0,0,0.82),0_0_36px_rgba(255,31,61,0.14)] md:max-w-[880px] lg:max-h-[88dvh] lg:max-w-[1080px] xl:max-w-[1220px]"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Accent line + ambient glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-[#ff1f3d] to-transparent" />
                <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.18),transparent_70%)] blur-2xl" />

                {/* Mobile drag handle */}
                <div className="mx-auto mt-2.5 h-1.5 w-11 shrink-0 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

                {/* Header */}
                <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.015] px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-3.5 lg:px-8">
                    <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3d55]">
                            {product.brand || product.category || 'Smartphone'}
                        </span>
                        <h2 className="truncate text-base font-extrabold leading-tight text-white sm:text-xl lg:text-2xl">
                            {product.name}
                        </h2>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            onClick={async () => {
                                feedback.shareSuccess();
                                const res = await copyPhoneShareLink(product);
                                if (res.success) {
                                    setIsCopied(true);
                                    setTimeout(() => setIsCopied(false), 2200);
                                }
                            }}
                            title={isCopied ? 'Link copied!' : 'Share phone link'}
                            aria-label="Share phone link"
                            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all sm:h-10 sm:w-10 ${
                                isCopied
                                    ? 'border-green-500/60 bg-green-500/20 text-green-400'
                                    : 'border-white/15 bg-white/[0.06] text-white hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400'
                            }`}
                        >
                            {isCopied ? <Check size={16} strokeWidth={3} /> : <Share2 size={16} />}
                        </button>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/45 bg-red-500/15 text-[#ff5f74] transition-all hover:bg-red-500/25 hover:text-white sm:h-10 sm:w-10"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-6 lg:gap-8">
                        {/* ── Media ── */}
                        <div className="flex flex-col gap-3 md:sticky md:top-0 md:self-start">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('2d')}
                                    className={`flex-1 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all lg:text-xs ${
                                        viewMode === '2d'
                                            ? 'bg-gradient-to-r from-[#ff1f3d] to-[#e60023] text-white shadow-[0_4px_16px_rgba(230,0,35,0.4)]'
                                            : 'border border-white/10 bg-white/[0.04] text-gray-300 hover:text-white'
                                    }`}
                                >
                                    2D View
                                </button>
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`flex-1 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all lg:text-xs ${
                                        viewMode === '3d'
                                            ? 'bg-gradient-to-r from-[#ff1f3d] to-[#e60023] text-white shadow-[0_4px_16px_rgba(230,0,35,0.4)]'
                                            : 'border border-white/10 bg-white/[0.04] text-gray-300 hover:text-white'
                                    }`}
                                >
                                    3D Interactive
                                </button>
                            </div>

                            <div className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,#15151f,#08080d)] sm:h-[300px] md:h-[320px] lg:h-[380px] xl:h-[430px]">
                                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                                    <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.22),transparent_70%)] blur-2xl lg:h-72 lg:w-72" />
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                                </div>
                                {viewMode === '2d' ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        onError={() => setImgBroken(true)}
                                        className="relative z-10 max-h-[86%] w-auto max-w-[88%] object-contain p-1.5 transition-transform duration-500 hover:scale-105"
                                        style={{ filter: 'drop-shadow(0 22px 34px rgba(0,0,0,0.85))' }}
                                    />
                                ) : (
                                    <Suspense fallback={<div className="relative z-10 text-xs text-gray-400">Initializing 3D…</div>}>
                                        <ThreeDViewer imageUrl={baseImage} />
                                    </Suspense>
                                )}
                            </div>

                            {hasGallery && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:justify-center">
                                    {images.map((src, i) => (
                                        <button
                                            key={src}
                                            onClick={() => { setActiveImg(i); setImgBroken(false); }}
                                            aria-label={`View photo ${i + 1}`}
                                            className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-white/[0.03] p-1 transition-all sm:h-16 sm:w-16 ${
                                                i === safeIndex ? 'border-red-500/70 shadow-[0_0_12px_rgba(255,31,61,0.35)]' : 'border-white/10 hover:border-white/25'
                                            }`}
                                        >
                                            <img src={src} alt="" className="h-full w-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Details ── */}
                        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
                            <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                <span className="bg-gradient-to-r from-[#ff3350] to-[#ff6b81] bg-clip-text text-3xl font-black leading-none text-transparent sm:text-4xl lg:text-[2.75rem]">
                                    ₹{currentPrice.toLocaleString('en-IN')}
                                </span>
                                {prevPrice > currentPrice && (
                                    <span className="text-sm font-semibold text-gray-500 line-through">
                                        ₹{prevPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                                        <TrendingDown size={12} /> {discount}% off
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                                    <Star size={11} className="fill-amber-400" /> {product.rating || 4.5}
                                </span>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-[#ff1f3d]/25 bg-[#ff1f3d]/[0.05] p-4 lg:p-5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#ff1f3d] to-transparent" />
                                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#ff7d8f]">
                                    <Sparkles size={15} /> NVIDIA AI Summary
                                </h4>
                                {isLoadingAi ? (
                                    <div className="mt-2.5 space-y-2" aria-hidden="true">
                                        <div className="h-3 w-[92%] animate-pulse rounded-full bg-white/10" />
                                        <div className="h-3 w-[78%] animate-pulse rounded-full bg-white/10" />
                                        <div className="h-3 w-[60%] animate-pulse rounded-full bg-white/10" />
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm leading-relaxed text-gray-300 lg:text-[15px]">
                                        {aiSummary || product.description}
                                    </p>
                                )}
                            </div>

                            {highlights.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {highlights.map((h) => {
                                        const Icon = iconForLabel(h.label);
                                        return (
                                            <div
                                                key={h.label}
                                                className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:border-white/15 lg:p-3"
                                            >
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-[#ff4d63] lg:h-8 lg:w-8">
                                                    <Icon size={15} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase tracking-wide text-gray-500">
                                                        {h.label}
                                                    </div>
                                                    <div className="text-[13px] font-semibold leading-snug text-white lg:text-sm">
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

                    {/* ── Full specification sheet ── */}
                    {specGroups.length > 0 && (
                        <div className="mt-5 border-t border-white/[0.06] pt-5 sm:mt-6 sm:pt-6">
                            <div className="mb-3 flex items-center gap-2.5">
                                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-[#ff1f3d] to-[#ff7d8f]" />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-300">
                                    Full Specifications
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {specGroups.map((group) => {
                                    const GroupIcon = group.icon;
                                    return (
                                        <div
                                            key={group.title}
                                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:border-white/12 lg:p-4"
                                        >
                                            <div className="mb-1.5 flex items-center gap-2">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff1f3d]/12 text-[#ff5f74]">
                                                    <GroupIcon size={14} />
                                                </span>
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                                                    {group.title}
                                                </h5>
                                            </div>
                                            <dl className="flex flex-col divide-y divide-white/[0.05]">
                                                {group.rows.map((row, i) => (
                                                    <div key={`${row.label}-${i}`} className="flex items-start justify-between gap-3 py-1.5">
                                                        <dt className="shrink-0 text-[11px] uppercase tracking-wide text-gray-500">
                                                            {row.label}
                                                        </dt>
                                                        <dd className="text-right text-[13px] font-semibold leading-snug text-white">
                                                            {row.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky action footer — always reachable */}
                {hasActions && (
                    <div
                        className="relative z-20 flex shrink-0 flex-col gap-2 border-t border-white/[0.06] bg-black/40 px-4 py-3 backdrop-blur-xl sm:flex-row sm:px-6 lg:px-8"
                        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                    >
                        {amazonUrl && (
                            <a
                                href={amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(230,0,35,0.4)] transition-all hover:from-[#ff3856] hover:to-[#ff1030] active:scale-[0.98]"
                            >
                                Buy on Amazon
                                <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5" />
                            </a>
                        )}
                        {flipkartUrl && (
                            <a
                                href={flipkartUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition-all hover:border-red-500/40 hover:bg-white/[0.09] active:scale-[0.98]"
                            >
                                Buy on Flipkart
                                <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5" />
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
