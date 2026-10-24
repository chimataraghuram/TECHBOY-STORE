import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m } from 'framer-motion';
import { Sparkles, Bot, Send, Square, X, Compass } from 'lucide-react';
import logo from '../../images/logos/new-logo.jpg';
import localPhonesData from '../data/phones.json';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const money = (value) => `₹${Number(value || 0).toLocaleString()}`;

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
            ? `I couldn't find a ${brand} phone matching those requirements in our current verified catalog. Try a different budget or use case!`
            : 'I could not find a matching phone in the current catalog. Try adding a brand, budget, or key feature.';
    }

    const picks = matches.slice(0, query.includes('compare') || query.includes('versus') ? 4 : 3);
    const intro = brand
        ? `Here are the top ${brand} recommendations from our live catalog:`
        : `Based on your request, here are the best matches:`;

    const items = picks.map((p, idx) => {
        const specSummary = Object.entries(p.specs || {})
            .slice(0, 3)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' • ');
        return `**${idx + 1}. ${p.name}** — ${money(p.price)}\n${p.tag ? `*${p.tag}* • ` : ''}${p.description}${specSummary ? `\n> ${specSummary}` : ''}`;
    }).join('\n\n');

    return `${intro}\n\n${items}\n\nAsk me if you want full side-by-side specs, camera comparisons, or live price-drop alerts!`;
};

