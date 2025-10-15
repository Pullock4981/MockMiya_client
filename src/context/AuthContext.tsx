'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

export type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null | undefined; // undefined = loading
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Sync next-auth session -> user state
  useEffect(() => {
    const syncUser = async () => {
      setLoading(true);
      if (status === 'authenticated' && session?.user) {
        setUser({
          id: (session.user as any).id ?? '',
          name: session.user.name ?? null,
          email: session.user.email ?? '',
          role: (session.user as any).role ?? 'user',
        });
      } else if (status === 'unauthenticated') {
        setUser(null);
      } else {
        setUser(undefined);
      }
      setLoading(false);
    };

    syncUser();
  }, [status, session]);

  // Login (credentials)
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', { redirect: false, email, password });
      if (!res || (res as any).error) throw new Error((res as any)?.error || 'Login failed');

      // Poll session for short time
      let s: any = null;
      for (let i = 0; i < 20; i++) {
        s = await getSession();
        if (s?.user) break;
        await new Promise(r => setTimeout(r, 150));
      }

      if (s?.user) {
        setUser({
          id: s.user.id ?? '',
          name: s.user.name ?? null,
          email: s.user.email ?? '',
          role: s.user.role ?? 'user',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
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
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
