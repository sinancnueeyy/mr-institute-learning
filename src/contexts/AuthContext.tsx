import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '../types';
import { supabase } from '../supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string, email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile from user_profiles:', error);
        return null;
      }

      if (data) {
        const userObj: User = {
          id: data.id,
          email: data.email || email,
          displayName: data.display_name || undefined,
          role: data.role as 'DEVELOPER' | 'OFFICE_ADMIN',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        return userObj;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email || '');
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (session?.user && isMounted) {
          const profile = await fetchUserProfile(session.user.id, session.user.email || '');
          if (isMounted) {
            setUser(profile);
            setLoading(false);
          }
        } else if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email || '');
          if (isMounted) {
            setUser(profile);
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

