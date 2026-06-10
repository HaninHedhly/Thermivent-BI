import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import NotificationSender from '../components/NotificationSender';
import '../styles/Dashboard.css';

const SalesDashboard = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  // Topics autorisés dérivés des accès réels de l'utilisateur
  const allowedTopics = Object.entries(userData?.access || {})
    .filter(([, v]) => v === true)
    .map(([k]) => k === 'stocks' ? 'stock' : k);
  const isAdmin  = userData?.role === 'Admin';

  const [dashboard, setDashboard]   = useState(null);
  const [loading,   setLoading]     = useState(true);
  const [error,     setError]       = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboards/Ventes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setDashboard(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Chatbot sessionId={`${userData?._id || 'default'}-ventes`} allowedTopics={allowedTopics} />
      <div className="main-content">
        <TopNavbar />
        <div className="page-container">

          <div className="page-header">
            <h1>{dashboard?.titre || 'Analyse des Ventes'}</h1>
            <p>Suivez les performances de ventes et les tendances de revenus.</p>
          </div>

          <div className="powerbi-section">
            <div className="powerbi-header">
              <h2>Dashboard Ventes — Power BI</h2>
              <button
                onClick={() => setRefreshKey(k => k + 1)}
                style={refreshBtnStyle}
              >
                 Actualiser
              </button>
            </div>

            <div className="powerbi-iframe-wrapper">
              {loading && (
                <div style={centerStyle}>
                  <p style={{ color: '#666' }}>Chargement du dashboard...</p>
                </div>
              )}
              {error && (
                <div style={{ ...centerStyle, background: '#fff5f5' }}>
                  <p style={{ color: '#e53e3e' }}>Erreur : {error}</p>
                </div>
              )}
              {!loading && !error && dashboard && (
                <iframe
                  key={refreshKey}
                  title={dashboard.titre}
                  src={dashboard.lienPowerBI}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  allowFullScreen
                  style={{ borderRadius: '8px', border: 'none', display: 'block' }}
                />
              )}
            </div>
          </div>

          {userData?.name && !isAdmin && <NotificationSender section="Ventes" />}
        </div>
      </div>
    </div>
  );
};

const refreshBtnStyle = {
  padding: '6px 14px',
  background: '#283953',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
};

const centerStyle = {
  width: '100%',
  height: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  background: '#f8f9fa',
};

export default SalesDashboard;