import React, { createContext, useState, useContext } from 'react';
import API from '@/services/API.mjs';
import Cookies from 'js-cookie'; // Importa la libreria js-cookie
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(Cookies.get('user') || 'null'); // Legge il valore dal cookie
  const [user, setUser] = useState(storedUser);
  const isAuthenticated = !!user;
  const login = async (username, password) => {
    try {
      const loggedInUser = await API.login(username, password);
      setUser(loggedInUser.user);
      Cookies.set('user', JSON.stringify(loggedInUser.user), { expires: 0.5 }); // Salva il cookie con scadenza di 7 giorni
    } catch (error) {
      Cookies.remove('user'); // Rimuove il cookie in caso di errore
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('logout')
      API.logout()
      Cookies.remove('user'); // Rimuove il cookie
      navigate('/')
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // children deve essere un nodo React
};
