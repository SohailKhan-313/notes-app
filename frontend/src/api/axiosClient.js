import axios from 'axios';

// Helper to sanitize and normalize backend URL
function normalizeApiUrl(raw) {
  if (!raw) return raw;
  try {
    const url = new URL(raw.trim());
    const cleanPath = url.pathname.replace(/\/+/g, '/').replace(/\/$/, '');
    return url.origin + cleanPath;
  } catch {
    return raw.trim().replace(/\/+$/, '');
  }
}

// Determine backend URL
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const apiBaseUrl = normalizeApiUrl(rawBaseUrl);

console.log('🔗 [NoteNest API] Configured baseURL:', apiBaseUrl);

// Create configured Axios instance
const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer token to each outgoing request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notes_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global handling of unauthorized or network errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized and redirect to login if not already there
      localStorage.removeItem('notes_auth_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
