import React from 'react';
import heroImg from '../assets/hero-cyber.png';

const Hero = () => {
    return (
        <section id="home" className="hero-section">
            <div className="liquid-glow"></div>
            <div className="background-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-text">
                    <div className="badge-wrapper">
                        <span className="badge analyst-badge">TECHBOY ANALYST PICK</span>
                    </div>
                    <h1 className="premium-title">
                        How to Find Your <br />
                        <span className="text-gradient">Perfect Phone</span>
                    </h1>
                    <p className="premium-subtitle">
                        Expert analysis meeting unbeatable deals. We curate the best smartphones so you always stay ahead of the curve.
                    </p>
                    <div className="hero-buttons">
                        <button className="primary-btn large jelly-btn">Start Exploring</button>
                        <button className="secondary-btn large jelly-btn">Top Collections</button>
                    </div>

                    <div className="trust-badges">
                        <div className="trust-item">
                            <span>★ ★ ★ ★ ★</span>
                            <p>Premium Expert Support</p>
                        </div>
                    </div>
                </div>

                <div className="hero-visual-wrapper soft-float">
                    <div className="hero-main-visual glass-card">
                        <img src={heroImg} alt="Cyber Workstation" className="hero-img" />
                    </div>
                    <div className="floating-elements">
                        <div className="float-icon icon-1">⚡</div>
                        <div className="float-icon icon-2">💎</div>
                        <div className="float-icon icon-3">📱</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
