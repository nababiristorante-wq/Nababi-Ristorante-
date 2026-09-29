"use client";

import { ChangeEvent, useEffect, useState } from "react";

type AboutData = {
  content: string;
  image: string;
  visible: boolean;
};

const STORAGE_KEY = "nababi-about";

const defaultData: AboutData = {
  content: "",
  image: "",
  visible: true,
};

export default function AboutManagementPage() {
  const [about, setAbout] = useState<AboutData>(defaultData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const data = JSON.parse(stored);

        setAbout({
          content: data.content || "",
          image: data.image || "",
          visible:
            typeof data.visible === "boolean" ? data.visible : true,
        });
      } catch {
        setAbout(defaultData);
      }
    }
  }, []);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image size must be less than 8MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAbout((prev) => ({
        ...prev,
        image: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveAbout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(about));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const resetAbout = () => {
    if (!window.confirm("Are you sure you want to reset About content?")) {
      return;
    }

    setAbout(defaultData);
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] px-4 py-6 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute right-[-100px] top-10 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/4 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-48px)] max-w-5xl flex-col">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            About Management
          </h1>
        </div>

        {/* Main Card */}
        <section className="mx-auto w-full rounded-[28px] border border-white/20 bg-white/[0.10] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
          {/* Content */}
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <h2 className="mb-3 text-xl font-bold">About Content</h2>

            <textarea
              value={about.content}
              onChange={(e) =>
                setAbout((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Write your About content here. You can write in Bengali, English, Italiano, or all languages together."
              className="h-36 w-full resize-none rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/40 focus:border-orange-300/70 focus:bg-white/[0.10] focus:ring-2 focus:ring-orange-300/20"
            />
          </div>

          {/* Bottom Grid */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Image */}
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h2 className="mb-3 text-xl font-bold">About Image</h2>

              {about.image ? (
                <div className="flex items-center gap-4">
                  <img
                    src={about.image}
                    alt="About preview"
                    className="h-24 w-32 rounded-2xl object-cover shadow-lg"
                  />

                  <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold transition hover:bg-white/20">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setAbout((prev) => ({
                          ...prev,
                          image: "",
                        }))
                      }
                      className="rounded-xl bg-red-500/70 px-4 py-2 text-xs font-semibold transition hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex h-24 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.04] transition hover:bg-white/[0.08]">
                  <span className="text-3xl">🖼️</span>

                  <div>
                    <div className="text-sm font-semibold">
                      Upload Image
                    </div>
                    <div className="text-xs text-white/40">
                      Click to select
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Visibility */}
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h2 className="mb-3 text-xl font-bold">
                Visibility Settings
              </h2>

              <button
                type="button"
                onClick={() =>
                  setAbout((prev) => ({
                    ...prev,
                    visible: !prev.visible,
                  }))
                }
                className={`flex h-24 w-full items-center justify-between rounded-2xl border px-5 transition ${
                  about.visible
                    ? "border-green-300/20 bg-green-500/10"
                    : "border-red-300/20 bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      about.visible ? "bg-green-400" : "bg-red-400"
                    }`}
                  />

                  <span className="text-sm font-semibold">
                    {about.visible ? "Visible" : "Hidden"}
                  </span>
                </div>

                <div
                  className={`relative h-6 w-11 rounded-full transition ${
                    about.visible ? "bg-green-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      about.visible ? "left-6" : "left-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={saveAbout}
              className="rounded-xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 px-8 py-3 text-sm font-bold shadow-lg shadow-orange-900/30 transition hover:-translate-y-0.5 hover:shadow-orange-500/20"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={resetAbout}
              className="rounded-xl border border-white/15 bg-white/[0.08] px-8 py-3 text-sm font-semibold transition hover:bg-white/[0.15]"
            >
              Reset
            </button>
          </div>

          {/* Saved Status */}
          {saved && (
            <div className="mt-4 text-center">
              <span className="inline-flex rounded-full border border-green-300/20 bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-100">
                ✓ About information saved successfully
              </span>
            </div>
          )}
        </section>

        {/* Bengali Note */}
        <div
          className="mx-auto mt-4 max-w-3xl text-center text-xs leading-6 text-white/60"
          style={{
            fontFamily:
              "'Noto Sans Bengali', 'Noto Sans', 'Arial Unicode MS', sans-serif",
          }}
        >
          এখানে বাংলা, English এবং Italiano একসাথে লিখতে পারবেন।
        </div>
      </div>
    </main>
  );
}