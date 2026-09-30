"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Language = "it" | "en" | "bn";

type AnyData = Record<string, any>;

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  category: string;
  item: string;
  note: string;
};

const DEFAULT_BIRYANI_IMAGE =
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1600&q=90";

const translations = {
  it: {
    home: "Home",
    about: "Chi siamo",
    menu: "Menu",
    gallery: "Galleria",
    booking: "Prenota",
    reviews: "Recensioni",
    contact: "Contatti",
    bookNow: "Prenota un tavolo",
    viewMenu: "Scopri il menu",
    heroSmall: "BENVENUTI DA NABABI RISTORANTE",
    heroTitle: "Autentico gusto reale",
    heroText:
      "Scopri i veri sapori dell'India e del Bangladesh nel cuore di Roma.",
    aboutTitle: "La nostra storia",
    aboutText:
      "Nababi Ristorante porta nel cuore di Roma le ricche tradizioni culinarie dell'India e del Bangladesh.",
    menuTitle: "Il nostro menu",
    menuText:
      "Scegli una categoria per vedere i nostri piatti.",
    galleryTitle: "La nostra galleria",
    bookingTitle: "Prenota il tuo tavolo",
    bookingText:
      "Compila il modulo e riceveremo immediatamente la tua richiesta.",
    name: "Nome",
    phone: "Telefono",
    email: "Email",
    date: "Data",
    time: "Orario",
    guests: "Numero di persone",
    category: "Categoria",
    item: "Piatti desiderati",
    note: "Richiesta speciale",
    confirm: "Conferma prenotazione",
    cancel: "Cancella",
    reviewsTitle: "Cosa dicono i nostri clienti",
    allReviews: "Tutte le recensioni",
    contactTitle: "Contatti",
    close: "Chiudi",
    gallery: "Galleria",
    follow: "Seguici sui social",
    bookingSuccess: "Prenotazione ricevuta!",
    bookingCode: "Il tuo codice di prenotazione",
    popupClose: "Non mostrare più",
  },

  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    booking: "Booking",
    reviews: "Reviews",
    contact: "Contact",
    bookNow: "Book a table",
    viewMenu: "View menu",
    heroSmall: "WELCOME TO NABABI RISTORANTE",
    heroTitle: "Authentic Royal Taste",
    heroText:
      "Discover the true flavors of India and Bangladesh in the heart of Rome.",
    aboutTitle: "Our Story",
    aboutText:
      "Nababi Ristorante brings the rich culinary traditions of India and Bangladesh to the heart of Rome.",
    menuTitle: "Our Menu",
    menuText: "Choose a category to see our dishes.",
    galleryTitle: "Our Gallery",
    bookingTitle: "Book Your Table",
    bookingText:
      "Complete the form and we will immediately receive your request.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    date: "Date",
    time: "Time",
    guests: "Number of guests",
    category: "Category",
    item: "Desired dishes",
    note: "Special request",
    confirm: "Confirm booking",
    cancel: "Cancel",
    reviewsTitle: "What Our Customers Say",
    allReviews: "All Reviews",
    contactTitle: "Contact",
    close: "Close",
    follow: "Follow us",
    bookingSuccess: "Booking received!",
    bookingCode: "Your booking code",
    popupClose: "Don't show again",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    booking: "বুকিং",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    bookNow: "টেবিল বুক করুন",
    viewMenu: "মেনু দেখুন",
    heroSmall: "নাবাবি রিস্টোরান্তেতে স্বাগতম",
    heroTitle: "আসল রাজকীয় স্বাদ",
    heroText:
      "রোমের হৃদয়ে ভারত ও বাংলাদেশের আসল স্বাদ উপভোগ করুন।",
    aboutTitle: "আমাদের গল্প",
    aboutText:
      "Nababi Ristorante রোমের হৃদয়ে ভারত ও বাংলাদেশের সমৃদ্ধ খাবারের ঐতিহ্য নিয়ে এসেছে।",
    menuTitle: "আমাদের মেনু",
    menuText: "একটি ক্যাটাগরিতে ক্লিক করে খাবার দেখুন।",
    galleryTitle: "আমাদের গ্যালারি",
    bookingTitle: "টেবিল বুক করুন",
    bookingText:
      "ফর্মটি পূরণ করুন। আপনার বুকিংয়ের অনুরোধ আমরা পাব।",
    name: "নাম",
    phone: "ফোন নম্বর",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    guests: "কতজন",
    category: "ক্যাটাগরি",
    item: "পছন্দের খাবার",
    note: "বিশেষ অনুরোধ",
    confirm: "বুকিং নিশ্চিত করুন",
    cancel: "বাতিল",
    reviewsTitle: "আমাদের কাস্টমাররা কী বলেন",
    allReviews: "সব রিভিউ",
    contactTitle: "যোগাযোগ",
    close: "বন্ধ করুন",
    follow: "সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন",
    bookingSuccess: "বুকিং গ্রহণ করা হয়েছে!",
    bookingCode: "আপনার বুকিং কোড",
    popupClose: "আর দেখাবেন না",
  },
};

const defaultBooking: BookingForm = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: "2",
  category: "",
  item: "",
  note: "",
};

function readStorage(key: string, fallback: any) {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);

    if (!value) return fallback;

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getText(data: AnyData, ...keys: string[]) {
  for (const key of keys) {
    if (
      data &&
      typeof data[key] === "string" &&
      data[key].trim()
    ) {
      return data[key].trim();
    }
  }

  return "";
}

function getCategoryName(category: any) {
  if (typeof category === "string") {
    return category;
  }

  if (category && typeof category === "object") {
    return String(
      category.name ??
        category.title ??
        category.category ??
        category.label ??
        ""
    );
  }

  return "";
}

function getItemCategory(item: AnyData) {
  return getText(item, "category", "categoryName", "type");
}

function getItemName(item: AnyData) {
  return getText(item, "name", "title", "productName");
}

function getItemDescription(item: AnyData) {
  return getText(item, "description", "details", "text");
}

function getItemImage(item: AnyData) {
  return getText(item, "image", "imageUrl", "photo");
}

function isVisible(item: AnyData) {
  return item?.visible !== false && item?.show !== false;
}

