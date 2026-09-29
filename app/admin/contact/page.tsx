"use client";

import { FormEvent, useEffect, useState } from "react";

type ContactSettings = {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  googleMapsUrl: string;
  contactTitle: string;
  contactText: string;
  visible: boolean;
  contactFormVisible: boolean;
};

const STORAGE_KEY = "nababi-contact";

const defaultSettings: ContactSettings = {
  restaurantName: "Nababi Ristorante",
  address: "",
  phone: "",
  email: "",
  whatsapp: "",
  googleMapsUrl: "",
  contactTitle: "Contact Us",
  contactText:
    "Get in touch with Nababi Ristorante for reservations, questions and more information.",
  visible: true,
  contactFormVisible: true,
};

export default function ContactManagementPage() {
  const [settings, setSettings] =
    useState<ContactSettings>(defaultSettings);

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
    field: keyof ContactSettings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
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
      "Reset contact settings to default values?"
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
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="pointer-events-none absolute right-10 top-1/2 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      {/* CENTER WRAPPER */}
      <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <header className="mb-7 text-center">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-100 shadow-lg backdrop-blur-xl">
              Nababi Ristorante
            </div>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Contact / Location Management
            </h1>
          </header>

          {/* Main Card */}
          <form
            onSubmit={handleSave}
            className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {/* Restaurant Information */}
              <section className="rounded-3xl border border-white/10 bg-black/15 p-5">
                <h2 className="mb-5 text-lg font-bold text-white">
                  Restaurant Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Restaurant Name
                    </label>

                    <input
                      value={settings.restaurantName}
                      onChange={(e) =>
                        updateField(
                          "restaurantName",
                          e.target.value
                        )
                      }
                      placeholder="Nababi Ristorante"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Address
                    </label>

                    <textarea
                      value={settings.address}
                      onChange={(e) =>
                        updateField(
                          "address",
                          e.target.value
                        )
                      }
                      placeholder="Restaurant address"
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="+39 ..."
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Email
                    </label>

                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        updateField(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="restaurant@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      WhatsApp
                    </label>

                    <input
                      type="tel"
                      value={settings.whatsapp}
                      onChange={(e) =>
                        updateField(
                          "whatsapp",
                          e.target.value
                        )
                      }
                      placeholder="+39 ..."
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="rounded-3xl border border-white/10 bg-black/15 p-5">
                <h2 className="mb-5 text-lg font-bold text-white">
                  Location & Contact
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Google Maps URL
                    </label>

                    <input
                      type="url"
                      value={settings.googleMapsUrl}
                      onChange={(e) =>
                        updateField(
                          "googleMapsUrl",
                          e.target.value
                        )
                      }
                      placeholder="https://maps.google.com/..."
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Contact Title
                    </label>

                    <input
                      value={settings.contactTitle}
                      onChange={(e) =>
                        updateField(
                          "contactTitle",
                          e.target.value
                        )
                      }
                      placeholder="Contact Us"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Contact Text
                    </label>

                    <textarea
                      value={settings.contactText}
                      onChange={(e) =>
                        updateField(
                          "contactText",
                          e.target.value
                        )
                      }
                      placeholder="Write contact section text..."
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-300/50"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm font-semibold text-white">
                      Show Contact Section
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

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm font-semibold text-white">
                      Show Contact Form
                    </span>

                    <input
                      type="checkbox"
                      checked={settings.contactFormVisible}
                      onChange={(e) =>
                        updateField(
                          "contactFormVisible",
                          e.target.checked
                        )
                      }
                      className="h-5 w-5 accent-orange-500"
                    />
                  </label>
                </div>
              </section>
            </div>

            {/* Preview */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-black/15 p-5">
              <h2 className="mb-4 text-lg font-bold text-white">
                Contact Preview
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    Address
                  </p>

                  <p className="mt-1 break-words text-sm text-white/80">
                    {settings.address || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    Phone
                  </p>

                  <p className="mt-1 break-words text-sm text-white/80">
                    {settings.phone || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    Email
                  </p>

                  <p className="mt-1 break-words text-sm text-white/80">
                    {settings.email || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    WhatsApp
                  </p>

                  <p className="mt-1 break-words text-sm text-white/80">
                    {settings.whatsapp || "Not set"}
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
                Contact settings saved successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}