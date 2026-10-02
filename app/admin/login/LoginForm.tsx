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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 py-8">
      {/* Luxury background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_0%_100%,rgba(180,83,9,0.20),transparent_35%),radial-gradient(circle_at_100%_80%,rgba(251,191,36,0.12),transparent_30%)]" />

      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-amber-500/10" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full border border-amber-500/10" />

      <div className="absolute left-6 top-12 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_30px_10px_rgba(245,158,11,0.25)]" />
      <div className="absolute right-10 top-28 h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_30px_10px_rgba(251,146,60,0.20)]" />
      <div className="absolute bottom-24 left-12 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_30px_10px_rgba(250,204,21,0.18)]" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-xl">
        <div className="overflow-hidden rounded-[34px] border border-amber-400/40 bg-[#fffdf8] shadow-[0_35px_100px_rgba(0,0,0,0.60)]">

          {/* Top gold line */}
          <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />

          <div className="px-6 py-9 sm:px-12 sm:py-12">

            {/* Logo */}
            <div className="mb-7 flex justify-center">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-amber-500/30 bg-white p-2 shadow-[0_15px_40px_rgba(180,83,9,0.20)] sm:h-36 sm:w-36">
                <div className="absolute inset-1 rounded-full border border-amber-400/30" />

                {logo ? (
                  <img
                    src={logo}
                    alt="Nababi Ristorante"
                    className="relative h-full w-full rounded-full object-contain p-2"
                  />
                ) : (
                  <div className="relative text-center">
                    <div className="mb-1 text-5xl text-amber-500">
                      ♛
                    </div>

                    <div className="font-serif text-lg font-bold tracking-[0.18em] text-slate-900">
                      NABABI
                    </div>

                    <div className="mt-1 text-[10px] tracking-[0.32em] text-amber-600">
                      RISTORANTE
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Heading */}
            <div className="mb-9 text-center">
              <h1 className="font-serif text-4xl font-bold tracking-wide text-slate-900 sm:text-5xl">
                NABABI RISTORANTE
              </h1>

              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-amber-500" />

                <p className="text-base font-bold tracking-[0.12em] text-slate-700 sm:text-lg">
                  Administrator Login
                </p>

                <div className="h-px w-12 bg-amber-500" />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
                Welcome back! Please sign in to continue.
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-2 block text-base font-bold text-slate-800 sm:text-lg"
                >
                  Email
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </div>

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
                    placeholder="Enter your email address"
                    className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-16 pr-4 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.10)] sm:text-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-base font-bold text-slate-800 sm:text-lg"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      <path d="M12 14v2" />
                    </svg>
                  </div>

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
                    className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-16 pr-16 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.10)] sm:text-lg"
                  />

                  {/* Show / Hide password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 8a11.5 11.5 0 0 1-3.1 5.1" />
                        <path d="M6.6 6.6C4.6 7.9 3.4 10 2.5 12c1 4 4.5 8 9.5 8 1 0 2-.2 2.9-.5" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6"
                      >
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Sign In */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-lg font-extrabold tracking-wide text-white shadow-[0_12px_30px_rgba(234,88,12,0.30)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(234,88,12,0.38)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 5v14" />
                </svg>

                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-9 text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-amber-400/50" />

                <span className="text-xl text-amber-500">
                  ♛
                </span>

                <div className="h-px w-16 bg-amber-400/50" />
              </div>

              <p className="font-serif text-xl font-semibold italic text-amber-600">
                Together We Serve
              </p>

              <p className="mt-2 text-sm font-medium tracking-wide text-slate-400">
                NABABI RISTORANTE ADMIN
              </p>
            </div>
          </div>

          {/* Bottom gold line */}
          <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />
        </div>
      </div>
    </main>
  );
}
