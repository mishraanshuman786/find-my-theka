import axios from 'axios';

// API Base URL - Update this to match your backend server
// For Android emulator: 10.0.2.2
// For iOS simulator: localhost
// For physical device: your computer's IP address
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://10.208.121.43:3001/api/v1";

  
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = global.authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Token expired or invalid - clear token
        global.authToken = null;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Places API
export const placesAPI = {
  getNearby: (params = {}) => api.get('/places/nearby', { params }),
  search: (data) => api.post('/places/search', data),
  getHistory: () => api.get('/places/history'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
