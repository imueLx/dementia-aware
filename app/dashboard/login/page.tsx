"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogoMark } from "@/components/layout/logo-mark";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        token,
      } as any);

      if (res?.ok) {
        const callbackUrl =
          new URLSearchParams(window.location.search).get("callbackUrl") ??
          "/dashboard";
        router.push(callbackUrl.startsWith("/dashboard") ? callbackUrl : "/dashboard");
        router.refresh();
        return;
      }

      setError("Invalid token");
    } catch {
      setError("Network error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <LogoMark size="lg" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100/40"
          autoComplete="off"
        >
          <h1 className="text-2xl font-bold text-slate-950">Clinical Dashboard</h1>
          <p className="mt-2 text-sm text-slate-700">
            Enter the clinical dashboard access token to continue.
          </p>

          <label htmlFor="dashboard-token" className="mt-4 block text-sm font-medium text-slate-700">
            Access token
          </label>
          <input
            id="dashboard-token"
            name="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-2 w-full rounded-lg border border-purple-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            autoComplete="current-password"
          />

          {error ? (
            <div className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800" role="alert">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-purple-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Authorized clinicians only. Contact your administrator if you need access.
        </p>
      </div>
    </main>
  );
}
