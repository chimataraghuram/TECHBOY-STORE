import React from 'react';

const RadarChart = ({ product }) => {
    const getScore = (type) => {
        const tag = (product.tag || "").toLowerCase();
        const price = typeof product.price === 'string' ? parseInt(product.price.replace(/[^\d]/g, '')) : product.price;
        const desc = (product.description || "").toLowerCase();

        if (type === 'Gaming') {
            if (tag.includes('gamer') || tag.includes('performance')) return 95;
            if (desc.includes('12gb') || desc.includes('16gb')) return 85;
            return 70;
        }
        if (type === 'Camera') {
            if (tag.includes('photo') || tag.includes('portrait')) return 95;
            if (desc.includes('200mp') || desc.includes('leica') || desc.includes('108mp')) return 90;
            return 75;
        }
        if (type === 'Battery') {
            if (desc.includes('6000mah')) return 98;
            if (desc.includes('5000mah')) return 85;
            return 75;
        }
        if (type === 'Value') {
            if (price < 15000) return 95;
            if (price < 30000) return 85;
            return 70;
        }
        if (type === 'Display') {
            if (desc.includes('144hz') || desc.includes('qhd') || desc.includes('120hz')) return 95;
            if (desc.includes('amoled') || desc.includes('oled')) return 88;
            return 75;
        }
        return 80;
    };

    const points = [
        { label: 'Gaming', val: getScore('Gaming') },
        { label: 'Camera', val: getScore('Camera') },
        { label: 'Battery', val: getScore('Battery') },
        { label: 'Value', val: getScore('Value') },
        { label: 'Display', val: getScore('Display') }
    ];

    const size = 200;
    const center = size / 2;
    const radius = 70;

    const getCoordinates = (index, total, val) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (radius * val) / 100;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    const polygonPoints = points.map((p, i) => {
        const { x, y } = getCoordinates(i, points.length, p.val);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="radar-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {[20, 40, 60, 80, 100].map(r => (
                    <circle key={r} cx={center} cy={center} r={(radius * r) / 100} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                ))}
                {points.map((p, i) => {
                    const { x, y } = getCoordinates(i, points.length, 100);
                    return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
                })}
                <polygon points={polygonPoints} fill="rgba(var(--accent-rgb-primary), 0.3)" stroke="var(--accent-primary)" strokeWidth="2" />
                {points.map((p, i) => {
                    const { x, y } = getCoordinates(i, points.length, 115);
                    return (
                        <text key={i} x={x} y={y} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle" alignmentBaseline="middle">
                            {p.label}
                        </text>
                    );
                })}
            </svg>
            <div className="dna-title">PHONE DNA ANALYTICS</div>
        </div>
    );
};

export default RadarChart;
