'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

/** HOC that protects a component behind authentication and optional role check. */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  requiredRole?: 'admin' | 'patient' | 'doctor'
) {
  function ProtectedComponent(props: P) {
    const { isAuthenticated, user, refreshSession } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      const check = async () => {
        if (!isAuthenticated) {
          const restored = await refreshSession();
          if (!restored) {
            router.replace('/login');
            return;
          }
        }
        const currentUser = useAuthStore.getState().user;
        if (requiredRole && currentUser?.role !== requiredRole) {
          router.replace('/');
        }
      };
      check();
    }, [isAuthenticated, router, refreshSession]);

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0f4c81] border-t-transparent" />
        </div>
      );
    }

    if (requiredRole && user?.role !== requiredRole) return null;

    return <Component {...props} />;
  }

  ProtectedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return ProtectedComponent;
}
