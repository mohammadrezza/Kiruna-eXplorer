import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/layouts/AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  return user ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // children deve essere un nodo React
};

export default PrivateRoute;
