"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
};

type MenuCategory = {
  id: string;
  name: string;
  image: string;
  order: number;
  visible: boolean;
};

const BUCKET = "menu-images";

const emptyItem: MenuItem = {
  id: 0,
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  available: true,
};

const emptyCategory: MenuCategory = {
  id: "",
  name: "",
  image: "",
  order: 0,
  visible: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeItem(row: any): MenuItem {
  return {
    id: Number(row.id),
    name: row.name ?? "",
    description: row.description ?? "",
    price: row.price == null ? "" : String(row.price),
    category: row.category ?? "",
    image: row.image_url ?? row.image ?? "",
    available: row.is_available !== false,
  };
}

function normalizeCategory(row: any, index: number): MenuCategory {
  return {
    id: String(row.id),
    name: row.name ?? "",
    image: row.image_url ?? row.image ?? "",
    order: Number(row.display_order ?? row.order ?? index),
    visible: row.visible !== false,
  };
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");

  const [itemForm, setItemForm] = useState<MenuItem>(emptyItem);
  const [categoryForm, setCategoryForm] =
    useState<MenuCategory>(emptyCategory);

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/menu", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load menu data.");
      }

      const data = await response.json();

      setItems(
        Array.isArray(data.items)
          ? data.items.map(normalizeItem)
          : []
      );

      setCategories(
        Array.isArray(data.categories)
          ? data.categories.map(normalizeCategory)
          : []
      );

      setBackgroundImage(
        data.settings?.background_image ?? ""
      );
    } catch (err) {
      console.error(err);
      setError("Menu data load করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(
    file: File,
    folder: string
  ): Promise<string> {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;
    const path = `${folder}/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    if (!data.publicUrl) {
      throw new Error("Could not create public image URL.");
    }

    return data.publicUrl;
  }

  async function handleItemImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("শুধু image file নির্বাচন করুন।");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const url = await uploadImage(file, "items");
      setItemForm((current) => ({
        ...current,
        image: url,
      }));
      setMessage("Item image uploaded হয়েছে।");
    } catch (err) {
      console.error(err);
      setError(
        "Item image upload হয়নি। Storage bucket/policy পরীক্ষা করুন।"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleCategoryImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("শুধু image file নির্বাচন করুন।");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const url = await uploadImage(file, "categories");
      setCategoryForm((current) => ({
        ...current,
        image: url,
      }));
      setMessage("Category image uploaded হয়েছে।");
    } catch (err) {
      console.error(err);
      setError(
        "Category image upload হয়নি। Storage bucket/policy পরীক্ষা করুন।"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleBackgroundImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("শুধু image file নির্বাচন করুন।");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const url = await uploadImage(file, "background");
      setBackgroundImage(url);
      await saveMenuData(items, categories, url);
      setMessage("Menu background save হয়েছে।");
    } catch (err) {
      console.error(err);
      setError("Background image upload/save হয়নি।");
    } finally {
      setUploading(false);
    }
  }

  async function saveMenuData(
    nextItems: MenuItem[],
    nextCategories: MenuCategory[],
    nextBackground: string
  ) {
    const response = await fetch("/api/admin/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: nextItems,
        categories: nextCategories,
        backgroundImage: nextBackground,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Could not save menu data.");
    }
  }

  async function saveAll() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await saveMenuData(items, categories, backgroundImage);
      setMessage("সব Menu data Supabase-এ save হয়েছে।");
      await loadMenu();
    } catch (err) {
      console.error(err);
      setError("Save হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  function submitItem(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = itemForm.name.trim();

    if (!name) {
      setError("Item name দিন।");
      return;
    }

    if (!itemForm.category) {
      setError("Category নির্বাচন করুন।");
      return;
    }

    if (editingItemId !== null) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingItemId
            ? {
                ...itemForm,
                id: editingItemId,
                name,
              }
            : item
        )
      );
    } else {
      const newId =
        items.length > 0
          ? Math.max(...items.map((item) => item.id)) + 1
          : 1;

      setItems((current) => [
        ...current,
        {
          ...itemForm,
          id: newId,
          name,
        },
      ]);
    }

    setItemForm({ ...emptyItem });
    setEditingItemId(null);
    setMessage(
      editingItemId !== null
        ? "Item update করা হয়েছে। এখন Save All চাপুন।"
        : "Item যোগ করা হয়েছে। এখন Save All চাপুন।"
    );
  }

  function editItem(item: MenuItem) {
    setItemForm({ ...item });
    setEditingItemId(item.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteItem(id: number) {
    if (!window.confirm("এই item delete করবেন?")) return;

    setItems((current) => current.filter((item) => item.id !== id));
    setMessage("Item delete করা হয়েছে। এখন Save All চাপুন।");
  }

  function submitCategory(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = categoryForm.name.trim();

    if (!name) {
      setError("Category name দিন।");
      return;
    }

    if (editingCategoryId !== null) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategoryId
            ? {
                ...categoryForm,
                id: editingCategoryId,
                name,
              }
            : category
        )
      );
    } else {
      const baseId = slugify(name) || `category-${Date.now()}`;
      let newId = baseId;
      let counter = 2;

      while (categories.some((category) => category.id === newId)) {
        newId = `${baseId}-${counter}`;
        counter += 1;
      }

      const nextOrder =
        categories.length > 0
          ? Math.max(...categories.map((category) => category.order)) + 1
          : 0;

      setCategories((current) => [
        ...current,
        {
          ...categoryForm,
          id: newId,
          name,
          order: nextOrder,
        },
      ]);
    }

    setCategoryForm({ ...emptyCategory });
    setEditingCategoryId(null);
    setMessage(
      editingCategoryId !== null
        ? "Category update করা হয়েছে। এখন Save All চাপুন।"
        : "Category যোগ করা হয়েছে। এখন Save All চাপুন।"
    );
  }

  function editCategory(category: MenuCategory) {
    setCategoryForm({ ...category });
    setEditingCategoryId(category.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteCategory(id: string) {
    const hasItems = items.some((item) => item.category === id);

    if (hasItems) {
      setError(
        "এই Category-এর মধ্যে item আছে। আগে item-গুলোর Category পরিবর্তন করুন।"
      );
      return;
    }

    if (!window.confirm("এই category delete করবেন?")) return;

    setCategories((current) =>
      current.filter((category) => category.id !== id)
    );

    setMessage("Category delete করা হয়েছে। এখন Save All চাপুন।");
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>Loading Menu...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Menu Management</h1>
            <p style={styles.subtitle}>
              Supabase + Gallery image upload
            </p>
          </div>

          <button
            type="button"
            onClick={saveAll}
            disabled={saving || uploading}
            style={styles.primaryButton}
          >
            {saving ? "Saving..." : "Save All"}
          </button>
        </header>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Menu Background</h2>
          <p style={styles.helper}>
            Mobile Gallery থেকে background image নির্বাচন করুন।
          </p>

          <label style={styles.uploadButton}>
            {uploading ? "Uploading..." : "📷 Choose from Gallery"}
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImage}
              disabled={uploading}
              style={styles.hiddenInput}
            />
          </label>

          {backgroundImage && (
            <div style={styles.previewBox}>
              <img
                src={backgroundImage}
                alt="Menu background preview"
                style={styles.backgroundPreview}
              />
              <button
                type="button"
                onClick={() => setBackgroundImage("")}
                style={styles.dangerSmall}
              >
                Remove Background
              </button>
            </div>
          )}
        </section>

        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              {editingCategoryId ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={submitCategory}>
              <label style={styles.label}>Category Name</label>
              <input
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Example: Starters"
                style={styles.input}
              />

              <label style={styles.label}>Category Image</label>
              <label style={styles.uploadButton}>
                {uploading ? "Uploading..." : "📷 Choose from Gallery"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImage}
                  disabled={uploading}
                  style={styles.hiddenInput}
                />
              </label>

              {categoryForm.image && (
                <div style={styles.imagePreviewWrap}>
                  <img
                    src={categoryForm.image}
                    alt="Category preview"
                    style={styles.imagePreview}
                  />
                </div>
              )}

              <div style={styles.buttonRow}>
                <button
                  type="submit"
                  disabled={uploading}
                  style={styles.primaryButton}
                >
                  {editingCategoryId ? "Update Category" : "Add Category"}
                </button>

                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryForm({ ...emptyCategory });
                      setEditingCategoryId(null);
                    }}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div style={styles.listTitle}>Categories</div>

            {categories.length === 0 ? (
              <p style={styles.empty}>No categories yet.</p>
            ) : (
              <div style={styles.list}>
                {[...categories]
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <div key={category.id} style={styles.listItem}>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          style={styles.thumb}
                        />
                      ) : (
                        <div style={styles.thumbPlaceholder}>No Image</div>
                      )}

                      <div style={styles.listContent}>
                        <strong>{category.name}</strong>
                        <span style={styles.smallText}>
                          ID: {category.id}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => editCategory(category)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        style={styles.dangerSmall}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              {editingItemId !== null ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <form onSubmit={submitItem}>
              <label style={styles.label}>Item Name</label>
              <input
                value={itemForm.name}
                onChange={(event) =>
                  setItemForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Example: Chicken Tikka"
                style={styles.input}
              />

              <label style={styles.label}>Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={itemForm.price}
                onChange={(event) =>
                  setItemForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                placeholder="12.50"
                style={styles.input}
              />

              <label style={styles.label}>Category</label>
              <select
                value={itemForm.category}
                onChange={(event) =>
                  setItemForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                style={styles.input}
              >
                <option value="">Select Category</option>
                {categories
                  .filter((category) => category.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <label style={styles.label}>Description</label>
              <textarea
                value={itemForm.description}
                onChange={(event) =>
                  setItemForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Short description"
                rows={4}
                style={{ ...styles.input, resize: "vertical" }}
              />

              <label style={styles.label}>Item Image</label>
              <label style={styles.uploadButton}>
                {uploading ? "Uploading..." : "📷 Choose from Gallery"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleItemImage}
                  disabled={uploading}
                  style={styles.hiddenInput}
                />
              </label>

              {itemForm.image && (
                <div style={styles.imagePreviewWrap}>
                  <img
                    src={itemForm.image}
                    alt="Item preview"
                    style={styles.imagePreview}
                  />
                </div>
              )}

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={itemForm.available}
                  onChange={(event) =>
                    setItemForm((current) => ({
                      ...current,
                      available: event.target.checked,
                    }))
                  }
                />
                Available
              </label>

              <div style={styles.buttonRow}>
                <button
                  type="submit"
                  disabled={uploading}
                  style={styles.primaryButton}
                >
                  {editingItemId !== null ? "Update Item" : "Add Item"}
                </button>

                {editingItemId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setItemForm({ ...emptyItem });
                      setEditingItemId(null);
                    }}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        <section style={styles.card}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Menu Items</h2>
              <p style={styles.helper}>
                {items.length} item{items.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={saveAll}
              disabled={saving || uploading}
              style={styles.primaryButton}
            >
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>

          {items.length === 0 ? (
            <p style={styles.empty}>No menu items yet.</p>
          ) : (
            <div style={styles.itemGrid}>
              {items.map((item) => {
                const category = categories.find(
                  (entry) => entry.id === item.category
                );

                return (
                  <article key={item.id} style={styles.itemCard}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={styles.itemImage}
                      />
                    ) : (
                      <div style={styles.itemImagePlaceholder}>
                        No Image
                      </div>
                    )}

                    <div style={styles.itemBody}>
                      <div style={styles.itemTopLine}>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <strong style={styles.price}>
                          {item.price ? item.price : "—"}
                        </strong>
                      </div>

                      <span style={styles.categoryBadge}>
                        {category?.name || item.category || "No Category"}
                      </span>

                      {item.description && (
                        <p style={styles.description}>
                          {item.description}
                        </p>
                      )}

                      <div style={styles.itemFooter}>
                        <span
                          style={
                            item.available
                              ? styles.available
                              : styles.unavailable
                          }
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>

                        <div style={styles.buttonRow}>
                          <button
                            type="button"
                            onClick={() => editItem(item)}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            style={styles.dangerSmall}
                          >
                            Delete
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

        <div style={styles.bottomSaveWrap}>
          <button
            type="button"
            onClick={saveAll}
            disabled={saving || uploading}
            style={styles.saveBigButton}
          >
            {saving ? "Saving to Supabase..." : "💾 Save All Menu Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f1ea",
    color: "#24170f",
    padding: "18px 12px 50px",
  },
  container: {
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
  },
  loading: {
    minHeight: "80vh",
    display: "grid",
    placeItems: "center",
    fontSize: 18,
    fontWeight: 700,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "clamp(26px, 6vw, 40px)",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "7px 0 0",
    color: "#735f50",
    fontSize: 14,
  },
  card: {
    background: "#fff",
    border: "1px solid #eadfd3",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 8px 25px rgba(50, 30, 15, 0.06)",
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: 21,
  },
  helper: {
    margin: "0 0 13px",
    color: "#76665b",
    fontSize: 13,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: 16,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    margin: "14px 0 7px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d9cabc",
    borderRadius: 11,
    padding: "12px 13px",
    background: "#fffdf9",
    color: "#24170f",
    fontSize: 15,
    outline: "none",
  },
  hiddenInput: {
    display: "none",
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "0 15px",
    borderRadius: 11,
    border: "1px solid #cdb49d",
    background: "#fbf5ed",
    color: "#4d2f1d",
    fontWeight: 700,
    cursor: "pointer",
    boxSizing: "border-box",
  },
  primaryButton: {
    border: 0,
    borderRadius: 11,
    padding: "11px 15px",
    background: "#7b1e18",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    minHeight: 44,
  },
  secondaryButton: {
    border: "1px solid #cdbdae",
    borderRadius: 11,
    padding: "10px 14px",
    background: "#fff",
    color: "#4b392c",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 44,
  },
  editButton: {
    border: "1px solid #bca28f",
    borderRadius: 9,
    padding: "8px 11px",
    background: "#fffaf5",
    color: "#4e321f",
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerSmall: {
    border: "1px solid #d5aaa5",
    borderRadius: 9,
    padding: "8px 11px",
    background: "#fff5f4",
    color: "#8a1e18",
    fontWeight: 700,
    cursor: "pointer",
  },
  buttonRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 15,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 15,
    fontWeight: 700,
    fontSize: 14,
  },
  previewBox: {
    marginTop: 14,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid #eadfd3",
    background: "#faf7f2",
    padding: 10,
  },
  backgroundPreview: {
    display: "block",
    width: "100%",
    maxHeight: 280,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePreviewWrap: {
    marginTop: 12,
  },
  imagePreview: {
    display: "block",
    width: "100%",
    maxWidth: 300,
    aspectRatio: "4 / 3",
    objectFit: "cover",
    borderRadius: 12,
    border: "1px solid #eadfd3",
  },
  success: {
    background: "#eaf8ee",
    border: "1px solid #b7dfc1",
    color: "#1e6b35",
    borderRadius: 12,
    padding: "11px 13px",
    marginBottom: 14,
    fontSize: 14,
    fontWeight: 700,
  },
  error: {
    background: "#fff0ef",
    border: "1px solid #e8b8b3",
    color: "#8a1e18",
    borderRadius: 12,
    padding: "11px 13px",
    marginBottom: 14,
    fontSize: 14,
    fontWeight: 700,
  },
  listTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 800,
  },
  list: {
    display: "grid",
    gap: 9,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    border: "1px solid #eadfd3",
    borderRadius: 12,
    padding: 9,
    flexWrap: "wrap",
  },
  listContent: {
    flex: 1,
    minWidth: 120,
    display: "grid",
    gap: 3,
  },
  smallText: {
    color: "#8a7769",
    fontSize: 11,
    wordBreak: "break-all",
  },
  thumb: {
    width: 55,
    height: 55,
    objectFit: "cover",
    borderRadius: 9,
  },
  thumbPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 9,
    background: "#f0e8df",
    display: "grid",
    placeItems: "center",
    fontSize: 9,
    color: "#7e6c5f",
    textAlign: "center",
  },
  empty: {
    margin: 0,
    color: "#89786c",
    padding: "14px 0",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    marginTop: 14,
  },
  itemCard: {
    border: "1px solid #eadfd3",
    borderRadius: 15,
    overflow: "hidden",
    background: "#fffdf9",
  },
  itemImage: {
    display: "block",
    width: "100%",
    height: 190,
    objectFit: "cover",
  },
  itemImagePlaceholder: {
    width: "100%",
    height: 190,
    display: "grid",
    placeItems: "center",
    background: "#efe6dc",
    color: "#7e6c5f",
    fontWeight: 700,
  },
  itemBody: {
    padding: 13,
  },
  itemTopLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  itemName: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.25,
  },
  price: {
    whiteSpace: "nowrap",
    color: "#7b1e18",
  },
  categoryBadge: {
    display: "inline-block",
    marginTop: 8,
    padding: "5px 8px",
    borderRadius: 999,
    background: "#f0e5da",
    color: "#5b402c",
    fontSize: 11,
    fontWeight: 800,
  },
  description: {
    margin: "9px 0 0",
    color: "#746357",
    fontSize: 13,
    lineHeight: 1.5,
  },
  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 13,
    flexWrap: "wrap",
  },
  available: {
    color: "#26733d",
    background: "#e9f6ed",
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 11,
    fontWeight: 800,
  },
  unavailable: {
    color: "#8a1e18",
    background: "#fff0ef",
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 11,
    fontWeight: 800,
  },
  bottomSaveWrap: {
    position: "sticky",
    bottom: 10,
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    marginTop: 4,
    pointerEvents: "none",
  },
  saveBigButton: {
    pointerEvents: "auto",
    width: "min(100%, 520px)",
    minHeight: 50,
    border: 0,
    borderRadius: 14,
    background: "#7b1e18",
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(60, 20, 10, 0.2)",
  },
};
