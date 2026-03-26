import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const PurchasesDashboard = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin  = userData?.role === 'Admin';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Chatbot />
      <div className="main-content">
        <TopNavbar />
        <div className="page-container">
          <div className="page-header">
            <h1>Analyse des Achats</h1>
            <p>Suivez l'activité d'achat et les performances des fournisseurs.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-header">
              <h2>Dashboard Achats — Power BI</h2>
              <span className="powerbi-badge"><span className="powerbi-badge-dot" />En attente d'intégration</span>
            </div>
            <div className="powerbi-body">
              <div className="powerbi-icon icon-achats">🛒</div>
              <h3>Dashboard des Achats</h3>
              <p>L'intégration Power BI sera disponible prochainement.</p>
            </div>
          </div>
          {/* ✅ section="Achats" — corrigé */}
          {userData?.name && !isAdmin && <NotificationSender section="Achats" />}
        </div>
      </div>
    </div>
  );
};

export default PurchasesDashboard;