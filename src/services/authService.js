import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/constants';

/**
 * Auth Service
 * Handles authentication-related API calls
 */

export const authService = {
  // Login
  async login(email, password) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    
    if (response.token) {
      localStorage.setItem('lumiere_auth_token', response.token);
      localStorage.setItem('lumiere_user_data', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Register
  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    
    if (response.token) {
      localStorage.setItem('lumiere_auth_token', response.token);
      localStorage.setItem('lumiere_user_data', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Logout
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('lumiere_auth_token');
      localStorage.removeItem('lumiere_user_data');
    }
  },

  // Get current user
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('lumiere_user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('lumiere_auth_token');
  },
};

export default authService;
