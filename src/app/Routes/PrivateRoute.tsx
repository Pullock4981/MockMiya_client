'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../dashboard/components/Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // ✅ Use const since we’re not reassigning
    const timer = setTimeout(() => {
      if (status === "loading") {
        setCheckingAuth(true);
        return;
      }

      if (status === "unauthenticated") {
        router.replace("/auth");
      } else {
        setCheckingAuth(false);
      }
    }, 400); // delay to let session update

    return () => clearTimeout(timer);
  }, [status, router]);

  // While checking session → show loader
  if (checkingAuth || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-green-400 text-lg">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "authenticated" && session) {
    return <>{children}</>;
  }

  return null;
}
