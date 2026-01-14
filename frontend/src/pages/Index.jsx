import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/'); // Navigate to landing page after logout
  };

  // Listen for navigation changes to update login state
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <Landing />;
};

export default Index;