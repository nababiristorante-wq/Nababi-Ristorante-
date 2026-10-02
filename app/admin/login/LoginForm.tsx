"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const LOGO_STORAGE_KEY = "nababi-logo";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    try {
      setLogo(localStorage.getItem(LOGO_STORAGE_KEY) || "");
    } catch {
      setLogo("");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      window.location.href = result.url || "/admin";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#241608] to-black" />

      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="rounded-[32px] border-2 border-amber-500 bg-[#fffdf7] p-6 shadow-2xl sm:p-10">

          <div className="mb-7 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-amber-500 bg-white p-3 shadow-xl">
              {logo ? (
                <img
                  src={logo}
                  alt="Nababi Ristorante"
                  className="h-full w-full rounded-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="text-5xl text-amber-600">♛</div>
                  <div className="text-xl font-bold tracking-widest text-black">
                    NABABI
                  </div>
                  <div className="text-xs tracking-[0.3em] text-amber-700">
                    RISTORANTE
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-widest text-black sm:text-4xl">
              NABABI RISTORANTE
            </h1>

            <div className="mx-auto my-4 h-1 w-24 rounded-full bg-amber-500" />

            <h2 className="text-2xl font-bold text-slate-800">
              Administrator Login
            </h2>

            <p className="mt-2 text-base font-medium text-slate-500">
              Please sign in to access your admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-lg font-bold text-slate-900"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="h-16 w-full rounded-2xl border-2 border-amber-200 bg-white px-5 text-lg text-black outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-lg font-bold text-slate-900"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-16 w-full rounded-2xl border-2 border-amber-200 bg-white px-5 pr-16 text-lg text-black outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-amber-50 text-xl"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-16 w-full rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-xl font-black text-white shadow-xl transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "→  Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xl font-bold italic text-amber-700">
              Together We Serve
            </p>

            <p className="mt-2 text-xs font-bold tracking-[0.25em] text-slate-400">
              NABABI RISTORANTE ADMIN
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
