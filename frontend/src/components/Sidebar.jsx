import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/logoImage.webp';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [dashOpen, setDashOpen] = useState(true);

  const userRaw = localStorage.getItem('user');
  const user    = userRaw ? JSON.parse(userRaw) : null;
  const access  = user?.access || {};
  const role    = user?.role   || '';
  const isAdmin = role === 'Admin';

  const dashItems = [
    { label:'Ventes',     path:'/dashboard/ventes',     key:'ventes'     },
    { label:'Achats',     path:'/dashboard/achats',     key:'achats'     },
    { label:'Stock',      path:'/dashboard/stock',      key:'stocks'     },
    { label:'Production', path:'/dashboard/production', key:'production' },
  ].filter(item => isAdmin || access[item.key]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="logo-container">
         <img src={logoImage} alt="Thermivent" className="logo-image" />

      </div>

      <ul className="sidebar-menu">

        {/* Dashboards accordéon */}
        {dashItems.length > 0 && (
          <li
            className={dashItems.some(i => isActive(i.path)) ? 'active' : ''}
            onClick={() => setDashOpen(o => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboards
            <svg className={`arrow-icon ${dashOpen ? 'rotated' : ''}`}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </li>
        )}

        <ul className={`sub-menu ${dashOpen ? 'open' : ''}`}>
          {dashItems.map(item => (
            <li key={item.path}
              className={isActive(item.path) ? 'active' : ''}
              onClick={() => navigate(item.path)}>
              {item.label}
            </li>
          ))}
        </ul>

        {/* Rapports */}
        <li className={isActive('/rapports') ? 'active' : ''}
          onClick={() => navigate('/rapports')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Rapports
        </li>

        

        {/* Utilisateurs — Admin seulement */}
        {isAdmin && (
          <li className={isActive('/utilisateurs') ? 'active' : ''}
            onClick={() => navigate('/utilisateurs')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Gestion des utilisateurs
          </li>
        )}

      </ul>

      {/* ── Profil + Déconnexion ── */}
      <div style={{
        padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:'auto'
      }}>
        {/* Clic sur le profil → page profil */}
        <div
          onClick={() => navigate('/profil')}
          style={{
            display:'flex', alignItems:'center', gap:'10px',
            marginBottom:'12px', cursor:'pointer', padding:'8px 10px',
            borderRadius:'10px',
            background: isActive('/profil') ? 'rgba(255,255,255,0.08)' : 'transparent',
            transition:'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = isActive('/profil') ? 'rgba(255,255,255,0.08)' : 'transparent'}
        >
          {user?.photo
            ? <img src={user.photo} alt="" style={{
                width:'34px', height:'34px', borderRadius:'50%',
                objectFit:'cover', flexShrink:0
              }} />
            : <div style={{
                width:'34px', height:'34px', borderRadius:'50%',
                background:'linear-gradient(135deg, #0e1930, #2563EB)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontWeight:'700', fontSize:'13px', flexShrink:0
              }}>
                {(user?.name || 'U').substring(0, 2).toUpperCase()}
              </div>
          }
          <div style={{ overflow:'hidden' }}>
            <p style={{ margin:0, color:'white', fontSize:'13px', fontWeight:'600',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user?.name || 'Utilisateur'}
            </p>
            <span style={{ color:'#64748B', fontSize:'11px' }}>{user?.role || ''}</span>
          </div>
          {/* Icône profil */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#64748B" strokeWidth="2" style={{ marginLeft:'auto', flexShrink:0 }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>

        {/* Bouton déconnexion */}
        <button onClick={handleLogout} style={{
          width:'100%', padding:'10px', borderRadius:'10px',
          background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
          color:'#F87171', fontWeight:'600', fontSize:'13px',
          cursor:'pointer', display:'flex', alignItems:'center',
          justifyContent:'center', gap:'8px', transition:'background 0.2s', fontFamily:'inherit',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>

    </div>
  );
};

export default Sidebar;