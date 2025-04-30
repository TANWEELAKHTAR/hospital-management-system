// We're using mock data for testing
// import api from './api';
import { findUser, findUserByName } from '../utils/mockUsers';

// Login service
export const login = async (credentials) => {
  try {
    // For testing purposes, we'll use mock users instead of API call
    // In a real application, you would use the API call below
    // const response = await api.post('/login', credentials);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by name or email
    const user = findUserByName(credentials.name, credentials.password) ||
                findUser(credentials.email, credentials.password);

    if (!user) {
      throw new Error('Invalid credentials. Please check your username and password.');
    }

    // Create a mock response
    const mockResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: `mock-token-${user.id}-${Date.now()}`
    };

    // Store token in localStorage
    localStorage.setItem('token', mockResponse.token);
    // Store user role
    localStorage.setItem('userRole', mockResponse.role);
    // Store user info
    localStorage.setItem('userInfo', JSON.stringify({
      id: mockResponse.id,
      name: mockResponse.name,
      email: mockResponse.email,
      role: mockResponse.role
    }));

    console.log('User logged in:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error.message || 'Login failed';
  }
};

// Logout service
export const logout = () => {
  // Remove auth data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userInfo');

  console.log('User logged out successfully');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'guest';
};

// Get current user info from localStorage (cached)
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile from localStorage:', error);
    return null;
  }
};

// Fetch current user info from API (mock implementation)
export const fetchCurrentUser = async () => {
  try {
    // For testing purposes, we'll just return the cached user info
    // In a real application, you would make an API call here
    // const response = await api.get('/user/profile');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get user info from localStorage
    const userInfo = getCurrentUser();

    if (!userInfo) {
      throw new Error('User not found');
    }

    return userInfo;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Fall back to cached data
    return getCurrentUser();
  }
};
