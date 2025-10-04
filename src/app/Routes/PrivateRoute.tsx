"use client";

import { useRouter } from "next/navigation";
import { redirect, usePathname } from 'next/navigation';

import { useEffect } from "react";
import { LoadingSpinner } from "../dashboard/components/Loading";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [loading, user, router]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return <>{children}</>;
};

export default PrivateRoute;
