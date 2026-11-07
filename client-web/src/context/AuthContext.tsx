import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Order } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  orders: Order[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: { login: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    wilayaCode?: number;
    address?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (payload: {
    fullName?: string;
    phone?: string;
    wilayaCode?: number;
    address?: string;
    newPassword?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  refreshProfile: () => Promise<void>;
  
  // Modales d'authentification et de profil
  isAuthModalOpen: boolean;
  authModalMode: 'LOGIN' | 'REGISTER';
  openAuthModal: (mode?: 'LOGIN' | 'REGISTER') => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => api.getSavedUser());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Gestion des modales
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const refreshProfile = async () => {
    const token = api.getToken();
    if (!token) {
      setUser(null);
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        if (res.orders) {
          setOrders(res.orders);
        }
      }
    } catch (err) {
      console.warn("Échec du rafraîchissement du profil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (payload: { login: string; password: string }) => {
    const res = await api.login(payload);
    if (res.success && res.user) {
      setUser(res.user);
      await refreshProfile();
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, message: res.message || "Identifiants invalides" };
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    wilayaCode?: number;
    address?: string;
  }) => {
    const res = await api.register(payload);
    if (res.success && res.user) {
      setUser(res.user);
      await refreshProfile();
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, message: res.message || "Erreur lors de l'inscription" };
  };

  const logout = () => {
    api.removeToken();
    setUser(null);
    setOrders([]);
    setIsProfileModalOpen(false);
  };

  const updateProfile = async (payload: {
    fullName?: string;
    phone?: string;
    wilayaCode?: number;
    address?: string;
    newPassword?: string;
  }) => {
    const res = await api.updateProfile(payload);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || "Échec de mise à jour" };
  };

  const openAuthModal = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider');
  }
  return context;
};
