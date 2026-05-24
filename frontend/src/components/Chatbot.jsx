  import React, { useState, useRef, useEffect } from 'react';
  import { sendMessageToAgent, clearAgentSession } from '../api/agentApi';
  import '../styles/Chatbot.css';

  const Chatbot = ({ sessionId = 'default' }) => {
    const [ouvert, setOuvert] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
      { 
        id: 1, 
        texte: 'Bonjour ! Je suis votre assistant BI Thermivent. Posez-moi vos questions sur les ventes, achats, production ou stock.', 
        expediteur: 'bot' 
      }
    ]);
    const [loading, setLoading] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState('');

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
      if (ouvert) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages, ouvert]);

    useEffect(() => {
      if (ouvert) {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }, [ouvert]);

    const envoyerMessage = async (e) => {
      e.preventDefault();
      if (!message.trim() || loading) return;

      const texteUser = message.trim();
      setLastUserMessage(texteUser);
      setMessage('');

      setMessages(prev => [...prev, {
        id: Date.now(),
        texte: texteUser,
        expediteur: 'user',
      }]);

      setLoading(true);

      try {
        const data = await sendMessageToAgent(texteUser, sessionId);
        const response = data.response;

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          texte: response.output,
          expediteur: 'bot',
          sqlQuery: response.sql_query,
          success: response.success,
          errorType: response.error_type || null,
        }]);

      } catch (error) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          texte: '❌ Impossible de contacter l\'agent IA. Vérifiez que le serveur Python est lancé sur le port 8000.',
          expediteur: 'bot',
          success: false,
        }]);
      } finally {
        setLoading(false);
      }
    };

    const handleRetry = async () => {
      if (!lastUserMessage || loading) return;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        texte: lastUserMessage,
        expediteur: 'user',
      }]);

      setLoading(true);

      try {
        const data = await sendMessageToAgent(lastUserMessage, sessionId);
        const response = data.response;

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          texte: response.output,
          expediteur: 'bot',
          sqlQuery: response.sql_query,
          success: response.success,
          errorType: response.error_type || null,
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          texte: '❌ Impossible de contacter l\'agent IA.',
          expediteur: 'bot',
          success: false,
        }]);
      } finally {
        setLoading(false);
      }
    };

    const handleClear = async () => {
      await clearAgentSession(sessionId);
      setMessages([{
        id: Date.now(),
        texte: 'Conversation réinitialisée. Comment puis-je vous aider ?',
        expediteur: 'bot',
      }]);
      setLastUserMessage('');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        envoyerMessage(e);
      }
    };

    return (
      <>
        <div className={`chatbot-window ${ouvert ? 'chatbot-open' : ''}`}>

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <p className="chatbot-name">Assistant BI Thermivent</p>
                <span className="chatbot-status">
                  <span className="chatbot-dot" /> En ligne
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="chatbot-close" onClick={handleClear} title="Nouvelle conversation">
                🗑
              </button>
              <button className="chatbot-close" onClick={() => setOuvert(false)}>
                ✕
              </button>
            </div>
          </div>

          {/* Zone des messages */}
          <div className="chatbot-messages">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`chatbot-msg ${msg.expediteur === 'user' ? 'msg-user' : 'msg-bot'}`}
              >
              {msg.success === false ? (
    <div className="error-message">
      <div className="error-card">

        {/* Icône selon le type d'erreur */}
        <div className="error-icon-big">
          {msg.errorType === "quota_exceeded" && "⏳"}
          {msg.errorType === "server_offline" && "🔌"}
          {msg.errorType === "timeout"        && "⌛"}
          {msg.errorType === "technical_error" && "⚠️"}
          {!msg.errorType                      && "❌"}
        </div>

        {/* Titre selon le type */}
        <div className="error-title">
          {msg.errorType === "quota_exceeded"  && "Service temporairement surchargé"}
          {msg.errorType === "server_offline"  && "Serveur IA hors ligne"}
          {msg.errorType === "timeout"         && "Délai d'attente dépassé"}
          {msg.errorType === "technical_error" && "Erreur technique"}
          {!msg.errorType                      && "Une erreur est survenue"}
        </div>

        <div className="error-text">{msg.texte}</div>

        {/* Bouton retry pour les cas récupérables */}
        {(msg.errorType === "quota_exceeded" || msg.errorType === "timeout") && (
          <button
            className="retry-btn"
            onClick={handleRetry}
            disabled={loading}
          >
            🔄 Réessayer
          </button>
        )}
      </div>
    </div>
  ) : (
    <span style={{ whiteSpace: 'pre-wrap' }}>{msg.texte}</span>
  )}

                {msg.sqlQuery && msg.success && (
                  <details style={{ marginTop: '10px', fontSize: '11px', opacity: 0.75 }}>
                    <summary style={{ cursor: 'pointer' }}>🔍 Voir la requête SQL</summary>
                    <pre style={{
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                      padding: '10px',
                      borderRadius: '8px',
                      overflowX: 'auto',
                      marginTop: '6px',
                      fontSize: '11px',
                    }}>
                      {msg.sqlQuery}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            {loading && (
              <div className="chatbot-msg msg-bot">
                <span>⏳ Analyse en cours...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <form className="chatbot-input-area" onSubmit={envoyerMessage}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ex: Y a-t-il une anomalie dans les ventes 2025 ?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chatbot-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={!message.trim() || loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Bouton flottant */}
        <button
          className={`chatbot-fab ${ouvert ? 'chatbot-fab-active' : ''}`}
          onClick={() => setOuvert(!ouvert)}
          aria-label="Ouvrir l'assistant"
        >
          {ouvert ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
      </>
    );
  };

  export default Chatbot;