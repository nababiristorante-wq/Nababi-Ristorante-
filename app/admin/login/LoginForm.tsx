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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080705] px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(180,83,9,0.20),transparent_30%),linear-gradient(135deg,#080705,#21170c,#080705)]" />

      <div className="absolute left-5 top-10 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_40px_15px_rgba(245,158,11,0.25)]" />
      <div className="absolute right-8 top-20 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_35px_12px_rgba(250,204,21,0.25)]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="overflow-hidden rounded-[32px] border border-amber-400/60 bg-[#fffdf8] shadow-[0_35px_100px_rgba(0,0,0,0.65)]">

          <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600" />

          <div className="px-6 py-9 sm:px-10 sm:py-11">

            <div className="mb-6 flex justify-center">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[3px] border-amber-500 bg-white p-2 shadow-[0_12px_35px_rgba(180,83,9,0.25)]">
                <div className="absolute inset-1 rounded-full border border-amber-400/40" />

                {logo ? (
                  <img
                    src={logo}
                    alt="Nababi Ristorante"
                    className="relative h-full w-full rounded-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl text-amber-600">♛</div>
                    <div className="font-serif text-lg font-bold tracking-[0.18em] text-slate-900">
                      NABABI
                    </div>
                    <div className="text-[9px] tracking-[0.35em] text-amber-700">
                      RISTORANTE
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl font-bold tracking-[0.12em] text-slate-900 sm:text-4xl">
                NABABI RISTORANTE
              </h1>

              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-amber-500" />
                <span className="text-lg text-amber-600">♛</span>
                <div className="h-px w-12 bg-amber-500" />
              </div>

              <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-800">
                Administrator Login
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Please sign in to access your admin panel
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-base font-bold text-slate-800"
                >
                  Email Address
                </label>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700">
                    ✉
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email Address"
                    className="h-16 w-full rounded-2xl border border-[#d9c9aa] bg-[#fffdfa] pl-12 pr-4 text-base font-medium text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-base font-bold text-slate-800"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700">
                    🔒
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="h-16 w-full rounded-2xl border border-[#d9c9aa] bg-[#fffdfa] pl-12 pr-14 text-base font-medium text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#d99722] via-[#f2b544] to-[#c98516] text-lg font-bold text-white shadow-[0_12px_30px_rgba(180,115,20,0.30)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-xl">→</span>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <div className="h-px w-14 bg-amber-400/60" />
                <span className="text-lg text-amber-600">♛</span>
                <div className="h-px w-14 bg-amber-400/60" />
              </div>

              <p className="font-serif text-xl font-semibold italic text-amber-700">
                Together We Serve
              </p>

              <p className="mt-2 text-xs font-semibold tracking-[0.25em] text-slate-400">
                NABABI RISTORANTE ADMIN
              </p>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600" />
        </div>
      </div>
    </main>
  );
}
