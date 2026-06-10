// src/pages/Profile.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import axios from '../api/axios';
import '../styles/Profile.css';

// ── Modales feedback ────────────────────────────────────────────
const ModalErreur = ({ message, onClose }) => (
  <div className="prof-overlay" onClick={onClose}>
    <div className="prof-modal" onClick={e => e.stopPropagation()}>
      <div className="prof-modal-icon prof-erreur-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9"  y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h3 className="prof-modal-title">Erreur</h3>
      <p className="prof-modal-msg">{message}</p>
      <button className="prof-modal-btn prof-erreur-btn" onClick={onClose}>Fermer</button>
    </div>
  </div>
);

const ModalSucces = ({ message, onClose }) => (
  <div className="prof-overlay" onClick={onClose}>
    <div className="prof-modal" onClick={e => e.stopPropagation()}>
      <div className="prof-modal-icon prof-succes-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h3 className="prof-modal-title">Succès !</h3>
      <p className="prof-modal-msg">{message}</p>
      <button className="prof-modal-btn prof-succes-btn" onClick={onClose}>OK</button>
    </div>
  </div>
);

// ── Composant principal ─────────────────────────────────────────
const Profile = () => {
  const storedUser  = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    name:        storedUser.name        || '',
    email:       storedUser.email       || '',
    phone:       storedUser.phone       || '',
    ancienMotDePasse:    '',
    motDePasse:       '',
    confirmerMotDePasse: '',
    photo:       storedUser.photo       || '',
  });
