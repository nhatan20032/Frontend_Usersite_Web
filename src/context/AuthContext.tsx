import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AccountRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  currentRole: AccountRole;
  isLoggedIn: boolean;
  login: (userData?: Partial<User>) => void;
  logout: () => void;
  setRole: (role: AccountRole) => void;
  updateProfile: (name: string, email: string, phone: string) => void;
  activateFreeTrial: () => void;
}

const defaultUser: User = {
  isLoggedIn: true,
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@routinepulse.com',
  phone: '0987 654 321',
  role: 'FREE',
  avatarInitial: 'AN',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const sessionStr = localStorage.getItem('rp_user_session');
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr);
      } catch {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const currentRole = currentUser?.role || 'FREE';
  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rp_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rp_user_session');
    }
  }, [currentUser]);

  const login = (userData?: Partial<User>) => {
    const user: User = {
      ...defaultUser,
      ...userData,
      isLoggedIn: true,
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rp_user_session');
  };

  const setRole = (role: AccountRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const updateProfile = (name: string, email: string, phone: string) => {
    if (currentUser) {
      const nameParts = name.trim().split(' ');
      const avatarInitial = nameParts.length > 0 ? nameParts[nameParts.length - 1].substring(0, 2).toUpperCase() : 'RP';
      setCurrentUser({
        ...currentUser,
        name,
        email,
        phone,
        avatarInitial,
      });
    }
  };

  const activateFreeTrial = () => {
    setRole('TRIAL');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn,
        login,
        logout,
        setRole,
        updateProfile,
        activateFreeTrial,
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
