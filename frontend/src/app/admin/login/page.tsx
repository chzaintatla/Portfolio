"use client";

import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useState } from "react";

import { Input, Label } from "@/components/admin/ui";
import { Backdrop } from "@/components/sections/home/Backdrop";
import { Logo } from "@/components/ui/Logo";
import { adminApi } from "@/lib/admin-api";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await adminApi.post("/api/auth/login", { email: fd.get("email"), password: fd.get("password") });
      const next = sp.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
    } catch (err) {
      setError((err as Error).message || "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="hairline relative w-full max-w-sm rounded-3xl bg-card/80 p-8 backdrop-blur">
      <Logo />
      <h1 className="mt-8 font-display text-2xl font-semibold">Sign in to the CMS</h1>
      <p className="mt-1 text-sm text-mute">Manage content, leads and settings.</p>
      <div className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
      <button type="submit" disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 font-medium text-midnight hover:bg-white disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-midnight px-4">
      <Backdrop particles={12} />
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
