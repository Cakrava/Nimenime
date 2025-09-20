
import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import * as api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (localStorage.getItem('jwt_token')) {
      try {
        setIsLoading(true);
        const { data } = await api.getUserProfile();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (credentials: any) => {
    try {
      setError(null);
      const data = await api.loginUser(credentials);
      localStorage.setItem('jwt_token', data.token);
      setToken(data.token);
      await fetchUserProfile();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (details: any) => {
    try {
      setError(null);
      await api.registerUser(details);
      // Automatically log in after registration
      await login({ email: details.email, password: details.password });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
