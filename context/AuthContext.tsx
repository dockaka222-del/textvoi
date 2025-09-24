import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS, MOCK_ADMIN_USER, MOCK_NORMAL_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (googleUserData: { name: string; email: string; avatar: string; }) => void;
  mockLogin: (role: 'user' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  trialCount: number;
  decrementTrialCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trialCount, setTrialCount] = useState<number>(10);

  useEffect(() => {
    // Check for a logged-in user or guest trial state in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user, it's a guest. Load their trial count.
      const storedTrials = localStorage.getItem('guestTrialCount');
      if (storedTrials !== null) {
        setTrialCount(parseInt(storedTrials, 10));
      } else {
        localStorage.setItem('guestTrialCount', '10');
        setTrialCount(10);
      }
    }
  }, []);
  
  const decrementTrialCount = () => {
      setTrialCount(prev => {
          const newCount = Math.max(0, prev - 1);
          localStorage.setItem('guestTrialCount', String(newCount));
          return newCount;
      });
  };

  const login = (googleUserData: { name: string; email: string; avatar: string; }) => {
    // This function is kept for potential future re-integration of Google Login,
    // but is currently unused in favor of mockLogin.
    console.log("Attempting to log in user:", googleUserData.email);
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === googleUserData.email.toLowerCase());
    
    let userToSet;
    if (existingUser) {
        console.log("Found existing user:", existingUser.name);
        userToSet = existingUser;
    } else {
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: googleUserData.name,
            email: googleUserData.email,
            avatar: googleUserData.avatar,
            credits: 50000,
            role: 'user',
            joinDate: new Date().toISOString().split('T')[0],
        };
        console.log("Creating new user:", newUser.name);
        userToSet = newUser;
    }
    
    setUser(userToSet);
    localStorage.setItem('user', JSON.stringify(userToSet));
    localStorage.removeItem('guestTrialCount');
  };

  const mockLogin = (role: 'user' | 'admin') => {
    const userToSet = role === 'admin' ? MOCK_ADMIN_USER : MOCK_NORMAL_USER;
    setUser(userToSet);
    localStorage.setItem('user', JSON.stringify(userToSet));
    localStorage.removeItem('guestTrialCount');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setTrialCount(10);
    localStorage.setItem('guestTrialCount', '10');
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, mockLogin, logout, isAuthenticated, trialCount, decrementTrialCount }}>
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