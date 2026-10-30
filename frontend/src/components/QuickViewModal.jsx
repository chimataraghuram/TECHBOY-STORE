import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    Share2, 
    Check, 
    X, 
    Star, 
    Layers, 
    ChevronDown, 
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Tag,
    Cpu,
    Smartphone,
    Camera,
    Battery,
    HardDrive,
    Wifi,
    ArrowRight
} from 'lucide-react';

import { resolveProductImage, getProductImages } from '../utils/imageResolver';
import { recordRecentView } from '../utils/recentViews';
import { copyPhoneShareLink } from '../utils/deepLink';
import { feedback } from '../utils/haptics';
import { buildSpecGroups, buildSixGridHighlights } from '../utils/specSheet';

import Interactive3DStage from './Interactive3DStage';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');
const FALLBACK_IMAGE = '/images/phones/apple-iphone-17-pro-max.png';

const buildLocalSummary = (product) => {
    const tag = product.tag ? `${product.tag} pick` : 'flagship pick';
    return `AI Verdict: The ${product.name} is a standout ${tag} at ₹${Number(product.price || 0).toLocaleString('en-IN')}, delivering top-tier performance, stellar display, and enduring battery life.`;
};

const QuickViewModal = ({ product, onClose, onOpenShare }) => {
    const [aiSummary, setAiSummary] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const [isCopied, setIsCopied] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [imgBroken, setImgBroken] = useState(false);
    const [showFullSpecs, setShowFullSpecs] = useState(false);

    const images = useMemo(() => (product ? getProductImages(product) : []), [product]);
    const baseImage = product ? resolveProductImage(product.image, product.name) : FALLBACK_IMAGE;
    const safeIndex = Math.min(activeImg, Math.max(images.length - 1, 0));
    const imageUrl = imgBroken ? baseImage : (images[safeIndex] || baseImage);

    // Reset state on new product
    useEffect(() => {
        setActiveImg(0);
        setImgBroken(false);
        setViewMode('2d');
        setAiSummary(null);
        setShowFullSpecs(false);
    }, [product?.id]);

    // Close on Escape & prevent body background scrolling
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
    const sixGrid = buildSixGridHighlights(product);
    const currentPrice = Number(product.price || 0);
    const hasGallery = images.length > 1;

    // Gallery prev/next controls
    const handlePrevImg = (e) => {
        e.stopPropagation();
        if (images.length <= 1) return;
        setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setImgBroken(false);
    };

    const handleNextImg = (e) => {
        e.stopPropagation();
        if (images.length <= 1) return;
        setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setImgBroken(false);
    };

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
            aria-label={`${product.name} specs modal`}
            style={{
                background: 'radial-gradient(circle at 50% 10%, rgba(255,20,50,0.18), transparent 45rem), rgba(2,2,6,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}
        >
            <m.div
                className="relative flex w-full max-h-[94dvh] sm:max-h-[90vh] sm:max-w-[700px] md:max-w-[920px] lg:max-w-[1020px] xl:max-w-[1100px] flex-col overflow-hidden rounded-t-[26px] sm:rounded-[24px] border border-red-500/30 bg-[#09090f] shadow-[0_20px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(255,20,50,0.18)]"
                initial={{ opacity: 0, y: 35, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 25, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 340 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Neon Red Curved Top Horizon Glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-gradient-to-r from-transparent via-[#ff1f3d] to-transparent shadow-[0_0_15px_#ff1f3d]" />
                <div className="pointer-events-none absolute -top-16 left-1/2 h-36 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.25),transparent_70%)] blur-2xl" />

                {/* Mobile drag bar */}
                <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

                {/* ── Top Header Row ── */}
                <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Red Tag Capsule Button */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10.5px] font-black uppercase tracking-wider shadow-[0_2px_12px_rgba(220,20,60,0.6)] shrink-0">
                            <Tag size={11} className="fill-white" />
                            <span>{product.brand || 'SMARTPHONE'}</span>
                        </div>

                        {/* Subtitle tag / badge */}
                        {product.tag && (
                            <span className="text-xs font-semibold text-gray-300 truncate hidden sm:inline-block">
                                {product.tag}
                            </span>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Share Button */}
                        <button
                            onClick={() => {
                                feedback.shareSuccess?.();
                                if (onOpenShare) {
                                    onOpenShare();
                                } else {
                                    copyPhoneShareLink(product).then(res => {
                                        if (res.success) {
                                            setIsCopied(true);
                                            setTimeout(() => setIsCopied(false), 2000);
                                        }
                                    });
                                }
                            }}
                            title="Share Deal Card & Viral Links"
                            aria-label="Share Deal Card and Viral Links"
                            className="flex h-9 items-center gap-1.5 px-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white transition-all text-xs font-bold shadow-[0_0_12px_rgba(255,20,50,0.2)]"
                        >
                            <Share2 size={14} />
                            <span className="hidden sm:inline">Share Deal</span>
                        </button>

                        {/* Close Modal Button */}
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 hover:border-red-500/50 hover:bg-red-500/15 hover:text-white transition-all"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable Modal Body ── */}
                <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 space-y-4">
                    {/* View Mode 1: Main Smartphone Hero & 6 Highlights (as in uploaded image 2) */}
                    {!showFullSpecs ? (
                        <div className="space-y-4">
                            {/* Two-Column Stage: Left Image/3D Carousel + Right Specs */}
                            <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
                                {/* Left Visual Stage */}
                                <div className="flex flex-col gap-2.5">
                                    <div className="relative flex h-[260px] sm:h-[300px] md:h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#101018] via-[#09090f] to-[#040407] p-3 shadow-inner group/stage">
                                        {/* Cinematic Stage Ambient Ring Glow */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
                                            {/* Neon dual ring circle glow behind phone */}
                                            <div className="w-56 h-56 rounded-full border border-red-500/20 bg-gradient-to-tr from-red-600/15 via-transparent to-blue-500/15 blur-sm" />
                                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />
                                        </div>

                                        {/* Top Left: "NEW" or Discount Pill */}
                                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                                            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black tracking-wider uppercase shadow-[0_2px_10px_rgba(220,20,60,0.5)]">
                                                NEW
                                            </span>
                                        </div>

                                        {/* Top Right: Segmented 2D / 3D pill */}
                                        <div className="absolute top-3 right-3 z-30 flex items-center rounded-lg bg-black/75 border border-white/15 p-0.5 backdrop-blur-md">
                                            <button
                                                onClick={() => setViewMode('2d')}
                                                className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                                                    viewMode === '2d'
                                                        ? 'bg-red-600 text-white shadow-sm'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                2D
                                            </button>
                                            <button
                                                onClick={() => setViewMode('3d')}
                                                className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                                                    viewMode === '3d'
                                                        ? 'bg-red-600 text-white shadow-sm'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                3D &gt;
                                            </button>
                                        </div>

                                        {/* Left & Right Carousel Arrows (in 2D mode) */}
                                        {viewMode === '2d' && hasGallery && (
                                            <>
                                                <button
                                                    onClick={handlePrevImg}
                                                    aria-label="Previous image"
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all shadow-md active:scale-90"
                                                >
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <button
                                                    onClick={handleNextImg}
                                                    aria-label="Next image"
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all shadow-md active:scale-90"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </>
                                        )}

                                        {/* Phone 2D image or 3D viewer */}
                                        {viewMode === '2d' ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                onError={() => setImgBroken(true)}
                                                className="relative z-10 max-h-[92%] w-auto max-w-[90%] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover/stage:scale-105"
                                            />
                                        ) : (
                                            <Interactive3DStage 
                                                imageUrl={imageUrl} 
                                                productName={product.name} 
                                            />
                                        )}
                                    </div>

                                    {/* Thumbnails Row */}
                                    {hasGallery && (
                                        <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center">
                                            {images.map((src, i) => (
                                                <button
                                                    key={src}
                                                    onClick={() => { setActiveImg(i); setImgBroken(false); setViewMode('2d'); }}
                                                    aria-label={`Thumbnail ${i + 1}`}
                                                    className={`h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black/40 p-1 transition-all ${
                                                        i === safeIndex && viewMode === '2d'
                                                            ? 'border-red-500 shadow-[0_0_12px_rgba(255,31,61,0.5)]'
                                                            : 'border-white/10 hover:border-white/30'
                                                    }`}
                                                >
                                                    <img src={src} alt="" className="h-full w-full object-contain" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right Content Column */}
                                <div className="flex flex-col gap-3 min-w-0">
                                    {/* Title and Specs Subtitle */}
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                                            {product.name}
                                        </h2>
                                        <p className="text-xs sm:text-[13px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                            {product.description || 'Chip: Apple A19 Pro | Display: 6.9" 120Hz Super Retina XDR OLED | Camera: 48MP Quad 8x Telephoto | Battery: 4832mAh 35W | RAM: 12GB | Storage: 512GB'}
                                        </p>
                                    </div>

                                    {/* Price and Badge Row */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                                            ₹{currentPrice.toLocaleString('en-IN')}
                                        </span>

                                        {product.tag && (
                                            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-purple-600/30 border border-red-500/40 text-white text-xs font-bold shadow-sm">
                                                {product.tag}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-xs font-black text-white ml-auto">
                                            <Star size={13} className="fill-amber-400 text-amber-400" />
                                            <span>{product.rating || 4.9}</span>
                                        </span>
                                    </div>

                                    {/* TechBoy AI Verdict Card */}
                                    <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-3.5 sm:p-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-red-400 mb-1">
                                            <Sparkles size={14} className="text-red-400" />
                                            <span>TECHBOY AI VERDICT</span>
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

                                    {/* 6 High-Tech Spec Cards Grid (2 columns x 3 rows) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                        {/* 1. Processor */}
                                        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#12121b]/90 p-3 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                                    <Cpu size={16} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                        {sixGrid.processor.label}
                                                    </div>
                                                    <div className="text-xs sm:text-[13px] font-extrabold text-white truncate mt-0.5">
                                                        {sixGrid.processor.value}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                                        </div>

                                        {/* 2. Display */}
                                        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#12121b]/90 p-3 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                    <Smartphone size={16} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                        {sixGrid.display.label}
                                                    </div>
                                                    <div className="text-xs sm:text-[13px] font-extrabold text-white truncate mt-0.5">
                                                        {sixGrid.display.value}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                                        </div>

                                        {/* 3. Rear Camera */}
                                        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#12121b]/90 p-3 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                    <Camera size={16} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                        {sixGrid.camera.label}
                                                    </div>
                                                    <div className="text-xs sm:text-[13px] font-extrabold text-white truncate mt-0.5">
                                                        {sixGrid.camera.value}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                                        </div>

                                        {/* 4. Battery & Charging */}
                                        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#12121b]/90 p-3 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                    <Battery size={16} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                        {sixGrid.battery.label}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs sm:text-[13px] font-extrabold text-white mt-0.5">
                                                        <span>{sixGrid.battery.value}</span>
                                                        {sixGrid.battery.extra && (
                                                            <span className="text-gray-400 font-semibold">{sixGrid.battery.extra}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                                        </div>

                                        {/* 5. Memory: RAM & Storage */}
                                        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#12121b]/90 p-3 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                                    <HardDrive size={16} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                        {sixGrid.memory.label}
                                                    </div>
                                                    <div className="flex items-center gap-6 text-xs sm:text-[13px] font-extrabold text-white mt-0.5">
                                                        <div>
                                                            <span className="text-[10px] text-gray-400 font-normal mr-1">RAM</span>
                                                            {sixGrid.memory.ram}
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-gray-400 font-normal mr-1">Storage</span>
                                                            {sixGrid.memory.storage}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                                        </div>

                                        {/* 6. Connectivity */}
                                        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#12121b]/90 p-3 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                                    <Wifi size={16} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                        {sixGrid.connectivity.label}
                                                    </div>
                                                    <div className="text-xs sm:text-[12px] font-semibold text-gray-200 truncate mt-0.5">
                                                        {sixGrid.connectivity.value}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* View Mode 2: Full Technical Specifications (as in uploaded image 1) */
                        <div className="space-y-4">
                            {/* Heading with Red Layer Icon */}
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/30 text-red-500">
                                        <Layers size={17} />
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-black text-white">
                                        Full Technical Specifications
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowFullSpecs(false)}
                                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <span>Hide</span>
                                    <ChevronUp size={15} />
                                </button>
                            </div>

                            {/* 2-Column Full Specifications Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {specGroups.map((group) => {
                                    const GroupIcon = group.icon;
                                    return (
                                        <div
                                            key={group.title}
                                            className="rounded-2xl border border-white/[0.08] bg-[#12121b]/90 p-4 transition-all hover:border-white/15"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${group.iconBg || 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    <GroupIcon size={18} />
                                                </span>
                                                <h4 className="text-xs font-black uppercase tracking-wider text-gray-300">
                                                    {group.title}
                                                </h4>
                                            </div>

                                            <dl className="space-y-2">
                                                {group.rows.map((row, i) => (
                                                    <div key={`${row.label}-${i}`} className="flex items-baseline justify-between gap-4 text-xs sm:text-[13px]">
                                                        <dt className="text-gray-400 font-medium shrink-0">
                                                            {row.label}
                                                        </dt>
                                                        <dd className="text-white font-bold text-right">
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

                {/* ── Bottom Bar: Full Specs Toggle & View Full Specs Action ── */}
                <div
                    className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] bg-[#07070c] px-4 py-3 sm:px-6 sm:py-3.5"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                >
                    {/* Left: Full Technical Specifications Capsule Switcher */}
                    <button
                        onClick={() => setShowFullSpecs(!showFullSpecs)}
                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:border-red-500/40"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/15 text-red-500">
                            <Layers size={13} />
                        </span>
                        <span>Full Technical Specifications</span>
                        {showFullSpecs ? <ChevronUp size={15} className="text-red-400" /> : <ChevronRight size={15} className="text-red-400" />}
                    </button>

                    {/* Right: Solid Red "View Full Specs ->" CTA Button */}
                    <button
                        onClick={() => setShowFullSpecs(!showFullSpecs)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] hover:from-[#ff3856] hover:to-[#ff1030] px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[0_4px_20px_rgba(230,0,35,0.45)] hover:shadow-[0_6px_25px_rgba(255,31,61,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <span>{showFullSpecs ? 'Back to Overview' : 'View Full Specs'}</span>
                        <ArrowRight size={15} className="stroke-[2.5]" />
                    </button>
                </div>
            </m.div>
        </m.div>,
        document.body
    );
};

export default QuickViewModal;
