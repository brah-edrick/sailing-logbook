"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback = null }: AuthGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // Don't show anything while loading
  }

  if (!session) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
