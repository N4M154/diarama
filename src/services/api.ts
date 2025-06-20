import axios from 'axios';
import type { TownData, TownEntry } from '../types/town';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Towns API
export const townsAPI = {
  createTown: async (name: string) => {
    const response = await api.post('/towns', { name });
    return response.data;
  },

  getMyTowns: async () => {
    const response = await api.get('/towns/my-towns');
    return response.data;
  },

  getTownByShareId: async (shareId: string) => {
    const response = await api.get(`/towns/share/${shareId}`);
    return response.data;
  },

  updateTown: async (townId: string, updates: Partial<TownData>) => {
    const response = await api.put(`/towns/${townId}`, updates);
    return response.data;
  },

  deleteTown: async (townId: string) => {
    const response = await api.delete(`/towns/${townId}`);
    return response.data;
  },

  regenerateTown: async (townId: string) => {
    const response = await api.post(`/towns/${townId}/regenerate`);
    return response.data;
  },
};

// Stories API
export const storiesAPI = {
  addStory: async (storyData: {
    author: string;
    content: string;
    location: string;
    townId?: string;
    shareId?: string;
  }) => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  getLocationStories: async (townId: string, location: string) => {
    const response = await api.get(`/stories/town/${townId}/location/${location}`);
    return response.data;
  },

  deleteStory: async (storyId: string) => {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },
};

export default api;