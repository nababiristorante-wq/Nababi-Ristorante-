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
    <main className="relative min-h-screen overflow-hidden bg-[#090807]">

      {/* Luxury Restaurant Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(245,158,11,0.22),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(180,83,9,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.12),transparent_35%)]" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#100d09] via-[#1b140d] to-[#050505]" />

        {/* Restaurant lights */}
        <div className="absolute left-[8%] top-[12%] h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_45px_18px_rgba(245,158,11,0.28)]" />

        <div className="absolute right-[12%] top-[18%] h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_40px_15px_rgba(250,204,21,0.22)]" />

        <div className="absolute left-[18%] bottom-[22%] h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_35px_14px_rgba(251,146,60,0.20)]" />

        {/* Decorative restaurant arches */}
        <div className="absolute -left-32 top-20 h-[620px] w-[420px] rounded-[220px] border border-amber-500/10" />

        <div className="absolute -right-32 bottom-10 h-[650px] w-[430px] rounded-[220px] border border-amber-500/10" />

        {/* Warm floor glow */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-950/30 to-transparent" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Login Area */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">

        <div className="w-full max-w-xl">

          {/* Login Card */}
          <div className="overflow-hidden rounded-[32px] border border-amber-400/70 bg-[#fffdf7]/95 shadow-[0_35px_100px_rgba(0,0,0,0.65)] backdrop-blur-md">

            {/* Gold Top Border */}
            <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600" />

            <div className="px-6 py-8 sm:px-12 sm:py-10">

              {/* Logo */}
              <div className="mb-6 flex justify-center">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[3px] border-amber-500 bg-[#fffdf8] p-2 shadow-[0_12px_35px_rgba(180,83,9,0.25)] sm:h-36 sm:w-36">

                  <div className="absolute inset-1 rounded-full border border-amber-400/40" />

                  {logo ? (
                    <img
                      src={logo}
                      alt="Nababi Ristorante"
                      className="relative h-full w-full rounded-full object-contain p-2"
                    />
                  ) : (
                    <div className="relative text-center">
                      <div className="text-5xl text-amber-600">
                        ♛
                      </div>

                      <div className="mt-1 font-serif text-xl font-bold tracking-[0.16em] text-slate-900">
                        NABABI
                      </div>

                      <div className="mt-1 text-[9px] tracking-[0.35em] text-amber-700">
                        RISTORANTE
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="mb-8 text-center">

                <h1 className="font-serif text-3xl font-bold tracking-[0.12em] text-slate-900 sm:text-4xl">
                  NABABI RISTORANTE
                </h1>

                <div className="mt-4 flex items-center justify-center gap-3">

                  <div className="h-px w-12 bg-amber-500" />

                  <span className="text-lg text-amber-600">
                    ♛
                  </span>

                  <div className="h-px w-12 bg-amber-500" />

                </div>

                <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-800 sm:text-3xl">
                  Administrator Login
                </h2>

                <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                  Please sign in to access your admin panel
                </p>

              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="mb-5">

                  <label
                    htmlFor="email"
                    className="mb-2 block text-base font-bold text-slate-800"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <div className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-amber-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
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
                      placeholder="Email Address"
                      className="h-16 w-full rounded-2xl border border-[#d9c9aa] bg-[#fffdfa] pl-14 pr-4 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                    />

                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">

                  <label
                    htmlFor="password"
                    className="mb-2 block text-base font-bold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <div className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-amber-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Password"
                      className="h-16 w-full rounded-2xl border border-[#d9c9aa] bg-[#fffdfa] pl-14 pr-14 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
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
                          strokeWidth="1.8"
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
                          strokeWidth="1.8"
                          className="h-6 w-6"
                        >
                          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />

                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                          />
                        </svg>
                      )}
                    </button>

                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Sign In */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#d99722] via-[#f2b544] to-[#c98516] text-lg font-bold text-white shadow-[0_12px_30px_rgba(180,115,20,0.30)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(180,115,20,0.38)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 5v14" />
                  </svg>

                  {loading
                    ? "Signing In..."
                    : "Sign In"}

                </button>

              </form>

              {/* Footer */}
              <div className="mt-8 text-center">

                <div className="mb-3 flex items-center justify-center gap-3">

                  <div className="h-px w-14 bg-amber-400/60" />

                  <span className="text-lg text-amber-600">
                    ♛
                  </span>

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

            {/* Gold Bottom Border */}
            <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600" />

          </div>
        </div>
      </div>
    </main>
  );
}
