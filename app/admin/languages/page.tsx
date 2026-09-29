"use client";

import { FormEvent, useEffect, useState } from "react";

type LanguageSettings = {
  italian: boolean;
  english: boolean;
  bengali: boolean;
  defaultLanguage: "Italian" | "English" | "Bengali";
  languageSwitcherVisible: boolean;
};

const STORAGE_KEY = "nababi-languages";

const defaultSettings: LanguageSettings = {
  italian: true,
  english: true,
  bengali: true,
  defaultLanguage: "Italian",
  languageSwitcherVisible: true,
};

export default function LanguagesManagementPage() {
  const [settings, setSettings] =
    useState<LanguageSettings>(defaultSettings);

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

  const updateSettings = (
    field: keyof LanguageSettings,
    value: boolean | string
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const enabledLanguages = [
    settings.italian,
    settings.english,
    settings.bengali,
  ].filter(Boolean).length;

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enabledLanguages === 0) {
      alert("Please enable at least one language.");
      return;
    }

    if (
      (settings.defaultLanguage === "Italian" &&
        !settings.italian) ||
      (settings.defaultLanguage === "English" &&
        !settings.english) ||
      (settings.defaultLanguage === "Bengali" &&
        !settings.bengali)
    ) {
      alert("Default language must be an enabled language.");
      return;
    }

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
      "Reset language settings?"
    );

    if (!confirmed) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
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
              Languages Management
            </h1>
          </header>

          {/* Main Card */}
          <form
            onSubmit={handleSave}
            className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
          >
            {/* Available Languages */}
            <section className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">
                  Available Languages
                </h2>

                <p className="mt-1 text-xs text-white/45">
                  Select the languages available on the website.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Italian */}
                <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇮🇹</span>

                      <div>
                        <p className="font-bold text-white">
                          Italiano
                        </p>

                        <p className="text-xs text-white/40">
                          Italian
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.italian}
                      onChange={(e) =>
                        updateSettings(
                          "italian",
                          e.target.checked
                        )
                      }
                      className="h-5 w-5 accent-orange-500"
                    />
                  </div>
                </label>

                {/* English */}
                <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇬🇧</span>

                      <div>
                        <p className="font-bold text-white">
                          English
                        </p>

                        <p className="text-xs text-white/40">
                          English
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.english}
                      onChange={(e) =>
                        updateSettings(
                          "english",
                          e.target.checked
                        )
                      }
                      className="h-5 w-5 accent-orange-500"
                    />
                  </div>
                </label>

                {/* Bengali */}
                <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇧🇩</span>

                      <div>
                        <p className="font-bold text-white">
                          বাংলা
                        </p>

                        <p className="text-xs text-white/40">
                          Bengali
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.bengali}
                      onChange={(e) =>
                        updateSettings(
                          "bengali",
                          e.target.checked
                        )
                      }
                      className="h-5 w-5 accent-orange-500"
                    />
                  </div>
                </label>
              </div>
            </section>

            {/* Default Language */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                Default Language
              </h2>

              <select
                value={settings.defaultLanguage}
                onChange={(e) =>
                  updateSettings(
                    "defaultLanguage",
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-[#3b1712] px-4 py-3 text-sm text-white outline-none focus:border-orange-300/50"
              >
                {settings.italian && (
                  <option value="Italian">
                    Italian
                  </option>
                )}

                {settings.english && (
                  <option value="English">
                    English
                  </option>
                )}

                {settings.bengali && (
                  <option value="Bengali">
                    Bengali
                  </option>
                )}
              </select>
            </section>

            {/* Language Switcher */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Language Switcher
                  </h2>

                  <p className="mt-1 text-xs text-white/45">
                    Show the language selector on the website.
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm font-semibold text-white">
                    Show on Website
                  </span>

                  <input
                    type="checkbox"
                    checked={
                      settings.languageSwitcherVisible
                    }
                    onChange={(e) =>
                      updateSettings(
                        "languageSwitcherVisible",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>
              </div>
            </section>

            {/* Preview */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                Language Preview
              </h2>

              <div className="flex flex-wrap justify-center gap-3">
                {settings.italian && (
                  <span
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      settings.defaultLanguage === "Italian"
                        ? "border-orange-300/40 bg-orange-500/20 text-orange-100"
                        : "border-white/10 bg-white/5 text-white"
                    }`}
                  >
                    🇮🇹 Italiano
                  </span>
                )}

                {settings.english && (
                  <span
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      settings.defaultLanguage === "English"
                        ? "border-orange-300/40 bg-orange-500/20 text-orange-100"
                        : "border-white/10 bg-white/5 text-white"
                    }`}
                  >
                    🇬🇧 English
                  </span>
                )}

                {settings.bengali && (
                  <span
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      settings.defaultLanguage === "Bengali"
                        ? "border-orange-300/40 bg-orange-500/20 text-orange-100"
                        : "border-white/10 bg-white/5 text-white"
                    }`}
                  >
                    🇧🇩 বাংলা
                  </span>
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
                Language settings saved successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}