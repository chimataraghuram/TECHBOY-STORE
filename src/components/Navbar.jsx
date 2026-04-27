import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bot, LogOut, X, Bookmark, Menu, Home, Info, ShoppingBag, Zap, ChevronRight } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';

const NAV_LINKS = [
    { id: 'home',         label: 'Home',        icon: <Home size={16} /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Info size={16} /> },
    { id: 'products',     label: 'Products',    icon: <ShoppingBag size={16} /> },
    { id: 'features',     label: 'Features',    icon: <Zap size={16} /> },
];

const Navbar = ({ onChatToggle, onSearch, searchTerm }) => {
    const [scrolled, setScrolled]         = useState(false);
    const [isMenuOpen, setIsMenuOpen]     = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showSearch, setShowSearch]     = useState(false);
    const [authModal, setAuthModal]       = useState(null);
    const [authData, setAuthData]         = useState({ username: '', password: '', email: '' });
    const [user, setUser]                 = useState(JSON.parse(localStorage.getItem('techboy_user') || 'null'));
    const [msg, setMsg]                   = useState('');
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
    const searchRef = useRef(null);

    /* ── Scroll & section observer ── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });

        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => e.isIntersecting && setActiveSection(e.target.id)),
            { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
        );
        NAV_LINKS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
    }, []);

    /* ── Close menu on ESC ── */
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setIsMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    /* ── Lock body scroll when mobile menu open ── */
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    /* ── Auth ── */
    const handleAuth = async (e) => {
        e.preventDefault(); setMsg('');
        const endpoint = authModal === 'login' ? 'login/' : 'register/';
        try {
            const res  = await fetch(`http://127.0.0.1:8000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authData)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('techboy_token', data.token);
                localStorage.setItem('techboy_user', JSON.stringify(data.user));
                setUser(data.user); setAuthModal(null);
            } else { setMsg(data.error || 'Authentication failed'); }
        } catch { setMsg('Server error. Make sure backend is running.'); }
    };

    const logout = () => {
        localStorage.removeItem('techboy_token');
        localStorage.removeItem('techboy_user');
        setUser(null);
    };

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    /* ── Slide variants for mobile menu ── */
    const menuVariants = {
        closed: { opacity: 0, y: -16, pointerEvents: 'none' },
        open:   { opacity: 1, y: 0,   pointerEvents: 'auto', transition: { duration: 0.25, ease: 'easeOut' } }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
                <div className="nav-inner">

                    {/* ── Logo ── */}
                    <a href="/" className="nav-logo" onClick={e => { e.preventDefault(); scrollTo('home'); }}>
                        <div className="nav-logo-img-wrap">
                            <img src={logo} alt="TechBoy" className="nav-logo-img" />
                        </div>
                        <span className="nav-logo-text">TECHBOY</span>
                        <span className="nav-logo-sub">STORE</span>
                    </a>

                    {/* ── Desktop Nav Links ── */}
                    <div className="nav-links-desktop">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                className={`nav-link-item ${activeSection === link.id ? 'nav-link-active' : ''}`}
                                onClick={() => scrollTo(link.id)}
                            >
                                {link.label}
                                {activeSection === link.id && (
                                    <motion.span className="nav-link-dot" layoutId="nav-dot" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Desktop Search ── */}
                    <div className={`nav-search-wrap ${showSearch ? 'nav-search-open' : ''}`}>
                        <button className="nav-icon-btn" onClick={() => { setShowSearch(!showSearch); setTimeout(() => searchRef.current?.focus(), 100); }}>
                            {showSearch ? <X size={18} /> : <Search size={18} />}
                        </button>
                        <AnimatePresence>
                            {showSearch && (
                                <motion.div
                                    className="nav-search-box"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 220, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search phones..."
                                        value={searchTerm}
                                        onChange={e => onSearch(e.target.value)}
                                        className="nav-search-input"
                                    />
                                    {searchTerm && (
                                        <button className="nav-search-clear" onClick={() => onSearch('')}><X size={14} /></button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Right Actions ── */}
                    <div className="nav-actions">
                        {/* AI Button */}
                        <button className="nav-ai-btn" onClick={onChatToggle}>
                            <Bot size={17} />
                            <span className="nav-ai-label">TechBoy AI</span>
                        </button>

                        {/* User */}
                        {user ? (
                            <div className="nav-user-wrap">
                                <div className="nav-user-avatar">{user.username[0].toUpperCase()}</div>
                                <span className="nav-user-name">{user.username}</span>
                                <button className="nav-icon-btn" onClick={() => setIsWatchlistOpen(true)} title="Watchlist">
                                    <Bookmark size={17} />
                                </button>
                                <button className="nav-icon-btn nav-logout" onClick={logout} title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <button className="nav-signin-btn" onClick={() => setAuthModal('login')}>
                                Sign In
                            </button>
                        )}

                        {/* Hamburger (mobile) */}
                        <button
                            className={`nav-hamburger ${isMenuOpen ? 'nav-hamburger-open' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Menu"
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>

                {/* ── Mobile Progress Bar ── */}
                <div className="nav-bottom-line" />
            </nav>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            className="mobile-menu-backdrop"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            className="mobile-menu"
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            {/* Mobile Search */}
                            <div className="mobile-search-wrap">
                                <Search size={16} className="mobile-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search phones..."
                                    value={searchTerm}
                                    onChange={e => onSearch(e.target.value)}
                                    className="mobile-search-input"
                                />
                                {searchTerm && <button onClick={() => onSearch('')}><X size={14} /></button>}
                            </div>

                            {/* Mobile Nav Links */}
                            <div className="mobile-nav-links">
                                {NAV_LINKS.map((link, i) => (
                                    <motion.button
                                        key={link.id}
                                        className={`mobile-nav-item ${activeSection === link.id ? 'mobile-nav-active' : ''}`}
                                        onClick={() => scrollTo(link.id)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <span className="mobile-nav-icon">{link.icon}</span>
                                        {link.label}
                                        <ChevronRight size={16} className="mobile-nav-arrow" />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Mobile AI Button */}
                            <button className="mobile-ai-btn" onClick={() => { onChatToggle(); setIsMenuOpen(false); }}>
                                <Bot size={18} />
                                Ask TechBoy AI
                            </button>

                            {/* Mobile Auth */}
                            {!user && (
                                <button className="mobile-signin-btn" onClick={() => { setAuthModal('login'); setIsMenuOpen(false); }}>
                                    Sign In / Register
                                </button>
                            )}
                            {user && (
                                <div className="mobile-user-row">
                                    <div className="nav-user-avatar">{user.username[0].toUpperCase()}</div>
                                    <span>{user.username}</span>
                                    <button className="nav-icon-btn" onClick={() => { setIsWatchlistOpen(true); setIsMenuOpen(false); }}>
                                        <Bookmark size={16} />
                                    </button>
                                    <button className="nav-icon-btn" onClick={logout}><LogOut size={16} /></button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Auth Modal ── */}
            <AnimatePresence>
                {authModal && (
                    <motion.div
                        className="auth-overlay glass"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setAuthModal(null)}
                    >
                        <motion.div
                            className="auth-modal glass-card"
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="close-btn" onClick={() => setAuthModal(null)}>×</button>
                            <div className="auth-logo-row">
                                <img src={logo} alt="TechBoy" style={{ width: 48, height: 48, borderRadius: 12 }} />
                                <h2>{authModal === 'login' ? 'Welcome Back' : 'Join TechBoy'}</h2>
                            </div>
                            <form onSubmit={handleAuth}>
                                {authModal === 'register' && (
                                    <input type="email" placeholder="Email" required className="glass-input"
                                        onChange={e => setAuthData({ ...authData, email: e.target.value })} />
                                )}
                                <input type="text" placeholder="Username" required className="glass-input"
                                    onChange={e => setAuthData({ ...authData, username: e.target.value })} />
                                <input type="password" placeholder="Password" required className="glass-input"
                                    onChange={e => setAuthData({ ...authData, password: e.target.value })} />
                                {msg && <p className="auth-error">{msg}</p>}
                                <button type="submit" className="primary-btn full-width jelly-btn">
                                    {authModal === 'login' ? 'Login' : 'Create Account'}
                                </button>
                            </form>
                            <p className="auth-toggle">
                                {authModal === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                <span onClick={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}>
                                    {authModal === 'login' ? 'Sign Up' : 'Login'}
                                </span>
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
        </>
    );
};

export default Navbar;
