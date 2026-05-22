import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const POWERBI_URL_VENTES = "https://app.powerbi.com/view?r=eyJrIjoiZGI0YTRmMDktNjFkNS00NmZhLTk4MTktNjIyNzY4YTA2OGNkIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9";
const SalesDashboard = () => {
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
            <h1>Analyse des Ventes</h1>
            <p>Suivez les performances de ventes et les tendances de revenus.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-iframe-wrapper">
              <iframe
                title="Dashboard Ventes"
                src={POWERBI_URL_VENTES}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '8px', border: 'none', display: 'block' }}
              />
            </div>
          </div>
          {userData?.name && !isAdmin && <NotificationSender section="Ventes" />}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;