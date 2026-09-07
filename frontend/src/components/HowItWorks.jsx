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
        <section className="py-20 bg-[#0a0a0f] border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 xl:px-16">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">How It Works</h2>
                    <p className="text-gray-400 text-sm md:text-base">Your journey to the perfect smartphone in five simple steps.</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between relative gap-10 md:gap-4">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-6 left-[8%] right-[8%] h-[1px] bg-red-500/20 z-0"></div>

                    {steps.map((step, idx) => (
                        <m.div 
                            key={step.num}
                            className="relative z-10 flex flex-col items-center text-center w-full md:w-1/5 px-3"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#111118] border-2 border-red-500 flex items-center justify-center text-red-500 font-bold text-sm mb-5 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                                {step.num}
                            </div>
                            <h3 className="text-white font-bold text-base md:text-lg mb-2">{step.title}</h3>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-[180px]">{step.desc}</p>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
