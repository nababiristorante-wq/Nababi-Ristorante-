"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Language = "it" | "en" | "bn";

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  menu: string;
  note: string;
};

type Reservation = {
  id: string;
  code?: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  menu: string;
  category?: string;
  note: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: string;
};

type MenuItem = {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  price?: string | number;
  category?: string;
  categoryName?: string;
  image?: string;
  imageUrl?: string;
  available?: boolean;
  availability?: boolean;
};

type HomeSettings = {
  heroTitle?: string;
  heroSubtitle?: string;
  welcomeText?: string;
  heroImage?: string;
  bookingTitle?: string;
  bookingText?: string;
  visible?: boolean;
  heroVisible?: boolean;
  bookingVisible?: boolean;
};

type AboutSettings = {
  content?: string;
  text?: string;
  description?: string;
  image?: string;
  video?: string;
  visible?: boolean;
};

type GalleryItem = {
  id?: string | number;
  image?: string;
  imageUrl?: string;
  title?: string;
  category?: string;
  visible?: boolean;
  show?: boolean;
  displayOrder?: number;
};

type BreakingNewsItem = {
  id?: string | number;
  text?: string;
  title?: string;
  visible?: boolean;
  startDate?: string;
  endDate?: string;
};

type ContactSettings = {
  restaurantName?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  googleMapsUrl?: string;
  contactTitle?: string;
  contactText?: string;
  visible?: boolean;
  contactFormVisible?: boolean;
};

type SocialSettings = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  visible?: boolean;
};

type OpeningDay = {
  day?: string;
  name?: string;
  open?: boolean;
  isOpen?: boolean;
  opening?: string;
  openingTime?: string;
  closing?: string;
  closingTime?: string;
  breakEnabled?: boolean;
  breakStart?: string;
  breakEnd?: string;
};

type ReviewItem = {
  id?: string | number;
  customerName?: string;
  name?: string;
  rating?: number;
  stars?: number;
  review?: string;
  text?: string;
  image?: string;
  date?: string;
  visible?: boolean;
  replies?: {
    text?: string;
    reply?: string;
    date?: string;
  }[];
};

const translations = {
  it: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    order: "Prenota",
    admin: "Admin Login",
    heroSmall: "BENVENUTI DA NABABI RISTORANTE",
    heroTitle: "Autentico Gusto Reale",
    heroText:
      "Scopri i veri sapori dell'India e del Bangladesh nel cuore di Roma.",
    viewMenu: "Vedi Menu",
    book: "Prenota un Tavolo",
    address: "Via Vespasiano 73/75/77, Roma",
    phone: "Telefono",
    whatsapp: "WhatsApp",
    watch: "Guarda Video",
    specialTitle: "Le Nostre Specialità",
    specialText:
      "Scopri i nostri sapori autentici dell'India e del Bangladesh.",
    aboutTitle: "La Nostra Storia",
    aboutText:
      "Nababi Ristorante porta nel cuore di Roma le ricche tradizioni culinarie dell'India e del Bangladesh.",
    galleryTitle: "La Nostra Gallery",
    galleryText:
      "Un viaggio attraverso i nostri piatti, il nostro ambiente e i momenti speciali.",
    bookingTitle: "Prenota un Tavolo",
    bookingText:
      "Prenota il tuo tavolo e vivi un'esperienza autentica da Nababi Ristorante.",
    name: "Nome",
    bookingPhone: "Telefono",
    email: "Email",
    date: "Data",
    time: "Orario",
    guests: "Numero di persone",
    food: "Menu / Piatti desiderati",
    note: "Richiesta speciale",
    confirm: "Conferma Prenotazione",
    bookingSuccess:
      "Prenotazione ricevuta! Ti contatteremo per confermare.",
    manageBooking: "Gestisci Prenotazione",
    bookingCode: "Codice Prenotazione",
    findBooking: "Cerca Prenotazione",
    editBooking: "Modifica",
    cancelBooking: "Cancella",
    close: "Chiudi",
    reviewsTitle: "Cosa Dicono i Nostri Clienti",
    reviewButton: "Tutte le Recensioni",
    contactTitle: "Contatti",
    contactText:
      "Siamo a tua disposizione. Contattaci per informazioni, prenotazioni e richieste.",
    follow: "Seguici sui Social",
    openingHours: "Orari di Apertura",
    footer:
      "© 2026 Nababi Ristorante. Tutti i diritti riservati.",
    noMenu: "Nessun piatto disponibile in questa categoria.",
    all: "Tutti",
  },

  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    order: "Book Now",
    admin: "Admin Login",
    heroSmall: "WELCOME TO NABABI RISTORANTE",
    heroTitle: "Authentic Royal Taste",
    heroText:
      "Discover the true flavors of India and Bangladesh in the heart of Rome.",
    viewMenu: "View Menu",
    book: "Book a Table",
    address: "Via Vespasiano 73/75/77, Rome",
    phone: "Phone",
    whatsapp: "WhatsApp",
    watch: "Watch Video",
    specialTitle: "Our Specialities",
    specialText:
      "Discover our authentic flavors of India and Bangladesh.",
    aboutTitle: "Our Story",
    aboutText:
      "Nababi Ristorante brings the rich culinary traditions of India and Bangladesh to the heart of Rome.",
    galleryTitle: "Our Gallery",
    galleryText:
      "A journey through our dishes, our restaurant and special moments.",
    bookingTitle: "Book a Table",
    bookingText:
      "Book your table and enjoy an authentic experience at Nababi Ristorante.",
    name: "Name",
    bookingPhone: "Phone",
    email: "Email",
    date: "Date",
    time: "Time",
    guests: "Number of guests",
    food: "Menu / Desired dishes",
    note: "Special request",
    confirm: "Confirm Booking",
    bookingSuccess:
      "Booking received! We will contact you to confirm.",
    manageBooking: "Manage Booking",
    bookingCode: "Booking Code",
    findBooking: "Find Booking",
    editBooking: "Edit",
    cancelBooking: "Cancel",
    close: "Close",
    reviewsTitle: "What Our Customers Say",
    reviewButton: "All Reviews",
    contactTitle: "Contact",
    contactText:
      "We are here for you. Contact us for information, reservations and requests.",
    follow: "Follow Us",
    openingHours: "Opening Hours",
    footer:
      "© 2026 Nababi Ristorante. All rights reserved.",
    noMenu: "No dishes available in this category.",
    all: "All",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    order: "বুক করুন",
    admin: "অ্যাডমিন লগইন",
    heroSmall: "নাবাবি রিস্টোরান্তেতে স্বাগতম",
    heroTitle: "আসল রাজকীয় স্বাদ",
    heroText:
      "রোমের হৃদয়ে ভারত ও বাংলাদেশের আসল স্বাদ উপভোগ করুন।",
    viewMenu: "মেনু দেখুন",
    book: "টেবিল বুক করুন",
    address: "Via Vespasiano 73/75/77, Roma",
    phone: "ফোন",
    whatsapp: "হোয়াটসঅ্যাপ",
    watch: "ভিডিও দেখুন",
    specialTitle: "আমাদের বিশেষ খাবার",
    specialText:
      "ভারত ও বাংলাদেশের আসল স্বাদের খাবারগুলো আবিষ্কার করুন।",
    aboutTitle: "আমাদের গল্প",
    aboutText:
      "Nababi Ristorante রোমের হৃদয়ে ভারত ও বাংলাদেশের সমৃদ্ধ খাবারের ঐতিহ্য নিয়ে এসেছে।",
    galleryTitle: "আমাদের গ্যালারি",
    galleryText:
      "আমাদের খাবার, রেস্টুরেন্ট এবং বিশেষ মুহূর্তগুলোর একটি সুন্দর ভ্রমণ।",
    bookingTitle: "টেবিল বুক করুন",
    bookingText:
      "আপনার টেবিল বুক করুন এবং Nababi Ristorante-এ একটি বিশেষ অভিজ্ঞতা উপভোগ করুন।",
    name: "নাম",
    bookingPhone: "ফোন",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    guests: "কতজন",
    food: "মেনু / পছন্দের খাবার",
    note: "বিশেষ অনুরোধ",
    confirm: "বুকিং নিশ্চিত করুন",
    bookingSuccess:
      "বুকিং গ্রহণ করা হয়েছে! নিশ্চিত করার জন্য আমরা আপনার সাথে যোগাযোগ করব।",
    manageBooking: "বুকিং দেখুন / পরিচালনা করুন",
    bookingCode: "বুকিং কোড",
    findBooking: "বুকিং খুঁজুন",
    editBooking: "পরিবর্তন",
    cancelBooking: "বাতিল",
    close: "বন্ধ করুন",
    reviewsTitle: "আমাদের কাস্টমাররা কী বলেন",
    reviewButton: "সব রিভিউ",
    contactTitle: "যোগাযোগ",
    contactText:
      "তথ্য, বুকিং ও অন্যান্য বিষয়ে আমাদের সাথে যোগাযোগ করুন।",
    follow: "সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন",
    openingHours: "খোলার সময়",
    footer:
      "© 2026 Nababi Ristorante. সর্বস্বত্ব সংরক্ষিত।",
    noMenu: "এই ক্যাটাগরিতে কোনো খাবার পাওয়া যায়নি।",
    all: "সব",
  },
};

