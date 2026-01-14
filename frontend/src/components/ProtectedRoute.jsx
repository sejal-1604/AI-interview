import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  console.log('ProtectedRoute - Token exists:', !!token);
  console.log('ProtectedRoute - Token value:', token);
  
  if (!token) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

export default ProtectedRoute;