/**
 * Zustand store for authentication state.
 * 
 * Manages:
 * - Current user
 * - JWT token
 * - Login/logout actions
 * - Token persistence in localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, type User, type LoginCredentials, type SignupData } from '../api/authApi';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          const message = error.response?.data?.detail || error.message || 'Login failed';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          // First signup
          await authApi.signup(data);
          
          // Then auto-login
          const loginResponse = await authApi.login({
            email: data.email,
            password: data.password,
          });
          
          set({
            user: loginResponse.user,
            token: loginResponse.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          const message = error.response?.data?.detail || error.message || 'Signup failed';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      getToken: () => {
        return get().token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
