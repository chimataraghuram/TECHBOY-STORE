import { useState, useEffect } from 'react';
import {} from 'framer-motion';
import { Search, Bot, X, Menu, Bell, Trash2 } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import WatchlistModal from './WatchlistModal';
import { useAuth } from '../context/AuthContext';
import AuthDropdown from './AuthDropdown';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const Navbar = ({ onChatToggle, onSearch, searchTerm }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const { user, loginWithGoogle } = useAuth();
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // Alerts state
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(false);

    const fetchAlerts = async () => {
        const token = localStorage.getItem('techboy_token');
        if (!token) return;
        setLoadingAlerts(true);
        try {
            const res = await fetch(`${API_BASE_URL}/alerts/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setAlerts(data.results || data);
            }
        } catch (err) {
            console.error("Failed to fetch alerts", err);
        } finally {
            setLoadingAlerts(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAlerts();
            const interval = setInterval(fetchAlerts, 30000);
            return () => clearInterval(interval);
        } else {
            setAlerts([]);
        }
    }, [user]);

    useEffect(() => {
        if (!isAlertsOpen) return;
        const closeDropdown = (e) => {
            if (!e.target.closest('.navbar-notification-container')) {
                setIsAlertsOpen(false);
            }
        };
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isAlertsOpen]);

    const handleDeleteAlert = async (alertId, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('techboy_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/alerts/${alertId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setAlerts(prev => prev.filter(a => a.id !== alertId));
            }
        } catch (err) {
            console.error("Failed to delete alert", err);
        }
    };

    const triggeredAlerts = alerts.filter(a => !a.is_active);
    const activeAlerts = alerts.filter(a => a.is_active);

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
                            <m.div 
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
                            </m.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ACTIONS - RIGHT */}
                <div className="navbar-right">
                    <button onClick={onChatToggle} className="ai-pill-btn-standalone">
                        <Bot size={18} className="ai-pill-icon" />
                        <span className="ai-pill-text">TECHBOY AI</span>
                    </button>

                    {/* Notification Bell Container */}
                    <div className="navbar-notification-container">
                        <button 
                            className="bell-btn" 
                            onClick={() => {
                                setIsAlertsOpen(!isAlertsOpen);
                                if (!isAlertsOpen) fetchAlerts();
                            }}
                            title="Price Alerts"
                            aria-label="Price Alerts"
                        >
                            <Bell size={18} />
                            {triggeredAlerts.length > 0 && (
                                <span className="bell-badge">{triggeredAlerts.length}</span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isAlertsOpen && (
                                <m.div 
                                    className="alerts-dropdown"
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                >
                                    <div className="alerts-dropdown-header">
                                        <h4>Price Alerts</h4>
                                        <button className="clear-alerts-btn" onClick={() => setIsAlertsOpen(false)}>Close</button>
                                    </div>

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

            
            <WatchlistModal isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
        </nav>
    );
};

export default Navbar;
