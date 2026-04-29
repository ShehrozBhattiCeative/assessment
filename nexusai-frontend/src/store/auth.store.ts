'use client';

import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokenAndUser: (token: string, user: User) => void;
  refreshSession: () => Promise<boolean>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setTokenAndUser: (token, user) => {
    if (typeof window !== 'undefined') window.__nexusai_access_token = token;
    set({ accessToken: token, user, isAuthenticated: true });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await authApi.login(email, password);
      const token = result.accessToken;
      const user = result.user;
      if (typeof window !== 'undefined') window.__nexusai_access_token = token;
      set({ accessToken: token, user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {}
    if (typeof window !== 'undefined') window.__nexusai_access_token = undefined;
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  refreshSession: async () => {
    try {
      const result = await authApi.refresh();
      const token = result.accessToken;
      if (!token) return false;
      if (typeof window !== 'undefined') window.__nexusai_access_token = token;
      const user = await authApi.me();
      set({ accessToken: token, user, isAuthenticated: true });
      return true;
    } catch {
      get().clearAuth();
      return false;
    }
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') window.__nexusai_access_token = undefined;
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
