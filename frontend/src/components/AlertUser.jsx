import React, { useState } from 'react';

const AlertUser = ({ section }) => {
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const sendAlert = async () => {
    if (!msg) return;
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: user.name,
        senderEmail: user.email,
        message: `[${section}] : ${msg}`
      })
    });
    setMsg('');
    alert("Alerte envoyée à l'administrateur !");
  };

  return (
    <div className="alert-box" style={{ background: '#fff', padding: '15px', borderRadius: '10px', marginTop: '20px', border: '1px solid #E2E8F0' }}>
      <h4>Informer l'Admin</h4>
      <textarea 
        value={msg} 
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Décrivez le problème ou l'état..."
        style={{ width: '100%', borderRadius: '5px', border: '1px solid #cbd5e1', padding: '10px' }}
      />
      <button onClick={sendAlert} style={{ background: '#0F2038', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
        Envoyer l'alerte
      </button>
    </div>
  );
};