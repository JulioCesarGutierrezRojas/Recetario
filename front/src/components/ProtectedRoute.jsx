import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not in the allowed roles, redirect to home or show access denied
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  // If the user has the required role, render the component
  return element;
};

export default ProtectedRoute;