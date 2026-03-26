import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const StockDashboard = () => {
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
            <h1>Analyse de Stock</h1>
            <p>Surveillez les niveaux de stock et la disponibilité des produits.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-header">
              <h2>Dashboard Stock — Power BI</h2>
              <span className="powerbi-badge"><span className="powerbi-badge-dot" />En attente d'intégration</span>
            </div>
            <div className="powerbi-body">
              <div className="powerbi-icon icon-stock">📦</div>
              <h3>Dashboard de Stock</h3>
              <p>L'intégration Power BI sera disponible prochainement.</p>
            </div>
          </div>
          {/* ✅ section="Stock" — corrigé */}
          {userData?.name && !isAdmin && <NotificationSender section="Stock" />}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;