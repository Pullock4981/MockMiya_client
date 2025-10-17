'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  useSession,
  signIn,
  signOut,
  getSession,
  SignInResponse,
} from 'next-auth/react';
import type { Session } from 'next-auth';

export type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
};

type AuthContextType = {
  readonly user: User | null | undefined; // undefined = loading
  readonly loading: boolean;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Map NextAuth session -> local user
  useEffect(() => {
    async function syncUser() {
      setLoading(true);

      if (status === 'authenticated' && session?.user) {
        const typedUser = session.user as Session['user'] & {
          id?: string;
          role?: string;
        };

        setUser({
          id: typedUser.id ?? '',
          name: typedUser.name ?? null,
          email: typedUser.email ?? '',
          role: typedUser.role ?? 'user',
        });
      } else if (status === 'unauthenticated') {
        setUser(null);
      } else {
        setUser(undefined);
      }

      setLoading(false);
    }

    syncUser();
  }, [status, session]);

  // Login with credentials provider
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const result: SignInResponse | undefined = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result || result.error) {
        throw new Error(result?.error ?? 'Login failed');
      }

      // Wait briefly for session to refresh
      for (let i = 0; i < 20; i++) {
        const refreshed = await getSession();
        if (refreshed?.user) {
          const refreshedUser = refreshed.user as Session['user'] & {
            id?: string;
            role?: string;
          };

          setUser({
            id: refreshedUser.id ?? '',
            name: refreshedUser.name ?? null,
            email: refreshedUser.email ?? '',
            role: refreshedUser.role ?? 'user',
          });
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
