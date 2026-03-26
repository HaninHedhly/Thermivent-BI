// src/pages/Rapports.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';

import '../styles/Web.css';

const Rapports = () => {
  // 1. RÉCUPÉRATION DES PERMISSIONS DE L'UTILISATEUR
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = userData.role === 'Admin';
  const access = userData.access || {};

  // 2. DÉFINITION DE TOUS LES ONGLETS POSSIBLES
  const allTabs = [
    { key: 'ventes',     label: 'Rapport de Ventes',    permission: 'ventes' },
    { key: 'achats',     label: 'Rapport d\'Achats',    permission: 'achats' },
    { key: 'stock',      label: 'Rapport de Stock',     permission: 'stocks' }, // attention au 's' final selon votre DB
    { key: 'production', label: 'Rapport de Production', permission: 'production' }
  ];

  // 3. FILTRAGE DES ONGLETS AUTORISÉS
  const allowedTabs = allTabs.filter(tab => isAdmin || access[tab.permission] === true);

  // 4. ÉTAT POUR L'ONGLET ACTIF (initialisé sur le premier onglet autorisé)
  const [activeTab, setActiveTab] = useState(allowedTabs.length > 0 ? allowedTabs[0].key : '');

  // Sécurité : Si l'utilisateur n'a aucun accès, on affiche un message
  if (allowedTabs.length === 0 && !isAdmin) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <div className="page-container">
            <h1>Accès Restreint</h1>
            <p>Vous n'avez pas l'autorisation de consulter les rapports.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    ventes:     { revenue: 0, transactions: 0, croissance: 0, articles: 0 },
    achats:     { revenue: 0, transactions: 0, croissance: 0, articles: 0 },
    stock:      { revenue: 0, transactions: 0, croissance: 0, articles: 0 },
    production: { revenue: 0, transactions: 0, croissance: 0, articles: 0 }
  };

  const current = stats[activeTab] || stats['ventes'];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        {/* Top Navbar */}
        <div className="top-navbar">
          <div className="search-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Rechercher un rapport..." className="search-input" />
          </div>

          <div className="top-right">
            <div className="bell-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className="user-profile">
              <img 
                src={userData.photo || `https://ui-avatars.com/api/?name=${userData.name}&background=FDBA74&color=fff`} 
                alt="User" 
                style={{ width: '36px', height: '36px', borderRadius: '50%' }} 
              />
              <div className="user-info">
                <p>{userData.name || 'Utilisateur'}</p>
                <span>{userData.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="page-container" style={{ padding: '30px 40px' }}>
          <div className="page-header">
            <h1>Rapports</h1>
            <p>Consultez et analysez vos rapports d'activité</p>
          </div>

          {/* Tabs dynamiques */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {allowedTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activeTab === tab.key ? '#0F2038' : '#F1F5F9',
                  color: activeTab === tab.key ? '#FFFFFF' : '#64748B',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '20px', 
            marginBottom: '40px' 
          }}>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Revenus Total</p>
                <h2 className="stat-value">{current.revenue.toLocaleString()} TND</h2>
                <span className="stat-trend trend-up">↑ 0%</span>
              </div>
              <div className="stat-icon" style={{ background: '#DCFCE7', color: '#10B981' }}>💰</div>
            </div>
            {/* ... autres cartes statiques ... */}
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Transactions</p>
                <h2 className="stat-value">{current.transactions}</h2>
                <span className="stat-trend trend-up">↑ 0%</span>
              </div>
              <div className="stat-icon" style={{ background: '#DBEAFE', color: '#3B82F6' }}>📄</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Croissance</p>
                <h2 className="stat-value">{current.croissance}%</h2>
                <span className="stat-trend trend-up">↑ 0%</span>
              </div>
              <div className="stat-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>📈</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Articles</p>
                <h2 className="stat-value">{current.articles}</h2>
                <span className="stat-trend trend-down">↓ 0%</span>
              </div>
              <div className="stat-icon" style={{ background: '#F3E8FF', color: '#8B5CF6' }}>📦</div>
            </div>
          </div>

          {/* Zone Power BI Placeholder */}
          <div style={{
            border: '2px dashed #CBD5E1',
            borderRadius: '16px',
            height: '520px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F8FAFC',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.6 }}>📄</div>
            <h3 style={{ color: '#0F2038', marginBottom: '8px' }}>
              Rapport {allowedTabs.find(t => t.key === activeTab)?.label}
            </h3>
            <p style={{ color: '#64748B', maxWidth: '420px' }}>
              Visualisation des données Power BI pour la section {activeTab}
            </p>
          </div>
        </div>

        <Chatbot />
      </div>
    </div>
  );
};

export default Rapports;