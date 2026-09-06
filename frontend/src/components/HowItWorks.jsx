import React from 'react';
import { m } from 'framer-motion';

const steps = [
    { num: '01', title: 'Search & Discover', desc: "Find smartphones you're interested in." },
    { num: '02', title: 'Compare', desc: "Compare specifications, prices and features." },
    { num: '03', title: 'Track', desc: "Set your target price and enable price monitoring." },
    { num: '04', title: 'Get Alert', desc: "Receive an alert when the price reaches your target." },
    { num: '05', title: 'Buy Smart', desc: "Make a better decision at the right time." }
];

const HowItWorks = () => {
    return (
        <section className="py-14 bg-[#0a0a0f] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-xl font-bold text-white mb-2">How It Works</h2>
                    <p className="text-gray-500 text-xs">Your journey to the perfect smartphone in five simple steps.</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-[1px] bg-red-500/15 z-0"></div>

                    {steps.map((step, idx) => (
                        <m.div 
                            key={step.num}
                            className="relative z-10 flex flex-col items-center text-center w-full md:w-1/5"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-10 h-10 rounded-full bg-[#111118] border-2 border-red-500 flex items-center justify-center text-red-500 font-bold text-xs mb-4 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                {step.num}
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
                            <p className="text-gray-500 text-[11px] leading-relaxed max-w-[140px]">{step.desc}</p>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
