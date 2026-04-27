import React, { useState, useEffect, useRef } from 'react';
import logo from '../../images/logos/new-logo.jpg';
import localPhonesData from '../data/phones.json';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BACKEND_URL = 'http://127.0.0.1:8000/api';

// Build a compact phone catalog summary for the AI system prompt
const buildCatalog = () => {
    return localPhonesData.map(p =>
        `[${p.category}] ${p.name} (${p.tag}) — ₹${p.price?.toLocaleString()} — ${p.description}`
    ).join('\n');
};

const SYSTEM_PROMPT = `You are TechBoy AI, an expert smartphone buying advisor for the TechBoy Store — an Indian tech recommendation platform.
Your job is to help users find the best smartphone for their needs and budget.
Be concise, friendly, and always recommend from the catalog below when relevant.
Always mention price in Indian Rupees (₹). Highlight key specs that matter for the user's use case.
If recommending a phone, mention its tag (e.g. Best Gaming, Best Camera) and why it fits.

CURRENT PHONE CATALOG:
${buildCatalog()}

Rules:
- Keep replies under 150 words unless a detailed comparison is asked.
- Always suggest 1-3 specific phones from the catalog when possible.
- If the user asks about a phone not in the catalog, say it's not available in the store but give general advice.
- If asked about budget, ask for their use case (gaming, camera, battery, etc.) before recommending.`;

const ChatPopup = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm TechBoy AI 🤖 — your expert smartphone advisor. Tell me your budget or use case and I'll find you the perfect phone!", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Build message history for OpenRouter (last 10 messages for context)
    const buildHistory = (msgs) => {
        return msgs.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        }));
    };

    const callOpenRouter = async (history) => {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://techboy-store.vercel.app',
                'X-Title': 'TechBoy Store AI'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });
        if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
        const data = await res.json();
        return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    };

    const callBackend = async (text) => {
        const res = await fetch(`${BACKEND_URL}/chat/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text })
        });
        if (!res.ok) throw new Error('Backend error');
        const data = await res.json();
        return { text: data.response, products: data.products || [] };
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text) return;

        const userMessage = { id: Date.now(), text, sender: 'user' };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            let aiText = '';
            let products = [];

            if (OPENROUTER_API_KEY) {
                // Primary: OpenRouter AI with full phone catalog context
                aiText = await callOpenRouter(buildHistory(updatedMessages));
            } else {
                // Fallback: backend API
                const result = await callBackend(text);
                aiText = result.text;
                products = result.products;
            }

            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: aiText,
                sender: 'ai',
                products
            }]);
        } catch (err) {
            console.error('Chat failed:', err);
            // Final fallback: try backend if OpenRouter failed
            try {
                const result = await callBackend(text);
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: result.text,
                    sender: 'ai',
                    products: result.products
                }]);
            } catch {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
                    sender: 'ai'
                }]);
            }
        }
    };

    // Quick suggestion chips
    const suggestions = [
        '📱 Best under ₹15K',
        '🎮 Gaming phone',
        '📷 Best camera',
        '🔋 Best battery',
    ];

    if (!isOpen) return null;

    return (
        <div className="chat-popup glass-card">
            <div className="chat-header">
                <div className="chat-header-info">
                    <div className="chat-bot-logo">
                        <img src={logo} alt="TECHBOY AI" />
                    </div>
                    <div className="chat-brand-info">
                        <h3>TECHBOY AI</h3>
                        <p>
                            <span className="status-dot"></span> ONLINE &amp; READY
                            <span style={{ fontSize: '0.75em', marginLeft: '6px', opacity: 0.8, color: '#a78bfa' }}>
                                | Powered by Llama 3.1
                            </span>
                        </p>
                    </div>
                </div>
                <button className="chat-close-btn" onClick={onClose} aria-label="Close Chat">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        <div className="message-bubble">
                            {msg.text}
                            {msg.products && msg.products.length > 0 && (
                                <div className="chat-recommendations">
                                    {msg.products.map(p => (
                                        <div key={p.id} className="mini-product-link">
                                            <img src={p.image} alt={p.name} />
                                            <span>{p.name} — ₹{p.price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message ai">
                        <div className="message-bubble typing">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestion chips — show only at the start */}
            {messages.length <= 1 && (
                <div className="chat-suggestions">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            className="suggestion-chip"
                            onClick={() => {
                                setInputValue(s.replace(/^[^\w₹]*/, '').trim());
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            <form className="chat-footer" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Ask about gaming phones, budget picks..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus={isOpen}
                />
                <button type="submit" className="send-btn" aria-label="Send Message" disabled={isTyping}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatPopup;
