
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

// Define types for Google Identity Services (GSI)
interface CredentialResponse {
    credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: CredentialResponse) => void; }) => void;
          renderButton: (parent: HTMLElement, options: object) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface AuthContextType {
  user: User | null;
  login: (googleUserData: { name: string; email: string; avatar: string; }) => void;
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
    // In a real app, send the JWT to your backend for verification.
    // The backend would then return the user's full profile (credits, role, etc.).
    // For this simulation, we'll check against mock users or create a new one.
    console.log("Attempting to log in user:", googleUserData.email);

    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === googleUserData.email.toLowerCase());
    
    let userToSet;
    if (existingUser) {
        console.log("Found existing user:", existingUser.name);
        userToSet = existingUser;
    } else {
        // Create a new user profile for a new Google login
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: googleUserData.name,
            email: googleUserData.email,
            avatar: googleUserData.avatar,
            credits: 50000, // Welcome bonus credits
            role: 'user',
            joinDate: new Date().toISOString().split('T')[0],
        };
        console.log("Creating new user:", newUser.name);
        userToSet = newUser;
    }
    
    setUser(userToSet);
    localStorage.setItem('user', JSON.stringify(userToSet));
    localStorage.removeItem('guestTrialCount'); // Clear trial data on login
  };

  const logout = () => {
    // Clear user from state and local storage
    setUser(null);
    localStorage.removeItem('user');
    
    // Reset trial count for the next guest session
    setTrialCount(10);
    localStorage.setItem('guestTrialCount', '10');

    // Disable Google's automatic sign-in for the next visit
    if (window.google) {
        window.google.accounts.id.disableAutoSelect();
        console.log("Google auto sign-in disabled.");
    }
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, trialCount, decrementTrialCount }}>
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
