"use client";

import { FormEvent, useEffect, useState } from "react";

type SocialMediaSettings = {
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
  visible: boolean;
};

const STORAGE_KEY = "nababi-social-media";

const defaultSettings: SocialMediaSettings = {
  facebook: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  whatsapp: "",
  visible: true,
};

export default function SocialMediaManagementPage() {
  const [settings, setSettings] =
    useState<SocialMediaSettings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateField = (
    field: keyof SocialMediaSettings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset social media settings?"
    );

    if (!confirmed) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );
  };

  const socialItems = [
    {
      key: "facebook" as const,
      name: "Facebook",
      icon: "f",
      placeholder: "https://facebook.com/yourpage",
    },
    {
      key: "instagram" as const,
      name: "Instagram",
      icon: "◎",
      placeholder: "https://instagram.com/yourpage",
    },
    {
      key: "tiktok" as const,
      name: "TikTok",
      icon: "♪",
      placeholder: "https://tiktok.com/@yourpage",
    },
    {
      key: "youtube" as const,
      name: "YouTube",
      icon: "▶",
      placeholder: "https://youtube.com/@yourchannel",
    },
    {
      key: "whatsapp" as const,
      name: "WhatsApp",
      icon: "◉",
      placeholder: "https://wa.me/391234567890",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] px-4 py-8 sm:px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

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
              Social Media Management
            </h1>
          </header>

          {/* Main Card */}
          <form
            onSubmit={handleSave}
            className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
          >
            {/* Visibility */}
            <section className="mb-5 rounded-3xl border border-white/10 bg-black/15 p-5">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Social Media Links
                  </h2>

                  <p className="mt-1 text-xs text-white/45">
                    Add your restaurant social media profiles.
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm font-semibold text-white">
                    Show on Website
                  </span>

                  <input
                    type="checkbox"
                    checked={settings.visible}
                    onChange={(e) =>
                      updateField(
                        "visible",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>
              </div>
            </section>

            {/* Social Inputs */}
            <section className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {socialItems.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/30 via-red-500/30 to-fuchsia-500/30 text-lg font-bold text-white ring-1 ring-white/10">
                        {item.icon}
                      </div>

                      <div>
                        <p className="font-bold text-white">
                          {item.name}
                        </p>

                        <p className="text-[11px] text-white/40">
                          Profile URL
                        </p>
                      </div>
                    </div>

                    <input
                      type="url"
                      value={settings[item.key]}
                      onChange={(e) =>
                        updateField(
                          item.key,
                          e.target.value
                        )
                      }
                      placeholder={item.placeholder}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Preview */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5">
              <h2 className="mb-4 text-lg font-bold text-white">
                Social Media Preview
              </h2>

              <div className="flex flex-wrap justify-center gap-3">
                {socialItems.map((item) => {
                  const url = settings[item.key];

                  if (!url) {
                    return null;
                  }

                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/30 to-fuchsia-500/30 font-bold text-white">
                        {item.icon}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {item.name}
                      </span>
                    </div>
                  );
                })}

                {!socialItems.some(
                  (item) => settings[item.key]
                ) && (
                  <p className="py-3 text-sm text-white/40">
                    No social media links added yet.
                  </p>
                )}
              </div>
            </section>

            {/* Buttons */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-10 py-3.5 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01] sm:w-auto"
              >
                Save Changes
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
                Social media settings saved successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}