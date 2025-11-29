import axios from 'axios';

// Get API URL based on environment
// Priority: 1. VITE_API_URL from .env, 2. Development: localhost, 3. Production: Render
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set in .env, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on environment
  if (import.meta.env.DEV) {
    // Development mode - use localhost
    return 'http://localhost:5000/api';
  }
  
  // Production mode - use Render backend
  return 'https://eclora-sj6w.onrender.com/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
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

export default api;

