// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import SalesDashboard from './pages/SalesDashboard';
import PurchasesDashboard from './pages/PurchasesDashboard';
import StockDashboard from './pages/StockDashboard';
import ProductionDashboard from './pages/ProductionDashboard';
import UserManagement from './pages/UserManagement';


const RouteProtegee = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={<RouteProtegee><SalesDashboard /></RouteProtegee>}   // tu peux choisir la page par défaut
        />
        <Route
          path="/ventes"
          element={<RouteProtegee><SalesDashboard /></RouteProtegee>}
        />
        <Route
          path="/achats"
          element={<RouteProtegee><PurchasesDashboard /></RouteProtegee>}
        />
        <Route
          path="/stock"
          element={<RouteProtegee><StockDashboard /></RouteProtegee>}
        />
        <Route
          path="/production"
          element={<RouteProtegee><ProductionDashboard /></RouteProtegee>}
        />
        <Route
          path="/users"
          element={<RouteProtegee><UserManagement /></RouteProtegee>}
        />
        
    
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;