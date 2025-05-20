import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import FileHandler from './pages/FileHandler';
import CountdownTimer from './components/CountdownTimer';
import { getDeviceId, checkDeviceAvailability, linkDeviceToUser, updateDeviceLastActive } from './services/deviceService';
import './styles/CountdownTimer.css';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDevice = async () => {
      try {
        const id = await getDeviceId();
        setDeviceId(id);
      } catch (error) {
        console.error('Error getting device ID:', error);
        setError('Failed to initialize device');
      }
    };

    initializeDevice();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Kiểm tra xem thiết bị đã được liên kết với tài khoản khác chưa
          await checkDeviceAvailability(deviceId);
          // Liên kết thiết bị với tài khoản
          await linkDeviceToUser(deviceId, user.uid);
          setUser(user);
        } catch (error) {
          console.error('Device check failed:', error);
          setError(error.message);
          // Đăng xuất nếu thiết bị đã được liên kết với tài khoản khác
          await handleLogout();
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, deviceId]);

  // Cập nhật thời gian hoạt động cuối cùng mỗi 5 phút
  useEffect(() => {
    if (deviceId && user) {
      const interval = setInterval(async () => {
        try {
          await updateDeviceLastActive(deviceId);
        } catch (error) {
          console.error('Error updating device activity:', error);
        }
      }, 5 * 60 * 1000); // 5 phút

      return () => clearInterval(interval);
    }
  }, [deviceId, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  const handleSwitchAccount = () => {
    handleLogout();
  };

  // Tính toán thời gian đích (ví dụ: 24 giờ từ thời điểm hiện tại)
  const targetTime = new Date();
  targetTime.setHours(targetTime.getHours() + 24);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleLogout} className="btn-logout">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div className="user-info">
          {user && (
            <>
              <img src={user.photoURL || '/default-avatar.png'} alt="Profile" className="avatar" />
              <div className="user-details">
                <h3>{user.displayName || 'User'}</h3>
                <p>{user.email}</p>
              </div>
            </>
          )}
        </div>
        <div className="header-actions">
          <button onClick={handleSwitchAccount} className="btn-switch">
            Switch Account
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="countdown-container">
          <h2>Next Reward Available In:</h2>
          <CountdownTimer targetTime={targetTime} />
        </div>
        <Routes>
          <Route path="/open-file" element={<FileHandler />} />
          {/* ... existing routes ... */}
        </Routes>
      </div>
    </div>
  );
}

// Wrap App with Router
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter; 