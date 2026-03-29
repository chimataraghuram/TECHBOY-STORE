import React from 'react';

const Features = () => {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Why Choose <span className="text-gradient">TECHBOY</span></h2>
                    <p className="section-subtitle">Specially curated smartphones with unbeatable reliability.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Verified Reviews</h3>
                        <p>We only list devices after thorough testing and community feedback.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Live 5G Tests</h3>
                        <p>Real-world 5G speed results for every phone in our directory.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🔋</div>
                        <h3>Endurance Ratings</h3>
                        <p>Detailed battery drain tests for gamers and heavy users.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
