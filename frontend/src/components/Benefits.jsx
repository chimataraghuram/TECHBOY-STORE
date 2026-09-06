import React from 'react';
import { Target, Zap, Scale, Bot, ShieldCheck, Heart } from 'lucide-react';
import { m } from 'framer-motion';

const features = [
    { icon: Target, title: 'Track What Matters', desc: 'Track prices of any smartphone and get notified instantly.' },
    { icon: Zap, title: 'Real-time Alerts', desc: 'Never miss a price drop. Get real-time alerts you can trust.' },
    { icon: Scale, title: 'Smart Comparisons', desc: 'Compare specs, prices and features to make the right choice.' },
    { icon: Bot, title: 'AI Recommendations', desc: 'AI suggests the best smartphones based on your needs.' },
    { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your data is safe with enterprise-grade security.' },
    { icon: Heart, title: '100% Free', desc: 'All features are free forever. No hidden charges.' }
];

const Benefits = () => {
    return (
        <section className="py-10 bg-[#0d0d12] border-t border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                    {features.map((item, idx) => (
                        <m.div 
                            key={idx}
                            className="flex flex-col items-center group"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-3 group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
                                <item.icon size={18} />
                            </div>
                            <h4 className="text-white font-semibold text-[11px] mb-1">{item.title}</h4>
                            <p className="text-gray-500 text-[10px] leading-relaxed">{item.desc}</p>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
