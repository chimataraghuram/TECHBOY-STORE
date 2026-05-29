import React from 'react';
import logo from '../../images/logos/new-logo.jpg';

const Footer = () => {
    return (
        <footer id="footer" className="footer-section clean-footer">
            <div className="container footer-container">
                <div className="clean-footer-grid">
                    
                    {/* Column 1: Brand */}
                    <div className="footer-brand-col">
                        <div className="brand-header">
                            <img src={logo} alt="TECHBOY STORE" className="footer-logo" />
                            <div className="brand-text">
                                <h3>TECHBOY STORE</h3>
                                <span>INNOVATION ENGINE</span>
                            </div>
                        </div>
                        <p className="brand-desc">
                            Your AI-powered gateway to discovering top-tier smartphones and tech gear. 
                            We do the research, you get the best deals.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-links-col">
                        <h4>Platform Links</h4>
                        <div className="footer-nav">
                            <a href="#home">Home</a>
                            <a href="#products">Products</a>
                            <a href="#how-it-works">How It Works</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }}>Back to Top ↑</a>
                        </div>
                    </div>

                    {/* Column 3: Developer & Contact */}
                    <div className="footer-contact-col">
                        <h4>Developer & Contact</h4>
                        <div className="developer-profile">
                            <img src="https://github.com/chimataraghuram.png" alt="Chimata Raghuram" className="dev-avatar" />
                            <div className="dev-info">
                                <h5>Chimata Raghuram</h5>
                                <span>Full Stack AI Developer</span>
                            </div>
                        </div>
                        
                        <div className="contact-buttons">
                            <a href="mailto:contact@example.com" className="contact-btn email-btn">
                                Email Me ✉️
                            </a>
                            <a href="https://chimataraghuram.github.io/PORTFOLIO/" target="_blank" rel="noopener noreferrer" className="contact-btn portfolio-btn">
                                View Portfolio 🌐
                            </a>
                        </div>

                        <div className="social-links-row">
                            <a href="https://github.com/chimataraghuram" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="https://www.linkedin.com/in/chimataraghuram/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            <a href="#">Telegram</a>
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
                </div>
            </div>
        </footer>
    );
};

export default Footer;
