"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type BreakingNews = {
  id: number;
  text: string;
  visible: boolean;
  startDate: string;
  endDate: string;
};

const STORAGE_KEY = "nababi-breaking-news";

export default function BreakingNewsPage() {
  const [newsList, setNewsList] = useState<BreakingNews[]>([]);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setNewsList(JSON.parse(stored));
      }
    } catch {
      setNewsList([]);
    }
  }, []);

  const saveNewsList = (nextList: BreakingNews[]) => {
    setNewsList(nextList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
  };

  const resetForm = () => {
    setText("");
    setVisible(true);
    setStartDate("");
    setEndDate("");
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanText = text.trim();

    if (!cleanText) {
      alert("Please enter breaking news text.");
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    if (editingId !== null) {
      const updated = newsList.map((item) =>
        item.id === editingId
          ? {
              ...item,
              text: cleanText,
              visible,
              startDate,
              endDate,
            }
          : item
      );

      saveNewsList(updated);
    } else {
      const newNews: BreakingNews = {
        id: Date.now(),
        text: cleanText,
        visible,
        startDate,
        endDate,
      };

      saveNewsList([newNews, ...newsList]);
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);

    resetForm();
  };

  const editNews = (item: BreakingNews) => {
    setEditingId(item.id);
    setText(item.text);
    setVisible(item.visible);
    setStartDate(item.startDate);
    setEndDate(item.endDate);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNews = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this breaking news?"
    );

    if (!confirmDelete) return;

    saveNewsList(newsList.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  const toggleVisibility = (id: number) => {
    const updated = newsList.map((item) =>
      item.id === id
        ? {
            ...item,
            visible: !item.visible,
          }
        : item
    );

    saveNewsList(updated);
  };

  const activeNews = useMemo(() => {
    const now = new Date();

    return newsList.filter((item) => {
      if (!item.visible) return false;

      if (item.startDate) {
        const start = new Date(`${item.startDate}T00:00:00`);

        if (now < start) return false;
      }

      if (item.endDate) {
        const end = new Date(`${item.endDate}T23:59:59`);

        if (now > end) return false;
      }

      return true;
    });
  }, [newsList]);

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
              Breaking News Management
            </h1>

            <p className="mt-2 text-sm text-orange-100/75">
              Create and manage important announcements for your website.
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-[30px] border border-white/15 bg-white/[0.10] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
              {/* Form */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">
                    {editingId !== null ? "Edit News" : "Add Breaking News"}
                  </h2>

                  <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* News Text */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      News Text
                    </label>

                    <textarea
                      rows={6}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write your breaking news or important announcement..."
                      className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/85">
                        Start Date
                      </label>

                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-orange-400/60"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/85">
                        End Date
                      </label>

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-orange-400/60"
                      />
                    </div>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Show on Website</p>

                      <p className="mt-1 text-xs text-white/45">
                        Display this news to visitors
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVisible(!visible)}
                      className={`relative h-7 w-12 rounded-full transition ${
                        visible ? "bg-orange-500" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
                          visible ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:scale-[1.01]"
                    >
                      {editingId !== null ? "Update News" : "Save News"}
                    </button>

                    {editingId !== null && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {saved && (
                    <div className="rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-200">
                      Breaking news saved successfully.
                    </div>
                  )}
                </form>
              </section>

              {/* News List */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">News List</h2>

                    <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                  </div>

                  <div className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-200">
                    Active: {activeNews.length}
                  </div>
                </div>

                {/* Active Preview */}
                {activeNews.length > 0 && (
                  <div className="mb-5 rounded-2xl border border-orange-400/20 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-fuchsia-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20">
                        🔔
                      </span>

                      <span className="text-sm font-semibold text-orange-100">
                        Live Website Preview
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-white/75">
                      {activeNews[0].text}
                    </p>
                  </div>
                )}

                {newsList.length === 0 ? (
                  <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03]">
                    <div className="text-center">
                      <div className="mb-3 text-4xl">📢</div>

                      <p className="text-sm font-medium text-white/80">
                        No breaking news yet
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Add your first announcement.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsList.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-orange-300/20"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
                              📢
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-6 text-white/85">
                                {item.text}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                                    item.visible
                                      ? "bg-green-500/15 text-green-200"
                                      : "bg-red-500/15 text-red-200"
                                  }`}
                                >
                                  {item.visible ? "Visible" : "Hidden"}
                                </span>

                                {item.startDate && (
                                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
                                    Start: {item.startDate}
                                  </span>
                                )}

                                {item.endDate && (
                                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
                                    End: {item.endDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 border-t border-white/10 pt-3">
                            <button
                              type="button"
                              onClick={() => editNews(item)}
                              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleVisibility(item.id)}
                              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                            >
                              {item.visible ? "Hide" : "Show"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteNews(item.id)}
                              className="flex-1 rounded-lg border border-red-400/10 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}