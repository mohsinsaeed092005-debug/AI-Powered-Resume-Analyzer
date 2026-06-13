"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/components/AuthProvider";

function makeSafeNext(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}`;
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAuthPage = pathname === "/profile";

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthPage) {
      const next = makeSafeNext(pathname, searchParams);
      router.replace(`/profile?next=${encodeURIComponent(next)}`);
      return;
    }

    if (user && isAuthPage) {
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
    }
  }, [isAuthPage, loading, pathname, router, searchParams, user]);

  if (loading || (!user && !isAuthPage)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050912] px-4 text-center text-sm text-slate-400">
        Checking your account...
      </div>
    );
  }

  return <>{children}</>;
}
