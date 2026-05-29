import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bot, LogOut, X, Bookmark, Menu } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';

const Navbar = ({ onChatToggle, onSearch, searchTerm }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [authModal, setAuthModal] = useState(null); // 'login' or 'register'
    const [authData, setAuthData] = useState({ username: '', password: '', email: '' });
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('techboy_user') || 'null'));
    const [msg, setMsg] = useState('');
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

        const sections = ['home', 'how-it-works', 'products', 'features'];
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

    const handleAuth = async (e) => {
        e.preventDefault();
        setMsg('');
        const endpoint = authModal === 'login' ? 'login/' : 'register/';
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api'}/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authData)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('techboy_token', data.token);
                localStorage.setItem('techboy_user', JSON.stringify(data.user));
                setUser(data.user);
                setAuthModal(null);
            } else {
                const detail = data.detail || data.error || data.username?.[0] || data.email?.[0] || data.password?.[0] || data.non_field_errors?.[0];
                setMsg(detail || 'Authentication failed');
            }
        } catch {
            setMsg('Server error. Make sure backend is running.');
        }
    };

    const logout = () => {
        localStorage.removeItem('techboy_token');
        localStorage.removeItem('techboy_user');
        setUser(null);
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
                        <img src={logo} alt="TECHBOY STORE" className="logo-img" style={{ width: 32, height: 32 }} />
                        <span className="logo-text jelly-text">TECHBOY STORE</span>
                    </a>
                </div>

                {/* NAVIGATION - CENTER */}
                {!isMobile ? (
                    <div className="navbar-center">
                        <div className="nav-links">
                            <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</a>
                            <a href="#products" className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}>Products</a>
                            <a href="#how-it-works" className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}>How It Works</a>
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
                                    <a href="#how-it-works" className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>How It Works</a>
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
                        <div className="user-info-capsule">
                            <span className="user-name-text">{user.username}</span>
                            <button className="auth-icon-btn action-btn text-gradient" onClick={() => setIsWatchlistOpen(true)} title="Watchlist" style={{ marginRight: '8px' }}>
                                <Bookmark size={18} />
                            </button>
                            <button className="auth-icon-btn logout-btn" onClick={logout} title="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button className="pill-auth-btn" onClick={() => setAuthModal('login')}>SIGN IN</button>
                    )}
                </div>
            </div>

            {authModal && (
                <div className="auth-overlay glass" onClick={() => setAuthModal(null)}>
                    <div className="auth-modal glass-card" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setAuthModal(null)}>&times;</button>
                        <h2>{authModal === 'login' ? 'Welcome Back' : 'Join TechBoy'}</h2>
                        <form onSubmit={handleAuth}>
                            {authModal === 'register' && (
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    required 
                                    className="glass-input"
                                    onChange={e => setAuthData({...authData, email: e.target.value})}
                                />
                            )}
                            <input 
                                type="text" 
                                placeholder="Username" 
                                required 
                                className="glass-input"
                                onChange={e => setAuthData({...authData, username: e.target.value})}
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required 
                                className="glass-input"
                                onChange={e => setAuthData({...authData, password: e.target.value})}
                            />
                            {msg && <p className="auth-error">{msg}</p>}
                            <button type="submit" className="primary-btn full-width">
                                {authModal === 'login' ? 'Login' : 'Create Account'}
                            </button>
                        </form>
                        <p className="auth-toggle">
                            {authModal === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <span onClick={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}>
                                {authModal === 'login' ? 'Sign Up' : 'Login'}
                            </span>
                        </p>
                    </div>
                </div>
            )}
            
            <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
        </nav>
    );
};

export default Navbar;
