import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';

import '../styles/Dashboard.css';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const SalesDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
            <Chatbot />

      <div className="main-content">

        {/* Navbar */}
        <div className="top-navbar">
          <div className="search-container">
            <SearchIcon />
            <input type="text" placeholder="Rechercher..." className="search-input" />
          </div>
          <div className="top-right">
            <div className="bell-icon"><BellIcon /></div>
            <div className="user-profile">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=FDBA74&color=fff"
                alt="Admin"
              />
              <div className="user-info">
                <p>Admin User</p>
                <span>admin@company.tn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="page-container">
          <div className="page-header">
            <h1>Analyse des Ventes</h1>
            <p>Suivez les performances de ventes et les tendances de revenus.</p>
          </div>

          <div className="powerbi-section">
            <div className="powerbi-header">
              <h2>Dashboard Ventes — Power BI</h2>
              <span className="powerbi-badge">
                <span className="powerbi-badge-dot" />
                En attente d'intégration
              </span>
            </div>
            <div className="powerbi-body">
              <div className="powerbi-icon icon-ventes">📈</div>
              <h3>Dashboard de Ventes</h3>
              <p>
                L'intégration Power BI sera disponible prochainement.
                Les rapports de ventes, CA et tendances seront affichés ici.
              </p>
              {/* Décommentez quand vous avez l'URL Power BI :
              <iframe
                src="VOTRE_URL_POWERBI"
                className="powerbi-iframe-placeholder"
                allowFullScreen
                title="Dashboard Ventes"
              />
              */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesDashboard;