"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
};

const MENU_KEY = "nababi-menu";
const CATEGORY_KEY = "nababi-categories";
const BACKGROUND_KEY = "nababi-menu-background";

const defaultCategories = [
  "Biryani",
  "Starters",
  "Main Course",
  "Chicken",
  "Mutton",
  "Vegetarian",
  "Rice",
  "Drinks",
  "Desserts",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Biryani",
  image: "",
  available: true,
};

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [background, setBackground] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(MENU_KEY);
      const savedCategories = localStorage.getItem(CATEGORY_KEY);
      const savedBackground = localStorage.getItem(BACKGROUND_KEY);

      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed)) setItems(parsed);
      }

      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const names = parsed
            .map((item: unknown) => {
              if (typeof item === "string") return item;

              if (
                item &&
                typeof item === "object" &&
                "nameEnglish" in item
              ) {
                return String(
                  (item as { nameEnglish?: string }).nameEnglish || ""
                );
              }

              return "";
            })
            .filter(Boolean);

          if (names.length > 0) {
            setCategories(Array.from(new Set(names)));
          }
        }
      }

      if (savedBackground) {
        setBackground(savedBackground);
      }
    } catch {
      setError("Saved data load করা যায়নি।");
    }
  }, []);

  const saveItems = (next: MenuItem[]) => {
    setItems(next);
    localStorage.setItem(MENU_KEY, JSON.stringify(next));
  };

  const saveCategories = (next: string[]) => {
    setCategories(next);
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(next));
  };

  const success = (text: string) => {
    setMessage(text);
    setError("");

    window.setTimeout(() => setMessage(""), 2500);
  };

  const fail = (text: string) => {
    setError(text);
    setMessage("");

    window.setTimeout(() => setError(""), 3000);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const readImage = (file: File, callback: (image: string) => void) => {
    if (!file.type.startsWith("image/")) {
      fail("শুধু Image file upload করুন।");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      fail("Image সর্বোচ্চ 8MB হতে পারবে।");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      callback(String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  const handleProductImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    readImage(file, (image) => {
      setForm((prev) => ({
        ...prev,
        image,
      }));
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      fail("Product Name লিখুন।");
      return;
    }

    if (!form.description.trim()) {
      fail("Description লিখুন।");
      return;
    }

    if (!form.price.trim()) {
      fail("Price লিখুন।");
      return;
    }

    if (!form.category) {
      fail("Category নির্বাচন করুন।");
      return;
    }

    if (editingId !== null) {
      const updated = items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: form.name.trim(),
              description: form.description.trim(),
              price: form.price.trim(),
              category: form.category,
              image: form.image,
              available: form.available,
            }
          : item
      );

      saveItems(updated);
      success("Product সফলভাবে Update হয়েছে।");
    } else {
      const newItem: MenuItem = {
        id: Date.now(),
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        category: form.category,
        image: form.image,
        available: form.available,
      };

      saveItems([...items, newItem]);
      success("Product সফলভাবে Save হয়েছে।");
    }

    setForm({
      ...emptyForm,
      category: form.category,
    });

    setEditingId(null);
  };

  const editProduct = (item: MenuItem) => {
    setEditingId(item.id);

    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = (id: number) => {
    if (!window.confirm("এই Product-টি Delete করতে চান?")) return;

    saveItems(items.filter((item) => item.id !== id));

    if (editingId === id) {
      cancelEdit();
    }

    success("Product Delete হয়েছে।");
  };

  const toggleAvailability = (id: number) => {
    saveItems(
      items.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item
      )
    );
  };

  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      category: categories[0] || "Biryani",
    });
  };

  const addCategory = () => {
    const value = newCategory.trim();

    if (!value) {
      fail("Category Name লিখুন।");
      return;
    }

    const exists = categories.some(
      (category) => category.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setForm((prev) => ({
        ...prev,
        category:
          categories.find(
            (category) =>
              category.toLowerCase() === value.toLowerCase()
          ) || value,
      }));

      setNewCategory("");
      setShowCategoryInput(false);
      return;
    }

    const next = [...categories, value];

    saveCategories(next);

    setForm((prev) => ({
      ...prev,
      category: value,
    }));

    setNewCategory("");
    setShowCategoryInput(false);

    success("নতুন Category যোগ হয়েছে।");
  };

  const handleBackgroundUpload = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    readImage(file, (image) => {
      setBackground(image);
      localStorage.setItem(BACKGROUND_KEY, image);
      success("Background পরিবর্তন হয়েছে।");
    });
  };

  const removeBackground = () => {
    setBackground("");
    localStorage.removeItem(BACKGROUND_KEY);
    success("Background remove হয়েছে।");
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, search]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};

    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }

      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden p-4 md:p-6"
      style={{
        background: background
          ? `linear-gradient(135deg, rgba(72,20,8,.70), rgba(93,20,70,.60)), url(${background}) center/cover fixed`
          : "radial-gradient(circle at top left, #fed7aa 0%, #fff1f2 32%, #fce7f3 58%, #ede9fe 100%)",
      }}
    >
      {/* TOP BAR */}
      <div className="mx-auto mb-5 w-full max-w-[1800px] rounded-[28px] border border-white/60 bg-gradient-to-r from-orange-500/95 via-red-500/95 to-purple-600/95 p-5 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-100">
              Nababi Ristorante
            </p>

            <h1 className="mt-1 text-3xl font-black text-white md:text-4xl">
              Menu Management
            </h1>

            <p className="mt-1 text-sm text-white/80">
              Add, Edit এবং Manage আপনার Restaurant Products
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-2xl bg-white/20 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/30">
              🖼️ Change Background
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBackgroundUpload}
              />
            </label>

            {background && (
              <button
                type="button"
                onClick={removeBackground}
                className="rounded-2xl bg-black/20 px-5 py-3 font-bold text-white backdrop-blur"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className="mx-auto mb-5 w-full max-w-[1800px] rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-bold text-green-700 shadow-lg">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mx-auto mb-5 w-full max-w-[1800px] rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700 shadow-lg">
          ⚠ {error}
        </div>
      )}

      {/* CATEGORY BAR */}
      <div className="mx-auto mb-5 w-full max-w-[1800px] rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    category,
                  }))
                }
                className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                  form.category === category
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white text-orange-700 shadow hover:bg-orange-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {showCategoryInput && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category"
                className="w-44 rounded-xl border border-purple-200 bg-white px-4 py-2.5 outline-none"
              />
            )}

            {showCategoryInput && (
              <button
                type="button"
                onClick={addCategory}
                className="rounded-xl bg-purple-600 px-4 py-2.5 font-bold text-white"
              >
                Add
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setShowCategoryInput((value) => !value)
              }
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 font-bold text-white shadow"
            >
              ＋ Category
            </button>
          </div>
        </div>
      </div>

      {/* EXACT TWO EQUAL BOXES */}
      <div className="mx-auto grid min-h-[calc(100vh-250px)] w-full max-w-[1800px] grid-cols-1 gap-5 lg:grid-cols-2">
        {/* LEFT BOX */}
        <section className="rounded-[30px] border border-white/70 bg-gradient-to-br from-white/95 via-orange-50/95 to-pink-50/95 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                  {editingId !== null ? "EDIT PRODUCT" : "ADD PRODUCT"}
                </span>

                <h2 className="mt-2 text-2xl font-black">
                  {editingId !== null
                    ? "Edit Your Product"
                    : "Add New Product"}
                </h2>
              </div>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl bg-white/20 px-4 py-2 font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* IMAGE */}
            <label className="block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-pink-50">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Product Preview"
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 flex-col items-center justify-center">
                  <span className="text-6xl">📷</span>
                  <span className="mt-2 font-black text-orange-700">
                    Upload Product Image
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProductImage}
              />
            </label>

            {/* NAME */}
            <div>
              <label className="mb-2 block font-black text-gray-800">
                Product Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3.5 shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block font-black text-gray-800">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Italian / English / Bengali Description"
                className="w-full resize-none rounded-2xl border border-orange-100 bg-white px-4 py-3.5 shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* PRICE */}
              <div>
                <label className="mb-2 block font-black text-gray-800">
                  Price *
                </label>

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="€15.90"
                  className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3.5 shadow-sm outline-none focus:border-orange-500"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block font-black text-gray-800">
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3.5 shadow-sm outline-none focus:border-orange-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AVAILABLE */}
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div>
                <p className="font-black text-gray-900">
                  Product Available
                </p>

                <p className="text-xs text-gray-500">
                  Customer-এর জন্য Show করবেন?
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
                className="h-6 w-6 accent-green-600"
              />
            </label>

            {/* SAVE */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              {editingId !== null
                ? "✓ UPDATE PRODUCT"
                : "＋ SAVE PRODUCT"}
            </button>
          </form>
        </section>

        {/* RIGHT BOX */}
        <section className="rounded-[30px] border border-white/70 bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-5 text-white shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                  {items.length} PRODUCTS
                </span>

                <h2 className="mt-2 text-2xl font-black">
                  My Added Products
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  আপনার Save করা সব Product এখানে থাকবে।
                </p>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔎 Search..."
                className="rounded-xl bg-white px-4 py-3 text-gray-800 outline-none md:w-56"
              />
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 text-center">
              <div className="text-7xl">🍽️</div>

              <h3 className="mt-5 text-2xl font-black text-gray-900">
                No Products Yet
              </h3>

              <p className="mt-2 max-w-md px-5 text-sm text-gray-500">
                বাম পাশের Add Product form থেকে Product Save করলে
                এখানে Image সহ দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="max-h-[calc(100vh-390px)] space-y-7 overflow-y-auto pr-2">
              {categories
                .filter((category) => groupedItems[category]?.length)
                .map((category) => (
                  <div key={category}>
                    <div className="mb-4 flex items-center justify-between border-b-2 border-purple-100 pb-3">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">
                          {category}
                        </h3>

                        <p className="text-xs font-bold text-gray-500">
                          {groupedItems[category].length} Products
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);

                          setForm({
                            ...emptyForm,
                            category,
                          });

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="rounded-xl bg-purple-100 px-4 py-2 text-sm font-black text-purple-700 hover:bg-purple-200"
                      >
                        ＋ Add
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      {groupedItems[category].map((item) => (
                        <article
                          key={item.id}
                          className="overflow-hidden rounded-3xl border border-white bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                        >
                          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-6xl">
                                🍽️
                              </div>
                            )}

                            <span
                              className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black text-white shadow ${
                                item.available
                                  ? "bg-green-500"
                                  : "bg-gray-700"
                              }`}
                            >
                              {item.available
                                ? "Available"
                                : "Hidden"}
                            </span>
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-black text-gray-900">
                                {item.name}
                              </h4>

                              <span className="shrink-0 rounded-xl bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">
                                {item.price}
                              </span>
                            </div>

                            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                              {item.description}
                            </p>

                            <div className="mt-4 grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => editProduct(item)}
                                className="rounded-xl bg-blue-50 px-2 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-100"
                              >
                                ✏️ Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleAvailability(item.id)
                                }
                                className="rounded-xl bg-green-50 px-2 py-2.5 text-xs font-black text-green-700 hover:bg-green-100"
                              >
                                {item.available
                                  ? "Hide"
                                  : "Show"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteProduct(item.id)
                                }
                                className="rounded-xl bg-red-50 px-2 py-2.5 text-xs font-black text-red-700 hover:bg-red-100"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}