import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/API';


export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!storedUser){
      const fetchUser = async () => {
        try {
          const fetchedUser = await API.getUser()
          setUser(fetchedUser);
          localStorage.setItem('user', fetchedUser);
        } catch {
          setUser(null);
          localStorage.setItem('user', null);
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
      setUser(loggedInUser);
      localStorage.setItem('user', loggedInUser);
    } catch (error) {
      localStorage.setItem('user', null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.clear()
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