function normalizeDateTime(value: string) {
  if (!value) return 0;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isBreakingNewsActive(news: AnyData) {
  if (!news || !isVisible(news)) return false;

  const now = new Date();

  if (news.startDate) {
    const start = new Date(
      `${news.startDate}T${news.startTime || "00:00"}`
    );

    if (now < start) return false;
  }

  if (news.endDate) {
    const end = new Date(
      `${news.endDate}T${news.endTime || "23:59"}`
    );

    if (now > end) return false;
  }

  return true;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("it");

  const [home, setHome] = useState<AnyData>({});
  const [about, setAbout] = useState<AnyData>({});
  const [contact, setContact] = useState<AnyData>({});
  const [settings, setSettings] = useState<AnyData>({});
  const [social, setSocial] = useState<AnyData>({});
  const [languages, setLanguages] = useState<AnyData>({});
  const [hours, setHours] = useState<AnyData>({});
  const [menu, setMenu] = useState<AnyData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [gallery, setGallery] = useState<AnyData[]>([]);
  const [reviews, setReviews] = useState<AnyData[]>([]);
  const [promotions, setPromotions] = useState<AnyData[]>([]);
  const [breakingNews, setBreakingNews] = useState<AnyData[]>([]);
  const [websiteStatus, setWebsiteStatus] = useState<AnyData>({});

  const [selectedCategory, setSelectedCategory] =
    useState<string>("");

  const [bookingForm, setBookingForm] =
    useState<BookingForm>(defaultBooking);

  const [bookingCode, setBookingCode] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupNews, setPopupNews] = useState<AnyData | null>(
    null
  );

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState<string | null>(
    null
  );

  const t = translations[language];

  useEffect(() => {
    const loadData = () => {
      const homeData = readStorage("nababi-home-settings", {});
      const aboutData = readStorage("nababi-about", {});
      const contactData = readStorage("nababi-contact", {});
      const settingsData = readStorage("nababi-settings", {});
      const socialData = readStorage("nababi-social-media", {});
      const languagesData = readStorage("nababi-languages", {});
      const hoursData = readStorage("nababi-opening-hours", {});
      const menuData = readStorage("nababi-menu", []);
      const categoryData = readStorage(
        "nababi-categories",
        []
      );
      const galleryData = readStorage("nababi-gallery", []);
      const reviewsData = readStorage("nababi-reviews", []);
      const promotionsData = readStorage(
        "nababi-promotions",
        []
      );
      const breakingData = readStorage(
        "nababi-breaking-news",
        []
      );
      const statusData = readStorage(
        "nababi-website-status",
        {}
      );

      setHome(homeData || {});
      setAbout(aboutData || {});
      setContact(contactData || {});
      setSettings(settingsData || {});
      setSocial(socialData || {});
      setLanguages(languagesData || {});
      setHours(hoursData || {});
      setWebsiteStatus(statusData || {});

      setMenu(
        Array.isArray(menuData)
          ? menuData.filter(isVisible)
          : []
      );

      setCategories(
        Array.isArray(categoryData) ? categoryData : []
      );

      setGallery(
        Array.isArray(galleryData)
          ? galleryData
              .filter(isVisible)
              .sort(
                (a, b) =>
                  Number(a.displayOrder || 0) -
                  Number(b.displayOrder || 0)
              )
          : []
      );

      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData.filter(isVisible)
          : []
      );

      setPromotions(
        Array.isArray(promotionsData)
          ? promotionsData.filter(isVisible)
          : []
      );

      setBreakingNews(
        Array.isArray(breakingData)
          ? breakingData
          : breakingData
          ? [breakingData]
          : []
      );
    };

    loadData();

    const interval = window.setInterval(loadData, 1500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!breakingNews.length) {
      setPopupNews(null);
      setPopupVisible(false);
      return;
    }

    const active = breakingNews
      .filter(isBreakingNewsActive)
      .sort((a, b) => {
        const aTime =
          normalizeDateTime(a.createdAt) ||
          normalizeDateTime(a.startDate);
        const bTime =
          normalizeDateTime(b.createdAt) ||
          normalizeDateTime(b.startDate);

        return bTime - aTime;
      })[0];

    if (!active) {
      setPopupNews(null);
      setPopupVisible(false);
      return;
    }

    setPopupNews(active);

    const disabledUntil =
      typeof window !== "undefined"
        ? sessionStorage.getItem(
            `nababi-breaking-closed-${active.id || "current"}`
          )
        : null;

    if (disabledUntil === "1") {
      setPopupVisible(false);
      return;
    }

    const delay = Number(
      active.displayAfterSeconds ??
        active.delaySeconds ??
        3
    );

    const timer = window.setTimeout(() => {
      setPopupVisible(true);
    }, Math.max(0, delay) * 1000);

    return () => window.clearTimeout(timer);
  }, [breakingNews]);

  useEffect(() => {
    if (!popupVisible || !popupNews) return;

    const duration = Number(
      popupNews.displayDurationSeconds ??
        popupNews.durationSeconds ??
        10
    );

    if (!duration || duration < 1) return;

    const timer = window.setTimeout(() => {
      setPopupVisible(false);
    }, duration * 1000);

    return () => window.clearTimeout(timer);
  }, [popupVisible, popupNews]);

  const restaurantName =
    settings.restaurantName ||
    contact.restaurantName ||
    "NABABI RISTORANTE";

  const phone =
    contact.phone ||
    settings.phone ||
    "+39 393 3805350";

  const whatsapp =
    contact.whatsapp ||
    settings.whatsapp ||
    "+39 333 7687319";

  const address =
    contact.address ||
    "Via Vespasiano 73/75/77, Roma";

  const email =
    contact.email ||
    settings.adminEmail ||
    "";

  const heroImage =
    getText(home, "heroImage", "image", "heroImageUrl") ||
    DEFAULT_BIRYANI_IMAGE;

  const aboutImage =
    getText(about, "image", "imageUrl", "photo");

  const aboutVideo =
    getText(about, "video", "videoUrl");

  const heroTitle =
    getText(home, "heroTitle", "title") ||
    t.heroTitle;

  const heroSubtitle =
    getText(home, "heroSubtitle", "subtitle", "heroText") ||
    t.heroText;

  const welcomeText =
    getText(home, "welcomeText", "welcome") ||
    t.heroSmall;

  const aboutText =
    getText(about, "content", "text", "description") ||
    t.aboutText;

  const bookingTitle =
    getText(home, "bookingTitle") ||
    t.bookingTitle;

  const bookingText =
    getText(home, "bookingText") ||
    t.bookingText;

  const normalizedCategories = useMemo(() => {
    const names = [
      ...categories.map(getCategoryName),
      ...menu.map(getItemCategory),
    ]
      .map((name) => name.trim())
      .filter(Boolean);

    return Array.from(new Set(names));
  }, [categories, menu]);

  const visibleMenu = useMemo(() => {
    if (!selectedCategory) return menu;

    return menu.filter(
      (item) =>
        getItemCategory(item).toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }, [menu, selectedCategory]);

  const visibleReviews = useMemo(() => {
    const sorted = [...reviews].sort((a, b) => {
      const aRating = Number(
        a.rating ?? a.stars ?? 0
      );

      const bRating = Number(
        b.rating ?? b.stars ?? 0
      );

      if (bRating !== aRating) {
        return bRating - aRating;
      }

      const aDate =
        normalizeDateTime(a.date) ||
        normalizeDateTime(a.createdAt);

      const bDate =
        normalizeDateTime(b.date) ||
        normalizeDateTime(b.createdAt);

      return bDate - aDate;
    });

    return showAllReviews ? sorted : sorted.slice(0, 6);
  }, [reviews, showAllReviews]);

  const closePopup = () => {
    setPopupVisible(false);

    if (popupNews) {
      try {
        sessionStorage.setItem(
          `nababi-breaking-closed-${
            popupNews.id || "current"
          }`,
          "1"
        );
      } catch {}
    }
  };

  const handleBookingSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const existing =
        readStorage("nababi-reservations", []);

      const reservations = Array.isArray(existing)
        ? existing
        : [];

      const code =
        "NAB-" +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      const reservation = {
        id: Date.now().toString(),
        bookingCode: code,
        name: bookingForm.name.trim(),
        phone: bookingForm.phone.trim(),
        email: bookingForm.email.trim(),
        date: bookingForm.date,
        time: bookingForm.time,
        guests: Number(bookingForm.guests),
        category: bookingForm.category,
        menu: bookingForm.item.trim(),
        item: bookingForm.item.trim(),
        note: bookingForm.note.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "nababi-reservations",
        JSON.stringify([
          ...reservations,
          reservation,
        ])
      );

      setBookingCode(code);
      setBookingSuccess(true);
      setBookingForm(defaultBooking);
    } catch (error) {
      console.error(error);
      alert("Booking save failed. Please try again.");
    }
  };

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setMobileMenu(false);
  };

  const getPopupMedia = () => {
    if (!popupNews) return "";

    return getText(
      popupNews,
      "mediaUrl",
      "videoUrl",
      "imageUrl",
      "image",
      "photo",
      "url"
    );
  };

  const popupMedia = getPopupMedia();

  const popupType =
    String(
      popupNews?.mediaType ||
        popupNews?.type ||
        ""
    ).toLowerCase();

  const isVideo =
    popupType.includes("video") ||
    /\.(mp4|webm|ogg)(\?|$)/i.test(
      popupMedia
    );

  const mapsUrl =
    contact.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77+Roma";

  const socialLinks = [
    {
      name: "Facebook",
      url: social.facebook,
    },
    {
      name: "Instagram",
      url: social.instagram,
    },
    {
      name: "TikTok",
      url: social.tiktok,
    },
    {
      name: "YouTube",
      url: social.youtube,
    },
    {
      name: "WhatsApp",
      url:
        social.whatsapp ||
        `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    },
  ].filter((item) => item.url);

  if (
    websiteStatus?.maintenanceMode === true ||
    websiteStatus?.status === "maintenance"
  ) {
    return (
      <main className="maintenance-screen">
        <div className="maintenance-card">
          <span>♛</span>
          <h1>{restaurantName}</h1>
          <p>
            Website temporarily under maintenance.
          </p>
        </div>

        <style jsx>{`
          .maintenance-screen {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #0c0a09;
            color: #f2dfac;
            padding: 30px;
            font-family: Georgia, serif;
          }

          .maintenance-card {
            text-align: center;
            border: 1px solid rgba(213, 174, 91, 0.4);
            padding: 50px;
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.04);
          }

          .maintenance-card span {
            font-size: 55px;
          }

          .maintenance-card h1 {
            margin: 15px 0;
          }

          .maintenance-card p {
            color: #bfb19a;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="site">
      {/* HEADER */}
      <header className="header">
        <a
          href="#home"
          className="logo"
          onClick={() => setMobileMenu(false)}
        >
          <span className="logo-crown">♛</span>

          <span>
            <strong>NABABI</strong>
            <small>RISTORANTE</small>
          </span>
        </a>

        <nav
          className={`nav ${
            mobileMenu ? "nav-open" : ""
          }`}
        >
          <a href="#home" onClick={() => setMobileMenu(false)}>
            {t.home}
          </a>

          <a href="#about" onClick={() => setMobileMenu(false)}>
            {t.about}
          </a>

          <a href="#menu" onClick={() => setMobileMenu(false)}>
            {t.menu}
          </a>

          <a href="#gallery" onClick={() => setMobileMenu(false)}>
            {t.gallery}
          </a>

          <a href="#booking" onClick={() => setMobileMenu(false)}>
            {t.booking}
          </a>

          <a href="#reviews" onClick={() => setMobileMenu(false)}>
            {t.reviews}
          </a>

          <a href="#contact" onClick={() => setMobileMenu(false)}>
            {t.contact}
          </a>
        </nav>

        <div className="header-actions">
          <a
            href="#booking"
            className="order-btn"
          >
            {t.bookNow}
          </a>

          <a
            href="/admin"
            className="admin-btn"
          >
            🔒 Admin
          </a>

          {languages?.switcherVisible !== false && (
            <select
              className="language"
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value as Language
                )
              }
            >
              <option value="it">🇮🇹 IT</option>
              <option value="en">🇬🇧 EN</option>
              <option value="bn">🇧🇩 বাংলা</option>
            </select>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* HERO / BIRYANI SCREEN */}
      <section
        id="home"
        className="hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7,5,4,0.97) 0%,
              rgba(7,5,4,0.84) 42%,
              rgba(7,5,4,0.34) 72%,
              rgba(7,5,4,0.78) 100%
            ),
            url("${heroImage}")
          `,
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">
            {welcomeText}
          </p>

          <h1>{heroTitle}</h1>

          <p className="hero-text">
            {heroSubtitle}
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="primary-btn"
              onClick={() => scrollTo("menu")}
            >
              🍛 {t.viewMenu}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => scrollTo("booking")}
            >
              ◉ {t.bookNow}
            </button>
          </div>

          {/* SMALL PHONE + ADDRESS */}
          <div className="hero-contact-mini">
            <a href={`tel:${phone.replace(/\s/g, "")}`}>
              <span>☎</span>
              <small>{t.phone}</small>
              <strong>{phone}</strong>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>📍</span>
              <small>Address</small>
              <strong>{address}</strong>
            </a>
          </div>
        </div>

        <div className="hero-image-side">
          <div className="hero-food-frame">
            <img
              src={heroImage}
              alt="Biryani"
            />

            <div className="food-badge">
              <span>♛</span>
              <strong>NABABI</strong>
              <small>RISTORANTE</small>
            </div>
          </div>
        </div>

        {/* BREAKING NEWS VIDEO / IMAGE POPUP */}
        {popupVisible &&
          popupNews &&
          popupMedia && (
            <div className="breaking-popup">
              <div className="breaking-popup-top">
                <span>
                  {isVideo
                    ? "🎥 Breaking News"
                    : "🖼️ Breaking News"}
                </span>

                <button
                  type="button"
                  onClick={closePopup}
                  aria-label={t.close}
                  title={t.close}
                >
                  ✕
                </button>
              </div>

              <div className="breaking-media">
                {isVideo ? (
                  <video
                    src={popupMedia}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <img
                    src={popupMedia}
                    alt="Breaking News"
                  />
                )}
              </div>

              {getText(
                popupNews,
                "text",
                "title",
                "description"
              ) && (
                <div className="breaking-caption">
                  {getText(
                    popupNews,
                    "text",
                    "title",
                    "description"
                  )}
                </div>
              )}

              <button
                type="button"
                className="popup-close-text"
                onClick={closePopup}
              >
                {t.popupClose}
              </button>
            </div>
          )}
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="section about-section"
      >
        <div className="about-media">
          {aboutVideo ? (
            <video
              src={aboutVideo}
              controls
              playsInline
              muted
            />
          ) : aboutImage ? (
            <img
              src={aboutImage}
              alt="About Nababi"
            />
          ) : (
            <img
              src={heroImage}
              alt="Nababi Ristorante"
            />
          )}

          <div className="about-seal">
            <span>♛</span>
            <strong>NABABI</strong>
            <small>ROMA</small>
          </div>
        </div>

        <div className="about-content">
          <p className="eyebrow">
            {restaurantName}
          </p>

          <h2>{t.aboutTitle}</h2>

          <p>{aboutText}</p>

          <p>
            India and Bangladesh meet in Rome through
            authentic recipes, traditional spices and a
            warm royal atmosphere.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => scrollTo("contact")}
          >
            {t.contact} →
          </button>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="section menu-section"
      >
        <div className="section-heading">
          <p className="eyebrow">
            {restaurantName}
          </p>

          <h2>{t.menuTitle}</h2>

          <p>{t.menuText}</p>
        </div>

        <div className="menu-categories">
          {normalizedCategories.map(
            (category, index) => (
              <button
                type="button"
                key={`${category}-${index}`}
                className={
                  selectedCategory === category
                    ? "menu-category active"
                    : "menu-category"
                }
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category
                      ? ""
                      : category
                  )
                }
              >
                <span className="category-icon">
                  {index % 6 === 0
                    ? "🍛"
                    : index % 6 === 1
                    ? "🍕"
                    : index % 6 === 2
                    ? "🍔"
                    : index % 6 === 3
                    ? "🫓"
                    : index % 6 === 4
                    ? "🍗"
                    : "🥤"}
                </span>

                <strong>{category}</strong>
              </button>
            )
          )}
        </div>

        {selectedCategory && (
          <div className="selected-category-title">
            <span>✓</span>
            {selectedCategory}
          </div>
        )}

        <div className="food-grid">
          {visibleMenu.length > 0 ? (
            visibleMenu.map(
              (item, index) => {
                const image =
                  getItemImage(item);

                return (
                  <article
                    className="food-card"
                    key={
                      item.id ||
                      `${getItemName(item)}-${index}`
                    }
                  >
                    <div className="food-image">
                      {image ? (
                        <img
                          src={image}
                          alt={getItemName(item)}
                        />
                      ) : (
                        <div className="food-fallback">
                          🍛
                        </div>
                      )}

                      {item.available === false && (
                        <span className="sold-out">
                          Unavailable
                        </span>
                      )}
                    </div>

                    <div className="food-info">
                      <div>
                        <h3>
                          {getItemName(item) ||
                            "Nababi Special"}
                        </h3>

                        <p>
                          {getItemDescription(item)}
                        </p>
                      </div>

                      {item.price !== undefined &&
                        item.price !== null &&
                        item.price !== "" && (
                          <strong className="price">
                            {item.price}{" "}
                            {settings.currency ||
                              "€"}
                          </strong>
                        )}
                    </div>
                  </article>
                );
              }
            )
          ) : (
            <div className="empty-menu">
              <span>🍛</span>
              <h3>
                {selectedCategory
                  ? "No dishes in this category yet."
                  : "Menu coming soon"}
              </h3>
            </div>
          )}
        </div>
      </section>

      {/* PROMOTIONS */}
      {promotions.length > 0 && (
        <section className="section promotions-section">
          <div className="section-heading">
            <p className="eyebrow">SPECIAL OFFER</p>

            <h2>Special Promotions</h2>
          </div>

          <div className="promotion-grid">
            {promotions.map(
              (promotion, index) => (
                <article
                  className="promotion-card"
                  key={
                    promotion.id ||
                    `${promotion.title}-${index}`
                  }
                >
                  {promotion.image && (
                    <img
                      src={promotion.image}
                      alt={
                        promotion.title ||
                        "Promotion"
                      }
                    />
                  )}

                  <div>
                    <span>
                      {promotion.offer ||
                        "Special Offer"}
                    </span>

                    <h3>
                      {promotion.title}
                    </h3>

                    <p>
                      {promotion.description}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      )}

      {/* GALLERY */}
      <section
        id="gallery"
        className="section gallery-section"
      >
        <div className="section-heading">
          <p className="eyebrow">
            {restaurantName}
          </p>

          <h2>{t.galleryTitle}</h2>
        </div>

        <div className="gallery-grid">
          {gallery.length > 0 ? (
            gallery.map((image, index) => {
              const src =
                getText(
                  image,
                  "image",
                  "imageUrl",
                  "url"
                );

              if (!src) return null;

              return (
                <button
                  type="button"
                  className={
                    index === 0 ||
                    index === 5
                      ? "gallery-card large"
                      : "gallery-card"
                  }
                  key={
                    image.id ||
                    `${src}-${index}`
                  }
                  onClick={() =>
                    setGalleryOpen(src)
                  }
                >
                  <img
                    src={src}
                    alt={
                      image.title ||
                      "Nababi Gallery"
                    }
                  />
                </button>
              );
            })
          ) : (
            <div className="gallery-empty">
              <img
                src={heroImage}
                alt="Nababi"
              />
            </div>
          )}
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="section booking-section"
      >
        <div className="booking-heading">
          <p className="eyebrow">RESERVATION</p>

          <h2>{bookingTitle}</h2>

          <p>{bookingText}</p>

          <div className="booking-side-info">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
            >
              ☎ {phone}
            </a>

            {email && (
              <a href={`mailto:${email}`}>
                ✉ {email}
              </a>
            )}
          </div>
        </div>

        <form
          className="booking-form"
          onSubmit={handleBookingSubmit}
        >
          <div className="form-grid">
            <label>
              {t.name}
              <input
                type="text"
                required
                value={bookingForm.name}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.phone}
              <input
                type="tel"
                required
                value={bookingForm.phone}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    phone: e.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.email}
              <input
                type="email"
                value={bookingForm.email}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    email: e.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.date}
              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    date: e.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.time}
              <input
                type="time"
                required
                value={bookingForm.time}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    time: e.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.guests}
              <select
                required
                value={bookingForm.guests}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    guests: e.target.value,
                  })
                }
              >
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                ].map((number) => (
                  <option
                    key={number}
                    value={number}
                  >
                    {number}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t.category}
              <select
                value={bookingForm.category}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    category: e.target.value,
                    item: "",
                  })
                }
              >
                <option value="">
                  Select category
                </option>

                {normalizedCategories.map(
                  (category, index) => (
                    <option
                      key={`${category}-${index}`}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              {t.item}
              <input
                type="text"
                value={bookingForm.item}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    item: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <label>
            {t.note}
            <textarea
              rows={5}
              value={bookingForm.note}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  note: e.target.value,
                })
              }
            />
          </label>

          <button
            type="submit"
            className="primary-btn submit-btn"
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
                <b>{bookingCode}</b>
              </span>

              <button
                type="button"
                onClick={() => {
                  setBookingSuccess(false);
                  setBookingCode("");
                }}
              >
                {t.cancel}
              </button>
            </div>
          )}
        </form>
      </section>

      {/* REVIEWS */}
      <section
        id="reviews"
        className="section reviews-section"
      >
        <div className="section-heading">
          <p className="eyebrow">REVIEWS</p>

          <h2>{t.reviewsTitle}</h2>
        </div>

        <div className="reviews-grid">
          {visibleReviews.length > 0 ? (
            visibleReviews.map(
              (review, index) => {
                const rating = Math.max(
                  1,
                  Math.min(
                    5,
                    Number(
                      review.rating ??
                        review.stars ??
                        5
                    )
                  )
                );

                return (
                  <article
                    className="review-card"
                    key={
                      review.id ||
                      `${review.customerName}-${index}`
                    }
                  >
                    <div className="stars">
                      {"★".repeat(rating)}
                    </div>

                    <p>
                      “
                      {getText(
                        review,
                        "review",
                        "text",
                        "comment"
                      )}
                      ”
                    </p>

                    <strong>
                      {getText(
                        review,
                        "customerName",
                        "name"
                      ) || "Customer"}
                    </strong>

                    <small>
                      Verified Customer
                    </small>
                  </article>
                );
              }
            )
          ) : (
            <div className="empty-review">
              ⭐
              <p>No reviews yet.</p>
            </div>
          )}
        </div>

        {reviews.length > 6 && (
          <div className="center">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setShowAllReviews(
                  !showAllReviews
                )
              }
            >
              {showAllReviews
                ? "Show Less"
                : t.allReviews}
            </button>
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="section contact-section"
      >
        <div className="contact-content">
          <p className="eyebrow">
            {restaurantName}
          </p>

          <h2>{t.contactTitle}</h2>

          <p>
            {contact.contactText ||
              "We are here for you. Contact us for information and reservations."}
          </p>

          <div className="contact-list">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              📍
              <span>{address}</span>
            </a>

            <a
              href={`tel:${phone.replace(
                /\s/g,
                ""
              )}`}
            >
              ☎
              <span>{phone}</span>
            </a>

            {email && (
              <a href={`mailto:${email}`}>
                ✉
                <span>{email}</span>
              </a>
            )}

            <a
              href={`https://wa.me/${whatsapp.replace(
                /\D/g,
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              💬
              <span>
                WhatsApp {whatsapp}
              </span>
            </a>
          </div>

          <div className="social-links">
            {socialLinks.map(
              (socialItem) => (
                <a
                  href={socialItem.url}
                  target="_blank"
                  rel="noreferrer"
                  key={socialItem.name}
                >
                  {socialItem.name}
                </a>
              )
            )}
          </div>
        </div>

        <div className="map-box">
          <div className="map-inner">
            <span>📍</span>
            <strong>Roma</strong>
            <small>{address}</small>

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

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <span className="footer-logo">
            ♛ NABABI
          </span>

          <p>RISTORANTE</p>
        </div>

        <p>
          © {new Date().getFullYear()}{" "}
          {restaurantName}. All rights reserved.
        </p>

        <a href="/admin">
          Admin Panel
        </a>
      </footer>

      {/* GALLERY LIGHTBOX */}
      {galleryOpen && (
        <div
          className="gallery-lightbox"
          onClick={() =>
            setGalleryOpen(null)
          }
        >
          <button
            type="button"
            onClick={() =>
              setGalleryOpen(null)
            }
          >
            ✕
          </button>

          <img
            src={galleryOpen}
            alt="Gallery"
            onClick={(e) =>
              e.stopPropagation()
            }
          />
        </div>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #090706;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .site {
          min-height: 100vh;
          color: #f5ead0;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(190, 148, 65, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 50%,
              rgba(160, 70, 25, 0.08),
              transparent 30%
            ),
            #0c0908;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          overflow-x: hidden;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          min-height: 78px;
          padding: 12px 4%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(9, 7, 6, 0.92);
          border-bottom: 1px solid
            rgba(208, 168, 87, 0.28);
          backdrop-filter: blur(18px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #e8ce8c;
          text-decoration: none;
          min-width: 175px;
        }

        .logo-crown {
          font-size: 34px;
          color: #d1aa59;
        }

        .logo strong {
          display: block;
          letter-spacing: 4px;
          font-size: 20px;
        }

        .logo small {
          display: block;
          letter-spacing: 3px;
          color: #9f9177;
          font-size: 8px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav a,
        .footer a {
          color: #e5d8bd;
          text-decoration: none;
          font-size: 13px;
          transition: 0.25s;
        }

        .nav a:hover,
        .footer a:hover {
          color: #d8b96d;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-btn,
        .admin-btn,
        .primary-btn,
        .secondary-btn {
          border-radius: 30px;
          padding: 11px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: 0.25s;
        }

        .order-btn,
        .primary-btn {
          color: #17100b;
          border: 1px solid #d2ac5c;
          background:
            linear-gradient(
              135deg,
              #f2dfa4,
              #b8893e
            );
        }

        .admin-btn,
        .secondary-btn {
          color: #ead49a;
          border: 1px solid
            rgba(211, 170, 89, 0.65);
          background: rgba(255, 255, 255, 0.03);
        }

        .order-btn:hover,
        .admin-btn:hover,
        .primary-btn:hover,
        .secondary-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 30px
              rgba(203, 161, 76, 0.18);
        }

        .language {
          color: #ead8ad;
          background: #211a15;
          border: 1px solid #67522f;
          border-radius: 20px;
          padding: 9px 10px;
        }

        .mobile-menu-button {
          display: none;
          border: 1px solid #725b35;
          color: #ecd99e;
          background: transparent;
          border-radius: 10px;
          padding: 9px 12px;
          cursor: pointer;
        }

        .hero {
          min-height: calc(100vh - 78px);
          position: relative;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 50px;
          padding: 70px 7%;
          background-size: cover;
          background-position: center;
          isolation: isolate;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(5, 4, 3, 0.15),
              transparent
            );
          z-index: -1;
        }

        .hero-content {
          position: relative;
          z-index: 5;
        }

        .eyebrow {
          margin: 0 0 15px;
          color: #d4b46b;
          font-size: 10px;
          letter-spacing: 3px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 750px;
          margin: 0;
          color: #f4e6bd;
          font-size: clamp(
            48px,
            7vw,
            88px
          );
          line-height: 0.96;
          font-weight: 500;
        }

        .hero-text {
          max-width: 590px;
          margin: 28px 0;
          color: #d4c6ad;
          line-height: 1.8;
          font-size: 16px;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-contact-mini {
          display: flex;
          gap: 12px;
          margin-top: 42px;
          flex-wrap: wrap;
        }

        .hero-contact-mini a {
          min-width: 180px;
          display: grid;
          grid-template-columns: 25px 1fr;
          align-items: center;
          column-gap: 7px;
          padding: 10px 13px;
          color: #eee1c5;
          text-decoration: none;
          border-left: 2px solid #b88e42;
          background: rgba(
            0,
            0,
            0,
            0.27
          );
          backdrop-filter: blur(10px);
        }

        .hero-contact-mini span {
          grid-row: span 2;
          font-size: 19px;
        }

        .hero-contact-mini small {
          color: #a99b83;
          font-size: 9px;
        }

        .hero-contact-mini strong {
          font-size: 11px;
          font-weight: 500;
        }

        .hero-image-side {
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .hero-food-frame {
          width: min(520px, 100%);
          aspect-ratio: 1 / 1;
          position: relative;
          border-radius: 50%;
          padding: 12px;
          border: 1px solid
            rgba(218, 179, 91, 0.72);
          background:
            radial-gradient(
              circle,
              rgba(215, 176, 86, 0.15),
              transparent 65%
            );
          box-shadow:
            0 0 0 12px
              rgba(201, 161, 79, 0.05),
            0 30px 80px
              rgba(0, 0, 0, 0.5);
        }

        .hero-food-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          filter: saturate(1.05)
            contrast(1.04);
        }

        .food-badge {
          position: absolute;
          right: 2%;
          bottom: 7%;
          width: 112px;
          height: 112px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #120d09;
          border: 1px solid #cba65b;
          box-shadow:
            0 15px 35px
              rgba(0, 0, 0, 0.45);
        }

        .food-badge span {
          color: #d6b46b;
          font-size: 24px;
        }

        .food-badge strong {
          letter-spacing: 2px;
          font-size: 13px;
        }

        .food-badge small {
          color: #a5967a;
          font-size: 7px;
          letter-spacing: 2px;
        }

        /* BREAKING NEWS POPUP */

        .breaking-popup {
          position: fixed;
          right: 24px;
          top: 105px;
          z-index: 500;
          width: min(320px, calc(100vw - 30px));
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid
            rgba(218, 174, 81, 0.8);
          background:
            linear-gradient(
              145deg,
              rgba(28, 18, 11, 0.98),
              rgba(10, 8, 7, 0.98)
            );
          box-shadow:
            0 25px 70px
              rgba(0, 0, 0, 0.6),
            0 0 35px
              rgba(197, 150, 53, 0.1);
          animation: popupIn 0.5s
            ease-out both;
        }

        @keyframes popupIn {
          from {
            opacity: 0;
            transform: translateY(-25px)
              scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0)
              scale(1);
          }
        }

        .breaking-popup-top {
          height: 42px;
          padding: 0 11px 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #e7cd8c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .breaking-popup-top button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid
            rgba(218, 174, 81, 0.5);
          background: rgba(255, 255, 255, 0.04);
          color: #f0dfb1;
          cursor: pointer;
        }

        .breaking-media {
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #000;
        }

        .breaking-media img,
        .breaking-media video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .breaking-caption {
          padding: 10px 13px 5px;
          color: #e9ddc6;
          font-size: 12px;
          line-height: 1.5;
        }

        .popup-close-text {
          border: 0;
          background: transparent;
          color: #9d8d72;
          padding: 8px 13px 12px;
          font-size: 9px;
          cursor: pointer;
        }

        .section {
          padding: 100px 7%;
          position: relative;
        }

        .section-heading {
          max-width: 720px;
          margin: 0 auto 45px;
          text-align: center;
        }

        .section-heading h2,
        .about-content h2,
        .booking-heading h2,
        .contact-content h2 {
          margin: 0 0 18px;
          color: #f1dfac;
          font-size: clamp(
            38px,
            5vw,
            65px
          );
          font-weight: 500;
          line-height: 1;
        }

        .section-heading p:not(.eyebrow) {
          color: #bcb09a;
          line-height: 1.8;
        }

        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          background:
            linear-gradient(
              180deg,
              #0d0908,
              #15100c
            );
        }

        .about-media {
          position: relative;
          min-height: 470px;
          border-radius: 25px;
          overflow: hidden;
          border: 1px solid
            rgba(204, 162, 80, 0.35);
        }

        .about-media img,
        .about-media video {
          width: 100%;
          height: 100%;
          min-height: 470px;
          object-fit: cover;
          display: block;
        }

        .about-seal {
          position: absolute;
          left: 25px;
          bottom: 25px;
          width: 105px;
          height: 105px;
          border-radius: 50%;
          background: #100b08;
          border: 1px solid #c7a052;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .about-seal span {
          color: #d5b367;
          font-size: 25px;
        }

        .about-seal strong {
          font-size: 12px;
          letter-spacing: 2px;
        }

        .about-seal small {
          color: #95856b;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .about-content p {
          color: #c7b9a0;
          line-height: 1.9;
        }

        .menu-section {
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(193, 145, 54, 0.09),
              transparent 30%
            ),
            #0b0807;
        }

        .menu-categories {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 38px;
        }

        .menu-category {
          min-width: 105px;
          padding: 15px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #cfc1a7;
          border: 1px solid
            rgba(202, 162, 82, 0.28);
          background: rgba(255, 255, 255, 0.025);
          border-radius: 18px;
          cursor: pointer;
          transition: 0.25s;
        }

        .menu-category:hover,
        .menu-category.active {
          color: #f4dfaa;
          border-color: #c9a158;
          transform: translateY(-3px);
          background: rgba(
            197,
            154,
            65,
            0.08
          );
        }

        .category-icon {
          font-size: 28px;
        }

        .menu-category strong {
          font-size: 11px;
        }

        .selected-category-title {
          width: fit-content;
          margin: 0 auto 30px;
          padding: 10px 18px;
          border-radius: 30px;
          color: #ead49a;
          border: 1px solid #a17d3e;
          background: rgba(
            189,
            145,
            57,
            0.08
          );
        }

        .selected-category-title span {
          margin-right: 7px;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 22px;
        }

        .food-card {
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid
            rgba(207, 164, 81, 0.24);
          background: #15100d;
          transition: 0.3s;
        }

        .food-card:hover {
          transform: translateY(-5px);
          border-color: #b99045;
        }

        .food-image {
          height: 245px;
          position: relative;
          background: #211710;
        }

        .food-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .food-fallback {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          font-size: 80px;
        }

        .sold-out {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 7px 10px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: #e9c77e;
          font-size: 9px;
        }

        .food-info {
          padding: 18px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .food-info h3 {
          margin: 0 0 8px;
          color: #f0dfb1;
          font-size: 18px;
        }

        .food-info p {
          margin: 0;
          color: #9e917c;
          line-height: 1.6;
          font-size: 12px;
        }

        .price {
          color: #d8b56b;
          white-space: nowrap;
        }

        .empty-menu {
          min-height: 230px;
          display: grid;
          place-items: center;
          align-content: center;
          color: #a7977c;
          text-align: center;
        }

        .empty-menu span {
          font-size: 60px;
        }

        .promotions-section {
          background: #120d09;
        }

        .promotion-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 20px;
        }

        .promotion-card {
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid #694f29;
          background: #1b120c;
        }

        .promotion-card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        .promotion-card > div {
          padding: 20px;
        }

        .promotion-card span {
          color: #d9b76c;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .promotion-card h3 {
          color: #f2dfae;
          font-size: 25px;
          margin: 8px 0;
        }

        .promotion-card p {
          color: #aaa08d;
          line-height: 1.7;
        }

        .gallery-section {
          background: #0a0807;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          grid-auto-rows: 220px;
          gap: 15px;
        }

        .gallery-card {
          padding: 0;
          overflow: hidden;
          border: 1px solid
            rgba(205, 164, 81, 0.24);
          border-radius: 18px;
          background: #17100c;
          cursor: pointer;
        }

        .gallery-card.large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: 0.45s;
        }

        .gallery-card:hover img {
          transform: scale(1.06);
        }

        .gallery-empty {
          min-height: 400px;
          border-radius: 25px;
          overflow: hidden;
        }

        .gallery-empty img {
          width: 100%;
          height: 450px;
          object-fit: cover;
        }

        .booking-section {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          gap: 60px;
          align-items: start;
          background:
            radial-gradient(
              circle at 10% 50%,
              rgba(182, 133, 45, 0.12),
              transparent 30%
            ),
            #15100d;
        }

        .booking-heading {
          position: sticky;
          top: 110px;
        }

        .booking-heading > p:not(.eyebrow) {
          color: #bdb09a;
          line-height: 1.8;
        }

        .booking-side-info {
          display: grid;
          gap: 10px;
          margin-top: 30px;
        }

        .booking-side-info a {
          color: #d9bf80;
          text-decoration: none;
        }

        .booking-form {
          padding: 30px;
          border-radius: 25px;
          border: 1px solid
            rgba(208, 166, 81, 0.32);
          background: rgba(
            255,
            255,
            255,
            0.035
          );
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 18px;
        }

        .booking-form label {
          display: grid;
          gap: 8px;
          color: #c9b99d;
          font-size: 11px;
        }

        .booking-form input,
        .booking-form textarea,
        .booking-form select {
          width: 100%;
          border: 1px solid
            rgba(201, 162, 84, 0.27);
          outline: none;
          border-radius: 12px;
          padding: 13px 14px;
          color: #eee0bf;
          background: #0f0b09;
        }

        .booking-form textarea {
          margin-top: 18px;
          resize: vertical;
        }

        .booking-form input:focus,
        .booking-form textarea:focus,
        .booking-form select:focus {
          border-color: #c7a158;
        }

        .submit-btn {
          margin-top: 20px;
        }

        .booking-success {
          margin-top: 20px;
          padding: 17px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          border-radius: 14px;
          border: 1px solid #8c6c36;
          background: rgba(
            164,
            125,
            46,
            0.08
          );
          color: #e8d19a;
        }

        .booking-success span {
          width: 100%;
          color: #c0b298;
        }

        .booking-success b {
          color: #f2d078;
          letter-spacing: 2px;
        }

        .booking-success button {
          border: 0;
          background: transparent;
          color: #a79679;
          cursor: pointer;
          font-size: 10px;
        }

        .reviews-section {
          background: #0c0908;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 20px;
        }

        .review-card {
          padding: 25px;
          border-radius: 20px;
          border: 1px solid
            rgba(204, 163, 82, 0.25);
          background: #15100d;
        }

        .stars {
          color: #e2bd62;
          letter-spacing: 3px;
          margin-bottom: 17px;
        }

        .review-card p {
          min-height: 75px;
          color: #c4b6a0;
          line-height: 1.8;
        }

        .review-card strong {
          display: block;
          color: #f0dfb1;
        }

        .review-card small {
          color: #847762;
        }

        .empty-review {
          grid-column: 1 / -1;
          text-align: center;
          color: #a49379;
        }

        .center {
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }

        .contact-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: stretch;
          background: #15100d;
        }

        .contact-content > p:not(.eyebrow) {
          color: #bfb19b;
          line-height: 1.8;
        }

        .contact-list {
          display: grid;
          gap: 15px;
          margin-top: 30px;
        }

        .contact-list a {
          display: flex;
          gap: 12px;
          align-items: center;
          color: #ddc58d;
          text-decoration: none;
        }

        .contact-list span {
          color: #c2b39a;
        }

        .social-links {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        .social-links a {
          padding: 10px 14px;
          border-radius: 25px;
          color: #d8bd7d;
          text-decoration: none;
          border: 1px solid #5f4928;
          background: rgba(
            255,
            255,
            255,
            0.025
          );
          font-size: 11px;
        }

        .map-box {
          min-height: 360px;
          border-radius: 25px;
          border: 1px solid
            rgba(203, 163, 82, 0.35);
          background:
            radial-gradient(
              circle at center,
              rgba(185, 140, 50, 0.13),
              transparent 35%
            ),
            repeating-linear-gradient(
              45deg,
              #17110c,
              #17110c 10px,
              #1c140e 10px,
              #1c140e 20px
            );
          display: grid;
          place-items: center;
        }

        .map-inner {
          width: 80%;
          padding: 30px;
          text-align: center;
          border-radius: 20px;
          background: rgba(
            9,
            7,
            6,
            0.78
          );
          border: 1px solid #72572f;
        }

        .map-inner span {
          display: block;
          font-size: 40px;
        }

        .map-inner strong {
          display: block;
          margin: 10px 0;
          color: #ead49a;
          font-size: 25px;
        }

        .map-inner small {
          display: block;
          color: #a99a82;
        }

        .map-inner a {
          display: inline-block;
          margin-top: 18px;
          color: #d7b66c;
          text-decoration: none;
          font-size: 11px;
        }

        .footer {
          padding: 35px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          border-top: 1px solid
            rgba(204, 162, 82, 0.18);
          background: #080605;
        }

        .footer-logo {
          color: #e1c47e;
          letter-spacing: 3px;
        }

        .footer p {
          color: #756956;
          font-size: 11px;
        }

        .gallery-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          padding: 40px;
          display: grid;
          place-items: center;
          background: rgba(
            0,
            0,
            0,
            0.94
          );
        }

        .gallery-lightbox img {
          max-width: 95vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 15px;
        }

        .gallery-lightbox button {
          position: absolute;
          top: 20px;
          right: 25px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid #927039;
          background: #130e0b;
          color: #f0dca4;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .nav {
            gap: 11px;
          }

          .nav a {
            font-size: 11px;
          }

          .header-actions .admin-btn {
            display: none;
          }

          .hero {
            padding: 60px 5%;
          }

          .section {
            padding: 80px 5%;
          }
        }

        @media (max-width: 850px) {
          .header {
            padding: 12px 4%;
          }

          .nav {
            display: none;
            position: absolute;
            top: 78px;
            left: 0;
            right: 0;
            padding: 20px;
            flex-direction: column;
            align-items: stretch;
            background: rgba(
              12,
              9,
              7,
              0.98
            );
            border-bottom: 1px solid #5e4726;
          }

          .nav.nav-open {
            display: flex;
          }

          .nav a {
            padding: 12px;
          }

          .mobile-menu-button {
            display: block;
          }

          .header-actions .order-btn,
          .header-actions .admin-btn {
            display: none;
          }

          .hero {
            min-height: auto;
            grid-template-columns: 1fr;
            padding: 65px 5% 90px;
          }

          .hero-image-side {
            order: -1;
          }

          .hero-food-frame {
            width: min(430px, 90vw);
          }

          .about-section,
          .booking-section,
          .contact-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .booking-heading {
            position: static;
          }

          .food-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .promotion-grid {
            grid-template-columns: 1fr 1fr;
          }

          .reviews-grid {
            grid-template-columns: 1fr 1fr;
          }

          .gallery-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .gallery-card.large {
            grid-column: span 2;
          }

          .breaking-popup {
            right: 14px;
            top: 92px;
            width: min(
              300px,
              calc(100vw - 28px)
            );
          }
        }

        @media (max-width: 560px) {
          .logo {
            min-width: auto;
          }

          .logo strong {
            font-size: 16px;
          }

          .logo small {
            font-size: 7px;
          }

          .language {
            padding: 8px 7px;
          }

          .hero {
            padding-top: 40px;
          }

          .hero h1 {
            font-size: 50px;
          }

          .hero-contact-mini {
            display: grid;
            grid-template-columns: 1fr;
          }

          .hero-contact-mini a {
            width: 100%;
          }

          .section {
            padding: 70px 5%;
          }

          .section-heading h2,
          .about-content h2,
          .booking-heading h2,
          .contact-content h2 {
            font-size: 42px;
          }

          .food-grid,
          .promotion-grid,
          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .booking-form {
            padding: 18px;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 220px;
          }

          .gallery-card.large {
            grid-column: span 1;
            grid-row: span 1;
          }

          .breaking-popup {
            top: 86px;
            right: 10px;
          }

          .hero-food-frame {
            width: 90vw;
          }

          .food-badge {
            width: 90px;
            height: 90px;
          }

          .food-badge strong {
            font-size: 10px;
          }

          .footer {
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
