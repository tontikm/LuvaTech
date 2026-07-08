"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/app/admin/actions";
import { Button, GlassCard } from "@/components/ui";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await adminLoginAction(email, password);
    if (result.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.error ?? "Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-[#030303]">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-white/50">
          Secure dashboard for leads, quotes, and analytics.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-white/50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-white/50">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-white/30 text-center">
              Dev mode: ADMIN_DEV_BYPASS=true skips auth on dashboard
            </p>
          )}
        </form>
      </GlassCard>
    </div>
  );
}
