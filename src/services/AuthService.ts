import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { type LoginCredentials } from '../types';

export const AuthService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};
