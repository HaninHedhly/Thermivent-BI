import React from 'react';
import '../styles/Web.css';

const FilterDrawer = ({ onClose, selectedRoles, setSelectedRoles, selectedAccess, setSelectedAccess }) => {
  // Nouveaux rôles mis à jour
  const roles = [
    'Admin',
    'Responsable Stock',
    'Responsable Achat',
    'Responsable Vente',
    'Responsable Production'
  ];

  const accessDashboards = ['Ventes', 'Achats', 'Stocks', 'Production'];

  // Toggle logic for Roles
  const handleRoleToggle = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Toggle logic for Access
  const handleAccessToggle = (access) => {
    if (selectedAccess.includes(access)) {
      setSelectedAccess(selectedAccess.filter(a => a !== access));
    } else {
      setSelectedAccess([...selectedAccess, access]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedAccess([]);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end' }}>
      <div 
        className="filter-pane" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '420px', 
          height: '100vh', 
          background: 'white', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="filter-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '24px 28px',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#0F2038' }}>Filtres</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '28px', 
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {/* Rôles Section */}
          <div className="filter-section">
            <h3 style={{ marginBottom: '16px', color: '#475569', fontWeight: '600' }}>Rôle</h3>
            {roles.map(role => {
              const isActive = selectedRoles.includes(role);
              return (
                <div 
                  key={role} 
                  className={`custom-filter-row ${isActive ? 'active' : ''}`} 
                  onClick={() => handleRoleToggle(role)}
                >
                  <div className="custom-checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>{role}</span>
                </div>
              );
            })}
          </div>

          {/* Accès Section */}
          <div className="filter-section" style={{ marginTop: '32px' }}>
            <h3 style={{ marginBottom: '16px', color: '#475569', fontWeight: '600' }}>Accès dashboard</h3>
            {accessDashboards.map(access => {
              const isActive = selectedAccess.includes(access);
              return (
                <div 
                  key={access} 
                  className={`custom-filter-row ${isActive ? 'active' : ''}`} 
                  onClick={() => handleAccessToggle(access)}
                >
                  <div className="custom-checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>{access}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '20px 28px', borderTop: '1px solid #E2E8F0' }}>
          <button className="clear-btn" onClick={clearFilters}>
            Effacer tous les filtres
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;