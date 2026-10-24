import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, ExternalLink, TrendingDown, X, Layers, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import PriceHistoryChart from './PriceHistoryChart';
import PriceDropRadar from './PriceDropRadar';
import { buildSpecGroups, buildHighlights, iconForLabel } from '../utils/specSheet';

const FALLBACK_IMAGE = '/images/phones/apple-iphone-17-pro-max.png';

const DealDetailsModal = ({ product, onClose, onTrack }) => {
  const [showAllSpecs, setShowAllSpecs] = useState(false);

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

  if (!product) return null;

  const current = Number(product.price || product.current || 0);
  const previous = Number(product.prev || product.previous_price || 0);
  const savings = Math.max(0, previous - current);
  const specGroups = buildSpecGroups(product);
  const keyHighlights = buildHighlights(product);
  const highlights = (product.description || product.desc || '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
  const dealScore = product.type === 'price_drop' ? 92 : product.type === 'trending' ? 86 : 89;
  const isPriceDrop = product.type === 'price_drop';
  const categoryLabel = isPriceDrop ? 'PRICE DROP' : product.type === 'launch' ? 'NEW LAUNCH' : product.type === 'pick' ? 'TOP PICK' : 'LIVE DEAL';
  const retailerUrl = product.amazonLink || product.amazon_url || product.amazon_link || product.flipkart_link;

  return createPortal(
    <m.div
      className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} deal details`}
      style={{
        background: 'radial-gradient(circle at 50% 15%, rgba(255,31,61,0.08), transparent 45rem), rgba(3,3,7,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      <m.div
        className="relative flex w-full max-h-[92dvh] sm:max-h-[88vh] sm:max-w-[560px] md:max-w-[720px] lg:max-w-[780px] flex-col overflow-hidden rounded-t-[26px] sm:rounded-[24px] border border-white/10 bg-[#0b0b12]/95 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(255,31,61,0.12)]"
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.98 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-gradient-to-r from-transparent via-[#ff1f3d] to-transparent opacity-90" />
        <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.2),transparent_70%)] blur-2xl" />

        {/* Mobile drag handle */}
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

        {/* Top Header */}
        <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#ff4258]">
              {categoryLabel}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-gray-400">
              <Clock size={11} /> {product.time || 'Live Deal'}
            </span>
            <h2 className="truncate text-xs font-black text-white sm:hidden">
              {product.name}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-gray-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Deal Score: <strong className="text-white ml-0.5">{dealScore}/100</strong>
            </span>
            <button
              onClick={onClose}
              aria-label="Close deal modal"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-300 hover:border-red-500/50 hover:bg-red-500/15 hover:text-white transition-all cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Body with subtle modal-scrollbar */}
        <div className="modal-scrollbar relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-3.5 sm:px-5 sm:py-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] md:grid-cols-[200px_minmax(0,1fr)] gap-3.5 sm:gap-4 items-center">
            {/* Visual Phone Card */}
            <div className="relative flex h-[160px] sm:h-[190px] md:h-[210px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#14141e] via-[#090910] to-[#040407] p-3 shadow-inner">
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
                <div className="h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,31,61,0.22),transparent_70%)] blur-xl" />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <img
                src={product.image || FALLBACK_IMAGE}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="relative z-10 max-h-[92%] w-auto max-w-[92%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-105"
              />
              {savings > 0 && (
                <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-emerald-500/95 text-white text-[10px] font-black tracking-tight shadow-md">
                  Save ₹{savings.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {/* Title, Prices, Deal Stats */}
            <div className="flex flex-col gap-2 min-w-0">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-white leading-tight">
                  {product.name}
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                  {product.desc || product.description || 'Live smartphone deal with real-time price drop tracking.'}
                </p>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{current.toLocaleString('en-IN')}
                </span>
                {previous > current && (
                  <span className="text-xs sm:text-sm font-semibold text-gray-500 line-through">
                    ₹{previous.toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <TrendingDown size={11} /> Best Price Right Now
                  </span>
                )}
              </div>

              {/* Mini Highlights Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">Market Trend</span>
                  <span className="text-[11px] font-bold text-white mt-0.5 flex items-center gap-1">
                    <Check size={11} className="text-emerald-400" /> Lowest in 30 Days
                  </span>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">Authenticity</span>
                  <span className="text-[11px] font-bold text-white mt-0.5 flex items-center gap-1">
                    <ShieldCheck size={11} className="text-red-400" /> Verified Seller
                  </span>
                </div>
              </div>

              {/* Top Feature Highlights */}
              {keyHighlights.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  {keyHighlights.slice(0, 4).map((h) => {
                    const Icon = iconForLabel(h.label);
                    return (
                      <div
                        key={h.label}
                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2 py-1.5 hover:border-white/15 transition-all"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.05] text-red-400">
                          <Icon size={11} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold leading-none">
                            {h.label}
                          </div>
                          <div className="text-[10px] font-bold text-white truncate mt-0.5">
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

          {/* AI Predictive Price Drop Radar */}
          <PriceDropRadar
            currentPrice={current}
            prevPrice={previous}
            discount={previous > current ? Math.round(((previous - current) / previous) * 100) : 0}
            onSetAlert={onTrack ? () => onTrack(product) : undefined}
          />

          {/* Price History Chart */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                30-Day Price Trend & Analytics
              </span>
              <span className="text-[10px] text-gray-400">Live Tracker</span>
            </div>
            <div className="h-[120px] sm:h-[135px]">
              <PriceHistoryChart productId={product.product_id || product.id} currentPrice={current} hideHeader={true} height={120} />
            </div>
          </div>

          {/* Expandable Specifications Sheet */}
          {specGroups.length > 0 && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
              <button
                onClick={() => setShowAllSpecs(!showAllSpecs)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs font-bold text-gray-300 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
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
                    className="border-t border-white/[0.06] p-3 bg-black/20"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {specGroups.map((group) => {
                        const GroupIcon = group.icon;
                        return (
                          <div key={group.title} className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                              <GroupIcon size={11} className="text-red-400" />
                              {group.title}
                            </div>
                            <div className="space-y-1">
                              {group.rows.map((row, i) => (
                                <div key={`${row.label}-${i}`} className="flex items-baseline justify-between gap-2 text-[10px]">
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

        {/* Action Footer */}
        <div
          className="relative z-20 flex shrink-0 items-center gap-2 sm:gap-3 border-t border-white/[0.08] bg-[#08080e]/95 px-4 py-2.5 sm:px-6 sm:py-3 backdrop-blur-md"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => onTrack?.(product)}
            className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:border-red-500/40 active:scale-[0.98]"
          >
            <Bell size={13} />
            <span>Track Price Drop</span>
          </button>
          {retailerUrl && (
            <a
              href={retailerUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_4px_16px_rgba(230,0,35,0.4)] hover:shadow-[0_6px_22px_rgba(255,31,61,0.6)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>View Deal</span>
              <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </m.div>
    </m.div>,
    document.body
  );
};

export default DealDetailsModal;
