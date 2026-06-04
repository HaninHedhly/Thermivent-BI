import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import '../styles/Web.css';

const Rapports = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin  = userData.role === 'Admin';

  const [rapports,   setRapports]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [activeTab,  setActiveTab]  = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Charger tous les rapports autorisés depuis la BDD
  useEffect(() => {
    const fetchRapports = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/rapports', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setRapports(data.data);
        // Activer le premier onglet par défaut
        if (data.data.length > 0) setActiveTab(data.data[0].type);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRapports();
  }, []);

  // Rapport actif
  const activeRapport = rapports.find(r => r.type === activeTab);

  if (!loading && rapports.length === 0) {
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
            <input type="text" placeholder="Rechercher un rapport..." className="search-input" />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>Rapports</h1>
                <p>Consultez et analysez vos rapports d'activité</p>
              </div>
              {activeRapport && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                    Dernière génération :
                  </p>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
                    {new Date(activeRapport.dateGeneration).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Onglets dynamiques depuis la BDD */}
          {loading ? (
            <p style={{ color: '#666', padding: '20px 0' }}>Chargement des rapports...</p>
          ) : (
            <>
              <div className="tabs-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {rapports.map(rapport => (
                  <button
                    key={rapport.type}
                    onClick={() => { setActiveTab(rapport.type); setRefreshKey(0); }}
                    className={`tab-button ${activeTab === rapport.type ? 'active' : ''}`}
                  >
                    {rapport.titre}
                  </button>
                ))}
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  style={{
                    marginLeft: 'auto',
                    padding: '6px 14px',
                    background: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  🔄 Actualiser
                </button>
              </div>

              {/* iframe Power BI — lienPowerBI vient de la BDD */}
              <div className="powerbi-section" style={{ marginTop: '16px' }}>
                <div className="powerbi-iframe-wrapper">
                  {error && (
                    <div style={{ padding: '20px', color: '#e53e3e' }}>
                      Erreur : {error}
                    </div>
                  )}
                  {activeRapport && (
                    <iframe
                      key={`${activeTab}-${refreshKey}`}
                      title={activeRapport.titre}
                      src={activeRapport.lienPowerBI}
                      width="100%"
                      height="600"
                      frameBorder="0"
                      allowFullScreen
                      style={{ borderRadius: '8px', border: 'none', display: 'block' }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rapports;