// src/pages/Rapports.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import '../styles/Web.css';

const POWERBI_URLS = {
  production: "https://app.powerbi.com/view?r=eyJrIjoiNGNlZDMwOWUtM2Y4YS00YjVlLWEzN2QtNjQyMmMxZTIxYTY1IiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9",
  stock:      "https://app.powerbi.com/view?r=eyJrIjoiZjhmODE3NjQtYmYxOS00NDcxLWFjNTctZjg3OGFjMjU3NjVkIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9",
  ventes:     "https://app.powerbi.com/view?r=eyJrIjoiNGE0NGNiMDAtOGQ1YS00Mzc0LTg0ZGQtZjZlOGRjYTYzNjBlIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9",
  achats:     "https://app.powerbi.com/view?r=eyJrIjoiNmZiYTUzZjYtMzM0YS00MzkxLWI0NzItNTRmZDcwM2UxOTg0IiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9",
};

const Rapports = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = userData.role === 'Admin';
  const access = userData.access || {};

  const allTabs = [
    { key: 'ventes',     label: 'Rapport de Ventes',     permission: 'ventes' },
    { key: 'achats',     label: "Rapport d'Achats",      permission: 'achats' },
    { key: 'stock',      label: 'Rapport de Stock',      permission: 'stocks' },
    { key: 'production', label: 'Rapport de Production', permission: 'production' },
  ];

  const allowedTabs = allTabs.filter(tab => isAdmin || access[tab.permission] === true);

  const [activeTab, setActiveTab] = useState(allowedTabs.length > 0 ? allowedTabs[0].key : '');

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

  const activeTabLabel = allowedTabs.find(t => t.key === activeTab)?.label || '';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Chatbot sessionId={userData?._id || 'default'} />

      <div className="main-content">
        {/* Top Navbar */}
        <div className="top-navbar">
          <div className="search-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              className="search-input"
            />
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
              />
              <div className="user-info">
                <p>{userData.name || 'Utilisateur'}</p>
                <span>{userData.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="page-container">
          <div className="page-header">
            <h1>Rapports</h1>
            <p>Consultez et analysez vos rapports d'activité</p>
          </div>

          {/* Tabs dynamiques */}
          <div className="tabs-container">
            {allowedTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Power BI iframe — change selon l'onglet actif */}
          <div className="powerbi-section">
            <div className="powerbi-iframe-wrapper">
              <iframe
                key={activeTab}
                title={activeTabLabel}
                src={POWERBI_URLS[activeTab]}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '8px', border: 'none', display: 'block' }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rapports;