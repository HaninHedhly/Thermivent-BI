import React from 'react';
import '../styles/Web.css';

const FilterDrawer = ({ onClose, selectedRoles, setSelectedRoles, selectedAccess, setSelectedAccess }) => {
  const roles = ['Admin', 'Manager', 'Employé'];
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
    <div className="modal-overlay" onClick={onClose} style={{justifyContent: 'flex-end'}}>
      <div className="filter-pane" onClick={(e) => e.stopPropagation()} style={{ width: '400px', height: '100vh', background: 'white', display: 'flex', flexDirection: 'column' }}>
        
        <div className="filter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Filtres</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Rôles Section */}
          <div className="filter-section">
            <h3>Rôle</h3>
            {roles.map(role => {
              const isActive = selectedRoles.includes(role);
              return (
                <div key={role} className={`custom-filter-row ${isActive ? 'active' : ''}`} onClick={() => handleRoleToggle(role)}>
                  <div className="custom-checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>{role}</span>
                </div>
              );
            })}
          </div>

          {/* Accès Section */}
          <div className="filter-section">
            <h3>Accès dashboard</h3>
            {accessDashboards.map(access => {
              const isActive = selectedAccess.includes(access);
              return (
                <div key={access} className={`custom-filter-row ${isActive ? 'active' : ''}`} onClick={() => handleAccessToggle(access)}>
                  <div className="custom-checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>{access}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button className="clear-btn" onClick={clearFilters}>
          Effacer tous les filtres
        </button>

      </div>
    </div>
  );
};

export default FilterDrawer;