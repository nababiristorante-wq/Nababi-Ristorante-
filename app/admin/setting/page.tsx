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
 * ============================================================
 * ADVANCED SETTINGS ACCESS CODE
 * ============================================================
 *
 * Keep this code as it is if you want:
 *
 * NABABI2026
 *
 * You can later change it from this line only.
 * ============================================================
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

        setSettings({
          ...defaultSettings,
          ...parsed,
        });
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

  /*
   * ============================================================
   * SAVE SETTINGS
   * ============================================================
   */
  const handleSave = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!settings.restaurantName.trim()) {
      alert("Restaurant name is required.");
      return;
    }

    /*
     * Keep the access code controlled by the fixed code.
     * The value is also stored so the setting remains compatible
     * with the existing Nababi settings structure.
     */
    const settingsToSave: Settings = {
      ...settings,
      settingsCode: settings.settingsCode || "",
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

  /*
   * ============================================================
   * RESET SETTINGS
   * ============================================================
   */
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

  /*
   * ============================================================
   * ADVANCED SETTINGS CODE CHECK
   * ============================================================
   */
  const handleUnlockAdvancedSettings = () => {
    setCodeError("");

    if (!codeInput.trim()) {
      setCodeError("Please enter the settings access code.");
      return;
    }

    if (
      codeInput.trim().toUpperCase() !==
      ADVANCED_ACCESS_CODE.toUpperCase()
    ) {
      setCodeError("Invalid settings code.");
      return;
    }

    setAdvancedUnlocked(true);

    setSettings((current) => ({
      ...current,
      settingsCode: ADVANCED_ACCESS_CODE,
      advancedSettingsEnabled: true,
    }));

    setCodeError("");
  };

  /*
   * ============================================================
   * LOCK ADVANCED SETTINGS
   * ============================================================
   */
  const handleLockAdvancedSettings = () => {
    setAdvancedUnlocked(false);
    setCodeInput("");

    setSettings((current) => ({
      ...current,
      advancedSettingsEnabled: false,
    }));
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
              Manage your restaurant and website settings
            </p>
          </header>

          {/* Main Card */}
          <form
            onSubmit={handleSave}
            className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
          >
            {/* ================================================= */}
            {/* GENERAL SETTINGS */}
            {/* ================================================= */}

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

            {/* ================================================= */}
            {/* WEBSITE SETTINGS */}
            {/* ================================================= */}

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
                    checked={
                      settings.maintenanceMode
                    }
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
                      Enable notifications for new admin
                      activity.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={
                      settings.adminNotifications
                    }
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

            {/* ================================================= */}
            {/* ADVANCED SETTINGS ACCESS */}
            {/* ================================================= */}

            <section className="mt-5 rounded-3xl border border-orange-300/20 bg-black/20 p-5 sm:p-6">
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-500/10 text-xl">
                    🔐
                  </span>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Advanced Settings
                    </h2>

                    <p className="mt-1 text-xs text-white/40">
                      Protected settings area
                    </p>
                  </div>
                </div>
              </div>

              {!advancedUnlocked ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="mb-4 text-sm text-white/60">
                      Enter the settings access code to
                      open Advanced Settings.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
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
                        placeholder="Enter access code"
                        autoComplete="off"
                        className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
                      />

                      <button
                        type="button"
                        onClick={
                          handleUnlockAdvancedSettings
                        }
                        className="rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-7 py-3 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01]"
                      >
                        Unlock
                      </button>
                    </div>

                    {codeError && (
                      <div className="mt-3 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                        {codeError}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Unlocked Header */}
                  <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-green-300/20 bg-green-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-green-100">
                        Advanced Settings Unlocked
                      </p>

                      <p className="mt-1 text-xs text-green-200/60">
                        You now have access to the advanced
                        settings area.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleLockAdvancedSettings
                      }
                      className="rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      Lock
                    </button>
                  </div>

                  {/* Advanced Settings Content */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-white">
                            Advanced Settings Status
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            Controls whether advanced settings
                            are enabled.
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={
                            settings.advancedSettingsEnabled
                          }
                          onChange={(e) =>
                            updateField(
                              "advancedSettingsEnabled",
                              e.target.checked
                            )
                          }
                          className="h-5 w-5 accent-orange-500"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-wider text-white/35">
                        Access Status
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-500/40" />

                        <span className="font-semibold text-green-100">
                          Verified Access
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-orange-300/10 bg-orange-500/5 p-5">
                      <p className="text-xs text-white/40">
                        Advanced access is protected by the
                        Settings Access Code.
                      </p>

                      <p className="mt-2 text-sm font-semibold text-orange-100">
                        Advanced settings are available only
                        after successful code verification.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* ================================================= */}
            {/* CURRENT SETTINGS */}
            {/* ================================================= */}

            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                Current Settings
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Restaurant */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Restaurant
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.restaurantName ||
                      "Not set"}
                  </p>
                </div>

                {/* Currency */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Currency
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.currency}
                  </p>
                </div>

                {/* Time Zone */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Time Zone
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.timeZone}
                  </p>
                </div>

                {/* Date Format */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Date Format
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {settings.dateFormat}
                  </p>
                </div>

                {/* Website Status */}
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

                {/* Advanced Status */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/40">
                    Advanced Settings
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      settings.advancedSettingsEnabled
                        ? "text-green-200"
                        : "text-white/50"
                    }`}
                  >
                    {settings.advancedSettingsEnabled
                      ? "Enabled"
                      : "Locked"}
                  </p>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* BUTTONS */}
            {/* ================================================= */}

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

            {/* Saved Message */}
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
