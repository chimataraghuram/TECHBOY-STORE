import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m } from 'framer-motion';
import logo from '../../images/logos/new-logo.jpg';
import localPhonesData from '../data/phones.json';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const money = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

const normalize = (value) => String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9₹]+/g, ' ')
    .trim();

const getProductText = (product) => normalize([
    product.name,
    product.brand,
    product.category,
    product.tag,
    product.description,
    typeof product.specs === 'object' ? Object.values(product.specs).join(' ') : product.specs
].join(' '));

const extractBrand = (query, products) => {
    const brands = [...new Set((products || []).map((product) => product.brand).filter(Boolean))]
        .sort((a, b) => b.length - a.length);
    const normalizedQuery = normalize(query);
    return brands.find((brand) => normalizedQuery.includes(normalize(brand))) || null;
};

const rankProducts = (query, products) => {
    const normalizedQuery = normalize(query);
    const brand = extractBrand(query, products);
    const budgetMatch = normalizedQuery.match(/(?:under|below|within|budget|rs|₹)\s*(\d+(?:\.\d+)?)\s*k?/) || normalizedQuery.match(/(\d+(?:\.\d+)?)\s*k/);
    const budget = budgetMatch ? Number(budgetMatch[1]) * (normalizedQuery.includes(`${budgetMatch[1]} k`) || /k/.test(budgetMatch[0]) || Number(budgetMatch[1]) < 1000 ? 1000 : 1) : null;
    const wantsGaming = /gaming|game|performance|powerful/.test(normalizedQuery);
    const wantsCamera = /camera|photo|photography|portrait/.test(normalizedQuery);
    const wantsBattery = /battery|long lasting|backup/.test(normalizedQuery);
    const wantsCheap = /cheap|budget|affordable|value/.test(normalizedQuery);
    const wantsFlagship = /flagship|premium|best phone|top phone/.test(normalizedQuery);

    return [...(products || [])]
        .filter((product) => !brand || normalize(product.brand) === normalize(brand))
        .map((product) => {
            const text = getProductText(product);
            const price = Number(product.price) || 0;
            let score = 0;
            if (brand) score += 100;
            if (budget !== null) score += price <= budget ? 60 - ((budget - price) / Math.max(budget, 1)) * 20 : -80;
            if (wantsGaming && /snapdragon|dimensity|gaming|mediatek|elite/.test(text)) score += 35;
            if (wantsCamera && /camera|mp|ois|telephoto|periscope/.test(text)) score += 35;
            if (wantsBattery && /battery|mah|fast charge|flashcharge/.test(text)) score += 35;
            if (wantsFlagship && price >= 40000) score += 30;
            if (wantsCheap) score += Math.max(0, 25 - price / 10000);
            for (const token of normalizedQuery.split(' ')) {
                if (token.length > 2 && text.includes(token)) score += 4;
            }
            return { product, score };
        })
        .sort((a, b) => b.score - a.score || (Number(b.product.price) || 0) - (Number(a.product.price) || 0))
        .map(({ product }) => product);
};

/* ── Dynamic system prompt built inside component ── */

const localAdvisor = (text, phonesData) => {
    const query = text.toLowerCase();
    const allPhones = [...(phonesData || localPhonesData)];
    let matches = rankProducts(query, allPhones);
    const brand = extractBrand(query, allPhones);

    const budgetMatch = query.match(/(?:under|below|budget|rs|₹)?\s*(\d+)\s*k/i) || query.match(/(?:under|below|budget|rs|₹)\s*(\d+)/i);
    if (budgetMatch) {
        let budget = Number(budgetMatch[1]);
        if (budget < 1000) budget *= 1000;
        matches = matches.filter(p => Number(p.price) <= budget);
        // Sort descending so the most expensive phone UNDER the budget is first (maximizing budget)
        matches.sort((a, b) => b.price - a.price);
    }

    if (query.includes('flagship') || query.includes('premium')) {
        matches = matches.filter(p => Number(p.price) >= 40000);
        matches.sort((a, b) => b.price - a.price);
    } else if (query.includes('gaming') || query.includes('game')) {
        matches = matches.filter(p => `${p.tag} ${p.description}`.toLowerCase().includes('gaming') || `${p.description}`.toLowerCase().includes('snapdragon'));
    } else if (query.includes('camera') || query.includes('photo')) {
        matches = matches.filter(p => `${p.tag} ${p.description}`.toLowerCase().includes('camera') || `${p.description}`.toLowerCase().includes('mp'));
    } else if (query.includes('battery')) {
        matches = matches.filter(p => `${p.description}`.toLowerCase().includes('battery') || `${p.description}`.toLowerCase().includes('mah'));
    } else if (query.includes('cheap') || query.includes('budget')) {
        matches.sort((a, b) => a.price - b.price);
    }

    if (matches.length === 0) {
        return brand
            ? `I couldn't find a ${brand} phone matching those requirements in the current catalog. Try a different budget or use case.`
            : 'I could not find a matching phone in the current catalog. Try adding a brand, budget, or use case.';
    }

    const picks = matches.slice(0, query.includes('compare') || query.includes('versus') ? 4 : 3);
    const title = brand ? `Here are the best ${brand} matches I found:` : 'Here are my best TechBoy matches:';
    return [
        title,
        ...picks.map(p => `- **${p.name}** - ${money(p.price)}: ${p.tag || 'Strong value'}; ${p.description}`),
        'These recommendations are from the current TechBoy catalog. Open a phone to verify live availability and use Compare for a side-by-side view.'
    ].join('\n');
};

