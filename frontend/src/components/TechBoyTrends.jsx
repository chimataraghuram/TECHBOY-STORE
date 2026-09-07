import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { TrendingDown, Flame, Rocket, Star, GitCompare, Bell, ArrowRight, TrendingUp } from 'lucide-react';
import PriceAlertModal from './PriceAlertModal';
import { PREDEFINED_NOTIFICATIONS } from './NotificationSystemData';
import { parseSpecs } from '../utils/specsParser';

const CATEGORIES = [
    { id: 'all', label: 'All Trends' },
    { id: 'price_drop', label: 'Price Drops' },
    { id: 'trending', label: 'Trending' },
    { id: 'launch', label: 'New Launches' },
    { id: 'pick', label: 'Analyst Picks' },
    { id: 'comparison', label: 'Comparisons' }
];

const getCategoryIcon = (type) => {
    switch (type) {
        case 'price_drop': return <TrendingDown size={12} className="text-green-500" />;
        case 'launch': return <Rocket size={12} className="text-blue-500" />;
        case 'trending': return <Flame size={12} className="text-orange-500" />;
        case 'pick': return <Star size={12} className="text-purple-500" />;
        case 'comparison': return <GitCompare size={12} className="text-yellow-500" />;
        default: return <Bell size={12} className="text-red-500" />;
    }
};

const getCategoryStyle = (type) => {
    switch (type) {
        case 'price_drop': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'launch': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'trending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        case 'pick': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'comparison': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
};

const getTrendLabel = (type) => {
    const labels = {
        price_drop: 'PRICE DROP',
        trending: 'TRENDING',
        launch: 'NEW LAUNCH',
        pick: 'TOP PICK',
        comparison: 'COMPARE'
    };
    return labels[type] || 'TRENDING';
};

const getTrendColor = (type) => {
    const colors = {
        price_drop: 'bg-green-500/20 text-green-500 border-green-500/30',
        trending: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
        launch: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        pick: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
        comparison: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    };
    return colors[type] || 'bg-red-500/20 text-red-500 border-red-500/30';
};

const generateSparkline = (id, pct) => {
    // Deterministic pseudo-random path based on id
    const points = [];
    const seed = id * 12345;
    let val = 50;
    for (let i = 0; i < 30; i++) {
        const r = ((seed + i * 6789) % 100) / 100;
        val = Math.max(10, Math.min(90, val + (r - 0.5) * 25));
        points.push(`${(i / 29) * 100} ${100 - val}`);
    }
    return `M${points.join(' L')}`;
};

const TechBoyTrends = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [priceAlertProduct, setPriceAlertProduct] = useState(null);
    const [displayCount, setDisplayCount] = useState(8);

    const alerts = PREDEFINED_NOTIFICATIONS.map((item, index) => {
        if (index === 5 || index === 15 || index === 25) {
            return { ...item, type: 'comparison', title: 'Versus', desc: `${item.name} vs Competitor` };
        }
        return item;
    });

    const filteredAlerts = activeCategory === 'all'
        ? alerts
        : alerts.filter(a => a.type === activeCategory);

    return (
        <section id="trends" className="py-12 md:py-16 lg:py-20 bg-[#050505] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,31,61,0.06),transparent_60%)] blur-[80px] pointer-events-none" />

            <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">TechBoy Trends</h2>
                        <p className="text-gray-400 text-sm sm:text-base">Live smartphone intelligence, price drops, and analyst alerts.</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors whitespace-nowrap self-start">
                        View All Trends <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Category Filters */}
                <div className="flex overflow-x-auto pb-3 mb-10 gap-2.5 hide-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setDisplayCount(8); }}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                                activeCategory === cat.id
                                    ? 'bg-red-600/30 text-white border-red-500/40 shadow-[0_0_20px_rgba(255,31,61,0.3)]'
                                    : 'bg-white/[0.03] text-gray-400 border-white/10 hover:bg-white/[0.05] hover:text-white hover:border-red-500/30'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Compact Trend Cards Grid - 4 per row desktop, 2 tablet, 1 mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <AnimatePresence mode="popLayout">
                        {filteredAlerts.slice(0, displayCount).map((alert, idx) => {
                            const specs = parseSpecs(alert.desc);
                            const isPriceDrop = alert.type === 'price_drop' && alert.savings > 0;
                            const sparklinePath = generateSparkline(alert.id, alert.pct || 15);

                            return (
                                <m.div
                                    key={alert.id}
                                    id={`trend-alert-${alert.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.25 }}
                                    className="group relative bg-[#0d0d13] border border-white/10 hover:border-red-500/40 rounded-2xl p-4 flex flex-col transition-all target:ring-2 target:ring-red-500 target:bg-red-500/5 hover:shadow-[0_15px_40px_rgba(230,0,35,0.15)]"
                                >
                                    {/* Trend badge */}
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getTrendColor(alert.type)} mb-3 w-fit`}>
                                        {getTrendLabel(alert.type)}
                                    </span>

                                    {/* Image */}
                                    <div className="relative aspect-square mb-4 bg-[#08080c] rounded-xl overflow-hidden">
                                        <img
                                            src={alert.image}
                                            alt={alert.name}
                                            className="w-full h-full object-cover p-3 group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro-max.jpg'; }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-white font-bold text-base leading-snug mb-1.5 line-clamp-1">{alert.name}</h3>
                                    <p className="text-gray-400 text-[11px] mb-3 flex-1 leading-relaxed line-clamp-2">{alert.desc}</p>

                                    {/* Price row */}
                                    {isPriceDrop ? (
                                        <div className="mb-3 p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                                <span className="text-green-500 font-extrabold text-base">₹{alert.current?.toLocaleString('en-IN')}</span>
                                                <span className="text-gray-500 line-through text-xs font-semibold">₹{alert.prev?.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="text-green-400 text-[10px] font-bold flex items-center gap-1">
                                                <TrendingDown size={10} /> Save ₹{alert.savings?.toLocaleString('en-IN')} ({alert.pct}%)
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-white font-extrabold text-base">₹{alert.current?.toLocaleString('en-IN')}</span>
                                            <svg className="w-28 h-10 text-gray-700 group-hover:text-red-500/50 transition-colors" viewBox="0 0 112 40" preserveAspectRatio="none">
                                                <path d={sparklinePath} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mt-auto pt-3 border-t border-white/10">
                                        <span>{alert.time}</span>
                                        <span>ID: #{alert.id}</span>
                                    </div>
                                </m.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredAlerts.length > displayCount && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => setDisplayCount(prev => prev + 8)}
                            className="bg-white/[0.03] hover:bg-white/[0.07] text-white border border-white/10 px-6 py-2.5 rounded-full text-xs font-semibold transition-all"
                        >
                            Load More
                        </button>
                    </div>
                )}

            </div>

            <PriceAlertModal
                isOpen={!!priceAlertProduct}
                onClose={() => setPriceAlertProduct(null)}
                product={priceAlertProduct ? priceAlertProduct.product : null}
                triggerRect={priceAlertProduct ? priceAlertProduct.rect : null}
                user={null}
            />
        </section>
    );
};

export default TechBoyTrends;