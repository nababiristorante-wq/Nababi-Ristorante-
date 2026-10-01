"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
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

type MenuCategory = {
  id: string;
  name: string;
  image: string;
  order: number;
  visible: boolean;
};

const MENU_KEY = "nababi-menu";
const CATEGORY_KEY = "nababi-categories";
const BACKGROUND_KEY = "nababi-menu-background";

const GOLD = "#d9a441";
const GOLD_LIGHT = "#f6cf70";

const defaultCategoryNames = [
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

const defaultCategoryImages: Record<
  string,
  string
> = {
  Biryani:
    "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=900&q=85",
  Starters:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  "Main Course":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  Chicken:
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85",
  Mutton:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  Vegetarian:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  Rice:
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=85",
  Drinks:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  Desserts:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
};

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85";

const MAX_IMAGE_SIZE =
  15 * 1024 * 1024;

const MAX_IMAGE_WIDTH = 1800;

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000000);
}

function createCategoryId() {
  return `category-${Date.now()}-${Math.floor(
    Math.random() * 1000000
  )}`;
}

function safeString(
  value: unknown,
  fallback = ""
) {
  if (
    typeof value === "string"
  ) {
    return value;
  }

  if (
    typeof value === "number"
  ) {
    return String(value);
  }

  return fallback;
}

function normalizeProduct(
  item: any,
  index: number
): MenuItem {
  return {
    id:
      typeof item?.id === "number"
        ? item.id
        : createId() + index,
    name: safeString(
      item?.name ??
        item?.title ??
        item?.productName,
      `Product ${index + 1}`
    ),
    description:
      safeString(
        item?.description ??
          item?.details ??
          item?.desc
      ),
    price: safeString(
      item?.price ??
        item?.amount ??
        ""
    ),
    category:
      safeString(
        item?.category ??
          item?.categoryName ??
          "Biryani"
      ) || "Biryani",
    image:
      safeString(
        item?.image ??
          item?.imageUrl ??
          ""
      ),
    available:
      item?.available !== false,
  };
}

function normalizeCategory(
  item: any,
  index: number
): MenuCategory | null {
  if (
    typeof item === "string"
  ) {
    const name =
      item.trim();

    if (!name) {
      return null;
    }

    return {
      id: createCategoryId(),
      name,
      image:
        defaultCategoryImages[
          name
        ] ||
        "",
      order: index,
      visible: true,
    };
  }

  const name =
    safeString(
      item?.name ??
        item?.title ??
        item?.category
    ).trim();

  if (!name) {
    return null;
  }

  return {
    id:
      safeString(
        item?.id
      ) ||
      createCategoryId(),
    name,
    image:
      safeString(
        item?.image ??
          item?.imageUrl ??
          ""
      ),
    order:
      typeof item?.order ===
      "number"
        ? item.order
        : index,
    visible:
      item?.visible !== false,
  };
}

function normalizeCategories(
  raw: any
): MenuCategory[] {
  if (!Array.isArray(raw)) {
    return defaultCategoryNames.map(
      (name, index) => ({
        id: `default-${index}-${name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        name,
        image:
          defaultCategoryImages[
            name
          ] || "",
        order: index,
        visible: true,
      })
    );
  }

  const result: MenuCategory[] =
    [];

  raw.forEach(
    (item, index) => {
      const category =
        normalizeCategory(
          item,
          index
        );

      if (!category) {
        return;
      }

      const duplicate =
        result.some(
          (existing) =>
            existing.name
              .toLowerCase() ===
            category.name.toLowerCase()
        );

      if (!duplicate) {
        result.push(category);
      }
    }
  );

  if (!result.length) {
    return defaultCategoryNames.map(
      (name, index) => ({
        id: `default-${index}-${name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        name,
        image:
          defaultCategoryImages[
            name
          ] || "",
        order: index,
        visible: true,
      })
    );
  }

  return result
    .sort(
      (a, b) =>
        a.order - b.order
    )
    .map(
      (item, index) => ({
        ...item,
        order: index,
      })
    );
}

function readLocalStorage<T>(
  key: string,
  fallback: T
): T {
  try {
    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed =
      JSON.parse(raw);

    return parsed as T;
  } catch {
    return fallback;
  }
}

function saveLocalStorage(
  key: string,
  value: unknown
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `Unable to save ${key}:`,
      error
    );

    return false;
  }
}

function compressImage(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        reject(
          new Error(
            "Please select an image file."
          )
        );
        return;
      }

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        reject(
          new Error(
            "Image must be smaller than 15 MB."
          )
        );
        return;
      }

      const reader =
        new FileReader();

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read image."
          )
        );
      };

      reader.onload = () => {
        const img =
          new Image();

        img.onerror = () => {
          reject(
            new Error(
              "Unable to process image."
            )
          );
        };

        img.onload = () => {
          let width =
            img.width;
          let height =
            img.height;

          if (
            width >
            MAX_IMAGE_WIDTH
          ) {
            const ratio =
              MAX_IMAGE_WIDTH /
              width;

            width =
              MAX_IMAGE_WIDTH;

            height =
              Math.round(
                height * ratio
              );
          }

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            width;
          canvas.height =
            height;

          const context =
            canvas.getContext(
              "2d"
            );

          if (!context) {
            reject(
              new Error(
                "Unable to process image."
              )
            );
            return;
          }

          context.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          resolve(
            canvas.toDataURL(
              "image/jpeg",
              0.82
            )
          );
        };

        img.src = String(
          reader.result
        );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
}

