// components/common/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType }) => {
  const isAuthenticated = localStorage.getItem('token');
  const currentUserType = localStorage.getItem('userType');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userType && userType !== currentUserType) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;