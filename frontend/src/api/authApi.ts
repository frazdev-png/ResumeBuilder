/**
 * Auth API Service
 * 
 * Handles authentication:
 * - User signup
 * - User login
 * - Get current user
 * 
 * Day 6 will add JWT token handling.
 */

import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authApi = {
  /**
   * Register a new user
   */
  async signup(data: SignupData): Promise<User> {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  /**
   * Login user and get JWT token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Create test user (for development)
   */
  async createTestUser(): Promise<{ user: User; message: string }> {
    const response = await apiClient.post('/auth/test-register');
    return response.data;
  },
};