const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((block, bi) => {
        const lines = block.split('\n');
        return (
            <div key={bi} className="mb-2.5 last:mb-0 leading-relaxed text-[13.5px]">
                {lines.map((line, li) => {
                    if (line.startsWith('### ')) {
                        return <h4 key={li} className="text-white font-bold text-sm mt-2 mb-1 text-red-400">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('## ') || line.startsWith('# ')) {
                        return <h3 key={li} className="text-white font-black text-[15px] mt-2 mb-1.5">{line.replace(/^#+\s/, '')}</h3>;
                    }
                    if (line.startsWith('> ')) {
                        return (
                            <blockquote key={li} className="border-l-2 border-red-500/50 pl-2.5 py-0.5 my-1.5 text-xs text-gray-400 bg-white/[0.02] rounded-r">
                                {line.replace('> ', '')}
                            </blockquote>
                        );
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                        return (
                            <div key={li} className="flex items-start gap-2 my-0.5 ml-1">
                                <span className="text-red-500 text-xs mt-0.5">•</span>
                                <span className="text-gray-200">{formatInline(line.replace(/^[-*]\s/, ''))}</span>
                            </div>
                        );
                    }
                    return <p key={li} className="text-gray-200 my-0.5">{formatInline(line)}</p>;
                })}
            </div>
        );
    });
};

const formatInline = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={idx} className="text-red-300 not-italic font-medium">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={idx} className="bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded text-xs font-mono border border-red-500/20">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

const ChatPopup = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 0,
            text: "Hi! I'm **TechBoy AI** — your next-gen smartphone advisor.\n\nTell me your **budget, brand, or use case** (e.g. *best camera under ₹30K*, *gaming phone*, *iPhone vs Galaxy*) and I'll find you the perfect deal!",
            sender: 'ai',
            done: true
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [livePhonesData, setLivePhonesData] = useState(localPhonesData);
    const messagesEndRef = useRef(null);
    const popupRef = useRef(null);
    const abortRef = useRef(null);
    const msgIdRef = useRef(1);

    const callBackend = async (userText, phones) => {
        abortRef.current = new AbortController();
        const timeoutId = setTimeout(() => abortRef.current.abort(), 12000);

        try {
            const res = await fetch(`${BACKEND_URL}/chat/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText }),
                signal: abortRef.current.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                return { text: data.reply || data.response || localAdvisor(userText, phones) };
            }
            throw new Error(`Backend returned status ${res.status}`);
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    };

    useEffect(() => {
        if (!isOpen) return;
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
    }, [isOpen, onClose]);

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
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            handleSend(); 
        }
    };

    const suggestions = [
        { label: 'Under ₹15K', query: 'Best phone under 15000', icon: '📱' },
        { label: 'Gaming Beast', query: 'Best gaming smartphone', icon: '🎮' },
        { label: 'Pro Camera', query: 'Best camera phone with OIS', icon: '📷' },
        { label: 'Battery King', query: 'Phone with best battery backup', icon: '🔋' },
    ];

    const isFirstMessage = messages.length <= 1;

    if (!isOpen) return null;

    return (
        <m.div
            ref={popupRef}
            className="fixed inset-x-3 bottom-3 top-auto sm:inset-x-auto sm:bottom-6 sm:right-6 w-auto sm:w-[350px] md:w-[365px] h-[500px] max-h-[calc(100vh-100px)] z-[9995] flex flex-col rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[#09080e]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_28px_rgba(255,31,61,0.2)] overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
            {/* Top glowing ambient highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/80 to-transparent pointer-events-none" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-red-500/20 blur-2xl pointer-events-none" />

            {/* ── HEADER ── */}
            <div className="relative px-4 py-3.5 flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img 
                            src={logo} 
                            alt="TECHBOY AI" 
                            className="w-10 h-10 rounded-2xl object-cover border border-red-500/60 shadow-[0_0_12px_rgba(255,31,61,0.4)]"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#09080e] shadow-[0_0_8px_#10b981]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-black text-sm tracking-wide">TECHBOY AI</h3>
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-400">
                                RAG v2
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{isStreaming ? 'Analyzing catalog...' : 'Live Advisor Online'}</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onClose} 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>
            </div>

            {/* ── MESSAGES CONTAINER ── */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map(msg => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender === 'ai' && (
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,31,61,0.2)]">
                                <Bot size={14} className="text-red-400" />
                            </div>
                        )}
                        <div 
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-lg ${
                                msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-tr-sm shadow-[0_4px_18px_rgba(255,31,61,0.3)]'
                                    : 'bg-white/[0.04] border border-white/[0.08] text-gray-100 rounded-tl-sm backdrop-blur-md'
                            }`}
                        >
                            {renderMarkdown(msg.text)}
                            {!msg.done && (
                                <span className="inline-block w-1.5 h-3.5 ml-1 bg-red-400 animate-pulse rounded-sm align-middle" />
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* ── SUGGESTION PILLS (When starting) ── */}
            {isFirstMessage && (
                <div className="px-4 pb-2 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                        <Sparkles size={11} className="text-red-400" />
                        Quick Prompts
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    setInputValue(s.query);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-red-500/40 text-[11.5px] font-semibold text-gray-300 hover:text-white transition-all text-left group cursor-pointer"
                            >
                                <span className="text-sm">{s.icon}</span>
                                <span className="truncate">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── FOOTER INPUT ── */}
            <form onSubmit={handleSend} className="p-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                    <input
                        type="text"
                        placeholder="Ask about budget, gaming, camera..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isStreaming}
                        className="w-full bg-white/[0.05] border border-white/[0.12] focus:border-red-500/60 focus:bg-white/[0.08] text-white text-[13px] rounded-2xl px-3.5 py-2.5 pr-2 outline-none transition-all placeholder:text-gray-500 font-medium"
                    />
                </div>

                {isStreaming ? (
                    <button
                        type="button"
                        onClick={handleStop}
                        className="w-10 h-10 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 flex items-center justify-center text-red-400 transition-all shrink-0 cursor-pointer"
                        title="Stop"
                    >
                        <Square size={14} className="fill-current" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(255,31,61,0.4)] shrink-0 cursor-pointer"
                        aria-label="Send"
                    >
                        <Send size={15} className="translate-x-[1px]" />
                    </button>
                )}
            </form>
        </m.div>
    );
};

export default ChatPopup;
