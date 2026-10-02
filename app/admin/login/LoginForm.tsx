```tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const LOGO_STORAGE_KEY = "nababi-logo";

export default function LoginForm() {
  const [logo, setLogo] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);

    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.25)), url('/login-restaurant-bg.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-amber-400/40 bg-black/70 p-7 shadow-2xl backdrop-blur-md sm:p-9">

          {/* Logo */}
          <div className="mb-6 text-center">
            {logo ? (
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/70 bg-black/60">
                <img
                  src={logo}
                  alt="Nababi Ristorante"
                  className="h-full w-full object-contain p-2"
                />
              </div>
            ) : (
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-400/70 bg-black/60 text-4xl">
                👑
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-wide text-amber-300 sm:text-4xl">
              NABABI RISTORANTE
            </h1>

            <p className="mt-3 text-lg font-medium text-white/80">
              Administrator Login
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-semibold text-white"
              >
                Email
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-amber-300">
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter admin email"
                  required
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-semibold text-white"
              >
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-amber-300">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 pl-12 pr-14 text-base text-white outline-none placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-2 text-xl text-amber-300"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-center text-sm font-semibold text-red-200">
                {error}
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-4 text-lg font-bold text-black shadow-lg transition hover:from-amber-400 hover:to-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 border-t border-white/10 pt-5 text-center">
            <p className="text-sm text-white/60">
              Together We Serve
            </p>

            <p className="mt-1 text-sm font-semibold text-amber-300">
              Nababi Ristorante Admin
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
```
