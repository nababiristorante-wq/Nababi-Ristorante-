"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "it" | "en" | "bn";

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  menu: string;
  note: string;
};

type Reservation = {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  menu: string;
  note: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: string;
};

type Review = {
  id: string;
  customerName: string;
  phone?: string;
  email?: string;
  rating: number;
  review: string;
  image?: string;
  date?: string;
  visible?: boolean;
  replies?: {
    id: string;
    text: string;
    date: string;
  }[];
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

type AboutData = {
  content?: string;
  text?: string;
  image?: string;
  imageUrl?: string;
  visible?: boolean;
};

type HomeData = {
  heroTitle?: string;
  heroSubtitle?: string;
  welcomeText?: string;
  heroImage?: string;
  bookingTitle?: string;
  bookingText?: string;
  visible?: boolean;
};

type NewsItem = {
  id?: string | number;
  text?: string;
  title?: string;
  visible?: boolean;
  startDate?: string;
  endDate?: string;
};

type Promotion = {
  id?: string | number;
  title?: string;
  description?: string;
  offer?: string;
  image?: string;
  visible?: boolean;
  startDate?: string;
  endDate?: string;
};

type ContactData = {
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

type SocialData = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  visible?: boolean;
};

type OpeningDay = {
  day: string;
  open: boolean;
  opening?: string;
  closing?: string;
  breakEnabled?: boolean;
  breakStart?: string;
  breakEnd?: string;
};

const translations = {
  it: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contatti",
    order: "Prenota Ora",
    admin: "Admin",
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
    galleryTitle: "La Nostra Gallery",
    galleryText:
      "Un viaggio attraverso i nostri piatti, il nostro ambiente e i momenti speciali.",
    bookingTitle: "Prenota un Tavolo",
    bookingText:
      "Prenota il tuo tavolo e vivi un'esperienza autentica da Nababi Ristorante.",
    name: "Nome",
    email: "Email",
    bookingPhone: "Telefono",
    date: "Data",
    time: "Orario",
    guests: "Numero di persone",
    food: "Menu / Piatti desiderati",
    note: "Richiesta speciale",
    confirm: "Conferma Prenotazione",
    bookingSuccess:
      "Prenotazione ricevuta! Conserva il codice della prenotazione.",
    reviewsTitle: "Cosa Dicono i Nostri Clienti",
    reviewButton: "Scrivi una Recensione",
    contactTitle: "Contatti",
    contactText:
      "Siamo a tua disposizione. Contattaci per informazioni, prenotazioni e richieste.",
    follow: "Seguici sui Social",
    manageBooking: "Gestisci Prenotazione",
    bookingCode: "Codice prenotazione",
    findBooking: "Cerca Prenotazione",
    cancelBooking: "Cancella Prenotazione",
    editBooking: "Modifica Prenotazione",
    close: "Chiudi",
    galleryOpen: "Apri Gallery",
    openingHours: "Orari di Apertura",
    menuItems: "Piatti",
    available: "Disponibile",
    unavailable: "Non disponibile",
    noItems: "Nessun piatto disponibile in questa categoria.",
    all: "Tutti",
    footer: "© 2026 Nababi Ristorante. Tutti i diritti riservati.",
  },

  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    order: "Book Now",
    admin: "Admin",
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
    galleryTitle: "Our Gallery",
    galleryText:
      "A journey through our dishes, our restaurant and special moments.",
    bookingTitle: "Book a Table",
    bookingText:
      "Book your table and enjoy an authentic experience at Nababi Ristorante.",
    name: "Name",
    email: "Email",
    bookingPhone: "Phone",
    date: "Date",
    time: "Time",
    guests: "Number of guests",
    food: "Menu / Desired dishes",
    note: "Special request",
    confirm: "Confirm Booking",
    bookingSuccess:
      "Booking received! Keep your booking code.",
    reviewsTitle: "What Our Customers Say",
    reviewButton: "Write a Review",
    contactTitle: "Contact",
    contactText:
      "We are here for you. Contact us for information, reservations and requests.",
    follow: "Follow Us",
    manageBooking: "Manage Booking",
    bookingCode: "Booking code",
    findBooking: "Find Booking",
    cancelBooking: "Cancel Booking",
    editBooking: "Edit Booking",
    close: "Close",
    galleryOpen: "Open Gallery",
    openingHours: "Opening Hours",
    menuItems: "Dishes",
    available: "Available",
    unavailable: "Unavailable",
    noItems: "No dishes available in this category.",
    all: "All",
    footer: "© 2026 Nababi Ristorante. All rights reserved.",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    order: "বুক করুন",
    admin: "অ্যাডমিন",
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
    galleryTitle: "আমাদের গ্যালারি",
    galleryText:
      "আমাদের খাবার, রেস্টুরেন্ট এবং বিশেষ মুহূর্তগুলোর একটি সুন্দর ভ্রমণ।",
    bookingTitle: "টেবিল বুক করুন",
    bookingText:
      "আপনার টেবিল বুক করুন এবং Nababi Ristorante-এ একটি বিশেষ অভিজ্ঞতা উপভোগ করুন।",
    name: "নাম",
    email: "ইমেইল",
    bookingPhone: "ফোন",
    date: "তারিখ",
    time: "সময়",
    guests: "কতজন",
    food: "মেনু / পছন্দের খাবার",
    note: "বিশেষ অনুরোধ",
    confirm: "বুকিং নিশ্চিত করুন",
    bookingSuccess:
      "বুকিং গ্রহণ করা হয়েছে! আপনার বুকিং কোডটি সংরক্ষণ করুন।",
    reviewsTitle: "আমাদের কাস্টমাররা কী বলেন",
    reviewButton: "রিভিউ লিখুন",
    contactTitle: "যোগাযোগ",
    contactText:
      "তথ্য, বুকিং ও অন্যান্য বিষয়ে আমাদের সাথে যোগাযোগ করুন।",
    follow: "সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন",
    manageBooking: "বুকিং পরিচালনা করুন",
    bookingCode: "বুকিং কোড",
    findBooking: "বুকিং খুঁজুন",
    cancelBooking: "বুকিং বাতিল করুন",
    editBooking: "বুকিং পরিবর্তন করুন",
    close: "বন্ধ করুন",
    galleryOpen: "গ্যালারি খুলুন",
    openingHours: "খোলার সময়",
    menuItems: "খাবার",
    available: "উপলব্ধ",
    unavailable: "অনুপলব্ধ",
    noItems: "এই ক্যাটাগরিতে কোনো খাবার নেই।",
    all: "সব",
    footer: "© 2026 Nababi Ristorante. সর্বস্বত্ব সংরক্ষিত।",
  },
};

