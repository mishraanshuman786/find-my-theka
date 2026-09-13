import React, { createContext, useState, useEffect, useContext,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        global.authToken = storedToken;
      }
    } catch (err) {
      console.error('Error loading stored auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      
      const { user: userData, token: authToken } = response.data.data;
      
      setToken(authToken);
      setUser(userData);
      global.authToken = authToken;
      
      await AsyncStorage.setItem('userToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      setError(null);
      console.log("Registering");
      const response = await authAPI.register({ name, email, password, phone });
      console.log("Response:",response);
      
      const { user: userData, token: authToken } = response.data.data;
      
      setToken(authToken);
      setUser(userData);
      global.authToken = authToken;
      
      await AsyncStorage.setItem('userToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      console.log("Error Occurred:",err);
      setError(message);
      return { success: false, error: message };
    }
  };

  const fetchProfile = useCallback(async () => {
  try {
    const response = await authAPI.getProfile();

    const userData = response.data.data;

    setUser(userData);

    await AsyncStorage.setItem(
      "userData",
      JSON.stringify(userData)
    );
  } catch (error) {
    console.log(error);
  }
}, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (err) {
      console.error('Error clearing auth:', err);
    } finally {
      setToken(null);
      setUser(null);
      global.authToken = null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        fetchProfile,
        logout,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
