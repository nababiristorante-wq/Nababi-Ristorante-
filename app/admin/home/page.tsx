"use client";

import { ChangeEvent, useEffect, useState } from "react";

type HomeSettings = {
  heroTitle: string;
  heroSubtitle: string;
  welcomeText: string;
  heroImage: string;
  bookingTitle: string;
  bookingText: string;
  heroVisible: boolean;
  welcomeVisible: boolean;
  bookingVisible: boolean;
};

const STORAGE_KEY = "nababi-home-settings";

const defaultSettings: HomeSettings = {
  heroTitle: "Welcome to Nababi Ristorante",
  heroSubtitle: "Authentic Italian Dining Experience in Rome",
  welcomeText:
    "Experience delicious food, warm hospitality and an unforgettable dining experience at Nababi Ristorante.",
  heroImage: "",
  bookingTitle: "Reserve Your Table",
  bookingText:
    "Book your table and enjoy a memorable dining experience with us.",
  heroVisible: true,
  welcomeVisible: true,
  bookingVisible: true,
};

export default function HomePageManagement() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const updateField = <K extends keyof HomeSettings>(
    field: K,
    value: HomeSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image size must be 8MB or less.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField("heroImage", String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const resetSettings = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset Home Page settings?"
    );

    if (!confirmReset) return;

    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute right-[-120px] top-10 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-orange-100 backdrop-blur-xl">
              NABABI RISTORANTE
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Home Page Management
            </h1>

            <p className="mt-2 text-sm text-orange-100/75">
              Manage the main content and sections of your restaurant website.
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-[30px] border border-white/15 bg-white/[0.10] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Hero Section */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Hero Section</h2>
                    <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField("heroVisible", !settings.heroVisible)
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      settings.heroVisible
                        ? "bg-green-500/20 text-green-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {settings.heroVisible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Hero Title
                    </label>

                    <input
                      type="text"
                      value={settings.heroTitle}
                      onChange={(e) =>
                        updateField("heroTitle", e.target.value)
                      }
                      placeholder="Welcome to Nababi Ristorante"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Hero Subtitle
                    </label>

                    <textarea
                      rows={3}
                      value={settings.heroSubtitle}
                      onChange={(e) =>
                        updateField("heroSubtitle", e.target.value)
                      }
                      placeholder="Your restaurant subtitle..."
                      className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Hero Image
                    </label>

                    {settings.heroImage ? (
                      <div className="relative overflow-hidden rounded-2xl border border-white/15">
                        <img
                          src={settings.heroImage}
                          alt="Hero preview"
                          className="h-48 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => updateField("heroImage", "")}
                          className="absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs backdrop-blur-md transition hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] transition hover:bg-white/[0.06]">
                        <span className="mb-2 text-3xl">🖼️</span>
                        <span className="text-sm font-medium">
                          Upload Hero Image
                        </span>
                        <span className="mt-1 text-xs text-white/40">
                          JPG, PNG, WEBP — Maximum 8MB
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </section>

              {/* Welcome Section */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Welcome Section</h2>
                    <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "welcomeVisible",
                        !settings.welcomeVisible
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      settings.welcomeVisible
                        ? "bg-green-500/20 text-green-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {settings.welcomeVisible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/85">
                    Welcome Content
                  </label>

                  <textarea
                    rows={10}
                    value={settings.welcomeText}
                    onChange={(e) =>
                      updateField("welcomeText", e.target.value)
                    }
                    placeholder="Write your restaurant welcome content..."
                    className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-orange-400/10 bg-orange-500/5 p-4">
                  <p className="text-sm font-medium text-orange-100">
                    Homepage Preview
                  </p>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">
                    {settings.welcomeText || "Your welcome text will appear here."}
                  </p>
                </div>
              </section>

              {/* Booking Section */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5 lg:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Booking Section
                    </h2>

                    <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "bookingVisible",
                        !settings.bookingVisible
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      settings.bookingVisible
                        ? "bg-green-500/20 text-green-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {settings.bookingVisible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Booking Title
                    </label>

                    <input
                      type="text"
                      value={settings.bookingTitle}
                      onChange={(e) =>
                        updateField("bookingTitle", e.target.value)
                      }
                      placeholder="Reserve Your Table"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Booking Text
                    </label>

                    <textarea
                      rows={3}
                      value={settings.bookingText}
                      onChange={(e) =>
                        updateField("bookingText", e.target.value)
                      }
                      placeholder="Write booking section text..."
                      className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Save Area */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={saveSettings}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:scale-[1.01] sm:w-auto"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={resetSettings}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-medium text-white/80 transition hover:bg-white/10 sm:w-auto"
              >
                Reset
              </button>
            </div>

            {saved && (
              <div className="mx-auto mt-4 max-w-md rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-200">
                Home Page settings saved successfully.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}