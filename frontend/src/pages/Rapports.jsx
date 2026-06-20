import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import '../styles/Web.css';

const Rapports = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin  = userData.role === 'Admin';

  const [rapports,   setRapports]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [activeTab,  setActiveTab]  = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [search,     setSearch]     = useState('');

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
        if (data.data.length > 0) setActiveTab(data.data[0].type);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRapports();
  }, []);

  // Filtrage des onglets selon la recherche
  // Mots-clés mappés aux types de rapports
const SEARCH_ALIASES = {
  ventes:     ['vente', 'ventes', 'sales', 'ca', 'chiffre'],
  achats:     ['achat', 'achats', 'purchase', 'fournisseur'],
  production: ['production', 'fabrication', 'of'],
  stock:      ['stock', 'stocks', 'inventaire'],
};

const filteredRapports = rapports.filter(rapport => {
  if (!search.trim()) return true;
  const q = search.trim().toLowerCase();

  if (rapport.titre.toLowerCase().includes(q)) return true;
  if (rapport.type.toLowerCase().includes(q)) return true;

  const aliases = SEARCH_ALIASES[rapport.type.toLowerCase()] || [];
  // Exact match OU alias qui commence par la query (pas l'inverse)
  return aliases.some(alias => alias === q || alias.startsWith(q));
});

  // Si le tab actif n'est plus visible après filtrage, passer au premier visible
  const activeRapport = filteredRapports.find(r => r.type === activeTab)
    || filteredRapports[0]
    || null;

  // Topics autorisés dérivés des accès réels de l'utilisateur
  const allowedTopics = Object.entries(userData?.access || {})
    .filter(([, v]) => v === true)
    .map(([k]) => k === 'stocks' ? 'stock' : k);

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
      <Chatbot sessionId={`${userData?._id || 'default'}-rapports`} allowedTopics={allowedTopics} />

      <div className="main-content">

        <TopNavbar showSearch searchValue={search} onSearch={setSearch} />

        <div className="page-container">
          <div className="page-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>Rapports</h1>
                <p>Consultez et analysez vos rapports d'activité</p>
              </div>
              {activeRapport && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Dernière génération :</p>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
                    {new Date(activeRapport.dateGeneration).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <p style={{ color: '#666', padding: '20px 0' }}>Chargement des rapports...</p>
          ) : (
            <>
              <div className="tabs-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {filteredRapports.length === 0 ? (
                  <p style={{ color: '#94A3B8', fontSize: '14px', padding: '8px 0' }}>
                    Aucun rapport ne correspond à "{search}"
                  </p>
                ) : (
                  filteredRapports.map(rapport => (
                    <button
                      key={rapport.type}
                      onClick={() => { setActiveTab(rapport.type); setRefreshKey(0); }}
                      className={`tab-button ${activeRapport?.type === rapport.type ? 'active' : ''}`}
                    >
                      {rapport.titre}
                    </button>
                  ))
                )}
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  style={{
                    marginLeft: 'auto',
                    padding: '6px 14px',
                    background: '#283953',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                   Actualiser
                </button>
              </div>

              <div className="powerbi-section" style={{ marginTop: '16px' }}>
                <div className="powerbi-iframe-wrapper">
                  {error && (
                    <div style={{ padding: '20px', color: '#e53e3e' }}>Erreur : {error}</div>
                  )}
                  {activeRapport && (
                    <iframe
                      key={`${activeRapport.type}-${refreshKey}`}
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