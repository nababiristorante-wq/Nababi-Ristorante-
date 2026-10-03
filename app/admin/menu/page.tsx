"use client";

import { FormEvent, useEffect, useState } from "react";

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

type MenuData = {
  items: MenuItem[];
  categories: MenuCategory[];
  backgroundImage: string;
};

const emptyItem: MenuItem = {
  id: 0,
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  available: true,
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");

  const [itemForm, setItemForm] = useState<MenuItem>(emptyItem);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/menu", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Could not load menu."
        );
      }

      const loadedItems: MenuItem[] = (
        data.items || []
      ).map((item: any) => ({
        id: Number(item.id),
        name: item.name || "",
        description: item.description || "",
        price:
          item.price === null ||
          item.price === undefined
            ? ""
            : String(item.price),
        category: item.category || "",
        image: item.image_url || "",
        available: item.is_available !== false,
      }));

      const loadedCategories: MenuCategory[] = (
        data.categories || []
      ).map((category: any, index: number) => ({
        id: String(category.id),
        name: category.name || "",
        image: category.image_url || "",
        order:
          Number.isFinite(Number(category.display_order))
            ? Number(category.display_order)
            : index,
        visible: category.visible !== false,
      }));

      setItems(loadedItems);
      setCategories(loadedCategories);

      setBackgroundImage(
        data.settings?.background_image || ""
      );

      if (loadedCategories.length > 0) {
        setItemForm((current) => ({
          ...current,
          category:
            current.category ||
            loadedCategories[0].name,
        }));
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Menu could not be loaded. Please login again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveMenu(
    nextItems: MenuItem[],
    nextCategories: MenuCategory[],
    nextBackground: string
  ) {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "/api/admin/menu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: nextItems,
            categories: nextCategories,
            backgroundImage: nextBackground,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Could not save menu."
        );
      }

      setMessage("Menu saved successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        "Menu could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleItemSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!itemForm.name.trim()) {
      setMessage("Please enter a menu item name.");
      return;
    }

    if (!itemForm.category.trim()) {
      setMessage("Please select a category.");
      return;
    }

    let nextItems: MenuItem[];

    if (editingId !== null) {
      nextItems = items.map((item) =>
        item.id === editingId
          ? {
              ...itemForm,
              id: editingId,
              name: itemForm.name.trim(),
            }
          : item
      );
    } else {
      const nextId =
        items.length > 0
          ? Math.max(
              ...items.map((item) =>
                Number(item.id) || 0
              )
            ) + 1
          : 1;

      nextItems = [
        ...items,
        {
          ...itemForm,
          id: nextId,
          name: itemForm.name.trim(),
        },
      ];
    }

    setItems(nextItems);
    setItemForm({
      ...emptyItem,
      category:
        categories[0]?.name || "",
    });
    setEditingId(null);

    void saveMenu(
      nextItems,
      categories,
      backgroundImage
    );
  }

  function editItem(item: MenuItem) {
    setEditingId(item.id);
    setItemForm({
      ...item,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteItem(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    const nextItems = items.filter(
      (item) => item.id !== id
    );

    setItems(nextItems);

    void saveMenu(
      nextItems,
      categories,
      backgroundImage
    );
  }

  function toggleAvailability(id: number) {
    const nextItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            available: !item.available,
          }
        : item
    );

    setItems(nextItems);

    void saveMenu(
      nextItems,
      categories,
      backgroundImage
    );
  }

  function addCategory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      setMessage("Please enter a category name.");
      return;
    }

    const exists = categories.some(
      (category) =>
        category.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (exists) {
      setMessage("This category already exists.");
      return;
    }

    const newCategory: MenuCategory = {
      id:
        `cat-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
      name,
      image: categoryImage.trim(),
      order: categories.length,
      visible: true,
    };

    const nextCategories = [
      ...categories,
      newCategory,
    ];

    setCategories(nextCategories);
    setCategoryName("");
    setCategoryImage("");

    if (!itemForm.category) {
      setItemForm((current) => ({
        ...current,
        category: name,
      }));
    }

    void saveMenu(
      items,
      nextCategories,
      backgroundImage
    );
  }

  function deleteCategory(id: string) {
    const category = categories.find(
      (item) => item.id === id
    );

    if (!category) {
      return;
    }

    const categoryUsed = items.some(
      (item) => item.category === category.name
    );

    if (categoryUsed) {
      setMessage(
        "This category is being used by a menu item. Change the item's category first."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete category "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const nextCategories = categories.filter(
      (item) => item.id !== id
    );

    setCategories(nextCategories);

    void saveMenu(
      items,
      nextCategories,
      backgroundImage
    );
  }

  function updateBackground() {
    void saveMenu(
      items,
      categories,
      backgroundImage
    );
  }

  function resetItemForm() {
    setEditingId(null);

    setItemForm({
      ...emptyItem,
      category:
        categories[0]?.name || "",
    });
  }

  if (loading) {
    return (
      <main
        style={{
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1>Menu Management</h1>
        <p>Loading menu...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px 16px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            Menu Management
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#666",
            }}
          >
            Manage your restaurant menu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadMenu()}
          disabled={saving}
          style={buttonStyle}
        >
          Refresh
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: 20,
            padding: 14,
            borderRadius: 10,
            background: "#f4f4f4",
            border: "1px solid #ddd",
          }}
        >
          {message}
        </div>
      )}

      {/* MENU ITEM FORM */}

      <section style={cardStyle}>
        <h2 style={headingStyle}>
          {editingId !== null
            ? "Edit Menu Item"
            : "Add Menu Item"}
        </h2>

        <form onSubmit={handleItemSubmit}>
          <div style={gridStyle}>
            <label style={labelStyle}>
              Item Name
              <input
                value={itemForm.name}
                onChange={(event) =>
                  setItemForm({
                    ...itemForm,
                    name: event.target.value,
                  })
                }
                placeholder="Chicken Biryani"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Price
              <input
                type="number"
                step="0.01"
                min="0"
                value={itemForm.price}
                onChange={(event) =>
                  setItemForm({
                    ...itemForm,
                    price: event.target.value,
                  })
                }
                placeholder="12.50"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Category
              <select
                value={itemForm.category}
                onChange={(event) =>
                  setItemForm({
                    ...itemForm,
                    category: event.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Image URL
              <input
                value={itemForm.image}
                onChange={(event) =>
                  setItemForm({
                    ...itemForm,
                    image: event.target.value,
                  })
                }
                placeholder="https://..."
                style={inputStyle}
              />
            </label>
          </div>

          <label style={labelStyle}>
            Description
            <textarea
              value={itemForm.description}
              onChange={(event) =>
                setItemForm({
                  ...itemForm,
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe the dish..."
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={itemForm.available}
              onChange={(event) =>
                setItemForm({
                  ...itemForm,
                  available:
                    event.target.checked,
                })
              }
            />

            Available
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={primaryButtonStyle}
            >
              {editingId !== null
                ? "Update Item"
                : "Add Item"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetItemForm}
                style={buttonStyle}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* CATEGORIES */}

      <section style={cardStyle}>
        <h2 style={headingStyle}>
          Categories
        </h2>

        <form
          onSubmit={addCategory}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <input
            value={categoryName}
            onChange={(event) =>
              setCategoryName(event.target.value)
            }
            placeholder="Category name"
            style={inputStyle}
          />

          <input
            value={categoryImage}
            onChange={(event) =>
              setCategoryImage(event.target.value)
            }
            placeholder="Category image URL"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={saving}
            style={primaryButtonStyle}
          >
            Add Category
          </button>
        </form>

        {categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 14,
                }}
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  />
                )}

                <strong>
                  {category.name}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    deleteCategory(category.id)
                  }
                  style={{
                    ...dangerButtonStyle,
                    marginTop: 10,
                    width: "100%",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BACKGROUND */}

      <section style={cardStyle}>
        <h2 style={headingStyle}>
          Menu Background
        </h2>

        <input
          value={backgroundImage}
          onChange={(event) =>
            setBackgroundImage(
              event.target.value
            )
          }
          placeholder="Background image URL"
          style={inputStyle}
        />

        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Menu background"
            style={{
              width: "100%",
              maxHeight: 250,
              objectFit: "cover",
              borderRadius: 10,
              marginTop: 14,
            }}
          />
        )}

        <button
          type="button"
          onClick={updateBackground}
          disabled={saving}
          style={{
            ...primaryButtonStyle,
            marginTop: 14,
          }}
        >
          Save Background
        </button>
      </section>

      {/* MENU LIST */}

      <section style={cardStyle}>
        <h2 style={headingStyle}>
          Menu Items ({items.length})
        </h2>

        {items.length === 0 ? (
          <p>
            No menu items yet. Add your first item
            above.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#777",
                      fontSize: 13,
                    }}
                  >
                    No image
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    minWidth: 220,
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 6px",
                    }}
                  >
                    {item.name}
                  </h3>

                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 5,
                    }}
                  >
                    {item.price
                      ? `€${item.price}`
                      : "Price not set"}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#666",
                      marginBottom: 5,
                    }}
                  >
                    {item.category}
                  </div>

                  {item.description && (
                    <p
                      style={{
                        margin: 0,
                        color: "#666",
                      }}
                    >
                      {item.description}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: 8,
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {item.available
                      ? "Available"
                      : "Unavailable"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minWidth: 130,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleAvailability(
                        item.id
                      )
                    }
                    style={buttonStyle}
                  >
                    {item.available
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      editItem(item)
                    }
                    style={primaryButtonStyle}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteItem(item.id)
                    }
                    style={dangerButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {saving && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          Saving...
        </div>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 14,
  padding: 20,
  marginBottom: 20,
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.04)",
};

const headingStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 18,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginBottom: 14,
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
  fontWeight: 600,
  marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: 15,
  background: "#fff",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  background: "#fff",
  color: "#222",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#111",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const dangerButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#b42318",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};
