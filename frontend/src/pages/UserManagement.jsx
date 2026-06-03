// src/pages/UserManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api/userApi';
import Sidebar from '../components/Sidebar';
import FilterDrawer from '../components/FilterDrawer';
import Chatbot from '../components/Chatbot';
import TopNavbar from '../components/TopNavbar';
import '../styles/Web.css';
import '../styles/UserManagement.css';

const ModalErreur = ({ message, onClose }) => (
  <div className="um-overlay" onClick={onClose}>
    <div className="um-modal" onClick={e => e.stopPropagation()}>
      <div className="um-modal-icon um-erreur-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h3 className="um-modal-title">Erreur</h3>
      <p className="um-modal-msg">{message}</p>
      <button className="um-modal-btn um-erreur-btn" onClick={onClose}>Fermer</button>
    </div>
  </div>
);

const ModalSucces = ({ message, onClose }) => (
  <div className="um-overlay" onClick={onClose}>
    <div className="um-modal" onClick={e => e.stopPropagation()}>
      <div className="um-modal-icon um-succes-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h3 className="um-modal-title">Succès !</h3>
      <p className="um-modal-msg">{message}</p>
      <button className="um-modal-btn um-succes-btn" onClick={onClose}>OK</button>
    </div>
  </div>
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [erreurMsg, setErreurMsg] = useState('');
  const [succesMsg, setSuccesMsg] = useState('');

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    phone: '',
    role: 'Employé',
    motDePasse: '', 
    confirmerMotDePasse: '', 
    photo: '',
    access: { ventes: false, achats: false, stocks: false, production: false }
  });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) { 
      console.error('Erreur chargement:', err); 
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = search === '' ||
      (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase());

    const matchRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);
    
    const matchAccess = selectedAccess.length === 0 || selectedAccess.some(acc => 
      user.access && user.access[acc.toLowerCase()] === true);

    return matchSearch && matchRole && matchAccess;
  });

  const stats = useMemo(() => ({
    total: users.length,
    avecAcces: users.filter(u => u.access && Object.values(u.access).some(v => v === true)).length,
    sansAcces: users.filter(u => !u.access || Object.values(u.access).every(v => v === false)).length,
  }), [users]);

  const getPwdStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Trop court', color: '#EF4444', width: '30%' };
    if (pwd.length < 8) return { label: 'Faible', color: '#F59E0B', width: '50%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return { label: 'Fort', color: '#10B981', width: '100%' };
    return { label: 'Moyen', color: '#3B82F6', width: '75%' };
  };

  const strength = getPwdStrength(formData.motDePasse);

  const getAvatarStyle = (name) => {
    const c = ((name || '').trim()[0] || 'U');
    const colors = [
      { bg: '#F59E0B', color: '#FFF' }, 
      { bg: '#8B5CF6', color: '#FFF' },
      { bg: '#3B82F6', color: '#FFF' }, 
      { bg: '#10B981', color: '#FFF' },
    ];
    const theme = colors[c.charCodeAt(0) % colors.length];
    return {
      width: '36px', height: '36px', borderRadius: '50%',
      background: theme.bg, color: theme.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 'bold', fontSize: '14px'
    };
  };

  const handleExportExcel = () => {
    const csv = "data:text/csv;charset=utf-8,NOM,EMAIL,TÉLÉPHONE,RÔLE\n" +
      filteredUsers.map(e => `${e.name||''},${e.email||''},${e.phone||''},${e.role||''}`).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'utilisateurs.csv');
    document.body.appendChild(link); 
    link.click(); 
    link.remove();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(f => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name.trim()) {
      setErreurMsg('Le nom est obligatoire.'); return;
    }
    if (formData.name.trim().length < 2) {
      setErreurMsg('Le nom doit contenir au moins 2 caractères.'); return;
    }
    if (/\d/.test(formData.name)) {
      setErreurMsg('Le nom ne doit pas contenir de chiffres.'); return;
    }

    if (!formData.email.trim()) {
      setErreurMsg("L'email est obligatoire."); return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@thermivent\.com$/i;
    if (!emailRegex.test(formData.email.trim())) {
      setErreurMsg("L'email doit être une adresse @thermivent.com"); return;
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^\+216[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        setErreurMsg('Le numéro doit être au format : +216XXXXXXXX'); return;
      }
    }

    if (!currentUser) {
      if (!formData.motDePasse) {
        setErreurMsg('Le mot de passe est obligatoire.'); return;
      }
      if (formData.motDePasse.length < 6) {
        setErreurMsg('Le mot de passe doit contenir au moins 6 caractères.'); return;
      }
      if (formData.motDePasse !== formData.confirmerMotDePasse) {
        setErreurMsg('Les mots de passe ne correspondent pas.'); return;
      }
    } else if (formData.motDePasse) {
      if (formData.motDePasse.length < 6) {
        setErreurMsg('Le mot de passe doit contenir au moins 6 caractères.'); return;
      }
      if (formData.motDePasse !== formData.confirmerMotDePasse) {
        setErreurMsg('Les mots de passe ne correspondent pas.'); return;
      }
    }

    const { confirmerMotDePasse, ...dataToSend } = formData;
    if (!dataToSend.motDePasse) delete dataToSend.motDePasse;

    try {
      if (currentUser) {
        await updateUser(currentUser._id, dataToSend);
        setSuccesMsg('Utilisateur mis à jour avec succès !');
      } else {
        await createUser(dataToSend);
        setSuccesMsg(`Compte créé pour "${formData.name}".`);
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setErreurMsg(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(currentUser._id);
      setShowDeleteModal(false);
      loadUsers();
      setSuccesMsg('Utilisateur supprimé avec succès.');
    } catch (err) {
      setShowDeleteModal(false);
      setErreurMsg(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({ 
      ...user, 
      motDePasse: '', 
      confirmerMotDePasse: '' 
    });
    setShowPwd(false); 
    setShowConfirm(false);
    setShowModal(true);
  };

  const openAddModal = () => {
    setCurrentUser(null);
    setFormData({
      name: '', 
      email: '', 
      phone: '',
      role: 'Employé',
      motDePasse: '', 
      confirmerMotDePasse: '', 
      photo: '',
      access: { ventes: false, achats: false, stocks: false, production: false }
    });
    setShowPwd(false); 
    setShowConfirm(false);
    setShowModal(true);
  };

  const Icons = {
    Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    Excel: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    ArrowUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>,
    Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    UserTie: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    EyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  };

  const IS = { width: '100%', padding: '13px 16px', fontSize: '15px', border: '1.5px solid #E2E8F0', borderRadius: '12px', outline: 'none', background: '#FAFBFC' };
  const LS = { display: 'block', fontWeight: '600', color: '#0F2038', marginBottom: '7px', fontSize: '14px' };

  const pwdWrap = { position: 'relative', display: 'flex', alignItems: 'center' };
  const eyeBtn = { position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Chatbot sessionId="admin-user-management" />

      <div className="main-content">
        <TopNavbar showSearch searchValue={search} onSearch={setSearch} searchPlaceholder="Rechercher un utilisateur..." />

        <div className="page-container">
          <div className="page-header">
            <h1>Gestion des utilisateurs</h1>
            <p>Gérez les accès et permissions des utilisateurs de la plateforme.</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Total Utilisateurs</p>
                <h2 className="stat-value">{stats.total}</h2>
              </div>
              <div className="stat-icon"><Icons.Users /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Avec accès dashboards</p>
                <h2 className="stat-value">{stats.avecAcces}</h2>
              </div>
              <div className="stat-icon"><Icons.Shield /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-title">Sans accès</p>
                <h2 className="stat-value">{stats.sansAcces}</h2>
              </div>
              <div className="stat-icon"><Icons.UserTie /></div>
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button onClick={openAddModal} className="btn-primary">
              <Icons.Plus /> Ajouter utilisateur
            </button>
            <button onClick={handleExportExcel} className="btn-secondary">
              <Icons.Excel /> Exporter Excel
            </button>
            <button onClick={() => setShowFilterBar(true)} className="btn-secondary">
              <Icons.Filter /> Filtrer
            </button>
          </div>

          {/* Tableau */}
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
                                  {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      {user.photo ? (
                        <img src={user.photo} alt="photo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={getAvatarStyle(user.name)}>
                          {(user.name || '??').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td><strong>{user.name || '-'}</strong></td>
                    <td>{user.email || '-'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`badge role-badge ${user.role === 'Admin' ? 'admin' : 'employe'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {Object.keys(user.access || {}).map(acc =>
                        user.access[acc] ? (
                          <span key={acc} className={`badge access-badge ${acc}`}>
                            {acc.charAt(0).toUpperCase() + acc.slice(1)}
                          </span>
                        ) : null
                      )}
                    </td>
                    <td>
                      {/* Masquer les boutons pour tous les Admins */}
                      {user.email !== 'leila.makni@thermivent.com' && (
                        <>
                          <button className="action-btn" onClick={() => openEditModal(user)}>
                            <Icons.Edit />
                          </button>
                          <button 
                            className="action-btn" 
                            onClick={() => { 
                              setCurrentUser(user); 
                              setShowDeleteModal(true); 
                            }}
                          >
                            <Icons.Trash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Formulaire */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              width: '560px', maxWidth: '95%', maxHeight: '92vh', overflowY: 'auto',
              background: 'white', borderRadius: '24px', boxShadow: '0 35px 80px -20px rgba(15,32,56,0.3)',
              padding: '40px 38px'
            }}>
              <h2 style={{ margin: '0 0 28px', color: '#0F2038', fontSize: '23px', fontWeight: '700', textAlign: 'center' }}>
                {currentUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
              </h2>

              <form onSubmit={handleSaveUser} noValidate>
                {/* Photo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    {formData.photo ? (
                      <img src={formData.photo} alt="photo" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #F1F5F9' }} />
                    ) : (
                      <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #F1F5F9', fontSize: '40px' }}>👤</div>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ marginTop: '10px', fontSize: '13px', color: '#64748B' }} />
                  </div>
                </div>

                {/* Nom */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={LS}>Nom complet <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" style={IS} value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
                </div>

                {/* Email + Téléphone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                  <div>
                    <label style={LS}>Email <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="email" style={IS} placeholder="prenom.nom@thermivent.com" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={LS}>Téléphone</label>
                    <input type="text" style={IS} placeholder="+21612345678" maxLength={12} value={formData.phone} onChange={e => {
                      let val = e.target.value;
                      if (val && !val.startsWith('+')) val = '+216' + val.replace(/\D/g, '');
                      setFormData(f => ({ ...f, phone: val }));
                    }} />
                  </div>
                </div>

                {/* Rôle */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={LS}>Rôle <span style={{ color: '#EF4444' }}>*</span></label>
                  <select
                    style={IS}
                    value={formData.role}
                    onChange={e => setFormData(f => ({ ...f, role: e.target.value }))}
                  >
                    <option value="Employé">Employé</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Mot de passe + Confirmation */}
                {/* ... (le reste du code mot de passe reste identique) */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={LS}>
                    Mot de passe {!currentUser && <span style={{ color: '#EF4444' }}>*</span>}
                    {currentUser && <span style={{ color: '#94A3B8', fontSize: '12px', marginLeft: '6px' }}>(vide = inchangé)</span>}
                  </label>
                  <div style={pwdWrap}>
                    <input type={showPwd ? 'text' : 'password'} style={{ ...IS, paddingRight: '44px' }} placeholder={currentUser ? '••••••••' : 'Minimum 6 caractères'} value={formData.motDePasse} onChange={e => setFormData(f => ({ ...f, motDePasse: e.target.value }))} />
                    <button type="button" style={eyeBtn} onClick={() => setShowPwd(v => !v)}>
                      {showPwd ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                  {formData.motDePasse && strength && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {(formData.motDePasse || !currentUser) && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={LS}>Confirmer le mot de passe {!currentUser && <span style={{ color: '#EF4444' }}>*</span>}</label>
                    <div style={pwdWrap}>
                      <input type={showConfirm ? 'text' : 'password'} style={{ ...IS, paddingRight: '44px', borderColor: formData.confirmerMotDePasse ? (formData.confirmerMotDePasse === formData.motDePasse ? '#10B981' : '#EF4444') : '#E2E8F0' }} placeholder="Répétez le mot de passe" value={formData.confirmerMotDePasse} onChange={e => setFormData(f => ({ ...f, confirmerMotDePasse: e.target.value }))} />
                      <button type="button" style={eyeBtn} onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Accès dashboards */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={LS}>Accès aux dashboards</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['ventes', 'achats', 'stocks', 'production'].map(acc => {
                      const bg = { ventes: '#D1FAE5', achats: '#DBEAFE', stocks: '#FFEDD5', production: '#F3E8FF' };
                      const checked = formData.access[acc];
                      return (
                        <label key={acc} style={{
                          background: checked ? bg[acc] : '#F8FAFC',
                          padding: '12px 16px', borderRadius: '12px', display: 'flex',
                          alignItems: 'center', gap: '10px', cursor: 'pointer',
                          border: `1.5px solid ${checked ? '#CBD5E1' : '#E2E8F0'}`
                        }}>
                          <input type="checkbox" checked={checked} onChange={e => setFormData(f => ({ ...f, access: { ...f.access, [acc]: e.target.checked } }))} />
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>{acc.charAt(0).toUpperCase() + acc.slice(1)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'white', fontWeight: '600' }}>Annuler</button>
                  <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#0F2038', color: 'white', fontWeight: '600' }}>
                    {currentUser ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modales */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#EF4444', marginTop: 0 }}>Confirmer la suppression</h2>
              <p>Êtes-vous sûr de vouloir supprimer <strong>{currentUser?.name}</strong> ?</p>
              <p style={{ color: '#828282', fontSize: '14px' }}>Cette action est irréversible.</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                <button className="btn-primary" style={{ backgroundColor: '#EF4444' }} onClick={confirmDelete}>Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {erreurMsg && <ModalErreur message={erreurMsg} onClose={() => setErreurMsg('')} />}
        {succesMsg && <ModalSucces message={succesMsg} onClose={() => setSuccesMsg('')} />}

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