"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Category = {
  id: number;
  nameIt: string;
  nameEn: string;
  nameBn: string;
  image: string;
  order: number;
  visible: boolean;
};

const emptyForm = {
  nameIt: "",
  nameEn: "",
  nameBn: "",
  image: "",
  order: 1,
  visible: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nababi-categories");

    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch {
        setCategories([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "nababi-categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  const updateField = (
    field: keyof typeof emptyForm,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("শুধু image file নির্বাচন করুন।");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      order: categories.length + 1,
    });

    setEditingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const editCategory = (category: Category) => {
    setForm({
      nameIt: category.nameIt,
      nameEn: category.nameEn,
      nameBn: category.nameBn,
      image: category.image,
      order: category.order,
      visible: category.visible,
    });

    setEditingId(category.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveCategory = (event: FormEvent) => {
    event.preventDefault();

    if (!form.nameIt.trim()) {
      alert("Italian Category Name লিখুন।");
      return;
    }

    if (!form.nameEn.trim()) {
      alert("English Category Name লিখুন।");
      return;
    }

    if (!form.nameBn.trim()) {
      alert("Bengali Category Name লিখুন।");
      return;
    }

    if (editingId !== null) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingId
            ? {
                ...category,
                ...form,
                order: Number(form.order) || 1,
              }
            : category
        )
      );

      setMessage("Category successfully updated.");
    } else {
      const newCategory: Category = {
        id: Date.now(),
        ...form,
        order: Number(form.order) || categories.length + 1,
      };

      setCategories((prev) => [...prev, newCategory]);

      setMessage("New category successfully added.");
    }

    resetForm();
    setShowForm(false);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const deleteCategory = (id: number) => {
    const confirmed = window.confirm(
      "আপনি কি এই Category-টি delete করতে চান?"
    );

    if (!confirmed) return;

    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    );

    setMessage("Category deleted.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const toggleVisibility = (id: number) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? {
              ...category,
              visible: !category.visible,
            }
          : category
      )
    );
  };

  return (
    <main className="categories-page">

      {/* HEADER */}

      <header className="page-header">

        <div>
          <a href="/admin" className="back-link">
            ← Admin Dashboard
          </a>

          <div className="eyebrow">
            NABABI RISTORANTE
          </div>

          <h1>Categories Management</h1>

          <p>
            Menu-এর Category তৈরি, Edit, Photo,
            Show / Hide এবং Display Order এখান থেকে
            পরিচালনা করুন।
          </p>
        </div>

        <a href="/admin/menu" className="menu-button">
          🍛 Menu Management
        </a>

      </header>

      {/* MESSAGE */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {/* STATS */}

      <section className="stats">

        <div className="stat-card">
          <span>📂</span>

          <div>
            <small>Total Categories</small>
            <strong>{categories.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>✓</span>

          <div>
            <small>Visible</small>
            <strong>
              {
                categories.filter(
                  (category) => category.visible
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <span>○</span>

          <div>
            <small>Hidden</small>
            <strong>
              {
                categories.filter(
                  (category) => !category.visible
                ).length
              }
            </strong>
          </div>
        </div>

      </section>

      {/* ADD */}

      {!showForm && (
        <div className="add-area">

          <button
            className="add-button"
            onClick={openAddForm}
          >
            ＋ Add New Category
          </button>

        </div>
      )}

      {/* FORM */}

      {showForm && (

        <section className="editor-card">

          <div className="editor-header">

            <div>

              <span className="eyebrow">
                {editingId
                  ? "EDIT CATEGORY"
                  : "NEW CATEGORY"}
              </span>

              <h2>
                {editingId
                  ? "Edit Category"
                  : "Add New Category"}
              </h2>

            </div>

            <button
              className="close-button"
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              ✕
            </button>

          </div>

          <form onSubmit={saveCategory}>

            {/* ITALIAN */}

            <div className="language-title">
              🇮🇹 Italian
            </div>

            <label>
              Category Name

              <input
                value={form.nameIt}
                onChange={(e) =>
                  updateField(
                    "nameIt",
                    e.target.value
                  )
                }
                placeholder="Es. Biryani"
              />
            </label>

            {/* ENGLISH */}

            <div className="language-title">
              🇬🇧 English
            </div>

            <label>
              Category Name

              <input
                value={form.nameEn}
                onChange={(e) =>
                  updateField(
                    "nameEn",
                    e.target.value
                  )
                }
                placeholder="Example: Biryani"
              />
            </label>

            {/* BENGALI */}

            <div className="language-title">
              🇧🇩 Bengali
            </div>

            <label>
              Category Name

              <input
                value={form.nameBn}
                onChange={(e) =>
                  updateField(
                    "nameBn",
                    e.target.value
                  )
                }
                placeholder="যেমন: বিরিয়ানি"
              />
            </label>

            {/* IMAGE */}

            <div className="language-title">
              🖼️ Category Photo
            </div>

            <div className="photo-area">

              <label className="upload-box">

                <span>📷</span>

                <strong>
                  Choose Category Photo
                </strong>

                <small>
                  JPG / PNG / WEBP
                </small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />

              </label>

              {form.image && (
                <div className="image-preview">

                  <img
                    src={form.image}
                    alt="Category preview"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateField("image", "")
                    }
                  >
                    Remove Photo
                  </button>

                </div>
              )}

            </div>

            {/* ORDER */}

            <div className="form-row">

              <label>
                Display Order

                <input
                  type="number"
                  min="1"
                  value={form.order}
                  onChange={(e) =>
                    updateField(
                      "order",
                      Number(e.target.value)
                    )
                  }
                />

              </label>

            </div>

            {/* VISIBILITY */}

            <div className="visibility-box">

              <div>

                <strong>
                  Show this category on website
                </strong>

                <small>
                  Off করলে customer website-এ
                  এই category দেখা যাবে না।
                </small>

              </div>

              <button
                type="button"
                className={
                  form.visible
                    ? "switch on"
                    : "switch"
                }
                onClick={() =>
                  updateField(
                    "visible",
                    !form.visible
                  )
                }
              >
                <span />
              </button>

            </div>

            {/* ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingId
                  ? "✓ Update Category"
                  : "＋ Save Category"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* CATEGORY LIST */}

      <section className="list-section">

        <div className="list-header">

          <div>
            <span className="eyebrow">
              RESTAURANT CATEGORIES
            </span>

            <h2>
              Menu Categories
            </h2>
          </div>

          <strong>
            মোট: {categories.length}
          </strong>

        </div>

        {categories.length === 0 ? (

          <div className="empty">

            <div>📂</div>

            <h3>
              এখনো কোনো Category যোগ করা হয়নি
            </h3>

            <p>
              “Add New Category” button ব্যবহার
              করে প্রথম Category তৈরি করুন।
            </p>

            <button
              className="add-button"
              onClick={openAddForm}
            >
              ＋ Add First Category
            </button>

          </div>

        ) : (

          <div className="category-grid">

            {categories
              .slice()
              .sort(
                (a, b) =>
                  a.order - b.order
              )
              .map((category) => (

                <article
                  className={`category-card ${
                    !category.visible
                      ? "hidden-card"
                      : ""
                  }`}
                  key={category.id}
                >

                  <div className="category-image">

                    {category.image ? (

                      <img
                        src={category.image}
                        alt={category.nameEn}
                      />

                    ) : (

                      <div className="no-image">
                        🍛
                      </div>

                    )}

                    <span
                      className={
                        category.visible
                          ? "visible-badge"
                          : "hidden-badge"
                      }
                    >
                      {category.visible
                        ? "● Visible"
                        : "○ Hidden"}
                    </span>

                    <span className="order-badge">
                      #{category.order}
                    </span>

                  </div>

                  <div className="category-content">

                    <h3>
                      {category.nameIt}
                    </h3>

                    <p className="english">
                      {category.nameEn}
                    </p>

                    <p className="bengali">
                      {category.nameBn}
                    </p>

                    <div className="category-actions">

                      <button
                        className="visibility-button"
                        onClick={() =>
                          toggleVisibility(
                            category.id
                          )
                        }
                      >
                        {category.visible
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        className="edit-button"
                        onClick={() =>
                          editCategory(category)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteCategory(category.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

          </div>

        )}

      </section>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .categories-page {
          min-height: 100vh;
          padding: 30px;
          background: #f5f1e8;
          color: #392b22;
          font-family:
            Arial,
            "Noto Sans Bengali",
            sans-serif;
        }

        .page-header {
          max-width: 1400px;
          margin: 0 auto 25px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #765d39;
          text-decoration: none;
          font-size: 12px;
        }

        .eyebrow {
          color: #a17c45;
          font-size: 9px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        h1 {
          margin: 5px 0;
          font-family: Georgia, serif;
          font-size: 36px;
          font-weight: 500;
        }

        .page-header p {
          margin: 0;
          color: #837665;
          font-size: 13px;
        }

        .menu-button {
          padding: 12px 18px;
          border-radius: 25px;
          background: #3b2920;
          color: #eed9a5;
          text-decoration: none;
          font-size: 12px;
        }

        .success-message {
          max-width: 1400px;
          margin: 0 auto 18px;
          padding: 13px 16px;
          border-radius: 9px;
          background: #edf7ed;
          color: #32703b;
          border: 1px solid #b6d6b9;
          font-size: 12px;
        }

        .stats {
          max-width: 1400px;
          margin: 0 auto 25px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 18px;
          background: #fffdf8;
          border: 1px solid #e2d7c6;
          border-radius: 13px;
        }

        .stat-card > span {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #f0e8da;
          font-size: 20px;
        }

        .stat-card small {
          display: block;
          color: #897c6b;
          font-size: 10px;
        }

        .stat-card strong {
          display: block;
          margin-top: 4px;
          font-family: Georgia, serif;
          font-size: 24px;
        }

        .add-area {
          max-width: 1400px;
          margin: 0 auto 20px;
        }

        .add-button {
          padding: 12px 18px;
          border: 0;
          border-radius: 9px;
          background: #a8783e;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .add-button:hover {
          background: #855c2e;
        }

        .editor-card {
          max-width: 1400px;
          margin: 0 auto 30px;
          padding: 25px;
          background: #fffdf8;
          border: 1px solid #e0d5c4;
          border-radius: 15px;
          box-shadow:
            0 12px 35px
            rgba(53,40,27,.06);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .editor-header h2 {
          margin: 5px 0 0;
          font-family: Georgia, serif;
          font-size: 25px;
          font-weight: 500;
        }

        .close-button {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid #ded0bd;
          background: #faf5eb;
          cursor: pointer;
        }

        .language-title {
          margin: 25px 0 13px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee5d9;
          font-weight: 700;
          color: #684f32;
          font-size: 13px;
        }

        label {
          display: block;
          color: #65574b;
          font-size: 11px;
          font-weight: 700;
        }

        input {
          width: 100%;
          margin-top: 7px;
          padding: 12px;
          border: 1px solid #ddd1bf;
          border-radius: 8px;
          background: #fffefa;
          color: #3e3028;
          font-family: inherit;
          font-size: 12px;
          outline: none;
        }

        input:focus {
          border-color: #b58a4e;
          box-shadow:
            0 0 0 3px
            rgba(181,138,78,.10);
        }

        .form-row {
          max-width: 350px;
        }

        .photo-area {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          align-items: center;
        }

        .upload-box {
          width: 230px;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          border: 2px dashed #cdbb9e;
          border-radius: 12px;
          background: #fcf8ef;
          cursor: pointer;
          text-align: center;
        }

        .upload-box span {
          font-size: 30px;
        }

        .upload-box strong {
          font-size: 12px;
          color: #5c4834;
        }

        .upload-box small {
          color: #9b8c78;
          font-size: 9px;
        }

        .upload-box input {
          display: none;
        }

        .image-preview {
          width: 230px;
        }

        .image-preview img {
          width: 230px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid #d9cbb8;
        }

        .image-preview button {
          width: 100%;
          margin-top: 6px;
          padding: 7px;
          border: 0;
          border-radius: 6px;
          background: #eadbd1;
          color: #754337;
          cursor: pointer;
          font-size: 10px;
        }

        .visibility-box {
          margin-top: 25px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 10px;
          background: #f8f3e9;
          border: 1px solid #e2d7c5;
        }

        .visibility-box strong {
          display: block;
          font-size: 12px;
        }

        .visibility-box small {
          display: block;
          margin-top: 4px;
          color: #8d7f6e;
          font-size: 10px;
        }

        .switch {
          width: 50px;
          height: 27px;
          padding: 3px;
          border: 0;
          border-radius: 20px;
          background: #b7afa3;
          cursor: pointer;
          text-align: left;
        }

        .switch span {
          display: block;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: white;
          transition: .2s;
        }

        .switch.on {
          background: #5d9b61;
        }

        .switch.on span {
          transform: translateX(23px);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 25px;
        }

        .cancel-button,
        .save-button {
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .cancel-button {
          border: 1px solid #d8cbb9;
          background: #fffaf1;
          color: #6f6254;
        }

        .save-button {
          border: 0;
          background: #3d2b21;
          color: #eed59d;
        }

        .list-section {
          max-width: 1400px;
          margin: 0 auto;
        }

        .list-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .list-header h2 {
          margin: 4px 0 0;
          font-family: Georgia, serif;
          font-size: 26px;
          font-weight: 500;
        }

        .list-header > strong {
          color: #806845;
          font-size: 12px;
        }

        .category-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
        }

        .category-card {
          overflow: hidden;
          background: #fffdf8;
          border: 1px solid #e0d5c3;
          border-radius: 14px;
          transition: .2s;
        }

        .category-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px
            rgba(52,39,27,.08);
        }

        .hidden-card {
          opacity: .6;
        }

        .category-image {
          position: relative;
          height: 180px;
          background: #eee5d6;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          font-size: 50px;
        }

        .visible-badge,
        .hidden-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 6px 9px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 700;
        }

        .visible-badge {
          color: #2e6b39;
          background: #edf7ed;
        }

        .hidden-badge {
          color: #8a4036;
          background: #faeae7;
        }

        .order-badge {
          position: absolute;
          left: 10px;
          top: 10px;
          padding: 5px 8px;
          border-radius: 15px;
          background: rgba(255,255,255,.9);
          color: #73572f;
          font-size: 9px;
          font-weight: 700;
        }

        .category-content {
          padding: 17px;
        }

        .category-content h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 500;
        }

        .english {
          margin: 4px 0;
          color: #846d50;
          font-size: 11px;
        }

        .bengali {
          margin: 4px 0 15px;
          color: #5f5348;
          font-size: 12px;
        }

        .category-actions {
          display: grid;
          grid-template-columns:
            1fr 1fr 1fr;
          gap: 6px;
        }

        .category-actions button {
          padding: 8px 4px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 9px;
        }

        .visibility-button {
          border: 1px solid #cfc4b3;
          background: #faf6ed;
          color: #675948;
        }

        .edit-button {
          border: 1px solid #d4bd91;
          background: #fff6df;
          color: #785b30;
        }

        .delete-button {
          border: 1px solid #e0b9b0;
          background: #fff0ed;
          color: #8b453a;
        }

        .empty {
          padding: 65px 20px;
          text-align: center;
          background: #fffdf8;
          border: 1px dashed #d6c7b0;
          border-radius: 14px;
        }

        .empty > div {
          font-size: 50px;
        }

        .empty h3 {
          margin: 10px 0 5px;
          font-family: Georgia, serif;
          font-weight: 500;
        }

        .empty p {
          color: #8c7e6d;
          font-size: 11px;
          margin-bottom: 18px;
        }

        @media (max-width: 1100px) {

          .category-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

        }

        @media (max-width: 800px) {

          .categories-page {
            padding: 18px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          h1 {
            font-size: 29px;
          }

          .stats {
            grid-template-columns:
              1fr;
          }

          .category-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 520px) {

          .category-grid {
            grid-template-columns: 1fr;
          }

          .editor-card {
            padding: 17px;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }

        }

      `}</style>

    </main>
  );
}