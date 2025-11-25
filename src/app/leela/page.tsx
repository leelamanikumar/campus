'use client';

import { useEffect, useState } from "react";

import { AdminConsole } from "@/components/AdminConsole";

const TOKEN_KEY = "leela-token";

export default function LeelaPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthorized(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leela-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Access denied");
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(TOKEN_KEY, data.token);
      }
      setAuthorized(true);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(TOKEN_KEY);
    }
    setAuthorized(false);
  }

  if (authorized) {
    return <AdminConsole onLogout={handleLogout} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-black/40 backdrop-blur"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-lime-300">
            Private access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">/leela</h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter the passcode to manage job postings.
          </p>
        </div>
        <label className="block text-sm font-medium">
          Passcode
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-base text-white placeholder-white/40 focus:border-lime-300 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-lime-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-lime-200 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Unlock dashboard"}
        </button>

        {error && (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

