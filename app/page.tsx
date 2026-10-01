"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type MenuItem = {
  id?: string;
  name?: string;
  description?: string;
  price?: string | number;
  category?: string;
  image?: string;
  available?: boolean;
};

type MenuCategory = {
  id?: string;
  name?: string;
  image?: string;
  order?: number;
  visible?: boolean;
};

type GalleryItem = {
  id?: string | number;
  image?: string;
  category?: string;
  visible?: boolean;
  order?: number;
};

type StoredGalleryItem = {
  id: number;
  imageBlob: Blob;
  category: string;
  visible: boolean;
  order: number;
};

type Review = {
  id: string;
  customerName: string;
  phone?: string;
  email?: string;
  rating: number;
  review: string;
  date: string;
  visible: boolean;
  replies?: {
    id: string;
    text: string;
    date: string;
  }[];
};

type Reservation = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  persons: string;
  category: string;
  item: string;
  note: string;
  status: string;
};

type Lang = "en" | "it" | "bn";

const GOLD = "#d9a441";
const GOLD_LIGHT = "#f6cf70";

const defaultCategories = [
  "Biryani",
  "Pizza",
  "Burger",
  "Naan",
  "Chicken",
  "Mutton",
  "Drinks",
  "Dessert",
];

const defaultCategoryImages = [
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
];

const translations = {
  en: {
    home: "Home",
    menu: "Menu",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
    login: "Login",
    admin: "Admin",
    heroTitle: "Authentic Italian & Bengali Cuisine",
    heroText:
      "A unique culinary experience where Italian elegance meets the rich flavors of Bengal.",
    viewMenu: "View Menu",
    bookTable: "Book a Table",
    ourMenu: "Our Menu",
    menuText:
      "Explore our carefully selected categories and discover your favorite dishes.",
    galleryTitle: "Our Gallery",
    galleryText:
      "A glimpse of the atmosphere, dishes and moments at Nababi Ristorante.",
    reviewsTitle: "What Our Guests Say",
    reviewsText:
      "Real experiences from our valued guests.",
    aboutTitle: "About Nababi Ristorante",
    aboutText:
      "Nababi Ristorante brings together the elegance of Italian dining and the bold, aromatic flavors of Bengal.",
    reservationTitle: "Reserve Your Table",
    reservationText:
      "Book your table and enjoy an unforgettable dining experience.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    date: "Date",
    time: "Time",
    persons: "Persons",
    category: "Category",
    item: "Preferred Item",
    note: "Note",
    submitBooking: "Confirm Reservation",
    contactTitle: "Contact Us",
    address: "Via Roma, Italy",
    opening: "Open Daily: 12:00 - 23:00",
    footerText:
      "Where Italian elegance meets the soul of Bengal.",
    noGallery: "Gallery images will appear here.",
    noReviews: "No reviews available yet.",
    all: "All",
    available: "Available",
  },

  it: {
    home: "Home",
    menu: "Menu",
    gallery: "Galleria",
    about: "Chi Siamo",
    contact: "Contatti",
    login: "Accedi",
    admin: "Admin",
    heroTitle: "Autentica Cucina Italiana e Bengalese",
    heroText:
      "Un'esperienza culinaria unica dove l'eleganza italiana incontra i ricchi sapori del Bengala.",
    viewMenu: "Vedi Menu",
    bookTable: "Prenota un Tavolo",
    ourMenu: "Il Nostro Menu",
    menuText:
      "Esplora le nostre categorie e scopri i tuoi piatti preferiti.",
    galleryTitle: "La Nostra Galleria",
    galleryText:
      "Uno sguardo all'atmosfera, ai piatti e ai momenti di Nababi Ristorante.",
    reviewsTitle: "Cosa Dicono i Nostri Ospiti",
    reviewsText:
      "Esperienze reali dei nostri ospiti.",
    aboutTitle: "Chi Siamo",
    aboutText:
      "Nababi Ristorante unisce l'eleganza della cucina italiana ai sapori intensi e aromatici del Bengala.",
    reservationTitle: "Prenota il Tuo Tavolo",
    reservationText:
      "Prenota il tuo tavolo e vivi un'esperienza gastronomica indimenticabile.",
    name: "Nome",
    phone: "Telefono",
    email: "Email",
    date: "Data",
    time: "Ora",
    persons: "Persone",
    category: "Categoria",
    item: "Piatto Preferito",
    note: "Nota",
    submitBooking: "Conferma Prenotazione",
    contactTitle: "Contattaci",
    address: "Via Roma, Italia",
    opening: "Aperto Ogni Giorno: 12:00 - 23:00",
    footerText:
      "Dove l'eleganza italiana incontra l'anima del Bengala.",
    noGallery: "Le immagini della galleria appariranno qui.",
    noReviews: "Nessuna recensione disponibile.",
    all: "Tutti",
    available: "Disponibile",
  },

  bn: {
    home: "হোম",
    menu: "মেনু",
    gallery: "গ্যালারি",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    login: "লগইন",
    admin: "অ্যাডমিন",
    heroTitle: "অথেন্টিক ইতালিয়ান ও বাঙালি খাবার",
    heroText:
      "ইতালিয়ান সৌন্দর্য ও বাংলার সমৃদ্ধ স্বাদের এক অনন্য মিলন।",
    viewMenu: "মেনু দেখুন",
    bookTable: "টেবিল বুক করুন",
    ourMenu: "আমাদের মেনু",
    menuText:
      "আমাদের বিভিন্ন ক্যাটাগরি দেখুন এবং আপনার পছন্দের খাবার আবিষ্কার করুন।",
    galleryTitle: "আমাদের গ্যালারি",
    galleryText:
      "Nababi Ristorante-এর পরিবেশ, খাবার ও সুন্দর মুহূর্তগুলোর কিছু ছবি।",
    reviewsTitle: "আমাদের অতিথিরা কী বলেন",
    reviewsText:
      "আমাদের সম্মানিত অতিথিদের বাস্তব অভিজ্ঞতা।",
    aboutTitle: "Nababi Ristorante সম্পর্কে",
    aboutText:
      "Nababi Ristorante ইতালিয়ান ডাইনিং-এর সৌন্দর্যের সঙ্গে বাংলার সুগন্ধি ও সমৃদ্ধ স্বাদের সমন্বয় করে।",
    reservationTitle: "টেবিল রিজার্ভ করুন",
    reservationText:
      "আপনার টেবিল বুক করুন এবং উপভোগ করুন একটি স্মরণীয় ডাইনিং অভিজ্ঞতা।",
    name: "নাম",
    phone: "ফোন",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    persons: "জন",
    category: "ক্যাটাগরি",
    item: "পছন্দের খাবার",
    note: "নোট",
    submitBooking: "রিজার্ভেশন নিশ্চিত করুন",
    contactTitle: "যোগাযোগ করুন",
    address: "Via Roma, Italy",
    opening: "প্রতিদিন খোলা: 12:00 - 23:00",
    footerText:
      "যেখানে ইতালিয়ান সৌন্দর্যের সঙ্গে বাংলার আত্মার মিলন।",
    noGallery: "গ্যালারির ছবি এখানে দেখা যাবে।",
    noReviews: "এখনও কোনো রিভিউ নেই।",
    all: "সব",
    available: "উপলব্ধ",
  },
};

