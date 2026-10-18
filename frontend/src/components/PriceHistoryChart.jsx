import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const buildFallbackHistory = (currentPrice) => {
    const numericPrice = Number(currentPrice) || 0;
    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (11 - index) * 2);
        const wave = Math.sin(index * 1.7) * numericPrice * 0.035;
        const drift = (11 - index) * numericPrice * 0.012;
        return { date: date.toLocaleDateString(), price: Math.max(0, Math.round((numericPrice + wave + drift) / 100) * 100) };
    });
};

const PriceHistoryChart = ({ productId, currentPrice, hideHeader = false, height = 150 }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/price-history/?product_id=${productId}`);
                const history = await res.json();
                
                if (history && history.length > 0) {
                    setData(history.map(h => ({
                        date: new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                        price: h.price
                    })));
                } else {
                    // Generate Mock Data if none exists
                    setData(buildFallbackHistory(currentPrice));
                }
            } catch (err) {
                console.error("Failed to fetch price history", err);
                setData(buildFallbackHistory(currentPrice));
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [productId, currentPrice]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-xs text-gray-500 animate-pulse">
                Loading price trends...
            </div>
        );
    }

    const minPrice = data.length > 0 ? Math.min(...data.map(d => d.price)) : Number(currentPrice);

    return (
        <div className="w-full flex flex-col justify-between h-full">
            {!hideHeader && <h4 className="chart-title mb-2">30-Day Price Trend</h4>}
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff1f3d" stopOpacity={0.35}/>
                                <stop offset="95%" stopColor="#ff1f3d" stopOpacity={0.0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                             dataKey="date" 
                             stroke="rgba(255,255,255,0.4)" 
                             fontSize={9} 
                             tickLine={false} 
                             axisLine={false}
                        />
                        <YAxis 
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={9}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                            domain={['dataMin - 1000', 'dataMax + 1000']} 
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(15, 15, 22, 0.95)', 
                                border: '1px solid rgba(255, 31, 61, 0.4)',
                                borderRadius: '10px',
                                fontSize: '11px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                                padding: '6px 10px'
                            }}
                            itemStyle={{ color: '#ff4258', fontWeight: 'bold' }}
                            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#ff1f3d" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            dot={{ fill: '#ff1f3d', r: 2 }}
                            activeDot={{ r: 5, fill: '#ff4258', stroke: '#fff', strokeWidth: 1.5 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {!hideHeader && (
                <p className="text-[10px] text-gray-400 mt-1">
                    Lowest in 30 days: <span className="text-emerald-400 font-bold">₹{minPrice.toLocaleString('en-IN')}</span>
                </p>
            )}
        </div>
    );
};

export default PriceHistoryChart;
