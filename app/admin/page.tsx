"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Module = {
  title: string;
  href: string;
  icon: string;
  gradient: string;
};

type Stats = {
  gallery: number;
  reservations: number;
  reviews: number;
  promotions: number;
  menu: number;
  breakingNews: number;
};

const modules: Module[] = [
  { title: "Menu", href: "/admin/menu", icon: "🍽️", gradient: "from-blue-500 to-cyan-500" },
  { title: "Reservations", href: "/admin/reservations", icon: "📅", gradient: "from-emerald-500 to-green-500" },
  { title: "Website Status", href: "/admin/website-status", icon: "🌐", gradient: "from-sky-500 to-blue-600" },
  { title: "Home", href: "/admin/home", icon: "🏠", gradient: "from-red-500 to-orange-500" },
  { title: "Gallery", href: "/admin/gallery", icon: "🖼️", gradient: "from-blue-500 to-indigo-500" },
  { title: "About", href: "/admin/about", icon: "ℹ️", gradient: "from-blue-500 to-cyan-500" },
  { title: "Breaking News", href: "/admin/breaking-news", icon: "📰", gradient: "from-slate-500 to-blue-600" },
  { title: "Promotions", href: "/admin/promotions", icon: "🎁", gradient: "from-purple-500 to-fuchsia-500" },
  { title: "Reviews", href: "/admin/reviews", icon: "⭐", gradient: "from-amber-400 to-orange-500" },
  { title: "Contact", href: "/admin/contact", icon: "📞", gradient: "from-emerald-500 to-green-600" },
  { title: "Opening Hours", href: "/admin/opening-hours", icon: "🕐", gradient: "from-slate-600 to-slate-800" },
  { title: "Social Media", href: "/admin/social-media", icon: "🔗", gradient: "from-blue-500 to-indigo-500" },
  { title: "Languages", href: "/admin/languages", icon: "🌍", gradient: "from-violet-500 to-purple-600" },
  { title: "Settings", href: "/admin/settings", icon: "⚙️", gradient: "from-slate-500 to-slate-800" },
  { title: "Admin Profile", href: "/admin/profile", icon: "👤", gradient: "from-blue-600 to-slate-700" },
];

const LOGO_STORAGE_KEY = "nababi-logo";

const EMPTY_STATS: Stats = {
  gallery: 0,
  reservations: 0,
  reviews: 0,
  promotions: 0,
  menu: 0,
  breakingNews: 0,
};

function readArray(key: string): any[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getMenuCount(): number {
  try {
    const menu = readArray("nababi-menu");
    return menu.length;
  } catch {
    return 0;
  }
}

function getActiveBreakingNewsCount(): number {
  const news = readArray("nababi-breaking-news");
  const now = new Date();

  return news.filter((item) => {
    if (item.visible === false) return false;

    const start = item.startDate ? new Date(item.startDate) : null;
    const end = item.endDate ? new Date(item.endDate) : null;

    if (start && !Number.isNaN(start.getTime()) && now < start) return false;
    if (end && !Number.isNaN(end.getTime()) && now > end) return false;

    return true;
  }).length;
}

export default function AdminDashboard() {
  const [restaurantName, setRestaurantName] = useState("Nababi Ristorante");
  const [websiteOnline, setWebsiteOnline] = useState(true);
  const [logo, setLogo] = useState("");
  const [logoOpen, setLogoOpen] = useState(false);
  const [logoMessage, setLogoMessage] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  const loadDashboard = () => {
    try {
      const settings = localStorage.getItem("nababi-settings");

      if (settings) {
        const parsed = JSON.parse(settings);
        if (parsed.restaurantName) setRestaurantName(parsed.restaurantName);
        setWebsiteOnline(!parsed.maintenanceMode);
      }

      const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
      setLogo(savedLogo || "");

      const gallery = readArray("nababi-gallery");
      const reservations = readArray("nababi-reservations");
      const reviews = readArray("nababi-reviews");
      const promotions = readArray("nababi-promotions");

      setStats({
        gallery: gallery.length,
        reservations: reservations.length,
        reviews: reviews.length,
        promotions: promotions.length,
        menu: getMenuCount(),
        breakingNews: getActiveBreakingNewsCount(),
      });
    } catch {
      setStats(EMPTY_STATS);
    }
  };

  useEffect(() => {
    loadDashboard();

    const handleStorage = () => loadDashboard();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleStorage);
    };
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      if (typeof reader.result === "string") {
        try {
          localStorage.setItem(LOGO_STORAGE_KEY, reader.result);
          setLogo(reader.result);
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
    event.target.value = "";
  };

  const removeLogo = () => {
    localStorage.removeItem(LOGO_STORAGE_KEY);
    setLogo("");
    setLogoMessage("Default logo restored.");
  };

  const metricCards = [
    {
      title: "Gallery Images",
      value: stats.gallery,
      icon: "🖼️",
      gradient: "from-blue-50 to-sky-50",
      iconGradient: "from-blue-500 to-sky-500",
      href: "/admin/gallery",
    },
    {
      title: "Table Bookings",
      value: stats.reservations,
      icon: "📅",
      gradient: "from-emerald-50 to-green-50",
      iconGradient: "from-emerald-500 to-green-500",
      href: "/admin/reservations",
    },
    {
      title: "Reviews",
      value: stats.reviews,
      icon: "⭐",
      gradient: "from-amber-50 to-yellow-50",
      iconGradient: "from-amber-400 to-orange-500",
      href: "/admin/reviews",
    },
    {
      title: "Promotions",
      value: stats.promotions,
      icon: "🎁",
      gradient: "from-purple-50 to-fuchsia-50",
      iconGradient: "from-purple-500 to-fuchsia-500",
      href: "/admin/promotions",
    },
    {
      title: "Menu Items",
      value: stats.menu,
      icon: "🍽️",
      gradient: "from-orange-50 to-amber-50",
      iconGradient: "from-orange-500 to-amber-500",
      href: "/admin/menu",
    },
    {
      title: "Active News",
      value: stats.breakingNews,
      icon: "📰",
      gradient: "from-slate-50 to-blue-50",
      iconGradient: "from-slate-500 to-blue-600",
      href: "/admin/breaking-news",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-900">
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <aside className="hidden w-[245px] shrink-0 bg-[#071321] text-white shadow-2xl lg:flex lg:flex-col">
          <div className="flex h-[118px] items-center justify-center border-b border-white/10 px-5">
            {logo ? (
              <img
                src={logo}
                alt={restaurantName}
                className="max-h-[86px] max-w-[190px] object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl text-amber-400">♛</div>
                <div className="font-serif text-2xl font-bold tracking-wide text-amber-300">
                  NABABI
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            <div className="mb-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold">
              🏠 <span className="ml-2">Dashboard</span>
            </div>

            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="flex items-center rounded-xl px-4 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                <span className="w-7 text-lg">{module.icon}</span>
                <span>{module.title}</span>
              </Link>
            ))}

            <button
              type="button"
              onClick={() => {
                setLogoMessage("");
                setLogoOpen(true);
              }}
              className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <span className="w-7 text-lg">🏷️</span>
              <span>Logo</span>
            </button>
          </nav>

          <div className="border-t border-white/10 px-5 py-5 text-center font-serif text-sm italic text-amber-300">
            Together We Serve
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 flex-1">
          {/* TOP BAR */}
          <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-7">
            <div className="lg:hidden">
              <span className="font-serif text-xl font-bold text-slate-800">NABABI</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <Link
                href="/"
                title="View Website"
                aria-label="View Website"
                className="text-2xl transition hover:scale-105"
              >
                ☼
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl text-white">
                  👤
                </div>
                <span className="hidden text-sm font-semibold sm:block">Admin</span>
                <span className="text-slate-500">⌄</span>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 xl:p-8">
            {/* HERO */}
            <div className="relative mb-5 min-h-[174px] overflow-hidden rounded-[24px] bg-[#08131f] shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(90deg,rgba(2,6,23,0.98),rgba(2,6,23,0.75),rgba(2,6,23,0.25))]" />
              <div className="absolute right-0 top-0 h-full w-[48%] bg-[radial-gradient(circle_at_65%_45%,rgba(245,158,11,0.30),transparent_22%),radial-gradient(circle_at_85%_70%,rgba(239,68,68,0.20),transparent_28%)]" />

              <div className="relative flex min-h-[174px] items-center px-6 py-7 sm:px-9">
                <div>
                  <p className="text-2xl font-semibold text-white sm:text-3xl">Welcome Back,</p>
                  <h1 className="mt-1 text-3xl font-extrabold text-amber-400 sm:text-4xl">Admin</h1>
                  <p className="mt-2 text-sm text-white/80 sm:text-base">
                    Here&apos;s what&apos;s happening with your restaurant today.
                  </p>
                </div>

                <div className="absolute right-5 top-5 hidden text-right sm:block">
                  <div className="font-serif text-2xl font-bold italic text-amber-300">Good Food</div>
                  <div className="font-serif text-xl italic text-amber-300">Good Mood</div>
                </div>
              </div>
            </div>

            {/* LIVE COUNTS */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {metricCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`rounded-[20px] border border-slate-200 bg-gradient-to-br ${card.gradient} p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${card.iconGradient} text-xl shadow-sm`}>
                    {card.icon}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-slate-700">{card.title}</div>
                  <div className="mt-1 text-3xl font-extrabold text-slate-950">{card.value}</div>
                  <div className="mt-2 text-xs font-medium text-emerald-600">Live from Admin data</div>
                </Link>
              ))}
            </div>

            {/* MODULE GRID */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {modules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  title={module.title}
                  aria-label={module.title}
                  className="group flex min-h-[132px] flex-col items-center justify-center rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                >
                  <div className={`flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-gradient-to-br ${module.gradient} text-4xl shadow-md transition group-hover:scale-105`}>
                    {module.icon}
                  </div>
                  <div className="mt-3 text-center text-sm font-semibold text-slate-800">
                    {module.title}
                  </div>
                </Link>
              ))}

              {/* LOGO */}
              <button
                type="button"
                onClick={() => {
                  setLogoMessage("");
                  setLogoOpen(true);
                }}
                title="Logo"
                aria-label="Logo"
                className="group flex min-h-[132px] flex-col items-center justify-center rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
              >
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-red-600 text-4xl shadow-md transition group-hover:scale-105">
                  🏷️
                </div>
                <div className="mt-3 text-center text-sm font-semibold text-slate-800">Logo</div>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-xs text-slate-400">
              <span>{restaurantName}</span>
              <span>{websiteOnline ? "Website Online" : "Maintenance Mode"}</span>
            </div>
          </div>
        </section>
      </div>

      {/* LOGO EDIT MODAL */}
      {logoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLogoOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-[26px] border border-amber-200 bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Logo</h2>
                <p className="mt-1 text-xs text-slate-500">Change or remove restaurant logo</p>
              </div>
              <button
                type="button"
                onClick={() => setLogoOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="mb-5 flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-amber-300 bg-slate-50">
              {logo ? (
                <img src={logo} alt={restaurantName} className="max-h-[150px] max-w-[82%] object-contain" />
              ) : (
                <div className="text-center">
                  <div className="text-5xl text-amber-500">♛</div>
                  <div className="font-serif text-3xl font-bold italic text-amber-500">Nababi</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-center hover:bg-blue-100">
                <span className="text-3xl">{isUploadingLogo ? "⏳" : "📤"}</span>
                <span className="mt-2 text-xs font-bold text-blue-700">{isUploadingLogo ? "Uploading" : "Change"}</span>
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
                className="flex min-h-[100px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-center hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="text-3xl">🗑️</span>
                <span className="mt-2 text-xs font-bold text-red-700">Remove</span>
              </button>
            </div>

            {logoMessage && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs text-amber-800">
                {logoMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
