import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  trialCount: number;
  decrementTrialCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState<number>(10);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
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

  const login = async (credential: string) => {
    try {
        // Gửi credential đến backend để xác thực và lấy thông tin user + JWT token
        const { user: loggedInUser, token: authToken } = await api.loginWithGoogle(credential);
        
        setUser(loggedInUser);
        setToken(authToken);

        // Lưu thông tin vào localStorage
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('authToken', authToken);
        localStorage.removeItem('guestTrialCount');

    } catch (error) {
        console.error("Login failed:", error);
        alert("Đăng nhập thất bại. Vui lòng thử lại.");
        // Đảm bảo dọn dẹp state nếu có lỗi
        logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    // Reset guest trials
    setTrialCount(10);
    localStorage.setItem('guestTrialCount', '10');
  };
  
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, trialCount, decrementTrialCount }}>
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