"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Module = {
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
};

const modules: Module[] = [
  {
    title: "Menu Management",
    description: "Manage food items, categories and menu images.",
    href: "/admin/menu",
    icon: "🍽️",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Reservations",
    description: "View and manage customer table reservations.",
    href: "/admin/reservations",
    icon: "📅",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    title: "Website Status",
    description: "Control website online and maintenance status.",
    href: "/admin/website-status",
    icon: "🌐",
    gradient: "from-yellow-400 to-yellow-700",
  },
  {
    title: "Home Page",
    description: "Manage hero, welcome and booking sections.",
    href: "/admin/home",
    icon: "🏠",
    gradient: "from-amber-400 to-yellow-600",
  },
  {
    title: "Gallery",
    description: "Upload and manage restaurant gallery images.",
    href: "/admin/gallery",
    icon: "🖼️",
    gradient: "from-orange-400 to-amber-600",
  },
  {
    title: "About",
    description: "Manage restaurant about content and image.",
    href: "/admin/about",
    icon: "ℹ️",
    gradient: "from-yellow-400 to-orange-600",
  },
  {
    title: "Breaking News",
    description:
      "Create and manage website news, images and videos.",
    href: "/admin/breaking-news",
    icon: "📢",
    gradient: "from-red-500 to-amber-500",
  },
  {
    title: "Promotions",
    description:
      "Manage special offers and promotional campaigns.",
    href: "/admin/promotions",
    icon: "🎁",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Reviews",
    description: "Manage customer reviews and ratings.",
    href: "/admin/reviews",
    icon: "⭐",
    gradient: "from-yellow-300 to-amber-500",
  },
  {
    title: "Contact",
    description:
      "Manage address, phone, email and map details.",
    href: "/admin/contact",
    icon: "📍",
    gradient: "from-emerald-500 to-yellow-600",
  },
  {
    title: "Opening Hours",
    description:
      "Manage weekly opening and break hours.",
    href: "/admin/opening-hours",
    icon: "🕐",
    gradient: "from-cyan-500 to-yellow-600",
  },
  {
    title: "Social Media",
    description:
      "Manage Facebook, Instagram, TikTok, YouTube and WhatsApp.",
    href: "/admin/social-media",
    icon: "📱",
    gradient: "from-pink-500 to-amber-500",
  },
  {
    title: "Languages",
    description:
      "Manage Italian, English and Bengali languages.",
    href: "/admin/languages",
    icon: "🌍",
    gradient: "from-indigo-500 to-yellow-500",
  },
  {
    title: "Settings",
    description:
      "Manage restaurant and website settings.",
    href: "/admin/settings",
    icon: "⚙️",
    gradient: "from-slate-400 to-amber-600",
  },
  {
    title: "Admin Profile",
    description:
      "Manage admin profile and security settings.",
    href: "/admin/profile",
    icon: "👤",
    gradient: "from-violet-500 to-amber-500",
  },
];

const LOGO_STORAGE_KEY = "nababi-logo";