export default function AdminMenuPage() {
  const [
    products,
    setProducts,
  ] = useState<MenuItem[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<MenuCategory[]>(
    []
  );

  const [
    backgroundImage,
    setBackgroundImage,
  ] = useState("");

  const [
    ready,
    setReady,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    categorySaving,
    setCategorySaving,
  ] = useState(false);

  const [
    editingProductId,
    setEditingProductId,
  ] = useState<
    number | null
  >(null);

  const [
    editingCategoryId,
    setEditingCategoryId,
  ] = useState<
    string | null
  >(null);

  const [
    productName,
    setProductName,
  ] = useState("");

  const [
    productDescription,
    setProductDescription,
  ] = useState("");

  const [
    productPrice,
    setProductPrice,
  ] = useState("");

  const [
    productCategory,
    setProductCategory,
  ] = useState("");

  const [
    productImage,
    setProductImage,
  ] = useState("");

  const [
    productAvailable,
    setProductAvailable,
  ] = useState(true);

  const [
    categoryName,
    setCategoryName,
  ] = useState("");

  const [
    categoryImage,
    setCategoryImage,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(
    "All"
  );

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error" | ""
  >("");

  const productImageInput =
    useRef<HTMLInputElement>(
      null
    );

  const categoryImageInput =
    useRef<HTMLInputElement>(
      null
    );

  const backgroundInput =
    useRef<HTMLInputElement>(
      null
    );

  const showMessage = (
    text: string,
    type:
      | "success"
      | "error"
  ) => {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4500);
  };

  /*
   * LOAD EVERYTHING ONCE
   *
   * Important:
   * We do not run any save effect
   * before this is complete.
   * This prevents initial [] state
   * from overwriting existing data.
   */
  useEffect(() => {
    try {
      const rawProducts =
        readLocalStorage<any[]>(
          MENU_KEY,
          []
        );

      const normalizedProducts =
        Array.isArray(
          rawProducts
        )
          ? rawProducts.map(
              normalizeProduct
            )
          : [];

      const rawCategories =
        readLocalStorage<any[]>(
          CATEGORY_KEY,
          defaultCategoryNames
        );

      const normalizedCategories =
        normalizeCategories(
          rawCategories
        );

      const storedBackground =
        readLocalStorage<string>(
          BACKGROUND_KEY,
          ""
        );

      setProducts(
        normalizedProducts
      );

      setCategories(
        normalizedCategories
      );

      setBackgroundImage(
        typeof storedBackground ===
          "string"
          ? storedBackground
          : ""
      );

      if (
        normalizedCategories.length
      ) {
        setProductCategory(
          normalizedCategories[0]
            .name
        );
      }

      setReady(true);
    } catch (error) {
      console.error(
        "Menu initialization error:",
        error
      );

      setProducts([]);
      setCategories(
        normalizeCategories(
          defaultCategoryNames
        )
      );

      setReady(true);

      showMessage(
        "Menu data could not be loaded. Existing browser data was kept safe.",
        "error"
      );
    }
  }, []);

  /*
   * PRODUCT PERSISTENCE
   *
   * Only runs after initial load.
   */
  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!saveLocalStorage(
      MENU_KEY,
      products
    )) {
      showMessage(
        "Menu could not be saved. Browser storage may be full.",
        "error"
      );
    }
  }, [
    products,
    ready,
  ]);

  /*
   * CATEGORY PERSISTENCE
   *
   * Category image is saved independently.
   */
  useEffect(() => {
    if (!ready) {
      return;
    }

    if (
      !saveLocalStorage(
        CATEGORY_KEY,
        categories
      )
    ) {
      showMessage(
        "Categories could not be saved. Browser storage may be full.",
        "error"
      );
    }
  }, [
    categories,
    ready,
  ]);

  /*
   * BACKGROUND PERSISTENCE
   */
  useEffect(() => {
    if (!ready) {
      return;
    }

    if (
      !saveLocalStorage(
        BACKGROUND_KEY,
        backgroundImage
      )
    ) {
      showMessage(
        "Background image could not be saved. Browser storage may be full.",
        "error"
      );
    }
  }, [
    backgroundImage,
    ready,
  ]);

  const visibleCategories =
    useMemo(
      () =>
        categories
          .filter(
            (category) =>
              category.visible
          )
          .sort(
            (a, b) =>
              a.order - b.order
          ),
      [categories]
    );

  const allCategoryNames =
    useMemo(
      () =>
        categories.map(
          (category) =>
            category.name
        ),
      [categories]
    );

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !query ||
            product.name
              .toLowerCase()
              .includes(query) ||
            product.description
              .toLowerCase()
              .includes(query) ||
            product.category
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            activeCategory ===
              "All" ||
            product.category
              .toLowerCase() ===
              activeCategory.toLowerCase();

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      search,
      activeCategory,
    ]);

  const groupedProducts =
    useMemo(() => {
      const groups: {
        category: string;
        items: MenuItem[];
      }[] = [];

      visibleCategories.forEach(
        (category) => {
          const categoryItems =
            filteredProducts.filter(
              (product) =>
                product.category
                  .toLowerCase() ===
                category.name.toLowerCase()
            );

          if (
            categoryItems.length
          ) {
            groups.push({
              category:
                category.name,
              items: categoryItems,
            });
          }
        }
      );

      const unknownItems =
        filteredProducts.filter(
          (product) =>
            !visibleCategories.some(
              (category) =>
                category.name
                  .toLowerCase() ===
                product.category.toLowerCase()
            )
        );

      if (unknownItems.length) {
        groups.push({
          category:
            "Other",
          items: unknownItems,
        });
      }

      return groups;
    }, [
      filteredProducts,
      visibleCategories,
    ]);

  const resetProductForm =
    () => {
      setEditingProductId(
        null
      );

      setProductName("");
      setProductDescription(
        ""
      );
      setProductPrice("");
      setProductImage("");
      setProductAvailable(
        true
      );

      if (
        categories.length
      ) {
        setProductCategory(
          categories[0].name
        );
      } else {
        setProductCategory(
          ""
        );
      }

      if (
        productImageInput.current
      ) {
        productImageInput.current.value =
          "";
      }
    };

  const resetCategoryForm =
    () => {
      setEditingCategoryId(
        null
      );
      setCategoryName("");
      setCategoryImage("");

      if (
        categoryImageInput.current
      ) {
        categoryImageInput.current.value =
          "";
      }
    };

  const handleProductImage =
    async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setSaving(true);

        const image =
          await compressImage(
            file
          );

        setProductImage(
          image
        );

        showMessage(
          "Product image selected.",
          "success"
        );
      } catch (error) {
        showMessage(
          error instanceof Error
            ? error.message
            : "Unable to process product image.",
          "error"
        );
      } finally {
        setSaving(false);
      }
    };

  const handleCategoryImage =
    async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setCategorySaving(
          true
        );

        const image =
          await compressImage(
            file
          );

        setCategoryImage(
          image
        );

        showMessage(
          "Category image selected.",
          "success"
        );
      } catch (error) {
        showMessage(
          error instanceof Error
            ? error.message
            : "Unable to process category image.",
          "error"
        );
      } finally {
        setCategorySaving(
          false
        );
      }
    };

  const handleBackground =
    async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setSaving(true);

        const image =
          await compressImage(
            file
          );

        setBackgroundImage(
          image
        );

        showMessage(
          "Menu background updated.",
          "success"
        );
      } catch (error) {
        showMessage(
          error instanceof Error
            ? error.message
            : "Unable to process background image.",
          "error"
        );
      } finally {
        setSaving(false);
      }
    };

  const submitProduct = (
    event: FormEvent
  ) => {
    event.preventDefault();

    const name =
      productName.trim();

    const description =
      productDescription.trim();

    const price =
      productPrice.trim();

    const category =
      productCategory.trim();

    if (!name) {
      showMessage(
        "Product name is required.",
        "error"
      );
      return;
    }

    if (!price) {
      showMessage(
        "Product price is required.",
        "error"
      );
      return;
    }

    if (!category) {
      showMessage(
        "Please select a category.",
        "error"
      );
      return;
    }

    const product: MenuItem = {
      id:
        editingProductId ??
        createId(),
      name,
      description,
      price,
      category,
      image:
        productImage || "",
      available:
        productAvailable,
    };

    setProducts(
      (previous) => {
        if (
          editingProductId ===
          null
        ) {
          return [
            ...previous,
            product,
          ];
        }

        return previous.map(
          (item) =>
            item.id ===
            editingProductId
              ? product
              : item
        );
      }
    );

    showMessage(
      editingProductId ===
        null
        ? "Product added and saved."
        : "Product updated and saved.",
      "success"
    );

    resetProductForm();
  };

  const editProduct = (
    product: MenuItem
  ) => {
    setEditingProductId(
      product.id
    );

    setProductName(
      product.name
    );

    setProductDescription(
      product.description
    );

    setProductPrice(
      product.price
    );

    setProductCategory(
      product.category
    );

    setProductImage(
      product.image
    );

    setProductAvailable(
      product.available
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    setProducts(
      (previous) =>
        previous.filter(
          (product) =>
            product.id !== id
        )
    );

    if (
      editingProductId === id
    ) {
      resetProductForm();
    }

    showMessage(
      "Product deleted and saved.",
      "success"
    );
  };

  const toggleProduct =
    (id: number) => {
      setProducts(
        (previous) =>
          previous.map(
            (product) =>
              product.id === id
                ? {
                    ...product,
                    available:
                      !product.available,
                  }
                : product
          )
      );

      showMessage(
        "Product availability updated.",
        "success"
      );
    };

  const submitCategory = (
    event: FormEvent
  ) => {
    event.preventDefault();

    const name =
      categoryName.trim();

    if (!name) {
      showMessage(
        "Category name is required.",
        "error"
      );
      return;
    }

    const duplicate =
      categories.some(
        (category) =>
          category.name
            .toLowerCase() ===
            name.toLowerCase() &&
          category.id !==
            editingCategoryId
      );

    if (duplicate) {
      showMessage(
        "This category already exists.",
        "error"
      );
      return;
    }

    if (
      editingCategoryId
    ) {
      const oldCategory =
        categories.find(
          (category) =>
            category.id ===
            editingCategoryId
        );

      if (!oldCategory) {
        return;
      }

      const oldName =
        oldCategory.name;

      const newImage =
        categoryImage ||
        oldCategory.image ||
        defaultCategoryImages[
          name
        ] ||
        "";

      setCategories(
        (previous) =>
          previous.map(
            (category) =>
              category.id ===
              editingCategoryId
                ? {
                    ...category,
                    name,
                    image:
                      newImage,
                  }
                : category
          )
      );

      /*
       * IMPORTANT:
       * Changing a category name
       * must update the product's
       * category string.
       *
       * Product image is NOT
       * touched here.
       */
      if (
        oldName.toLowerCase() !==
        name.toLowerCase()
      ) {
        setProducts(
          (previous) =>
            previous.map(
              (product) =>
                product.category
                  .toLowerCase() ===
                oldName.toLowerCase()
                  ? {
                      ...product,
                      category:
                        name,
                    }
                  : product
            )
        );
      }

      showMessage(
        "Category updated and saved. Product images were not changed.",
        "success"
      );
    } else {
      const newCategory: MenuCategory =
        {
          id:
            createCategoryId(),
          name,
          image:
            categoryImage ||
            defaultCategoryImages[
              name
            ] ||
            "",
          order:
            categories.length,
          visible: true,
        };

      setCategories(
        (previous) => [
          ...previous,
          newCategory,
        ]
      );

      setProductCategory(
        name
      );

      showMessage(
        "Category added and saved.",
        "success"
      );
    }

    resetCategoryForm();
  };

  const editCategory = (
    category: MenuCategory
  ) => {
    setEditingCategoryId(
      category.id
    );

    setCategoryName(
      category.name
    );

    setCategoryImage(
      category.image
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const removeCategoryImage =
    (id: string) => {
      setCategories(
        (previous) =>
          previous.map(
            (category) =>
              category.id === id
                ? {
                    ...category,
                    image: "",
                  }
                : category
          )
      );

      if (
        editingCategoryId ===
        id
      ) {
        setCategoryImage("");
      }

      showMessage(
        "Category image removed.",
        "success"
      );
    };

  const toggleCategory =
    (id: string) => {
      setCategories(
        (previous) =>
          previous.map(
            (category) =>
              category.id === id
                ? {
                    ...category,
                    visible:
                      !category.visible,
                  }
                : category
          )
      );

      showMessage(
        "Category visibility updated.",
        "success"
      );
    };

  const deleteCategory =
    (id: string) => {
      const category =
        categories.find(
          (item) =>
            item.id === id
        );

      if (!category) {
        return;
      }

      const hasProducts =
        products.some(
          (product) =>
            product.category
              .toLowerCase() ===
            category.name.toLowerCase()
        );

      if (hasProducts) {
        showMessage(
          "This category has products. Move or delete those products first.",
          "error"
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${category.name}" category?`
        );

      if (!confirmed) {
        return;
      }

      setCategories(
        (previous) =>
          previous
            .filter(
              (item) =>
                item.id !== id
            )
            .map(
              (item, index) => ({
                ...item,
                order: index,
              })
            )
      );

      if (
        editingCategoryId ===
        id
      ) {
        resetCategoryForm();
      }

      showMessage(
        "Category deleted and saved.",
        "success"
      );
    };

  const removeBackground =
    () => {
      setBackgroundImage("");

      if (
        backgroundInput.current
      ) {
        backgroundInput.current.value =
          "";
      }

      showMessage(
        "Menu background removed.",
        "success"
      );
    };

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "#070707",
          color: "#f5f1e8",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            color: GOLD_LIGHT,
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Loading menu...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#070707",
        color: "#f5f1e8",
        padding: "28px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom:
              "25px",
          }}
        >
          <div
            style={{
              color: GOLD,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing:
                "3px",
              textTransform:
                "uppercase",
              marginBottom:
                "8px",
            }}
          >
            Nababi Ristorante
          </div>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
            }}
          >
            Menu Management
          </h1>

          <p
            style={{
              margin:
                "9px 0 0",
              color: "#a9a39a",
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth:
                "800px",
            }}
          >
            Products and category
            images are managed
            independently. Changing
            a category image will
            never replace a product
            image.
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              marginBottom:
                "20px",
              padding:
                "13px 16px",
              borderRadius:
                "10px",
              border:
                messageType ===
                "success"
                  ? "1px solid rgba(90,190,120,0.35)"
                  : "1px solid rgba(220,100,100,0.35)",
              background:
                messageType ===
                "success"
                  ? "rgba(90,190,120,0.09)"
                  : "rgba(220,100,100,0.09)",
              color:
                messageType ===
                "success"
                  ? "#9be3b2"
                  : "#f1aaaa",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* CATEGORY MANAGEMENT */}
        <section
          style={{
            background:
              "#101010",
            border:
              "1px solid rgba(217,164,65,0.25)",
            borderRadius:
              "18px",
            padding: "22px",
            marginBottom:
              "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom:
                "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "20px",
                }}
              >
                Menu Categories
              </h2>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    "#a9a39a",
                  fontSize:
                    "13px",
                  lineHeight: 1.6,
                }}
              >
                Each category has
                its own image. This
                image is completely
                separate from the
                products inside it.
              </p>
            </div>

            {editingCategoryId && (
              <button
                type="button"
                onClick={
                  resetCategoryForm
                }
                style={{
                  border:
                    "1px solid rgba(217,164,65,0.3)",
                  background:
                    "transparent",
                  color:
                    GOLD_LIGHT,
                  borderRadius:
                    "8px",
                  padding:
                    "9px 13px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                  fontWeight: 700,
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={
              submitCategory
            }
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.1fr 1fr auto",
              gap: "12px",
              alignItems:
                "end",
            }}
          >
            <div>
              <label
                style={{
                  display:
                    "block",
                  color:
                    "#bcb6ac",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                  marginBottom:
                    "7px",
                }}
              >
                Category Name
              </label>

              <input
                value={
                  categoryName
                }
                onChange={(
                  event
                ) =>
                  setCategoryName(
                    event.target
                      .value
                  )
                }
                placeholder="e.g. Biryani"
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  background:
                    "#080808",
                  color:
                    "#f5f1e8",
                  border:
                    "1px solid rgba(217,164,65,0.25)",
                  borderRadius:
                    "9px",
                  padding:
                    "12px",
                  outline:
                    "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display:
                    "block",
                  color:
                    "#bcb6ac",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                  marginBottom:
                    "7px",
                }}
              >
                Category Image
              </label>

              <button
                type="button"
                onClick={() =>
                  categoryImageInput.current?.click()
                }
                style={{
                  width: "100%",
                  background:
                    "#080808",
                  color:
                    GOLD_LIGHT,
                  border:
                    "1px solid rgba(217,164,65,0.25)",
                  borderRadius:
                    "9px",
                  padding:
                    "12px",
                  cursor:
                    "pointer",
                  textAlign:
                    "left",
                }}
              >
                {categoryImage
                  ? "Change Category Image"
                  : "Choose Category Image"}
              </button>

              <input
                ref={
                  categoryImageInput
                }
                type="file"
                accept="image/*"
                onChange={
                  handleCategoryImage
                }
                style={{
                  display:
                    "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={
                categorySaving
              }
              style={{
                border:
                  "none",
                borderRadius:
                  "9px",
                padding:
                  "12px 20px",
                background:
                  `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color:
                  "#080808",
                cursor:
                  "pointer",
                fontWeight:
                  900,
                whiteSpace:
                  "nowrap",
              }}
            >
              {editingCategoryId
                ? "Save Category"
                : "Add Category"}
            </button>
          </form>

          {categoryImage && (
            <div
              style={{
                marginTop:
                  "15px",
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "12px",
              }}
            >
              <img
                src={
                  categoryImage
                }
                alt="Category preview"
                style={{
                  width:
                    "100px",
                  height:
                    "65px",
                  objectFit:
                    "cover",
                  borderRadius:
                    "9px",
                  border:
                    "1px solid rgba(217,164,65,0.3)",
                }}
              />

              <div
                style={{
                  color:
                    "#8f8a82",
                  fontSize:
                    "12px",
                }}
              >
                This image belongs
                only to the
                category.
              </div>
            </div>
          )}

          <div
            style={{
              marginTop:
                "20px",
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {categories
              .sort(
                (a, b) =>
                  a.order -
                  b.order
              )
              .map(
                (category) => (
                  <div
                    key={
                      category.id
                    }
                    style={{
                      border:
                        "1px solid rgba(217,164,65,0.18)",
                      background:
                        "#151515",
                      borderRadius:
                        "12px",
                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                        height:
                          "120px",
                        background:
                          "#090909",
                      }}
                    >
                      {category.image ? (
                        <img
                          src={
                            category.image
                          }
                          alt={
                            category.name
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                            opacity:
                              category.visible
                                ? 1
                                : 0.4,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height:
                              "100%",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color:
                              "#666",
                            fontSize:
                              "12px",
                          }}
                        >
                          No Category
                          Image
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding:
                          "12px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            GOLD_LIGHT,
                          fontWeight:
                            800,
                          fontSize:
                            "14px",
                          marginBottom:
                            "10px",
                        }}
                      >
                        {
                          category.name
                        }
                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: "7px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            editCategory(
                              category
                            )
                          }
                          style={{
                            border:
                              "1px solid rgba(217,164,65,0.25)",
                            background:
                              "rgba(217,164,65,0.06)",
                            color:
                              GOLD_LIGHT,
                            borderRadius:
                              "7px",
                            padding:
                              "8px",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleCategory(
                              category.id
                            )
                          }
                          style={{
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            background:
                              "transparent",
                            color:
                              "#bcb6ac",
                            borderRadius:
                              "7px",
                            padding:
                              "8px",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                          }}
                        >
                          {category.visible
                            ? "Hide"
                            : "Show"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeCategoryImage(
                              category.id
                            )
                          }
                          style={{
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            background:
                              "transparent",
                            color:
                              "#bcb6ac",
                            borderRadius:
                              "7px",
                            padding:
                              "8px",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                          }}
                        >
                          Remove Image
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCategory(
                              category.id
                            )
                          }
                          style={{
                            border:
                              "1px solid rgba(220,100,100,0.2)",
                            background:
                              "rgba(220,100,100,0.05)",
                            color:
                              "#e7a0a0",
                            borderRadius:
                              "7px",
                            padding:
                              "8px",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        </section>

        {/* PRODUCT FORM */}
        <section
          style={{
            background:
              "#101010",
            border:
              "1px solid rgba(217,164,65,0.25)",
            borderRadius:
              "18px",
            padding: "22px",
            marginBottom:
              "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom:
                "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "20px",
                }}
              >
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    "#a9a39a",
                  fontSize:
                    "13px",
                }}
              >
                Product image is
                separate from the
                category image.
              </p>
            </div>

            {editingProductId && (
              <button
                type="button"
                onClick={
                  resetProductForm
                }
                style={{
                  border:
                    "1px solid rgba(217,164,65,0.3)",
                  background:
                    "transparent",
                  color:
                    GOLD_LIGHT,
                  borderRadius:
                    "8px",
                  padding:
                    "9px 13px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                  fontWeight: 700,
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={
              submitProduct
            }
          >
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#bcb6ac",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  Product Name
                </label>

                <input
                  value={
                    productName
                  }
                  onChange={(
                    event
                  ) =>
                    setProductName(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. Chicken Biryani"
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    background:
                      "#080808",
                    color:
                      "#f5f1e8",
                    border:
                      "1px solid rgba(217,164,65,0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "12px",
                    outline:
                      "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#bcb6ac",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  Price
                </label>

                <input
                  value={
                    productPrice
                  }
                  onChange={(
                    event
                  ) =>
                    setProductPrice(
                      event.target
                        .value
                    )
                  }
                  placeholder="€12.50"
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    background:
                      "#080808",
                    color:
                      "#f5f1e8",
                    border:
                      "1px solid rgba(217,164,65,0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "12px",
                    outline:
                      "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#bcb6ac",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  Category
                </label>

                <select
                  value={
                    productCategory
                  }
                  onChange={(
                    event
                  ) =>
                    setProductCategory(
                      event.target
                        .value
                    )
                  }
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    background:
                      "#080808",
                    color:
                      "#f5f1e8",
                    border:
                      "1px solid rgba(217,164,65,0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "12px",
                    outline:
                      "none",
                  }}
                >
                  <option value="">
                    Select category
                  </option>

                  {allCategoryNames.map(
                    (name) => (
                      <option
                        key={name}
                        value={name}
                      >
                        {name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#bcb6ac",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  Product Image
                </label>

                <button
                  type="button"
                  onClick={() =>
                    productImageInput.current?.click()
                  }
                  style={{
                    width: "100%",
                    background:
                      "#080808",
                    color:
                      GOLD_LIGHT,
                    border:
                      "1px solid rgba(217,164,65,0.25)",
                    borderRadius:
                      "9px",
                    padding:
                      "12px",
                    cursor:
                      "pointer",
                    textAlign:
                      "left",
                  }}
                >
                  {productImage
                    ? "Change Product Image"
                    : "Choose Product Image"}
                </button>

                <input
                  ref={
                    productImageInput
                  }
                  type="file"
                  accept="image/*"
                  onChange={
                    handleProductImage
                  }
                  style={{
                    display:
                      "none",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop:
                  "14px",
              }}
            >
              <label
                style={{
                  display:
                    "block",
                  color:
                    "#bcb6ac",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                  marginBottom:
                    "7px",
                }}
              >
                Description
              </label>

              <textarea
                value={
                  productDescription
                }
                onChange={(
                  event
                ) =>
                  setProductDescription(
                    event.target
                      .value
                  )
                }
                placeholder="Describe the dish..."
                rows={4}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  resize:
                    "vertical",
                  background:
                    "#080808",
                  color:
                    "#f5f1e8",
                  border:
                    "1px solid rgba(217,164,65,0.25)",
                  borderRadius:
                    "9px",
                  padding:
                    "12px",
                  outline:
                    "none",
                }}
              />
            </div>

            {productImage && (
              <div
                style={{
                  marginTop:
                    "15px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                }}
              >
                <img
                  src={
                    productImage
                  }
                  alt="Product preview"
                  style={{
                    width:
                      "110px",
                    height:
                      "75px",
                    objectFit:
                      "cover",
                    borderRadius:
                      "9px",
                    border:
                      "1px solid rgba(217,164,65,0.3)",
                  }}
                />

                <div
                  style={{
                    color:
                      "#8f8a82",
                    fontSize:
                      "12px",
                  }}
                >
                  This image belongs
                  only to this
                  product.
                </div>
              </div>
            )}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: "15px",
                marginTop:
                  "17px",
                flexWrap:
                  "wrap",
              }}
            >
              <label
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "9px",
                  color:
                    "#bcb6ac",
                  fontSize:
                    "13px",
                  cursor:
                    "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    productAvailable
                  }
                  onChange={(
                    event
                  ) =>
                    setProductAvailable(
                      event.target
                        .checked
                    )
                  }
                />
                Product available
              </label>

              <button
                type="submit"
                disabled={
                  saving
                }
                style={{
                  border:
                    "none",
                  borderRadius:
                    "9px",
                  padding:
                    "13px 24px",
                  background:
                    `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color:
                    "#080808",
                  cursor:
                    "pointer",
                  fontWeight:
                    900,
                  minWidth:
                    "160px",
                }}
              >
                {editingProductId
                  ? "Save Product"
                  : "Add Product"}
              </button>
            </div>
          </form>
        </section>

        {/* BACKGROUND */}
        <section
          style={{
            background:
              "#101010",
            border:
              "1px solid rgba(217,164,65,0.25)",
            borderRadius:
              "18px",
            padding: "22px",
            marginBottom:
              "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "15px",
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "18px",
                }}
              >
                Menu Background
              </h2>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    "#a9a39a",
                  fontSize:
                    "13px",
                }}
              >
                Optional background
                image for the public
                menu section.
              </p>
            </div>

            <div
              style={{
                display:
                  "flex",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  backgroundInput.current?.click()
                }
                style={{
                  border:
                    "1px solid rgba(217,164,65,0.3)",
                  background:
                    "rgba(217,164,65,0.06)",
                  color:
                    GOLD_LIGHT,
                  borderRadius:
                    "8px",
                  padding:
                    "10px 14px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                }}
              >
                {backgroundImage
                  ? "Change Background"
                  : "Upload Background"}
              </button>

              {backgroundImage && (
                <button
                  type="button"
                  onClick={
                    removeBackground
                  }
                  style={{
                    border:
                      "1px solid rgba(220,100,100,0.25)",
                    background:
                      "rgba(220,100,100,0.05)",
                    color:
                      "#e7a0a0",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 14px",
                    cursor:
                      "pointer",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <input
            ref={
              backgroundInput
            }
            type="file"
            accept="image/*"
            onChange={
              handleBackground
            }
            style={{
              display: "none",
            }}
          />

          {backgroundImage && (
            <div
              style={{
                marginTop:
                  "16px",
                height:
                  "160px",
                borderRadius:
                  "12px",
                overflow:
                  "hidden",
                border:
                  "1px solid rgba(217,164,65,0.2)",
              }}
            >
              <img
                src={
                  backgroundImage
                }
                alt="Menu background"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    "cover",
                  opacity: 0.7,
                }}
              />
            </div>
          )}
        </section>

        {/* PRODUCT LIST HEADER */}
        <section
          style={{
            background:
              "#101010",
            border:
              "1px solid rgba(217,164,65,0.25)",
            borderRadius:
              "18px",
            padding: "22px",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "15px",
              flexWrap:
                "wrap",
              marginBottom:
                "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "20px",
                }}
              >
                Products
              </h2>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    "#a9a39a",
                  fontSize:
                    "13px",
                }}
              >
                {products.length}{" "}
                total product
                {products.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>

            <input
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products..."
              style={{
                width:
                  "260px",
                maxWidth:
                  "100%",
                boxSizing:
                  "border-box",
                background:
                  "#080808",
                color:
                  "#f5f1e8",
                border:
                  "1px solid rgba(217,164,65,0.25)",
                borderRadius:
                  "9px",
                padding:
                  "11px 12px",
                outline:
                  "none",
              }}
            />
          </div>

          {/* CATEGORY FILTER */}
          <div
            style={{
              display:
                "flex",
              gap: "8px",
              overflowX:
                "auto",
              paddingBottom:
                "12px",
              marginBottom:
                "12px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  "All"
                )
              }
              style={{
                flex:
                  "0 0 auto",
                border:
                  activeCategory ===
                  "All"
                    ? `1px solid ${GOLD}`
                    : "1px solid rgba(217,164,65,0.18)",
                background:
                  activeCategory ===
                  "All"
                    ? "rgba(217,164,65,0.13)"
                    : "#151515",
                color:
                  activeCategory ===
                  "All"
                    ? GOLD_LIGHT
                    : "#aaa49a",
                borderRadius:
                  "8px",
                padding:
                  "9px 14px",
                cursor:
                  "pointer",
                fontSize:
                  "12px",
                fontWeight:
                  700,
              }}
            >
              All
            </button>

            {visibleCategories.map(
              (category) => (
                <button
                  type="button"
                  key={
                    category.id
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.name
                    )
                  }
                  style={{
                    flex:
                      "0 0 auto",
                    border:
                      activeCategory.toLowerCase() ===
                      category.name.toLowerCase()
                        ? `1px solid ${GOLD}`
                        : "1px solid rgba(217,164,65,0.18)",
                    background:
                      activeCategory.toLowerCase() ===
                      category.name.toLowerCase()
                        ? "rgba(217,164,65,0.13)"
                        : "#151515",
                    color:
                      activeCategory.toLowerCase() ===
                      category.name.toLowerCase()
                        ? GOLD_LIGHT
                        : "#aaa49a",
                    borderRadius:
                      "8px",
                    padding:
                      "9px 14px",
                    cursor:
                      "pointer",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                  }}
                >
                  {
                    category.name
                  }
                </button>
              )
            )}
          </div>

          {/* PRODUCT GROUPS */}
          {groupedProducts.length ===
          0 ? (
            <div
              style={{
                minHeight:
                  "260px",
                display:
                  "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                color:
                  "#88837a",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  fontSize:
                    "42px",
                  opacity:
                    0.5,
                  marginBottom:
                    "10px",
                }}
              >
                ◇
              </div>

              <div
                style={{
                  color:
                    "#f5f1e8",
                  fontSize:
                    "17px",
                  fontWeight:
                    700,
                }}
              >
                No products found
              </div>

              <div
                style={{
                  marginTop:
                    "6px",
                  fontSize:
                    "13px",
                }}
              >
                Add a product
                above or change
                your search/filter.
              </div>
            </div>
          ) : (
            <div>
              {groupedProducts.map(
                (group) => (
                  <div
                    key={
                      group.category
                    }
                    style={{
                      marginBottom:
                        "28px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        marginBottom:
                          "13px",
                      }}
                    >
                      <div
                        style={{
                          width:
                            "4px",
                          height:
                            "24px",
                          background:
                            GOLD,
                          borderRadius:
                            "4px",
                        }}
                      />

                      <h3
                        style={{
                          margin:
                            0,
                          color:
                            GOLD_LIGHT,
                          fontSize:
                            "18px",
                        }}
                      >
                        {
                          group.category
                        }
                      </h3>

                      <span
                        style={{
                          color:
                            "#77736c",
                          fontSize:
                            "12px",
                        }}
                      >
                        {
                          group
                            .items
                            .length
                        }{" "}
                        item
                        {group
                          .items
                          .length ===
                        1
                          ? ""
                          : "s"}
                      </span>
                    </div>

                    <div
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "repeat(2, minmax(0, 1fr))",
                        gap: "14px",
                      }}
                    >
                      {group.items.map(
                        (product) => (
                          <div
                            key={
                              product.id
                            }
                            style={{
                              border:
                                "1px solid rgba(217,164,65,0.18)",
                              background:
                                "#151515",
                              borderRadius:
                                "13px",
                              overflow:
                                "hidden",
                              display:
                                "flex",
                              minHeight:
                                "180px",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  "180px",
                                minWidth:
                                  "180px",
                                background:
                                  "#090909",
                              }}
                            >
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  style={{
                                    width:
                                      "100%",
                                    height:
                                      "100%",
                                    minHeight:
                                      "180px",
                                    objectFit:
                                      "cover",
                                    opacity:
                                      product.available
                                        ? 1
                                        : 0.42,
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width:
                                      "100%",
                                    height:
                                      "100%",
                                    minHeight:
                                      "180px",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    color:
                                      "#666",
                                    fontSize:
                                      "11px",
                                    textAlign:
                                      "center",
                                    padding:
                                      "10px",
                                    boxSizing:
                                      "border-box",
                                  }}
                                >
                                  No Product
                                  Image
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                padding:
                                  "14px",
                                flex:
                                  1,
                                minWidth:
                                  0,
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  gap:
                                    "10px",
                                  alignItems:
                                    "flex-start",
                                }}
                              >
                                <div
                                  style={{
                                    minWidth:
                                      0,
                                  }}
                                >
                                  <h4
                                    style={{
                                      margin:
                                        0,
                                      color:
                                        "#f5f1e8",
                                      fontSize:
                                        "16px",
                                      lineHeight:
                                        1.3,
                                    }}
                                  >
                                    {
                                      product.name
                                    }
                                  </h4>

                                  <div
                                    style={{
                                      marginTop:
                                        "5px",
                                      color:
                                        GOLD_LIGHT,
                                      fontWeight:
                                        800,
                                      fontSize:
                                        "14px",
                                    }}
                                  >
                                    {
                                      product.price
                                    }
                                  </div>
                                </div>

                                <span
                                  style={{
                                    flex:
                                      "0 0 auto",
                                    background:
                                      product.available
                                        ? "rgba(70,170,100,0.12)"
                                        : "rgba(160,80,80,0.12)",
                                    color:
                                      product.available
                                        ? "#86d89f"
                                        : "#e39a9a",
                                    border:
                                      product.available
                                        ? "1px solid rgba(70,170,100,0.25)"
                                        : "1px solid rgba(160,80,80,0.25)",
                                    borderRadius:
                                      "999px",
                                    padding:
                                      "5px 8px",
                                    fontSize:
                                      "9px",
                                    fontWeight:
                                      800,
                                  }}
                                >
                                  {product.available
                                    ? "AVAILABLE"
                                    : "HIDDEN"}
                                </span>
                              </div>

                              <p
                                style={{
                                  color:
                                    "#9d978e",
                                  fontSize:
                                    "12px",
                                  lineHeight:
                                    1.6,
                                  margin:
                                    "9px 0 12px",
                                  display:
                                    "-webkit-box",
                                  WebkitLineClamp:
                                    3,
                                  WebkitBoxOrient:
                                    "vertical",
                                  overflow:
                                    "hidden",
                                }}
                              >
                                {
                                  product.description
                                }
                              </p>

                              <div
                                style={{
                                  display:
                                    "grid",
                                  gridTemplateColumns:
                                    "1fr 1fr 1fr",
                                  gap:
                                    "7px",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    editProduct(
                                      product
                                    )
                                  }
                                  style={{
                                    border:
                                      "1px solid rgba(217,164,65,0.25)",
                                    background:
                                      "rgba(217,164,65,0.06)",
                                    color:
                                      GOLD_LIGHT,
                                    borderRadius:
                                      "7px",
                                    padding:
                                      "8px 5px",
                                    cursor:
                                      "pointer",
                                    fontSize:
                                      "10px",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleProduct(
                                      product.id
                                    )
                                  }
                                  style={{
                                    border:
                                      "1px solid rgba(255,255,255,0.1)",
                                    background:
                                      "transparent",
                                    color:
                                      "#bcb6ac",
                                    borderRadius:
                                      "7px",
                                    padding:
                                      "8px 5px",
                                    cursor:
                                      "pointer",
                                    fontSize:
                                      "10px",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {product.available
                                    ? "Hide"
                                    : "Show"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteProduct(
                                      product.id
                                    )
                                  }
                                  style={{
                                    border:
                                      "1px solid rgba(220,100,100,0.2)",
                                    background:
                                      "rgba(220,100,100,0.05)",
                                    color:
                                      "#e7a0a0",
                                    borderRadius:
                                      "7px",
                                    padding:
                                      "8px 5px",
                                    cursor:
                                      "pointer",
                                    fontSize:
                                      "10px",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* INFORMATION */}
        <div
          style={{
            marginTop:
              "18px",
            padding:
              "13px 15px",
            borderRadius:
              "10px",
            border:
              "1px solid rgba(255,255,255,0.07)",
            background:
              "rgba(255,255,255,0.025)",
            color:
              "#85817a",
            fontSize:
              "11px",
            lineHeight:
              1.7,
          }}
        >
          Product data is saved
          under{" "}
          <strong>
            {MENU_KEY}
          </strong>
          , while category data
          is saved independently
          under{" "}
          <strong>
            {CATEGORY_KEY}
          </strong>
          . Category images and
          product images are never
          used as the same field.
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          form {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 760px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 650px) {
          div {
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
