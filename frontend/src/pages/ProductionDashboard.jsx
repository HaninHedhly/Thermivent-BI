import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const ProductionDashboard = () => {
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
            <h1>Analyse de Production</h1>
            <p>Surveillez les performances et l'efficacité de production.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-header">
              <h2>Dashboard Production — Power BI</h2>
              <span className="powerbi-badge"><span className="powerbi-badge-dot" />En attente d'intégration</span>
            </div>
            <div className="powerbi-body">
              <div className="powerbi-icon icon-production">🏭</div>
              <h3>Dashboard de Production</h3>
              <p>L'intégration Power BI sera disponible prochainement.</p>
            </div>
          </div>
          {/* ✅ section="Production" — corrigé */}
          {userData?.name && !isAdmin && <NotificationSender section="Production" />}
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;