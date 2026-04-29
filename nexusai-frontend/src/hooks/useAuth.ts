'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/** Access auth state and actions from anywhere in the app. */
export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, refreshSession } = useAuthStore();
  const router = useRouter();

  const handleLogin = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      await login(email, password);
      router.push(redirectTo || (useAuthStore.getState().user?.role === 'admin' ? '/admin' : '/'));
    },
    [login, router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/login');
  }, [logout, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
    isPatient: user?.role === 'patient',
    login: handleLogin,
    logout: handleLogout,
    refreshSession,
  };
}
