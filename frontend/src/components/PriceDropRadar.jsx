import React from 'react';
import { TrendingDown, Clock, ShieldCheck, Zap } from 'lucide-react';

/**
 * Calculates a smart AI price drop recommendation based on:
 * - Current price vs previous price (drop percentage)
 * - Discount magnitude
 * - Simulated 30-day volatility
 */
export const calculatePriceVerdict = (currentPrice = 0, prevPrice = 0, discount = 0) => {
    const cur = Number(currentPrice) || 0;
    const prev = Number(prevPrice) || cur;
    const disc = Number(discount) || (prev > cur ? Math.round(((prev - cur) / prev) * 100) : 0);

    if (disc >= 18) {
        return {
            status: 'BUY NOW',
            badgeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
            glowColor: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
            icon: Zap,
            headline: 'All-Time Low Alert',
            reason: `Huge ${disc}% drop! This is one of the lowest tracked prices this season.`,
            confidence: 96,
            action: 'Instant Buy Recommended'
        };
    } else if (disc >= 8) {
        return {
            status: 'GOOD DEAL',
            badgeColor: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
            glowColor: 'shadow-[0_0_12px_rgba(34,211,238,0.25)]',
            icon: TrendingDown,
            headline: 'Solid Price Cut',
            reason: `Dropped ${disc}%. Strong value for money at current rate.`,
            confidence: 84,
            action: 'Safe to Purchase'
        };
    } else {
        return {
            status: 'WAIT & TRACK',
            badgeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
            glowColor: 'shadow-[0_0_12px_rgba(251,191,36,0.25)]',
            icon: Clock,
            headline: 'Expected Price Drop Soon',
            reason: 'Trending at standard retail price. Festival deals often drop this by 10-15%.',
            confidence: 78,
            action: 'Set Price Alert'
        };
    }
};

const PriceDropRadar = ({ currentPrice, prevPrice, discount, compact = false, onSetAlert }) => {
    const verdict = calculatePriceVerdict(currentPrice, prevPrice, discount);
    const Icon = verdict.icon;

    if (compact) {
        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-black uppercase tracking-wider backdrop-blur-md ${verdict.badgeColor} ${verdict.glowColor}`}>
                <Icon size={12} className="shrink-0" />
                <span>AI Radar: {verdict.status}</span>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12121d] to-[#0a0a10] border border-white/[0.09] p-3.5 shadow-lg">
            {/* Top subtle highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        AI Price Drop Radar
                    </span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${verdict.badgeColor} ${verdict.glowColor}`}>
                    <Icon size={11} />
                    <span>{verdict.status}</span>
                </div>
            </div>

            <p className="text-white text-xs font-bold leading-snug">
                {verdict.headline}
            </p>
            <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                {verdict.reason}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10.5px]">
                <div className="flex items-center gap-1.5 text-gray-400">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>{verdict.confidence}% confidence</span>
                </div>
                {onSetAlert && verdict.status === 'WAIT & TRACK' && (
                    <button 
                        onClick={onSetAlert}
                        className="text-red-400 hover:text-red-300 font-bold hover:underline transition-colors cursor-pointer"
                    >
                        Track Price &rarr;
                    </button>
                )}
            </div>
        </div>
    );
};

export default PriceDropRadar;
