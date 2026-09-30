"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Language = "it" | "en" | "bn";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image?: string;
  available?: boolean;
  visible?: boolean;
};

type GalleryItem = {
  id: string;
  image: string;
  category?: string;
  visible?: boolean;
  displayOrder?: number;
};

type Promotion = {
  id: string;
  title: string;
  description?: string;
  offer?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  visible?: boolean;
};

type Review = {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  image?: string;
  date?: string;
  visible?: boolean;
};

type Reservation = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: string;
  message?: string;
  createdAt: string;
  status?: string;
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

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1800&q=90";

const FALLBACK_FOOD =
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85";

const FALLBACK_FOOD_2 =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85";

const FALLBACK_FOOD_3 =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85";

const FALLBACK_RESTAURANT =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85";

const fallbackMenu: MenuItem[] = [
  {
    id: "demo-1",
    name: "Signature Biryani",
    description: "Fragrant basmati rice with aromatic spices and tender meat.",
    price: "€16",
    category: "Biryani",
    image: FALLBACK_FOOD,
    available: true,
    visible: true,
  },
  {
    id: "demo-2",
    name: "Royal Mutton Curry",
    description: "Slow-cooked mutton in a rich traditional sauce.",
    price: "€18",
    category: "Mutton",
    image: FALLBACK_FOOD_2,
    available: true,
    visible: true,
  },
  {
    id: "demo-3",
    name: "Tandoori Chicken",
    description: "Char-grilled chicken with traditional spices.",
    price: "€15",
    category: "Chicken",
    image: FALLBACK_FOOD_3,
    available: true,
    visible: true,
  },
  {
    id: "demo-4",
    name: "Fresh Garden Salad",
    description: "Fresh seasonal vegetables and herbs.",
    price: "€9",
    category: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85",
    available: true,
    visible: true,
  },
];

const defaultHours: OpeningDay[] = [
  { day: "Monday", open: true, opening: "12:00", closing: "23:00" },
  { day: "Tuesday", open: true, opening: "12:00", closing: "23:00" },
  { day: "Wednesday", open: true, opening: "12:00", closing: "23:00" },
  { day: "Thursday", open: true, opening: "12:00", closing: "23:00" },
  { day: "Friday", open: true, opening: "12:00", closing: "23:30" },
  { day: "Saturday", open: true, opening: "12:00", closing: "23:30" },
  { day: "Sunday", open: true, opening: "12:00", closing: "22:30" },
];

const translations = {
  it: {
    home: "Home",
    about: "Chi Siamo",
    menu: "Menu",
    gallery: "Galleria",
    reviews: "Recensioni",
    contact: "Contatti",
    reserve: "Prenota un Tavolo",
    explore: "Scopri il Menu",
    welcome: "BENVENUTI DA NABABI RISTORANTE",
    popular: "I Nostri Piatti",
    story: "La Nostra Storia",
    booking: "Prenota il tuo Tavolo",
    bookText: "Regala a te stesso un'esperienza gastronomica indimenticabile.",
    name: "Nome",
    phone: "Telefono",
    email: "Email",
    date: "Data",
    time: "Ora",
    guests: "Ospiti",
    message: "Messaggio",
    send: "Invia Prenotazione",
    galleryTitle: "La Nostra Galleria",
    contactTitle: "Contattaci",
    address: "Indirizzo",
    opening: "Orari di Apertura",
    available: "Disponibile",
    unavailable: "Non disponibile",
    viewAll: "Vedi Tutto",
    special: "SPECIALITÀ DELLA CASA",
  },
  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    reserve: "Reserve a Table",
    explore: "Explore Menu",
    welcome: "WELCOME TO NABABI RISTORANTE",
    popular: "Our Signature Dishes",
    story: "Our Story",
    booking: "Reserve Your Table",
    bookText: "Give yourself an unforgettable dining experience.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    date: "Date",
    time: "Time",
    guests: "Guests",
    message: "Message",
    send: "Send Reservation",
    galleryTitle: "Our Gallery",
    contactTitle: "Get In Touch",
    address: "Address",
    opening: "Opening Hours",
    available: "Available",
    unavailable: "Unavailable",
    viewAll: "View All",
    special: "HOUSE SPECIALTIES",
  },
  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    reserve: "টেবিল বুক করুন",
    explore: "মেনু দেখুন",
    welcome: "NABABI RISTORANTE-এ স্বাগতম",
    popular: "আমাদের বিশেষ খাবার",
    story: "আমাদের গল্প",
    booking: "টেবিল রিজার্ভ করুন",
    bookText: "আপনার জন্য তৈরি হোক একটি স্মরণীয় dining experience।",
    name: "নাম",
    phone: "ফোন",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    guests: "অতিথি",
    message: "মেসেজ",
    send: "রিজার্ভেশন পাঠান",
    galleryTitle: "আমাদের গ্যালারি",
    contactTitle: "যোগাযোগ করুন",
    address: "ঠিকানা",
    opening: "খোলার সময়",
    available: "উপলব্ধ",
    unavailable: "অনুপলব্ধ",
    viewAll: "সব দেখুন",
    special: "আমাদের বিশেষ আয়োজন",
  },
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getTodayString() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function isDateActive(start?: string, end?: string) {
  const today = getTodayString();

  if (start && today < start) return false;
  if (end && today > end) return false;

  return true;
}

