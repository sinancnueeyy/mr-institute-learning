import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('../firebase/auth');
        const { userRepository } = await import('../repositories');

        if (!isMounted) return;

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
          if (firebaseUser) {
            try {
              // Fetch custom user details (role, etc.) from Firestore
              const { data } = await userRepository.getById(firebaseUser.uid);
              if (isMounted) {
                setUser(data || null);
                setLoading(false);
              }
            } catch (err) {
              console.error("Failed to fetch user data:", err);
              if (isMounted) {
                setUser(null);
                setLoading(false);
              }
            }
          } else {
            if (isMounted) {
              setUser(null);
              setLoading(false);
            }
          }
        });
      } catch (error) {
        import('../utils/pwa').then(({ handleChunkError }) => {
          if (!handleChunkError(error)) {
            console.error("Auth initialization failed:", error);
            if (isMounted) {
              setUser(null);
              setLoading(false);
            }
          }
        });
      }
    };

    // Use a small delay to yield to the main thread for React to finish initial paint
    setTimeout(initAuth, 10);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { auth } = await import('../firebase/auth');
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
