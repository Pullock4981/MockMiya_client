'use client';

import { redirect, usePathname } from 'next/navigation';
import { useAuth } from '../auth/context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    redirect(`/auth?from=${encodeURIComponent(pathname)}`);
  }

  return <>{children}</>;
};

export default PrivateRoute;
