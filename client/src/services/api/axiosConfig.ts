import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Use backend root URL, Vite proxy handles /api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Required for session-based OAuth2
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Skip auth header for OAuth endpoints
    if (config.url?.includes('/oauth2/') || config.url?.includes('/login/oauth2/code')) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Avoid redirecting for OAuth2-related requests
    if (error.response?.status === 401 && !originalRequest.url?.includes('/oauth2/')) {
      localStorage.removeItem('token');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default instance;