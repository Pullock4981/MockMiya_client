'use client';

import { useAuth } from '@/context/AuthContext/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '../dashboard/components/Loading';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Current path

  useEffect(() => {
    if (!loading && user === null) {
      // Redirect to login page with redirect query
      router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || user === undefined) return <LoadingSpinner />;

  return <>{user ? children : null}</>;
}
