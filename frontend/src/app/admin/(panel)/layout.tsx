"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/components/admin/AuthContext";
import { Shell } from "@/components/admin/Shell";

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace(`/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
  }, [loading, user, router]);
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight" aria-busy="true">
        <Loader2 className="h-6 w-6 animate-spin text-aqua" />
      </div>
    );
  }
  return <Shell>{children}</Shell>;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
