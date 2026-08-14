import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, SubscriptionTier, AccountRole } from '../types';
import { authApi } from '../api/authApi';
import { setAuthToken, getAuthToken } from '../api/apiClient';

interface AuthContextType {
  currentUser: User | null;
  currentRole: AccountRole;
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;
  isLoggedIn: boolean;
  login: (userData?: Partial<User>) => void;
  loginWithApi: (email: string, password: string) => Promise<boolean>;
  registerWithApi: (email: string, password: string, fullName: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: AccountRole) => void;
  upgradeToTier: (tier: SubscriptionTier, planName?: string) => void;
  updateProfile: (name: string, email: string, phone: string) => void;
  activateFreeTrial: () => void;
  hasFeature: (featureCode: string) => boolean;
}

const defaultFreeUser: User = {
  isLoggedIn: true,
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@routinepulse.com',
  phone: '0987 654 321',
  role: 'FREE_USER',
  subscriptionTier: 'FREE',
  isPremium: false,
  planName: 'Gói Miễn Phí',
  avatarInitial: 'AN',
  features: ['BASIC_CALENDAR', 'DAILY_ROUTINE'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const sessionStr = localStorage.getItem('rp_user_session');
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr);
      } catch {
        return defaultFreeUser;
      }
    }
    return defaultFreeUser;
  });

  const subscriptionTier: SubscriptionTier = currentUser?.subscriptionTier || 'FREE';
  const isPremium = subscriptionTier === 'PRO' || subscriptionTier === 'VIP' || Boolean(currentUser?.isPremium);
  const currentRole: AccountRole = isPremium ? 'PREMIUM_USER' : 'FREE_USER';
  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  // Auto fetch latest profile from backend if token exists
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authApi.getProfile()
        .then((resUser) => {
          if (resUser) {
            const nameParts = (resUser.fullName || 'User').trim().split(' ');
            const avatarInitial = nameParts.length > 0 ? nameParts[nameParts.length - 1].substring(0, 2).toUpperCase() : 'RP';
            const updated: User = {
              id: resUser.id,
              isLoggedIn: true,
              name: resUser.fullName,
              email: resUser.email,
              role: resUser.isPremium ? 'PREMIUM_USER' : 'FREE_USER',
              subscriptionTier: resUser.subscriptionTier as SubscriptionTier,
              isPremium: resUser.isPremium,
              planName: resUser.planName,
              planExpiresAt: resUser.planExpiresAt,
              features: resUser.features,
              avatarInitial,
            };
            setCurrentUser(updated);
          }
        })
        .catch(() => {
          // Keep local session if backend unreachable
        });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rp_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rp_user_session');
    }
  }, [currentUser]);

  const loginWithApi = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.login({ email, password });
      setAuthToken(res.token);
      const nameParts = res.user.fullName.trim().split(' ');
      const avatarInitial = nameParts.length > 0 ? nameParts[nameParts.length - 1].substring(0, 2).toUpperCase() : 'RP';
      const user: User = {
        id: res.user.id,
        isLoggedIn: true,
        name: res.user.fullName,
        email: res.user.email,
        role: res.user.isPremium ? 'PREMIUM_USER' : 'FREE_USER',
        subscriptionTier: res.user.subscriptionTier as SubscriptionTier,
        isPremium: res.user.isPremium,
        planName: res.user.planName,
        planExpiresAt: res.user.planExpiresAt,
        features: res.user.features,
        avatarInitial,
      };
      setCurrentUser(user);
      return true;
    } catch {
      return false;
    }
  };

  const registerWithApi = async (email: string, password: string, fullName: string, phone?: string): Promise<boolean> => {
    try {
      const res = await authApi.register({ email, password, fullName, phone });
      setAuthToken(res.token);
      const nameParts = res.user.fullName.trim().split(' ');
      const avatarInitial = nameParts.length > 0 ? nameParts[nameParts.length - 1].substring(0, 2).toUpperCase() : 'RP';
      const user: User = {
        id: res.user.id,
        isLoggedIn: true,
        name: res.user.fullName,
        email: res.user.email,
        role: 'FREE_USER',
        subscriptionTier: 'FREE',
        isPremium: false,
        avatarInitial,
        features: [],
      };
      setCurrentUser(user);
      return true;
    } catch {
      return false;
    }
  };

  const login = (userData?: Partial<User>) => {
    const user: User = {
      ...defaultFreeUser,
      ...userData,
      isLoggedIn: true,
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('rp_user_session');
  };

  const setRole = (role: AccountRole) => {
    if (currentUser) {
      const isPrem = role === 'PREMIUM_USER';
      setCurrentUser({
        ...currentUser,
        role,
        isPremium: isPrem,
        subscriptionTier: isPrem ? 'PRO' : 'FREE',
      });
    }
  };

  const upgradeToTier = (tier: SubscriptionTier, planName: string = 'Gói Chuyên Nghiệp (Pro)') => {
    if (currentUser) {
      const isPrem = tier === 'PRO' || tier === 'VIP';
      setCurrentUser({
        ...currentUser,
        subscriptionTier: tier,
        isPremium: isPrem,
        role: isPrem ? 'PREMIUM_USER' : 'FREE_USER',
        planName,
        features: isPrem
          ? ['UNLIMITED_TASKS', 'ADVANCED_ROUTINES', 'AI_PLANNER', 'CUSTOM_THEMES', 'TRAVEL_ALERT']
          : ['BASIC_CALENDAR', 'DAILY_ROUTINE'],
      });
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
    upgradeToTier('PRO', 'Dùng thử 14 ngày Pro');
  };

  const hasFeature = (featureCode: string): boolean => {
    if (isPremium) return true;
    return currentUser?.features?.includes(featureCode) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        subscriptionTier,
        isPremium,
        isLoggedIn,
        login,
        loginWithApi,
        registerWithApi,
        logout,
        setRole,
        upgradeToTier,
        updateProfile,
        activateFreeTrial,
        hasFeature,
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
