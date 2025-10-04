"use client";

import { useAuth } from "@/app/auth/context/AuthContext";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { LoadingSpinner } from "../dashboard/components/Loading";

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
