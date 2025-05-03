import axios from 'axios';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Log the API URL to help with debugging
console.log('API URL being used:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Log the API URL being used
console.log('API URL:', API_URL);

// Add interceptors for handling tokens or errors
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For development/testing with mock authentication
      // This is a temporary solution until real authentication is implemented

      // For development, use a simple mock token that the backend will recognize
      // This is a special token that our modified backend will accept
      const mockToken = 'mock-token-for-development';

      config.headers.Authorization = `Bearer ${mockToken}`;
      console.log('Using mock token for authentication:', `Bearer ${mockToken}`);
    }

    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || '');
      console.log('Request headers:', config.headers);
    }

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Response Error:', error.response?.data || error.message);
    console.error('Request that caused error:', error.config?.method, error.config?.url);

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;