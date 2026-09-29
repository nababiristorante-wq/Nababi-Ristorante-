"use client";

import { FormEvent, useEffect, useState } from "react";

type AdminProfile = {
  name: string;
  email: string;
  profileVisible: boolean;
  loginSecurity: boolean;
};

type PasswordSettings = {
  password: string;
  confirmPassword: string;
};

const PROFILE_KEY = "nababi-admin-profile";
const PASSWORD_KEY = "nababi-admin-password";

const defaultProfile: AdminProfile = {
  name: "Admin",
  email: "",
  profileVisible: true,
  loginSecurity: true,
};

const defaultPassword: PasswordSettings = {
  password: "",
  confirmPassword: "",
};

export default function AdminProfilePage() {
  const [profile, setProfile] =
    useState<AdminProfile>(defaultProfile);

  const [password, setPassword] =
    useState<PasswordSettings>(defaultPassword);

  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    const storedProfile =
      localStorage.getItem(PROFILE_KEY);

    if (storedProfile) {
      try {
        setProfile({
          ...defaultProfile,
          ...JSON.parse(storedProfile),
        });
      } catch {
        setProfile(defaultProfile);
      }
    }

    const storedPassword =
      localStorage.getItem(PASSWORD_KEY);

    if (storedPassword) {
      try {
        const parsed = JSON.parse(storedPassword);

        if (parsed.password) {
          setPassword({
            password: "",
            confirmPassword: "",
          });
        }
      } catch {
        setPassword(defaultPassword);
      }
    }
  }, []);

  const updateProfile = (
    field: keyof AdminProfile,
    value: string | boolean
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePassword = (
    field: keyof PasswordSettings,
    value: string
  ) => {
    setPassword((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProfileSave = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!profile.name.trim()) {
      alert("Admin name is required.");
      return;
    }

    if (
      profile.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        profile.email
      )
    ) {
      alert("Please enter a valid email address.");
      return;
    }

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const handlePasswordSave = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!password.password) {
      alert("Please enter a new password.");
      return;
    }

    if (password.password.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (
      password.password !== password.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      PASSWORD_KEY,
      JSON.stringify({
        password: password.password,
      })
    );

    setPassword(defaultPassword);
    setPasswordSaved(true);

    window.setTimeout(() => {
      setPasswordSaved(false);
    }, 1800);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset admin profile settings?"
    );

    if (!confirmed) return;

    setProfile(defaultProfile);
    setPassword(defaultPassword);

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(defaultProfile)
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] px-4 py-8 sm:px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Center */}
      <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <header className="mb-7 text-center">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-100 shadow-lg backdrop-blur-xl">
              Nababi Ristorante
            </div>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Admin Profile & Security
            </h1>
          </header>

          <div className="space-y-5">
            {/* Profile */}
            <form
              onSubmit={handleProfileSave}
              className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
            >
              <section className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-bold text-white">
                  Admin Profile
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Admin Name
                    </label>

                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        updateProfile(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Admin"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Admin Email
                    </label>

                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        updateProfile(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="admin@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                    />
                  </div>
                </div>
              </section>

              {/* Profile Visibility */}
              <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-white">
                  Profile Settings
                </h2>

                <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div>
                    <p className="font-bold text-white">
                      Profile Visibility
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Show admin profile information in the dashboard.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.profileVisible}
                    onChange={(e) =>
                      updateProfile(
                        "profileVisible",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>
              </section>

              {/* Security */}
              <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-white">
                  Login Security
                </h2>

                <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div>
                    <p className="font-bold text-white">
                      Enhanced Login Security
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Keep additional security protection enabled.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.loginSecurity}
                    onChange={(e) =>
                      updateProfile(
                        "loginSecurity",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>
              </section>

              {/* Buttons */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-10 py-3.5 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01] sm:w-auto"
                >
                  Save Profile
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-10 py-3.5 font-semibold text-white transition hover:bg-white/15 sm:w-auto"
                >
                  Reset
                </button>
              </div>

              {saved && (
                <div className="mx-auto mt-4 max-w-md rounded-2xl border border-green-300/20 bg-green-500/10 px-4 py-3 text-center text-sm font-semibold text-green-200">
                  Admin profile saved successfully.
                </div>
              )}
            </form>

            {/* Change Password */}
            <form
              onSubmit={handlePasswordSave}
              className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
            >
              <section className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-bold text-white">
                  Change Password
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={password.password}
                      onChange={(e) =>
                        updatePassword(
                          "password",
                          e.target.value
                        )
                      }
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={password.confirmPassword}
                      onChange={(e) =>
                        updatePassword(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Confirm new password"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                    />
                  </div>
                </div>
              </section>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-10 py-3.5 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01] sm:w-auto"
                >
                  Update Password
                </button>
              </div>

              {passwordSaved && (
                <div className="mx-auto mt-4 max-w-md rounded-2xl border border-green-300/20 bg-green-500/10 px-4 py-3 text-center text-sm font-semibold text-green-200">
                  Password updated successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}