const emptyBookingForm: BookingForm = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  menu: "",
  note: "",
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);

    if (!raw) return fallback;

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value;

  if (typeof value === "number") return String(value);

  return "";
}

function getMenuName(item: MenuItem) {
  return normalizeText(item.name || item.title);
}

function getMenuCategory(item: MenuItem) {
  return normalizeText(item.category || item.categoryName);
}

function getMenuImage(item: MenuItem) {
  return normalizeText(item.image || item.imageUrl);
}

function getGalleryImage(item: GalleryItem) {
  return normalizeText(item.image || item.imageUrl);
}

function createBookingCode() {
  return `NAB-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}-${Date.now().toString().slice(-4)}`;
}

function isWithinNewsDate(item: NewsItem) {
  if (!item.visible) return false;

  const now = new Date();

  if (item.startDate) {
    const start = new Date(item.startDate);

    if (!Number.isNaN(start.getTime()) && now < start) {
      return false;
    }
  }

  if (item.endDate) {
    const end = new Date(item.endDate);

    if (!Number.isNaN(end.getTime()) && now > end) {
      return false;
    }
  }

  return true;
}

function isWithinPromotionDate(item: Promotion) {
  if (!item.visible) return false;

  const now = new Date();

  if (item.startDate) {
    const start = new Date(item.startDate);

    if (!Number.isNaN(start.getTime()) && now < start) {
      return false;
    }
  }

  if (item.endDate) {
    const end = new Date(item.endDate);

    if (!Number.isNaN(end.getTime()) && now > end) {
      return false;
    }
  }

  return true;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("it");

  const [homeData, setHomeData] = useState<HomeData>({});
  const [aboutData, setAboutData] = useState<AboutData>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contactData, setContactData] = useState<ContactData>({});
  const [socialData, setSocialData] = useState<SocialData>({});
  const [openingHours, setOpeningHours] = useState<OpeningDay[]>([]);
  const [logo, setLogo] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [bookingForm, setBookingForm] =
    useState<BookingForm>(emptyBookingForm);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastBookingCode, setLastBookingCode] = useState("");

  const [showBookingManager, setShowBookingManager] =
    useState(false);

  const [bookingSearch, setBookingSearch] = useState("");
  const [foundBooking, setFoundBooking] =
    useState<Reservation | null>(null);

  const [showGallery, setShowGallery] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);

  const [reviewName, setReviewName] = useState("");
  const [reviewPhone, setReviewPhone] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [showNews, setShowNews] = useState(true);

  const t = translations[language];

  useEffect(() => {
    const loadData = () => {
      setHomeData(
        readStorage<HomeData>("nababi-home-settings", {})
      );

      setAboutData(
        readStorage<AboutData>("nababi-about", {})
      );

      setMenuItems(
        readStorage<MenuItem[]>("nababi-menu", [])
      );

      setGalleryItems(
        readStorage<GalleryItem[]>("nababi-gallery", [])
      );

      setNewsItems(
        readStorage<NewsItem[]>(
          "nababi-breaking-news",
          []
        )
      );

      setPromotions(
        readStorage<Promotion[]>(
          "nababi-promotions",
          []
        )
      );

      setReviews(
        readStorage<Review[]>("nababi-reviews", [])
      );

      setContactData(
        readStorage<ContactData>(
          "nababi-contact",
          {}
        )
      );

      setSocialData(
        readStorage<SocialData>(
          "nababi-social-media",
          {}
        )
      );

      setOpeningHours(
        readStorage<OpeningDay[]>(
          "nababi-opening-hours",
          []
        )
      );

      setLogo(
        readStorage<string>(
          "nababi-logo",
          ""
        )
      );
    };

    loadData();

    const handleStorage = () => loadData();

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

  const activeNews = useMemo(
    () =>
      newsItems.find((item) =>
        isWithinNewsDate(item)
      ),
    [newsItems]
  );

  const activePromotion = useMemo(
    () =>
      promotions.find((item) =>
        isWithinPromotionDate(item)
      ),
    [promotions]
  );

  const categories = useMemo(() => {
    const names = menuItems
      .map((item) => getMenuCategory(item))
      .filter(Boolean);

    return Array.from(
      new Set(names)
    );
  }, [menuItems]);

  const visibleMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const available =
        item.available ??
        item.availability ??
        true;

      if (!available) return false;

      if (!selectedCategory) return true;

      return (
        getMenuCategory(item) ===
        selectedCategory
      );
    });
  }, [menuItems, selectedCategory]);

  const visibleGallery = useMemo(() => {
    return [...galleryItems]
      .filter((item) => {
        if (
          item.visible === false ||
          item.show === false
        ) {
          return false;
        }

        return Boolean(
          getGalleryImage(item)
        );
      })
      .sort(
        (a, b) =>
          Number(a.displayOrder || 0) -
          Number(b.displayOrder || 0)
      );
  }, [galleryItems]);

  const visibleReviews = useMemo(() => {
    return reviews.filter(
      (review) =>
        review.visible !== false
    );
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (!visibleReviews.length) return 0;

    const total = visibleReviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return total / visibleReviews.length;
  }, [visibleReviews]);

  const heroTitle =
    homeData.heroTitle ||
    t.heroTitle;

  const heroText =
    homeData.heroSubtitle ||
    homeData.welcomeText ||
    t.heroText;

  const heroImage =
    homeData.heroImage || "";

  const aboutText =
    aboutData.content ||
    aboutData.text ||
    "";

  const aboutImage =
    aboutData.image ||
    aboutData.imageUrl ||
    "";

  const restaurantAddress =
    contactData.address ||
    t.address;

  const restaurantPhone =
    contactData.phone ||
    "+39 393 3805350";

  const restaurantWhatsapp =
    contactData.whatsapp ||
    "+39 333 7687319";

  const mapsUrl =
    contactData.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77+Roma";

  const updateBookingField = (
    field: keyof BookingForm,
    value: string
  ) => {
    setBookingSuccess(false);

    setBookingForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleBookingSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const code = createBookingCode();

    const newReservation: Reservation = {
      id: Date.now().toString(),
      code,
      name: bookingForm.name.trim(),
      email: bookingForm.email.trim(),
      phone: bookingForm.phone.trim(),
      date: bookingForm.date,
      time: bookingForm.time,
      guests: Number(bookingForm.guests),
      menu: bookingForm.menu.trim(),
      note: bookingForm.note.trim(),
      status: "Pending",
      createdAt:
        new Date().toISOString(),
    };

    const existing =
      readStorage<Reservation[]>(
        "nababi-reservations",
        []
      );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify([
        ...existing,
        newReservation,
      ])
    );

    setLastBookingCode(code);
    setBookingForm(emptyBookingForm);
    setBookingSuccess(true);

    window.scrollTo({
      top:
        document.getElementById(
          "booking"
        )?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const findBooking = () => {
    const query =
      bookingSearch.trim().toLowerCase();

    if (!query) {
      setFoundBooking(null);
      return;
    }

    const reservations =
      readStorage<Reservation[]>(
        "nababi-reservations",
        []
      );

    const found = reservations.find(
      (reservation) =>
        reservation.code
          ?.toLowerCase() === query ||
        reservation.phone
          ?.toLowerCase() === query ||
        reservation.email
          ?.toLowerCase() === query
    );

    setFoundBooking(found || null);
  };

  const cancelFoundBooking = () => {
    if (!foundBooking) return;

    const reservations =
      readStorage<Reservation[]>(
        "nababi-reservations",
        []
      );

    const updated =
      reservations.map(
        (reservation) =>
          reservation.id ===
          foundBooking.id
            ? {
                ...reservation,
                status: "Cancelled" as const,
              }
            : reservation
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

  const updateFoundBooking = (
    field: keyof Reservation,
    value: string | number
  ) => {
    if (!foundBooking) return;

    const updatedBooking = {
      ...foundBooking,
      [field]: value,
    } as Reservation;

    const reservations =
      readStorage<Reservation[]>(
        "nababi-reservations",
        []
      );

    const updated =
      reservations.map(
        (reservation) =>
          reservation.id ===
          foundBooking.id
            ? updatedBooking
            : reservation
      );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify(updated)
    );

    setFoundBooking(updatedBooking);
  };

  const submitReview = () => {
    if (
      !reviewName.trim() ||
      !reviewText.trim()
    ) {
      alert(
        "Please enter your name and review."
      );
      return;
    }

    const current =
      readStorage<Review[]>(
        "nababi-reviews",
        []
      );

    const newReview: Review = {
      id: Date.now().toString(),
      customerName:
        reviewName.trim(),
      phone:
        reviewPhone.trim(),
      email:
        reviewEmail.trim(),
      rating: reviewRating,
      review:
        reviewText.trim(),
      date:
        new Date().toISOString(),
      visible: true,
      replies: [],
    };

    localStorage.setItem(
      "nababi-reviews",
      JSON.stringify([
        ...current,
        newReview,
      ])
    );

    setReviews([
      ...current,
      newReview,
    ]);

    setReviewName("");
    setReviewPhone("");
    setReviewEmail("");
    setReviewRating(5);
    setReviewText("");
    setShowReviewForm(false);
  };

  return (
    <main className="site">

      {/* HEADER */}
      <header className="header">

        <a href="#home" className="logo">

          {logo ? (
            <img
              src={logo}
              alt="Nababi Ristorante"
              className="logo-image"
            />
          ) : (
            <span className="logo-crown">
              ♛
            </span>
          )}

          <span>
            <strong>NABABI</strong>
            <small>RISTORANTE</small>
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

          <a
            href="#gallery"
            onClick={() =>
              setShowGallery(true)
            }
          >
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

          <button
            type="button"
            className="manage-btn"
            onClick={() =>
              setShowBookingManager(true)
            }
          >
            📋
            <span>
              {t.manageBooking}
            </span>
          </button>

          <a
            href="/admin"
            className="admin-btn"
          >
            🔒 {t.admin}
          </a>

          <select
            className="language"
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value as Language
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

      {/* BREAKING NEWS */}
      {activeNews && showNews && (
        <div className="breaking-news">
          <div>
            <span className="breaking-label">
              BREAKING NEWS
            </span>

            <strong>
              {activeNews.text ||
                activeNews.title}
            </strong>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowNews(false)
            }
          >
            ×
          </button>
        </div>
      )}

      {/* HERO */}
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
            {heroText}
          </p>

          {activePromotion && (
            <div className="promotion-box">

              <span>
                SPECIAL OFFER
              </span>

              <strong>
                {activePromotion.title}
              </strong>

              {activePromotion.offer && (
                <small>
                  {activePromotion.offer}
                </small>
              )}

            </div>
          )}

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
                {restaurantAddress}
              </strong>
            </div>

            <div>
              <span>☎</span>
              <small>
                {t.phone}
              </small>
              <strong>
                {restaurantPhone}
              </strong>
            </div>

            <div>
              <span>💬</span>
              <small>
                {t.whatsapp}
              </small>
              <strong>
                {restaurantWhatsapp}
              </strong>
            </div>

          </div>

        </div>

        <div className="hero-art">

          <div className="royal-circle">

            {heroImage ? (
              <img
                src={heroImage}
                alt="Nababi special dish"
                className="hero-food-image"
              />
            ) : (
              <div className="food-circle">
                🍛
              </div>
            )}

          </div>

          <div className="hero-art-buttons">

            <button type="button">
              ▶ {t.watch}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowGallery(true)
              }
            >
              ▣ {t.galleryOpen}
            </button>

          </div>

        </div>

      </section>

      {/* SPECIALITIES / MENU */}
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

          {categories.length > 0 ? (
            <>
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
                  {t.menuItems}
                </p>

                <span>
                  View Menu →
                </span>
              </button>

              {categories.map(
                (category, index) => (
                  <button
                    type="button"
                    key={`${category}-${index}`}
                    className={`category-card ${
                      selectedCategory ===
                      category
                        ? "category-active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                  >

                    <div className="category-image">
                      {index === 0
                        ? "🍛"
                        : index === 1
                        ? "🍗"
                        : index === 2
                        ? "🥩"
                        : index === 3
                        ? "🍕"
                        : index === 4
                        ? "🥗"
                        : index === 5
                        ? "🥤"
                        : "🍽️"}
                    </div>

                    <h3>
                      {category}
                    </h3>

                    <p>
                      NABABI
                    </p>

                    <span>
                      View Menu →
                    </span>

                  </button>
                )
              )}
            </>
          ) : (
            <div className="empty-data">
              {t.noItems}
            </div>
          )}

        </div>

        <div className="menu-items-area">

          <div className="menu-area-heading">

            <div>
              <p className="eyebrow">
                {selectedCategory ||
                  t.all}
              </p>

              <h3>
                {t.menuItems}
              </h3>
            </div>

            <span>
              {
                visibleMenuItems.length
              }{" "}
              items
            </span>

          </div>

          {visibleMenuItems.length > 0 ? (
            <div className="menu-items-grid">

              {visibleMenuItems.map(
                (item, index) => {

                  const image =
                    getMenuImage(item);

                  const name =
                    getMenuName(item) ||
                    `Dish ${index + 1}`;

                  return (
                    <div
                      className="menu-item-card"
                      key={`menu-${String(
                        item.id ||
                          name
                      )}-${index}`}
                    >

                      <div className="menu-item-image">

                        {image ? (
                          <img
                            src={image}
                            alt={name}
                          />
                        ) : (
                          <span>
                            🍛
                          </span>
                        )}

                      </div>

                      <div className="menu-item-info">

                        <h4>
                          {name}
                        </h4>

                        {item.description && (
                          <p>
                            {
                              item.description
                            }
                          </p>
                        )}

                        <div className="menu-price">

                          <strong>
                            {item.price !==
                            undefined
                              ? `${item.price}`
                              : "—"}
                          </strong>

                          <span>
                            {t.available}
                          </span>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="no-menu-items">
              {t.noItems}
            </div>
          )}

        </div>

      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="section about-section"
      >

        <div className="about-image">

          {aboutImage ? (
            <img
              src={aboutImage}
              alt="Nababi Ristorante"
              className="about-real-image"
            />
          ) : (
            <div className="about-placeholder">

              <span>👑</span>

              <strong>
                NABABI
              </strong>

              <small>
                RISTORANTE
              </small>

            </div>
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
            {aboutText ||
              "Nababi Ristorante porta nel cuore di Roma le ricche tradizioni culinarie dell'India e del Bangladesh."}
          </p>

          <a
            href="#contact"
            className="primary-btn"
          >
            {t.contact} →
          </a>

        </div>

      </section>

      {/* GALLERY */}
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

        <div className="gallery-preview-grid">

          {visibleGallery.length > 0 ? (
            visibleGallery
              .slice(0, 6)
              .map((item, index) => {

                const image =
                  getGalleryImage(item);

                return (
                  <button
                    type="button"
                    key={`gallery-${String(
                      item.id ||
                        index
                    )}`}
                    className={`gallery-card ${
                      index === 0 ||
                      index === 5
                        ? "large"
                        : ""
                    }`}
                    onClick={() =>
                      setShowGallery(true)
                    }
                  >
                    <img
                      src={image}
                      alt={
                        item.title ||
                        "Nababi Gallery"
                      }
                    />
                  </button>
                );
              })
          ) : (
            <div className="gallery-empty">
              <span>🍛</span>
              <p>
                Gallery images can be
                added from Admin Gallery.
              </p>
            </div>
          )}

        </div>

        <div className="center">
          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              setShowGallery(true)
            }
          >
            ▣ {t.galleryOpen}
          </button>
        </div>

      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="section booking-section"
      >

        <div className="section-heading">

          <p className="eyebrow">
            RESERVATION
          </p>

          <h2>
            {homeData.bookingTitle ||
              t.bookingTitle}
          </h2>

          <p>
            {homeData.bookingText ||
              t.bookingText}
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
                onChange={(e) =>
                  updateBookingField(
                    "name",
                    e.target.value
                  )
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
                onChange={(e) =>
                  updateBookingField(
                    "email",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              {t.bookingPhone}

              <input
                type="tel"
                required
                placeholder="+39 ..."
                value={
                  bookingForm.phone
                }
                onChange={(e) =>
                  updateBookingField(
                    "phone",
                    e.target.value
                  )
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
                onChange={(e) =>
                  updateBookingField(
                    "date",
                    e.target.value
                  )
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
                onChange={(e) =>
                  updateBookingField(
                    "time",
                    e.target.value
                  )
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
                onChange={(e) =>
                  updateBookingField(
                    "guests",
                    e.target.value
                  )
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

            <label className="full-field">
              {t.food}

              <input
                type="text"
                placeholder={
                  t.food
                }
                value={
                  bookingForm.menu
                }
                onChange={(e) =>
                  updateBookingField(
                    "menu",
                    e.target.value
                  )
                }
              />
            </label>

          </div>

          <label>
            {t.note}

            <textarea
              rows={5}
              value={
                bookingForm.note
              }
              onChange={(e) =>
                updateBookingField(
                  "note",
                  e.target.value
                )
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

              <strong>
                ✓ {t.bookingSuccess}
              </strong>

              <span>
                {t.bookingCode}:{" "}
                <b>
                  {lastBookingCode}
                </b>
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowBookingManager(
                    true
                  )
                }
              >
                {t.manageBooking}
              </button>

            </div>
          )}

        </form>

      </section>

      {/* OPENING HOURS */}
      {openingHours.length > 0 && (
        <section className="section hours-section">

          <div className="section-heading">

            <p className="eyebrow">
              NABABI RISTORANTE
            </p>

            <h2>
              {t.openingHours}
            </h2>

          </div>

          <div className="hours-grid">

            {openingHours.map(
              (day, index) => (
                <div
                  className="hours-card"
                  key={`${day.day}-${index}`}
                >

                  <strong>
                    {day.day}
                  </strong>

                  {day.open ? (
                    <>
                      <span>
                        {day.opening ||
                          "--:--"}{" "}
                        —{" "}
                        {day.closing ||
                          "--:--"}
                      </span>

                      {day.breakEnabled &&
                        day.breakStart &&
                        day.breakEnd && (
                          <small>
                            Break:{" "}
                            {
                              day.breakStart
                            }{" "}
                            —{" "}
                            {
                              day.breakEnd
                            }
                          </small>
                        )}
                    </>
                  ) : (
                    <span>
                      Closed
                    </span>
                  )}

                </div>
              )
            )}

          </div>

        </section>
      )}

      {/* REVIEWS */}
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

          {visibleReviews.length >
            0 && (
            <div className="rating-summary">
              <strong>
                {averageRating.toFixed(
                  1
                )}
              </strong>

              <span>
                {"★".repeat(
                  Math.round(
                    averageRating
                  )
                )}
              </span>

              <small>
                {
                  visibleReviews.length
                }{" "}
                reviews
              </small>
            </div>
          )}

        </div>

        {visibleReviews.length >
        0 ? (
          <div className="reviews-grid">

            {visibleReviews
              .slice()
              .sort(
                (a, b) =>
                  new Date(
                    a.date ||
                      0
                  ).getTime() -
                  new Date(
                    b.date ||
                      0
                  ).getTime()
              )
              .map(
                (review, index) => (
                  <div
                    className="review-card"
                    key={`${review.id || review.customerName}-${index}`}
                  >

                    <div className="stars">
                      {"★".repeat(
                        Number(
                          review.rating ||
                            0
                        )
                      )}
                    </div>

                    <p>
                      “
                      {
                        review.review
                      }
                      ”
                    </p>

                    <strong>
                      {
                        review.customerName
                      }
                    </strong>

                    <small>
                      {review.date
                        ? new Date(
                            review.date
                          ).toLocaleDateString()
                        : "Customer"}
                    </small>

                    {review.replies &&
                      review.replies
                        .length >
                        0 && (
                        <div className="review-replies">

                          {review.replies
                            .slice()
                            .sort(
                              (
                                a,
                                b
                              ) =>
                                new Date(
                                  a.date
                                ).getTime() -
                                new Date(
                                  b.date
                                ).getTime()
                            )
                            .map(
                              (
                                reply
                              ) => (
                                <div
                                  className="review-reply"
                                  key={
                                    reply.id
                                  }
                                >
                                  <span>
                                    Nababi
                                  </span>

                                  <p>
                                    {
                                      reply.text
                                    }
                                  </p>
                                </div>
                              )
                            )}

                        </div>
                      )}

                  </div>
                )
              )}

          </div>
        ) : (
          <div className="no-reviews">
            No reviews yet.
          </div>
        )}

        <div className="center">

          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              setShowReviewForm(
                !showReviewForm
              )
            }
          >
            ✦ {t.reviewButton}
          </button>

        </div>

        {showReviewForm && (
          <div className="review-form">

            <h3>
              {t.reviewButton}
            </h3>

            <div className="form-grid">

              <input
                placeholder={
                  t.name
                }
                value={
                  reviewName
                }
                onChange={(e) =>
                  setReviewName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder={
                  t.bookingPhone
                }
                value={
                  reviewPhone
                }
                onChange={(e) =>
                  setReviewPhone(
                    e.target.value
                  )
                }
              />

              <input
                placeholder={
                  t.email
                }
                value={
                  reviewEmail
                }
                onChange={(e) =>
                  setReviewEmail(
                    e.target.value
                  )
                }
              />

              <select
                value={
                  reviewRating
                }
                onChange={(e) =>
                  setReviewRating(
                    Number(
                      e.target.value
                    )
                  )
                }
              >
                <option value="5">
                  ★★★★★
                </option>
                <option value="4">
                  ★★★★☆
                </option>
                <option value="3">
                  ★★★☆☆
                </option>
                <option value="2">
                  ★★☆☆☆
                </option>
                <option value="1">
                  ★☆☆☆☆
                </option>
              </select>

            </div>

            <textarea
              rows={5}
              placeholder="Write your review..."
              value={
                reviewText
              }
              onChange={(e) =>
                setReviewText(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              className="primary-btn"
              onClick={
                submitReview
              }
            >
              Submit Review
            </button>

          </div>
        )}

      </section>

      {/* CONTACT */}
      {contactData.visible !==
        false && (
        <section
          id="contact"
          className="section contact-section"
        >

          <div className="contact-content">

            <p className="eyebrow">
              NABABI RISTORANTE
            </p>

            <h2>
              {contactData.contactTitle ||
                t.contactTitle}
            </h2>

            <p>
              {contactData.contactText ||
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
                  {restaurantAddress}
                </span>
              </a>

              <a
                href={`tel:${restaurantPhone.replace(
                  /\s/g,
                  ""
                )}`}
              >
                ☎{" "}
                <span>
                  {restaurantPhone}
                </span>
              </a>

              <a
                href={`https://wa.me/${restaurantWhatsapp.replace(
                  /[^\d]/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                💬{" "}
                <span>
                  WhatsApp{" "}
                  {restaurantWhatsapp}
                </span>
              </a>

              {contactData.email && (
                <a
                  href={`mailto:${contactData.email}`}
                >
                  ✉{" "}
                  <span>
                    {
                      contactData.email
                    }
                  </span>
                </a>
              )}

            </div>

          </div>

          <div className="map-box">

            <div>

              <span>📍</span>

              <strong>
                Roma
              </strong>

              <small>
                {restaurantAddress}
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
      )}

      {/* SOCIAL */}
      {socialData.visible !==
        false && (
        <section className="social-section">

          <p className="eyebrow">
            {t.follow}
          </p>

          <div className="social-links">

            {socialData.facebook && (
              <a
                href={
                  socialData.facebook
                }
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            )}

            {socialData.instagram && (
              <a
                href={
                  socialData.instagram
                }
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}

            {socialData.tiktok && (
              <a
                href={
                  socialData.tiktok
                }
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>
            )}

            {socialData.youtube && (
              <a
                href={
                  socialData.youtube
                }
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            )}

            {!socialData.facebook &&
              !socialData.instagram &&
              !socialData.tiktok &&
              !socialData.youtube && (
                <>
                  <a
                    href="#contact"
                  >
                    Facebook
                  </a>

                  <a
                    href="#contact"
                  >
                    TikTok
                  </a>
                </>
              )}

          </div>

        </section>
      )}

      {/* FOOTER */}
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

      {/* BOOKING MANAGER */}
      {showBookingManager && (
        <div className="modal-overlay">

          <div className="modal-box">

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
              NABABI RESERVATION
            </p>

            <h2>
              {t.manageBooking}
            </h2>

            <p className="modal-description">
              {t.bookingCode}
              {" / "}
              Phone / Email
            </p>

            <div className="manage-search">

              <input
                placeholder={`${t.bookingCode} / Phone / Email`}
                value={
                  bookingSearch
                }
                onChange={(e) =>
                  setBookingSearch(
                    e.target.value
                  )
                }
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

            {foundBooking && (
              <div className="found-booking">

                <div className="booking-code-display">
                  <small>
                    {t.bookingCode}
                  </small>

                  <strong>
                    {
                      foundBooking.code
                    }
                  </strong>
                </div>

                <div className="form-grid">

                  <label>
                    {t.name}

                    <input
                      value={
                        foundBooking.name
                      }
                      onChange={(e) =>
                        updateFoundBooking(
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    {t.bookingPhone}

                    <input
                      value={
                        foundBooking.phone
                      }
                      onChange={(e) =>
                        updateFoundBooking(
                          "phone",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    {t.date}

                    <input
                      type="date"
                      value={
                        foundBooking.date
                      }
                      onChange={(e) =>
                        updateFoundBooking(
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    {t.time}

                    <input
                      type="time"
                      value={
                        foundBooking.time
                      }
                      onChange={(e) =>
                        updateFoundBooking(
                          "time",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    {t.guests}

                    <select
                      value={String(
                        foundBooking.guests
                      )}
                      onChange={(e) =>
                        updateFoundBooking(
                          "guests",
                          Number(
                            e.target.value
                          )
                        )
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
                      value={
                        foundBooking.menu
                      }
                      onChange={(e) =>
                        updateFoundBooking(
                          "menu",
                          e.target.value
                        )
                      }
                    />
                  </label>

                </div>

                <div className="booking-status">
                  Status:{" "}
                  <strong>
                    {
                      foundBooking.status
                    }
                  </strong>
                </div>

                {foundBooking.status !==
                  "Cancelled" && (
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={
                      cancelFoundBooking
                    }
                  >
                    {t.cancelBooking}
                  </button>
                )}

              </div>
            )}

            {bookingSearch &&
              !foundBooking && (
                <div className="not-found">
                  No booking found.
                </div>
              )}

          </div>

        </div>
      )}

      {/* GALLERY MODAL */}
      {showGallery && (
        <div className="modal-overlay">

          <div className="gallery-modal">

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowGallery(
                  false
                )
              }
            >
              ×
            </button>

            <p className="eyebrow">
              NABABI RISTORANTE
            </p>

            <h2>
              {t.galleryTitle}
            </h2>

            {visibleGallery.length >
            0 ? (
              <div className="full-gallery-grid">

                {visibleGallery.map(
                  (item, index) => {

                    const image =
                      getGalleryImage(
                        item
                      );

                    return (
                      <div
                        className="full-gallery-card"
                        key={`full-gallery-${String(
                          item.id ||
                            index
                        )}`}
                      >
                        <img
                          src={image}
                          alt={
                            item.title ||
                            "Nababi Gallery"
                          }
                        />
                      </div>
                    );
                  }
                )}

              </div>
            ) : (
              <div className="gallery-empty large-empty">
                <span>🍛</span>
                <p>
                  Gallery images can
                  be added from
                  Admin Gallery.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STYLE */}
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
          background: rgba(
            16,
            13,
            12,
            0.94
          );
          border-bottom: 1px solid
            rgba(
              202,
              164,
              83,
              0.3
            );
          backdrop-filter: blur(
            14px
          );
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ead49a;
          text-decoration: none;
          min-width: 180px;
        }

        .logo-image {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 10px;
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
          gap: 8px;
        }

        .order-btn,
        .admin-btn,
        .primary-btn,
        .secondary-btn,
        .manage-btn {
          text-decoration: none;
          border-radius: 30px;
          padding: 11px 17px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid
            #c9a55a;
          transition: 0.25s;
        }

        .order-btn,
        .primary-btn {
          color: #17110c;
          background: linear-gradient(
            135deg,
            #f0dfa7,
            #b99045
          );
        }

        .admin-btn,
        .secondary-btn,
        .manage-btn {
          color: #f2dfb0;
          background: transparent;
        }

        .manage-btn {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .order-btn:hover,
        .primary-btn:hover,
        .admin-btn:hover,
        .secondary-btn:hover,
        .manage-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 25px
              rgba(
                201,
                165,
                90,
                0.2
              );
        }

        .language {
          color: #ead9b0;
          background: #211a17;
          border: 1px solid
            #6e5933;
          border-radius: 20px;
          padding: 9px 10px;
        }

        .breaking-news {
          position: fixed;
          left: 22px;
          top: 110px;
          z-index: 45;
          max-width: 390px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          background: rgba(
            30,
            17,
            14,
            0.95
          );
          border: 1px solid
            #bd8d39;
          border-radius: 14px;
          box-shadow:
            0 15px 45px
              rgba(
                0,
                0,
                0,
                0.4
              );
          backdrop-filter: blur(
            14px
          );
        }

        .breaking-news > div {
          display: grid;
          gap: 5px;
        }

        .breaking-label {
          color: #e5b75f;
          font-size: 9px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .breaking-news strong {
          color: #f1dfb0;
          font-size: 13px;
          line-height: 1.5;
        }

        .breaking-news button {
          border: 0;
          background: transparent;
          color: #d6b36c;
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
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
          font-size: clamp(
            55px,
            7vw,
            92px
          );
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

        .promotion-box {
          max-width: 500px;
          padding: 15px 18px;
          margin-bottom: 20px;
          border: 1px solid
            #98743b;
          border-radius: 12px;
          background: rgba(
            82,
            50,
            33,
            0.4
          );
          display: grid;
          gap: 4px;
        }

        .promotion-box span {
          color: #dcb15b;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .promotion-box strong {
          color: #f0ddb0;
        }

        .promotion-box small {
          color: #ad9c82;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 42px;
        }

        .quick-info {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          border-top: 1px solid
            rgba(
              207,
              172,
              94,
              0.3
            );
          padding-top: 22px;
          gap: 18px;
        }

        .quick-info div {
          display: grid;
          grid-template-columns: 25px 1fr;
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
          width: min(
            390px,
            80vw
          );
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 2px solid #aa8140;
          box-shadow:
            0 0 0 16px
              rgba(
                172,
                130,
                64,
                0.08
              ),
            0 0 0 32px
              rgba(
                172,
                130,
                64,
                0.04
              );
          background:
            radial-gradient(
              circle,
              #5d392d 0%,
              #211817 47%,
              #100d0c 70%
            );
        }

        .hero-food-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .food-circle {
          width: 52%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: clamp(
            70px,
            9vw,
            125px
          );
          background:
            radial-gradient(
              circle,
              #d99d51,
              #7c4a31
            );
          border: 12px solid
            #5c3930;
          box-shadow:
            0 15px 35px
              rgba(
                0,
                0,
                0,
                0.45
              );
        }

        .hero-art-buttons {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .hero-art-buttons button {
          color: #e9d9b4;
          background: transparent;
          border: 1px solid
            #9c7a43;
          padding: 10px 15px;
          border-radius: 25px;
          text-decoration: none;
          font-size: 12px;
          cursor: pointer;
        }

        .section {
          padding: 100px 8%;
          border-top: 1px solid
            rgba(
              203,
              163,
              78,
              0.13
            );
        }

        .section-heading {
          max-width: 700px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .section-heading h2,
        .about-content h2,
        .contact-content h2,
        .modal-box h2,
        .gallery-modal h2 {
          font-size: clamp(
            38px,
            5vw,
            60px
          );
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
          grid-template-columns: repeat(
            6,
            1fr
          );
          gap: 16px;
        }

        .category-card {
          min-height: 220px;
          padding: 22px 14px;
          color: #f2e6cd;
          background:
            linear-gradient(
              145deg,
              rgba(
                74,
                48,
                39,
                0.8
              ),
              rgba(
                28,
                21,
                18,
                0.95
              )
            );
          border: 1px solid
            rgba(
              194,
              154,
              77,
              0.35
            );
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
              rgba(
                0,
                0,
                0,
                0.3
              );
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
          border: 1px solid
            #94703c;
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

        .menu-items-area {
          max-width: 1200px;
          margin: 45px auto 0;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid
            rgba(
              194,
              154,
              77,
              0.28
            );
          background: rgba(
            32,
            22,
            18,
            0.65
          );
        }

        .menu-area-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .menu-area-heading h3 {
          margin: 0;
          font-size: 30px;
          color: #ecd9a9;
        }

        .menu-area-heading > span {
          color: #b9954e;
          font-size: 12px;
        }

        .menu-items-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 18px;
        }

        .menu-item-card {
          overflow: hidden;
          border-radius: 15px;
          border: 1px solid
            rgba(
              195,
              158,
              83,
              0.3
            );
          background: #1b1411;
        }

        .menu-item-image {
          height: 190px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              145deg,
              #593a2e,
              #201714
            );
          overflow: hidden;
        }

        .menu-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .menu-item-image span {
          font-size: 70px;
        }

        .menu-item-info {
          padding: 20px;
        }

        .menu-item-info h4 {
          margin: 0 0 8px;
          color: #ecd9a7;
          font-size: 20px;
        }

        .menu-item-info p {
          min-height: 45px;
          margin: 0 0 16px;
          color: #aa9c85;
          font-size: 12px;
          line-height: 1.6;
        }

        .menu-price {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .menu-price strong {
          color: #d9b467;
          font-size: 18px;
        }

        .menu-price span {
          color: #8d806c;
          font-size: 10px;
        }

        .no-menu-items,
        .empty-data,
        .no-reviews {
          padding: 35px;
          text-align: center;
          color: #9e907a;
          border: 1px dashed
            #67512e;
          border-radius: 15px;
        }

        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 70px;
          background: rgba(
            52,
            34,
            28,
            0.2
          );
        }

        .about-image {
          min-height: 480px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 25px;
          border: 1px solid
            rgba(
              201,
              165,
              90,
              0.4
            );
          background:
            radial-gradient(
              circle at center,
              #744b38,
              #241815 65%
            );
        }

        .about-real-image {
          width: 100%;
          height: 100%;
          min-height: 480px;
          object-fit: cover;
        }

        .about-placeholder {
          width: 230px;
          height: 230px;
          border-radius: 50%;
          border: 2px solid
            #c6a15a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ead59d;
          background: #211614;
          box-shadow:
            0 0 0 20px
              rgba(
                198,
                161,
                90,
                0.05
              );
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

        .about-content .primary-btn {
          display: inline-block;
          margin-top: 20px;
        }

        .gallery-preview-grid {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          grid-auto-rows: 190px;
          gap: 15px;
        }

        .gallery-card {
          overflow: hidden;
          border-radius: 15px;
          border: 1px solid
            rgba(
              198,
              161,
              90,
              0.35
            );
          background:
            linear-gradient(
              145deg,
              #5a3a2d,
              #1e1714
            );
          cursor: pointer;
        }

        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.3s;
        }

        .gallery-card:hover img {
          transform: scale(1.05);
        }

        .gallery-card.large {
          grid-column: span 2;
        }

        .gallery-empty {
          grid-column: 1 / -1;
          min-height: 250px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 40px;
          border: 1px dashed
            #71582f;
          border-radius: 16px;
          color: #9d8e77;
        }

        .gallery-empty span {
          font-size: 70px;
        }

        .booking-section {
          background:
            radial-gradient(
              circle at center,
              rgba(
                116,
                75,
                56,
                0.25
              ),
              transparent 50%
            );
        }

        .booking-form,
        .review-form {
          max-width: 900px;
          margin: auto;
          padding: 35px;
          border-radius: 20px;
          border: 1px solid
            rgba(
              199,
              163,
              88,
              0.4
            );
          background: rgba(
            35,
            25,
            21,
            0.9
          );
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .full-field {
          grid-column: 1 / -1;
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
        .review-form input,
        .review-form select,
        .review-form textarea,
        .manage-search input,
        .found-booking input,
        .found-booking select {
          width: 100%;
          padding: 13px;
          color: #f1e4ca;
          background: #15100e;
          border: 1px solid
            #604b2d;
          border-radius: 9px;
          outline: none;
        }

        .booking-form textarea,
        .review-form textarea {
          resize: vertical;
        }

        .booking-form input:focus,
        .booking-form select:focus,
        .booking-form textarea:focus,
        .review-form input:focus,
        .review-form select:focus,
        .review-form textarea:focus {
          border-color: #cba65d;
        }

        .submit-btn {
          margin-top: 20px;
          border: 0;
        }

        .booking-success {
          margin-top: 20px;
          padding: 18px;
          border: 1px solid
            #806331;
          border-radius: 10px;
          background: rgba(
            74,
            48,
            39,
            0.45
          );
          color: #e5cd91;
          display: grid;
          gap: 8px;
          text-align: center;
        }

        .booking-success button {
          border: 0;
          background: transparent;
          color: #d6b66e;
          cursor: pointer;
        }

        .hours-section {
          background: rgba(
            45,
            29,
            24,
            0.16
          );
        }

        .hours-grid {
          max-width: 1000px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 14px;
        }

        .hours-card {
          padding: 20px;
          border: 1px solid
            rgba(
              194,
              154,
              77,
              0.3
            );
          border-radius: 13px;
          background: #1b1411;
          display: grid;
          gap: 8px;
        }

        .hours-card strong {
          color: #e6d29d;
        }

        .hours-card span {
          color: #c3b397;
          font-size: 13px;
        }

        .hours-card small {
          color: #887a67;
          font-size: 10px;
        }

        .reviews-section {
          background: rgba(
            48,
            31,
            25,
            0.2
          );
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 20px;
          max-width: 1050px;
          margin: auto;
        }

        .review-card {
          padding: 30px;
          border-radius: 17px;
          border: 1px solid
            rgba(
              195,
              158,
              83,
              0.3
            );
          background: #1c1512;
        }

        .stars {
          color: #d7b15f;
          letter-spacing: 3px;
          margin-bottom: 18px;
        }

        .review-card p {
          min-height: 75px;
          color: #c8bba4;
          line-height: 1.7;
        }

        .review-card strong {
          display: block;
          color: #ead7a4;
          margin-top: 20px;
        }

        .review-card > small {
          color: #897b68;
        }

        .review-replies {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid
            rgba(
              197,
              158,
              83,
              0.18
            );
          display: grid;
          gap: 12px;
        }

        .review-reply {
          padding: 12px;
          border-radius: 9px;
          background: rgba(
            91,
            61,
            45,
            0.25
          );
        }

        .review-reply span {
          color: #d5b269;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .review-reply p {
          min-height: auto;
          margin: 5px 0 0;
          font-size: 12px;
        }

        .rating-summary {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
        }

        .rating-summary strong {
          font-size: 30px;
          color: #e6c47a;
        }

        .rating-summary span {
          color: #d5ae58;
          letter-spacing: 2px;
        }

        .rating-summary small {
          color: #8e806c;
        }

        .center {
          text-align: center;
          margin-top: 35px;
        }

        .review-form {
          margin-top: 35px;
        }

        .review-form h3 {
          color: #ead7a4;
          margin-top: 0;
        }

        .review-form textarea {
          margin: 0 0 18px;
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
          border: 1px solid
            rgba(
              195,
              158,
              83,
              0.2
            );
          border-radius: 12px;
          background: rgba(
            50,
            33,
            27,
            0.3
          );
        }

        .map-box {
          min-height: 350px;
          border-radius: 20px;
          border: 1px solid
            rgba(
              200,
              164,
              86,
              0.4
            );
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

        .social-section {
          padding: 55px 8%;
          text-align: center;
          border-top: 1px solid
            rgba(
              203,
              163,
              78,
              0.13
            );
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
          border: 1px solid
            #6c5430;
          border-radius: 30px;
        }

        .footer {
          padding: 35px 8%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid
            rgba(
              203,
              163,
              78,
              0.2
            );
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

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          padding: 30px;
          display: grid;
          place-items: center;
          background: rgba(
            0,
            0,
            0,
            0.78
          );
          backdrop-filter: blur(
            8px
          );
          overflow-y: auto;
        }

        .modal-box,
        .gallery-modal {
          position: relative;
          width: min(
            900px,
            100%
          );
          max-height: 90vh;
          overflow-y: auto;
          padding: 40px;
          border: 1px solid
            #8b6938;
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              #2c1d18,
              #120e0c
            );
          box-shadow:
            0 30px 80px
              rgba(
                0,
                0,
                0,
                0.65
              );
        }

        .modal-close {
          position: absolute;
          right: 18px;
          top: 15px;
          border: 0;
          background: transparent;
          color: #d7b36b;
          font-size: 30px;
          cursor: pointer;
        }

        .modal-description {
          color: #a9987d;
        }

        .manage-search {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          margin: 25px 0;
        }

        .found-booking {
          padding: 25px;
          border: 1px solid
            rgba(
              195,
              158,
              83,
              0.35
            );
          border-radius: 15px;
          background: rgba(
            30,
            21,
            17,
            0.8
          );
        }

        .booking-code-display {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: rgba(
            98,
            67,
            45,
            0.3
          );
        }

        .booking-code-display small {
          color: #a99575;
        }

        .booking-code-display strong {
          color: #e8c776;
          letter-spacing: 2px;
          font-size: 22px;
        }

        .booking-status {
          margin: 15px 0;
          color: #bcae96;
        }

        .booking-status strong {
          color: #d9b668;
        }

        .danger-btn {
          padding: 12px 18px;
          border-radius: 25px;
          border: 1px solid
            #9e4e3e;
          color: #efb4a5;
          background: transparent;
          cursor: pointer;
        }

        .not-found {
          padding: 25px;
          text-align: center;
          border: 1px dashed
            #71462f;
          color: #bd9b7a;
          border-radius: 12px;
        }

        .gallery-modal {
          width: min(
            1200px,
            100%
          );
        }

        .full-gallery-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 15px;
        }

        .full-gallery-card {
          height: 240px;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid
            rgba(
              198,
              161,
              90,
              0.35
            );
        }

        .full-gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .large-empty {
          min-height: 350px;
        }

        @media (max-width: 1200px) {
          .nav {
            display: none;
          }

          .category-grid {
            grid-template-columns: repeat(
              3,
              1fr
            );
          }
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 60px;
          }

          .about-section,
          .contact-section {
            grid-template-columns: 1fr;
          }

          .menu-items-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .hours-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .full-gallery-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
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
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .gallery-preview-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .gallery-card.large {
            grid-column: span 2;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .full-field {
            grid-column: auto;
          }

          .manage-search {
            grid-template-columns: 1fr;
          }

          .modal-overlay {
            padding: 12px;
          }

          .modal-box,
          .gallery-modal {
            padding: 25px 18px;
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

          .manage-btn span {
            display: none;
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

          .menu-items-grid {
            grid-template-columns: 1fr;
          }

          .gallery-preview-grid {
            grid-template-columns: 1fr;
          }

          .gallery-card.large {
            grid-column: span 1;
          }

          .full-gallery-grid {
            grid-template-columns: 1fr;
          }

          .booking-form,
          .review-form {
            padding: 20px;
          }

          .breaking-news {
            left: 10px;
            right: 10px;
            top: 105px;
          }

          .hours-grid {
            grid-template-columns: 1fr;
          }

          .footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

    </main>
  );
}