export default function AdminDashboard() {
  const [restaurantName, setRestaurantName] =
    useState("Nababi Ristorante");

  const [websiteOnline, setWebsiteOnline] =
    useState(true);

  const [reservationCount, setReservationCount] =
    useState(0);

  const [menuCount, setMenuCount] =
    useState(0);

  const [galleryCount, setGalleryCount] =
    useState(0);

  const [logo, setLogo] = useState("");

  const [logoMessage, setLogoMessage] =
    useState("");

  const [isUploadingLogo, setIsUploadingLogo] =
    useState(false);

  useEffect(() => {
    const settings =
      localStorage.getItem("nababi-settings");

    if (settings) {
      try {
        const parsed = JSON.parse(settings);

        if (parsed.restaurantName) {
          setRestaurantName(parsed.restaurantName);
        }

        setWebsiteOnline(!parsed.maintenanceMode);
      } catch {}
    }

    const reservations =
      localStorage.getItem(
        "nababi-reservations"
      );

    if (reservations) {
      try {
        const parsed = JSON.parse(reservations);

        if (Array.isArray(parsed)) {
          setReservationCount(parsed.length);
        }
      } catch {}
    }

    const menu =
      localStorage.getItem("nababi-menu");

    if (menu) {
      try {
        const parsed = JSON.parse(menu);

        if (Array.isArray(parsed)) {
          setMenuCount(parsed.length);
        }
      } catch {}
    }

    const gallery =
      localStorage.getItem("nababi-gallery");

    if (gallery) {
      try {
        const parsed = JSON.parse(gallery);

        if (Array.isArray(parsed)) {
          setGalleryCount(parsed.length);
        }
      } catch {}
    }

    const savedLogo =
      localStorage.getItem(LOGO_STORAGE_KEY);

    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLogoMessage("");
    setIsUploadingLogo(true);

    if (!file.type.startsWith("image/")) {
      setLogoMessage(
        "Please select a valid image file."
      );
      setIsUploadingLogo(false);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setLogoMessage(
        "Logo must be smaller than 3MB."
      );
      setIsUploadingLogo(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        localStorage.setItem(
          LOGO_STORAGE_KEY,
          result
        );

        setLogo(result);

        setLogoMessage(
          "Logo updated successfully."
        );
      }

      setIsUploadingLogo(false);
    };

    reader.onerror = () => {
      setLogoMessage(
        "Unable to read the logo image."
      );

      setIsUploadingLogo(false);
    };

    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    localStorage.removeItem(
      LOGO_STORAGE_KEY
    );

    setLogo("");

    setLogoMessage(
      "Logo removed. Default logo will be used."
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* =========================
          BACKGROUND
      ========================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,164,55,0.16),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(184,134,11,0.10),transparent_28%),linear-gradient(135deg,#050505,#0b0b0b,#050505)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-amber-500/5 blur-[110px]" />

      {/* =========================
          MAIN WRAPPER
      ========================== */}

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* =========================
            TOP HEADER
        ========================== */}

        <header className="mb-6 overflow-hidden rounded-[28px] border border-yellow-500/20 bg-[#0b0b0b]/90 shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            {/* BRAND */}

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-yellow-500/30 bg-black shadow-[0_0_30px_rgba(212,164,55,0.08)]">
                {logo ? (
                  <img
                    src={logo}
                    alt={restaurantName}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-xl text-yellow-400">
                      ♛
                    </div>

                    <div className="font-serif text-[11px] font-bold italic text-yellow-300">
                      Nababi
                    </div>

                    <div className="text-[6px] tracking-[2px] text-yellow-600">
                      RISTORANTE
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-1 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400">
                  Admin Panel
                </div>

                <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                  {restaurantName}
                </h1>

                <p className="mt-1 text-xs text-white/40 sm:text-sm">
                  Restaurant Management Dashboard
                </p>
              </div>
            </div>

            {/* HEADER RIGHT */}

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-300"
              >
                🌐 View Website
              </Link>

              <div
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 ${
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

                <span className="text-xs font-semibold text-white/80">
                  {websiteOnline
                    ? "Website Online"
                    : "Maintenance"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        </header>

        {/* =========================
            LOGO MANAGEMENT
        ========================== */}

        <section className="mb-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
                Branding
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                Logo & Branding
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Change the logo used across your restaurant website.
              </p>
            </div>

            <div className="rounded-full border border-yellow-500/15 bg-yellow-500/5 px-3 py-1.5 text-[10px] text-yellow-400">
              Home Page Logo
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            {/* LOGO PREVIEW */}

            <div className="relative overflow-hidden rounded-[26px] border border-yellow-500/20 bg-[#0b0b0b] p-6 shadow-xl">
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-yellow-500/5 blur-3xl" />

              <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-yellow-500/25 bg-black/70">
                {logo ? (
                  <img
                    src={logo}
                    alt={`${restaurantName} Logo`}
                    className="max-h-[170px] max-w-[75%] object-contain drop-shadow-[0_0_25px_rgba(212,164,55,0.12)]"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mb-2 text-5xl text-yellow-400">
                      ♛
                    </div>

                    <div className="font-serif text-4xl font-bold italic text-yellow-300">
                      Nababi
                    </div>

                    <div className="mt-1 text-[10px] font-semibold tracking-[5px] text-yellow-600">
                      RISTORANTE
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Current Logo
                </p>

                <p className="mt-1 text-sm text-white/70">
                  {logo
                    ? "Custom logo is active"
                    : "Default logo is active"}
                </p>
              </div>
            </div>

            {/* LOGO ACTIONS */}

            <div className="rounded-[26px] border border-yellow-500/20 bg-[#0b0b0b] p-6 shadow-xl">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white">
                  Manage Website Logo
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Upload your restaurant logo here.
                  The saved logo uses the same storage key
                  on the Home Page.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="group flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-yellow-500/25 bg-yellow-500/5 p-5 text-center transition hover:border-yellow-400/50 hover:bg-yellow-500/10">
                  <span className="mb-2 text-3xl">
                    {isUploadingLogo
                      ? "⏳"
                      : "📤"}
                  </span>

                  <span className="text-sm font-bold text-yellow-300">
                    {isUploadingLogo
                      ? "Uploading..."
                      : "Upload / Change Logo"}
                  </span>

                  <span className="mt-1 text-[10px] text-white/35">
                    PNG, JPG, WEBP or SVG · Max 3MB
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
                  className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-center transition hover:border-red-400/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span className="mb-2 text-3xl">
                    🗑️
                  </span>

                  <span className="text-sm font-bold text-red-300">
                    Remove Logo
                  </span>

                  <span className="mt-1 text-[10px] text-white/35">
                    Restore default restaurant logo
                  </span>
                </button>
              </div>

              {logoMessage && (
                <div className="mt-4 rounded-xl border border-yellow-500/15 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-300">
                  {logoMessage}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.025] p-4">
                <div className="flex gap-3">
                  <span className="text-yellow-400">
                    ✦
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-white/80">
                      Logo synchronization
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-white/35">
                      This dashboard saves the logo as
                      <span className="mx-1 rounded bg-white/5 px-1 text-yellow-500">
                        nababi-logo
                      </span>
                      in local storage. Your Home Page can
                      read the same value and display the
                      selected logo automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            OVERVIEW
        ========================== */}

        <section className="mb-7">
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
              Overview
            </div>

            <h2 className="mt-1 font-serif text-2xl font-bold text-white">
              Restaurant Overview
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* MENU */}

            <div className="group relative overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-500/10 blur-3xl transition group-hover:bg-yellow-500/20" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/15 bg-yellow-500/5 text-xl">
                    🍽️
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-yellow-500/60">
                    Menu
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-wider text-white/35">
                  Menu Items
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {menuCount}
                </p>

                <div className="mt-3 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
              </div>
            </div>

            {/* RESERVATIONS */}

            <div className="group relative overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-500/10 blur-3xl transition group-hover:bg-amber-500/20" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/15 bg-yellow-500/5 text-xl">
                    📅
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-yellow-500/60">
                    Bookings
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-wider text-white/35">
                  Reservations
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {reservationCount}
                </p>

                <div className="mt-3 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
              </div>
            </div>

            {/* GALLERY */}

            <div className="group relative overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/10 blur-3xl transition group-hover:bg-orange-500/20" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/15 bg-yellow-500/5 text-xl">
                    🖼️
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-yellow-500/60">
                    Gallery
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-wider text-white/35">
                  Gallery Images
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {galleryCount}
                </p>

                <div className="mt-3 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            QUICK ACCESS
        ========================== */}

        <section className="mb-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
                Shortcuts
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                Quick Access
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/"
              className="group rounded-[24px] border border-white/10 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-[#101010]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-3xl">
                  🌐
                </div>

                <span className="text-yellow-500 opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>

              <h3 className="font-bold text-white">
                View Website
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Open public website
              </p>
            </Link>

            <Link
              href="/admin/menu"
              className="group rounded-[24px] border border-white/10 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-[#101010]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-3xl">
                  🍽️
                </div>

                <span className="text-yellow-500 opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>

              <h3 className="font-bold text-white">
                Manage Menu
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Manage dishes
              </p>
            </Link>

            <Link
              href="/admin/reservations"
              className="group rounded-[24px] border border-white/10 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-[#101010]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-3xl">
                  📅
                </div>

                <span className="text-yellow-500 opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>

              <h3 className="font-bold text-white">
                Reservations
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Customer bookings
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="group rounded-[24px] border border-white/10 bg-[#0b0b0b] p-5 shadow-xl transition hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-[#101010]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-3xl">
                  ⚙️
                </div>

                <span className="text-yellow-500 opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>

              <h3 className="font-bold text-white">
                Settings
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Website settings
              </p>
            </Link>
          </div>
        </section>

        {/* =========================
            MANAGEMENT
        ========================== */}

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
                Administration
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                Management
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Manage every part of your restaurant website.
              </p>
            </div>

            <span className="w-fit rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-xs font-semibold text-yellow-400">
              {modules.length} Modules
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0b0b] p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-[#101010]"
              >
                {/* GOLD GLOW */}

                <div
                  className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${module.gradient} opacity-10 blur-3xl transition group-hover:opacity-25`}
                />

                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-500/15 bg-gradient-to-br ${module.gradient} bg-opacity-10 text-2xl shadow-lg`}
                    >
                      {module.icon}
                    </div>

                    <span className="text-xl text-yellow-500/30 transition group-hover:text-yellow-400">
                      →
                    </span>
                  </div>

                  <h3 className="font-bold text-white">
                    {module.title}
                  </h3>

                  <p className="mt-2 min-h-[40px] text-xs leading-5 text-white/35">
                    {module.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-yellow-500/70 transition group-hover:text-yellow-300">
                    Manage
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================
            FOOTER
        ========================== */}

        <footer className="py-10 text-center">
          <div className="mx-auto mb-5 h-px max-w-xl bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <div className="mb-2 text-lg text-yellow-500">
            ♛
          </div>

          <p className="font-serif text-sm italic text-yellow-400/70">
            Good Food · Good Mood
          </p>

          <p className="mt-3 text-[10px] text-white/25">
            © {new Date().getFullYear()}{" "}
            {restaurantName}
            {" · "}Admin Management Panel
          </p>
        </footer>
      </div>
    </main>
  );
        }
