import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {

    const loadUser = async () => {

      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {

        const res = await api.get('/auth/me');

        setUser(res.data);
        setToken(storedToken);

      } catch (error) {

        console.log("Auth error:", error);

        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    };

    loadUser();

  }, []);

  // LOGIN
  const login = async (email, password) => {

    try {

      const res = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);

      setToken(token);
      setUser(user);

      return { success: true };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.msg || "Login failed. Try again."
      };
    }
  };

  // REGISTER
  const register = async (name, email, password, role) => {

    try {

      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);

      setToken(token);
      setUser(user);

      return { success: true };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.msg || "Registration failed."
      };
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token');

    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};