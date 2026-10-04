"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemAvailable, setItemAvailable] = useState(true);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/menu", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Menu load failed.");

      setItems(
        (data.items || []).map((x: any) => ({
          id: Number(x.id),
          name: x.name || "",
          description: x.description || "",
          price: x.price == null ? "" : String(x.price),
          category: x.category || "",
          image: x.image_url || "",
          available: x.is_available !== false,
        }))
      );
      setCategories(
        (data.categories || []).map((x: any) => ({
          id: String(x.id),
          name: x.name || "",
          image: x.image_url || "",
          order: Number(x.display_order || 0),
          visible: x.visible !== false,
        }))
      );
      setBackgroundImage(data.settings?.background_image || "");
    } catch (e: any) {
      setError(e?.message || "Could not load menu.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File, folder: string) {
    setError("");
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const path = `${folder}/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type || undefined });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleItemImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setMessage("Uploading image...");
      const url = await uploadImage(file, "items");
      setItemImage(url);
      setMessage("Image selected.");
    } catch (e: any) {
      setError(e?.message || "Image upload failed.");
      setMessage("");
    } finally {
      e.target.value = "";
    }
  }

  async function handleCategoryImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setMessage("Uploading image...");
      const url = await uploadImage(file, "categories");
      setCategoryImage(url);
      setMessage("Image selected.");
    } catch (e: any) {
      setError(e?.message || "Image upload failed.");
      setMessage("");
    } finally {
      e.target.value = "";
    }
  }

  async function handleBackgroundImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setMessage("Uploading background...");
      const url = await uploadImage(file, "background");
      setBackgroundImage(url);
      setMessage("Background selected. Tap Save All to save it.");
    } catch (e: any) {
      setError(e?.message || "Background upload failed.");
      setMessage("");
    } finally {
      e.target.value = "";
    }
  }

  function resetItemForm() {
    setItemName("");
    setItemPrice("");
    setItemDescription("");
    setItemCategory(categories[0]?.name || "");
    setItemImage("");
    setItemAvailable(true);
    setEditingItemId(null);
  }

  function addOrUpdateItem(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!itemName.trim()) return setError("Item name is required.");

    if (editingItemId !== null) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingItemId
            ? { ...item, name: itemName.trim(), price: itemPrice, description: itemDescription, category: itemCategory, image: itemImage, available: itemAvailable }
            : item
        )
      );
    } else {
      const nextId = items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
      setItems((current) => [
        ...current,
        { id: nextId, name: itemName.trim(), price: itemPrice, description: itemDescription, category: itemCategory, image: itemImage, available: itemAvailable },
      ]);
    }
    resetItemForm();
    setMessage("Item added. Tap Save All to save to Supabase.");
  }

  function editItem(item: MenuItem) {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemDescription(item.description);
    setItemCategory(item.category);
    setItemImage(item.image);
    setItemAvailable(item.available);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteItem(id: number) {
    setItems((current) => current.filter((x) => x.id !== id));
    setMessage("Item removed. Tap Save All to save the change.");
  }

  function addOrUpdateCategory(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!categoryName.trim()) return setError("Category name is required.");

    if (editingCategoryId) {
      setCategories((current) => current.map((x) => x.id === editingCategoryId ? { ...x, name: categoryName.trim(), image: categoryImage } : x));
    } else {
      const id = `cat-${Date.now()}`;
      setCategories((current) => [...current, { id, name: categoryName.trim(), image: categoryImage, order: current.length, visible: true }]);
    }
    setCategoryName("");
    setCategoryImage("");
    setEditingCategoryId(null);
    setMessage("Category added. Tap Save All to save to Supabase.");
  }

  function editCategory(category: MenuCategory) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryImage(category.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteCategory(id: string) {
    const category = categories.find((x) => x.id === id);
    setCategories((current) => current.filter((x) => x.id !== id));
    if (category) {
      setItems((current) => current.map((x) => x.category === category.name ? { ...x, category: "" } : x));
    }
    setMessage("Category removed. Tap Save All to save the change.");
  }

  async function saveAll() {
    try {
      setSaving(true);
      setError("");
      setMessage("Saving menu...");

      const response = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, categories, backgroundImage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Menu save failed.");

      setMessage("✓ Menu saved successfully to Supabase.");
    } catch (e: any) {
      setError(e?.message || "Menu save failed.");
      setMessage("");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main style={styles.page}><h1>Menu Admin</h1><p>Loading...</p></main>;

  return (
    <main style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Menu Admin</h1>
          <p style={styles.muted}>Manage categories, dishes, images and menu background.</p>
        </div>
        <button style={styles.saveButton} onClick={saveAll} disabled={saving}>{saving ? "Saving..." : "Save All"}</button>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        <h2>Menu Background</h2>
        <label style={styles.galleryButton}>Choose from Gallery<input hidden type="file" accept="image/*" onChange={handleBackgroundImage} /></label>
        {backgroundImage && <img src={backgroundImage} alt="Menu background" style={styles.backgroundPreview} />}
      </section>

      <section style={styles.card}>
        <h2>{editingCategoryId ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={addOrUpdateCategory}>
          <input style={styles.input} placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          <label style={styles.galleryButton}>Choose Category Image<input hidden type="file" accept="image/*" onChange={handleCategoryImage} /></label>
          {categoryImage && <img src={categoryImage} alt="Category" style={styles.preview} />}
          <div style={styles.row}>
            <button style={styles.primaryButton} type="submit">{editingCategoryId ? "Update Category" : "Add Category"}</button>
            {editingCategoryId && <button style={styles.secondaryButton} type="button" onClick={() => { setEditingCategoryId(null); setCategoryName(""); setCategoryImage(""); }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section style={styles.card}>
        <h2>Categories</h2>
        {categories.length === 0 ? <p style={styles.muted}>No categories yet.</p> : categories.map((category) => (
          <div key={category.id} style={styles.listRow}>
            {category.image ? <img src={category.image} alt="" style={styles.thumb} /> : <div style={styles.thumbEmpty}>No image</div>}
            <div style={{ flex: 1 }}><strong>{category.name}</strong></div>
            <button style={styles.smallButton} onClick={() => editCategory(category)}>Edit</button>
            <button style={styles.deleteButton} onClick={() => deleteCategory(category.id)}>Delete</button>
          </div>
        ))}
      </section>

      <section style={styles.card}>
        <h2>{editingItemId !== null ? "Edit Menu Item" : "Add Menu Item"}</h2>
        <form onSubmit={addOrUpdateItem}>
          <input style={styles.input} placeholder="Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <input style={styles.input} placeholder="Price" inputMode="decimal" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
          <select style={styles.input} value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
          <textarea style={{ ...styles.input, minHeight: 90 }} placeholder="Description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
          <label style={styles.galleryButton}>Choose Item Image<input hidden type="file" accept="image/*" onChange={handleItemImage} /></label>
          {itemImage && <img src={itemImage} alt="Item" style={styles.preview} />}
          <label style={styles.check}><input type="checkbox" checked={itemAvailable} onChange={(e) => setItemAvailable(e.target.checked)} /> Available</label>
          <div style={styles.row}>
            <button style={styles.primaryButton} type="submit">{editingItemId !== null ? "Update Item" : "Add Item"}</button>
            {editingItemId !== null && <button style={styles.secondaryButton} type="button" onClick={resetItemForm}>Cancel</button>}
          </div>
        </form>
      </section>

      <section style={styles.card}>
        <h2>Menu Items</h2>
        {items.length === 0 ? <p style={styles.muted}>No menu items yet.</p> : items.map((item) => (
          <div key={item.id} style={styles.listRow}>
            {item.image ? <img src={item.image} alt={item.name} style={styles.thumb} /> : <div style={styles.thumbEmpty}>No image</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{item.name}</strong>
              <div style={styles.muted}>{item.category || "No category"} · {item.price || "No price"}</div>
              {!item.available && <div style={styles.unavailable}>Unavailable</div>}
            </div>
            <button style={styles.smallButton} onClick={() => editItem(item)}>Edit</button>
            <button style={styles.deleteButton} onClick={() => deleteItem(item.id)}>Delete</button>
          </div>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "Arial, sans-serif" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 },
  title: { margin: 0 },
  card: { border: "1px solid #ddd", borderRadius: 14, padding: 16, marginBottom: 16, background: "#fff" },
  input: { width: "100%", boxSizing: "border-box", padding: 12, border: "1px solid #ccc", borderRadius: 9, marginBottom: 10, fontSize: 16 },
  row: { display: "flex", gap: 8, flexWrap: "wrap" },
  primaryButton: { padding: "11px 16px", border: 0, borderRadius: 9, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { padding: "11px 16px", border: "1px solid #ccc", borderRadius: 9, background: "#fff", cursor: "pointer" },
  saveButton: { padding: "12px 18px", border: 0, borderRadius: 10, cursor: "pointer", fontWeight: 800 },
  galleryButton: { display: "inline-block", padding: "11px 14px", border: "1px solid #ccc", borderRadius: 9, cursor: "pointer", marginBottom: 10 },
  success: { padding: 12, borderRadius: 9, marginBottom: 12, background: "#e9f8ee" },
  error: { padding: 12, borderRadius: 9, marginBottom: 12, background: "#ffe9e9", color: "#a00", whiteSpace: "pre-wrap" },
  muted: { color: "#666", marginTop: 4 },
  preview: { width: 140, height: 100, objectFit: "cover", borderRadius: 10, display: "block", marginBottom: 12 },
  backgroundPreview: { width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, display: "block" },
  listRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #eee" },
  thumb: { width: 58, height: 58, objectFit: "cover", borderRadius: 8, flexShrink: 0 },
  thumbEmpty: { width: 58, height: 58, borderRadius: 8, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#777", flexShrink: 0 },
  smallButton: { padding: "7px 9px", border: "1px solid #ccc", borderRadius: 7, background: "#fff", cursor: "pointer" },
  deleteButton: { padding: "7px 9px", border: 0, borderRadius: 7, cursor: "pointer" },
  check: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 },
  unavailable: { fontSize: 12, marginTop: 4 },
};
