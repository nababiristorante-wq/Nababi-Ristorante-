"use client";

import { FormEvent, useEffect, useState } from "react";

type DaySchedule = {
  day: string;
  open: boolean;
  openingTime: string;
  closingTime: string;
  breakEnabled: boolean;
  breakStart: string;
  breakEnd: string;
};

type OpeningHoursSettings = {
  visible: boolean;
  title: string;
  days: DaySchedule[];
};

const STORAGE_KEY = "nababi-opening-hours";

const defaultDays: DaySchedule[] = [
  {
    day: "Monday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:00",
    breakEnabled: true,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
  {
    day: "Tuesday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:00",
    breakEnabled: true,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
  {
    day: "Wednesday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:00",
    breakEnabled: true,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
  {
    day: "Thursday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:00",
    breakEnabled: true,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
  {
    day: "Friday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:30",
    breakEnabled: true,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
  {
    day: "Saturday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:30",
    breakEnabled: false,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
  {
    day: "Sunday",
    open: true,
    openingTime: "12:00",
    closingTime: "23:00",
    breakEnabled: false,
    breakStart: "16:00",
    breakEnd: "18:00",
  },
];

const defaultSettings: OpeningHoursSettings = {
  visible: true,
  title: "Opening Hours",
  days: defaultDays,
};

export default function OpeningHoursManagementPage() {
  const [settings, setSettings] =
    useState<OpeningHoursSettings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setSettings({
          ...defaultSettings,
          ...parsed,
          days:
            Array.isArray(parsed.days) && parsed.days.length === 7
              ? parsed.days
              : defaultDays,
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateDay = (
    index: number,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              [field]: value,
            }
          : day
      ),
    }));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset opening hours to default values?"
    );

    if (!confirmed) return;

    setSettings({
      ...defaultSettings,
      days: defaultDays.map((day) => ({ ...day })),
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );
  };

  const copyMondayToAll = () => {
    const monday = settings.days[0];

    const updatedDays = settings.days.map((day) => ({
      ...day,
      open: monday.open,
      openingTime: monday.openingTime,
      closingTime: monday.closingTime,
      breakEnabled: monday.breakEnabled,
      breakStart: monday.breakStart,
      breakEnd: monday.breakEnd,
    }));

    setSettings((current) => ({
      ...current,
      days: updatedDays,
    }));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] px-4 py-8 sm:px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Center */}
      <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <header className="mb-7 text-center">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-100 shadow-lg backdrop-blur-xl">
              Nababi Ristorante
            </div>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Opening Hours Management
            </h1>
          </header>

          {/* Main Card */}
          <form
            onSubmit={handleSave}
            className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
          >
            {/* General Settings */}
            <section className="mb-5 rounded-3xl border border-white/10 bg-black/15 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Section Title
                  </label>

                  <input
                    value={settings.title}
                    onChange={(e) =>
                      setSettings((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Opening Hours"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                  />
                </div>

                <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:min-w-[220px]">
                  <span className="text-sm font-semibold text-white">
                    Show on Website
                  </span>

                  <input
                    type="checkbox"
                    checked={settings.visible}
                    onChange={(e) =>
                      setSettings((current) => ({
                        ...current,
                        visible: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>
              </div>
            </section>

            {/* Days */}
            <section className="rounded-3xl border border-white/10 bg-black/15 p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white">
                  Weekly Schedule
                </h2>

                <button
                  type="button"
                  onClick={copyMondayToAll}
                  className="rounded-xl border border-orange-300/20 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-200 transition hover:bg-orange-500/20"
                >
                  Copy Monday to All
                </button>
              </div>

              <div className="space-y-3">
                {settings.days.map((day, index) => (
                  <div
                    key={day.day}
                    className={`rounded-2xl border p-4 transition ${
                      day.open
                        ? "border-white/10 bg-white/5"
                        : "border-red-300/10 bg-red-500/5"
                    }`}
                  >
                    <div className="grid gap-4 lg:grid-cols-[130px_110px_1fr_1fr_1fr] lg:items-end">
                      {/* Day */}
                      <div>
                        <p className="text-sm font-bold text-white">
                          {day.day}
                        </p>

                        <p
                          className={`mt-1 text-xs font-semibold ${
                            day.open
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {day.open ? "Open" : "Closed"}
                        </p>
                      </div>

                      {/* Open */}
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={day.open}
                          onChange={(e) =>
                            updateDay(
                              index,
                              "open",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 accent-orange-500"
                        />

                        <span className="text-xs font-semibold text-white">
                          Open
                        </span>
                      </label>

                      {/* Opening */}
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Opening Time
                        </label>

                        <input
                          type="time"
                          value={day.openingTime}
                          disabled={!day.open}
                          onChange={(e) =>
                            updateDay(
                              index,
                              "openingTime",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-35"
                        />
                      </div>

                      {/* Closing */}
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Closing Time
                        </label>

                        <input
                          type="time"
                          value={day.closingTime}
                          disabled={!day.open}
                          onChange={(e) =>
                            updateDay(
                              index,
                              "closingTime",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-35"
                        />
                      </div>

                      {/* Break */}
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Break Time
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={day.breakEnabled}
                            disabled={!day.open}
                            onChange={(e) =>
                              updateDay(
                                index,
                                "breakEnabled",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 accent-orange-500"
                          />

                          <input
                            type="time"
                            value={day.breakStart}
                            disabled={
                              !day.open || !day.breakEnabled
                            }
                            onChange={(e) =>
                              updateDay(
                                index,
                                "breakStart",
                                e.target.value
                              )
                            }
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-2 py-2.5 text-xs text-white outline-none disabled:cursor-not-allowed disabled:opacity-35"
                          />

                          <span className="text-white/40">-</span>

                          <input
                            type="time"
                            value={day.breakEnd}
                            disabled={
                              !day.open || !day.breakEnabled
                            }
                            onChange={(e) =>
                              updateDay(
                                index,
                                "breakEnd",
                                e.target.value
                              )
                            }
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-2 py-2.5 text-xs text-white outline-none disabled:cursor-not-allowed disabled:opacity-35"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Preview */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5">
              <h2 className="mb-4 text-lg font-bold text-white">
                Opening Hours Preview
              </h2>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {settings.days.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-white">
                      {day.day}
                    </span>

                    {day.open ? (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-300">
                          {day.openingTime} - {day.closingTime}
                        </p>

                        {day.breakEnabled && (
                          <p className="mt-0.5 text-[10px] text-white/40">
                            Break {day.breakStart} - {day.breakEnd}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-red-300">
                        Closed
                      </span>
                    )}
                  </div>
                ))}
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
                Opening hours saved successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}