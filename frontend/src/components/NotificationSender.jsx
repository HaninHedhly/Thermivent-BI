import React, { useState } from 'react';
import '../styles/NotificationSender.css';

const NotificationSender = ({ section }) => {
  const [message, setMessage]   = useState('');
  const [modalType, setModalType] = useState(''); // 'succes' | 'erreur' | 'warning'
  const [modalMsg, setModalMsg]  = useState('');

  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleSend = async () => {
    // Validation
    if (!message.trim()) {
      setModalType('warning');
      setModalMsg('Veuillez saisir un message avant d\'envoyer.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName:  user.name,
          senderEmail: user.email,
          message:     `[${section}] ${message}`,
          type:        section,           // ← section correcte envoyée
        }),
      });

      if (res.ok) {
        setMessage('');
        setModalType('succes');
        setModalMsg('Votre message a été transmis à l\'administrateur.');
      } else {
        setModalType('erreur');
        setModalMsg(`Erreur ${res.status} — le serveur a refusé la connexion.`);
      }
    } catch (err) {
      setModalType('erreur');
      setModalMsg('Impossible de joindre le backend. Vérifiez qu\'il est lancé sur le port 5000.');
    }
  };

  const fermerModal = () => { setModalType(''); setModalMsg(''); };

  return (
    <>
      {/* ── Zone d'envoi ── */}
      <div className="ns-box">
        <h4 className="ns-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Signaler une anomalie — <span className="ns-section">{section}</span>
        </h4>
        <div className="ns-input-row">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Décrivez le problème dans ${section}...`}
            className="ns-input"
          />
          <button onClick={handleSend} className="ns-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Envoyer
          </button>
        </div>
      </div>

      {/* ── Modales ── */}
      {modalType && (
        <div className="ns-overlay" onClick={fermerModal}>
          <div className="ns-modal" onClick={e => e.stopPropagation()}>

            {/* Icône selon type */}
            <div className={`ns-modal-icon ns-icon-${modalType}`}>
              {modalType === 'succes' && (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              )}
              {modalType === 'erreur' && (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
              {modalType === 'warning' && (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              )}
            </div>

            {/* Titre */}
            <h3 className="ns-modal-title">
              {modalType === 'succes'  && 'Message envoyé !'}
              {modalType === 'erreur'  && 'Erreur de connexion'}
              {modalType === 'warning' && 'Champ vide'}
            </h3>

            <p className="ns-modal-msg">{modalMsg}</p>

            <button
              className={`ns-modal-btn ns-btn-${modalType}`}
              onClick={fermerModal}
            >
              {modalType === 'succes' ? 'OK' : 'Fermer'}
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSender;