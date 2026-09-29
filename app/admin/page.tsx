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
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Reservations",
    description: "View and manage customer table reservations.",
    href: "/admin/reservations",
    icon: "📅",
    gradient: "from-red-500 to-pink-500",
  },
  {
    title: "Website Status",
    description: "Control website online and maintenance status.",
    href: "/admin/website-status",
    icon: "🌐",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Home Page",
    description: "Manage hero, welcome and booking sections.",
    href: "/admin/home",
    icon: "🏠",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    title: "Gallery",
    description: "Upload and manage restaurant gallery images.",
    href: "/admin/gallery",
    icon: "🖼️",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "About",
    description: "Manage restaurant about content and image.",
    href: "/admin/about",
    icon: "ℹ️",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Breaking News",
    description: "Create and manage website news announcements.",
    href: "/admin/breaking-news",
    icon: "📢",
    gradient: "from-red-500 to-orange-500",
  },
  {
    title: "Promotions",
    description: "Manage special offers and promotional campaigns.",
    href: "/admin/promotions",
    icon: "🎁",
    gradient: "from-fuchsia-500 to-purple-500",
  },
  {
    title: "Reviews",
    description: "Manage customer reviews and ratings.",
    href: "/admin/reviews",
    icon: "⭐",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Contact",
    description: "Manage address, phone, email and map details.",
    href: "/admin/contact",
    icon: "📍",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Opening Hours",
    description: "Manage weekly opening and break hours.",
    href: "/admin/opening-hours",
    icon: "🕐",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Social Media",
    description: "Manage Facebook, Instagram, TikTok and more.",
    href: "/admin/social-media",
    icon: "📱",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    title: "Languages",
    description: "Manage Italian, English and Bengali languages.",
    href: "/admin/languages",
    icon: "🌍",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Settings",
    description: "Manage restaurant and website settings.",
    href: "/admin/settings",
    icon: "⚙️",
    gradient: "from-slate-500 to-gray-700",
  },
  {
    title: "Admin Profile",
    description: "Manage admin profile and security settings.",
    href: "/admin/profile",
    icon: "👤",
    gradient: "from-violet-500 to-fuchsia-500",
  },
];

export default function AdminDashboard() {
  const [restaurantName, setRestaurantName] =
    useState("Nababi Ristorante");

  const [websiteOnline, setWebsiteOnline] = useState(true);
  const [reservationCount, setReservationCount] = useState(0);
  const [menuCount, setMenuCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    const settings = localStorage.getItem("nababi-settings");

    if (settings) {
      try {
        const parsed = JSON.parse(settings);

        if (parsed.restaurantName) {
          setRestaurantName(parsed.restaurantName);
        }

        setWebsiteOnline(!parsed.maintenanceMode);
      } catch {}
    }

    const reservations = localStorage.getItem(
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

    const menu = localStorage.getItem("nababi-menu");

    if (menu) {
      try {
        const parsed = JSON.parse(menu);

        if (Array.isArray(parsed)) {
          setMenuCount(parsed.length);
        }
      } catch {}
    }

    const gallery = localStorage.getItem(
      "nababi-gallery"
    );

    if (gallery) {
      try {
        const parsed = JSON.parse(gallery);

        if (Array.isArray(parsed)) {
          setGalleryCount(parsed.length);
        }
      } catch {}
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Center Wrapper */}
      <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <header className="mb-6">
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-2xl sm:p-8">
              <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-100">
                Admin Panel
              </div>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {restaurantName}
              </h1>

              <p className="mt-2 text-sm text-white/55">
                Restaurant Management Dashboard
              </p>

              <div className="mt-5 flex justify-center">
                <div
                  className={`inline-flex items-center gap-3 rounded-full border px-5 py-2.5 ${
                    websiteOnline
                      ? "border-green-300/20 bg-green-500/10"
                      : "border-yellow-300/20 bg-yellow-500/10"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      websiteOnline
                        ? "bg-green-400 shadow-lg shadow-green-400/60"
                        : "bg-yellow-400 shadow-lg shadow-yellow-400/60"
                    }`}
                  />

                  <span className="text-sm font-semibold text-white">
                    Website{" "}
                    {websiteOnline
                      ? "Online"
                      : "Maintenance Mode"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Overview */}
          <section className="mb-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl">
                  🍽️
                </div>

                <p className="text-xs uppercase tracking-wider text-white/40">
                  Menu Items
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {menuCount}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-2xl">
                  📅
                </div>

                <p className="text-xs uppercase tracking-wider text-white/40">
                  Reservations
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {reservationCount}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-2xl">
                  🖼️
                </div>

                <p className="text-xs uppercase tracking-wider text-white/40">
                  Gallery Images
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {galleryCount}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Access */}
          <section className="mb-6">
            <h2 className="mb-4 text-center text-2xl font-bold text-white">
              Quick Access
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/"
                className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mb-3 text-3xl">🌐</div>

                <h3 className="font-bold text-white">
                  View Website
                </h3>

                <p className="mt-1 text-xs text-white/45">
                  Open public website
                </p>
              </Link>

              <Link
                href="/admin/menu"
                className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mb-3 text-3xl">🍽️</div>

                <h3 className="font-bold text-white">
                  Manage Menu
                </h3>

                <p className="mt-1 text-xs text-white/45">
                  Manage dishes
                </p>
              </Link>

              <Link
                href="/admin/reservations"
                className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mb-3 text-3xl">📅</div>

                <h3 className="font-bold text-white">
                  Reservations
                </h3>

                <p className="mt-1 text-xs text-white/45">
                  Customer bookings
                </p>
              </Link>

              <Link
                href="/admin/settings"
                className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mb-3 text-3xl">⚙️</div>

                <h3 className="font-bold text-white">
                  Settings
                </h3>

                <p className="mt-1 text-xs text-white/45">
                  Website settings
                </p>
              </Link>
            </div>
          </section>

          {/* Management */}
          <section>
            <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <h2 className="text-2xl font-bold text-white">
                Management
              </h2>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/60">
                {modules.length} Modules
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/15"
                >
                  <div
                    className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${module.gradient} opacity-20 blur-2xl transition group-hover:opacity-35`}
                  />

                  <div className="relative">
                    <div
                      className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${module.gradient} text-2xl shadow-lg`}
                    >
                      {module.icon}
                    </div>

                    <h3 className="font-bold text-white">
                      {module.title}
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-white/45">
                      {module.description}
                    </p>

                    <div className="mt-4 text-xs font-semibold text-orange-200 transition group-hover:text-white">
                      Manage →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 text-center">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} {restaurantName}
              {" · "}Admin Management Panel
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}