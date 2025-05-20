import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
// Placeholder components for new pages
const Mining = () => <div style={{color:'#fff',textAlign:'center',marginTop:'2rem'}}>Tính năng Bắt đầu sẽ sớm có!</div>;
const Referrals = () => <div style={{color:'#fff',textAlign:'center',marginTop:'2rem'}}>Tính năng Referrals sẽ sớm có!</div>;
const Profile = () => <div style={{color:'#fff',textAlign:'center',marginTop:'2rem'}}>Tính năng Profile sẽ sớm có!</div>;

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/mining" element={<RequireAuth><Mining /></RequireAuth>} />
          <Route path="/referrals" element={<RequireAuth><Referrals /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 