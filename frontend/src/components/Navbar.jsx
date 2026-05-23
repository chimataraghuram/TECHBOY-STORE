import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bot, LogOut, X, Bookmark, Menu } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';

const Navbar = ({ onChatToggle, onSearch, searchTerm }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [searchActive, setSearchActive] = useState(false);



    const [authModal, setAuthModal] = useState(null); // 'login' or 'register'
    const [authData, setAuthData] = useState({ username: '', password: '', email: '' });
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('techboy_user') || 'null'));
    const [msg, setMsg] = useState('');
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

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
            const res = await fetch(`http://127.0.0.1:8000/api/auth/${endpoint}`, {
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
                setMsg(data.error || 'Authentication failed');
            }
        } catch (err) {
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
                    <div className="pill-wrapper logo-pill">
                        <a href="/" className="logo-container">
                            <img src={logo} alt="TECHBOY STORE" className="logo-img" />
                            <span className="logo-text jelly-text">TECHBOY STORE</span>
                        </a>
                    </div>
                </div>

                {/* NAVIGATION - CENTER */}
                <div className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
                    <div className="navbar-center-group">
                        <div className={`nav-links-pill ${isMenuOpen ? 'active' : ''}`}>
                            <div className="pill-wrapper nav-pills">
                                <a href="#home" className={`nav-pill-item ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</a>
                                <a href="#how-it-works" className={`nav-pill-item ${activeSection === 'how-it-works' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>How it Works</a>
                                <a href="#products" className={`nav-pill-item ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Products</a>
                                <a href="#features" className={`nav-pill-item ${activeSection === 'features' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Features</a>
                            </div>
                        </div>

                        <div className="pill-wrapper search-only-pill">
                            <div className="search-pill">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    className="pill-search-input"
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
                        </div>
                    </div>
                </div>

                {/* ACTIONS - RIGHT */}
                <div className="navbar-right">
                    <div className="navbar-right-group" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                        <div className="pill-wrapper ai-only-pill">
                            <button onClick={onChatToggle} className="ai-pill-btn-standalone">
                                <Bot size={18} className="ai-pill-icon" />
                                <span className="ai-pill-text">TECHBOY AI</span>
                            </button>
                        </div>

                        <div className="pill-wrapper user-pill">
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
                                <button className="pill-auth-btn glow-red" onClick={() => setAuthModal('login')}>SIGN IN</button>
                            )}
                        </div>
                    </div>
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
