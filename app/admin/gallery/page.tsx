/* app/admin/gallery/page.tsx */
"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type GalleryItem = {
  id: string | number;
  title: string;
  category: string;
  image: string;
  visible: boolean;
  show: boolean;
  order: number;
  displayOrder: number;
  createdAt: string;
};

const STORAGE_KEY = "nababi-gallery";

const DEFAULT_CATEGORIES = [
  "Restaurant",
  "Food",
  "Interior",
  "Events",
  "Other",
];

function readGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item, index) => ({
      id: item.id ?? `gallery-${Date.now()}-${index}`,
      title: item.title ?? item.name ?? "",
      category: item.category ?? "Other",
      image: item.image ?? item.imageUrl ?? item.src ?? item.url ?? "",
      visible: item.visible ?? item.showOnWebsite ?? item.isVisible ?? true,
      show: item.show ?? item.showOnWebsite ?? item.isVisible ?? true,
      order: Number(item.order ?? item.displayOrder ?? index + 1),
      displayOrder: Number(
        item.displayOrder ?? item.order ?? index + 1
      ),
      createdAt: item.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function saveGallery(items: GalleryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("nababi-gallery-updated"));
    return true;
  } catch (error) {
    console.error("Gallery save error:", error);
    return false;
  }
}

/*
  Compress uploaded images before putting them into localStorage.
  This is important because large phone photos can quickly exceed
  the browser's localStorage limit and make the second/third image
  fail to save.
*/
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read image."));

    reader.onload = () => {
      const source = new Image();

      source.onerror = () => reject(new Error("Could not process image."));

      source.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1200;

        let width = source.width;
        let height = source.height;

        const ratio = Math.min(
          1,
          maxWidth / width,
          maxHeight / height
        );

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }

        ctx.drawImage(source, 0, 0, width, height);

        const result = canvas.toDataURL("image/jpeg", 0.82);

        resolve(result);
      };

      source.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Restaurant");
  const [image, setImage] = useState("");
  const [visible, setVisible] = useState(true);
  const [order, setOrder] = useState("1");

  const [editingId, setEditingId] = useState<string | number | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = () => {
      setItems(readGallery());
    };

    load();

    window.addEventListener("storage", load);
    window.addEventListener("nababi-gallery-updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("nababi-gallery-updated", load);
    };
  }, []);

  const categories = useMemo(() => {
    const saved = items
      .map((item) => item.category)
      .filter(Boolean);

    return Array.from(
      new Set([...DEFAULT_CATEGORIES, ...saved])
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return [...items]
      .filter((item) => {
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);

        const matchesCategory =
          filterCategory === "All" ||
          item.category === filterCategory;

        return matchesSearch && matchesCategory;
      })
      .sort(
        (a, b) =>
          Number(a.order ?? a.displayOrder ?? 0) -
          Number(b.order ?? b.displayOrder ?? 0)
      );
  }, [items, search, filterCategory]);

  const resetForm = (nextOrder?: number) => {
    setTitle("");
    setCategory("Restaurant");
    setImage("");
    setVisible(true);
    setOrder(String(nextOrder ?? readGallery().length + 1));
    setEditingId(null);
    setError("");
  };

  const handleImage = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");
    setUploading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 8 * 1024 * 1024) {
        throw new Error("Image must be smaller than 8MB.");
      }

      const compressed = await compressImage(file);

      setImage(compressed);
      setMessage("Image ready to save.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not process image."
      );
      setImage("");
    } finally {
      setUploading(false);

      /*
        Allow selecting the same file again after an error/update.
      */
      event.target.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!image) {
      setError("Please select an image.");
      return;
    }

    const current = readGallery();

    const numericOrder =
      Number(order) || current.length + 1;

    const id =
      editingId !== null
        ? editingId
        : `gallery-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 10)}`;

    const newItem: GalleryItem = {
      id,
      title: title.trim(),
      category: category.trim() || "Other",
      image,
      visible,
      show: visible,
      order: numericOrder,
      displayOrder: numericOrder,
      createdAt:
        editingId !== null
          ? current.find((item) => item.id === editingId)
              ?.createdAt ?? new Date().toISOString()
          : new Date().toISOString(),
    };

    let updated: GalleryItem[];

    if (editingId !== null) {
      updated = current.map((item) =>
        item.id === editingId ? newItem : item
      );
    } else {
      /*
        IMPORTANT:
        Add the new image to the existing array.
        Never replace the old gallery.
      */
      updated = [...current, newItem];
    }

    const saved = saveGallery(updated);

    if (!saved) {
      setError(
        "Gallery save failed. Your browser storage is full. Please use smaller images."
      );
      return;
    }

    /*
      Read again from localStorage so the Admin list and Home Page
      always receive exactly the same saved data.
    */
    const verified = readGallery();

    setItems(verified);

    setMessage(
      editingId !== null
        ? "Gallery image updated successfully."
        : "Gallery image added successfully."
    );

    resetForm(verified.length + 1);
  };

  const editItem = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || "Other");
    setImage(item.image);
    setVisible(
      item.visible !== false && item.show !== false
    );
    setOrder(
      String(item.order ?? item.displayOrder ?? 1)
    );
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = (
    id: string | number
  ) => {
    const current = readGallery();

    const updated = current.map((item) => {
      if (item.id !== id) return item;

      const next =
        !(item.visible !== false && item.show !== false);

      return {
        ...item,
        visible: next,
        show: next,
      };
    });

    const saved = saveGallery(updated);

    if (saved) {
      setItems(readGallery());
      setMessage("Gallery visibility updated.");
    }
  };

  const deleteItem = (id: string | number) => {
    const current = readGallery();

    const updated = current.filter(
      (item) => item.id !== id
    );

    const saved = saveGallery(updated);

    if (saved) {
      const verified = readGallery();

      setItems(verified);

      if (editingId === id) {
        resetForm(verified.length + 1);
      }

      setMessage("Gallery image deleted.");
    }
  };

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Nababi Ristorante
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Gallery Management
          </h1>

          <p className="mt-2 text-sm text-white/45">
            একাধিক ছবি যোগ করুন — সব ছবি Home Page Gallery-তে দেখাবে।
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ADD / EDIT */}
          <section className="rounded-[28px] border border-amber-500/15 bg-gradient-to-br from-[#17100a] via-[#0c0c0c] to-[#16090d] p-5 shadow-2xl sm:p-7">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                {editingId !== null
                  ? "Edit Gallery"
                  : "Add Gallery"}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {editingId !== null
                  ? "Update Image"
                  : "Upload Image"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-white/65">
                  Image *
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImage}
                  disabled={uploading}
                  className="block w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:font-semibold file:text-black disabled:opacity-50"
                />

                {uploading && (
                  <p className="mt-2 text-xs text-amber-300">
                    Image processing...
                  </p>
                )}

                {image && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/65">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Gallery title"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/65">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                  >
                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/65">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) =>
                      setOrder(e.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4">
                <div>
                  <p className="text-sm font-medium">
                    Show on Website
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Home Page Gallery-তে ছবিটি দেখাবে
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setVisible((v) => !v)
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    visible
                      ? "bg-amber-500"
                      : "bg-white/20"
                  }`}
                  aria-label="Toggle visibility"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      visible
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  ✓ {message}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 py-4 text-sm font-bold text-white shadow-xl transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId !== null
                  ? "Update Gallery Image"
                  : "Save Gallery Image"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/70 transition hover:bg-white/[0.08]"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </section>

          {/* LIST */}
          <section className="rounded-[28px] border border-pink-500/15 bg-gradient-to-br from-[#150a13] via-[#0c0c0c] to-[#100a18] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-pink-300">
                  Added Images
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Gallery Images
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                <p className="text-2xl font-bold text-amber-300">
                  {items.length}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-white/35">
                  Total
                </p>
              </div>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search gallery..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-pink-400/50"
              />

              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-5 py-14 text-center">
                <div className="text-5xl">
                  🖼️
                </div>

                <p className="mt-4 text-sm text-white/50">
                  No gallery images found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const isVisible =
                    item.visible !== false &&
                    item.show !== false;

                  return (
                    <article
                      key={String(item.id)}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]"
                    >
                      <div className="grid sm:grid-cols-[150px_1fr]">
                        <img
                          src={item.image}
                          alt={
                            item.title ||
                            "Gallery"
                          }
                          className="h-40 w-full object-cover sm:h-full sm:min-h-[150px]"
                        />

                        <div className="p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-200">
                              {item.category}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] ${
                                isVisible
                                  ? "bg-green-500/10 text-green-200"
                                  : "bg-white/10 text-white/40"
                              }`}
                            >
                              {isVisible
                                ? "Visible"
                                : "Hidden"}
                            </span>

                            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/40">
                              Order{" "}
                              {item.order}
                            </span>
                          </div>

                          <h3 className="mt-3 font-semibold text-white">
                            {item.title ||
                              "Gallery Image"}
                          </h3>

                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                editItem(item)
                              }
                              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-white/70 transition hover:bg-white/10"
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleVisibility(
                                  item.id
                                )
                              }
                              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-white/70 transition hover:bg-white/10"
                            >
                              {isVisible
                                ? "👁️ Hide"
                                : "👁️ Show"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteItem(
                                  item.id
                                )
                              }
                              className="rounded-xl border border-red-400/10 bg-red-500/10 px-3 py-2.5 text-xs text-red-200 transition hover:bg-red-500/20"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
