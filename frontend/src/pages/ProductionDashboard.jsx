import React from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const POWERBI_URL_PRODUCTION = "https://app.powerbi.com/view?r=eyJrIjoiYjllMzI5MTktZDcxZC00NWJkLTgxMjQtYTdjMTAwNGJkZjhiIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9";
const ProductionDashboard = () => {
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
            <h1>Analyse de Production</h1>
            <p>Surveillez les performances et l'efficacité de production.</p>
          </div>
          <div className="powerbi-section">
            <div className="powerbi-iframe-wrapper">
              <iframe
                title="Dashboard Production"
                src={POWERBI_URL_PRODUCTION}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '8px', border: 'none', display: 'block' }}
              />
            </div>
          </div>
          {userData?.name && !isAdmin && <NotificationSender section="Production" />}
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;