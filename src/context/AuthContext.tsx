import { syncHubClient } from '../services/syncHubClient';
import { disableBrowserPush } from '../services/browserPush';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, SubscriptionTier, AccountRole } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  currentUser: User | null;
  currentRole: AccountRole;
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;
  isLoggedIn: boolean;
  loginWithApi: (email: string, password: string) => Promise<boolean>;
  registerWithApi: (email: string, password: string, fullName: string, phone?: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string, phone: string, birthday?: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  hasFeature: (featureCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const subscriptionTier: SubscriptionTier = currentUser?.subscriptionTier || 'FREE';
  const isPremium = subscriptionTier === 'PRO' || subscriptionTier === 'VIP' || Boolean(currentUser?.isPremium);
  const currentRole: AccountRole = isPremium ? 'PREMIUM_USER' : 'FREE_USER';
  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  // Auto fetch latest profile from backend using HttpOnly session cookie
  useEffect(() => {
    authApi.getProfile()
      .then((resUser) => {
        if (resUser) {
          const nameParts = (resUser.fullName || 'User').trim().split(' ');
          const avatarInitial = nameParts.length > 0 ? nameParts[nameParts.length - 1].substring(0, 2).toUpperCase() : 'RP';
          const updated: User = {
            phone: resUser.phone,
            birthday: resUser.birthday,
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
        setCurrentUser(null);
      });

    const handleAuthExpired = () => {
      setCurrentUser(null);
    };
    window.addEventListener('app:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('app:auth-expired', handleAuthExpired);
  }, []);


  const loginWithApi = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.login({ email, password });
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

  const registerWithApi = async (email: string, password: string, fullName: string, phone?: string, referralCode?: string): Promise<boolean> => {
    try {
      const res = await authApi.register({ email, password, fullName, phone, referralCode });
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

  const logout = async () => {
    try { await disableBrowserPush(); } catch { /* Session revocation still prevents delivery to this device. */ }
    try { await authApi.logout(); } catch { /* Report offline logout limit in notification settings. */ }
    setCurrentUser(null);
  };
  const updateProfile = async (name: string, _email: string, phone: string, birthday?: string) => {
    try {
      await authApi.updateProfile({ fullName: name, phone, birthday });
      await refreshProfile(); return true;
    } catch { return false; }
  };
  const refreshProfile = async () => {
    const expectedId = currentUser?.id;
    const user = await authApi.getProfile();
    setCurrentUser(previous => previous?.id !== expectedId ? previous : ({ id: user.id, isLoggedIn: true, name: user.fullName, email: user.email,
      phone: user.phone, birthday: user.birthday, role: user.isPremium ? 'PREMIUM_USER' : 'FREE_USER',
      subscriptionTier: user.subscriptionTier, isPremium: user.isPremium, planName: user.planName,
      planExpiresAt: user.planExpiresAt, features: user.features, avatarInitial: user.fullName.slice(0, 2).toUpperCase() }));
  };
  useEffect(() => {
    if (!currentUser) return;
    return syncHubClient.onDataChanged(event => { if (event.entityType === 'subscription') void refreshProfile().catch(() => {}); });
  }, [currentUser?.id]);


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
        loginWithApi,
        registerWithApi,
        logout,
        updateProfile,
        refreshProfile,
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
