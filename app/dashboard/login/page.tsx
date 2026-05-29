"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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

      if (res && (res as any).ok) {
        router.push("/dashboard");
        return;
      }

      setError("Invalid token");
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-purple-100 bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-slate-950">Dashboard Login</h1>
        <p className="mt-2 text-sm text-slate-700">
          Enter the clinical dashboard access token to continue.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-2 w-full rounded-lg border border-purple-100 px-4 py-2 outline-none"
        />

        {error ? (
          <div className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="submit"
            className="rounded-full bg-purple-700 px-4 py-2 text-sm font-bold text-white hover:bg-purple-800"
          >
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
}
