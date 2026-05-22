import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const POWERBI_URL_STOCK = "https://app.powerbi.com/view?r=eyJrIjoiYTdjOWI3ZDAtOTZiMS00MWQzLTk4OGEtNDBjNTNkMTEyNDdkIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9";

const StockDashboard = () => {
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
            <h1>Analyse de Stock</h1>
            <p>Surveillez les niveaux de stock et la disponibilité des produits.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-iframe-wrapper">
              <iframe
                title="Dashboard Stock"
                src={POWERBI_URL_STOCK}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '8px', border: 'none', display: 'block' }}
              />
            </div>
          </div>
          {userData?.name && !isAdmin && <NotificationSender section="Stock" />}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;