const [showOldPwd, setShowOldPwd] = useState(false); 
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [chargement, setChargement]   = useState(false);
  const [erreurMsg, setErreurMsg]     = useState('');
  const [succesMsg, setSuccesMsg]     = useState('');

  // ── Avatar initiales ──────────────────────────────────────────
  const getInitiales = (name) => (name || 'U').trim().substring(0, 2).toUpperCase();

  // ── Upload photo ──────────────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErreurMsg('La photo ne doit pas dépasser 5 Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(f => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  // ── Supprimer photo ───────────────────────────────────────────
  const handleRemovePhoto = () => setFormData(f => ({ ...f, photo: '' }));

  // ── Force du mot de passe ─────────────────────────────────────
  const getPwdStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6)  return { label: 'Trop court', color: '#EF4444', width: '25%' };
    if (pwd.length < 8)  return { label: 'Faible',     color: '#F59E0B', width: '50%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return { label: 'Fort',  color: '#10B981', width: '100%' };
    return { label: 'Moyen', color: '#3B82F6', width: '75%' };
  };
  const strength = getPwdStrength(formData.motDePasse);

  // ── Soumission ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setErreurMsg('Le nom est obligatoire.'); return; }
    if (!formData.email.trim()) { setErreurMsg("L'email est obligatoire."); return; }

    // Validation spécifique au changement de mot de passe
    if (formData.motDePasse) {
      if (!formData.ancienMotDePasse) {
        setErreurMsg("Veuillez saisir votre mot de passe actuel pour le modifier.");
        return;
      }
      if (formData.motDePasse.length < 6) {
        setErreurMsg('Le nouveau mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (formData.motDePasse === formData.ancienMotDePasse) {
        setErreurMsg('Le nouveau mot de passe doit être différent de l\'ancien.');
        return;
      }
      if (formData.motDePasse !== formData.confirmerMotDePasse) {
        setErreurMsg('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    const { confirmerMotDePasse, ...dataToSend } = formData;
    if (!dataToSend.motDePasse) {
      delete dataToSend.motDePasse;
      delete dataToSend.ancienMotDePasse;
    }

    setChargement(true);
    try {
      // On envoie ancienMotDePasse et motDePasse au serveur
      const res = await axios.put('/auth/me', dataToSend);

      const updatedUser = {
        ...storedUser,
        name: dataToSend.name,
        email: dataToSend.email,
        phone: dataToSend.phone,
        photo: dataToSend.photo,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setFormData(f => ({ ...f, motDePasse: '', confirmerMotDePasse: '', ancienMotDePasse: '' }));
      setSuccesMsg('Votre profil a été mis à jour avec succès !');
    } catch (err) {
      setErreurMsg(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setChargement(false);
    }
  };

  const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
  const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
  // Couleurs badge accès
  const accessColors = {
    ventes:     { bg: '#D1FAE5', color: '#059669' },
    achats:     { bg: '#DBEAFE', color: '#2563EB' },
    stocks:     { bg: '#FFEDD5', color: '#EA580C' },
    production: { bg: '#F3E8FF', color: '#9333EA' },
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Chatbot />

      <div className="main-content">
        <TopNavbar />

        <div className="page-container">
          <div className="page-header">
            <h1>Mon Profil</h1>
            <p>Gérez vos informations personnelles et votre mot de passe.</p>
          </div>

          <div className="prof-layout">

            {/* ── Colonne gauche : carte profil ── */}
            <div className="prof-card-left">

              {/* Avatar */}
              <div className="prof-avatar-zone">
                {formData.photo ? (
                  <img src={formData.photo} alt="profil" className="prof-avatar-img" />
                ) : (
                  <div className="prof-avatar-placeholder">
                    {getInitiales(formData.name)}
                  </div>
                )}

                {/* Boutons photo */}
                <div className="prof-photo-actions">
                  <label className="prof-photo-btn prof-photo-upload" htmlFor="photoInput">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Changer
                  </label>
                  <input id="photoInput" type="file" accept="image/*"
                    onChange={handlePhotoUpload} className="prof-photo-input" />
                  {formData.photo && (
                    <button type="button" className="prof-photo-btn prof-photo-remove"
                      onClick={handleRemovePhoto}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      </svg>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>

              {/* Infos résumé */}
              <div className="prof-summary">
                <p className="prof-summary-name">{formData.name || '—'}</p>
                <p className="prof-summary-email">{formData.email || '—'}</p>
                <span className="prof-summary-role">{storedUser.role || 'Employé'}</span>
              </div>

              {/* Accès (lecture seule) */}
              <div className="prof-access-section">
                <p className="prof-access-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Accès dashboards
                </p>
                <div className="prof-access-badges">
                  {storedUser.role === 'Admin' ? (
                    <span className="prof-access-badge" style={{ background:'#EFF6FF', color:'#2563EB' }}>
                      Accès complet
                    </span>
                  ) : (
                    Object.entries(storedUser.access || {}).map(([key, val]) =>
                      val ? (
                        <span key={key} className="prof-access-badge"
                          style={{ background: accessColors[key]?.bg, color: accessColors[key]?.color }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      ) : null
                    )
                  )}
                </div>
                <p className="prof-access-note">
                  Les accès sont attribués par l'administrateur.
                </p>
              </div>

            </div>

            {/* ── Colonne droite : formulaire ── */}
            <div className="prof-card-right">
              <form onSubmit={handleSubmit} noValidate>

                {/* Section infos personnelles */}
                <div className="prof-section">
                  <h2 className="prof-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Informations personnelles
                  </h2>

                  {/* Nom */}
                  <div className="prof-field">
                    <label className="prof-label">Nom complet <span className="prof-required">*</span></label>
                    <input
                      type="text"
                      className="prof-input"
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      placeholder="Votre nom complet"
                    />
                  </div>

                  {/* Email + Téléphone */}
                  <div className="prof-row">
                    <div className="prof-field">
                      <label className="prof-label">Email <span className="prof-required">*</span></label>
                      <input
                        type="email"
                        className="prof-input"
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="prof-field">
                      <label className="prof-label">Téléphone</label>
                      <input
                        type="text"
                        className="prof-input"
                        value={formData.phone}
                        onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

            <div className="prof-divider" />

                {/* Section Changement Mot de Passe */}
                <div className="prof-section">
                  <h2 className="prof-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Changer le mot de passe
                    <span className="prof-optional">optionnel</span>
                  </h2>

                  {/* 1. ANCIEN MOT DE PASSE (Requis pour changer) */}
                  <div className="prof-field">
                    <label className="prof-label">Mot de passe actuel</label>
                    <div className="prof-pwd-wrap">
                      <input
                        type={showOldPwd ? 'text' : 'password'}
                        className="prof-input"
                        placeholder="Saisissez votre mot de passe actuel"
                        value={formData.ancienMotDePasse}
                        onChange={e => setFormData(f => ({ ...f, ancienMotDePasse: e.target.value }))}
                      />
                      <button type="button" className="prof-eye-btn" onClick={() => setShowOldPwd(!showOldPwd)}>
                        {showOldPwd ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  {/* 2. NOUVEAU MOT DE PASSE */}
                  <div className="prof-field">
                    <label className="prof-label">Nouveau mot de passe</label>
                    <div className="prof-pwd-wrap">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        className="prof-input"
                        placeholder="Nouveau mot de passe (min 6 car.)"
                        value={formData.motDePasse}
                        onChange={e => setFormData(f => ({ ...f, motDePasse: e.target.value }))}
                      />
                      <button type="button" className="prof-eye-btn" onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {formData.motDePasse && strength && (
                      <div className="prof-strength">
                        <div className="prof-strength-bar">
                          <div className="prof-strength-fill" style={{ width: strength.width, background: strength.color }} />
                        </div>
                        <span className="prof-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. CONFIRMATION NOUVEAU MOT DE PASSE */}
                  {formData.motDePasse && (
                    <div className="prof-field">
                      <label className="prof-label">Confirmer le nouveau mot de passe</label>
                      <div className="prof-pwd-wrap">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          className={`prof-input ${
                            formData.confirmerMotDePasse 
                            ? (formData.confirmerMotDePasse === formData.motDePasse ? 'prof-input-valid' : 'prof-input-invalid') 
                            : ''
                          }`}
                          placeholder="Répétez le nouveau mot de passe"
                          value={formData.confirmerMotDePasse}
                          onChange={e => setFormData(f => ({ ...f, confirmerMotDePasse: e.target.value }))}
                        />
                        <button type="button" className="prof-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                          {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="prof-actions">
                  <button type="button" className="prof-btn-cancel" onClick={() => {
                    setFormData({
                      name: storedUser.name || '',
                      email: storedUser.email || '',
                      phone: storedUser.phone || '',
                      ancienMotDePasse: '',
                      motDePasse: '',
                      confirmerMotDePasse: '',
                      photo: storedUser.photo || '',
                    });
                  }}>Annuler</button>
                  <button type="submit" className="prof-btn-save" disabled={chargement}>
                    {chargement ? <><div className="prof-spinner" /> Enregistrement...</> : "Sauvegarder"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modales */}
      {erreurMsg && <ModalErreur message={erreurMsg} onClose={() => setErreurMsg('')} />}
      {succesMsg && <ModalSucces message={succesMsg} onClose={() => setSuccesMsg('')} />}
    </div>
  );
};

export default Profile;