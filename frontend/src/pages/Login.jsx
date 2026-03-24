import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import loginImage from '../assets/loginImage.png';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', motDePasse: '' });
  const [touched, setTouched] = useState({ email: false, motDePasse: false });
  const [modalErreur, setModalErreur] = useState('');
  const [modalSucces, setModalSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  const erreurEmail = touched.email && !formData.email ? "L'email est obligatoire" : '';
  const erreurMdp = touched.motDePasse && !formData.motDePasse ? 'Le mot de passe est obligatoire' : '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, motDePasse: true });

    if (!formData.email || !formData.motDePasse) return;

    setChargement(true);
    setModalErreur('');

    try {
      const res = await axios.post('/auth/login', {
        email: formData.email,
        motDePasse: formData.motDePasse,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setModalSucces(true);
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      const message = err.response?.data?.message || 'Erreur de connexion, réessayez';
      setModalErreur(message);
    } finally {
      setChargement(false);
    }
  };

  // === NOUVEAU : Fermeture automatique du modal erreur après 3 secondes ===
  useEffect(() => {
    let timer;
    if (modalErreur) {
      timer = setTimeout(() => {
        setModalErreur('');
      }, 3000); // 3 secondes minimum
    }
    return () => clearTimeout(timer); // Nettoyage
  }, [modalErreur]);

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Gauche : Image */}
        <div className="login-left">
          <img src={loginImage} alt="Thermivent" className="login-image" />
        </div>

        {/* Droite : Formulaire */}
        <div className="login-right">
          <h1>Bienvenue</h1>
          <p className="subtitle">Connectez-vous à votre compte</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className={`input-wrapper ${erreurEmail ? 'input-error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
              </div>
              {erreurEmail && <span className="field-error">⚠️ {erreurEmail}</span>}
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label htmlFor="motDePasse">Mot de passe</label>
              <div className={`input-wrapper ${erreurMdp ? 'input-error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  id="motDePasse"
                  name="motDePasse"
                  placeholder="••••••••"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
              </div>
              {erreurMdp && <span className="field-error">⚠️ {erreurMdp}</span>}
            </div>

            <button type="submit" className="btn-login" disabled={chargement}>
              {chargement ? (
                <><div className="spinner" /> Connexion en cours...</>
              ) : (
                <>Se connecter <span className="btn-arrow">→</span></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ==================== MODAL ERREUR ==================== */}
      {modalErreur && (
        <div className="modal-overlay" onClick={() => setModalErreur('')}>
          <div 
            className="modal modal-erreur" 
            onClick={(e) => e.stopPropagation()}   // Empêche la fermeture si on clique sur le modal
          >
            <div className="modal-icon modal-icon-erreur">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Connexion échouée</h3>
            <p>{modalErreur}</p>
            <button 
              className="modal-btn modal-btn-erreur" 
              onClick={() => setModalErreur('')}
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL SUCCÈS ==================== */}
      {modalSucces && (
        <div className="modal-overlay">
          <div className="modal modal-succes">
            <div className="modal-icon modal-icon-succes">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Connexion réussie !</h3>
            <p>Bienvenue. Redirection en cours...</p>
            <div className="modal-progress">
              <div className="modal-progress-bar" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;