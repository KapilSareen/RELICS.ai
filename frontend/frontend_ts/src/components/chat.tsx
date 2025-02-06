import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const userAvatar = "https://i.pravatar.cc/40"; // Random user avatar
    const botAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712104.png"; // AI bot icon

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input, avatar: userAvatar };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('https://api.example.com/ai', { // Replace with actual API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const aiMessage = { role: 'ai', content: data.reply, avatar: botAvatar };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'ai', content: 'Error getting response.', avatar: botAvatar }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-header">AI Chat</div>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.role}`}>
                        <img src={msg.avatar} alt="avatar" className="avatar" />
                        <div className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-wrapper ai">
                        <img src={botAvatar} alt="avatar" className="avatar" />
                        <div className="message ai">Typing...</div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} disabled={loading}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2983/2983788.png" alt="Send" className="send-icon" />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;

