import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const POWERBI_URL_ACHATS = "https://app.powerbi.com/view?r=eyJrIjoiYTRhNzJmNDMtNGZlYS00YTJhLTgzMTgtZTFmZmY5OWE4OGUwIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9";

const PurchasesDashboard = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin  = userData?.role === 'Admin';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Chatbot sessionId={userData?._id || 'default'} />
      <div className="main-content">
        <TopNavbar />
        <div className="page-container">
          <div className="page-header">
            <h1>Analyse des Achats</h1>
            <p>Suivez l'activité d'achat et les performances des fournisseurs.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-iframe-wrapper">
              <iframe
                title="Dashboard Achats"
                src={POWERBI_URL_ACHATS}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '8px', border: 'none', display: 'block' }}
              />
            </div>
          </div>
          {userData?.name && !isAdmin && <NotificationSender section="Achats" />}
        </div>
      </div>
    </div>
  );
};

export default PurchasesDashboard;