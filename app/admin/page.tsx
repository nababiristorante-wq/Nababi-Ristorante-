"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Module = {
  title: string;
  href: string;
  icon: string;
  gradient: string;
};

const modules: Module[] = [
  { title: "Menu", href: "/admin/menu", icon: "🍽️", gradient: "from-amber-500 to-orange-600" },
  { title: "Reservations", href: "/admin/reservations", icon: "📅", gradient: "from-yellow-500 to-amber-600" },
  { title: "Website Status", href: "/admin/website-status", icon: "🌐", gradient: "from-yellow-400 to-yellow-700" },
  { title: "Home", href: "/admin/home", icon: "🏠", gradient: "from-amber-400 to-yellow-600" },
  { title: "Gallery", href: "/admin/gallery", icon: "🖼️", gradient: "from-orange-400 to-amber-600" },
  { title: "About", href: "/admin/about", icon: "ℹ️", gradient: "from-yellow-400 to-orange-600" },
  { title: "Breaking News", href: "/admin/breaking-news", icon: "📢", gradient: "from-red-500 to-amber-500" },
  { title: "Promotions", href: "/admin/promotions", icon: "🎁", gradient: "from-amber-400 to-orange-500" },
  { title: "Reviews", href: "/admin/reviews", icon: "⭐", gradient: "from-yellow-300 to-amber-500" },
  { title: "Contact", href: "/admin/contact", icon: "📍", gradient: "from-emerald-500 to-yellow-600" },
  { title: "Opening Hours", href: "/admin/opening-hours", icon: "🕐", gradient: "from-cyan-500 to-yellow-600" },
  { title: "Social Media", href: "/admin/social-media", icon: "📱", gradient: "from-pink-500 to-amber-500" },
  { title: "Languages", href: "/admin/languages", icon: "🌍", gradient: "from-indigo-500 to-yellow-500" },
  { title: "Settings", href: "/admin/settings", icon: "⚙️", gradient: "from-slate-400 to-amber-600" },
  { title: "Admin Profile", href: "/admin/profile", icon: "👤", gradient: "from-violet-500 to-amber-500" },
];

const LOGO_STORAGE_KEY = "nababi-logo";

export default function AdminDashboard() {
  const [restaurantName, setRestaurantName] = useState("Nababi Ristorante");
  const [websiteOnline, setWebsiteOnline] = useState(true);

  const [logo, setLogo] = useState("");
  const [logoOpen, setLogoOpen] = useState(false);
  const [logoMessage, setLogoMessage] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    try {
      const settings = localStorage.getItem("nababi-settings");

      if (settings) {
        const parsed = JSON.parse(settings);

        if (parsed.restaurantName) {
          setRestaurantName(parsed.restaurantName);
        }

        setWebsiteOnline(!parsed.maintenanceMode);
      }

      const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);

      if (savedLogo) {
        setLogo(savedLogo);
      }
    } catch {}
  }, []);

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLogoMessage("");
    setIsUploadingLogo(true);

    if (!file.type.startsWith("image/")) {
      setLogoMessage("Please select a valid image file.");
      setIsUploadingLogo(false);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setLogoMessage("Logo must be smaller than 3MB.");
      setIsUploadingLogo(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        try {
          localStorage.setItem(LOGO_STORAGE_KEY, result);
          setLogo(result);
          setLogoMessage("Logo updated successfully.");
        } catch {
          setLogoMessage("Logo could not be saved.");
        }
      }

      setIsUploadingLogo(false);
    };

    reader.onerror = () => {
      setLogoMessage("Unable to read the logo image.");
      setIsUploadingLogo(false);
    };

    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    localStorage.removeItem(LOGO_STORAGE_KEY);
    setLogo("");
    setLogoMessage("Default logo restored.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,164,55,0.16),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(184,134,11,0.10),transparent_28%),linear-gradient(135deg,#050505,#0b0b0b,#050505)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-amber-500/5 blur-[110px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        {/* SMALL HEADER */}
        <header className="mb-5 flex items-center justify-between rounded-[24px] border border-yellow-500/20 bg-[#0b0b0b]/90 px-4 py-4 shadow-xl backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-yellow-500/30 bg-black">
              {logo ? (
                <img
                  src={logo}
                  alt={restaurantName}
                  className="h-full w-full object-contain p-1.5"
                />
              ) : (
                <div className="text-center">
                  <div className="text-lg text-yellow-400">♛</div>
                  <div className="font-serif text-[8px] font-bold italic text-yellow-300">
                    Nababi
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-bold text-white">
                {restaurantName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              title="View Website"
              aria-label="View Website"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition hover:border-yellow-500/30 hover:bg-yellow-500/10"
            >
              🌐
            </Link>

            <div
              title={websiteOnline ? "Website Online" : "Maintenance"}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                websiteOnline
                  ? "border-green-400/20 bg-green-500/5"
                  : "border-yellow-400/20 bg-yellow-500/5"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  websiteOnline
                    ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                    : "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                }`}
              />
            </div>
          </div>
        </header>

        {/* ICON GRID */}
        <section className="flex-1">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {/* LOGO */}
            <button
              type="button"
              onClick={() => {
                setLogoMessage("");
                setLogoOpen(true);
              }}
              title="Logo"
              aria-label="Logo"
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[20px] border border-yellow-500/20 bg-[#0b0b0b] shadow-lg transition duration-200 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-[#111111]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 opacity-70 transition group-hover:opacity-100" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black/40 text-3xl">
                🏷️
              </div>
            </button>

            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                title={module.title}
                aria-label={module.title}
                className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0b0b] shadow-lg transition duration-200 hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-[#111111]"
              >
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${module.gradient} opacity-10 blur-2xl transition group-hover:opacity-25`}
                />

                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${module.gradient} bg-opacity-10 text-3xl shadow-lg transition duration-200 group-hover:scale-105`}
                >
                  {module.icon}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTER - ICON ONLY */}
        <footer className="py-6 text-center">
          <div className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
          <div className="mt-4 text-lg text-yellow-500">♛</div>
        </footer>
      </div>

      {/* LOGO EDIT PANEL */}
      {logoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLogoOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-[26px] border border-yellow-500/20 bg-[#0b0b0b] p-5 shadow-[0_25px_100px_rgba(0,0,0,0.7)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-2xl">
                🏷️
              </div>

              <button
                type="button"
                onClick={() => setLogoOpen(false)}
                title="Close"
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mb-5 flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-yellow-500/20 bg-black/60">
              {logo ? (
                <img
                  src={logo}
                  alt={restaurantName}
                  className="max-h-[150px] max-w-[80%] object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="text-5xl text-yellow-400">♛</div>
                  <div className="font-serif text-3xl font-bold italic text-yellow-300">
                    Nababi
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex min-h-[105px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-center transition hover:border-yellow-400/40 hover:bg-yellow-500/10">
                <span className="text-3xl">
                  {isUploadingLogo ? "⏳" : "📤"}
                </span>
                <span className="mt-2 text-xs font-bold text-yellow-300">
                  {isUploadingLogo ? "Uploading" : "Change"}
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={removeLogo}
                disabled={!logo}
                className="flex min-h-[105px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-center transition hover:border-red-400/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="text-3xl">🗑️</span>
                <span className="mt-2 text-xs font-bold text-red-300">
                  Remove
                </span>
              </button>
            </div>

            {logoMessage && (
              <div className="mt-4 rounded-xl border border-yellow-500/15 bg-yellow-500/5 px-4 py-3 text-center text-xs text-yellow-300">
                {logoMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
