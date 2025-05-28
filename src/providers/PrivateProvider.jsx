import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './Authprovider';

const PrivateProvider = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateProvider;