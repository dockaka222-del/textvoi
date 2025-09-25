import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';

// This is the shape of the user object decoded from the JWT
interface AuthUser {
  sub: string; // email
  name: string;
  picture: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}


interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (idToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  trialCount: number;
  decrementTrialCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT. NOTE: This does NOT validate the signature.
// Validation happens on the backend. This is just for reading data on the client.
const decodeJwt = (token: string): AuthUser | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return null;
    }
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState<number>(10);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const decodedUser = decodeJwt(storedToken);
      if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setToken(storedToken);
      } else {
          localStorage.removeItem('authToken');
      }
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

  const login = async (idToken: string) => {
    try {
        const { token: authToken } = await api.loginWithGoogle(idToken);
        const decodedUser = decodeJwt(authToken);

        if (decodedUser) {
            setUser(decodedUser);
            setToken(authToken);
            localStorage.setItem('authToken', authToken);
            localStorage.removeItem('guestTrialCount');
        } else {
            throw new Error("Failed to decode token received from server.");
        }

    } catch (error) {
        console.error("Login failed:", error);
        alert("Đăng nhập thất bại. Vui lòng thử lại.");
        logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
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
