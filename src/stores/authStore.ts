import { create } from 'zustand';
import { authAPI } from '@/lib/api';

export type UserRole = 'admin' | 'glory_staff' | 'university_rep' | 'student';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  studentId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.login({ email, password });
      const rawToken = res.data.token || res.data.access_token;
      const rawUser = res.data.user || res.data.student || {};
      const user: User = {
        _id: rawUser._id || rawUser.id || '',
        email: rawUser.email || email,
        firstName: rawUser.firstName || '',
        lastName: rawUser.lastName || '',
        role: (rawUser.role || 'student') as UserRole,
        phone: rawUser.phone,
        studentId: rawUser.studentId,
      };

      if (rawToken) {
        localStorage.setItem('token', rawToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: rawToken, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data: Record<string, unknown>) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.registerStudent(data);
      const rawToken = res.data.token || res.data.access_token;
      const rawStudent = res.data.student || res.data.user || {};
      const user: User = {
        _id: rawStudent._id || rawStudent.id || '',
        email: rawStudent.email || (data.email as string),
        firstName: rawStudent.firstName || (data.firstName as string),
        lastName: rawStudent.lastName || (data.lastName as string),
        role: 'student',
        phone: rawStudent.phone || (data.phone as string),
        studentId: rawStudent.studentId,
      };

      if (rawToken) {
        localStorage.setItem('token', rawToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: rawToken, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const parsed = JSON.parse(userStr);
        const user: User = {
          ...parsed,
          _id: parsed._id || parsed.id || '',
        };
        set({ user, token });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  clearError: () => set({ error: null }),
}));
