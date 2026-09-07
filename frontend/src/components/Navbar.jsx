import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Bot, X, Menu } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import { useAuth } from '../context/AuthContext';
import AuthDropdown from './AuthDropdown';
import NotificationSystem from './NotificationSystem';
import SearchModal from './SearchModal';

const getNavbarScrollOffset = () => {
    const navbar = document.querySelector('.tb-nav');
    if (!navbar) return 110;
    return navbar.getBoundingClientRect().bottom + 24;
};

const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - getNavbarScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'trends', label: 'Trends' },
    { id: 'trackhub', label: 'TrackHub' }
];

const Navbar = ({ onChatToggle, onSearch, searchTerm, currentView, setCurrentView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const { user, login, authLoading } = useAuth();

    const handleNavClick = useCallback((e, sectionId) => {
        e.preventDefault();
        setIsMenuOpen(false);
        if (sectionId === 'trackhub') {
            setCurrentView('trackhub');
            setActiveSection('trackhub');
        } else {
            setCurrentView('home');
            setTimeout(() => {
                scrollToSection(sectionId);
                setActiveSection(sectionId);
            }, 100);
        }
    }, [setCurrentView]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setIsMenuOpen(false);
        if (currentView !== 'home') setCurrentView('home');
        setTimeout(() => scrollToSection('products'), 80);
    };

    return (
        <nav className="tb-nav fixed top-0 left-0 right-0 z-[90] w-full" aria-label="Main navigation">
            <div className="w-full border-b border-white/[0.06] bg-[#060608]/85 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
                <div className="mx-auto max-w-[1560px] px-3 sm:px-5 lg:px-8">
                    <div className="flex items-center justify-between gap-2 sm:gap-4 h-[66px] md:h-[78px]">

                        {/* LOGO */}
                        <a href="/#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" onClick={(e) => handleNavClick(e, 'home')}>
                            <span className="relative shrink-0">
                                <img
                                    src={logo}
                                    alt="TECHBOY STORE"
                                    className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover border border-red-500/60 shadow-[0_0_16px_rgba(255,31,61,0.4)] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(255,31,61,0.65)]"
                                />
                                <span className="absolute inset-0 rounded-full ring-1 ring-white/10 pointer-events-none" />
                            </span>
                            <span className="text-white font-extrabold tracking-wide text-[15px] sm:text-base md:text-lg whitespace-nowrap leading-none">
                                TECHBOY <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,31,61,0.6)]">STORE</span>
                            </span>
                        </a>

                        {/* DESKTOP NAV LINKS */}
                        <div className="hidden lg:flex items-center gap-7 xl:gap-9 shrink-0">
                            {NAV_ITEMS.map(item => {
                                const isActive = currentView === 'trackhub' ? item.id === 'trackhub' : activeSection === item.id;
                                return (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`relative py-2 text-[15px] font-semibold tracking-wide transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                        onClick={(e) => handleNavClick(e, item.id)}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <m.span
                                                layoutId="navIndicator"
                                                className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,31,61,0.9)]"
                                            />
                                        )}
                                    </a>
                                );
                            })}
                        </div>

                        {/* RIGHT CLUSTER */}
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-1 lg:flex-none">

                            {/* Inline search (desktop) */}
                            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center w-[230px] 2xl:w-[280px] h-11 rounded-full bg-white/[0.05] border border-white/10 focus-within:border-red-500/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_20px_rgba(255,31,61,0.18)] px-4 transition-all duration-300">
                                <Search size={16} className="text-gray-500 shrink-0" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => onSearch(e.target.value)}
                                    placeholder="Search smartphones, brands..."
                                    className="flex-1 min-w-0 bg-transparent outline-none border-none text-[13px] text-white placeholder:text-gray-500 px-2.5"
                                />
                                {searchTerm && (
                                    <button type="button" onClick={() => onSearch('')} aria-label="Clear search" className="text-gray-500 hover:text-white p-0.5">
                                        <X size={14} />
                                    </button>
                                )}
                            </form>

                            {/* Search icon (tablet & below) */}
                            <button
                                className="xl:hidden text-gray-300 hover:text-white p-2.5 rounded-full hover:bg-white/[0.07] transition-colors"
                                onClick={() => setIsSearchModalOpen(true)}
                                aria-label="Search"
                            >
                                <Search size={21} />
                            </button>

                            {/* TechBoy AI (desktop) */}
                            <button
                                onClick={onChatToggle}
                                className="hidden md:flex items-center gap-2 text-[13px] font-bold whitespace-nowrap bg-white/[0.05] border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 px-4 py-2.5 rounded-full transition-all text-gray-200 hover:text-white"
                            >
                                <Bot size={17} className="text-red-500 shrink-0" />
                                <span>TechBoy AI</span>
                            </button>

                            <NotificationSystem />

                            {user ? (
                                <AuthDropdown onViewChange={setCurrentView} />
                            ) : (
                                <button
                                    className="hidden sm:flex text-[13px] md:text-sm font-extrabold whitespace-nowrap text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#ff3d55] to-[#e60023] hover:from-[#ff4d64] hover:to-[#ff1030] transition-all shadow-[0_0_20px_rgba(230,0,35,0.45)] hover:shadow-[0_0_30px_rgba(255,31,61,0.65)] items-center justify-center tracking-wider active:scale-95"
                                    onClick={login}
                                    disabled={authLoading}
                                >
                                    {authLoading ? '...' : 'Sign Up'}
                                </button>
                            )}

                            {/* Mobile menu toggle */}
                            <button
                                className="lg:hidden text-gray-200 hover:text-white p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 top-[66px] bg-black/60 backdrop-blur-sm z-[80]"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <m.div
                            initial={{ opacity: 0, y: -14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:hidden absolute top-full left-3 right-3 mt-2 rounded-2xl border border-white/10 bg-[#0a0a0f]/98 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden z-[85]"
                        >
                            <div className="p-3">
                                <form onSubmit={handleSearchSubmit} className="flex items-center h-12 rounded-xl bg-white/[0.05] border border-white/10 px-4 mb-3">
                                    <Search size={16} className="text-gray-500 shrink-0" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => onSearch(e.target.value)}
                                        placeholder="Search smartphones, brands..."
                                        className="flex-1 min-w-0 bg-transparent outline-none border-none text-sm text-white placeholder:text-gray-500 px-3"
                                    />
                                </form>

                                {NAV_ITEMS.map((item, idx) => {
                                    const isActive = currentView === 'trackhub' ? item.id === 'trackhub' : activeSection === item.id;
                                    return (
                                        <m.a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.04 * idx }}
                                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-bold transition-colors ${isActive ? 'bg-red-500/10 text-red-400' : 'text-gray-200 hover:bg-white/[0.06] hover:text-white'}`}
                                            onClick={(e) => handleNavClick(e, item.id)}
                                        >
                                            {item.label}
                                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,31,61,0.9)]" />}
                                        </m.a>
                                    );
                                })}

                                {!user && (
                                    <button
                                        className="mt-3 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff3d55] to-[#e60023] text-white text-sm font-extrabold tracking-wider shadow-[0_0_20px_rgba(230,0,35,0.4)]"
                                        onClick={() => { setIsMenuOpen(false); login(); }}
                                    >
                                        Sign Up
                                    </button>
                                )}
                            </div>
                        </m.div>
                    </>
                )}
            </AnimatePresence>

            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onSelectResult={(product) => {
                    onSearch(product.name || '');
                    setCurrentView('home');
                    setTimeout(() => scrollToSection('products'), 100);
                }}
            />
        </nav>
    );
};

export default Navbar;