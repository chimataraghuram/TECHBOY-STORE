import React, { useState, useEffect, useRef, useCallback } from 'react';
import logo from '../../images/logos/new-logo.jpg';
import localPhonesData from '../data/phones.json';

const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const BACKEND_URL = 'http://127.0.0.1:8000/api';

/* ── Catalog injected into system prompt ── */
const CATALOG = localPhonesData.map(p =>
    `[${p.category}] ${p.name} (${p.tag}) — ₹${p.price?.toLocaleString()} — ${p.description}`
).join('\n');

const SYSTEM_PROMPT = `You are TechBoy AI, an expert smartphone buying advisor for TechBoy Store — India's smartest phone recommendation platform.
Help users find the perfect smartphone. Be concise, friendly, and specific.
Always recommend phones from the catalog. Use ₹ for prices. Bold important specs with **text**.
Use bullet points (- item) for comparisons. Keep replies under 160 words unless a deep comparison is asked.
If recommending, mention name, price, and why it fits. Suggest 1-3 phones max per reply.

CATALOG:
${CATALOG}`;

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

/* Free models to try in order if one fails */
const FREE_MODELS = [
    'meta/llama-3.1-8b-instruct',
    'mistralai/mixtral-8x22b-instruct-v0.1',
    'google/gemma-2-9b-it',
];

const callBackend = async (text) => {
    try {
        const res = await fetch(`${BACKEND_URL}/chatbot/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text })
        });
        if (!res.ok) throw new Error('Backend failed');
        const data = await res.json();
        return { text: data.response };
    } catch (err) {
        console.error(err);
        return { text: "Sorry, I am offline right now. Try again later! 💤" };
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

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    /* ── Stream from NVIDIA NIM (tries models in order) ── */
    const streamNvidia = async (history, onChunk) => {
        // Check key is loaded
        if (!NVIDIA_API_KEY) {
            throw new Error('NO_API_KEY');
        }

        abortRef.current = new AbortController();
        let lastError = null;

        for (const model of FREE_MODELS) {
            try {
                const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${NVIDIA_API_KEY}`
                    },
                    body: JSON.stringify({
                        model,
                        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
                        max_tokens: 320,
                        temperature: 0.7,
                        stream: true
                    }),
                    signal: abortRef.current.signal
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.warn(`Model ${model} failed (${res.status}):`, errText);
                    lastError = new Error(`HTTP_${res.status}`);
                    continue; // try next model
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        if (!line.startsWith('data: ')) continue;
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') return;
                        try {
                            const json = JSON.parse(data);
                            const chunk = json.choices?.[0]?.delta?.content || '';
                            if (chunk) onChunk(chunk);
                        } catch { /* skip malformed */ }
                    }
                }
                return; // success — exit loop
            } catch (err) {
                if (err.name === 'AbortError') throw err;
                console.warn(`Model ${model} threw:`, err.message);
                lastError = err;
            }
        }

        // All models failed
        throw lastError || new Error('ALL_MODELS_FAILED');
    };

    /* ── Send message ── */
    const handleSend = async (e) => {
        e?.preventDefault();
        const text = inputValue.trim();
        if (!text || isStreaming) return;

        const userMsg = { id: Date.now(), text, sender: 'user', done: true };
        const aiId = Date.now() + 1;
        const aiMsg = { id: aiId, text: '', sender: 'ai', done: false };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setInputValue('');
        setIsStreaming(true);

        const history = [...messages, userMsg]
            .slice(-12)
            .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

        try {
            if (NVIDIA_API_KEY) {
                await streamNvidia(history, (chunk) => {
                    setMessages(prev => prev.map(m =>
                        m.id === aiId ? { ...m, text: m.text + chunk } : m
                    ));
                });
            } else {
                console.warn('No VITE_NVIDIA_API_KEY — trying backend');
                const result = await callBackend(text);
                setMessages(prev => prev.map(m =>
                    m.id === aiId ? { ...m, text: result.text || 'No response.' } : m
                ));
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                setMessages(prev => prev.map(m => m.id === aiId ? { ...m, done: true } : m));
                setIsStreaming(false);
                return;
            }

            console.error('NVIDIA NIM failed:', err.message);

            // Friendly error messages per error type
            let errMsg = "Sorry, I couldn't get a response right now. Please try again! 🔄";
            if (err.message === 'NO_API_KEY') {
                errMsg = "⚠️ API key not loaded. Please restart the dev server (`npm run dev`) and try again.";
            } else if (err.message?.includes('429') || err.message?.includes('rate')) {
                errMsg = "⏳ The free AI is rate-limited right now. Please wait 30 seconds and try again.";
            } else if (err.message?.includes('401') || err.message?.includes('403')) {
                errMsg = "🔑 API key error. Please check your .env file.";
            }

            // Try backend as final fallback
            try {
                const result = await callBackend(text);
                setMessages(prev => prev.map(m =>
                    m.id === aiId ? { ...m, text: result.text } : m
                ));
            } catch {
                setMessages(prev => prev.map(m =>
                    m.id === aiId ? { ...m, text: errMsg } : m
                ));
            }
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
        <div className="chat-popup glass-card">
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
                            <span className="ai-model-tag">Llama 3.1</span>
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
        </div>
    );
};

export default ChatPopup;