function getWhatsAppUrl(phone: string) {
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned ? `https://wa.me/${cleaned}` : "#";
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("it");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [menuCategory, setMenuCategory] = useState("All");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [settings, setSettings] = useState<any>({});
  const [languages, setLanguages] = useState<any>({});
  const [websiteStatus, setWebsiteStatus] = useState<any>({});
  const [homeSettings, setHomeSettings] = useState<any>({});
  const [about, setAbout] = useState<any>({});
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuBackground, setMenuBackground] = useState("");
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contact, setContact] = useState<any>({});
  const [openingHours, setOpeningHours] = useState<OpeningDay[]>(defaultHours);
  const [social, setSocial] = useState<any>({});

  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });

  const t = translations[language];

  const loadAllData = () => {
    const storedSettings = readStorage("nababi-settings", {});
    const storedLanguages = readStorage("nababi-languages", {});
    const storedStatus = readStorage("nababi-website-status", {});
    const storedHome = readStorage("nababi-home-settings", {});
    const storedAbout = readStorage("nababi-about", {});
    const storedMenu = readStorage<MenuItem[]>("nababi-menu", []);
    const storedCategories = readStorage<string[]>("nababi-categories", []);
    const storedBackground = readStorage("nababi-menu-background", "");
    const storedNews = readStorage<any[]>("nababi-breaking-news", []);
    const storedPromotions = readStorage<Promotion[]>("nababi-promotions", []);
    const storedGallery = readStorage<GalleryItem[]>("nababi-gallery", []);
    const storedReviews = readStorage<Review[]>("nababi-reviews", []);
    const storedContact = readStorage("nababi-contact", {});
    const storedHours = readStorage<OpeningDay[]>(
      "nababi-opening-hours",
      defaultHours
    );
    const storedSocial = readStorage("nababi-social-media", {});

    setSettings(storedSettings);
    setLanguages(storedLanguages);
    setWebsiteStatus(storedStatus);
    setHomeSettings(storedHome);
    setAbout(storedAbout);
    setMenu(storedMenu);
    setCategories(storedCategories);
    setMenuBackground(storedBackground);
    setBreakingNews(storedNews);
    setPromotions(storedPromotions);
    setGallery(storedGallery);
    setReviews(storedReviews);
    setContact(storedContact);
    setOpeningHours(storedHours?.length ? storedHours : defaultHours);
    setSocial(storedSocial);

    const defaultLanguage =
      storedLanguages?.defaultLanguage === "en" ||
      storedLanguages?.defaultLanguage === "bn" ||
      storedLanguages?.defaultLanguage === "it"
        ? storedLanguages.defaultLanguage
        : "it";

    if (!storedLanguages?.switcherVisible) {
      setLanguage(defaultLanguage);
    }
  };

  useEffect(() => {
    loadAllData();

    const handleStorage = () => loadAllData();

    window.addEventListener("storage", handleStorage);

    const timer = window.setInterval(loadAllData, 1200);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.clearInterval(timer);
    };
  }, []);

  const enabledLanguages = useMemo(() => {
    const result: Language[] = [];

    if (languages?.italian !== false) result.push("it");
    if (languages?.english !== false) result.push("en");
    if (languages?.bengali !== false) result.push("bn");

    return result.length ? result : ["it"];
  }, [languages]);

  const visibleNews = useMemo(() => {
    return breakingNews.filter(
      (item) =>
        item.visible !== false &&
        isDateActive(item.startDate, item.endDate)
    );
  }, [breakingNews]);

  const visiblePromotions = useMemo(() => {
    return promotions.filter(
      (item) =>
        item.visible !== false &&
        isDateActive(item.startDate, item.endDate)
    );
  }, [promotions]);

  const visibleMenu = useMemo(() => {
    const source = menu.length ? menu : fallbackMenu;

    return source.filter(
      (item) => item.visible !== false && item.available !== false
    );
  }, [menu]);

  const filteredMenu = useMemo(() => {
    if (menuCategory === "All") return visibleMenu;

    return visibleMenu.filter(
      (item) =>
        item.category?.toLowerCase() === menuCategory.toLowerCase()
    );
  }, [visibleMenu, menuCategory]);

  const visibleGallery = useMemo(() => {
    return [...gallery]
      .filter((item) => item.visible !== false)
      .sort(
        (a, b) =>
          Number(a.displayOrder || 0) - Number(b.displayOrder || 0)
      );
  }, [gallery]);

  const visibleReviews = useMemo(() => {
    return reviews.filter((item) => item.visible !== false);
  }, [reviews]);

  const activeHeroImage = homeSettings?.heroImage || FALLBACK_HERO;

  const restaurantName =
    settings?.restaurantName ||
    contact?.restaurantName ||
    "Nababi Ristorante";

  const phone = contact?.phone || "+39 000 000 0000";

  const whatsapp =
    contact?.whatsapp ||
    contact?.phone ||
    "+39 000 000 0000";

  const heroTitle =
    homeSettings?.heroTitle ||
    "A Taste of Tradition";

  const heroSubtitle =
    homeSettings?.heroSubtitle ||
    "Authentic flavours, warm hospitality and unforgettable moments in Rome.";

  const welcomeText =
    homeSettings?.welcomeText ||
    "Experience authentic flavours, carefully selected ingredients and warm Italian hospitality.";

  const aboutText =
    about?.content ||
    "At Nababi Ristorante, every dish is created to bring together authentic flavours, carefully selected ingredients and the warmth of genuine hospitality.";

  const aboutImage = about?.image || FALLBACK_RESTAURANT;

  const contactAddress =
    contact?.address || "Rome, Italy";

  const socialFacebook = social?.facebook || "";
  const socialInstagram = social?.instagram || "";
  const socialTikTok = social?.tiktok || "";
  const socialYoutube = social?.youtube || "";

  const isMaintenance =
    websiteStatus?.maintenanceMode === true ||
    settings?.maintenanceMode === true;

  const menuCategories = useMemo(() => {
    const fromAdmin =
      categories?.filter(Boolean).length > 0
        ? categories.filter(Boolean)
        : [];

    const fromProducts = visibleMenu
      .map((item) => item.category)
      .filter(Boolean);

    return Array.from(new Set([...fromAdmin, ...fromProducts]));
  }, [categories, visibleMenu]);

  const handleBooking = (event: FormEvent) => {
    event.preventDefault();

    if (
      !booking.name ||
      !booking.phone ||
      !booking.date ||
      !booking.time ||
      !booking.guests
    ) {
      setBookingMessage(
        language === "bn"
          ? "দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন।"
          : language === "en"
          ? "Please complete all required fields."
          : "Compila tutti i campi obbligatori."
      );
      return;
    }

    setBookingLoading(true);

    const reservations = readStorage<Reservation[]>(
      "nababi-reservations",
      []
    );

    const newReservation: Reservation = {
      id: `reservation-${Date.now()}`,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      message: booking.message,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    window.localStorage.setItem(
      "nababi-reservations",
      JSON.stringify([newReservation, ...reservations])
    );

    setBooking({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      message: "",
    });

    setBookingLoading(false);

    setBookingMessage(
      language === "bn"
        ? "আপনার রিজার্ভেশন সফলভাবে পাঠানো হয়েছে।"
        : language === "en"
        ? "Your reservation has been sent successfully."
        : "La tua prenotazione è stata inviata con successo."
    );
  };

  if (isMaintenance) {
    return (
      <main className="maintenance-screen">
        <div className="maintenance-card">
          <div className="brand-mark">N</div>
          <span className="eyebrow">NABABI RISTORANTE</span>
          <h1>We&apos;ll be back shortly.</h1>
          <p>
            Our website is currently being updated. Please check back
            soon.
          </p>
          <a href={`tel:${phone}`} className="gold-button">
            {phone}
          </a>
        </div>

        <style jsx>{`
          .maintenance-screen {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            color: #f8f1df;
            background:
              radial-gradient(circle at top, #3d2411 0%, transparent 40%),
              #050505;
            font-family: Arial, sans-serif;
          }

          .maintenance-card {
            width: min(620px, 100%);
            padding: 60px 34px;
            text-align: center;
            border: 1px solid rgba(214, 163, 76, 0.25);
            border-radius: 28px;
            background: rgba(17, 17, 17, 0.88);
            box-shadow: 0 30px 100px rgba(0, 0, 0, 0.55);
          }

          .brand-mark {
            width: 62px;
            height: 62px;
            margin: 0 auto 22px;
            display: grid;
            place-items: center;
            border: 1px solid #d6a34c;
            border-radius: 50%;
            color: #e9bd68;
            font-family: Georgia, serif;
            font-size: 32px;
          }

          .eyebrow {
            color: #d6a34c;
            font-size: 11px;
            letter-spacing: 0.28em;
          }

          h1 {
            margin: 18px 0;
            font: 400 clamp(38px, 7vw, 68px) Georgia, serif;
          }

          p {
            max-width: 480px;
            margin: 0 auto 30px;
            color: #bdb6a8;
            line-height: 1.8;
          }

          .gold-button {
            display: inline-flex;
            padding: 13px 24px;
            border-radius: 999px;
            color: #090909;
            background: linear-gradient(135deg, #f5d48b, #c68c32);
            text-decoration: none;
            font-weight: 800;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="site">
      {visibleNews.length > 0 && (
        <div className="breaking-bar">
          <div className="breaking-inner">
            <span className="breaking-label">BREAKING NEWS</span>
            <span className="breaking-dot" />
            <div className="breaking-track">
              {visibleNews.map((item) => (
                <span key={item.id}>{item.text}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="header">
        <div className="header-inner">
          <a href="#home" className="logo">
            <span className="logo-main">
              {restaurantName.split(" ")[0] || "Nababi"}
            </span>
            <span className="logo-sub">RISTORANTE</span>
          </a>

          <nav className={`desktop-nav ${mobileMenu ? "mobile-open" : ""}`}>
            <a href="#home">{t.home}</a>
            <a href="#about">{t.about}</a>
            <a href="#menu">{t.menu}</a>
            <a href="#gallery">{t.gallery}</a>
            <a href="#reviews">{t.reviews}</a>
            <a href="#contact">{t.contact}</a>
          </nav>

          <div className="header-actions">
            {languages?.switcherVisible !== false &&
              enabledLanguages.length > 1 && (
                <div className="language-switcher">
                  {enabledLanguages.map((lang) => (
                    <button
                      key={lang}
                      className={language === lang ? "active" : ""}
                      onClick={() => setLanguage(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

            <a href="#booking" className="reserve-button">
              {t.reserve}
            </a>

            <button
              className="menu-toggle"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="hero"
        style={{ backgroundImage: `url("${activeHeroImage}")` }}
      >
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">{t.welcome}</span>

            <div className="gold-line" />

            <h1>
              {heroTitle.includes(" ") ? (
                <>
                  {heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <em>{heroTitle.split(" ").slice(-1)}</em>
                </>
              ) : (
                <em>{heroTitle}</em>
              )}
            </h1>

            <p>{heroSubtitle}</p>

            <div className="hero-actions">
              <a href="#booking" className="gold-button">
                {t.reserve}
                <span>↗</span>
              </a>

              <a href="#menu" className="outline-button">
                {t.explore}
                <span>→</span>
              </a>
            </div>

            <div className="hero-location">
              <span className="location-icon">⌖</span>
              <span>{contactAddress}</span>
            </div>
          </div>

          <div className="hero-dish-card">
            <div className="dish-image">
              <img
                src={visibleMenu[0]?.image || FALLBACK_FOOD}
                alt={visibleMenu[0]?.name || "Nababi signature dish"}
              />
            </div>
            <div className="dish-info">
              <span>{t.special}</span>
              <strong>
                {visibleMenu[0]?.name || "Signature Dish"}
              </strong>
              <small>
                {visibleMenu[0]?.description ||
                  "Authentic flavours prepared with passion."}
              </small>
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-feature">
            <span className="feature-icon">✦</span>
            <div>
              <strong>Authentic Taste</strong>
              <small>Traditional recipes</small>
            </div>
          </div>

          <div className="hero-feature">
            <span className="feature-icon">◇</span>
            <div>
              <strong>Fresh Ingredients</strong>
              <small>Carefully sourced</small>
            </div>
          </div>

          <div className="hero-feature">
            <span className="feature-icon">♢</span>
            <div>
              <strong>Warm Hospitality</strong>
              <small>Family atmosphere</small>
            </div>
          </div>

          <div className="hero-feature">
            <span className="feature-icon">★</span>
            <div>
              <strong>Best Experience</strong>
              <small>Dine with pleasure</small>
            </div>
          </div>
        </div>
      </section>

      {visiblePromotions.length > 0 && (
        <section className="promotions-section">
          <div className="section-container">
            <div className="section-heading compact">
              <div>
                <span className="eyebrow">SPECIAL OFFERS</span>
                <h2>Exclusive Promotions</h2>
              </div>
            </div>

            <div className="promotion-grid">
              {visiblePromotions.slice(0, 3).map((promotion) => (
                <article className="promotion-card" key={promotion.id}>
                  {promotion.image && (
                    <img src={promotion.image} alt={promotion.title} />
                  )}

                  <div className="promotion-overlay" />

                  <div className="promotion-content">
                    {promotion.offer && (
                      <span className="offer-badge">
                        {promotion.offer}
                      </span>
                    )}
                    <h3>{promotion.title}</h3>
                    <p>{promotion.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="menu" className="menu-section">
        <div
          className="menu-bg"
          style={
            menuBackground
              ? { backgroundImage: `url("${menuBackground}")` }
              : undefined
          }
        />

        <div className="menu-bg-overlay" />

        <div className="section-container relative">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t.special}</span>
              <h2>{t.popular}</h2>
              <p>
                {language === "bn"
                  ? "আমাদের নির্বাচিত signature dishes উপভোগ করুন।"
                  : language === "en"
                  ? "Discover our carefully selected signature dishes."
                  : "Scopri la nostra selezione di piatti speciali."}
              </p>
            </div>

            <a href="#booking" className="text-link">
              {t.reserve} →
            </a>
          </div>

          <div className="category-row">
            <button
              className={menuCategory === "All" ? "active" : ""}
              onClick={() => setMenuCategory("All")}
            >
              All
            </button>

            {menuCategories.map((category) => (
              <button
                key={category}
                className={
                  menuCategory.toLowerCase() === category.toLowerCase()
                    ? "active"
                    : ""
                }
                onClick={() => setMenuCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredMenu.slice(0, 8).map((item) => (
              <article className="food-card" key={item.id}>
                <div className="food-image">
                  <img
                    src={item.image || FALLBACK_FOOD}
                    alt={item.name}
                  />

                  <span className="food-category">
                    {item.category}
                  </span>

                  <span className="food-price">{item.price}</span>
                </div>

                <div className="food-body">
                  <h3>{item.name}</h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  <div className="food-footer">
                    <span>
                      <i /> {t.available}
                    </span>
                    <a href="#booking">Order →</a>
                  </div>
                </div>
              </article>
            ))}

            {filteredMenu.length === 0 && (
              <div className="empty-state">
                <span>✦</span>
                <p>
                  {language === "bn"
                    ? "এই category-তে বর্তমানে কোনো dish নেই।"
                    : "No dishes available in this category."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="section-container about-grid">
          <div className="about-images">
            <div className="about-main-image">
              <img src={aboutImage} alt="Nababi Ristorante" />
            </div>

            <div className="about-small-image">
              <img
                src={visibleMenu[1]?.image || FALLBACK_FOOD_2}
                alt="Nababi food"
              />
            </div>

            <div className="experience-badge">
              <strong>25+</strong>
              <span>Years of<br />Passion</span>
            </div>
          </div>

          <div className="about-copy">
            <span className="eyebrow">{t.story}</span>
            <h2>
              More Than
              <br />
              <em>Just Food</em>
            </h2>

            <div className="gold-line" />

            <p>{aboutText}</p>

            <p className="muted">
              {welcomeText}
            </p>

            <a href="#contact" className="outline-button dark">
              {t.contact}
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A GLIMPSE OF NABABI</span>
              <h2>{t.galleryTitle}</h2>
            </div>

            <span className="gallery-count">
              {visibleGallery.length || 0} Photos
            </span>
          </div>

          {visibleGallery.length > 0 ? (
            <div className="gallery-grid">
              {visibleGallery.slice(0, 8).map((item, index) => (
                <div
                  className={`gallery-item gallery-${index + 1}`}
                  key={item.id}
                >
                  <img src={item.image} alt="Nababi gallery" />

                  <div className="gallery-hover">
                    <span>View</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery-placeholder">
              <div>
                <span>✦</span>
                <h3>Our Restaurant</h3>
                <p>
                  Add your restaurant photos from Admin → Gallery.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="booking" className="booking-section">
        <div className="booking-image">
          <img
            src={visibleMenu[2]?.image || FALLBACK_RESTAURANT}
            alt="Dining at Nababi"
          />
          <div className="booking-image-overlay" />
        </div>

        <div className="booking-panel">
          <span className="eyebrow">RESERVATION</span>

          <h2>
            {homeSettings?.bookingTitle ||
              t.booking}
          </h2>

          <p>
            {homeSettings?.bookingText ||
              t.bookText}
          </p>

          <form onSubmit={handleBooking}>
            <div className="form-grid">
              <label>
                <span>{t.name} *</span>
                <input
                  value={booking.name}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      name: e.target.value,
                    })
                  }
                  placeholder={t.name}
                  required
                />
              </label>

              <label>
                <span>{t.phone} *</span>
                <input
                  value={booking.phone}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+39 ..."
                  required
                />
              </label>

              <label>
                <span>{t.email}</span>
                <input
                  type="email"
                  value={booking.email}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      email: e.target.value,
                    })
                  }
                  placeholder="email@example.com"
                />
              </label>

              <label>
                <span>{t.guests} *</span>
                <select
                  value={booking.guests}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      guests: e.target.value,
                    })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(
                    (number) => (
                      <option value={number} key={number}>
                        {number} {number === 1 ? "Guest" : "Guests"}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span>{t.date} *</span>
                <input
                  type="date"
                  value={booking.date}
                  min={getTodayString()}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                <span>{t.time} *</span>
                <input
                  type="time"
                  value={booking.time}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>

            <label className="message-field">
              <span>{t.message}</span>
              <textarea
                value={booking.message}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    message: e.target.value,
                  })
                }
                placeholder={t.message}
                rows={4}
              />
            </label>

            {bookingMessage && (
              <div className="booking-message">
                {bookingMessage}
              </div>
            )}

            <button
              type="submit"
              className="gold-button submit-button"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Sending..." : t.send}
              <span>→</span>
            </button>
          </form>
        </div>
      </section>

      {visibleReviews.length > 0 && (
        <section id="reviews" className="reviews-section">
          <div className="section-container">
            <div className="section-heading centered">
              <span className="eyebrow">WHAT OUR GUESTS SAY</span>
              <h2>{t.reviews}</h2>
              <p>
                Authentic experiences from guests of Nababi Ristorante.
              </p>
            </div>

            <div className="reviews-grid">
              {visibleReviews.slice(0, 6).map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={
                          index < Number(review.rating || 0)
                            ? "filled"
                            : ""
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p>&quot;{review.review}&quot;</p>

                  <div className="review-author">
                    {review.image ? (
                      <img
                        src={review.image}
                        alt={review.customerName}
                      />
                    ) : (
                      <div className="review-avatar">
                        {review.customerName?.charAt(0) || "N"}
                      </div>
                    )}

                    <div>
                      <strong>{review.customerName}</strong>
                      <small>{review.date || "Guest"}</small>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="hours-section">
        <div className="section-container hours-grid">
          <div>
            <span className="eyebrow">{t.opening}</span>
            <h2>Come &amp; Dine With Us</h2>
            <p>
              Experience our cuisine in a warm and elegant atmosphere.
            </p>
          </div>

          <div className="hours-card">
            {openingHours.map((day) => (
              <div className="hours-row" key={day.day}>
                <span>{day.day}</span>

                {day.open ? (
                  <strong>
                    {day.opening || "12:00"} –{" "}
                    {day.closing || "23:00"}
                  </strong>
                ) : (
                  <strong className="closed">Closed</strong>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {contact?.visible !== false && (
        <section id="contact" className="contact-section">
          <div className="section-container contact-grid">
            <div className="contact-copy">
              <span className="eyebrow">{t.contactTitle}</span>

              <h2>
                Let&apos;s Make
                <br />
                <em>Memories Together</em>
              </h2>

              <p>
                {contact?.contactText ||
                  "We would love to welcome you to Nababi Ristorante."}
              </p>

              <div className="contact-list">
                <div className="contact-item">
                  <span>⌖</span>
                  <div>
                    <small>{t.address}</small>
                    <strong>{contactAddress}</strong>
                  </div>
                </div>

                <div className="contact-item">
                  <span>☎</span>
                  <div>
                    <small>{t.phone}</small>
                    <a href={`tel:${phone}`}>{phone}</a>
                  </div>
                </div>

                {contact?.email && (
                  <div className="contact-item">
                    <span>✉</span>
                    <div>
                      <small>{t.email}</small>
                      <a href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="social-links">
                {socialFacebook && (
                  <a
                    href={socialFacebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                )}

                {socialInstagram && (
                  <a
                    href={socialInstagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                )}

                {socialTikTok && (
                  <a
                    href={socialTikTok}
                    target="_blank"
                    rel="noreferrer"
                  >
                    TikTok
                  </a>
                )}

                {socialYoutube && (
                  <a
                    href={socialYoutube}
                    target="_blank"
                    rel="noreferrer"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>

            <div className="map-card">
              {contact?.googleMapsUrl ? (
                <iframe
                  src={contact.googleMapsUrl}
                  title="Nababi Ristorante Location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="map-placeholder">
                  <div className="map-pin">⌖</div>
                  <strong>{restaurantName}</strong>
                  <span>{contactAddress}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      contactAddress
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="outline-button"
                  >
                    Open Google Maps →
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="logo">
              <span className="logo-main">
                {restaurantName.split(" ")[0] || "Nababi"}
              </span>
              <span className="logo-sub">RISTORANTE</span>
            </a>

            <p>{welcomeText}</p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#home">{t.home}</a>
            <a href="#about">{t.about}</a>
            <a href="#menu">{t.menu}</a>
            <a href="#gallery">{t.gallery}</a>
          </div>

          <div className="footer-column">
            <h4>Visit</h4>
            <span>{contactAddress}</span>
            <a href={`tel:${phone}`}>{phone}</a>
            <a href={`mailto:${contact?.email || ""}`}>
              {contact?.email || "Email"}
            </a>
          </div>

          <div className="footer-column">
            <h4>Reservation</h4>
            <a href="#booking" className="footer-reserve">
              {t.reserve} →
            </a>

            <a
              href={getWhatsAppUrl(whatsapp)}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp →
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {restaurantName}. All rights
            reserved.
          </span>

          <a href="/admin">Admin Panel</a>

          <span>Rome · Italy</span>
        </div>
      </footer>

      <div className="mobile-booking-bar">
        <a href={`tel:${phone}`}>☎</a>
        <a href="#menu">{t.menu}</a>
        <a href="#booking" className="mobile-main-cta">
          {t.reserve}
        </a>
        <a
          href={getWhatsAppUrl(whatsapp)}
          target="_blank"
          rel="noreferrer"
        >
          WA
        </a>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap");

        :global(*) {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        :global(html) {
          background: #050505;
        }

        :global(body) {
          margin: 0;
          background: #050505;
          color: #f6f0e4;
          font-family: "Inter", Arial, sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        .site {
          overflow: hidden;
          background: #050505;
        }

        .breaking-bar {
          height: 34px;
          display: flex;
          align-items: center;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(212, 163, 76, 0.16);
          position: relative;
          z-index: 100;
        }

        .breaking-inner {
          width: min(1400px, calc(100% - 40px));
          margin: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          white-space: nowrap;
        }

        .breaking-label {
          color: #e4b65e;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .breaking-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #dca84c;
          flex: 0 0 auto;
        }

        .breaking-track {
          color: #aaa397;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header {
          position: absolute;
          z-index: 50;
          top: 34px;
          left: 0;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0)
          );
        }

        .header-inner {
          width: min(1400px, calc(100% - 48px));
          min-height: 88px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
          min-width: 130px;
        }

        .logo-main {
          color: #edc777;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 34px;
          font-weight: 600;
          letter-spacing: -0.03em;
        }

        .logo-sub {
          margin-top: 5px;
          color: #eee4d2;
          font-size: 7px;
          letter-spacing: 0.48em;
          padding-left: 0.48em;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .desktop-nav a {
          color: #ddd6c8;
          font-size: 11px;
          font-weight: 500;
          position: relative;
          transition: color 0.2s ease;
        }

        .desktop-nav a:hover {
          color: #e8bb68;
        }

        .desktop-nav a:first-child {
          color: #e8bb68;
        }

        .desktop-nav a:first-child::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -11px;
          height: 1px;
          background: #d9a84f;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .language-switcher {
          display: flex;
          gap: 2px;
          padding: 3px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.35);
        }

        .language-switcher button {
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #8e887d;
          padding: 5px 7px;
          font-size: 8px;
          cursor: pointer;
        }

        .language-switcher button.active {
          color: #080808;
          background: #e2b45c;
        }

        .reserve-button,
        .gold-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          border: 0;
          border-radius: 999px;
          padding: 13px 22px;
          background: linear-gradient(135deg, #f1cf85, #c48b32);
          color: #080706;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.03em;
          box-shadow: 0 10px 30px rgba(209, 157, 64, 0.2);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .reserve-button:hover,
        .gold-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(209, 157, 64, 0.32);
        }

        .menu-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.4);
          padding: 10px;
          cursor: pointer;
        }

        .menu-toggle span {
          display: block;
          height: 1px;
          margin: 4px 0;
          background: #e5c37f;
        }

        .hero {
          min-height: 800px;
          height: 100vh;
          max-height: 980px;
          position: relative;
          display: flex;
          align-items: center;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(3, 3, 3, 0.96) 0%,
              rgba(3, 3, 3, 0.83) 35%,
              rgba(3, 3, 3, 0.3) 75%,
              rgba(3, 3, 3, 0.5) 100%
            ),
            linear-gradient(
              0deg,
              rgba(3, 3, 3, 0.9),
              transparent 40%,
              rgba(0, 0, 0, 0.55)
            );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: min(1400px, calc(100% - 48px));
          margin: 90px auto 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          align-items: center;
          gap: 70px;
        }

        .hero-copy {
          max-width: 760px;
        }

        .eyebrow {
          display: inline-block;
          color: #dfb25b;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
        }

        .gold-line {
          width: 58px;
          height: 1px;
          margin: 18px 0 22px;
          background: linear-gradient(
            90deg,
            #e6b85d,
            transparent
          );
        }

        .hero h1 {
          max-width: 760px;
          margin: 0;
          color: #fff9eb;
          font: 500 clamp(65px, 8vw, 118px) / 0.83
            "Cormorant Garamond", Georgia, serif;
          letter-spacing: -0.055em;
        }

        .hero h1 em,
        .about-copy h2 em,
        .contact-copy h2 em {
          color: #e8ba65;
          font-style: italic;
          font-weight: 500;
        }

        .hero-copy p {
          max-width: 520px;
          margin: 30px 0;
          color: #d1cabe;
          font-size: 14px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
        }

        .outline-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 12px 21px;
          border: 1px solid rgba(226, 181, 94, 0.5);
          border-radius: 999px;
          color: #eadcc2;
          background: rgba(0, 0, 0, 0.22);
          font-size: 10px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .outline-button:hover {
          background: rgba(222, 174, 81, 0.1);
          border-color: #e0af52;
        }

        .outline-button.dark {
          border-color: rgba(125, 87, 38, 0.5);
          color: #5e421f;
          background: transparent;
        }

        .hero-location {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 34px;
          color: #928c82;
          font-size: 10px;
          letter-spacing: 0.04em;
        }

        .location-icon {
          color: #dcae57;
          font-size: 17px;
        }

        .hero-dish-card {
          position: relative;
          align-self: end;
          margin-bottom: 100px;
          border: 1px solid rgba(232, 186, 98, 0.35);
          background: rgba(8, 8, 8, 0.55);
          backdrop-filter: blur(12px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }

        .dish-image {
          height: 250px;
          overflow: hidden;
        }

        .dish-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .dish-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dish-info span {
          color: #d7a84f;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .dish-info strong {
          font: 500 29px "Cormorant Garamond", Georgia, serif;
          color: #fff7e7;
        }

        .dish-info small {
          color: #a8a197;
          line-height: 1.6;
          font-size: 10px;
        }

        .hero-bottom {
          position: absolute;
          z-index: 4;
          left: 0;
          right: 0;
          bottom: 0;
          min-height: 105px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 20px max(24px, calc((100vw - 1400px) / 2));
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(4, 4, 4, 0.65);
          backdrop-filter: blur(14px);
        }

        .hero-feature {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hero-feature:last-child {
          border-right: 0;
        }

        .feature-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(222, 172, 77, 0.45);
          border-radius: 50%;
          color: #e1b35a;
        }

        .hero-feature strong,
        .hero-feature small {
          display: block;
        }

        .hero-feature strong {
          color: #e5dfd1;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .hero-feature small {
          color: #78736b;
          font-size: 8px;
        }

        .promotions-section {
          padding: 90px 0 30px;
          background: #080808;
        }

        .section-container {
          width: min(1300px, calc(100% - 48px));
          margin: auto;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 36px;
        }

        .section-heading.compact {
          margin-bottom: 28px;
        }

        .section-heading.centered {
          display: block;
          text-align: center;
        }

        .section-heading h2 {
          margin: 10px 0 0;
          color: #f7efdf;
          font: 500 clamp(42px, 5vw, 68px) / 0.9
            "Cormorant Garamond", Georgia, serif;
          letter-spacing: -0.04em;
        }

        .section-heading p {
          max-width: 520px;
          margin: 14px 0 0;
          color: #817c73;
          font-size: 12px;
          line-height: 1.7;
        }

        .text-link {
          color: #dfb35d;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .promotion-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .promotion-card {
          min-height: 270px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .promotion-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .promotion-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.94),
            rgba(0, 0, 0, 0.05)
          );
        }

        .promotion-content {
          position: absolute;
          z-index: 2;
          left: 24px;
          right: 24px;
          bottom: 24px;
        }

        .offer-badge {
          display: inline-block;
          margin-bottom: 10px;
          padding: 5px 9px;
          border: 1px solid #d7a84f;
          color: #e5b85e;
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .promotion-content h3 {
          margin: 0 0 6px;
          font: 500 29px "Cormorant Garamond", Georgia, serif;
        }

        .promotion-content p {
          margin: 0;
          color: #b6aea0;
          font-size: 10px;
          line-height: 1.5;
        }

        .menu-section {
          position: relative;
          padding: 105px 0;
          background: #0b0b0b;
          overflow: hidden;
        }

        .menu-bg {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0.13;
          filter: saturate(0.5);
        }

        .menu-bg-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(110, 64, 21, 0.22),
              transparent 35%
            ),
            linear-gradient(
              180deg,
              #0b0b0b,
              rgba(11, 11, 11, 0.91),
              #0b0b0b
            );
        }

        .relative {
          position: relative;
          z-index: 2;
        }

        .category-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
        }

        .category-row button {
          padding: 9px 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #999187;
          background: rgba(255, 255, 255, 0.025);
          font-size: 9px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .category-row button:hover,
        .category-row button.active {
          border-color: rgba(222, 175, 81, 0.65);
          color: #0a0a0a;
          background: #dcae55;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .food-card {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(18, 18, 18, 0.9);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .food-card:hover {
          transform: translateY(-6px);
          border-color: rgba(222, 174, 80, 0.38);
        }

        .food-image {
          height: 220px;
          position: relative;
          overflow: hidden;
        }

        .food-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .food-card:hover .food-image img {
          transform: scale(1.05);
        }

        .food-category {
          position: absolute;
          left: 12px;
          top: 12px;
          padding: 5px 8px;
          color: #e9bd6a;
          border: 1px solid rgba(225, 177, 81, 0.5);
          background: rgba(0, 0, 0, 0.65);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .food-price {
          position: absolute;
          right: 12px;
          bottom: 12px;
          padding: 6px 10px;
          color: #080808;
          background: #e1b35d;
          font-size: 10px;
          font-weight: 800;
        }

        .food-body {
          padding: 19px;
        }

        .food-body h3 {
          margin: 0 0 8px;
          color: #f4ecdd;
          font: 600 25px "Cormorant Garamond", Georgia, serif;
        }

        .food-body p {
          min-height: 35px;
          margin: 0;
          color: #8f8a81;
          font-size: 9px;
          line-height: 1.55;
        }

        .food-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .food-footer span {
          color: #77736d;
          font-size: 8px;
        }

        .food-footer span i {
          width: 5px;
          height: 5px;
          display: inline-block;
          margin-right: 5px;
          border-radius: 50%;
          background: #86a65b;
        }

        .food-footer a {
          color: #dfb158;
          font-size: 8px;
          font-weight: 700;
        }

        .empty-state {
          grid-column: 1 / -1;
          min-height: 200px;
          display: grid;
          place-items: center;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          color: #777;
          text-align: center;
        }

        .empty-state span {
          display: block;
          color: #dcae55;
          font-size: 28px;
        }

        .empty-state p {
          font-size: 11px;
        }

        .about-section {
          padding: 120px 0;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(95, 55, 18, 0.18),
              transparent 38%
            ),
            #0d0d0d;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 90px;
        }

        .about-images {
          min-height: 600px;
          position: relative;
        }

        .about-main-image {
          position: absolute;
          left: 0;
          top: 0;
          width: 78%;
          height: 510px;
          overflow: hidden;
          border: 1px solid rgba(223, 176, 82, 0.2);
        }

        .about-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-small-image {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 48%;
          height: 280px;
          padding: 7px;
          background: #0d0d0d;
          border: 1px solid rgba(222, 176, 83, 0.3);
        }

        .about-small-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .experience-badge {
          position: absolute;
          left: 58%;
          top: 45%;
          width: 105px;
          height: 105px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid #c99b49;
          border-radius: 50%;
          background: #0b0b0b;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.55);
        }

        .experience-badge strong {
          color: #e7b961;
          font: 500 33px "Cormorant Garamond", Georgia, serif;
        }

        .experience-badge span {
          color: #a7a097;
          font-size: 7px;
          text-align: center;
          line-height: 1.3;
        }

        .about-copy h2,
        .contact-copy h2 {
          margin: 14px 0 20px;
          color: #f5eddd;
          font: 500 clamp(50px, 6vw, 76px) / 0.84
            "Cormorant Garamond", Georgia, serif;
          letter-spacing: -0.045em;
        }

        .about-copy p {
          color: #a19a8e;
          font-size: 13px;
          line-height: 1.9;
        }

        .about-copy .muted {
          color: #6e6a63;
          font-size: 11px;
        }

        .gallery-section {
          padding: 110px 0;
          background: #070707;
        }

        .gallery-count {
          color: #6f6a62;
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.8fr 0.8fr;
          grid-template-rows: 230px 230px;
          gap: 10px;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          background: #111;
        }

        .gallery-1 {
          grid-row: 1 / 3;
        }

        .gallery-4 {
          grid-column: 2 / 4;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .gallery-hover {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .gallery-hover span {
          padding: 10px 17px;
          border: 1px solid #e0b15b;
          border-radius: 999px;
          color: #e0b15b;
          font-size: 9px;
        }

        .gallery-item:hover img {
          transform: scale(1.06);
        }

        .gallery-item:hover .gallery-hover {
          opacity: 1;
        }

        .gallery-placeholder {
          min-height: 440px;
          display: grid;
          place-items: center;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(
              135deg,
              rgba(214, 165, 75, 0.06),
              transparent
            );
        }

        .gallery-placeholder span {
          color: #d9a94f;
          font-size: 32px;
        }

        .gallery-placeholder h3 {
          margin: 15px 0 5px;
          font: 500 38px "Cormorant Garamond", Georgia, serif;
        }

        .gallery-placeholder p {
          color: #6d6962;
          font-size: 10px;
        }

        .booking-section {
          min-height: 720px;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          background: #101010;
        }

        .booking-image {
          position: relative;
          min-height: 700px;
        }

        .booking-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .booking-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.15),
              rgba(0, 0, 0, 0.72)
            ),
            linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.55),
              transparent 50%
            );
        }

        .booking-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px clamp(28px, 7vw, 110px);
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(115, 65, 18, 0.22),
              transparent 35%
            ),
            #101010;
        }

        .booking-panel h2 {
          margin: 12px 0 10px;
          color: #f4eddf;
          font: 500 clamp(45px, 5vw, 70px) / 0.9
            "Cormorant Garamond", Georgia, serif;
          letter-spacing: -0.04em;
        }

        .booking-panel > p {
          max-width: 500px;
          margin: 0 0 30px;
          color: #8e887e;
          font-size: 11px;
          line-height: 1.7;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        label span {
          color: #817a70;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.11);
          outline: none;
          border-radius: 0;
          color: #e8e0d2;
          background: rgba(255, 255, 255, 0.035);
          padding: 13px 14px;
          font: 400 11px "Inter", sans-serif;
          transition: border-color 0.2s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(220, 170, 78, 0.7);
        }

        input::placeholder,
        textarea::placeholder {
          color: #57534d;
        }

        select {
          color-scheme: dark;
        }

        .message-field {
          margin-top: 15px;
        }

        textarea {
          resize: vertical;
        }

        .booking-message {
          margin-top: 14px;
          padding: 12px;
          border: 1px solid rgba(220, 172, 79, 0.35);
          color: #dfb45f;
          background: rgba(220, 172, 79, 0.06);
          font-size: 10px;
        }

        .submit-button {
          margin-top: 18px;
          cursor: pointer;
        }

        .submit-button:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .reviews-section {
          padding: 110px 0;
          background: #090909;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 50px;
        }

        .review-card {
          min-height: 250px;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            );
          backdrop-filter: blur(8px);
        }

        .stars {
          display: flex;
          gap: 3px;
        }

        .stars span {
          color: #403b33;
          font-size: 12px;
        }

        .stars span.filled {
          color: #dfb05a;
        }

        .review-card > p {
          min-height: 90px;
          margin: 20px 0;
          color: #b5aea1;
          font: italic 400 17px / 1.55 "Cormorant Garamond", Georgia, serif;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 11px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .review-author img,
        .review-avatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          object-fit: cover;
        }

        .review-avatar {
          display: grid;
          place-items: center;
          color: #e2b35b;
          border: 1px solid #775a2e;
          background: #17130d;
          font: 500 19px "Cormorant Garamond", Georgia, serif;
        }

        .review-author strong,
        .review-author small {
          display: block;
        }

        .review-author strong {
          color: #ddd5c6;
          font-size: 9px;
        }

        .review-author small {
          margin-top: 4px;
          color: #625e57;
          font-size: 7px;
        }

        .hours-section {
          padding: 100px 0;
          background:
            radial-gradient(
              circle at 10% 50%,
              rgba(114, 63, 19, 0.17),
              transparent 35%
            ),
            #0d0d0d;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hours-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 90px;
          align-items: center;
        }

        .hours-grid h2 {
          margin: 12px 0;
          color: #f4eddf;
          font: 500 57px / 0.95 "Cormorant Garamond", Georgia, serif;
        }

        .hours-grid > div:first-child p {
          max-width: 420px;
          color: #7e786f;
          font-size: 11px;
          line-height: 1.8;
        }

        .hours-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .hours-row:last-child {
          border-bottom: 0;
        }

        .hours-row span {
          color: #a7a097;
          font-size: 10px;
        }

        .hours-row strong {
          color: #ddb15b;
          font-size: 9px;
          font-weight: 600;
        }

        .hours-row strong.closed {
          color: #635e56;
        }

        .contact-section {
          padding: 120px 0;
          background: #080808;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 70px;
          align-items: stretch;
        }

        .contact-copy h2 {
          margin-bottom: 20px;
        }

        .contact-copy > p {
          max-width: 480px;
          color: #8c857a;
          font-size: 12px;
          line-height: 1.8;
        }

        .contact-list {
          margin-top: 35px;
        }

        .contact-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .contact-item > span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(222, 175, 81, 0.4);
          border-radius: 50%;
          color: #dbae58;
          font-size: 12px;
        }

        .contact-item small,
        .contact-item strong,
        .contact-item a {
          display: block;
        }

        .contact-item small {
          margin-bottom: 5px;
          color: #5e5952;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .contact-item strong,
        .contact-item a {
          color: #c8c0b3;
          font-size: 10px;
          font-weight: 500;
          line-height: 1.5;
        }

        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 30px;
        }

        .social-links a {
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #938d82;
          font-size: 8px;
          transition: 0.2s ease;
        }

        .social-links a:hover {
          color: #e2b45c;
          border-color: #8d682e;
        }

        .map-card {
          min-height: 480px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #111;
        }

        .map-card iframe {
          width: 100%;
          height: 100%;
          min-height: 480px;
          display: block;
          border: 0;
          filter: grayscale(0.85) contrast(1.05);
        }

        .map-placeholder {
          min-height: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          background:
            radial-gradient(
              circle at center,
              rgba(145, 88, 27, 0.22),
              transparent 45%
            ),
            #111;
        }

        .map-pin {
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          margin-bottom: 10px;
          border: 1px solid #9a6e2d;
          border-radius: 50%;
          color: #e1b35a;
          font-size: 25px;
        }

        .map-placeholder strong {
          color: #ede5d7;
          font: 500 29px "Cormorant Garamond", Georgia, serif;
        }

        .map-placeholder span {
          margin-bottom: 15px;
          color: #777169;
          font-size: 10px;
        }

        .footer {
          background: #040404;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .footer-top {
          width: min(1300px, calc(100% - 48px));
          margin: auto;
          padding: 75px 0;
          display: grid;
          grid-template-columns: 1.5fr 0.7fr 1fr 0.8fr;
          gap: 55px;
        }

        .footer-brand {
          max-width: 320px;
        }

        .footer-brand .logo {
          align-items: flex-start;
        }

        .footer-brand p {
          margin-top: 22px;
          color: #666159;
          font-size: 10px;
          line-height: 1.8;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-column h4 {
          margin: 0 0 10px;
          color: #e3b660;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .footer-column a,
        .footer-column span {
          color: #747068;
          font-size: 9px;
          line-height: 1.6;
        }

        .footer-column a:hover {
          color: #dcae55;
        }

        .footer-reserve {
          color: #e0b158 !important;
        }

        .footer-bottom {
          width: min(1300px, calc(100% - 48px));
          margin: auto;
          padding: 20px 0 28px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #4e4a44;
          font-size: 8px;
        }

        .footer-bottom a {
          color: #80622f;
        }

        .mobile-booking-bar {
          display: none;
        }

        @media (max-width: 1100px) {
          .desktop-nav {
            gap: 17px;
          }

          .hero-content {
            grid-template-columns: 1fr 300px;
            gap: 35px;
          }

          .hero-dish-card {
            margin-bottom: 90px;
          }

          .menu-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .about-grid {
            gap: 45px;
          }

          .footer-top {
            gap: 30px;
          }
        }

        @media (max-width: 850px) {
          .header-inner {
            min-height: 74px;
          }

          .desktop-nav {
            display: none;
            position: absolute;
            top: 74px;
            left: 0;
            right: 0;
            padding: 20px 24px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            background: rgba(5, 5, 5, 0.98);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .desktop-nav.mobile-open {
            display: flex;
          }

          .desktop-nav a {
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .desktop-nav a:first-child::after {
            display: none;
          }

          .menu-toggle {
            display: block;
          }

          .header-actions .reserve-button {
            display: none;
          }

          .hero {
            min-height: 900px;
            height: auto;
            padding: 130px 0 120px;
          }

          .hero-content {
            grid-template-columns: 1fr;
            margin-top: 40px;
          }

          .hero-dish-card {
            display: none;
          }

          .hero h1 {
            font-size: clamp(62px, 15vw, 95px);
          }

          .hero-bottom {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-feature:nth-child(2) {
            border-right: 0;
          }

          .hero-feature:nth-child(-n + 2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .promotion-grid {
            grid-template-columns: 1fr;
          }

          .menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-grid,
          .hours-grid,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .about-images {
            min-height: 550px;
          }

          .reviews-grid {
            grid-template-columns: 1fr 1fr;
          }

          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .breaking-inner,
          .header-inner,
          .section-container,
          .footer-top,
          .footer-bottom {
            width: min(100% - 28px, 1300px);
          }

          .logo-main {
            font-size: 29px;
          }

          .language-switcher {
            display: none;
          }

          .hero {
            min-height: 800px;
          }

          .hero-content {
            margin-top: 20px;
          }

          .hero h1 {
            font-size: 65px;
          }

          .hero-copy p {
            font-size: 12px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-actions .gold-button,
          .hero-actions .outline-button {
            width: 100%;
          }

          .hero-bottom {
            padding: 12px 14px;
          }

          .hero-feature {
            justify-content: flex-start;
            gap: 9px;
          }

          .hero-feature strong {
            font-size: 8px;
          }

          .hero-feature small {
            font-size: 6px;
          }

          .feature-icon {
            width: 29px;
            height: 29px;
            font-size: 10px;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .section-heading h2 {
            font-size: 50px;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }

          .food-image {
            height: 245px;
          }

          .about-section,
          .gallery-section,
          .reviews-section,
          .contact-section {
            padding: 80px 0;
          }

          .about-images {
            min-height: 430px;
          }

          .about-main-image {
            width: 84%;
            height: 350px;
          }

          .about-small-image {
            width: 53%;
            height: 190px;
          }

          .experience-badge {
            width: 85px;
            height: 85px;
            left: 55%;
            top: 39%;
          }

          .experience-badge strong {
            font-size: 27px;
          }

          .gallery-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 180px 180px 180px;
          }

          .gallery-1 {
            grid-row: auto;
            grid-column: 1 / 3;
          }

          .gallery-4 {
            grid-column: auto;
          }

          .booking-section {
            grid-template-columns: 1fr;
          }

          .booking-image {
            min-height: 330px;
          }

          .booking-panel {
            padding: 65px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .hours-grid {
            gap: 35px;
          }

          .hours-grid h2 {
            font-size: 48px;
          }

          .contact-grid {
            gap: 35px;
          }

          .map-card,
          .map-card iframe,
          .map-placeholder {
            min-height: 350px;
          }

          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 40px 20px;
            padding-bottom: 110px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-wrap: wrap;
            padding-bottom: 90px;
          }

          .mobile-booking-bar {
            position: fixed;
            z-index: 200;
            bottom: 0;
            left: 0;
            right: 0;
            display: grid;
            grid-template-columns: 42px 1fr 1.4fr 42px;
            gap: 1px;
            padding: 8px;
            background: rgba(5, 5, 5, 0.94);
            border-top: 1px solid rgba(221, 174, 80, 0.2);
            backdrop-filter: blur(15px);
          }

          .mobile-booking-bar a {
            min-height: 40px;
            display: grid;
            place-items: center;
            color: #a69e91;
            font-size: 9px;
            border: 1px solid rgba(255, 255, 255, 0.06);
          }

          .mobile-booking-bar .mobile-main-cta {
            color: #080706;
            background: linear-gradient(135deg, #f0ca7b, #c48a31);
            font-weight: 800;
          }
        }
      `}</style>
    </main>
  );
}
