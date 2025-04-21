import React from 'react';
import { Navigate } from 'react-router';

const PublicRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  // If user is logged in, redirect to home page
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // If user is not logged in, render the public component
  return element;
};

export default PublicRoute;