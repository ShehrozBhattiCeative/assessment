import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Centralized typed API client with JWT auto-attach and silent refresh on 401. */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from memory to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.__nexusai_access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

// Silent refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry && original.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
          return apiClient(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.data?.accessToken || data.accessToken;
        if (typeof window !== 'undefined') window.__nexusai_access_token = newToken;
        processQueue(null, newToken);
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          window.__nexusai_access_token = undefined;
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }).then((r) => r.data.data ?? r.data),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiClient.post('/auth/register', data).then((r) => r.data.data ?? r.data),
  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
  refresh: () => apiClient.post('/auth/refresh').then((r) => r.data.data ?? r.data),
  me: () => apiClient.get('/auth/me').then((r) => r.data.data ?? r.data),
};

// ─── Doctors ─────────────────────────────────────────────────────────────────

export const doctorsApi = {
  getAll: (params?: { specialty?: string; search?: string; departmentId?: string }) =>
    apiClient.get('/doctors', { params }).then((r) => r.data.data ?? r.data),
  getOne: (id: string) => apiClient.get(`/doctors/${id}`).then((r) => r.data.data ?? r.data),
  create: (data: unknown) => apiClient.post('/doctors', data).then((r) => r.data.data ?? r.data),
  update: (id: string, data: unknown) => apiClient.patch(`/doctors/${id}`, data).then((r) => r.data.data ?? r.data),
  delete: (id: string) => apiClient.delete(`/doctors/${id}`),
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getAll: (params?: { status?: string; patientId?: string; doctorId?: string }) =>
    apiClient.get('/appointments', { params }).then((r) => r.data.data ?? r.data),
  getOne: (id: string) => apiClient.get(`/appointments/${id}`).then((r) => r.data.data ?? r.data),
  create: (data: unknown) => apiClient.post('/appointments', data).then((r) => r.data.data ?? r.data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/appointments/${id}/status`, { status }).then((r) => r.data.data ?? r.data),
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
  getStats: () => apiClient.get('/appointments/stats').then((r) => r.data.data ?? r.data),
};

// ─── Blogs ────────────────────────────────────────────────────────────────────

export const blogsApi = {
  getAll: (params?: { status?: string; category?: string; search?: string }) =>
    apiClient.get('/blogs', { params }).then((r) => r.data.data ?? r.data),
  getBySlug: (slug: string) => apiClient.get(`/blogs/slug/${slug}`).then((r) => r.data.data ?? r.data),
  getOne: (id: string) => apiClient.get(`/blogs/${id}`).then((r) => r.data.data ?? r.data),
  create: (data: unknown) => apiClient.post('/blogs', data).then((r) => r.data.data ?? r.data),
  update: (id: string, data: unknown) => apiClient.patch(`/blogs/${id}`, data).then((r) => r.data.data ?? r.data),
  delete: (id: string) => apiClient.delete(`/blogs/${id}`),
};

// ─── Departments ──────────────────────────────────────────────────────────────

export const departmentsApi = {
  getAll: () => apiClient.get('/departments').then((r) => r.data.data ?? r.data),
  getOne: (id: string) => apiClient.get(`/departments/${id}`).then((r) => r.data.data ?? r.data),
  create: (data: unknown) => apiClient.post('/departments', data).then((r) => r.data.data ?? r.data),
  update: (id: string, data: unknown) => apiClient.patch(`/departments/${id}`, data).then((r) => r.data.data ?? r.data),
  delete: (id: string) => apiClient.delete(`/departments/${id}`),
};

// ─── Packages ─────────────────────────────────────────────────────────────────

export const packagesApi = {
  getAll: () => apiClient.get('/packages').then((r) => r.data.data ?? r.data),
  getAllAdmin: () => apiClient.get('/packages/all').then((r) => r.data.data ?? r.data),
  getOne: (id: string) => apiClient.get(`/packages/${id}`).then((r) => r.data.data ?? r.data),
  create: (data: unknown) => apiClient.post('/packages', data).then((r) => r.data.data ?? r.data),
  update: (id: string, data: unknown) => apiClient.patch(`/packages/${id}`, data).then((r) => r.data.data ?? r.data),
  delete: (id: string) => apiClient.delete(`/packages/${id}`),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonialsApi = {
  getAll: () => apiClient.get('/testimonials').then((r) => r.data.data ?? r.data),
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const statsApi = {
  get: () => apiClient.get('/stats').then((r) => r.data.data ?? r.data),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: (params?: { role?: string; search?: string }) =>
    apiClient.get('/users', { params }).then((r) => r.data.data ?? r.data),
  getOne: (id: string) => apiClient.get(`/users/${id}`).then((r) => r.data.data ?? r.data),
  update: (id: string, data: unknown) => apiClient.patch(`/users/${id}`, data).then((r) => r.data.data ?? r.data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  getDashboard: () => apiClient.get('/users/dashboard').then((r) => r.data.data ?? r.data),
};

export default apiClient;

// Extend Window to hold the in-memory access token
declare global {
  interface Window {
    __nexusai_access_token?: string;
  }
}
