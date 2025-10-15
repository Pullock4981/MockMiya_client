


'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SessionProvider, useSession, signIn, signOut, getSession } from "next-auth/react";
import { Session } from "next-auth";
import { canAttemptLogin, recordLoginAttempt } from "@/lib/loginRateLimiter";

type AuthContextType = {
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) => (
  <SessionProvider session={session}>
    <AuthInner>{children}</AuthInner>
  </SessionProvider>
);

const AuthInner = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Sync user with session ----------------
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        id: session.user.id!,
        name: session.user.name!,
        email: session.user.email!,
        role: session.user.role!,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session, status]);

  // ---------------- Login ----------------


const login = async (email: string, password: string) => {
  setLoading(true);

  try {
    if (!canAttemptLogin(email)) {
      throw new Error("Too many failed attempts. Try again in 2 minutes.");
    }

    const res = await signIn("credentials", { redirect: false, email, password });

    if (!res) {
      recordLoginAttempt(email, false);
      throw new Error("Login failed");
    }

    if (res.error) {
      recordLoginAttempt(email, false);
      throw new Error(res.error);
    }

    // Successful login → reset attempts
    recordLoginAttempt(email, true);

    const updatedSession = await getSession();
    if (updatedSession?.user) {
      setUser({
        id: updatedSession.user.id!,
        name: updatedSession.user.name!,
        email: updatedSession.user.email!,
        role: updatedSession.user.role!,
      });
    }

  } finally {
    setLoading(false);
  }
};


  // ---------------- Google login ----------------
  const googleLogin = async (): Promise<void> => {
    setLoading(true);
    await signIn("google", { redirect: false });
    const updatedSession = await getSession();
    if (updatedSession?.user) {
      setUser({
        id: updatedSession.user.id!,
        name: updatedSession.user.name!,
        email: updatedSession.user.email!,
        role: updatedSession.user.role!,
      });
    }
    setLoading(false);
  };

  // ---------------- Logout ----------------
  const logout = async (): Promise<void> => {
    await signOut({ redirect: false });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
