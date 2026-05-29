"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogoMark } from "@/components/layout/logo-mark";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        token,
      });

      if (res?.ok) {
        const callbackUrl =
          new URLSearchParams(window.location.search).get("callbackUrl") ??
          "/dashboard";
        router.push(
          callbackUrl.startsWith("/dashboard") ? callbackUrl : "/dashboard",
        );
        router.refresh();
        return;
      }

      setError("Invalid token");
    } catch {
      setError("Network error");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_38%),linear-gradient(180deg,#f8f5ff_0%,#ffffff_46%,#f8fafc_100%)] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-40 w-40 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-slate-300/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark size="lg" className="mb-4" />
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700 shadow-sm backdrop-blur">
            Clinical access
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur"
          autoComplete="off"
        >
          <div className="mb-6 h-1.5 w-20 rounded-full bg-linear-to-r from-purple-500 via-fuchsia-500 to-indigo-500" />
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Clinical Dashboard
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Enter the access token to continue to the clinician dashboard.
          </p>

          <label
            htmlFor="dashboard-token"
            className="mt-6 block text-sm font-medium text-slate-700"
          >
            Access token
          </label>
          <div className="relative mt-2">
            <input
              id="dashboard-token"
              name="token"
              type={showToken ? "text" : "password"}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              autoComplete="current-password"
              placeholder="Paste access token"
            />
            <button
              type="button"
              onClick={() => setShowToken((current) => !current)}
              aria-label={showToken ? "Hide access token" : "Show access token"}
              aria-pressed={showToken}
              className="absolute inset-y-0 right-2 my-2 flex w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {showToken ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58A2 2 0 1 0 13.42 13.42" />
                  <path d="M9.88 5.07A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-1.01 2.25-2.7 4.16-4.82 5.51" />
                  <path d="M6.61 6.61A11.17 11.17 0 0 0 1 12c1.73 3.89 6 7 11 7 1.04 0 2.05-.1 3.02-.29" />
                  <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.75-7 10-7 10 7 10 7-3.75 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error ? (
            <div
              className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-7 w-full rounded-full bg-linear-to-r from-purple-700 to-fuchsia-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-700/25 transition hover:from-purple-800 hover:to-fuchsia-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Authorized clinicians only. Contact your administrator if you need
          access.
        </p>
      </div>
    </main>
  );
}
