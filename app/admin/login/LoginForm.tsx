"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const LOGO_STORAGE_KEY = "nababi-logo";

export default function LoginForm() {
  const searchParams = useSearchParams();

  const callbackUrl =
    searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
      setLogo(savedLogo || "");
    } catch {
      setLogo("");
    }
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071321] px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(239,68,68,0.12),transparent_30%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[28px] border border-amber-400/20 bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-amber-400/30 bg-slate-50 shadow-lg sm:h-32 sm:w-32">
              {logo ? (
                <img
                  src={logo}
                  alt="Nababi Ristorante"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="text-center">
                  <div className="text-4xl text-amber-500">
                    ♛
                  </div>

                  <div className="font-serif text-lg font-bold text-amber-500">
                    NABABI
                  </div>
                </div>
              )}
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-wide text-slate-900 sm:text-5xl">
              NABABI RISTORANTE
            </h1>

            <p className="mt-3 text-base font-medium text-slate-500 sm:text-lg">
              Administrator Login
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-2 block text-base font-bold text-slate-700 sm:text-lg"
              >
                Email
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                  
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-base font-bold text-slate-700 sm:text-lg"
              >
                Password
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                  
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-14 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-200"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-4 text-lg font-extrabold tracking-wide text-white shadow-xl shadow-orange-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-5 text-center">
            <p className="font-serif text-base font-semibold italic text-amber-600">
              Together We Serve
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Nababi Ristorante Admin Panel
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