const defaultCategories = [
  {
    icon: "🍛",
    it: "Biryani",
    en: "Biryani",
    bn: "বিরিয়ানি",
    text: "Authentic royal biryani",
  },
  {
    icon: "🍕",
    it: "Pizza",
    en: "Pizza",
    bn: "পিজ্জা",
    text: "Restaurant special pizza",
  },
  {
    icon: "🍔",
    it: "Burger",
    en: "Burger",
    bn: "বার্গার",
    text: "Fresh special burgers",
  },
  {
    icon: "🫓",
    it: "Naan",
    en: "Naan",
    bn: "নান",
    text: "Traditional fresh naan",
  },
  {
    icon: "🍗",
    it: "Chicken",
    en: "Chicken",
    bn: "চিকেন",
    text: "Chicken specialities",
  },
  {
    icon: "🥩",
    it: "Mutton",
    en: "Mutton",
    bn: "মাটন",
    text: "Traditional meat dishes",
  },
  {
    icon: "🥗",
    it: "Vegetarian",
    en: "Vegetarian",
    bn: "ভেজিটেরিয়ান",
    text: "Fresh vegetarian dishes",
  },
  {
    icon: "🍚",
    it: "Rice",
    en: "Rice",
    bn: "রাইস",
    text: "Traditional rice dishes",
  },
  {
    icon: "🥤",
    it: "Drinks",
    en: "Drinks",
    bn: "পানীয়",
    text: "Drinks and house specialities",
  },
  {
    icon: "🍮",
    it: "Desserts",
    en: "Desserts",
    bn: "ডেজার্ট",
    text: "Sweet specialities",
  },
];

const emptyBookingForm: BookingForm = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: "2",
  menu: "",
  note: "",
};

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function safeObject<T extends object>(
  value: unknown,
  fallback: T
): T {
  if (value && typeof value === "object") {
    return value as T;
  }

  return fallback;
}

function getString(
  object: unknown,
  keys: string[],
  fallback = ""
): string {
  if (!object || typeof object !== "object") {
    return fallback;
  }

  const source = object as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }
  }

  return fallback;
}

function getBoolean(
  object: unknown,
  keys: string[],
  fallback = true
): boolean {
  if (!object || typeof object !== "object") {
    return fallback;
  }

  const source = object as Record<string, unknown>;

  for (const key of keys) {
    if (typeof source[key] === "boolean") {
      return source[key] as boolean;
    }
  }

  return fallback;
}

function readLocalStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getMenuCategory(item: MenuItem): string {
  return getString(
    item,
    ["category", "categoryName"],
    ""
  );
}

function getMenuName(item: MenuItem): string {
  return getString(
    item,
    ["name", "title"],
    "Menu Item"
  );
}

function getMenuDescription(item: MenuItem): string {
  return getString(
    item,
    ["description"],
    ""
  );
}

function getMenuPrice(item: MenuItem): string {
  return getString(
    item,
    ["price"],
    ""
  );
}

function getMenuImage(item: MenuItem): string {
  return getString(
    item,
    ["image", "imageUrl"],
    ""
  );
}

function getReviewName(review: ReviewItem): string {
  return getString(
    review,
    ["customerName", "name"],
    "Customer"
  );
}

function getReviewText(review: ReviewItem): string {
  return getString(
    review,
    ["review", "text"],
    ""
  );
}

function getReviewRating(review: ReviewItem): number {
  const value =
    typeof review.rating === "number"
      ? review.rating
      : typeof review.stars === "number"
      ? review.stars
      : 5;

  return Math.max(
    1,
    Math.min(5, value)
  );
}

function getGalleryImage(item: GalleryItem): string {
  return getString(
    item,
    ["image", "imageUrl"],
    ""
  );
}

