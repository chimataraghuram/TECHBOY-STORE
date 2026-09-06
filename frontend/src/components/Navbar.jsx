import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Bot, X, Menu } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';
import { useAuth } from '../context/AuthContext';
import AuthDropdown from './AuthDropdown';
import NotificationSystem from './NotificationSystem';
import UserDashboard from './UserDashboard';
import SearchModal from './SearchModal';

const getNavbarScrollOffset = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return 80;
    return navbar.getBoundingClientRect().bottom + 12;
};

const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getNavbarScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

const Navbar = ({ onChatToggle, onSearch, searchTerm, currentView, setCurrentView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const { user, login, authLoading } = useAuth();
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = useCallback((e, sectionId) => {
        e.preventDefault();
        setIsMenuOpen(false);
        if (sectionId === 'trackhub') {
            setCurrentView('trackhub');
        } else {
            setCurrentView('home');
            setTimeout(() => {
                scrollToSection(sectionId);
                setActiveSection(sectionId);
            }, 100);
        }
    }, [setCurrentView]);

    const NAV_ITEMS = [
        { id: 'home', label: 'Home' },
        { id: 'products', label: 'Products' },
        { id: 'trends', label: 'Trends' },
        { id: 'trackhub', label: 'TrackHub' },
        { id: 'about', label: 'About' }
    ];

    return (
        <nav className="navbar fixed top-3 left-0 right-0 z-40 px-4" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto glass rounded-full flex items-center justify-between px-5 py-2.5 shadow-lg">
                
                {/* LOGO - LEFT */}
                <div className="flex items-center gap-3">
                    <button 
                        className="lg:hidden text-white hover:text-red-500 transition-colors" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <a href="/" className="flex items-center gap-2.5" onClick={(e) => handleNavClick(e, 'home')}>
                        <img src={logo} alt="TECHBOY STORE" className="h-8 w-8 rounded-full border border-red-500/60 object-cover" />
                        <div className="hidden sm:block leading-none">
                            <span className="text-white font-bold tracking-wider text-sm block">TECHBOY <span className="text-red-500">STORE</span></span>
                            <span className="text-[9px] text-red-500/80 font-semibold tracking-wider">SMARTER CHOICES. BETTER DEALS.</span>
                        </div>
                    </a>
                </div>

                {/* NAV LINKS - CENTER */}
                <div className="hidden lg:flex items-center gap-7">
                    {NAV_ITEMS.map(item => {
                        const isActive = currentView === 'trackhub' ? item.id === 'trackhub' : activeSection === item.id;
                        return (
                            <a 
                                key={item.id}
                                href={`#${item.id}`} 
                                className={`text-[13px] font-semibold transition-all relative pb-1 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={(e) => handleNavClick(e, item.id)}
                            >
                                {item.label}
                                {isActive && (
                                    <m.div layoutId="navIndicator" className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-red-500 rounded-full" />
                                )}
                            </a>
                        );
                    })}
                </div>

                {/* ACTIONS - RIGHT */}
                <div className="flex items-center gap-2 lg:gap-3">
                    <button 
                        className="text-gray-400 hover:text-white transition-colors p-1.5"
                        onClick={() => setIsSearchModalOpen(true)}
                        aria-label="Search"
                    >
                        <Search size={18} />
                    </button>

                    <button 
                        onClick={onChatToggle} 
                        className="hidden md:flex items-center gap-1.5 text-[11px] font-bold bg-white/5 border border-white/10 hover:border-red-500/40 px-3 py-1.5 rounded-full transition-all text-gray-300 hover:text-white"
                    >
                        <Bot size={14} className="text-red-500" />
                        TechBoy AI
                    </button>

                    <NotificationSystem />

                    {user ? (
                        <AuthDropdown onViewChange={setCurrentView} />
                    ) : (
                        <button className="text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-full transition-all" onClick={login} disabled={authLoading}>
                            {authLoading ? '...' : 'Sign Up'}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <m.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden absolute top-full left-4 right-4 mt-2 glass rounded-2xl p-3 flex flex-col shadow-2xl border border-white/10"
                    >
                        {NAV_ITEMS.map(item => (
                            <a 
                                key={item.id}
                                href={`#${item.id}`} 
                                className="text-white text-sm font-medium px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={(e) => handleNavClick(e, item.id)}
                            >
                                {item.label}
                            </a>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>

            <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
            <UserDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
            <SearchModal 
                isOpen={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)}
                onSelectResult={(product) => {
                    console.log('Selected:', product);
                }}
            />
        </nav>
    );
};

export default Navbar;
