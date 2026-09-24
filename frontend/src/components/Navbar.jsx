import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Bot, X, Menu, TrendingUp, ChevronRight, Home, Smartphone, Flame, Activity, User, LogOut } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import { useAuth } from '../context/AuthContext';
import AuthDropdown from './AuthDropdown';
import NotificationSystem from './NotificationSystem';
import SearchModal from './SearchModal';
import { resolveProductImage } from '../utils/imageResolver';
import { filterProducts, TRENDING_SEARCHES } from '../utils/searchHelper';
import localPhonesData from '../data/phones.json';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

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
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Smartphone },
    { id: 'trends', label: 'Trends', icon: Flame },
    { id: 'trackhub', label: 'TrackHub', icon: Activity }
];

const Navbar = ({ onChatToggle, onSearch, searchTerm, currentView, setCurrentView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
    const [products, setProducts] = useState(localPhonesData);

    const searchContainerRef = useRef(null);
    const mobileProfileRef = useRef(null);
    const { user, login, logout, authLoading } = useAuth();

    // Load full products list for instant search autocomplete
    useEffect(() => {
        let mounted = true;
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/?limit=100`);
                if (res.ok) {
                    const data = await res.json();
                    const list = data.results || data || [];
                    if (mounted && list.length > 0) {
                        setProducts(list);
                    }
                }
            } catch (err) {
                console.warn('Navbar products fetch error (using local):', err);
            }
        };
        fetchProducts();
        return () => { mounted = false; };
    }, []);

    // Close search & mobile profile dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsSearchFocused(false);
            }
            if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target)) {
                setIsMobileProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtered instant search suggestions
    const searchMatches = useMemo(() => {
        if (!searchTerm || !searchTerm.trim()) return [];
        return filterProducts(products, searchTerm).slice(0, 6);
    }, [products, searchTerm]);

    // Track active section on scroll when on home view
    useEffect(() => {
        if (currentView !== 'home') {
            setActiveSection(currentView);
            return;
        }
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const trendsEl = document.getElementById('trends');
            const productsEl = document.getElementById('products');
            
            const trendsTop = trendsEl ? (trendsEl.offsetTop - 280) : Infinity;
            const productsTop = productsEl ? (productsEl.offsetTop - 280) : Infinity;

            if (scrollY >= trendsTop) {
                setActiveSection('trends');
            } else if (scrollY >= productsTop) {
                setActiveSection('products');
            } else {
                setActiveSection('home');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentView]);

    const handleNavClick = useCallback((e, sectionId) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsMenuOpen(false);
        setIsSearchFocused(false);
        if (sectionId === 'trackhub') {
            setCurrentView('trackhub');
            setActiveSection('trackhub');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (sectionId === 'profile') {
            setCurrentView('profile');
            setActiveSection('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setCurrentView('home');
            setTimeout(() => {
                scrollToSection(sectionId);
                setActiveSection(sectionId);
            }, 80);
        }
    }, [setCurrentView]);

    const handleSearchSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsMenuOpen(false);
        setIsSearchFocused(false);
        if (currentView !== 'home') setCurrentView('home');
        setTimeout(() => scrollToSection('products'), 80);
    };

    const handleSelectProduct = (product) => {
        onSearch(product.name || '');
        setIsSearchFocused(false);
        if (currentView !== 'home') setCurrentView('home');
        setTimeout(() => scrollToSection('products'), 80);
    };

    return (
        <>
            {/* TOP HEADER NAVBAR */}
            <nav className="tb-nav fixed top-0 left-0 right-0 z-[90] w-full" aria-label="Main navigation">
                <div className="w-full border-b border-white/[0.06] bg-[#060608]/85 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
                    <div className="mx-auto max-w-[1560px] px-3 sm:px-5 lg:px-8">
                        <div className="flex items-center justify-between gap-2 sm:gap-4 h-[62px] sm:h-[68px] md:h-[78px]">

                            {/* LOGO */}
                            <a href="/#home" className="flex items-center gap-2 sm:gap-3 group shrink-0" onClick={(e) => handleNavClick(e, 'home')}>
                                <span className="relative shrink-0">
                                    <img
                                        src={logo}
                                        alt="TECHBOY STORE"
                                        className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full object-cover border border-red-500/60 shadow-[0_0_16px_rgba(255,31,61,0.4)] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(255,31,61,0.65)]"
                                    />
                                    <span className="absolute inset-0 rounded-full ring-1 ring-white/10 pointer-events-none" />
                                </span>
                                <span className="text-white font-extrabold tracking-wide text-[14px] sm:text-base md:text-lg whitespace-nowrap leading-none">
                                    TECHBOY <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,31,61,0.6)]">STORE</span>
                                </span>
                            </a>

                            {/* DESKTOP NAV LINKS — RED PILLS WITH SYMBOLS */}
                            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shrink-0">
                                {NAV_ITEMS.map(item => {
                                    const Icon = item.icon;
                                    const isActive = currentView === 'trackhub' ? item.id === 'trackhub' : (currentView === 'home' && activeSection === item.id);
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`relative flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 text-[13.5px] font-bold tracking-wide rounded-full transition-all duration-250 select-none z-10 ${
                                                isActive ? 'text-white' : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                                            }`}
                                            onClick={(e) => handleNavClick(e, item.id)}
                                        >
                                            {isActive && (
                                                <m.span
                                                    layoutId="navPill"
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] shadow-[0_2px_14px_rgba(230,0,35,0.55)] border border-white/25 -z-10"
                                                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                                                />
                                            )}
                                            {Icon && <Icon size={14} className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-red-400'}`} />}
                                            <span className="relative z-10">{item.label}</span>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* RIGHT CLUSTER */}
                            <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-1 lg:flex-none">

                                {/* Sleek Search Icon Button (opens search modal) */}
                                <button
                                    type="button"
                                    onClick={() => setIsSearchModalOpen(true)}
                                    className="text-gray-300 hover:text-white p-2 sm:p-2.5 rounded-full hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 transition-all flex items-center justify-center shadow-sm hover:shadow-[0_0_15px_rgba(255,31,61,0.2)]"
                                    aria-label="Search smartphones"
                                    title="Search smartphones"
                                >
                                    <Search size={18} className="text-gray-300 hover:text-red-400 transition-colors" />
                                </button>

                                {/* TechBoy AI (top header button, visible on mobile, tablet & desktop) */}
                                <button
                                    onClick={onChatToggle}
                                    className="relative flex items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] font-bold whitespace-nowrap bg-white/[0.05] border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 p-2 sm:px-3.5 sm:py-2 rounded-full transition-all text-gray-200 hover:text-white group"
                                    aria-label="TechBoy AI"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <Bot size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,31,61,0.9)]" />
                                    </div>
                                    <span className="hidden sm:inline">TechBoy AI</span>
                                </button>

                                <NotificationSystem />

                                {/* Desktop Auth Button (Mobile uses the floating bottom dock Profile icon) */}
                                {user ? (
                                    <div className="hidden lg:block">
                                        <AuthDropdown onViewChange={setCurrentView} />
                                    </div>
                                ) : (
                                    <button
                                        className="hidden lg:flex text-xs sm:text-[13px] md:text-sm font-extrabold whitespace-nowrap text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff3d55] to-[#e60023] hover:from-[#ff4d64] hover:to-[#ff1030] transition-all shadow-[0_0_18px_rgba(230,0,35,0.45)] hover:shadow-[0_0_26px_rgba(255,31,61,0.65)] items-center justify-center tracking-wider active:scale-95"
                                        onClick={login}
                                        disabled={authLoading}
                                    >
                                        Sign Up
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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

            {/* MOBILE & TABLET FLOATING DOCK NAVBAR — DIRECT BODY PORTAL WITH LIQUID GLASS JELLY PHYSICS */}
            {typeof document !== 'undefined' && createPortal(
                <div 
                    className="lg:hidden fixed left-1/2 -translate-x-1/2 z-[9990] w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-[420px] rounded-full bg-gradient-to-b from-[#1c1c2a]/80 via-[#0e0e18]/90 to-[#07070d]/95 backdrop-blur-3xl border border-white/25 p-1.5 ring-1 ring-white/10 pointer-events-auto select-none"
                    style={{
                        bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.88), 0 0 30px rgba(255, 31, 61, 0.22), inset 0 1.5px 1px rgba(255, 255, 255, 0.35), inset 0 -1.5px 2px rgba(0, 0, 0, 0.6)'
                    }}
                >
                    <div className="grid grid-cols-5 items-center justify-items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === 'trackhub' ? item.id === 'trackhub' : (currentView === 'home' && activeSection === item.id);
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={(e) => handleNavClick(e, item.id)}
                                    className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-full w-full transition-all duration-200 select-none group active:scale-90 z-10 ${
                                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <m.div
                                            layoutId="mobileBottomNavPill"
                                            className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ff3856] via-[#e60023] to-[#ad0017] border border-white/35 -z-10"
                                            style={{
                                                boxShadow: '0 4px 18px rgba(230, 0, 35, 0.7), 0 0 25px rgba(255, 31, 61, 0.4), inset 0 1.5px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.45)'
                                            }}
                                            transition={{ type: "spring", stiffness: 360, damping: 22, mass: 0.75 }}
                                        />
                                    )}
                                    <m.div 
                                        className="relative flex items-center justify-center"
                                        animate={isActive ? { scale: [0.88, 1.12, 1] } : { scale: 1 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                    >
                                        <Icon size={18} className={isActive ? 'stroke-[2.6]' : 'stroke-[2]'} />
                                    </m.div>
                                    <span className={`text-[10px] tracking-tight leading-none mt-1 transition-all ${
                                        isActive ? 'font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'font-medium text-gray-400'
                                    }`}>
                                        {item.id === 'products' ? 'Phones' : item.label}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Profile / Sign Up button on mobile bottom nav */}
                        <div className="relative w-full" ref={mobileProfileRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    if (user) {
                                        handleNavClick(e, 'profile');
                                    } else {
                                        login();
                                    }
                                }}
                                className={`relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-full w-full transition-all duration-200 select-none group active:scale-90 z-10 ${
                                    currentView === 'profile' ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {currentView === 'profile' && (
                                    <m.div
                                        layoutId="mobileBottomNavPill"
                                        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ff3856] via-[#e60023] to-[#ad0017] border border-white/35 -z-10"
                                        style={{
                                            boxShadow: '0 4px 18px rgba(230, 0, 35, 0.7), 0 0 25px rgba(255, 31, 61, 0.4), inset 0 1.5px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.45)'
                                        }}
                                        transition={{ type: "spring", stiffness: 360, damping: 22, mass: 0.75 }}
                                    />
                                )}
                                <m.div 
                                    className="relative flex items-center justify-center"
                                    animate={currentView === 'profile' ? { scale: [0.88, 1.12, 1] } : { scale: 1 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                >
                                    {user ? (
                                        <img
                                            src={user.avatar || user.photoURL || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.uid || 'user'))}
                                            alt={user.name || 'User'}
                                            className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] rounded-full object-cover border-[1.8px] border-white/95 shadow-[0_0_14px_rgba(255,31,61,0.65)]"
                                        />
                                    ) : (
                                        <User size={19} className="stroke-[2.3] text-gray-400 group-hover:text-white" />
                                    )}
                                </m.div>
                                <span className={`text-[10px] tracking-tight leading-none mt-1 transition-all ${
                                    currentView === 'profile' ? 'font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'font-medium text-gray-400'
                                }`}>
                                    Profile
                                </span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default Navbar;