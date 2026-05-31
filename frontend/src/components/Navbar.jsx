import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Bot, X, Menu } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';
import { useAuth } from '../context/AuthContext';
import AuthDropdown from './AuthDropdown';
import NotificationSystem from './NotificationSystem';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const NAV_SECTIONS = ['home', 'products', 'trends', 'how-it-works', 'footer'];

const getNavbarScrollOffset = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return 120;
    return navbar.getBoundingClientRect().bottom + 12;
};

const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getNavbarScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

const Navbar = ({ onChatToggle, onSearch, searchTerm }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    const { user, loginWithGoogle } = useAuth();
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
            if (window.innerWidth >= 1200) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let ticking = false;

        const updateActiveSection = () => {
            const offset = getNavbarScrollOffset();
            let current = NAV_SECTIONS[0];

            for (const id of NAV_SECTIONS) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.getBoundingClientRect().top <= offset) {
                    current = id;
                }
            }

            setActiveSection(current);
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateActiveSection);
            }
        };

        updateActiveSection();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateActiveSection, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateActiveSection);
        };
    }, []);

    const handleNavClick = useCallback((e, sectionId) => {
        e.preventDefault();
        scrollToSection(sectionId);
    }, []);

    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <nav className="navbar" aria-label="Main navigation">

            <div className="navbar-content">
                {/* LOGO AREA - LEFT */}
                <div className="navbar-left-container" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div className="navbar-left pill-wrapper">
                        <button 
                            className="mobile-menu-toggle" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <a href="/" className="logo-container" onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('home');
                        }}>
                            <img src={logo} alt="TECHBOY STORE" className="logo-img" />
                            <span className="logo-text jelly-text">TECHBOY STORE</span>
                        </a>
                    </div>
                </div>

                {/* NAVIGATION - CENTER */}
                {!isMobile ? (
                    <div className="navbar-center-container" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="navbar-center pill-wrapper">
                            <div className="nav-links">
                                {NAV_SECTIONS.map(sec => {
                                    const isActive = activeSection === sec;
                                    let label = 'Home';
                                    if (sec === 'products') label = 'Products';
                                    else if (sec === 'trends') label = 'Trends 🔥';
                                    else if (sec === 'how-it-works') label = 'How It Works';
                                    else if (sec === 'footer') label = 'Contact';

                                    return (
                                        <a 
                                            key={sec}
                                            href={`#${sec}`} 
                                            className={`nav-link ${isActive ? 'active' : ''}`}
                                            onClick={(e) => handleNavClick(e, sec)}
                                        >
                                            {label}
                                        </a>
                                    );
                                })}
                            </div>
                            <div className="nav-divider" aria-hidden="true"></div>
                            <div className="search-bar" role="search">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search gear..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    aria-label="Search products"
                                />
                                {searchTerm && (
                                    <button className="clear-search-btn" onClick={(e) => {
                                        e.stopPropagation();
                                        onSearch('');
                                    }} title="Clear Search">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence>
                        {isMenuOpen && (
                            <m.div 
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="navbar-center active mobile-drawer"
                            >
                                <div className="nav-links mobile">
                                    {NAV_SECTIONS.map(sec => {
                                        const isActive = activeSection === sec;
                                        let label = 'Home';
                                        if (sec === 'products') label = 'Products';
                                        else if (sec === 'trends') label = 'Trends 🔥';
                                        else if (sec === 'how-it-works') label = 'How It Works';
                                        else if (sec === 'footer') label = 'Contact';

                                        return (
                                            <a 
                                                key={sec}
                                                href={`#${sec}`} 
                                                className={`nav-link ${isActive ? 'active' : ''}`} 
                                                onClick={(e) => {
                                                    setIsMenuOpen(false);
                                                    handleNavClick(e, sec);
                                                }}
                                            >
                                                {label}
                                            </a>
                                        );
                                    })}
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
                            </m.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ACTIONS - RIGHT */}
                <div className="navbar-right-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="navbar-right pill-wrapper">
                        <button onClick={onChatToggle} className="ai-pill-btn-standalone">
                            <Bot size={18} className="ai-pill-icon" />
                            <span className="ai-pill-text">TECHBOY AI</span>
                        </button>

                        <NotificationSystem />

                                    {!user ? (
                                        <div className="alerts-login-prompt">
                                            <p style={{marginBottom: '10px'}}>Log in to track and view price alerts on your favorite gear.</p>
                                            <button className="pill-auth-btn" onClick={loginWithGoogle}>SIGN UP</button>
                                        </div>
                                    ) : loadingAlerts && alerts.length === 0 ? (
                                        <div className="alerts-empty-state">
                                            <span>⏳</span>
                                            <p>Loading alerts...</p>
                                        </div>
                                    ) : alerts.length === 0 ? (
                                        <div className="alerts-empty-state">
                                            <span>🔔</span>
                                            <p>No active price alerts.</p>
                                            <p style={{fontSize: '11px', color: '#475569', marginTop: '4px'}}>Set price alerts inside any product's details view!</p>
                                        </div>
                                    ) : (
                                        <div className="alerts-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {triggeredAlerts.length > 0 && (
                                                <>
                                                    <div className="alerts-section-title">🚨 Triggered Deals</div>
                                                    <div className="alerts-list">
                                                        {triggeredAlerts.map(alert => {
                                                            const details = alert.product_details || {};
                                                            return (
                                                                <div key={alert.id} className="alert-item-card triggered">
                                                                    <div className="alert-item-img">
                                                                        <img src={details.image} alt={alert.product_name} />
                                                                    </div>
                                                                    <div className="alert-item-info">
                                                                        <h5>{alert.product_name}</h5>
                                                                        <div className="alert-price-comparison">
                                                                            <span>Target: <span className="target-price-lbl">₹{alert.target_price.toLocaleString('en-IN')}</span></span>
                                                                            <span>Now: <span className="current-price-lbl">₹{(details.price || 0).toLocaleString('en-IN')}</span></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="alert-item-actions">
                                                                        <a 
                                                                            href={details.amazon_link || details.flipkart_link || '#'} 
                                                                            target="_blank" 
                                                                            rel="noreferrer" 
                                                                            className="alert-deal-btn"
                                                                        >
                                                                            Get Deal
                                                                        </a>
                                                                        <button 
                                                                            className="alert-delete-btn" 
                                                                            onClick={(e) => handleDeleteAlert(alert.id, e)}
                                                                            title="Dismiss"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}

                                            {activeAlerts.length > 0 && (
                                                <>
                                                    <div className="alerts-section-title">📋 Active Alerts</div>
                                                    <div className="alerts-list">
                                                        {activeAlerts.map(alert => {
                                                            const details = alert.product_details || {};
                                                            return (
                                                                <div key={alert.id} className="alert-item-card">
                                                                    <div className="alert-item-img">
                                                                        <img src={details.image} alt={alert.product_name} />
                                                                    </div>
                                                                    <div className="alert-item-info">
                                                                        <h5>{alert.product_name}</h5>
                                                                        <div className="alert-price-comparison">
                                                                            <span>Target: <span className="target-price-lbl">₹{alert.target_price.toLocaleString('en-IN')}</span></span>
                                                                            <span>Current: <span style={{color: '#94a3b8'}}>₹{(details.price || 0).toLocaleString('en-IN')}</span></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="alert-item-actions">
                                                                        <button 
                                                                            className="alert-delete-btn" 
                                                                            onClick={(e) => handleDeleteAlert(alert.id, e)}
                                                                            title="Delete Alert"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {user ? (
                        <AuthDropdown onWatchlistClick={() => setIsWatchlistOpen(true)} />
                    ) : (
                        <button className="pill-auth-btn" onClick={loginWithGoogle}>SIGN UP</button>
                    )}
                    </div>
                </div>
            </div>

            
            <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
        </nav>
    );
};

export default Navbar;
