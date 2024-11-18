import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/API.mjs';


export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if(!storedUser){
      const fetchUser = async () => {
        try {
          const fetchedUser = await API.getUser()
          setUser(fetchedUser.user);
          localStorage.setItem('user', JSON.stringify(fetchedUser.user));
        } catch {
          setUser(null);
          localStorage.removeItem('user');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }

    
  }, []);

  const login = async (username, password) => {
    try {
      const loggedInUser = await API.login(username, password);
      setUser(loggedInUser.user);
      localStorage.setItem('user', JSON.stringify(loggedInUser.user));
    } catch (error) {
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
    } catch(error){
      throw error;
    }
  }


  return (
    <AuthContext.Provider value={{ user, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
