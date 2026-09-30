"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  restaurantName: string;
  adminEmail: string;
  currency: string;
  timeZone: string;
  dateFormat: string;
  maintenanceMode: boolean;
  adminNotifications: boolean;

  // Advanced settings
  settingsCode: string;
  advancedSettingsEnabled: boolean;
};

const STORAGE_KEY = "nababi-settings";

/*
 * IMPORTANT:
 * Change this value to your own code.
 *
 * Example:
 * "NABABI2026"
 */
const ADVANCED_ACCESS_CODE = "NABABI2026";

const defaultSettings: Settings = {
  restaurantName: "Nababi Ristorante",
  adminEmail: "",
  currency: "EUR (€)",
  timeZone: "Europe/Rome",
  dateFormat: "DD/MM/YYYY",
  maintenanceMode: false,
  adminNotifications: true,

  settingsCode: "",
  advancedSettingsEnabled: false,
};

export default function SettingsManagementPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  const [codeInput, setCodeInput] = useState("");

  const [advancedUnlocked, setAdvancedUnlocked] =
    useState(false);

  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        const mergedSettings: Settings = {
          ...defaultSettings,
          ...parsed,
        };

        setSettings(mergedSettings);

        /*
         * Advanced settings are not automatically opened
         * just because they were previously enabled.
         *
         * The code must be entered again.
         */
        setAdvancedUnlocked(false);
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateField = (
    field: keyof Settings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUnlockAdvancedSettings = () => {
    setCodeError("");

    const enteredCode = codeInput.trim();

    if (!enteredCode) {
      setCodeError("Please enter the settings code.");
      return;
    }

    if (enteredCode !== ADVANCED_ACCESS_CODE) {
      setAdvancedUnlocked(false);
      setCodeError("Incorrect settings code.");
      return;
    }

    setAdvancedUnlocked(true);
    setCodeError("");
    setCodeInput("");

    setSettings((current) => ({
      ...current,
      advancedSettingsEnabled: true,
    }));
  };

  const handleLockAdvancedSettings = () => {
    setAdvancedUnlocked(false);

    setSettings((current) => ({
      ...current,
      advancedSettingsEnabled: false,
    }));
  };

  const handleSave = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!settings.restaurantName.trim()) {
      alert("Restaurant name is required.");
      return;
    }

    /*
     * Do not store the entered access code itself.
     * Only store whether advanced settings were enabled
     * in the current settings state.
     */
    const settingsToSave: Settings = {
      ...settings,
      settingsCode: "",
      advancedSettingsEnabled: advancedUnlocked,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settingsToSave)
    );

    setSettings(settingsToSave);

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all settings?"
    );

    if (!confirmed) return;

    setSettings(defaultSettings);

    setCodeInput("");
    setCodeError("");
    setAdvancedUnlocked(false);

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
              Settings Management
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Manage your restaurant and website settings.
            </p>
          </header>

          {/* Main Card */}
          <form
            onSubmit={handleSave}
            className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
          >

            {/* General Settings */}
            <section className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-white">
                General Settings
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Restaurant Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Restaurant Name
                  </label>

                  <input
                    type="text"
                    value={settings.restaurantName}
                    onChange={(e) =>
                      updateField(
                        "restaurantName",
                        e.target.value
                      )
                    }
                    placeholder="Nababi Ristorante"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                  />
                </div>

                {/* Admin Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Admin Email
                  </label>

                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) =>
                      updateField(
                        "adminEmail",
                        e.target.value
                      )
                    }
                    placeholder="admin@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Currency
                  </label>

                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      updateField(
                        "currency",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#3b1712] px-4 py-3 text-sm text-white outline-none focus:border-orange-300/50"
                  >
                    <option value="EUR (€)">
                      EUR (€) - Euro
                    </option>

                    <option value="USD ($)">
                      USD ($) - US Dollar
                    </option>

                    <option value="GBP (£)">
                      GBP (£) - British Pound
                    </option>

                    <option value="CHF (Fr)">
                      CHF (Fr) - Swiss Franc
                    </option>
                  </select>
                </div>

                {/* Time Zone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Time Zone
                  </label>

                  <select
                    value={settings.timeZone}
                    onChange={(e) =>
                      updateField(
                        "timeZone",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#3b1712] px-4 py-3 text-sm text-white outline-none focus:border-orange-300/50"
                  >
                    <option value="Europe/Rome">
                      Europe/Rome
                    </option>

                    <option value="Europe/London">
                      Europe/London
                    </option>

                    <option value="Europe/Paris">
                      Europe/Paris
                    </option>

                    <option value="Europe/Berlin">
                      Europe/Berlin
                    </option>

                    <option value="UTC">
                      UTC
                    </option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Date Format
                  </label>

                  <select
                    value={settings.dateFormat}
                    onChange={(e) =>
                      updateField(
                        "dateFormat",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#3b1712] px-4 py-3 text-sm text-white outline-none focus:border-orange-300/50"
                  >
                    <option value="DD/MM/YYYY">
                      DD/MM/YYYY
                    </option>

                    <option value="MM/DD/YYYY">
                      MM/DD/YYYY
                    </option>

                    <option value="YYYY-MM-DD">
                      YYYY-MM-DD
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* Website Settings */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-white">
                Website Settings
              </h2>

              <div className="space-y-4">

                {/* Maintenance */}
                <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div>
                    <p className="font-bold text-white">
                      Maintenance Mode
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Temporarily hide the public website.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      updateField(
                        "maintenanceMode",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>

                {/* Notifications */}
                <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div>
                    <p className="font-bold text-white">
                      Admin Notifications
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Enable notifications for new admin activity.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={settings.adminNotifications}
                    onChange={(e) =>
                      updateField(
                        "adminNotifications",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>
              </div>
            </section>

            {/* Settings Code */}
            <section className="mt-5 rounded-3xl border border-orange-300/20 bg-black/20 p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">
                  Advanced Settings Access
                </h2>

                <p className="mt-1 text-xs text-white/45">
                  Enter the settings code to unlock additional settings.
                </p>
              </div>

              {!advancedUnlocked ? (
                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Settings Code
                    </label>

                    <input
                      type="password"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value);
                        setCodeError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleUnlockAdvancedSettings();
                        }
                      }}
                      placeholder="Enter settings code"
                      autoComplete="off"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                    />
                  </div>

                  {codeError && (
                    <div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                      {codeError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleUnlockAdvancedSettings}
                    className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01]"
                  >
                    Unlock Advanced Settings
                  </button>

                  <div className="rounded-2xl border border-yellow-300/10 bg-yellow-500/5 px-4 py-3">
                    <p className="text-xs leading-5 text-yellow-100/60">
                      Advanced settings are hidden until the correct code
                      is entered.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">

                  {/* Unlocked Status */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-green-300/20 bg-green-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-green-100">
                        Advanced Settings Unlocked
                      </p>

                      <p className="mt-1 text-xs text-green-100/50">
                        Additional settings are now available.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLockAdvancedSettings}
                      className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      Lock
                    </button>
                  </div>

                  {/* Advanced Settings */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <h3 className="mb-4 font-bold text-white">
                      Advanced Settings
                    </h3>

                    <div className="space-y-4">

                      {/* Website Status */}
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div>
                          <p className="font-semibold text-white">
                            Public Website
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            Control whether the public website is available.
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            settings.maintenanceMode
                              ? "bg-yellow-500/15 text-yellow-200"
                              : "bg-green-500/15 text-green-200"
                          }`}
                        >
                          {settings.maintenanceMode
                            ? "Maintenance"
                            : "Online"}
                        </span>
                      </div>

                      {/* Admin Notifications */}
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div>
                          <p className="font-semibold text-white">
                            Admin Notifications
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            Notification system status.
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            settings.adminNotifications
                              ? "bg-green-500/15 text-green-200"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {settings.adminNotifications
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>

                      {/* Reservation System */}
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div>
                          <p className="font-semibold text-white">
                            Reservation System
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            Reservation data uses the existing restaurant
                            reservation system.
                          </p>
                        </div>

                        <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-200">
                          Connected
                        </span>
                      </div>

                      {/* Storage Key */}
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <p className="text-xs text-white/40">
                          Settings Storage
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold text-orange-100">
                          {STORAGE_KEY}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Current Settings */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                Current Settings
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Restaurant
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.restaurantName || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Currency
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.currency}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Time Zone
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.timeZone}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Website Status
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      settings.maintenanceMode
                        ? "text-yellow-200"
                        : "text-green-200"
                    }`}
                  >
                    {settings.maintenanceMode
                      ? "Maintenance Mode"
                      : "Online"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Advanced Access
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      advancedUnlocked
                        ? "text-green-200"
                        : "text-white/50"
                    }`}
                  >
                    {advancedUnlocked
                      ? "Unlocked"
                      : "Locked"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Admin Notifications
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      settings.adminNotifications
                        ? "text-green-200"
                        : "text-white/50"
                    }`}
                  >
                    {settings.adminNotifications
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>
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
                Settings saved successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
