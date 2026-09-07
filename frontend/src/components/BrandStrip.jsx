import React from 'react';
import { m } from 'framer-motion';
import { LayoutGrid, Smartphone, Apple, Minus, Circle, Zap, Sparkles, CircleDot } from 'lucide-react';

const BRANDS = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'samsung', label: 'Samsung', icon: Smartphone },
    { id: 'apple', label: 'Apple', icon: Apple },
    { id: 'oneplus', label: 'OnePlus', icon: (props) => <Circle {...props} /> },
    { id: 'xiaomi', label: 'Xiaomi', icon: (props) => <Minus className="stroke-3" {...props} /> },
    { id: 'realme', label: 'Realme', icon: Sparkles },
    { id: 'iqoo', label: 'iQOO', icon: Zap },
    { id: 'nothing', label: 'Nothing', icon: CircleDot },
    { id: 'motorola', label: 'Motorola', icon: (props) => <Circle {...props} /> },
    { id: 'vivo', label: 'Vivo', icon: Smartphone },
    { id: 'oppo', label: 'Oppo', icon: Smartphone }
];

const BrandStrip = ({ activeBrand, onChange }) => {
    return (
        <section id="brands" className="py-10 bg-[#050505] border-b border-white/[0.04]">
            <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12">
                <m.div
                    className="flex flex-wrap gap-2.5 sm:gap-3 lg:gap-4 items-center justify-center lg:justify-start"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, staggerChildren: 0.04 }}
                >
                    {BRANDS.map((brand, idx) => {
                        const isActive = activeBrand.toLowerCase() === brand.id;
                        const Icon = brand.icon;
                        return (
                            <m.button
                                key={brand.id}
                                onClick={() => onChange(brand.id === 'all' ? 'All' : brand.id.charAt(0).toUpperCase() + brand.id.slice(1))}
                                className={`group flex flex-col items-center gap-2 px-5 py-4 min-w-[80px] sm:min-w-[90px] rounded-2xl border transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-br from-red-600/30 to-red-600/10 border-red-500/40 shadow-[0_0_30px_rgba(255,31,61,0.3),0_8px_30px_rgba(255,31,61,0.15)]'
                                        : 'bg-white/[0.02] border-white/10 hover:border-red-500/30 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(255,31,61,0.12)]'
                                }`}
                                variants={{ animate: { scale: [1, 1.02, 1] } }}
                            >
                                <span className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? 'bg-white/10 border border-white/20 text-white'
                                        : 'bg-white/[0.05] border border-white/10 text-gray-400 group-hover:border-red-500/40 group-hover:text-white'
                                }`}>
                                    <Icon size={20} strokeWidth={2.5} />
                                </span>
                                <span className={`text-[11px] font-semibold tracking-wide uppercase transition-colors ${
                                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                                }`}>
                                    {brand.label}
                                </span>
                                {isActive && (
                                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,31,61,0.9)]" />
                                )}
                            </m.button>
                        );
                    })}
                </m.div>
            </div>
        </section>
    );
};

export default BrandStrip;