export default function Home() {
  const [language, setLanguage] =
    useState<Language>("it");

  const [homeSettings, setHomeSettings] =
    useState<HomeSettings>({});

  const [aboutSettings, setAboutSettings] =
    useState<AboutSettings>({});

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>([]);

  const [breakingNews, setBreakingNews] =
    useState<BreakingNewsItem[]>([]);

  const [contactSettings, setContactSettings] =
    useState<ContactSettings>({});

  const [socialSettings, setSocialSettings] =
    useState<SocialSettings>({});

  const [openingHours, setOpeningHours] =
    useState<OpeningDay[]>([]);

  const [reviews, setReviews] =
    useState<ReviewItem[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [bookingForm, setBookingForm] =
    useState<BookingForm>(emptyBookingForm);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [showBookingManager, setShowBookingManager] =
    useState(false);

  const [bookingSearch, setBookingSearch] =
    useState("");

  const [foundBooking, setFoundBooking] =
    useState<Reservation | null>(null);

  const [bookingSearchMessage, setBookingSearchMessage] =
    useState("");

  const [showAllReviews, setShowAllReviews] =
    useState(false);

  const [showAllGallery, setShowAllGallery] =
    useState(false);

  const [newsClosed, setNewsClosed] =
    useState(false);

  const t = translations[language];

  useEffect(() => {
    const loadData = () => {
      setHomeSettings(
        safeObject(
          readLocalStorage<HomeSettings>(
            "nababi-home-settings",
            {}
          ),
          {}
        )
      );

      setAboutSettings(
        safeObject(
          readLocalStorage<AboutSettings>(
            "nababi-about",
            {}
          ),
          {}
        )
      );

      setMenuItems(
        safeArray<MenuItem>(
          readLocalStorage<unknown>(
            "nababi-menu",
            []
          )
        )
      );

      setGalleryItems(
        safeArray<GalleryItem>(
          readLocalStorage<unknown>(
            "nababi-gallery",
            []
          )
        )
      );

      setBreakingNews(
        safeArray<BreakingNewsItem>(
          readLocalStorage<unknown>(
            "nababi-breaking-news",
            []
          )
        )
      );

      setContactSettings(
        safeObject(
          readLocalStorage<ContactSettings>(
            "nababi-contact",
            {}
          ),
          {}
        )
      );

      setSocialSettings(
        safeObject(
          readLocalStorage<SocialSettings>(
            "nababi-social-media",
            {}
          ),
          {}
        )
      );

      setOpeningHours(
        safeArray<OpeningDay>(
          readLocalStorage<unknown>(
            "nababi-opening-hours",
            []
          )
        )
      );

      setReviews(
        safeArray<ReviewItem>(
          readLocalStorage<unknown>(
            "nababi-reviews",
            []
          )
        )
      );
    };

    loadData();

    const handleStorage = () => {
      loadData();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    const interval = window.setInterval(
      loadData,
      1500
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.clearInterval(interval);
    };
  }, []);

  const heroTitle =
    homeSettings.heroTitle ||
    t.heroTitle;

  const heroSubtitle =
    homeSettings.heroSubtitle ||
    homeSettings.welcomeText ||
    t.heroText;

  const bookingTitle =
    homeSettings.bookingTitle ||
    t.bookingTitle;

  const bookingText =
    homeSettings.bookingText ||
    t.bookingText;

  const heroImage =
    homeSettings.heroImage || "";

  const aboutText =
    aboutSettings.content ||
    aboutSettings.text ||
    aboutSettings.description ||
    t.aboutText;

  const aboutImage =
    aboutSettings.image || "";

  const address =
    contactSettings.address ||
    t.address;

  const phone =
    contactSettings.phone ||
    "+39 393 3805350";

  const email =
    contactSettings.email ||
    "";

  const whatsapp =
    contactSettings.whatsapp ||
    "+39 333 7687319";

  const mapsUrl =
    contactSettings.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77+Roma";

  const isNewsActive = (
    item: BreakingNewsItem
  ) => {
    if (!getBoolean(item, ["visible"], true)) {
      return false;
    }

    const now = new Date();

    if (item.startDate) {
      const start = new Date(item.startDate);

      if (
        !Number.isNaN(start.getTime()) &&
        now < start
      ) {
        return false;
      }
    }

    if (item.endDate) {
      const end = new Date(item.endDate);

      if (
        !Number.isNaN(end.getTime()) &&
        now > end
      ) {
        return false;
      }
    }

    return true;
  };

  const activeNews = useMemo(() => {
    return breakingNews.filter(isNewsActive);
  }, [breakingNews]);

  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      {
        name: string;
        icon: string;
        text: string;
      }
    >();

    defaultCategories.forEach(
      (category) => {
        categoryMap.set(
          category.en.toLowerCase(),
          {
            name:
              language === "it"
                ? category.it
                : language === "bn"
                ? category.bn
                : category.en,
            icon: category.icon,
            text: category.text,
          }
        );
      }
    );

    menuItems.forEach((item) => {
      const category =
        getMenuCategory(item).trim();

      if (!category) {
        return;
      }

      const key = category.toLowerCase();

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          name: category,
          icon: "🍽️",
          text: "Restaurant specialities",
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [language, menuItems]);

  const visibleMenuItems = useMemo(() => {
    const available = menuItems.filter(
      (item) =>
        getBoolean(
          item,
          ["available", "availability"],
          true
        )
    );

    if (!selectedCategory) {
      return available;
    }

    const selected = selectedCategory
      .toLowerCase();

    return available.filter((item) => {
      return (
        getMenuCategory(item)
          .trim()
          .toLowerCase() === selected
      );
    });
  }, [menuItems, selectedCategory]);

  const visibleGallery = useMemo(() => {
    return galleryItems
      .filter((item) =>
        getBoolean(
          item,
          ["visible", "show"],
          true
        )
      )
      .filter(
        (item) => Boolean(getGalleryImage(item))
      )
      .sort(
        (a, b) =>
          Number(a.displayOrder || 0) -
          Number(b.displayOrder || 0)
      );
  }, [galleryItems]);

  const visibleReviews = useMemo(() => {
    return reviews
      .filter((review) =>
        getBoolean(
          review,
          ["visible"],
          true
        )
      )
      .filter((review) =>
        Boolean(getReviewText(review))
      )
      .sort((a, b) => {
        const aDate = new Date(
          a.date || ""
        ).getTime();

        const bDate = new Date(
          b.date || ""
        ).getTime();

        return bDate - aDate;
      });
  }, [reviews]);

  const displayedReviews = showAllReviews
    ? visibleReviews
    : visibleReviews.slice(0, 6);

  const displayedGallery = showAllGallery
    ? visibleGallery
    : visibleGallery.slice(0, 6);

  const handleBookingSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const existing =
        readLocalStorage<unknown>(
          "nababi-reservations",
          []
        );

      const reservations =
        safeArray<Reservation>(existing);

      const id =
        Date.now().toString();

      const code =
        `NAB-${Date.now()
          .toString()
          .slice(-6)}`;

      const reservation: Reservation = {
        id,
        code,
        name:
          bookingForm.name.trim(),
        phone:
          bookingForm.phone.trim(),
        email:
          bookingForm.email.trim(),
        date: bookingForm.date,
        time: bookingForm.time,
        guests:
          Number(bookingForm.guests) || 2,
        menu:
          bookingForm.menu.trim(),
        category:
          selectedCategory || "",
        note:
          bookingForm.note.trim(),
        status: "Pending",
        createdAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "nababi-reservations",
        JSON.stringify([
          ...reservations,
          reservation,
        ])
      );

      setBookingForm(
        emptyBookingForm
      );

      setBookingSuccess(true);

      setTimeout(() => {
        setBookingSuccess(false);
      }, 7000);
    } catch (error) {
      console.error(
        "Booking save error:",
        error
      );

      alert(
        "Unable to save the booking. Please try again."
      );
    }
  };

  const findBooking = () => {
    setBookingSearchMessage("");
    setFoundBooking(null);

    const search =
      bookingSearch.trim().toLowerCase();

    if (!search) {
      setBookingSearchMessage(
        "Please enter your phone, email or booking code."
      );

      return;
    }

    const reservations =
      safeArray<Reservation>(
        readLocalStorage<unknown>(
          "nababi-reservations",
          []
        )
      );

    const result =
      reservations.find((booking) => {
        return (
          String(
            booking.phone || ""
          )
            .trim()
            .toLowerCase() === search ||
          String(
            booking.email || ""
          )
            .trim()
            .toLowerCase() === search ||
          String(
            booking.code ||
              booking.id ||
              ""
          )
            .trim()
            .toLowerCase() === search
        );
      });

    if (!result) {
      setBookingSearchMessage(
        "No booking found with those details."
      );

      return;
    }

    setFoundBooking(result);
  };

  const cancelBooking = () => {
    if (!foundBooking) {
      return;
    }

    const reservations =
      safeArray<Reservation>(
        readLocalStorage<unknown>(
          "nababi-reservations",
          []
        )
      );

    const updated =
      reservations.map((booking) =>
        String(booking.id) ===
        String(foundBooking.id)
          ? {
              ...booking,
              status: "Cancelled" as const,
            }
          : booking
      );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify(updated)
    );

    setFoundBooking({
      ...foundBooking,
      status: "Cancelled",
    });
  };

  const editBooking = () => {
    if (!foundBooking) {
      return;
    }

    setBookingForm({
      name:
        foundBooking.name || "",
      phone:
        foundBooking.phone || "",
      email:
        foundBooking.email || "",
      date:
        foundBooking.date || "",
      time:
        foundBooking.time || "",
      guests:
        String(
          foundBooking.guests || 2
        ),
      menu:
        foundBooking.menu || "",
      note:
        foundBooking.note || "",
    });

    setShowBookingManager(false);

    window.location.hash =
      "booking";
  };

  const selectedCategoryLabel =
    selectedCategory
      ? categories.find(
          (category) =>
            category.name.toLowerCase() ===
            selectedCategory.toLowerCase()
        )?.name ||
        selectedCategory
      : t.all;

  const getDayLabel = (
    day: OpeningDay
  ) => {
    return getString(
      day,
      ["name", "day"],
      ""
    );
  };

  return (
    <main className="site">

      {/* ================= HEADER ================= */}

      <header className="header">

        <a
          href="#home"
          className="logo"
        >
          <span className="logo-crown">
            ♛
          </span>

          <span>
            <strong>NABABI</strong>
            <small>
              RISTORANTE
            </small>
          </span>
        </a>

        <nav className="nav">
          <a href="#home">
            {t.home}
          </a>

          <a href="#about">
            {t.about}
          </a>

          <a href="#menu">
            {t.menu}
          </a>

          <a href="#gallery">
            {t.gallery}
          </a>

          <a href="#reviews">
            {t.reviews}
          </a>

          <a href="#contact">
            {t.contact}
          </a>
        </nav>

        <div className="header-actions">

          <a
            href="#booking"
            className="order-btn"
          >
            {t.order}
          </a>

          <a
            href="/admin"
            className="admin-btn"
          >
            🔒 {t.admin}
          </a>

          <select
            className="language"
            value={language}
            onChange={(event) =>
              setLanguage(
                event.target.value as Language
              )
            }
          >
            <option value="it">
              🇮🇹 IT
            </option>

            <option value="en">
              🇬🇧 EN
            </option>

            <option value="bn">
              🇧🇩 বাংলা
            </option>
          </select>

        </div>
      </header>

      {/* ================= BREAKING NEWS ================= */}

      {activeNews.length > 0 &&
        !newsClosed && (
          <div className="breaking-news">

            <div className="breaking-label">
              BREAKING NEWS
            </div>

            <div className="breaking-text">
              {getString(
                activeNews[0],
                ["text", "title"],
                ""
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setNewsClosed(true)
              }
              aria-label="Close"
            >
              ×
            </button>

          </div>
        )}

      {/* ================= HERO ================= */}

      <section
        id="home"
        className="hero"
      >

        <div className="hero-content">

          <p className="eyebrow">
            {t.heroSmall}
          </p>

          <h1>
            {heroTitle}
          </h1>

          <p className="hero-text">
            {heroSubtitle}
          </p>

          <div className="hero-buttons">

            <a
              href="#menu"
              className="primary-btn"
            >
              🍛 {t.viewMenu}
            </a>

            <a
              href="#booking"
              className="secondary-btn"
            >
              ◉ {t.book}
            </a>

          </div>

          <div className="quick-info">

            <div>
              <span>📍</span>

              <small>
                Address
              </small>

              <strong>
                {address}
              </strong>
            </div>

            <div>
              <span>☎</span>

              <small>
                {t.phone}
              </small>

              <strong>
                {phone}
              </strong>
            </div>

            <div>
              <span>💬</span>

              <small>
                {t.whatsapp}
              </small>

              <strong>
                {whatsapp}
              </strong>
            </div>

          </div>

        </div>

        <div className="hero-art">

          <div
            className="royal-circle"
            style={
              heroImage
                ? {
                    backgroundImage: `linear-gradient(rgba(10,7,5,.18), rgba(10,7,5,.35)), url("${heroImage}")`,
                    backgroundSize:
                      "cover",
                    backgroundPosition:
                      "center",
                  }
                : undefined
            }
          >

            {!heroImage && (
              <div className="food-circle">
                🍛
              </div>
            )}

          </div>

          <div className="hero-art-buttons">

            {homeSettings.heroImage && (
              <span className="image-ready">
                Hero Image
              </span>
            )}

            <button type="button">
              ▶ {t.watch}
            </button>

            <a href="#gallery">
              ▣ {t.gallery}
            </a>

          </div>

        </div>

      </section>

      {/* ================= MENU ================= */}

      <section
        id="menu"
        className="section specialities"
      >

        <div className="section-heading">

          <p className="eyebrow">
            NABABI RISTORANTE
          </p>

          <h2>
            {t.specialTitle}
          </h2>

          <p>
            {t.specialText}
          </p>

        </div>

        <div className="category-grid">

          <button
            type="button"
            className={`category-card ${
              selectedCategory === null
                ? "category-active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(null)
            }
          >

            <div className="category-image">
              🍽️
            </div>

            <h3>
              {t.all}
            </h3>

            <p>
              All available dishes
            </p>

            <span>
              View Menu →
            </span>

          </button>

          {categories.map(
            (category) => (
              <button
                type="button"
                key={category.name}
                className={`category-card ${
                  selectedCategory?.toLowerCase() ===
                  category.name.toLowerCase()
                    ? "category-active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    category.name
                  )
                }
              >

                <div className="category-image">
                  {category.icon}
                </div>

                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.text}
                </p>

                <span>
                  View Menu →
                </span>

              </button>
            )
          )}

        </div>

        <div className="menu-result">

          <div className="menu-result-header">

            <div>
              <p className="eyebrow">
                MENU
              </p>

              <h3>
                {selectedCategoryLabel}
              </h3>
            </div>

            <span>
              {visibleMenuItems.length} items
            </span>

          </div>

          {visibleMenuItems.length === 0 ? (

            <div className="empty-menu">
              {menuItems.length === 0
                ? "Menu items will appear here when added from Admin → Menu."
                : t.noMenu}
            </div>

          ) : (

            <div className="menu-items-grid">

              {visibleMenuItems.map(
                (item, index) => {

                  const image =
                    getMenuImage(item);

                  return (
                    <article
                      className="menu-item-card"
                      key={
                        String(
                          item.id ||
                            getMenuName(item)
                        ) +
                        "-" +
                        index
                      }
                    >

                      <div className="menu-item-image">

                        {image ? (
                          <img
                            src={image}
                            alt={getMenuName(
                              item
                            )}
                          />
                        ) : (
                          <span>
                            🍽️
                          </span>
                        )}

                      </div>

                      <div className="menu-item-content">

                        <div className="menu-item-top">

                          <h4>
                            {getMenuName(
                              item
                            )}
                          </h4>

                          {getMenuPrice(
                            item
                          ) && (
                            <strong>
                              €{" "}
                              {getMenuPrice(
                                item
                              )}
                            </strong>
                          )}

                        </div>

                        <p>
                          {getMenuDescription(
                            item
                          )}
                        </p>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="section about-section"
      >

        <div
          className="about-image"
          style={
            aboutImage
              ? {
                  backgroundImage: `linear-gradient(rgba(10,7,5,.25), rgba(10,7,5,.45)), url("${aboutImage}")`,
                  backgroundSize:
                    "cover",
                  backgroundPosition:
                    "center",
                }
              : undefined
          }
        >

          {!aboutImage && (
            <div className="about-placeholder">

              <span>
                👑
              </span>

              <strong>
                NABABI
              </strong>

              <small>
                RISTORANTE
              </small>

            </div>
          )}

          {aboutSettings.video && (
            <a
              className="about-video-link"
              href={aboutSettings.video}
              target="_blank"
              rel="noreferrer"
            >
              ▶ Watch Video
            </a>
          )}

        </div>

        <div className="about-content">

          <p className="eyebrow">
            NABABI RISTORANTE
          </p>

          <h2>
            {t.aboutTitle}
          </h2>

          <p>
            {aboutText}
          </p>

          <a
            href="#contact"
            className="primary-btn"
          >
            {t.contact} →
          </a>

        </div>

      </section>

      {/* ================= GALLERY ================= */}

      <section
        id="gallery"
        className="section gallery-section"
      >

        <div className="section-heading">

          <p className="eyebrow">
            NABABI RISTORANTE
          </p>

          <h2>
            {t.galleryTitle}
          </h2>

          <p>
            {t.galleryText}
          </p>

        </div>

        {visibleGallery.length === 0 ? (

          <div className="gallery-empty">
            Gallery images will appear here
            when added from Admin → Gallery.
          </div>

        ) : (

          <div className="gallery-grid">

            {displayedGallery.map(
              (item, index) => {

                const image =
                  getGalleryImage(item);

                return (
                  <div
                    className={`gallery-card ${
                      index === 0 ||
                      index === 5
                        ? "large"
                        : ""
                    }`}
                    key={
                      String(
                        item.id ||
                          item.title ||
                          image
                      ) +
                      "-" +
                      index
                    }
                  >

                    <img
                      src={image}
                      alt={
                        item.title ||
                        "Nababi Ristorante"
                      }
                    />

                  </div>
                );
              }
            )}

          </div>
        )}

        {visibleGallery.length > 6 && (
          <div className="center">

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setShowAllGallery(
                  (value) => !value
                )
              }
            >
              {showAllGallery
                ? "Show Less"
                : "View All Gallery"}
            </button>

          </div>
        )}

      </section>

      {/* ================= BOOKING ================= */}

      <section
        id="booking"
        className="section booking-section"
      >

        <div className="section-heading">

          <p className="eyebrow">
            RESERVATION
          </p>

          <h2>
            {bookingTitle}
          </h2>

          <p>
            {bookingText}
          </p>

        </div>

        <form
          className="booking-form"
          onSubmit={
            handleBookingSubmit
          }
        >

          <div className="form-grid">

            <label>
              {t.name}

              <input
                type="text"
                required
                value={
                  bookingForm.name
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    name:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.bookingPhone}

              <input
                type="tel"
                required
                value={
                  bookingForm.phone
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    phone:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.email}

              <input
                type="email"
                value={
                  bookingForm.email
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    email:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.date}

              <input
                type="date"
                required
                value={
                  bookingForm.date
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    date:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.time}

              <input
                type="time"
                required
                value={
                  bookingForm.time
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    time:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.guests}

              <select
                required
                value={
                  bookingForm.guests
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    guests:
                      event.target.value,
                  })
                }
              >
                <option value="1">
                  1
                </option>

                <option value="2">
                  2
                </option>

                <option value="3">
                  3
                </option>

                <option value="4">
                  4
                </option>

                <option value="5">
                  5
                </option>

                <option value="6">
                  6
                </option>

                <option value="7">
                  7+
                </option>
              </select>
            </label>

            <label>
              {t.food}

              <input
                type="text"
                value={
                  bookingForm.menu
                }
                onChange={(event) =>
                  setBookingForm({
                    ...bookingForm,
                    menu:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              Category

              <select
                value={
                  selectedCategory ||
                  ""
                }
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value ||
                      null
                  )
                }
              >
                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.name}
                      value={
                        category.name
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </label>

          </div>

          <label>
            {t.note}

            <textarea
              rows={5}
              value={
                bookingForm.note
              }
              onChange={(event) =>
                setBookingForm({
                  ...bookingForm,
                  note:
                    event.target.value,
                })
              }
            />
          </label>

          <button
            className="primary-btn submit-btn"
            type="submit"
          >
            {t.confirm} →
          </button>

          {bookingSuccess && (
            <div className="booking-success">
              ✓ {t.bookingSuccess}
              <br />
              <small>
                Your booking has been saved.
              </small>
            </div>
          )}

        </form>

        <div className="manage-booking-wrap">

          <button
            type="button"
            className="secondary-btn manage-booking-button"
            onClick={() => {
              setShowBookingManager(
                true
              );
              setFoundBooking(null);
              setBookingSearch("");
              setBookingSearchMessage("");
            }}
          >
            🔎 {t.manageBooking}
          </button>

        </div>

      </section>

      {/* ================= BOOKING MANAGER ================= */}

      {showBookingManager && (
        <div className="modal-backdrop">

          <div className="booking-manager">

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowBookingManager(
                  false
                )
              }
            >
              ×
            </button>

            <p className="eyebrow">
              BOOKING
            </p>

            <h2>
              {t.manageBooking}
            </h2>

            <p>
              Enter your phone, email or booking code.
            </p>

            <div className="booking-search">

              <input
                value={bookingSearch}
                onChange={(event) =>
                  setBookingSearch(
                    event.target.value
                  )
                }
                placeholder={`${t.bookingCode} / Phone / Email`}
              />

              <button
                type="button"
                className="primary-btn"
                onClick={
                  findBooking
                }
              >
                {t.findBooking}
              </button>

            </div>

            {bookingSearchMessage && (
              <div className="manager-message">
                {bookingSearchMessage}
              </div>
            )}

            {foundBooking && (
              <div className="found-booking">

                <div>
                  <span>
                    Booking Code
                  </span>

                  <strong>
                    {foundBooking.code ||
                      foundBooking.id}
                  </strong>
                </div>

                <div>
                  <span>
                    Name
                  </span>

                  <strong>
                    {foundBooking.name}
                  </strong>
                </div>

                <div>
                  <span>
                    Date & Time
                  </span>

                  <strong>
                    {foundBooking.date}{" "}
                    {foundBooking.time}
                  </strong>
                </div>

                <div>
                  <span>
                    Guests
                  </span>

                  <strong>
                    {foundBooking.guests}
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {foundBooking.status}
                  </strong>
                </div>

                <div className="manager-actions">

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={
                      editBooking
                    }
                    disabled={
                      foundBooking.status ===
                      "Cancelled"
                    }
                  >
                    {t.editBooking}
                  </button>

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={
                      cancelBooking
                    }
                    disabled={
                      foundBooking.status ===
                      "Cancelled"
                    }
                  >
                    {t.cancelBooking}
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ================= REVIEWS ================= */}

      <section
        id="reviews"
        className="section reviews-section"
      >

        <div className="section-heading">

          <p className="eyebrow">
            REVIEWS
          </p>

          <h2>
            {t.reviewsTitle}
          </h2>

        </div>

        {displayedReviews.length === 0 ? (

          <div className="reviews-empty">
            Customer reviews will appear here
            when added from Admin → Reviews.
          </div>

        ) : (

          <div className="reviews-grid">

            {displayedReviews.map(
              (review, index) => {

                const rating =
                  getReviewRating(
                    review
                  );

                return (
                  <div
                    className="review-card"
                    key={
                      String(
                        review.id ||
                          getReviewName(
                            review
                          )
                      ) +
                      "-" +
                      index
                    }
                  >

                    <div className="stars">
                      {"★".repeat(
                        rating
                      )}
                      <span>
                        {"☆".repeat(
                          5 - rating
                        )}
                      </span>
                    </div>

                    <p>
                      “
                      {getReviewText(
                        review
                      )}
                      ”
                    </p>

                    <strong>
                      {getReviewName(
                        review
                      )}
                    </strong>

                    {review.date && (
                      <small>
                        {review.date}
                      </small>
                    )}

                    {review.replies &&
                      review.replies
                        .length > 0 && (
                        <div className="review-replies">

                          {review.replies.map(
                            (
                              reply,
                              replyIndex
                            ) => (
                              <div
                                className="review-reply"
                                key={
                                  replyIndex
                                }
                              >
                                <b>
                                  Restaurant
                                  Reply
                                </b>

                                <p>
                                  {reply.text ||
                                    reply.reply ||
                                    ""}
                                </p>
                              </div>
                            )
                          )}

                        </div>
                      )}

                  </div>
                );
              }
            )}

          </div>
        )}

        {visibleReviews.length > 6 && (
          <div className="center">

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setShowAllReviews(
                  (value) => !value
                )
              }
            >
              {showAllReviews
                ? "Show Less"
                : t.reviewButton}
            </button>

          </div>
        )}

      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="section contact-section"
      >

        <div className="contact-content">

          <p className="eyebrow">
            NABABI RISTORANTE
          </p>

          <h2>
            {contactSettings.contactTitle ||
              t.contactTitle}
          </h2>

          <p>
            {contactSettings.contactText ||
              t.contactText}
          </p>

          <div className="contact-list">

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              📍{" "}
              <span>
                {address}
              </span>
            </a>

            <a
              href={`tel:${phone.replace(
                /\s/g,
                ""
              )}`}
            >
              ☎{" "}
              <span>
                {phone}
              </span>
            </a>

            {email && (
              <a
                href={`mailto:${email}`}
              >
                ✉{" "}
                <span>
                  {email}
                </span>
              </a>
            )}

            <a
              href={
                whatsapp.startsWith(
                  "http"
                )
                  ? whatsapp
                  : `https://wa.me/${whatsapp.replace(
                      /\D/g,
                      ""
                    )}`
              }
              target="_blank"
              rel="noreferrer"
            >
              💬{" "}
              <span>
                WhatsApp
              </span>
            </a>

          </div>

        </div>

        <div className="map-box">

          <div>

            <span>
              📍
            </span>

            <strong>
              Roma
            </strong>

            <small>
              {address}
            </small>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Google Maps →
            </a>

          </div>

        </div>

      </section>

      {/* ================= OPENING HOURS ================= */}

      {openingHours.length > 0 && (
        <section className="opening-section">

          <div className="section-heading">

            <p className="eyebrow">
              NABABI RISTORANTE
            </p>

            <h2>
              {t.openingHours}
            </h2>

          </div>

          <div className="opening-grid">

            {openingHours.map(
              (day, index) => {

                const isOpen =
                  getBoolean(
                    day,
                    ["open", "isOpen"],
                    true
                  );

                const opening =
                  getString(
                    day,
                    [
                      "opening",
                      "openingTime",
                    ],
                    ""
                  );

                const closing =
                  getString(
                    day,
                    [
                      "closing",
                      "closingTime",
                    ],
                    ""
                  );

                return (
                  <div
                    className="opening-card"
                    key={
                      getDayLabel(
                        day
                      ) +
                      "-" +
                      index
                    }
                  >

                    <strong>
                      {getDayLabel(
                        day
                      )}
                    </strong>

                    {isOpen ? (
                      <span>
                        {opening}
                        {opening &&
                          closing &&
                          " — "}
                        {closing}
                      </span>
                    ) : (
                      <span>
                        Closed
                      </span>
                    )}

                    {day.breakEnabled &&
                      day.breakStart &&
                      day.breakEnd && (
                        <small>
                          Break{" "}
                          {
                            day.breakStart
                          }{" "}
                          —{" "}
                          {
                            day.breakEnd
                          }
                        </small>
                      )}

                  </div>
                );
              }
            )}

          </div>

        </section>
      )}

      {/* ================= SOCIAL ================= */}

      {getBoolean(
        socialSettings,
        ["visible"],
        true
      ) && (
        <section className="social-section">

          <p className="eyebrow">
            {t.follow}
          </p>

          <div className="social-links">

            {socialSettings.facebook && (
              <a
                href={
                  socialSettings.facebook
                }
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            )}

            {socialSettings.instagram && (
              <a
                href={
                  socialSettings.instagram
                }
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}

            {socialSettings.tiktok && (
              <a
                href={
                  socialSettings.tiktok
                }
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>
            )}

            {socialSettings.youtube && (
              <a
                href={
                  socialSettings.youtube
                }
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            )}

            {!socialSettings.facebook &&
              !socialSettings.instagram &&
              !socialSettings.tiktok &&
              !socialSettings.youtube && (
                <>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>

                  <a
                    href="https://www.tiktok.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TikTok
                  </a>
                </>
              )}

          </div>

        </section>
      )}

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div>

          <span className="footer-logo">
            ♛ NABABI
          </span>

          <p>
            RISTORANTE
          </p>

        </div>

        <p>
          {t.footer}
        </p>

        <a href="/admin">
          Admin Panel
        </a>

      </footer>

      {/* ================= STYLE ================= */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .site {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(184, 145, 72, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 35%,
              rgba(184, 145, 72, 0.09),
              transparent 28%
            ),
            #100d0c;
          color: #f5eddc;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          min-height: 82px;
          padding: 14px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background:
            rgba(16, 13, 12, 0.94);
          border-bottom:
            1px solid
            rgba(202, 164, 83, 0.3);
          backdrop-filter: blur(14px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ead49a;
          text-decoration: none;
          min-width: 180px;
        }

        .logo-crown {
          font-size: 35px;
          color: #c9a55a;
        }

        .logo strong {
          display: block;
          letter-spacing: 4px;
          font-size: 20px;
        }

        .logo small {
          display: block;
          letter-spacing: 3px;
          font-size: 9px;
          color: #c8b99b;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav a,
        .footer a {
          color: #eee2ca;
          text-decoration: none;
          font-size: 13px;
          transition: 0.25s;
        }

        .nav a:hover,
        .footer a:hover {
          color: #d9b86b;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .order-btn,
        .admin-btn,
        .primary-btn,
        .secondary-btn {
          text-decoration: none;
          border-radius: 30px;
          padding: 11px 17px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid #c9a55a;
          transition: 0.25s;
        }

        .order-btn,
        .primary-btn {
          color: #17110c;
          background:
            linear-gradient(
              135deg,
              #f0dfa7,
              #b99045
            );
        }

        .admin-btn,
        .secondary-btn {
          color: #f2dfb0;
          background: transparent;
        }

        .order-btn:hover,
        .primary-btn:hover,
        .admin-btn:hover,
        .secondary-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 25px
            rgba(201, 165, 90, 0.2);
        }

        .language {
          color: #ead9b0;
          background: #211a17;
          border: 1px solid #6e5933;
          border-radius: 20px;
          padding: 9px 10px;
        }

        .breaking-news {
          position: fixed;
          z-index: 100;
          left: 24px;
          top: 105px;
          width: min(410px, calc(100vw - 48px));
          display: flex;
          align-items: stretch;
          overflow: hidden;
          border:
            1px solid
            rgba(226, 181, 79, 0.75);
          border-radius: 10px;
          background:
            rgba(25, 14, 10, 0.96);
          box-shadow:
            0 18px 50px
            rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
        }

        .breaking-label {
          display: flex;
          align-items: center;
          padding: 10px;
          background: #9e281e;
          color: #fff2d0;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .breaking-text {
          flex: 1;
          padding: 10px 12px;
          color: #f1dfb1;
          font-size: 12px;
          line-height: 1.5;
        }

        .breaking-news button {
          width: 34px;
          border: 0;
          background: transparent;
          color: #d5c4a0;
          font-size: 22px;
          cursor: pointer;
        }

        .hero {
          min-height: 680px;
          padding: 90px 8%;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 50px;
        }

        .eyebrow {
          color: #d2b267;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .hero h1 {
          margin: 0;
          max-width: 700px;
          font-size:
            clamp(55px, 7vw, 92px);
          line-height: 0.95;
          color: #f0e1b1;
          font-weight: 500;
        }

        .hero-text {
          max-width: 570px;
          color: #cbbda5;
          line-height: 1.8;
          margin: 28px 0;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 42px;
        }

        .quick-info {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          border-top:
            1px solid
            rgba(207, 172, 94, 0.3);
          padding-top: 22px;
          gap: 18px;
        }

        .quick-info div {
          display: grid;
          grid-template-columns:
            25px 1fr;
          column-gap: 5px;
        }

        .quick-info span {
          grid-row: span 2;
          font-size: 18px;
        }

        .quick-info small {
          color: #ad9b7d;
          font-size: 9px;
          text-transform: uppercase;
        }

        .quick-info strong {
          font-size: 10px;
          color: #e4d7bb;
        }

        .hero-art {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .royal-circle {
          width:
            min(390px, 80vw);
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 2px solid #aa8140;
          box-shadow:
            0 0 0 16px
              rgba(172, 130, 64, 0.08),
            0 0 0 32px
              rgba(172, 130, 64, 0.04);
          background:
            radial-gradient(
              circle,
              #5d392d 0%,
              #211817 47%,
              #100d0c 70%
            );
          background-repeat: no-repeat;
        }

        .food-circle {
          width: 52%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size:
            clamp(70px, 9vw, 125px);
          background:
            radial-gradient(
              circle,
              #d99d51,
              #7c4a31
            );
          border: 12px solid #5c3930;
          box-shadow:
            0 15px 35px
            rgba(0, 0, 0, 0.45);
        }

        .hero-art-buttons {
          display: flex;
          gap: 12px;
          margin-top: 30px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-art-buttons button,
        .hero-art-buttons a {
          color: #e9d9b4;
          background: transparent;
          border: 1px solid #9c7a43;
          padding: 10px 15px;
          border-radius: 25px;
          text-decoration: none;
          font-size: 12px;
          cursor: pointer;
        }

        .image-ready {
          color: #d9bc77;
          font-size: 10px;
          border: 1px solid #6e5933;
          padding: 8px 10px;
          border-radius: 20px;
        }

        .section {
          padding: 100px 8%;
          border-top:
            1px solid
            rgba(203, 163, 78, 0.13);
        }

        .section-heading {
          max-width: 700px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .section-heading h2,
        .about-content h2,
        .contact-content h2,
        .booking-manager h2 {
          font-size:
            clamp(38px, 5vw, 60px);
          line-height: 1;
          font-weight: 500;
          color: #eddcae;
          margin: 0 0 18px;
        }

        .section-heading > p:last-child,
        .about-content > p,
        .contact-content > p {
          color: #bfb29c;
          line-height: 1.8;
        }

        .category-grid {
          display: grid;
          grid-template-columns:
            repeat(5, 1fr);
          gap: 16px;
        }

        .category-card {
          min-height: 220px;
          padding: 22px 14px;
          color: #f2e6cd;
          background:
            linear-gradient(
              145deg,
              rgba(74, 48, 39, 0.8),
              rgba(28, 21, 18, 0.95)
            );
          border:
            1px solid
            rgba(194, 154, 77, 0.35);
          border-radius: 16px;
          cursor: pointer;
          transition: 0.3s;
        }

        .category-card:hover,
        .category-active {
          transform: translateY(-8px);
          border-color: #d2ac5f;
          box-shadow:
            0 15px 35px
            rgba(0, 0, 0, 0.3);
        }

        .category-image {
          width: 85px;
          height: 85px;
          margin: 0 auto 18px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 42px;
          background: #35221c;
          border: 1px solid #94703c;
        }

        .category-card h3 {
          margin: 0 0 7px;
          color: #ead6a4;
        }

        .category-card p {
          margin: 0 0 13px;
          color: #aa9c85;
          font-size: 12px;
        }

        .category-card span {
          color: #cfae65;
          font-size: 11px;
        }

        .menu-result {
          margin-top: 35px;
          padding: 28px;
          border:
            1px solid
            rgba(194, 154, 77, 0.32);
          border-radius: 18px;
          background:
            rgba(28, 21, 18, 0.7);
        }

        .menu-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .menu-result-header h3 {
          margin: 0;
          color: #ead6a4;
          font-size: 30px;
          font-weight: 500;
        }

        .menu-result-header > span {
          color: #cda961;
          font-size: 12px;
        }

        .menu-items-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 16px;
        }

        .menu-item-card {
          display: grid;
          grid-template-columns: 105px 1fr;
          gap: 16px;
          padding: 14px;
          border:
            1px solid
            rgba(194, 154, 77, 0.22);
          border-radius: 14px;
          background: #17110f;
        }

        .menu-item-image {
          width: 105px;
          height: 105px;
          border-radius: 12px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              145deg,
              #5a3a2d,
              #1e1714
            );
          font-size: 42px;
        }

        .menu-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .menu-item-content {
          min-width: 0;
        }

        .menu-item-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .menu-item-top h4 {
          margin: 0;
          color: #ead6a4;
          font-size: 18px;
        }

        .menu-item-top strong {
          color: #d9b86b;
          white-space: nowrap;
        }

        .menu-item-content p {
          color: #a99b84;
          font-size: 12px;
          line-height: 1.6;
        }

        .empty-menu,
        .gallery-empty,
        .reviews-empty {
          padding: 35px;
          text-align: center;
          border:
            1px dashed
            rgba(194, 154, 77, 0.35);
          border-radius: 14px;
          color: #a99b84;
        }

        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 70px;
          background:
            rgba(52, 34, 28, 0.2);
        }

        .about-image {
          min-height: 480px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 25px;
          border:
            1px solid
            rgba(201, 165, 90, 0.4);
          background:
            radial-gradient(
              circle at center,
              #744b38,
              #241815 65%
            );
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .about-placeholder {
          width: 230px;
          height: 230px;
          border-radius: 50%;
          border: 2px solid #c6a15a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ead59d;
          background: #211614;
          box-shadow:
            0 0 0 20px
            rgba(198, 161, 90, 0.05);
        }

        .about-placeholder span {
          font-size: 50px;
        }

        .about-placeholder strong {
          letter-spacing: 4px;
          font-size: 22px;
        }

        .about-placeholder small {
          letter-spacing: 3px;
        }

        .about-video-link {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: #f3dfaa;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #c6a15a;
          background: rgba(20, 12, 9, 0.85);
        }

        .about-content .primary-btn {
          display: inline-block;
          margin-top: 20px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          grid-auto-rows: 190px;
          gap: 15px;
        }

        .gallery-card {
          overflow: hidden;
          display: grid;
          place-items: center;
          border-radius: 15px;
          border:
            1px solid
            rgba(198, 161, 90, 0.35);
          background:
            linear-gradient(
              145deg,
              #5a3a2d,
              #1e1714
            );
          transition: 0.3s;
        }

        .gallery-card:hover {
          transform: scale(1.02);
          border-color: #d5b36c;
        }

        .gallery-card.large {
          grid-column: span 2;
        }

        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .booking-section {
          background:
            radial-gradient(
              circle at center,
              rgba(116, 75, 56, 0.25),
              transparent 50%
            );
        }

        .booking-form {
          max-width: 950px;
          margin: auto;
          padding: 35px;
          border-radius: 20px;
          border:
            1px solid
            rgba(199, 163, 88, 0.4);
          background:
            rgba(35, 25, 21, 0.9);
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 18px;
        }

        .booking-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #d6c59f;
          font-size: 12px;
        }

        .booking-form input,
        .booking-form select,
        .booking-form textarea,
        .booking-search input {
          width: 100%;
          padding: 13px;
          color: #f1e4ca;
          background: #15100e;
          border: 1px solid #604b2d;
          border-radius: 9px;
          outline: none;
        }

        .booking-form input:focus,
        .booking-form select:focus,
        .booking-form textarea:focus,
        .booking-search input:focus {
          border-color: #cba65d;
        }

        .submit-btn {
          margin-top: 20px;
          border: 0;
        }

        .booking-success {
          margin-top: 20px;
          padding: 15px 18px;
          border:
            1px solid
            #806331;
          border-radius: 10px;
          background:
            rgba(74, 48, 39, 0.45);
          color: #e5cd91;
          text-align: center;
          line-height: 1.6;
        }

        .manage-booking-wrap {
          text-align: center;
          margin-top: 28px;
        }

        .manage-booking-button {
          padding: 13px 25px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          padding: 20px;
          display: grid;
          place-items: center;
          background:
            rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(8px);
        }

        .booking-manager {
          position: relative;
          width: min(620px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 35px;
          border-radius: 20px;
          border:
            1px solid
            rgba(202, 164, 83, 0.55);
          background:
            #17100d;
          box-shadow:
            0 30px 90px
            rgba(0, 0, 0, 0.65);
        }

        .booking-manager h2 {
          font-size: 42px;
        }

        .booking-manager > p {
          color: #a99b84;
          line-height: 1.6;
        }

        .modal-close {
          position: absolute;
          top: 14px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #765b32;
          background: transparent;
          color: #e4d2a7;
          font-size: 24px;
          cursor: pointer;
        }

        .booking-search {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          margin-top: 25px;
        }

        .manager-message {
          margin-top: 15px;
          padding: 12px;
          border-radius: 9px;
          border: 1px solid #68432e;
          color: #d8b776;
          background:
            rgba(70, 40, 28, 0.35);
        }

        .found-booking {
          display: grid;
          gap: 13px;
          margin-top: 22px;
          padding: 20px;
          border:
            1px solid
            rgba(194, 154, 77, 0.3);
          border-radius: 14px;
          background: #211613;
        }

        .found-booking > div:not(.manager-actions) {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-bottom:
            1px solid
            rgba(194, 154, 77, 0.1);
          padding-bottom: 10px;
        }

        .found-booking span {
          color: #998a72;
          font-size: 12px;
        }

        .found-booking strong {
          color: #e8d7ad;
          text-align: right;
        }

        .manager-actions {
          display: flex;
          gap: 10px;
          padding-top: 10px;
        }

        .danger-btn {
          border: 1px solid #8e3e35;
          background: transparent;
          color: #e7a39b;
          border-radius: 30px;
          padding: 11px 17px;
          cursor: pointer;
        }

        .danger-btn:disabled,
        .secondary-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .reviews-section {
          background:
            rgba(48, 31, 25, 0.2);
        }

        .reviews-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
          max-width: 1050px;
          margin: auto;
        }

        .review-card {
          padding: 30px;
          border-radius: 17px;
          border:
            1px solid
            rgba(195, 158, 83, 0.3);
          background: #1c1512;
        }

        .stars {
          color: #d7b15f;
          letter-spacing: 3px;
          margin-bottom: 18px;
        }

        .stars span {
          color: #6f5c3d;
        }

        .review-card p {
          color: #c8bba4;
          line-height: 1.7;
        }

        .review-card strong {
          display: block;
          color: #ead7a4;
          margin-top: 20px;
        }

        .review-card > small {
          display: block;
          color: #897b68;
          margin-top: 5px;
        }

        .review-replies {
          margin-top: 18px;
          padding-left: 14px;
          border-left:
            2px solid
            rgba(202, 164, 83, 0.35);
        }

        .review-reply {
          margin-top: 12px;
        }

        .review-reply b {
          color: #d6b568;
          font-size: 11px;
        }

        .review-reply p {
          margin: 5px 0 0;
          font-size: 12px;
        }

        .center {
          text-align: center;
          margin-top: 35px;
        }

        .contact-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .contact-list {
          display: grid;
          gap: 13px;
          margin-top: 25px;
        }

        .contact-list a {
          color: #dfcfaa;
          text-decoration: none;
          padding: 16px;
          border:
            1px solid
            rgba(195, 158, 83, 0.2);
          border-radius: 12px;
          background:
            rgba(50, 33, 27, 0.3);
        }

        .map-box {
          min-height: 350px;
          border-radius: 20px;
          border:
            1px solid
            rgba(200, 164, 86, 0.4);
          display: grid;
          place-items: center;
          text-align: center;
          background:
            radial-gradient(
              circle,
              #503429,
              #1c1512 65%
            );
        }

        .map-box span {
          display: block;
          font-size: 50px;
        }

        .map-box strong {
          display: block;
          color: #e6d29b;
          font-size: 30px;
          margin: 10px;
        }

        .map-box small {
          display: block;
          color: #ad9c7e;
        }

        .map-box a {
          display: inline-block;
          margin-top: 20px;
          color: #d5b269;
        }

        .opening-section {
          padding: 80px 8%;
          border-top:
            1px solid
            rgba(203, 163, 78, 0.13);
        }

        .opening-grid {
          max-width: 1000px;
          margin: auto;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
        }

        .opening-card {
          padding: 18px;
          border:
            1px solid
            rgba(195, 158, 83, 0.25);
          border-radius: 13px;
          background: #1c1512;
        }

        .opening-card strong {
          display: block;
          color: #e5d19b;
          margin-bottom: 8px;
        }

        .opening-card span {
          display: block;
          color: #bdaE95;
          font-size: 12px;
        }

        .opening-card small {
          display: block;
          color: #8c7e68;
          margin-top: 5px;
        }

        .social-section {
          padding: 55px 8%;
          text-align: center;
          border-top:
            1px solid
            rgba(203, 163, 78, 0.13);
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .social-links a {
          color: #e2d1a6;
          text-decoration: none;
          padding: 12px 22px;
          border:
            1px solid
            #6c5430;
          border-radius: 30px;
        }

        .footer {
          padding: 35px 8%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top:
            1px solid
            rgba(203, 163, 78, 0.2);
          color: #91836e;
          font-size: 12px;
        }

        .footer-logo {
          color: #dfc27b;
          letter-spacing: 3px;
        }

        .footer p {
          margin: 5px 0 0;
        }

        @media (max-width: 1200px) {

          .nav {
            display: none;
          }

          .category-grid {
            grid-template-columns:
              repeat(4, 1fr);
          }

          .opening-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

        }

        @media (max-width: 950px) {

          .hero {
            grid-template-columns: 1fr;
            padding-top: 65px;
          }

          .about-section,
          .contact-section {
            grid-template-columns: 1fr;
          }

          .category-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .reviews-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .menu-items-grid {
            grid-template-columns: 1fr;
          }

          .opening-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .header {
            flex-wrap: wrap;
          }

          .header-actions {
            margin-left: auto;
          }

          .hero h1 {
            font-size: 55px;
          }

          .quick-info {
            grid-template-columns: 1fr;
          }

          .category-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .gallery-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .opening-grid {
            grid-template-columns: 1fr;
          }

          .footer {
            flex-direction: column;
            text-align: center;
          }

        }

        @media (max-width: 520px) {

          .header {
            padding: 12px 4%;
          }

          .logo {
            min-width: auto;
          }

          .logo strong {
            font-size: 16px;
          }

          .order-btn {
            display: none;
          }

          .admin-btn {
            padding: 9px 10px;
          }

          .hero,
          .section {
            padding-left: 5%;
            padding-right: 5%;
          }

          .hero h1 {
            font-size: 46px;
          }

          .category-grid {
            grid-template-columns: 1fr;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .gallery-card.large {
            grid-column: span 1;
          }

          .booking-form {
            padding: 20px;
          }

          .booking-search {
            grid-template-columns: 1fr;
          }

          .manager-actions {
            flex-direction: column;
          }

          .breaking-news {
            left: 12px;
            top: 96px;
            width:
              calc(100vw - 24px);
          }

          .menu-result {
            padding: 18px;
          }

          .menu-item-card {
            grid-template-columns: 80px 1fr;
          }

          .menu-item-image {
            width: 80px;
            height: 80px;
          }

          .menu-item-top {
            flex-direction: column;
            gap: 5px;
          }

        }

      `}</style>

    </main>
  );
}
