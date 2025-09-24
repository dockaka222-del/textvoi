
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_ADMIN_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // In a real app, this would involve an OAuth flow with Google.
  // For this simulation, we'll just log in the mock admin user.
  const login = () => {
    setUser(MOCK_ADMIN_USER);
  };

  const logout = () => {
    setUser(null);
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
