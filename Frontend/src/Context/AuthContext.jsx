import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getUserRole, logout, getCurrentUser, fetchCurrentUser } from '../api/authService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('guest');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Authentication flow
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        try {
          // First set from localStorage (for immediate UI update)
          const cachedRole = getUserRole();
          const cachedUser = getCurrentUser();

          setUserRole(cachedRole || 'guest');
          setCurrentUser(cachedUser || { role: cachedRole || 'guest' });

          // For mock authentication, we don't need to fetch fresh data
          // Just log the current user info
          console.log('User authenticated from localStorage:', {
            role: cachedRole,
            user: cachedUser
          });
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      } else {
        setUserRole('guest');
        setCurrentUser(null);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData) => {
    // This would typically store the token in localStorage
    // The actual API call is handled in authService.js
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setUserRole(userData.role || 'guest');

    console.log('User logged in via context:', userData);
  };

  // Logout function
  const handleLogout = () => {
    logout(); // This clears the token from localStorage
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUserRole('guest');
  };

  // Check if user has required role
  const hasRole = (requiredRoles) => {
    if (!isLoggedIn) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // If requiredRoles is a string, convert to array
    const roles = typeof requiredRoles === 'string' ? [requiredRoles] : requiredRoles;

    return roles.includes(userRole);
  };

  // Value object that will be passed to consumers of this context
  const value = {
    currentUser,
    isLoggedIn,
    userRole,
    loading,
    login,
    logout: handleLogout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
