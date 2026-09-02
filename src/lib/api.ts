import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;

/* ============================================
   API FUNCTIONS — organized by module
   ============================================ */

// --- Auth ---
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  registerStudent: (data: Record<string, unknown>) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
  resetPassword: (data: { email: string }) =>
    api.post('/auth/reset-password', data),
};

// --- Users (admin) ---
export const usersAPI = {
  list: () => api.get('/users'),
  get: (id: string) => api.get(`/users/${id}`),
  create: (data: Record<string, unknown>) => api.post('/users', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/users/${id}`, data),
  remove: (id: string) => api.delete(`/users/${id}`),
};

// --- Students ---
export const studentsAPI = {
  list: (params?: Record<string, string | number>) => api.get('/students', { params }),
  get: (id: string) => api.get(`/students/${id}`),
  getDashboard: () => api.get('/students/dashboard/my'),
  updateProfile: (id: string, data: Record<string, unknown>) =>
    api.patch(`/students/${id}/profile`, data),
  addPayment: (id: string, data: Record<string, unknown>) =>
    api.post(`/students/${id}/payments`, data),
  verifyPayment: (id: string, paymentIndex: number, data: Record<string, unknown>) =>
    api.patch(`/students/${id}/payments/${paymentIndex}/verify`, data),
  uploadDocument: (id: string, formData: FormData) =>
    api.post(`/students/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  reviewDocument: (id: string, docIdx: number, data: Record<string, unknown>) =>
    api.patch(`/students/${id}/documents/${docIdx}/review`, data),
  assess: (id: string, data: Record<string, unknown>) =>
    api.post(`/students/${id}/assess`, data),
  overrideAssess: (id: string, data: { score: number; reason: string }) =>
    api.post(`/students/${id}/assess/override`, data),
  match: (id: string) => api.post(`/students/${id}/match`),
  approveMatch: (id: string, data: Record<string, unknown>) =>
    api.patch(`/students/${id}/match/approve`, data),
  review: (id: string, data: Record<string, unknown>) =>
    api.post(`/students/${id}/review`, data),
  publishResult: (id: string, data: Record<string, unknown>) =>
    api.post(`/students/${id}/result/publish`, data),
  getResult: (id: string) => api.get(`/students/${id}/result`),
  updateApplication: (id: string, stage: string) =>
    api.patch(`/students/${id}/application`, { stage }),
  analytics: () => api.get('/students/analytics/dashboard'),
  exportCSV: () => api.get('/students/export/csv', { responseType: 'blob' }),
  bulkEmail: (data: Record<string, unknown>) =>
    api.post('/students/bulk/email', data),
  bulkAssess: (data: Record<string, unknown>) =>
    api.post('/students/bulk/assess', data),
  representativeAssigned: () =>
    api.get('/students/representative/assigned'),
};

// --- Universities ---
export const universitiesAPI = {
  list: () => api.get('/universities'),
  get: (id: string) => api.get(`/universities/${id}`),
  create: (data: Record<string, unknown>) => api.post('/universities', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/universities/${id}`, data),
  toggle: (id: string) => api.patch(`/universities/${id}/toggle`),
};

// --- Events ---
export const eventsAPI = {
  list: () => api.get('/events'),
  get: (id: string) => api.get(`/events/${id}`),
  create: (data: Record<string, unknown>) => api.post('/events', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/events/${id}`, data),
  addSession: (eventId: string, data: Record<string, unknown>) =>
    api.post(`/events/${eventId}/sessions`, data),
  assignStudents: (eventId: string, sessionIdx: number, data: Record<string, unknown>) =>
    api.post(`/events/${eventId}/sessions/${sessionIdx}/assign`, data),
  mySessions: (eventId: string) =>
    api.get(`/events/${eventId}/my-sessions`),
  checkIn: (eventId: string, data: Record<string, unknown>) =>
    api.post(`/events/${eventId}/check-in`, data),
  attendance: (eventId: string) =>
    api.get(`/events/${eventId}/attendance`),
  joinRoom: (eventId: string, sessionIndex?: number) =>
    api.post(`/events/${eventId}/join`, { sessionIndex }),
};

// --- Messages ---
export const messagesAPI = {
  send: (data: Record<string, unknown>) => api.post('/messages', data),
  inbox: () => api.get('/messages/inbox'),
  unread: () => api.get('/messages/unread'),
  get: (id: string) => api.get(`/messages/${id}`),
};

// --- Audit Logs (admin/staff) ---
export const auditAPI = {
  list: (params?: Record<string, string | number>) => api.get('/audit', { params }),
};
