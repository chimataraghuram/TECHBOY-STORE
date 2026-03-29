import React from 'react';
import { motion } from 'framer-motion';

const ComparisonModal = ({ products, onClose }) => {
    const getWinner = (specType) => {
        if (products.length < 2) return null;

        const vals = products.map(p => {
            let val = 0;
            if (specType === 'price') val = typeof p.price === 'string' ? parseInt(p.price.replace(/[^\d]/g, '')) : p.price;
            if (specType === 'ram') val = parseInt(p.specs.ram.replace(/[^\d]/g, ''));
            if (specType === 'refresh') {
                const match = p.specs.display.match(/(\d+)Hz/);
                val = match ? parseInt(match[1]) : 60;
            }
            return { id: p.id, val };
        });

        if (specType === 'price') {
            const min = Math.min(...vals.map(v => v.val));
            return vals.filter(v => v.val === min).map(v => v.id);
        } else {
            const max = Math.max(...vals.map(v => v.val));
            return vals.filter(v => v.val === max).map(v => v.id);
        }
    };

    const winners = {
        price: getWinner('price'),
        ram: getWinner('ram'),
        refresh: getWinner('refresh')
    };

    return (
        <motion.div 
            className="comparison-overlay" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="comparison-content glass-card" 
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <div className="comparison-header">
                    <h2>Smartphone Comparison</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="comparison-grid">
                    <div className="comparison-labels">
                        <div>Model</div>
                        <div>Price</div>
                        <div>Display</div>
                        <div>RAM</div>
                        <div>Verdict</div>
                    </div>
                    {products.map(p => (
                        <div key={p.id} className={`comparison-col ${winners.price.includes(p.id) && winners.ram.includes(p.id) ? 'winner-card' : ''}`}>
                            <div className="col-header">
                                <img src={p.image} alt={p.name} />
                                <h4>{p.name}</h4>
                            </div>
                            <div className={`spec-val ${winners.price.includes(p.id) ? 'winner' : ''}`}>
                                ₹{p.price?.toLocaleString()}
                            </div>
                            <div className={`spec-val ${winners.refresh.includes(p.id) ? 'winner' : ''}`}>
                                {p.specs.display}
                            </div>
                            <div className={`spec-val ${winners.ram.includes(p.id) ? 'winner' : ''}`}>
                                {p.specs.ram}
                            </div>
                            <div className="spec-val smaller">{p.reason || 'Expert Selection'}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ComparisonModal;
