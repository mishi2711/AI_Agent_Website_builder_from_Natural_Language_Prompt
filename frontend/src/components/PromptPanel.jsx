import { useState, useRef, useEffect } from 'react';

function PromptPanel({ messages, onSendPrompt, isLoading }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendPrompt(input.trim());
        setInput('');
    };

    return (
        <div className="panel prompt-panel" id="prompt-panel">
            <div className="panel-header">
                <h3>AI Assistant</h3>
                {isLoading && (
                    <span className="status-badge running">
                        <span className="status-dot" />
                        Processing
                    </span>
                )}
            </div>

            <div className="messages-container panel-body" id="messages-container">
                {messages.length === 0 && (
                    <div className="loading-overlay" style={{ opacity: 0.5 }}>
                        <p style={{ fontSize: '0.82rem', textAlign: 'center', lineHeight: 1.6 }}>
                            Describe the changes you want to make to your website.
                            <br />
                            <span style={{ color: 'var(--text-muted)' }}>
                                e.g. "Add a navbar with Home, About, Contact links"
                            </span>
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}

                {isLoading && (
                    <div className="message assistant" style={{ opacity: 0.7 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="loading-spinner" />
                            <span>Generating changes...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="prompt-input-area" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input"
                    id="prompt-input"
                    placeholder="Describe website changes..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    id="send-prompt-btn"
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default PromptPanel;
