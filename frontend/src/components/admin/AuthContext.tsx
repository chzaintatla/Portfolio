"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { adminApi } from "@/lib/admin-api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  can: (perm: string) => boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function can(user: User | null, perm: string) {
  const codes = user?.role?.permissions ?? [];
  const resource = perm.split(":")[0];
  return codes.includes("*") || codes.includes(perm) || codes.includes(`${resource}:*`);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      setUser(await adminApi.get<User>("/api/auth/me"));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await adminApi.post("/api/auth/logout").catch(() => undefined);
    setUser(null);
    router.replace("/admin/login");
  }, [router]);

  return (
    <Ctx.Provider value={{ user, loading, can: (p) => can(user, p), logout, refresh }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
