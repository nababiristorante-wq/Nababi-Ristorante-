"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type GalleryItem = {
  id: number;
  image: string;
  category: string;
  visible: boolean;
  order: number;
};

const STORAGE_KEY = "nababi-gallery";

const categories = [
  "Restaurant",
  "Food",
  "Interior",
  "Events",
  "Chef",
  "Other",
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Restaurant");
  const [visible, setVisible] = useState(true);
  const [order, setOrder] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems([]);
    }
  }, []);

  const saveItems = (nextItems: GalleryItem[]) => {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
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
      setImage(String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setImage("");
    setCategory("Restaurant");
    setVisible(true);
    setOrder(items.length + 1);
    setEditingId(null);
  };

  const saveGalleryItem = () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    if (editingId !== null) {
      const updated = items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              image,
              category,
              visible,
              order: Number(order) || 1,
            }
          : item
      );

      saveItems(updated);
    } else {
      const newItem: GalleryItem = {
        id: Date.now(),
        image,
        category,
        visible,
        order: Number(order) || 1,
      };

      saveItems([...items, newItem]);
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);

    resetForm();
  };

  const editItem = (item: GalleryItem) => {
    setEditingId(item.id);
    setImage(item.image);
    setCategory(item.category);
    setVisible(item.visible);
    setOrder(item.order);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteItem = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    saveItems(items.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  const toggleVisibility = (id: number) => {
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            visible: !item.visible,
          }
        : item
    );

    saveItems(updated);
  };

  const filteredItems = useMemo(() => {
    return [...items]
      .filter((item) => {
        if (filter === "All") return true;
        return item.category === filter;
      })
      .sort((a, b) => a.order - b.order);
  }, [items, filter]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute right-[-100px] top-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Center Wrapper */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-orange-100 backdrop-blur-xl">
              NABABI RISTORANTE
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Gallery Management
            </h1>

            <p className="mt-2 text-sm text-orange-100/75">
              Manage restaurant photos, food images and gallery visibility.
            </p>
          </div>

          {/* Main Management Card */}
          <div className="rounded-[30px] border border-white/15 bg-white/[0.10] p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              {/* Add / Edit */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">
                    {editingId !== null ? "Edit Image" : "Add Gallery Image"}
                  </h2>

                  <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                </div>

                {/* Image Preview */}
                <div className="mb-5 overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                  {image ? (
                    <div className="relative aspect-[4/3]">
                      <img
                        src={image}
                        alt="Gallery preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute right-3 top-3 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center px-5 text-center transition hover:bg-white/5">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/30 to-fuchsia-400/30 text-2xl">
                        📷
                      </div>

                      <span className="text-sm font-medium text-white">
                        Upload Gallery Image
                      </span>

                      <span className="mt-1 text-xs text-white/50">
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

                {/* Upload Button */}
                {image && (
                  <label className="mb-5 block cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Category */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-white/85">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#351b18]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/60"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item} className="bg-[#351b18]">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-white/85">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                  />
                </div>

                {/* Visibility */}
                <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Visible</p>
                    <p className="text-xs text-white/50">
                      Show this image in gallery
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
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={saveGalleryItem}
                    className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:scale-[1.01] hover:shadow-orange-500/20"
                  >
                    {editingId !== null ? "Update Image" : "Save Image"}
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {saved && (
                  <div className="mt-4 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-200">
                    Image saved successfully.
                  </div>
                )}
              </section>

              {/* Gallery List */}
              <section className="rounded-[26px] border border-white/15 bg-black/10 p-5">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Gallery Images</h2>

                    <div className="mt-1 h-1 w-14 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-400" />
                  </div>

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-xl border border-white/15 bg-[#351b18]/80 px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="All" className="bg-[#351b18]">
                      All Categories
                    </option>

                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#351b18]"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03]">
                    <div className="text-center">
                      <div className="mb-3 text-4xl">🖼️</div>
                      <p className="text-sm font-medium text-white/80">
                        No gallery images yet
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        Upload your first restaurant image.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-orange-300/20"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.category}
                            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                              !item.visible ? "opacity-40 grayscale" : ""
                            }`}
                          />

                          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                            {item.category}
                          </div>

                          <div
                            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md ${
                              item.visible
                                ? "bg-green-500/80 text-white"
                                : "bg-red-500/80 text-white"
                            }`}
                          >
                            {item.visible ? "Visible" : "Hidden"}
                          </div>
                        </div>

                        <div className="p-3">
                          <div className="mb-3 flex items-center justify-between text-xs text-white/45">
                            <span>Order: {item.order}</span>
                            <span>{item.category}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => editItem(item)}
                              className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleVisibility(item.id)}
                              className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                            >
                              {item.visible ? "Hide" : "Show"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              className="rounded-lg border border-red-400/10 bg-red-500/10 px-2 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
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