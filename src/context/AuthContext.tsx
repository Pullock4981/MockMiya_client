'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './Firebase/firebase.init';

// =======================
// TypeScript type
// =======================
interface AuthContextType {
  user: User | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  updateUser: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
  signInUser: (email: string, password: string) => Promise<UserCredential>;
  googleSignIn: () => Promise<UserCredential>;
  logoutUser: () => Promise<void>;
}

// =======================
// Create Context
// =======================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =======================
// Provider
// =======================
interface Props {
  children: ReactNode;
}

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (profile: { displayName?: string; photoURL?: string }): Promise<void> => {
    if (!auth.currentUser) {
      return Promise.reject(new Error('No user logged in'));
    }
    return updateProfile(auth.currentUser, profile);
  };

  const signInUser = (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = (): Promise<UserCredential> => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logoutUser = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    createUser,
    updateUser,
    signInUser,
    googleSignIn,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =======================
// Custom Hook
// =======================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
