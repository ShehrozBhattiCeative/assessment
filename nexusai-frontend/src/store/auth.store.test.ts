import { useAuthStore } from './auth.store';

// Mock the entire api module
jest.mock('@/lib/api', () => ({
  authApi: {
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
    me: jest.fn(),
  },
}));

import { authApi } from '@/lib/api';

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts unauthenticated', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });

    it('starts with loading false', () => {
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('setTokenAndUser', () => {
    it('sets token, user, and marks authenticated', () => {
      const user = { id: 'u1', name: 'Admin', email: 'admin@test.com', role: 'admin' as const };
      useAuthStore.getState().setTokenAndUser('tok-123', user);
      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('tok-123');
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearAuth', () => {
    it('resets all auth state', () => {
      const user = { id: 'u1', name: 'Admin', email: 'admin@test.com', role: 'admin' as const };
      useAuthStore.getState().setTokenAndUser('tok-123', user);
      useAuthStore.getState().clearAuth();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('calls authApi.login and sets state on success', async () => {
      const user = { id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'patient' as const };
      mockAuthApi.login.mockResolvedValueOnce({ accessToken: 'access-tok', user });

      await useAuthStore.getState().login('jane@test.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.accessToken).toBe('access-tok');
      expect(state.isLoading).toBe(false);
    });

    it('sets isLoading false and rethrows on failure', async () => {
      mockAuthApi.login.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(useAuthStore.getState().login('bad@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('clears auth state and calls authApi.logout', async () => {
      const user = { id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'patient' as const };
      useAuthStore.getState().setTokenAndUser('tok', user);
      mockAuthApi.logout.mockResolvedValueOnce({ message: 'ok' });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });

    it('still clears state even if authApi.logout throws', async () => {
      const user = { id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'patient' as const };
      useAuthStore.getState().setTokenAndUser('tok', user);
      mockAuthApi.logout.mockRejectedValueOnce(new Error('network error'));

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('refreshSession', () => {
    it('returns true and updates token when refresh succeeds', async () => {
      const user = { id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'patient' as const };
      mockAuthApi.refresh.mockResolvedValueOnce({ accessToken: 'new-tok' });
      mockAuthApi.me.mockResolvedValueOnce(user);

      const result = await useAuthStore.getState().refreshSession();

      expect(result).toBe(true);
      expect(useAuthStore.getState().accessToken).toBe('new-tok');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('returns false and clears auth when refresh fails', async () => {
      mockAuthApi.refresh.mockRejectedValueOnce(new Error('token expired'));

      const result = await useAuthStore.getState().refreshSession();

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('returns false when refresh response has no accessToken', async () => {
      mockAuthApi.refresh.mockResolvedValueOnce({ accessToken: null });

      const result = await useAuthStore.getState().refreshSession();

      expect(result).toBe(false);
    });
  });
});
