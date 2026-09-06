import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { TrendingDown, Flame, Rocket, Star, GitCompare, Bell, ArrowRight } from 'lucide-react';
import PriceAlertModal from './PriceAlertModal';
import { PREDEFINED_NOTIFICATIONS } from './NotificationSystemData';

const CATEGORIES = [
    { id: 'all', label: 'All Trends' },
    { id: 'price_drop', label: 'Price Drops' },
    { id: 'trending', label: 'Trending' },
    { id: 'launch', label: 'New Launches' },
    { id: 'pick', label: 'Analyst Picks' },
    { id: 'comparison', label: 'Comparisons' }
];

const getCategoryIcon = (type) => {
    switch(type) {
        case 'price_drop': return <TrendingDown size={12} className="text-green-500" />;
        case 'launch': return <Rocket size={12} className="text-blue-500" />;
        case 'trending': return <Flame size={12} className="text-orange-500" />;
        case 'pick': return <Star size={12} className="text-purple-500" />;
        case 'comparison': return <GitCompare size={12} className="text-yellow-500" />;
        default: return <Bell size={12} className="text-red-500" />;
    }
};

const getCategoryStyle = (type) => {
    switch(type) {
        case 'price_drop': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'launch': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'trending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        case 'pick': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'comparison': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
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
        <section id="trends" className="py-12 bg-[#080808] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/3 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                
                {/* Section Header */}
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">TechBoy Trends</h2>
                        <p className="text-gray-500 text-xs">Live smartphone intelligence, price drops, and analyst alerts.</p>
                    </div>
                    <button onClick={() => setDisplayCount(alerts.length)} className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 group">
                        View All Trends <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Category Filters */}
                <div className="flex overflow-x-auto pb-3 mb-6 gap-2 hide-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setDisplayCount(8); }}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${activeCategory === cat.id ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Trend Cards Grid */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredAlerts.slice(0, displayCount).map((alert, idx) => (
                            <m.div
                                key={alert.id}
                                id={`trend-alert-${alert.id}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                transition={{ duration: 0.25 }}
                                className="bg-[#111118] border border-white/8 hover:border-white/20 rounded-xl p-3.5 flex flex-col group transition-all target:ring-1 target:ring-red-500 target:bg-red-500/5"
                            >
                                {/* Category badge */}
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border w-fit mb-3 uppercase tracking-wider ${getCategoryStyle(alert.type)}`}>
                                    {getCategoryIcon(alert.type)}
                                    {alert.type.replace('_', ' ')}
                                </div>
                                
                                {/* Image */}
                                <div className="flex items-center justify-center h-28 sm:h-32 mb-3 bg-[#0a0a10] rounded-lg p-3 border border-white/5 overflow-hidden">
                                    <img src={alert.image} alt={alert.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro-max.jpg'; }} />
                                </div>

                                {/* Content */}
                                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{alert.name}</h3>
                                <p className="text-gray-500 text-[11px] mb-3 flex-1 leading-relaxed line-clamp-2">{alert.desc}</p>

                                {/* Price */}
                                {alert.type === 'price_drop' && alert.savings > 0 ? (
                                    <div className="mb-3">
                                        <div className="flex items-baseline gap-2 mb-0.5">
                                            <span className="text-green-500 font-bold text-sm">₹{alert.current?.toLocaleString('en-IN')}</span>
                                            <span className="text-gray-500 line-through text-[10px]">₹{alert.prev?.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="text-green-500 text-[10px] font-semibold flex items-center gap-1">
                                            <TrendingDown size={10} /> ₹{alert.savings?.toLocaleString('en-IN')} ({alert.pct}%)
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <div className="text-gray-300 font-bold text-sm">₹{alert.current?.toLocaleString('en-IN')}</div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between text-[9px] text-gray-500 font-medium mt-auto pt-2.5 border-t border-white/5">
                                    <span>{alert.time}</span>
                                    <span>ID: #{alert.id}</span>
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredAlerts.length > displayCount && (
                    <div className="mt-8 flex justify-center">
                        <button 
                            onClick={() => setDisplayCount(prev => prev + 8)}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2 rounded-full text-xs font-semibold transition-all"
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
