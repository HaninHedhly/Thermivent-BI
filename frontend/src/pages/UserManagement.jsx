import React, { useState, useEffect, useMemo } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api/userApi';
import Sidebar from '../components/Sidebar';
import FilterDrawer from '../components/FilterDrawer'; // <-- Added import for your new professional filter
import '../styles/Web.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  
  // 1. Added Filter States
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState([]);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: 'Employé', photo: '',
    access: { ventes: false, achats: false, stocks: false, production: false }
  });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };

  // 2. Master Filtering Logic (Replaces the old filteredUsers state)
  const filteredUsers = users.filter(user => {
    // Search match
    const matchSearch = search === '' || 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase());
      
    // Role match
    const matchRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);
    
    // Access match (Adapted to check your specific {ventes: true/false} object structure)
    const matchAccess = selectedAccess.length === 0 || selectedAccess.some(acc => {
      const key = acc.toLowerCase();
      return user.access && user.access[key] === true;
    });
    
    return matchSearch && matchRole && matchAccess;
  });

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'Admin').length,
      managers: users.filter(u => u.role === 'Manager').length,
      employes: users.filter(u => u.role === 'Employé').length,
    };
  }, [users]);

  // Fonction pour donner une couleur aléatoire aux initiales comme dans la photo 1
  const getAvatarStyle = (name) => {
    const colors = [
      { bg: '#F59E0B', color: '#FFF' }, // Jaune
      { bg: '#8B5CF6', color: '#FFF' }, // Violet
      { bg: '#3B82F6', color: '#FFF' }, // Bleu
      { bg: '#10B981', color: '#FFF' }, // Vert
    ];
    const charCode = name.charCodeAt(0) || 0;
    const theme = colors[charCode % colors.length];
    return {
      width: '36px', height: '36px', borderRadius: '50%',
      background: theme.bg, color: theme.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 'bold', fontSize: '14px'
    };
  };

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8,NOM,EMAIL,TÉLÉPHONE,RÔLE\n" + filteredUsers.map(e => `${e.name},${e.email},${e.phone},${e.role}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "utilisateurs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => { setFormData({ ...formData, photo: reader.result }); };
    if (file) reader.readAsDataURL(file);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) await updateUser(currentUser._id, formData);
      else await createUser(formData);
      setShowModal(false);
      loadUsers();
    } catch (error) {
      alert("Erreur: " + (error.response?.data?.message || "Erreur lors de l'enregistrement"));
    }
  };

  const openEditModal = (user) => { setCurrentUser(user); setFormData(user); setShowModal(true); };
  const openAddModal = () => { setCurrentUser(null); setFormData({ name: '', email: '', phone: '', role: 'Employé', photo: '', access: { ventes: false, achats: false, stocks: false, production: false } }); setShowModal(true); };
  const confirmDelete = async () => { await deleteUser(currentUser._id); setShowDeleteModal(false); loadUsers(); };

  // SVG Icons
  const Icons = {
    Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    Excel: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    ArrowUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"></polyline></svg>,
    ArrowDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    Briefcase: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    UserTie: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        
        {/* TOP NAVBAR */}
        <div className="top-navbar">
          <div className="search-container">
            <Icons.Search />
            <input type="text" placeholder="Rechercher un utilisateur..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          
          <div className="top-right">
            <div className="bell-icon"><Icons.Bell /></div>
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=FDBA74&color=fff" alt="User" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              <div className="user-info">
                <p>Admin User</p>
                <span>admin@company.tn</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="page-container">
          <div className="page-header">
            <h1>Gestion des utilisateurs</h1>
            <p>Gérez les accès et permissions des utilisateurs de la plateforme.</p>
          </div>

          {/* STATS CARDS MATCHING PHOTO 1 */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Total Utilisateurs</p>
                <h2 className="stat-value">{stats.total}</h2>
                <span className="stat-trend trend-up"><Icons.ArrowUp /> +12%</span>
              </div>
              <div className="stat-icon icon-blue"><Icons.Users /></div>
            </div>
            
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Admins</p>
                <h2 className="stat-value">{stats.admins}</h2>
                <span className="stat-trend trend-up"><Icons.ArrowUp /> +8%</span>
              </div>
              <div className="stat-icon icon-purple"><Icons.Shield /></div>
            </div>
            
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Managers</p>
                <h2 className="stat-value">{stats.managers}</h2>
                <span className="stat-trend trend-down"><Icons.ArrowDown /> -3%</span>
              </div>
              <div className="stat-icon icon-blue"><Icons.Briefcase /></div>
            </div>
            
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Employés</p>
                <h2 className="stat-value">{stats.employes}</h2>
                <span className="stat-trend trend-up"><Icons.ArrowUp /> +15%</span>
              </div>
              <div className="stat-icon icon-gray"><Icons.UserTie /></div>
            </div>
          </div>

          {/* ACTION ROW */}
          <div className="actions-row">
            <button className="btn-primary" onClick={openAddModal}>
              <Icons.Plus /> Ajouter utilisateur
            </button>
            <button className="btn-secondary" onClick={handleExportExcel}>
              <Icons.Excel /> Exporter Excel
            </button>
            <button className="btn-secondary" onClick={() => setShowFilterBar(true)}>
              <Icons.Filter /> Filtrer
            </button>
          </div>

          {/* TABLE */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>PHOTO</th>
                  <th>NOM</th>
                  <th>EMAIL</th>
                  <th>TÉLÉPHONE</th>
                  <th>RÔLE</th>
                  <th>ACCÈS DASHBOARDS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      {user.photo ? <img src={user.photo} alt="profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /> : 
                      <div style={getAvatarStyle(user.name)}>
                        {user.name.substring(0,2).toUpperCase()}
                      </div>}
                    </td>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td><span className={`badge role-${user.role}`}>{user.role}</span></td>
                    <td>
                      {Object.keys(user.access).map(acc => user.access[acc] ? (
                        <span key={acc} className={`badge access-badge ${acc}`}>{acc.charAt(0).toUpperCase() + acc.slice(1)}</span>
                      ) : null)}
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => openEditModal(user)}><Icons.Edit /></button>
                      <button className="action-btn" onClick={() => { setCurrentUser(user); setShowDeleteModal(true); }}><Icons.Trash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* MODAL: ADD / EDIT */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: '#0F2038' }}>{currentUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>
              <form onSubmit={handleSaveUser}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {formData.photo ? <img src={formData.photo} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} /> :
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F4F7FA' }}></div>}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                <div className="form-group"><label>Nom complet</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Email</label><input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Téléphone</label><input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
                </div>
                <div className="form-group">
                  <label>Rôle</label>
                  <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employé">Employé</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Accès aux dashboards</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['ventes', 'achats', 'stocks', 'production'].map(acc => (
                      <label key={acc} style={{ background: '#F4F7FA', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input type="checkbox" checked={formData.access[acc]} onChange={e => setFormData({...formData, access: {...formData.access, [acc]: e.target.checked}})} />
                        {acc.charAt(0).toUpperCase() + acc.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{currentUser ? 'Mettre à jour' : 'Enregistrer'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#EF4444', marginTop: 0 }}>Confirmer la suppression</h2>
              <p>Êtes-vous sûr de vouloir supprimer <strong>{currentUser?.name}</strong> ?</p>
              <p style={{ color: '#828282', fontSize: '14px' }}>Cette action est irréversible et supprimera toutes les données associées à cet utilisateur.</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDeleteModal(false)}>Annuler</button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', backgroundColor: '#EF4444' }} onClick={confirmDelete}>Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Filter Drawer Component */}
        {showFilterBar && (
          <FilterDrawer 
            onClose={() => setShowFilterBar(false)} 
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            selectedAccess={selectedAccess}
            setSelectedAccess={setSelectedAccess}
          />
        )}

      </div>
    </div>
  );
};

export default UserManagement;