import { supabase } from '../supabase/client';
import { type LoginCredentials } from '../types';

export const AuthService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      return { user: null, session: null, error: error.message || 'An unexpected error occurred.' };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred.' };
    }
  },

  resetPasswordForEmail: async (email: string, redirectTo?: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send password reset email.' };
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update password.' };
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
};

