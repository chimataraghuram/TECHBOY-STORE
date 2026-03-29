import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/techboy-logo.jpg';

const ChatPopup = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Raghuram's AI Agent. Ask me about his projects, skills, or experience!", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Mock AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                text: "That sounds like a great question! I'm currently looking up the latest smartphone comparisons for you. What's your budget?",
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
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
                        <h3>TECHBOY AI <a href="https://chimataraghuram.github.io/TECHBOY-AI/" target="_blank" rel="noopener noreferrer" className="open-icon-link"><span className="open-icon"></span></a></h3>
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
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-footer" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Ask about Raghuram..."
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
