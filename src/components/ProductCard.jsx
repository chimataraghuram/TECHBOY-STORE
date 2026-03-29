import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import balancedImg from '../assets/balanced-phone.png';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ProductCard = ({ product, onCompare, isComparing, onView, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleTrackClick = async (source) => {
        try {
            await fetch(`${API_BASE_URL}/track-click/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id, source })
            });
        } catch (err) {
            console.error('Failed to track click', err);
        }
    };

    return (
        <motion.div
            className={`product-card glass-card ${isComparing ? 'comparing' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
        >
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <div className="product-image-wrapper" style={{ transform: "translateZ(50px)" }}>
                <img src={product.image || balancedImg} alt={product.name} className="product-real-img" loading="lazy" />
            </div>
            <div className="product-info" style={{ transform: "translateZ(30px)" }}>
                <span className="category-label">{product.category}</span>
                <h3 className="product-title">{product.name}</h3>

                <div className="product-actions-row">
                    <button className="jelly-btn mini view-phone-btn" onClick={() => onView(product)}>View Phone</button>
                    <button
                        className={`jelly-btn mini compare-btn ${isComparing ? 'active' : ''}`}
                        onClick={() => onCompare(product)}
                    >
                        {isComparing ? 'Selected' : 'Compare'}
                    </button>
                </div>

                <div className="product-meta">
                    <div className="price-info">
                        <span className="price-label">Best Price @ Amazon</span>
                        <span className="price">₹{product.price?.toLocaleString()}</span>
                    </div>
                    <a 
                        href={product.amazon_link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="get-deal-btn" 
                        title="Get Best Deal"
                        onClick={() => handleTrackClick('amazon')}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
