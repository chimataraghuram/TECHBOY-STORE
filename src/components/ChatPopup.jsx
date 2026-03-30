import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/techboy-logo.jpg';
import ProductCard from './ProductCard'; // We might use a mini version or just links

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ChatPopup = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm TechBoy AI. Need help finding the best smartphone for your budget?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text) return;

        const userMessage = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await fetch(`${API_BASE_URL}/chatbot/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text })
            });
            const data = await res.json();
            
            setIsTyping(false);
            const aiMessage = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'ai',
                products: data.products || []
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("Chat failed", err);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!", 
                sender: 'ai' 
            }]);
        }
    };

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
                        <p><span className="status-dot"></span> ONLINE & READY</p>
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
                                            <span>{p.name} - ₹{p.price.toLocaleString()}</span>
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

            <form className="chat-footer" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Ask about gaming phones, budget picks..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="send-btn" aria-label="Send Message">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatPopup;
