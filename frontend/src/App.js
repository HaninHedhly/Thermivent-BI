import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login               from './pages/Login';
import UserManagement      from './pages/UserManagement';
import SalesDashboard      from './pages/SalesDashboard';
import PurchasesDashboard  from './pages/PurchasesDashboard';
import StockDashboard      from './pages/StockDashboard';
import ProductionDashboard from './pages/ProductionDashboard';
import Rapports            from './pages/Rapports';
import Profile             from './pages/Profile';
import './App.css';


const getUser  = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
const getToken = () => localStorage.getItem('token');

const RoutePrivee = ({ children }) =>
  getToken() ? children : <Navigate to="/login" replace />;

const RouteAdmin = ({ children }) => {
  const user = getUser();
  if (!getToken())            return <Navigate to="/login"           replace />;
  if (user?.role !== 'Admin') return <Navigate to="/dashboard/ventes" replace />;
  return children;
};

const RouteDashboard = ({ children, cle }) => {
  const user = getUser();
  if (!getToken())            return <Navigate to="/login"        replace />;
  if (user?.role === 'Admin') return children;
  if (user?.access?.[cle])   return children;
  return <Navigate to="/acces-refuse" replace />;
};

const AccesRefuse = () => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', background:'#F8FAFC', gap:'16px' }}>
    <div style={{ fontSize:'64px' }}>🔒</div>
    <h1 style={{ color:'#0F2038', margin:0 }}>Accès refusé</h1>
    <p style={{ color:'#64748B' }}>Vous n'avez pas les permissions pour accéder à cette page.</p>
    <button onClick={() => window.history.back()} style={{
      padding:'12px 28px', borderRadius:'10px', background:'#0F2038',
      color:'white', border:'none', fontWeight:'600', cursor:'pointer'
    }}>Retour</button>
  </div>
);

const DefaultRedirect = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Admin') return <Navigate to="/dashboard/ventes" replace />;
  const ordre = ['ventes','achats','stocks','production'];
  const premier = ordre.find(k => user.access?.[k]);
  if (premier) return <Navigate to={`/dashboard/${premier}`} replace />;
  return <Navigate to="/rapports" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"             element={<Navigate to="/login" replace />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/acces-refuse" element={<AccesRefuse />} />
        <Route path="/dashboard"    element={<RoutePrivee><DefaultRedirect /></RoutePrivee>} />

        <Route path="/dashboard/ventes"
          element={<RouteDashboard cle="ventes"><SalesDashboard /></RouteDashboard>} />
        <Route path="/dashboard/achats"
          element={<RouteDashboard cle="achats"><PurchasesDashboard /></RouteDashboard>} />
        <Route path="/dashboard/stock"
          element={<RouteDashboard cle="stocks"><StockDashboard /></RouteDashboard>} />
        <Route path="/dashboard/production"
          element={<RouteDashboard cle="production"><ProductionDashboard /></RouteDashboard>} />

        <Route path="/rapports"     element={<RoutePrivee><Rapports /></RoutePrivee>} />

        {/* ← Nouvelle route profil */}
        <Route path="/profil"       element={<RoutePrivee><Profile /></RoutePrivee>} />

        <Route path="/utilisateurs" element={<RouteAdmin><UserManagement /></RouteAdmin>} />
        <Route path="*"             element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;