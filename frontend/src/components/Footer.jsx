import React from 'react';
import logo from '../../images/logos/new-logo.jpg';

const Footer = () => {
    return (
        <footer id="about" className="bg-[#0a0a0f] border-t border-white/5 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Main three columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 mb-10">
                    
                    {/* LEFT - Brand */}
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-2.5 mb-3">
                            <img src={logo} alt="TECHBOY STORE" className="h-8 w-8 rounded-full border border-red-500/40 object-cover" />
                            <div className="leading-none">
                                <span className="text-white font-bold tracking-wider text-sm block">TECHBOY <span className="text-red-500">STORE</span></span>
                                <span className="text-[9px] text-red-500/70 font-semibold tracking-wider">SMARTER CHOICES. BETTER DEALS.</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 max-w-xs">
                            TechBoy Store is your smart companion for discovering, comparing and tracking the best smartphones with real-time alerts and AI recommendations.
                        </p>
                        <a href="https://github.com/chimataraghuram" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg text-white text-[11px] font-semibold transition-colors mb-4">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                            Explore on GitHub
                        </a>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-semibold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">🔒 Secure</span>
                            <span className="text-[9px] font-semibold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">⚡ Fast</span>
                            <span className="text-[9px] font-semibold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">✓ Reliable</span>
                        </div>
                    </div>

                    {/* CENTER - How It Works */}
                    <div className="md:col-span-4">
                        <h4 className="text-white font-bold text-xs tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                            HOW IT WORKS
                        </h4>
                        <p className="text-gray-500 text-[10px] mb-4">Your journey to the perfect smartphone in five simple steps.</p>
                        <div className="space-y-2.5">
                            {[['01', 'Search & Discover', "Find smartphones you're interested in."], ['02', 'Compare', 'Compare specifications, prices and features.'], ['03', 'Track', 'Set your target price and enable monitoring.'], ['04', 'Get Alert', 'Receive an alert when the price reaches your target.'], ['05', 'Buy Smart', 'Make a better decision at the right time.']].map(([num, title, description]) => <div key={num} className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-500 text-[9px] font-bold text-red-500">{num}</span><div><p className="text-[10px] font-bold text-white">{title}</p><p className="text-[9px] leading-relaxed text-gray-500">{description}</p></div></div>)}
                        </div>
                    </div>

                    {/* RIGHT - About Me */}
                    <div className="md:col-span-4">
                        <h4 className="text-white font-bold text-xs tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                            ABOUT ME
                        </h4>
                        <div className="bg-[#111118] border border-white/8 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <img src="https://github.com/chimataraghuram.png" alt="Chimata Raghuram" className="w-10 h-10 rounded-full border border-red-500/40" />
                                <div>
                                    <h5 className="text-white font-bold text-sm">Chimata Raghuram</h5>
                                    <p className="text-red-500 text-[10px] font-bold tracking-wider">Full Stack AI Developer</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-[11px] mb-4 leading-relaxed">
                                Building smart, scalable and user-focused web experiences.
                            </p>
                            <div className="flex gap-2">
                                <a href="https://github.com/chimataraghuram" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition-colors border border-white/5">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                                    GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/chimataraghuram/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/20 rounded-lg text-[10px] font-bold text-blue-400 transition-colors">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Social icons */}
                    <div className="flex items-center gap-2.5">
                        <a href="https://www.linkedin.com/in/chimataraghuram/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5" aria-label="LinkedIn">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                        <a href="https://github.com/chimataraghuram" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5" aria-label="GitHub">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5" aria-label="YouTube">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                        <a href="https://chimataraghuram.github.io/PORTFOLIO/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5" aria-label="Instagram">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5" aria-label="Telegram">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                        </a>
                    </div>

                    {/* Center text */}
                    <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        COOKED BY <span className="text-red-500">RAGHU</span> ❤️
                    </div>

                    {/* Copyright */}
                    <div className="text-[10px] text-gray-600 font-medium">
                        © {new Date().getFullYear()} TECHBOY STORE. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
