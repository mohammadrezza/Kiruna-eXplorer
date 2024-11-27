import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '@/services/API.mjs';
import Cookies from 'js-cookie'; // Importa la libreria js-cookie

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(Cookies.get('user') || 'null'); // Legge il valore dal cookie
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!storedUser) {
      const fetchUser = async () => {
        try {
          const fetchedUser = await API.getUser();
          setUser(fetchedUser.user);
          Cookies.set('user', JSON.stringify(fetchedUser.user), { expires: 7 }); // Salva il cookie con scadenza di 7 giorni
        } catch {
          setUser(null);
          Cookies.remove('user'); // Rimuove il cookie se c'è un errore
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [storedUser]);

  const login = async (username, password) => {
    try {
      const loggedInUser = await API.login(username, password);
      setUser(loggedInUser.user);
      Cookies.set('user', JSON.stringify(loggedInUser.user), { expires: 7 }); // Salva il cookie con scadenza di 7 giorni
    } catch (error) {
      Cookies.remove('user'); // Rimuove il cookie in caso di errore
      throw error;
    }
  };

  const logout = async () => {
    try {
      Cookies.remove('user'); // Rimuove il cookie
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
