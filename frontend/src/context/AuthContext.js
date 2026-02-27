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

        // ✅ Keep user in localStorage also
        localStorage.setItem("user", JSON.stringify(res.data));

      } catch (error) {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    };

    loadUser();

  }, []);

  const login = async (email, password) => {

    try {

      const res = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));  // ✅ ADD THIS

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
      localStorage.setItem('user', JSON.stringify(user));  // ✅ ADD THIS

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

  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

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