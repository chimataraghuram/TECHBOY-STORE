import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bot, X, Menu } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';
import { useAuth } from '../context/AuthContext';
import AuthDropdown from './AuthDropdown';

const Navbar = ({ onChatToggle, onSearch, searchTerm }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const { user, loginWithGoogle } = useAuth();
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const sections = ['home', 'how-it-works', 'products', 'trends', 'features'];
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>

            <div className="navbar-content">
                {/* LOGO AREA - LEFT */}
                <div className="navbar-left">
                    <button 
                        className="mobile-menu-toggle" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <a href="/" className="logo-container">
                        <img src={logo} alt="TECHBOY STORE" className="logo-img" style={{ width: 54, height: 54 }} />
                        <span className="logo-text jelly-text">TECHBOY STORE</span>
                    </a>
                </div>

                {/* NAVIGATION - CENTER */}
                {!isMobile ? (
                    <div className="navbar-center">
                        <div className="nav-links">
                            <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</a>
                            <a href="#products" className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}>Products</a>
                            <a href="#trends" className={`nav-link ${activeSection === 'trends' ? 'active' : ''}`}>Trends 🔥</a>
                            <a href="#how-it-works" className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}>How It Works</a>
                            <a href="#footer" className={`nav-link ${activeSection === 'footer' ? 'active' : ''}`}>Contact</a>
                        </div>
                        <div 
                            className={`search-bar ${scrolled && !isSearchExpanded ? 'collapsed' : ''}`}
                            onClick={() => {
                                if (scrolled && !isSearchExpanded) {
                                    setIsSearchExpanded(true);
                                    // Focus input after expanding
                                    setTimeout(() => document.querySelector('.search-input').focus(), 100);
                                }
                            }}
                        >
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search gear..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onBlur={() => {
                                    if (!searchTerm) setIsSearchExpanded(false);
                                }}
                            />
                            {(searchTerm || (scrolled && isSearchExpanded)) && (
                                <button className="clear-search-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    onSearch('');
                                    setIsSearchExpanded(false);
                                }} title="Close Search">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="navbar-center active mobile-drawer"
                            >
                                <div className="nav-links mobile">
                                    <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</a>
                                    <a href="#products" className={`nav-link ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Products</a>
                                    <a href="#trends" className={`nav-link ${activeSection === 'trends' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Trends 🔥</a>
                                    <a href="#how-it-works" className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>How It Works</a>
                                    <a href="#footer" className={`nav-link ${activeSection === 'footer' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Contact</a>
                                </div>
                                <div className="search-bar mobile">
                                    <Search size={18} className="search-icon" />
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search gear..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    {searchTerm && (
                                        <button className="clear-search-btn" onClick={() => onSearch('')} title="Clear Search">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ACTIONS - RIGHT */}
                <div className="navbar-right">
                    <button onClick={onChatToggle} className="ai-pill-btn-standalone">
                        <Bot size={18} className="ai-pill-icon" />
                        <span className="ai-pill-text">TECHBOY AI</span>
                    </button>
                    {user ? (
                        <AuthDropdown onWatchlistClick={() => setIsWatchlistOpen(true)} />
                    ) : (
                        <button className="pill-auth-btn" onClick={loginWithGoogle}>SIGN UP</button>
                    )}
                </div>
            </div>

            
            <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
        </nav>
    );
};

export default Navbar;
