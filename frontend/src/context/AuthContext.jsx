import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('notes_auth_token'));
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authErrorMessage, setAuthErrorMessage] = useState(null);

  // Check and verify token on initial load
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('notes_auth_token');
      if (!storedToken) {
        setIsAuthChecking(false);
        return;
      }

      try {
        const response = await axiosClient.get('/auth/me');
        if (response.data.success) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        localStorage.removeItem('notes_auth_token');
        setAuthToken(null);
        setCurrentUser(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    verifyUserSession();
  }, [authToken]);

  // Login handler
  const login = async (email, password) => {
    setAuthErrorMessage(null);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('notes_auth_token', token);
      setAuthToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please verify your credentials.';
      setAuthErrorMessage(message);
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setAuthErrorMessage(null);
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('notes_auth_token', token);
      setAuthToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please check your information.';
      setAuthErrorMessage(message);
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('notes_auth_token');
    setAuthToken(null);
    setCurrentUser(null);
    setAuthErrorMessage(null);
  };

  const clearAuthError = () => {
    setAuthErrorMessage(null);
  };

  const value = {
    currentUser,
    authToken,
    isAuthenticated: Boolean(authToken && currentUser),
    isAuthChecking,
    authErrorMessage,
    login,
    register,
    logout,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
