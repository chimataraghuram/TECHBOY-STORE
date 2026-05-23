import React from 'react';

const RadarChart = ({ product }) => {
    const getScore = (type) => {
        const tag = (product.tag || "").toLowerCase();
        const price = typeof product.price === 'string' ? parseInt(product.price.replace(/[^\d]/g, '')) : product.price;

        if (type === 'Gaming') {
            if (tag.includes('gamer') || tag.includes('performance')) return 95;
            if (product.specs.ram.includes('12GB')) return 85;
            return 70;
        }
        if (type === 'Camera') {
            if (tag.includes('photo') || tag.includes('portrait')) return 95;
            if (product.specs.camera.includes('200MP') || product.specs.camera.includes('Leica')) return 90;
            return 75;
        }
        if (type === 'Battery') {
            if (product.specs.battery.includes('6000mAh')) return 98;
            if (product.specs.battery.includes('5000mAh')) return 85;
            return 75;
        }
        if (type === 'Value') {
            if (price < 15000) return 95;
            if (price < 30000) return 85;
            return 70;
        }
        if (type === 'Display') {
            if (product.specs.display.includes('144Hz') || product.specs.display.includes('QHD')) return 95;
            if (product.specs.display.includes('AMOLED')) return 88;
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
                <polygon points={polygonPoints} fill="rgba(255, 69, 0, 0.3)" stroke="#ff4500" strokeWidth="2" />
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
