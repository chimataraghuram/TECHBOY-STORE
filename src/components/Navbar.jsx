import { useState, useEffect } from 'react';
import logo from '../assets/techboy-logo.jpg';

const Navbar = ({ onChatToggle, onSearch }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [searchActive, setSearchActive] = useState(false);

    const [authModal, setAuthModal] = useState(null); // 'login' or 'register'
    const [authData, setAuthData] = useState({ username: '', password: '', email: '' });
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('techboy_user') || 'null'));
    const [msg, setMsg] = useState('');

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
                <div className="pill-wrapper logo-pill">
                    <a href="/" className="logo-container">
                        <img src={logo} alt="TECHBOY STORE" className="logo-img" />
                        <span className="logo-text jelly-text">TECHBOY STORE</span>
                    </a>
                </div>

                <div className="navbar-center-group">
                    <div className={`nav-links-pill ${isMenuOpen ? 'active' : ''}`}>
                        <div className="pill-wrapper nav-pills">
                            <a href="#home" className={`nav-pill-item ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</a>
                            <a href="#how-it-works" className={`nav-pill-item ${activeSection === 'how-it-works' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>How it Works</a>
                            <a href="#products" className={`nav-pill-item ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Products</a>
                            <a href="#features" className={`nav-pill-item ${activeSection === 'features' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Features</a>
                        </div>
                    </div>

                    <div className="pill-wrapper action-pill">
                        <div className="search-pill">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="search-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="pill-search-input"
                                placeholder="Search..."
                                onChange={handleSearchChange}
                            />
                        </div>
                        
                        <div className="v-separator"></div>

                        <a href="https://chimataraghuram.github.io/TECHBOY-AI/" target="_blank" rel="noopener noreferrer" className="ai-pill-btn">
                            <span className="ai-pill-text">TECHBOY AI</span>
                        </a>
                    </div>
                </div>

                <div className="pill-wrapper user-pill desktop-only">
                    {user ? (
                        <div className="user-info-capsule">
                            <span className="user-name-text">{user.username}</span>
                            <button className="auth-icon-btn logout-btn" onClick={logout} title="Logout">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button className="pill-auth-btn" onClick={() => setAuthModal('login')}>Sign In</button>
                    )}
                    
                    <div className="v-separator"></div>

                    <button className="auth-icon-btn cart-btn" aria-label="Cart">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="cart-badge-dot"></span>
                    </button>
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
        </nav>
    );
};

export default Navbar;
