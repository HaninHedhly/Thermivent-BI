// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/logoImage.webp';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. RÉCUPÉRATION DES PERMISSIONS
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = userData.role === 'Admin';
  const access = userData.access || {};

  // 2. FONCTION DE VÉRIFICATION
  const canSee = (permission) => {
    if (isAdmin) return true; // L'admin voit tout
    return access[permission] === true; // L'user voit si la permission est true
  };

  const Icons = {
    Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    Arrow: () => <svg className={`arrow-icon ${isDashboardOpen ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
    Ventes: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    Achats: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    Stock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    Production: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    UserMgmt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
          <img src={logoImage} alt="Thermivent" className="logo-image" />
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => setIsDashboardOpen(!isDashboardOpen)}>
          <Icons.Dashboard /> Dashboard <Icons.Arrow />
        </li>

        <ul className={`sub-menu ${isDashboardOpen ? 'open' : ''}`}>
          {/* VÉRIFICATION POUR CHAQUE PAGE */}
          {canSee('ventes') && (
            <li className={location.pathname === '/ventes' ? 'active' : ''} onClick={() => navigate('/ventes')}>
              <Icons.Ventes /> Ventes
            </li>
          )}

          {canSee('achats') && (
            <li className={location.pathname === '/achats' ? 'active' : ''} onClick={() => navigate('/achats')}>
              <Icons.Achats /> Achats
            </li>
          )}

          {canSee('stocks') && (
            <li className={location.pathname === '/stock' ? 'active' : ''} onClick={() => navigate('/stock')}>
              <Icons.Stock /> Stock
            </li>
          )}

          {canSee('production') && (
            <li className={location.pathname === '/production' ? 'active' : ''} onClick={() => navigate('/production')}>
              <Icons.Production /> Production
            </li>
          )}
        </ul>

        {/* Uniquement pour l'Admin */}
        {isAdmin && (
          <li className={location.pathname === '/users' ? 'active' : ''} onClick={() => navigate('/users')}>
            <Icons.UserMgmt /> Gestion des utilisateurs
          </li>
        )}

        <li className={location.pathname === '/rapports' ? 'active' : ''} onClick={() => navigate('/rapports')}>
          <Icons.Reports /> Rapports
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="logout-btn" onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </div>
      </div>
    </div>
  );
};

export default Sidebar;