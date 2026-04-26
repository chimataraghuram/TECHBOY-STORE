import React from 'react';
import logo from '../../images/logos/new-logo.jpg';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container footer-container">
                <div className="footer-grid">
                    {/* Left Column: About & Branding */}
                    <div className="footer-col about-platform">
                        <div className="footer-brand-header">
                            <img src={logo} alt="TECHBOY STORE" className="footer-logo" />
                            <div className="brand-titles">
                                <h3>TECHBOY STORE</h3>
                                <span className="brand-tagline">INNOVATION ENGINE</span>
                            </div>
                        </div>
                        
                        <div className="platform-description">
                            <h5 className="section-label">ABOUT THE PLATFORM</h5>
                            <p>
                                Techboy Store is your AI-powered gateway to discovering top-tier smartphones and tech gear. 
                                Whether you're hunting for flagships, budget killers, or specific specs, our engine 
                                aggregates the best resources across the web.
                            </p>
                            <p>
                                Use <strong>Search AI</strong> to query specific technologies, or visit the 
                                <strong>Comparison Hub</strong> to see what the global tech community is buying right now.
                            </p>
                        </div>

                        <div className="market-cards">
                            <div className="market-card">
                                <h6>BUDGET KINGS</h6>
                                <span>Under ₹15,000</span>
                            </div>
                            <div className="market-card">
                                <h6>FLAGSHIP KILLERS</h6>
                                <span>Mid-range beasts</span>
                            </div>
                            <div className="market-card">
                                <h6>ELITE GEAR</h6>
                                <span>Premium Tech</span>
                            </div>
                        </div>

                        <button className="explore-source-btn">
                            EXPLORE COLLECTIONS <span>↗</span>
                        </button>
                    </div>

                    {/* Middle Column: How to Use */}
                    <div className="footer-col how-to-guide">
                        <div className="col-header">
                            <span className="header-icon">📖</span>
                            <h4>HOW TO USE THIS PROJECT</h4>
                        </div>

                        <div className="guide-steps">
                            <div className="guide-step">
                                <div className="step-num">1</div>
                                <div className="step-content">
                                    <h6>1. EXPLORE DEALS</h6>
                                    <p>Enter any keyword (e.g., '120Hz', 'OLED') into the search bar. We instantly pull matching deals from multiple platforms.</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <div className="step-num">2</div>
                                <div className="step-content">
                                    <h6>2. COMPARE SPECS</h6>
                                    <p>Not sure what to buy? Use our comparison modal to browse real-time specs and top-starred performance indices.</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <div className="step-num">3</div>
                                <div className="step-content">
                                    <h6>3. GET THE BEST PRICE</h6>
                                    <p>Click 'Get Deal' to bookmark interesting projects to your personal dashboard. Use TECHBOY AI to summarize price history.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Developer Info */}
                    <div className="footer-col developer-info">
                        <div className="col-header">
                            <span className="header-icon">👤</span>
                            <h4>DEVELOPER</h4>
                        </div>

                        <div className="developer-card glass-card">
                            <div className="dev-header">
                                <span className="dev-badge">LEAD</span>
                                <div className="dev-profile-pic">
                                    <img src={logo} alt="Profile" />
                                </div>
                            </div>
                            <h3>Chimata Raghuram</h3>
                            <span className="dev-title">FULL STACK AI DEVELOPER</span>
                            
                            <div className="dev-actions">
                                <a href="https://github.com/chimataraghuram" target="_blank" rel="noopener noreferrer" className="dev-btn github">
                                    VISIT GITHUB <span>🖥️</span>
                                </a>
                                <a href="https://www.linkedin.com/in/chimataraghuram/" target="_blank" rel="noopener noreferrer" className="dev-btn linkedin">
                                    VISIT LINKEDIN <span>🔗</span>
                                </a>
                            </div>

                            <a href="https://chimataraghuram.github.io/PORTFOLIO/" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                                <div className="p-icon">🌐</div>
                                <div className="p-text">
                                    <h6>PORTFOLIO</h6>
                                    <span>PERSONAL SITE</span>
                                </div>
                                <span className="external-icon">↗</span>
                            </a>
                        </div>

                        <div className="social-pills">
                            <a href="https://www.linkedin.com/in/chimataraghuram/" className="social-pill">LINKEDIN</a>
                            <a href="https://github.com/chimataraghuram" className="social-pill">GITHUB</a>
                            <a href="https://chimataraghuram.github.io/PORTFOLIO/" className="social-pill">PORTFOLIO</a>
                            <a href="#" className="social-pill">TELEGRAM</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Strip */}
                <div className="footer-bottom-strip">
                    <div className="copyright-info">
                        <span>© 2026 TECHBOY STORE</span>
                        <div className="v-divider"></div>
                        <span>ENGINEERED BY <strong className="red-glow">TECHBOY RAGHU</strong> ❤️</span>
                    </div>
                    
                    <div className="tech-stack">
                        <span>REACT</span>
                        <span>VITE</span>
                        <span>DJANGO REST</span>
                        <span>NEON CSS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
