import React from 'react';
import logo from '../../images/logos/new-logo.jpg';

const Footer = () => {
    return (
        <footer id="footer" className="footer-section">
            <div className="container footer-container">
                <div className="section-header text-center" style={{ marginBottom: '50px', marginTop: '20px' }}>
                    <h2 className="section-title text-glow-premium">
                        Contact <span className="text-gradient">TechBoy</span>
                    </h2>
                </div>
                
                <div className="footer-grid">
                    {/* Left Column: About & Branding */}
                    <div className="footer-col about-platform">
                        <div className="footer-brand-header">
                            <img src={logo} alt="TECHBOY STORE" className="footer-logo" style={{ width: 36, height: 36 }} />
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

                    {/* Middle Column: How it Works */}
                    <div className="footer-col how-to-guide">
                        <div className="col-header">
                            <span className="header-icon">🧠</span>
                            <h4>HOW IT WORKS</h4>
                        </div>

                        <div className="guide-steps">
                            <div className="guide-step">
                                <div className="step-num">1</div>
                                <div className="step-content">
                                    <h6>1. INSTANT SEARCH</h6>
                                    <p>Blazing fast, real-time filtering across our entire smartphone database to find your exact match.</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <div className="step-num">2</div>
                                <div className="step-content">
                                    <h6>2. AI ADVISOR</h6>
                                    <p>Skip the spec-sheet fatigue. Our AI translates complex hardware data into clear, personalized buying verdicts.</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <div className="step-num">3</div>
                                <div className="step-content">
                                    <h6>3. GEEK-LEVEL INSIGHTS</h6>
                                    <p>Dive deep into custom performance metrics, thermal scores, and battery endurance ratings.</p>
                                </div>
                            </div>
                            <div className="guide-step">
                                <div className="step-num">4</div>
                                <div className="step-content">
                                    <h6>4. ENTHUSIAST APPROVED</h6>
                                    <p>Zero bloat. We only curate devices that meet strict performance and value standards.</p>
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
                                    <img src="https://github.com/chimataraghuram.png" alt="Chimata Raghuram" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"; }} />
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
                <div className="footer-bottom-strip" style={{ justifyContent: 'center' }}>
                    <div className="cooked-text" style={{ color: '#94a3b8', fontSize: '0.95rem', letterSpacing: '2px', fontWeight: '600', textAlign: 'center' }}>
                        COOKED BY <strong className="red-glow">RAGHU</strong> ❤️
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
