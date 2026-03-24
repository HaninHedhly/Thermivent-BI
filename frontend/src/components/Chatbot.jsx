import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [ouvert, setOuvert]     = useState(false);
  const [message, setMessage]   = useState('');
  const [messages, setMessages] = useState([
    { id: 1, texte: 'Bonjour! Comment puis-je vous aider?', expediteur: 'bot' }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    if (ouvert) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, ouvert]);

  // Focus input quand on ouvre
  useEffect(() => {
    if (ouvert) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [ouvert]);

  const envoyerMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const nouveauMsg = {
      id: Date.now(),
      texte: message.trim(),
      expediteur: 'user',
    };

    setMessages(prev => [...prev, nouveauMsg]);
    setMessage('');

    // ── Placeholder réponse bot ──
    // À remplacer plus tard par l'appel à votre API Python/ML
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          texte: "Je suis en cours de développement. Revenez bientôt !",
          expediteur: 'bot',
        }
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage(e);
    }
  };

  return (
    <>
      {/* ── Fenêtre chat ── */}
      <div className={`chatbot-window ${ouvert ? 'chatbot-open' : ''}`}>

        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <p className="chatbot-name">Assistant Virtuel</p>
              <span className="chatbot-status">
                <span className="chatbot-dot" /> En ligne
              </span>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setOuvert(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`chatbot-msg ${msg.expediteur === 'user' ? 'msg-user' : 'msg-bot'}`}
            >
              <span>{msg.texte}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chatbot-input-area" onSubmit={envoyerMessage}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tapez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send" disabled={!message.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>

      </div>

      {/* ── Bouton flottant ── */}
      <button
        className={`chatbot-fab ${ouvert ? 'chatbot-fab-active' : ''}`}
        onClick={() => setOuvert(!ouvert)}
        aria-label="Ouvrir l'assistant"
      >
        {ouvert ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6"  y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
};

export default Chatbot;