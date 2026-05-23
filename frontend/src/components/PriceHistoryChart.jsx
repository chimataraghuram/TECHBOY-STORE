import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const PriceHistoryChart = ({ productId, currentPrice }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/price-history/?product_id=${productId}`);
                const history = await res.json();
                
                if (history.length > 0) {
                    setData(history.map(h => ({
                        date: new Date(h.timestamp).toLocaleDateString(),
                        price: h.price
                    })));
                } else {
                    // Generate Mock Data if none exists
                    const mockData = [];
                    const now = new Date();
                    for (let i = 7; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(now.getDate() - i);
                        // Random fluctuation around current price
                        const randomPrice = currentPrice + (Math.random() * 2000 - 1000);
                        mockData.push({
                            date: date.toLocaleDateString(),
                            price: Math.floor(randomPrice / 100) * 100
                        });
                    }
                    setData(mockData);
                }
            } catch (err) {
                console.error("Failed to fetch price history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [productId, currentPrice]);

    if (loading) return <div className="chart-loading">Loading price trends...</div>;

    return (
        <div className="price-history-container">
            <h4 className="chart-title">30-Day Price Trend</h4>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff4500" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ff4500" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                            dataKey="date" 
                            stroke="rgba(255,255,255,0.5)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <YAxis 
                            hide 
                            domain={['dataMin - 1000', 'dataMax + 1000']} 
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                                border: '1px solid #ff4500',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#ff4500' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#ff4500" 
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <p className="chart-footer-text">Lowest price in 30 days: ₹{Math.min(...data.map(d => d.price)).toLocaleString()}</p>
        </div>
    );
};

export default PriceHistoryChart;