/* ── Simple markdown → JSX renderer ── */
const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) { elements.push(<br key={key++} />); continue; }

        // Bullet point
        if (/^[-*]\s/.test(line)) {
            const content = line.replace(/^[-*]\s/, '');
            elements.push(
                <div key={key++} className="md-bullet">
                    <span className="md-dot">▸</span>
                    <span>{inlineFormat(content)}</span>
                </div>
            );
            continue;
        }

        // Heading ##
        if (/^##\s/.test(line)) {
            elements.push(<p key={key++} className="md-heading">{line.replace(/^##\s/, '')}</p>);
            continue;
        }

        elements.push(<p key={key++} className="md-para">{inlineFormat(line)}</p>);
    }
    return elements;
};

const inlineFormat = (text) => {
    // Split on **bold** markers
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (/^\*\*.*\*\*$/.test(part)) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const callBackend = async (text, phonesData) => {
    try {
        const res = await fetch(`${BACKEND_URL}/chat/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text })
        });
        if (!res.ok) throw new Error('Backend failed');
        const data = await res.json();
        // Keep brand-scoped questions deterministic even when the backend model
        // tries to broaden the recommendation beyond the requested brand.
        const requestedBrand = extractBrand(text, phonesData || localPhonesData);
        return {
            text: requestedBrand ? localAdvisor(text, phonesData) : (data.response || localAdvisor(text, phonesData)),
            products: data.products || [],
            sources: data.sources || []
        };
    } catch (err) {
        console.error(err);
        return { text: localAdvisor(text, phonesData) };
    }
};

const ChatPopup = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm **TechBoy AI** 🤖 — your expert smartphone advisor.\nTell me your **budget** or **use case** and I'll find you the perfect phone!",
            sender: 'ai',
            done: true
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);
    const abortRef = useRef(null);
    const popupRef = useRef(null);
    // Monotonic id generator for chat messages. Using Date.now() made fast
    // consecutive sends collide on the same millisecond, producing duplicate
    // React list keys (and mis-targeted message updates).
    const msgIdRef = useRef(2);
    const [livePhonesData, setLivePhonesData] = useState(localPhonesData);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                if (e.target.closest('button[aria-label="TechBoy AI"]')) return;
                onClose();
            }
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    useEffect(() => {
        let mounted = true;
        const fetchPhones = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/products/?limit=1000`);
                if (res.ok) {
                    const data = await res.json();
                    const list = data.results || data;
                    if (mounted && list && list.length > 0) {
                        setLivePhonesData(list);
                    }
                }
            } catch (err) {
                console.warn('ChatPopup using local JSON fallback database', err);
            }
        };
        fetchPhones();
        return () => { mounted = false; };
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    /* ── Send message ── */
    const handleSend = async (e) => {
        e?.preventDefault();
        const text = inputValue.trim();
        if (!text || isStreaming) return;

        const userId = msgIdRef.current++;
        const aiId = msgIdRef.current++;
        const userMsg = { id: userId, text, sender: 'user', done: true };
        const aiMsg = { id: aiId, text: '', sender: 'ai', done: false };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setInputValue('');
        setIsStreaming(true);

        try {
            const result = await callBackend(text, livePhonesData);
            setMessages(prev => prev.map(m =>
                m.id === aiId ? { ...m, text: result.text || 'No response.' } : m
            ));
        } catch (err) {
            if (err.name === 'AbortError') {
                setMessages(prev => prev.map(m => m.id === aiId ? { ...m, done: true } : m));
                setIsStreaming(false);
                return;
            }

            console.error('NVIDIA NIM failed:', err.message);

            setMessages(prev => prev.map(m =>
                m.id === aiId ? { ...m, text: localAdvisor(text, livePhonesData) } : m
            ));
        } finally {
            setMessages(prev => prev.map(m => m.id === aiId ? { ...m, done: true } : m));
            setIsStreaming(false);
        }
    };

    const handleStop = () => {
        abortRef.current?.abort();
        setIsStreaming(false);
        setMessages(prev => prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, done: true } : m
        ));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const suggestions = ['📱 Best under ₹15K', '🎮 Best gaming phone', '📷 Best camera phone', '🔋 Longest battery life'];

    const isFirstMessage = messages.length <= 1;

    if (!isOpen) return null;

    return (
        <m.div
            ref={popupRef}
            className="chat-popup glass-card"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 360, damping: 25 }}
        >
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-info">
                    <div className="chat-bot-logo">
                        <img src={logo} alt="TECHBOY AI" />
                        <span className="ai-live-dot" />
                    </div>
                    <div className="chat-brand-info">
                        <h3>TECHBOY AI</h3>
                        <p>
                            <span className="status-dot" />
                            {isStreaming ? 'Thinking...' : 'ONLINE & READY'}
                            <span className="ai-model-tag">CATALOG RAG</span>
                        </p>
                    </div>
                </div>
                <button className="chat-close-btn" onClick={onClose} aria-label="Close">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.sender === 'ai' && (
                            <div className="ai-avatar">🤖</div>
                        )}
                        <div className="message-bubble">
                            <div className="msg-content">
                                {renderMarkdown(msg.text)}
                                {!msg.done && <span className="stream-cursor" />}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips — only on first load */}
            {isFirstMessage && (
                <div className="chat-suggestions">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            className="suggestion-chip"
                            onClick={() => {
                                setInputValue(s.replace(/^\S+\s/, ''));
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Footer */}
            <form className="chat-footer" onSubmit={handleSend}>
                <textarea
                    className="chat-input"
                    rows={1}
                    placeholder="Ask about gaming, camera, budget phones..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isStreaming}
                />
                {isStreaming ? (
                    <button type="button" className="send-btn stop-btn" onClick={handleStop} title="Stop">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                    </button>
                ) : (
                    <button type="submit" className="send-btn" disabled={!inputValue.trim()} aria-label="Send">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                )}
            </form>
        </m.div>
    );
};

export default ChatPopup;
