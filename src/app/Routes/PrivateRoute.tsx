"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../dashboard/components/Loading";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const timeout = setTimeout(() => {
          router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
        }, 400);
        return () => clearTimeout(timeout);
      } else {
        setChecking(false);
      }
    }
  }, [loading, user, pathname, router]);

  if (loading || checking) {

    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
