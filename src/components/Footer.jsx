import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 className="text-gradient">TECHBOY STORE</h3>
                        <p>Your premium guide to the best mobile deals. We analyze specs and find the absolute best prices so you don't have to.</p>
                        <div className="social-links">
                            <a href="https://github.com/chimataraghuram" target="_blank" rel="noopener noreferrer" className="social-icon">GitHub</a>
                            <a href="https://www.linkedin.com/in/chimataraghuram/" target="_blank" rel="noopener noreferrer" className="social-icon">LinkedIn</a>
                            <a href="https://chimataraghuram.github.io/PORTFOLIO/" target="_blank" rel="noopener noreferrer" className="social-icon">Portfolio</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Guide</h4>
                        <a href="#">Best Under 20k</a>
                        <a href="#">Flagship Killers</a>
                        <a href="#">Gaming Beasts</a>
                        <a href="#">Camera Pro</a>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <a href="#">Comparison Tool</a>
                        <a href="#">Price Tracker</a>
                        <a href="#">Expert Reviews</a>
                        <a href="#">Contact Us</a>
                    </div>

                    <div className="footer-col newsletter">
                        <h4>Deal Alerts</h4>
                        <p>Get notified when prices drop below your target.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">SUBSCRIBE</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-info-group">
                        <p>&copy; 2026 TECHBOY STORE. All rights reserved.</p>
                        <p className="developer-tag">
                            Developed by <a href="https://chimataraghuram.github.io/PORTFOLIO/" target="_blank" rel="noopener noreferrer" className="dev-name">chimataraghuram</a>
                        </p>
                    </div>
                    <div className="legal-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
