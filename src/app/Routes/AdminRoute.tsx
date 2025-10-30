'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext/AuthContext';
import { LoadingSpinner } from '../dashboard/components/Loading';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect if loading finished AND user is not undefined
    if (!loading && user !== undefined) {
      if (!user) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      } else if (!['System Admin', 'Admin'].includes(user.role)) {
        router.replace(`/dashboard/admin/panel?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, loading, pathname, router]);

  if (loading || user === undefined) return <LoadingSpinner />;

  // Only render children if user is admin
  if (!user || !['System Admin', 'Admin'].includes(user.role)) return null;

  return <>{children}</>;
};

export default AdminRoute;
