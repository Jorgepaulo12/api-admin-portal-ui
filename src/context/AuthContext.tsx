
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, logout, LoginCredentials } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type AuthContextType = {
  isAuthenticated: boolean;
  user: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token) {
      setIsAuthenticated(true);
      setUser(username);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      await login(credentials);
      setIsAuthenticated(true);
      setUser(credentials.username);
      localStorage.setItem('username', credentials.username);
      toast.success("Login successful");
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('username');
    toast.info("Logged out successfully");
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
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
