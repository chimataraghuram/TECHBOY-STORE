import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m } from 'framer-motion';
import { Bell, Check, Clock, ExternalLink, TrendingDown, X } from 'lucide-react';
import PriceHistoryChart from './PriceHistoryChart';
import { buildSpecGroups, buildHighlights, iconForLabel } from '../utils/specSheet';

const FALLBACK_IMAGE = '/images/phones/apple-iphone-17-pro-max.png';

const DealDetailsModal = ({ product, onClose, onTrack }) => {
  // Close on Escape (kept above the null-guard so hooks always run)
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
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
    .slice(0, 6);
  const dealScore = product.type === 'price_drop' ? 91 : product.type === 'trending' ? 84 : 88;
  const isPriceDrop = product.type === 'price_drop';
  const categoryLabel = isPriceDrop ? 'PRICE DROP' : product.type === 'launch' ? 'NEW LAUNCH' : product.type === 'pick' ? 'TOP PICK' : product.type === 'comparison' ? 'COMPARE' : 'LIVE DEAL';
  const retailerUrl = product.amazonLink || product.amazon_url || product.amazon_link;

  return createPortal(
    <m.div
      className="tb-sheet-overlay fixed inset-0 z-[100000] flex items-end justify-center p-0 sm:items-center sm:p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} deal details`}
      style={{
        background: 'radial-gradient(circle at 50% 10%, rgba(168,85,247,0.16), transparent 34rem), rgba(2,2,7,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <m.div
        className="relative flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-b-0 border-white/10 bg-[linear-gradient(160deg,#150a12_0%,#0a0a12_46%,#07070c_100%)] shadow-[0_-10px_60px_rgba(0,0,0,0.7)] sm:max-h-[92dvh] sm:max-w-[660px] sm:rounded-[30px] sm:border-b sm:shadow-[0_30px_90px_rgba(0,0,0,0.82),0_0_36px_rgba(255,31,61,0.14)] md:max-w-[900px] lg:max-h-[88dvh] lg:max-w-[1120px] xl:max-w-[1240px]"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-[#ff1f3d] to-transparent" />

        {/* Mobile drag handle */}
        <div className="mx-auto mt-2.5 h-1.5 w-11 shrink-0 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.015] px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-3.5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#ff5f74]">
              {categoryLabel}
            </span>
            <span className="hidden items-center gap-1 truncate text-[11px] font-medium text-gray-500 sm:flex">
              <Clock size={11} /> {product.time || 'just now'}
            </span>
            <h2 className="truncate text-sm font-extrabold leading-tight text-white sm:hidden">
              {product.name}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-gray-300 lg:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live tracking
            </span>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/45 bg-red-500/15 text-[#ff5f74] transition-all hover:bg-red-500/25 hover:text-white sm:h-10 sm:w-10"
              onClick={onClose}
              aria-label="Close deal details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-6 lg:gap-8">
            {/* ── Media ── */}
            <div className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.18),transparent_64%),#08080d] sm:h-[300px] md:sticky md:top-0 md:h-[320px] md:self-start lg:h-[390px] xl:h-[430px]">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
              <img
                src={product.image || FALLBACK_IMAGE}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="relative z-10 max-h-[86%] w-auto max-w-[86%] object-contain transition-transform duration-500 hover:scale-105"
                style={{ filter: 'drop-shadow(0 22px 34px rgba(0,0,0,0.85))' }}
              />
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-gray-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <Clock size={11} /> Updated {product.time || 'just now'}
              </div>
            </div>

            {/* ── Details ── */}
            <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3d55]">
                  TechBoy Deal Intelligence
                </p>
                <h2 className="mt-1 text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
                  {product.name}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-400 lg:text-[15px]">
                  {product.desc || 'Track this product’s price movement and make a confident buying decision.'}
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                <span className={`bg-clip-text text-3xl font-black leading-none text-transparent sm:text-4xl lg:text-[2.75rem] ${isPriceDrop ? 'bg-gradient-to-r from-emerald-400 to-emerald-200' : 'bg-gradient-to-r from-[#ff3350] to-[#ff6b81]'}`}>
                  ₹{current.toLocaleString('en-IN')}
                </span>
                {previous > current && (
                  <span className="text-sm font-semibold text-gray-500 line-through">
                    ₹{previous.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                  <TrendingDown size={12} /> {savings ? `Save ₹${savings.toLocaleString('en-IN')}` : 'Live price'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 lg:p-3.5">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500">Status</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-white">
                    <Check size={13} className="text-emerald-400" /> {isPriceDrop ? 'Best price' : 'Tracking live'}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 lg:p-3.5">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500">Window</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-white">30 day history</p>
                </div>
              </div>

              {keyHighlights.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {keyHighlights.map((h) => {
                    const Icon = iconForLabel(h.label);
                    return (
                      <div key={h.label} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 lg:p-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-[#ff4d63] lg:h-8 lg:w-8">
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-wide text-gray-500">{h.label}</div>
                          <div className="text-[13px] font-semibold leading-snug text-white">{h.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Dashboard ── */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-2 lg:col-span-2 lg:p-5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-500">Market movement</p>
                  <h3 className="text-sm font-bold text-white">Price history</h3>
                </div>
                <span className="text-[11px] text-gray-500">Last 30 days</span>
              </div>
              <div className="h-[160px] sm:h-[180px] lg:h-[210px]">
                <PriceHistoryChart productId={product.product_id || product.id} currentPrice={current} />
              </div>
            </section>

            <section className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center lg:p-5">
              <p className="text-[10px] uppercase tracking-wide text-gray-500">Deal score</p>
              <div
                className="relative mt-2 flex h-24 w-24 items-center justify-center rounded-full lg:h-28 lg:w-28"
                style={{ background: `conic-gradient(#ff1f3d ${dealScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
              >
                <div className="flex h-[80px] w-[80px] flex-col items-center justify-center rounded-full bg-[#0b0b12] lg:h-[94px] lg:w-[94px]">
                  <strong className="text-2xl font-black text-white lg:text-[26px]">{dealScore}</strong>
                  <span className="text-[10px] text-gray-500">/100</span>
                </div>
              </div>
              <p className="mt-2 text-[13px] font-bold text-white">{dealScore > 89 ? 'Excellent deal' : 'Good value'}</p>
              <p className="text-[11px] text-gray-500">Compared with recent market prices</p>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 lg:p-5">
              <p className="text-[10px] uppercase tracking-wide text-gray-500">Compare prices</p>
              <h3 className="mb-2 text-sm font-bold text-white">Market check</h3>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <div className="flex items-center justify-between"><span className="text-gray-400">TechBoy price</span><b className="text-white">₹{current.toLocaleString('en-IN')}</b></div>
                <div className="flex items-center justify-between"><span className="text-gray-400">Previous price</span><b className="text-white">{previous ? `₹${previous.toLocaleString('en-IN')}` : '—'}</b></div>
                <div className="flex items-center justify-between"><span className="text-gray-400">Potential saving</span><b className="text-emerald-400">₹{savings.toLocaleString('en-IN')}</b></div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-2 lg:col-span-2 lg:p-5">
              <p className="text-[10px] uppercase tracking-wide text-gray-500">Highlights</p>
              <h3 className="mb-2 text-sm font-bold text-white">What stands out</h3>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {(highlights.length ? highlights : ['Strong everyday performance', 'Live price tracking enabled', 'Worth watching at this price']).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-gray-300">
                    <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {specGroups.length > 0 && (
            <section className="mt-4">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-[#ff1f3d] to-[#ff7d8f]" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-500">Technical details</p>
                  <h3 className="text-sm font-bold text-white">Full specifications</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {specGroups.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:border-white/12 lg:p-4">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff1f3d]/12 text-[#ff5f74]">
                          <GroupIcon size={14} />
                        </span>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">{group.title}</h5>
                      </div>
                      <dl className="flex flex-col divide-y divide-white/[0.05]">
                        {group.rows.map((row, i) => (
                          <div key={`${row.label}-${i}`} className="flex items-start justify-between gap-3 py-1.5">
                            <dt className="shrink-0 text-[11px] uppercase tracking-wide text-gray-500">{row.label}</dt>
                            <dd className="text-right text-[13px] font-semibold leading-snug text-white">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sticky action footer */}
        <div
          className="relative z-20 flex shrink-0 flex-col gap-2 border-t border-white/[0.06] bg-black/40 px-4 py-3 backdrop-blur-xl sm:flex-row sm:px-6 lg:px-8"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => onTrack?.(product)}
            className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(230,0,35,0.4)] transition-all hover:from-[#ff3856] hover:to-[#ff1030] active:scale-[0.98]"
          >
            <Bell size={16} /> Track this price
          </button>
          {retailerUrl && (
            <a
              href={retailerUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition-all hover:border-red-500/40 hover:bg-white/[0.09] active:scale-[0.98]"
            >
              <ExternalLink size={15} /> View retailer
            </a>
          )}
        </div>
      </m.div>
    </m.div>,
    document.body
  );
};

export default DealDetailsModal;
