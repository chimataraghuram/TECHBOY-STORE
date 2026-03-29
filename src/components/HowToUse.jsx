import React from 'react';

const HowToUse = () => {
    const steps = [
        {
            number: "01",
            title: "Choose Your Budget",
            description: "Browse through our curated price categories—from budget-friendly to ultra-premium flagships.",
            icon: "💰"
        },
        {
            number: "02",
            title: "Compare Top Picks",
            description: "Select multiple phones to use our Winning-Specs tool. It highlights the best performance for your money.",
            icon: "⚖️"
        },
        {
            number: "03",
            title: "Check Expert Verdict",
            description: "Read our AI-driven 'DNA Analytics' and expert reasons to see why a phone is truly worth it.",
            icon: "🧠"
        },
        {
            number: "04",
            title: "Grab the Best Deal",
            description: "We find the lowest live price across all major stores. Click 'Get Deal' to save instantly.",
            icon: "🔥"
        }
    ];

    return (
        <section id="how-it-works" className="how-to-section">
            <div className="container">
                <div className="section-header text-center">
                    <span className="badge analyst-badge">TECHBOY PROCESS</span>
                    <h2 className="premium-title">How to Find Your <span className="text-gradient">Perfect Phone</span></h2>
                    <p className="premium-subtitle" style={{ margin: '0 auto' }}>Four simple steps to absolute tech clarity.</p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card glass-card">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-desc">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToUse;