function getText(
  lang: Lang,
  key: keyof typeof translations.en
) {
  return translations[lang][key];
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeImage(value?: string) {
  if (!value) {
    return "";
  }

  return value;
}

/**
 * Converts category names into clean URLs.
 *
 * Example:
 * Biryani -> biryani
 * Chicken -> chicken
 * Chicken Curry -> chicken-curry
 */
function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Reads Gallery images from the same IndexedDB database
 * used by Admin Gallery.
 */
function readGalleryFromIndexedDB(): Promise<GalleryItem[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      resolve([]);
      return;
    }

    let request: IDBOpenDBRequest;

    try {
      request = indexedDB.open("nababi-gallery-db", 1);
    } catch {
      resolve([]);
      return;
    }

    request.onerror = () => {
      resolve([]);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("gallery")) {
        db.createObjectStore("gallery", {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      try {
        const transaction = db.transaction(
          "gallery",
          "readonly"
        );

        const store = transaction.objectStore("gallery");

        const getAllRequest = store.getAll();

        getAllRequest.onerror = () => {
          try {
            db.close();
          } catch {}

          resolve([]);
        };

        getAllRequest.onsuccess = () => {
          const records =
            (getAllRequest.result as StoredGalleryItem[]) ||
            [];

          const visibleRecords = records
            .filter(
              (item) => item && item.visible !== false
            )
            .sort(
              (a, b) =>
                Number(a.order || 0) -
                Number(b.order || 0)
            );

          const result: GalleryItem[] = [];

          for (const record of visibleRecords) {
            if (
              record.imageBlob instanceof Blob
            ) {
              const imageUrl =
                URL.createObjectURL(
                  record.imageBlob
                );

              result.push({
                id: record.id,
                image: imageUrl,
                category: record.category,
                visible: record.visible,
                order: record.order,
              });
            }
          }

          try {
            db.close();
          } catch {}

          resolve(result);
        };
      } catch {
        try {
          db.close();
        } catch {}

        resolve([]);
      }
    };
  });
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");

  const [menuItems, setMenuItems] = useState<
    MenuItem[]
  >([]);

  const [categories, setCategories] = useState<
    MenuCategory[]
  >([]);

  const [gallery, setGallery] = useState<
    GalleryItem[]
  >([]);

  const [reviews, setReviews] = useState<
    Review[]
  >([]);

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("Biryani");

  const [bookingMessage, setBookingMessage] =
    useState("");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [galleryLoading, setGalleryLoading] =
    useState(true);

  const t = (key: keyof typeof translations.en) =>
    getText(lang, key);

  /**
   * Load all Home page data.
   */
  useEffect(() => {
    const rawMenu = readStorage<any[]>(
      "nababi-menu",
      []
    );

    setMenuItems(
      Array.isArray(rawMenu) ? rawMenu : []
    );

    const rawCategories = readStorage<any[]>(
      "nababi-categories",
      []
    );

    let normalizedCategories: MenuCategory[] =
      [];

    if (Array.isArray(rawCategories)) {
      normalizedCategories = rawCategories
        .map((category: any, index) => {
          if (typeof category === "string") {
            return {
              id: slugify(category) || `category-${index}`,
              name: category,
              image:
                defaultCategoryImages[
                  index %
                    defaultCategoryImages.length
                ],
              order: index,
              visible: true,
            };
          }

          return {
            id:
              String(
                category?.id ||
                  slugify(
                    String(
                      category?.name ||
                        category?.title ||
                        ""
                    )
                  )
              ) || `category-${index}`,

            name:
              String(
                category?.name ||
                  category?.title ||
                  ""
              ),

            image:
              category?.image ||
              defaultCategoryImages[
                index %
                  defaultCategoryImages.length
              ],

            order:
              typeof category?.order === "number"
                ? category.order
                : index,

            visible:
              category?.visible !== false,
          };
        })
        .filter(
          (category) =>
            category.name &&
            category.visible !== false
        );
    }

    if (!normalizedCategories.length) {
      normalizedCategories =
        defaultCategories.map(
          (name, index) => ({
            id: slugify(name),
            name,
            image:
              defaultCategoryImages[
                index %
                  defaultCategoryImages.length
              ],
            order: index,
            visible: true,
          })
        );
    }

    normalizedCategories.sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

    setCategories(normalizedCategories);

    const rawReviews = readStorage<Review[]>(
      "nababi-reviews",
      []
    );

    setReviews(
      Array.isArray(rawReviews)
        ? rawReviews.filter(
            (review) => review.visible !== false
          )
        : []
    );

    const rawReservations =
      readStorage<Reservation[]>(
        "nababi-reservations",
        []
      );

    setReservations(
      Array.isArray(rawReservations)
        ? rawReservations
        : []
    );
  }, []);

  /**
   * Load public Gallery from IndexedDB.
   *
   * Admin Gallery stores actual image Blobs here.
   * The old Home implementation was reading only
   * localStorage, which is why those images were not
   * appearing publicly.
   */
  useEffect(() => {
    let active = true;
    let objectUrls: string[] = [];

    async function loadGallery() {
      setGalleryLoading(true);

      const indexedGallery =
        await readGalleryFromIndexedDB();

      if (!active) {
        indexedGallery.forEach((item) => {
          if (item.image) {
            URL.revokeObjectURL(item.image);
          }
        });

        return;
      }

      objectUrls = indexedGallery
        .map((item) => item.image)
        .filter(Boolean) as string[];

      /**
       * Fallback for older Gallery data that may still
       * exist in localStorage.
       */
      const oldGallery =
        readStorage<GalleryItem[]>(
          "nababi-gallery",
          []
        );

      const oldVisibleGallery =
        Array.isArray(oldGallery)
          ? oldGallery.filter(
              (item) =>
                item.visible !== false &&
                !!item.image
            )
          : [];

      /**
       * IndexedDB is now the primary source.
       * If it contains images, use those.
       * Otherwise fall back to old localStorage data.
       */
      if (indexedGallery.length) {
        setGallery(indexedGallery);
      } else {
        setGallery(oldVisibleGallery);
      }

      setGalleryLoading(false);
    }

    loadGallery();

    return () => {
      active = false;

      objectUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
    };
  }, []);

  /**
   * Refresh gallery when the browser tab becomes active.
   * This helps when Admin Gallery was updated in another
   * tab of the same browser.
   */
  useEffect(() => {
    const handleFocus = async () => {
      const indexedGallery =
        await readGalleryFromIndexedDB();

      if (indexedGallery.length) {
        setGallery((previous) => {
          previous.forEach((item) => {
            if (
              item.image &&
              item.image.startsWith(
                "blob:"
              )
            ) {
              try {
                URL.revokeObjectURL(
                  item.image
                );
              } catch {}
            }
          });

          return indexedGallery;
        });
      }
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.visible !== false
      ),
    [categories]
  );

  const currentItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.available === false) {
        return false;
      }

      return (
        String(item.category || "")
          .trim()
          .toLowerCase() ===
        selectedCategory
          .trim()
          .toLowerCase()
      );
    });
  }, [menuItems, selectedCategory]);

  const visibleReviews = useMemo(() => {
    return reviews
      .filter(
        (review) => review.visible !== false
      )
      .slice(0, 6);
  }, [reviews]);

  function openAdmin() {
    window.location.href = "/admin";
  }

  function scrollToSection(id: string) {
    setMobileMenu(false);

    const element =
      document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function handleBooking(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const reservation: Reservation = {
      id:
        Date.now().toString() +
        Math.random()
          .toString(36)
          .slice(2),

      code:
        "NAB-" +
        Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase(),

      name:
        String(
          formData.get("name") || ""
        ),

      phone:
        String(
          formData.get("phone") || ""
        ),

      email:
        String(
          formData.get("email") || ""
        ),

      date:
        String(
          formData.get("date") || ""
        ),

      time:
        String(
          formData.get("time") || ""
        ),

      persons:
        String(
          formData.get("persons") || ""
        ),

      category:
        String(
          formData.get("category") || ""
        ),

      item:
        String(
          formData.get("item") || ""
        ),

      note:
        String(
          formData.get("note") || ""
        ),

      status: "pending",
    };

    const nextReservations = [
      ...reservations,
      reservation,
    ];

    setReservations(nextReservations);

    try {
      localStorage.setItem(
        "nababi-reservations",
        JSON.stringify(
          nextReservations
        )
      );
    } catch {}

    setBookingMessage(
      `Reservation confirmed — ${reservation.code}`
    );

    form.reset();
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #080706;
          color: #f6f0e4;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .nababi-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 10%,
              rgba(217, 164, 65, 0.09),
              transparent 30%
            ),
            radial-gradient(
              circle at 80% 35%,
              rgba(217, 164, 65, 0.06),
              transparent 28%
            ),
            #080706;
          color: #f6f0e4;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid
            rgba(217, 164, 65, 0.2);
          background: rgba(
            8,
            7,
            6,
            0.92
          );
          backdrop-filter: blur(16px);
        }

        .nav {
          width: min(
            1180px,
            calc(100% - 36px)
          );
          margin: auto;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: max-content;
        }

        .brandMark {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid ${GOLD};
          color: ${GOLD_LIGHT};
          font-size: 21px;
          box-shadow:
            0 0 22px
              rgba(217, 164, 65, 0.16);
        }

        .brandText strong {
          display: block;
          color: ${GOLD_LIGHT};
          font-size: 18px;
          letter-spacing: 1.5px;
        }

        .brandText span {
          display: block;
          margin-top: 2px;
          color: #9e978b;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .navLinks button,
        .navLinks a {
          border: 0;
          background: transparent;
          color: #d9d0c1;
          cursor: pointer;
          font-size: 13px;
          transition: 0.25s;
        }

        .navLinks button:hover,
        .navLinks a:hover {
          color: ${GOLD_LIGHT};
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .loginLink,
        .adminButton {
          border: 1px solid
            rgba(217, 164, 65, 0.4);
          border-radius: 999px;
          padding: 9px 13px;
          background: transparent;
          color: ${GOLD_LIGHT};
          cursor: pointer;
          font-size: 12px;
        }

        .adminButton {
          background: ${GOLD};
          color: #17120a;
          font-weight: 700;
        }

        .languageSelect {
          border: 1px solid
            rgba(217, 164, 65, 0.35);
          background: #0e0c0a;
          color: ${GOLD_LIGHT};
          border-radius: 999px;
          padding: 8px 10px;
          outline: none;
          font-size: 12px;
        }

        .mobileToggle {
          display: none;
          border: 1px solid
            rgba(217, 164, 65, 0.35);
          background: transparent;
          color: ${GOLD_LIGHT};
          border-radius: 8px;
          padding: 8px 11px;
          cursor: pointer;
        }

        .mobileMenu {
          display: none;
        }

        .hero {
          min-height: 720px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            linear-gradient(
              rgba(8, 7, 6, 0.35),
              rgba(8, 7, 6, 0.86)
            ),
            url("https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2000&q=90")
              center / cover;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at center,
              transparent 15%,
              rgba(0, 0, 0, 0.58) 90%
            );
          pointer-events: none;
        }

        .heroContent {
          position: relative;
          z-index: 2;
          width: min(
            900px,
            calc(100% - 36px)
          );
          text-align: center;
          padding: 100px 0;
        }

        .eyebrow {
          color: ${GOLD_LIGHT};
          letter-spacing: 4px;
          text-transform: uppercase;
          font-size: 11px;
          margin-bottom: 20px;
        }

        .hero h1 {
          margin: 0 auto;
          max-width: 820px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(
            45px,
            7vw,
            82px
          );
          line-height: 0.98;
          font-weight: 500;
          color: #fff8e9;
        }

        .hero p {
          max-width: 680px;
          margin: 25px auto 0;
          color: #d5ccbc;
          line-height: 1.8;
          font-size: 16px;
        }

        .heroActions {
          margin-top: 34px;
          display: flex;
          justify-content: center;
          gap: 13px;
          flex-wrap: wrap;
        }

        .goldButton,
        .outlineButton {
          border-radius: 999px;
          padding: 13px 22px;
          cursor: pointer;
          transition: 0.25s;
          font-weight: 700;
        }

        .goldButton {
          border: 1px solid ${GOLD};
          background: ${GOLD};
          color: #17120a;
        }

        .goldButton:hover {
          background: ${GOLD_LIGHT};
          transform: translateY(-2px);
        }

        .outlineButton {
          border: 1px solid
            rgba(246, 207, 112, 0.55);
          background: rgba(
            8,
            7,
            6,
            0.35
          );
          color: ${GOLD_LIGHT};
        }

        .outlineButton:hover {
          background: rgba(
            217,
            164,
            65,
            0.1
          );
        }

        .section {
          width: min(
            1180px,
            calc(100% - 36px)
          );
          margin: auto;
          padding: 100px 0;
        }

        .sectionHeader {
          text-align: center;
          margin-bottom: 48px;
        }

        .sectionHeader h2 {
          margin: 0;
          color: #fff4dd;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(
            34px,
            5vw,
            54px
          );
          font-weight: 500;
        }

        .sectionHeader p {
          max-width: 680px;
          margin: 15px auto 0;
          color: #9f978b;
          line-height: 1.8;
        }

        .goldLine {
          width: 65px;
          height: 1px;
          background: ${GOLD};
          margin: 18px auto;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );
          gap: 18px;
        }

        .categoryCard {
          min-height: 255px;
          position: relative;
          overflow: hidden;
          border: 1px solid
            rgba(217, 164, 65, 0.18);
          border-radius: 14px;
          background: #100e0b;
          transition:
            transform 0.3s,
            border-color 0.3s;
          display: block;
        }

        .categoryCard:hover {
          transform: translateY(-6px);
          border-color: rgba(
            217,
            164,
            65,
            0.6
          );
        }

        .categoryCard img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .categoryCard:hover img {
          transform: scale(1.07);
        }

        .categoryOverlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 22px;
          background:
            linear-gradient(
              transparent 25%,
              rgba(0, 0, 0, 0.86)
            );
        }

        .categoryOverlay h3 {
          margin: 0;
          color: #fff3d5;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 25px;
          font-weight: 500;
        }

        .categoryArrow {
          margin-left: auto;
          color: ${GOLD_LIGHT};
          font-size: 20px;
        }

        .menuSection {
          background:
            linear-gradient(
              180deg,
              transparent,
              rgba(217, 164, 65, 0.025),
              transparent
            );
        }

        .categoryTabs {
          display: flex;
          justify-content: center;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 34px;
        }

        .categoryTab {
          border: 1px solid
            rgba(217, 164, 65, 0.28);
          background: #0e0c0a;
          color: #bcb3a4;
          border-radius: 999px;
          padding: 9px 15px;
          cursor: pointer;
          transition: 0.25s;
        }

        .categoryTab.active,
        .categoryTab:hover {
          background: ${GOLD};
          border-color: ${GOLD};
          color: #17120a;
          font-weight: 700;
        }

        .productGrid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 20px;
        }

        .productCard {
          overflow: hidden;
          border: 1px solid
            rgba(217, 164, 65, 0.15);
          border-radius: 14px;
          background: #0f0d0b;
        }

        .productImage {
          width: 100%;
          aspect-ratio: 1.25;
          object-fit: cover;
          display: block;
          background: #181410;
        }

        .productBody {
          padding: 20px;
        }

        .productTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .productName {
          margin: 0;
          color: #fff2d6;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 21px;
          font-weight: 500;
        }

        .productPrice {
          color: ${GOLD_LIGHT};
          white-space: nowrap;
          font-weight: 700;
        }

        .productDescription {
          color: #958d82;
          font-size: 13px;
          line-height: 1.65;
          margin: 10px 0 0;
        }

        .emptyState {
          border: 1px dashed
            rgba(217, 164, 65, 0.25);
          border-radius: 14px;
          padding: 45px 20px;
          text-align: center;
          color: #847d72;
        }

        .galleryGrid {
          display: grid;
          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );
          gap: 12px;
        }

        .galleryItem {
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid
            rgba(217, 164, 65, 0.16);
          aspect-ratio: 1;
          background: #100e0b;
        }

        .galleryItem img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s;
        }

        .galleryItem:hover img {
          transform: scale(1.07);
        }

        .aboutGrid {
          display: grid;
          grid-template-columns:
            1.05fr
            0.95fr;
          gap: 50px;
          align-items: center;
        }

        .aboutImage {
          min-height: 470px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid
            rgba(217, 164, 65, 0.22);
          background:
            linear-gradient(
              rgba(0, 0, 0, 0.18),
              rgba(0, 0, 0, 0.35)
            ),
            url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85")
              center / cover;
        }

        .aboutContent h2 {
          margin: 0;
          color: #fff2d6;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 48px;
          font-weight: 500;
        }

        .aboutContent p {
          color: #a49b8e;
          line-height: 1.9;
          margin: 20px 0;
        }

        .reviewsGrid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 18px;
        }

        .reviewCard {
          border: 1px solid
            rgba(217, 164, 65, 0.16);
          background: #0f0d0b;
          border-radius: 14px;
          padding: 23px;
        }

        .stars {
          color: ${GOLD_LIGHT};
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .reviewText {
          color: #c4bbad;
          line-height: 1.75;
          font-size: 14px;
          min-height: 90px;
        }

        .reviewName {
          color: #fff0d0;
          font-weight: 700;
          margin-top: 17px;
        }

        .reviewDate {
          color: #756e64;
          font-size: 11px;
          margin-top: 4px;
        }

        .bookingSection {
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(
                217,
                164,
                65,
                0.08
              ),
              transparent 45%
            );
        }

        .bookingBox {
          border: 1px solid
            rgba(217, 164, 65, 0.22);
          border-radius: 18px;
          padding: 35px;
          background: rgba(
            17,
            14,
            10,
            0.82
          );
        }

        .bookingForm {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 15px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          color: #b8ad9e;
          font-size: 12px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid
            rgba(217, 164, 65, 0.18);
          border-radius: 9px;
          background: #0b0908;
          color: #eee4d3;
          outline: none;
          padding: 12px 13px;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: ${GOLD};
        }

        .field textarea {
          min-height: 100px;
          resize: vertical;
        }

        .bookingSubmit {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 5px;
        }

        .successMessage {
          color: ${GOLD_LIGHT};
          font-size: 13px;
        }

        .contactGrid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 16px;
        }

        .contactCard {
          text-align: center;
          border: 1px solid
            rgba(217, 164, 65, 0.15);
          border-radius: 14px;
          padding: 28px 18px;
          background: #0e0c0a;
        }

        .contactIcon {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .contactCard h3 {
          margin: 0;
          color: ${GOLD_LIGHT};
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 20px;
          font-weight: 500;
        }

        .contactCard p {
          margin: 9px 0 0;
          color: #938b7e;
          line-height: 1.7;
          font-size: 13px;
        }

        .footer {
          border-top: 1px solid
            rgba(217, 164, 65, 0.15);
          padding: 35px 0;
        }

        .footerInner {
          width: min(
            1180px,
            calc(100% - 36px)
          );
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .footerBrand {
          color: ${GOLD_LIGHT};
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 21px;
        }

        .footerText {
          color: #70695f;
          font-size: 12px;
          margin-top: 5px;
        }

        .footerLinks {
          display: flex;
          gap: 15px;
          color: #948a7c;
          font-size: 12px;
        }

        @media (max-width: 980px) {
          .navLinks,
          .navActions .loginLink,
          .navActions .adminButton {
            display: none;
          }

          .mobileToggle {
            display: block;
          }

          .mobileMenu {
            display: block;
            border-top: 1px solid
              rgba(
                217,
                164,
                65,
                0.12
              );
            padding: 15px 18px;
            background: #0b0908;
          }

          .mobileMenu a,
          .mobileMenu button {
            display: block;
            width: 100%;
            text-align: left;
            border: 0;
            background: transparent;
            color: #d5cbbc;
            padding: 12px 0;
          }

          .categoryGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .productGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .galleryGrid {
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
          }

          .reviewsGrid {
            grid-template-columns:
              1fr;
          }

          .aboutGrid {
            grid-template-columns:
              1fr;
          }
        }

        @media (max-width: 680px) {
          .nav {
            min-height: 68px;
          }

          .brandText strong {
            font-size: 15px;
          }

          .brandText span {
            font-size: 8px;
          }

          .hero {
            min-height: 620px;
          }

          .section {
            padding: 72px 0;
          }

          .categoryGrid {
            grid-template-columns:
              1fr 1fr;
            gap: 10px;
          }

          .categoryCard {
            min-height: 190px;
          }

          .categoryOverlay {
            padding: 14px;
          }

          .categoryOverlay h3 {
            font-size: 19px;
          }

          .productGrid {
            grid-template-columns:
              1fr;
          }

          .galleryGrid {
            grid-template-columns:
              1fr 1fr;
          }

          .aboutImage {
            min-height: 330px;
          }

          .aboutContent h2 {
            font-size: 38px;
          }

          .bookingBox {
            padding: 20px;
          }

          .bookingForm {
            grid-template-columns:
              1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .bookingSubmit {
            grid-column: auto;
          }

          .contactGrid {
            grid-template-columns:
              1fr;
          }

          .footerInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="nababi-page">
        {/* HEADER */}
        <header className="topbar">
          <div className="nav">
            <a
              href="#home"
              className="brand"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              <div className="brandMark">
                N
              </div>

              <div className="brandText">
                <strong>
                  NABABI RISTORANTE
                </strong>
                <span>
                  Italian · Bengali · Luxury
                </span>
              </div>
            </a>

            <nav className="navLinks">
              <button
                onClick={() =>
                  scrollToSection("home")
                }
              >
                {t("home")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("menu")
                }
              >
                {t("menu")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("gallery")
                }
              >
                {t("gallery")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("about")
                }
              >
                {t("about")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("contact")
                }
              >
                {t("contact")}
              </button>
            </nav>

            <div className="navActions">
              <select
                className="languageSelect"
                value={lang}
                onChange={(event) =>
                  setLang(
                    event.target.value as Lang
                  )
                }
                aria-label="Language"
              >
                <option value="en">
                  EN
                </option>
                <option value="it">
                  IT
                </option>
                <option value="bn">
                  বাংলা
                </option>
              </select>

              <a
                className="loginLink"
                href="/login"
              >
                👤 {t("login")}
              </a>

              <button
                className="adminButton"
                onClick={openAdmin}
              >
                ⚙ {t("admin")}
              </button>

              <button
                className="mobileToggle"
                onClick={() =>
                  setMobileMenu(
                    (value) => !value
                  )
                }
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="mobileMenu">
              <button
                onClick={() =>
                  scrollToSection("home")
                }
              >
                {t("home")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("menu")
                }
              >
                {t("menu")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("gallery")
                }
              >
                {t("gallery")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("about")
                }
              >
                {t("about")}
              </button>

              <button
                onClick={() =>
                  scrollToSection("contact")
                }
              >
                {t("contact")}
              </button>

              <a href="/login">
                👤 {t("login")}
              </a>

              <button
                onClick={openAdmin}
              >
                ⚙ {t("admin")}
              </button>
            </div>
          )}
        </header>

        {/* HERO */}
        <section
          id="home"
          className="hero"
        >
          <div className="heroContent">
            <div className="eyebrow">
              NABABI RISTORANTE
            </div>

            <h1>
              {t("heroTitle")}
            </h1>

            <p>
              {t("heroText")}
            </p>

            <div className="heroActions">
              <button
                className="goldButton"
                onClick={() =>
                  scrollToSection("menu")
                }
              >
                {t("viewMenu")}
              </button>

              <button
                className="outlineButton"
                onClick={() =>
                  scrollToSection(
                    "reservation"
                  )
                }
              >
                {t("bookTable")}
              </button>
            </div>
          </div>
        </section>

        {/* MENU CATEGORY */}
        <section
          id="menu"
          className="section menuSection"
        >
          <div className="sectionHeader">
            <div className="eyebrow">
              NABABI RISTORANTE
            </div>

            <h2>{t("ourMenu")}</h2>

            <div className="goldLine" />

            <p>{t("menuText")}</p>
          </div>

          <div className="categoryGrid">
            {visibleCategories.map(
              (category, index) => {
                const name =
                  category.name || "";

                const categoryImage =
                  safeImage(
                    category.image
                  ) ||
                  defaultCategoryImages[
                    index %
                      defaultCategoryImages.length
                  ];

                const href =
                  `/menu/${slugify(name)}`;

                return (
                  <a
                    key={
                      category.id ||
                      `${name}-${index}`
                    }
                    href={href}
                    className="categoryCard"
                  >
                    <img
                      src={categoryImage}
                      alt={name}
                    />

                    <div className="categoryOverlay">
                      <h3>{name}</h3>

                      <span className="categoryArrow">
                        →
                      </span>
                    </div>
                  </a>
                );
              }
            )}
          </div>

          {/* Existing quick category tabs */}
          {visibleCategories.length > 0 && (
            <div
              style={{
                marginTop: 42,
              }}
            >
              <div className="categoryTabs">
                {visibleCategories.map(
                  (category) => {
                    const name =
                      category.name || "";

                    return (
                      <button
                        key={
                          category.id ||
                          name
                        }
                        className={`categoryTab ${
                          selectedCategory.toLowerCase() ===
                          name.toLowerCase()
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCategory(
                            name
                          )
                        }
                      >
                        {name}
                      </button>
                    );
                  }
                )}
              </div>

              {currentItems.length ? (
                <div className="productGrid">
                  {currentItems.map(
                    (item, index) => (
                      <article
                        className="productCard"
                        key={
                          item.id ||
                          `${item.name}-${index}`
                        }
                      >
                        {item.image ? (
                          <img
                            className="productImage"
                            src={item.image}
                            alt={
                              item.name ||
                              "Menu item"
                            }
                          />
                        ) : (
                          <div
                            className="productImage"
                            style={{
                              display: "grid",
                              placeItems:
                                "center",
                              color:
                                "#6f675b",
                            }}
                          >
                            NABABI
                          </div>
                        )}

                        <div className="productBody">
                          <div className="productTop">
                            <h3 className="productName">
                              {item.name ||
                                "Menu Item"}
                            </h3>

                            {item.price !==
                              undefined &&
                              item.price !==
                                "" && (
                                <div className="productPrice">
                                  €
                                  {item.price}
                                </div>
                              )}
                          </div>

                          {item.description && (
                            <p className="productDescription">
                              {
                                item.description
                              }
                            </p>
                          )}
                        </div>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div className="emptyState">
                  No {selectedCategory} items
                  available yet.
                </div>
              )}
            </div>
          )}
        </section>

        {/* GALLERY */}
        <section
          id="gallery"
          className="section"
        >
          <div className="sectionHeader">
            <div className="eyebrow">
              VISUAL JOURNEY
            </div>

            <h2>
              {t("galleryTitle")}
            </h2>

            <div className="goldLine" />

            <p>
              {t("galleryText")}
            </p>
          </div>

          {galleryLoading ? (
            <div className="emptyState">
              Loading gallery...
            </div>
          ) : gallery.length ? (
            <div className="galleryGrid">
              {gallery.map(
                (item, index) => (
                  <div
                    className="galleryItem"
                    key={
                      item.id ||
                      `${item.image}-${index}`
                    }
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={
                          item.category ||
                          "Nababi Ristorante"
                        }
                      />
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="emptyState">
              {t("noGallery")}
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="section"
        >
          <div className="aboutGrid">
            <div className="aboutImage" />

            <div className="aboutContent">
              <div className="eyebrow">
                OUR STORY
              </div>

              <h2>
                {t("aboutTitle")}
              </h2>

              <div className="goldLine" />

              <p>
                {t("aboutText")}
              </p>

              <p>
                From fragrant biryani and
                freshly baked naan to
                elegant Italian-inspired
                dishes, every plate is
                prepared with attention to
                ingredients, presentation
                and hospitality.
              </p>

              <button
                className="goldButton"
                onClick={() =>
                  scrollToSection(
                    "reservation"
                  )
                }
              >
                {t("bookTable")}
              </button>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="section">
          <div className="sectionHeader">
            <div className="eyebrow">
              GUEST EXPERIENCES
            </div>

            <h2>
              {t("reviewsTitle")}
            </h2>

            <div className="goldLine" />

            <p>
              {t("reviewsText")}
            </p>
          </div>

          {visibleReviews.length ? (
            <div className="reviewsGrid">
              {visibleReviews.map(
                (review) => (
                  <article
                    className="reviewCard"
                    key={review.id}
                  >
                    <div className="stars">
                      {"★".repeat(
                        Math.max(
                          0,
                          Math.min(
                            5,
                            Number(
                              review.rating ||
                                0
                            )
                          )
                        )
                      )}
                    </div>

                    <div className="reviewText">
                      {review.review}
                    </div>

                    <div className="reviewName">
                      {review.customerName}
                    </div>

                    <div className="reviewDate">
                      {review.date}
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="emptyState">
              {t("noReviews")}
            </div>
          )}
        </section>

        {/* RESERVATION */}
        <section
          id="reservation"
          className="section bookingSection"
        >
          <div className="sectionHeader">
            <div className="eyebrow">
              BOOK YOUR EXPERIENCE
            </div>

            <h2>
              {t("reservationTitle")}
            </h2>

            <div className="goldLine" />

            <p>
              {t("reservationText")}
            </p>
          </div>

          <div className="bookingBox">
            <form
              className="bookingForm"
              onSubmit={handleBooking}
            >
              <div className="field">
                <label>
                  {t("name")}
                </label>

                <input
                  name="name"
                  required
                  placeholder={t(
                    "name"
                  )}
                />
              </div>

              <div className="field">
                <label>
                  {t("phone")}
                </label>

                <input
                  name="phone"
                  required
                  placeholder={t(
                    "phone"
                  )}
                />
              </div>

              <div className="field">
                <label>
                  {t("email")}
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder={t(
                    "email"
                  )}
                />
              </div>

              <div className="field">
                <label>
                  {t("persons")}
                </label>

                <input
                  name="persons"
                  type="number"
                  min="1"
                  max="50"
                  defaultValue="2"
                  required
                />
              </div>

              <div className="field">
                <label>
                  {t("date")}
                </label>

                <input
                  name="date"
                  type="date"
                  required
                />
              </div>

              <div className="field">
                <label>
                  {t("time")}
                </label>

                <input
                  name="time"
                  type="time"
                  required
                />
              </div>

              <div className="field">
                <label>
                  {t("category")}
                </label>

                <select
                  name="category"
                  defaultValue={
                    categories[0]?.name ||
                    ""
                  }
                >
                  {visibleCategories.map(
                    (category) => (
                      <option
                        key={
                          category.id ||
                          category.name
                        }
                        value={
                          category.name
                        }
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="field">
                <label>
                  {t("item")}
                </label>

                <input
                  name="item"
                  placeholder={t(
                    "item"
                  )}
                />
              </div>

              <div className="field full">
                <label>
                  {t("note")}
                </label>

                <textarea
                  name="note"
                  placeholder={t(
                    "note"
                  )}
                />
              </div>

              <div className="bookingSubmit">
                <button
                  type="submit"
                  className="goldButton"
                >
                  {t("submitBooking")}
                </button>

                {bookingMessage && (
                  <div className="successMessage">
                    ✓ {bookingMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="section"
        >
          <div className="sectionHeader">
            <div className="eyebrow">
              NABABI RISTORANTE
            </div>

            <h2>
              {t("contactTitle")}
            </h2>

            <div className="goldLine" />
          </div>

          <div className="contactGrid">
            <div className="contactCard">
              <div className="contactIcon">
                📍
              </div>

              <h3>
                {t("address")}
              </h3>

              <p>
                Via Roma, Italy
              </p>
            </div>

            <div className="contactCard">
              <div className="contactIcon">
                🕐
              </div>

              <h3>
                {t("opening")}
              </h3>

              <p>
                Lunch & Dinner
              </p>
            </div>

            <div className="contactCard">
              <div className="contactIcon">
                📞
              </div>

              <h3>
                +39 000 000 0000
              </h3>

              <p>
                Call us for reservations
                and information.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footerInner">
            <div>
              <div className="footerBrand">
                NABABI RISTORANTE
              </div>

              <div className="footerText">
                {t("footerText")}
              </div>
            </div>

            <div className="footerLinks">
              <a href="#home">
                {t("home")}
              </a>

              <a href="#menu">
                {t("menu")}
              </a>

              <a href="#gallery">
                {t("gallery")}
              </a>

              <a href="#contact">
                {t("contact")}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
