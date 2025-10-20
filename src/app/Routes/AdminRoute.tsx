'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '../dashboard/components/Loading';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(`/login?from=${pathname}`);
      } else if (user.role !== 'System Admin' && user.role !== 'Admin') {
        router.replace(`/dashboard?from=${pathname}`);
      }
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) return <LoadingSpinner />;

  if (user.role !== 'System Admin' && user.role !== 'Admin') return null;

  return <>{children}</>;
};

export default AdminRoute;
