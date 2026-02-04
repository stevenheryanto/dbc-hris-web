import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import type { Employee, CreateEmployeeRequest, ImportEmployeeRequest } from '../types/employee';
import type { AttendanceRecord, AttendanceFilters } from '../types/attendance';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Employee API
export const employeeAPI = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEmployeeRequest>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  import: async (data: ImportEmployeeRequest): Promise<{ success: number; errors: string[] }> => {
    const response = await api.post('/employees/import', data);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getAll: async (filters?: AttendanceFilters): Promise<AttendanceRecord[]> => {
    const response = await api.get('/attendance', { params: filters });
    return response.data;
  },

  getByEmployee: async (employeeId: string, filters?: AttendanceFilters): Promise<AttendanceRecord[]> => {
    const response = await api.get(`/attendance/employee/${employeeId}`, { params: filters });
    return response.data;
  },

  approve: async (id: string): Promise<void> => {
    await api.put(`/attendance/${id}/approve`);
  },

  reject: async (id: string, reason: string): Promise<void> => {
    await api.put(`/attendance/${id}/reject`, { reason });
  },
};

export default api;