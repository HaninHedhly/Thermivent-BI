import React, { useState, useEffect } from 'react';

const TopNavbar = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = userData.role === 'Admin';
  const [notifications, setNotifications] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  // 1. Récupérer les notifications
  const fetchNotifs = async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch('http://localhost:5000/api/notifications'); // Ajustez l'URL
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Erreur chargement notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Check toutes les 30s
    return () => clearInterval(interval);
  }, [isAdmin]);

  // 2. Marquer une notification comme lue
  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (res.ok) {
        // On retire localement la notification de la liste
        setNotifications(notifications.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error("Erreur marquage lu:", err);
    }
  };

  return (
    <div className="top-navbar">
      <div className="search-container">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Rechercher..." className="search-input" />
      </div>

      <div className="top-right" style={{ display: 'flex', alignItems: 'center' }}>
        
        {/* LA CLOCHE : Admin Uniquement */}
        {isAdmin && (
          <div className="bell-container" style={{ position: 'relative', marginRight: '25px' }}>
            <div 
              onClick={() => setShowMenu(!showMenu)} 
              style={{ cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              
              {notifications.length > 0 && (
                <span style={{ 
                  position: 'absolute', top: '-2px', right: '-2px', 
                  background: '#EF4444', color: 'white', borderRadius: '50%', 
                  padding: '2px 6px', fontSize: '10px', fontWeight: 'bold',
                  border: '2px solid white'
                }}>
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Menu déroulant des notifications */}
            {showMenu && (
              <>
                {/* Overlay invisible pour fermer le menu en cliquant ailleurs */}
                <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                    onClick={() => setShowMenu(false)} 
                />
                
                <div style={{ 
                  position: 'absolute', top: '45px', right: '0', 
                  width: '320px', background: 'white', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)', 
                  borderRadius: '12px', zIndex: 100, 
                  overflow: 'hidden', border: '1px solid #E2E8F0'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0, color: '#0F2038', fontSize: '15px' }}>Alertes Utilisateurs</h5>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{notifications.length} nouvelles</span>
                  </div>

                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                        Aucun nouveau message
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          style={{ 
                            padding: '12px 15px', borderBottom: '1px solid #F8FAFC', 
                            transition: 'background 0.2s', cursor: 'pointer',
                            position: 'relative'
                          }}
                          className="notification-item"
                          onClick={() => handleMarkAsRead(n._id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', fontSize: '13px', color: '#1E293B' }}>{n.senderName}</span>
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>{n.message}</p>
                          <div style={{ fontSize: '10px', marginTop: '5px', color: '#3B82F6', fontWeight: '500' }}>
                            Cliquez pour marquer comme lu
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* PROFIL UTILISATEUR */}
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={userData.photo || `https://ui-avatars.com/api/?name=${userData.name}&background=FDBA74&color=fff`} 
            alt="User" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0F2038' }}>{userData.name}</p>
            <span style={{ fontSize: '12px', color: '#64748B' }}>{userData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;