import React from 'react';
import UserManagement from './pages/UserManagement';
import './styles/Web.css'; // Importing the global styles we just created

function App() {
  return (
    <div className="App">
      {/* Rendering the User Management page as the main view */}
      <UserManagement />
    </div>
  );
}

export default App;