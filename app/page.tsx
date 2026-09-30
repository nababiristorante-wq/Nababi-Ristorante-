```tsx
"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Lang = "it" | "en" | "bn";

type MenuItem = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  price?: string | number;
  category?: string;
  image?: string;
  available?: boolean;
};

type GalleryItem = {
  id: string;
  image: string;
  title?: string;
};

type Promotion = {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  active?: boolean;
};

type Review = {
  id: string;
  name?: string;
  text?: string;
  rating?: number;
  active?: boolean;
};

type Settings = {
  restaurantName?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  heroImage?: string;
  breakingNews?: string;
  openingHours?: string;
};

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=85";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
];

const FALLBACK_MENU: MenuItem[] = [
  {
    id: "fallback-1",
    name: "Nababi Special",
    description:
      "A signature selection prepared with care.",
    price: "€18",
    category: "Specialità",
  },
  {
    id: "fallback-2",
    name: "Pasta della Casa",
    description:
      "Fresh pasta with a rich homemade sauce.",
    price: "€14",
    category: "Primi",
  },
  {
    id: "fallback-3",
    name: "Pollo Tandoori",
    description:
      "Tender chicken marinated with aromatic spices.",
    price: "€16",
    category: "Secondi",
  },
];

const translations = {
  it: {
    home: "Home",
    about: "Chi Siamo",
    menu: "Menu",
    booking: "Prenota",
    contact: "Contatti",
    reserve: "Prenota il Tavolo",
    heroEyebrow: "Esperienza Gastronomica Autentica",
    heroTitle: "Benvenuti da Nababi Ristorante",
    heroDescription:
      "Autentica cucina italiana e sapori internazionali nel cuore di Roma.",
    discover: "Scopri il Menu",
    aboutEyebrow: "Nababi Ristorante",
    aboutTitle: "La Nostra Storia",
    aboutText:
      "Benvenuti da Nababi Ristorante. Gustate ottimo cibo, calorosa ospitalità e un'esperienza indimenticabile nel cuore di Roma.",
    menuEyebrow: "Menu",
    menuTitle: "Il Nostro Menu",
    galleryEyebrow: "Nababi Ristorante",
    galleryTitle: "La Nostra Galleria",
    bookingEyebrow: "Prenotazioni",
    bookingTitle: "Prenota il Tavolo",
    name: "Nome",
    email: "Email",
    date: "Data",
    time: "Ora",
    guests: "Ospiti",
    message: "Messaggio",
    send: "Invia Prenotazione",
    bookingSaved:
      "Richiesta di prenotazione inviata.",
    reviewsEyebrow: "Recensioni",
    reviewsTitle: "Cosa Dicono i Nostri Ospiti",
    hoursEyebrow: "Orari",
    hoursTitle: "Opening Hours",
    contactTitle: "Contatti",
    address: "Indirizzo",
    phone: "Telefono",
    whatsapp: "WhatsApp",
    call: "Chiama",
    follow: "Seguici",
    footerText:
      "Italian tradition, international flavours and Roman hospitality.",
    allRights: "Tutti i diritti riservati.",
    noMenu: "Nessun piatto disponibile.",
    noReviews: "Nessuna recensione disponibile.",
    noPromotions: "Nessuna promozione disponibile.",
  },

  en: {
    home: "Home",
    about: "About Us",
    menu: "Menu",
    booking: "Booking",
    contact: "Contact",
    reserve: "Book a Table",
    heroEyebrow: "Authentic Dining Experience",
    heroTitle: "Welcome to Nababi Ristorante",
    heroDescription:
      "Authentic Italian cuisine and international flavours in the heart of Rome.",
    discover: "Discover the Menu",
    aboutEyebrow: "Nababi Ristorante",
    aboutTitle: "Our Story",
    aboutText:
      "Welcome to Nababi Ristorante. Enjoy delicious food, warm hospitality and a memorable dining experience in the heart of Rome.",
    menuEyebrow: "Menu",
    menuTitle: "Our Menu",
    galleryEyebrow: "Nababi Ristorante",
    galleryTitle: "Our Gallery",
    bookingEyebrow: "Reservations",
    bookingTitle: "Book Your Table",
    name: "Name",
    email: "Email",
    date: "Date",
    time: "Time",
    guests: "Guests",
    message: "Message",
    send: "Send Reservation",
    bookingSaved:
      "Your reservation request has been sent.",
    reviewsEyebrow: "Reviews",
    reviewsTitle: "What Our Guests Say",
    hoursEyebrow: "Hours",
    hoursTitle: "Opening Hours",
    contactTitle: "Contact",
    address: "Address",
    phone: "Phone",
    whatsapp: "WhatsApp",
    call: "Call",
    follow: "Follow Us",
    footerText:
      "Italian tradition, international flavours and Roman hospitality.",
    allRights: "All rights reserved.",
    noMenu: "No menu items available.",
    noReviews: "No reviews available.",
    noPromotions: "No promotions available.",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    booking: "বুকিং",
    contact: "যোগাযোগ",
    reserve: "টেবিল বুক করুন",
    heroEyebrow: "অথেন্টিক ডাইনিং এক্সপেরিয়েন্স",
    heroTitle: "নাবাবি রিস্টোরান্তেতে স্বাগতম",
    heroDescription:
      "রোমের হৃদয়ে ইতালিয়ান ঐতিহ্য ও আন্তর্জাতিক স্বাদের অনন্য সমন্বয়।",
    discover: "মেনু দেখুন",
    aboutEyebrow: "Nababi Ristorante",
    aboutTitle: "আমাদের গল্প",
    aboutText:
      "Nababi Ristorante-এ আপনাকে স্বাগতম। সুস্বাদু খাবার, আন্তরিক আতিথেয়তা এবং রোমের প্রাণকেন্দ্রে একটি স্মরণীয় ডাইনিং অভিজ্ঞতা উপভোগ করুন।",
    menuEyebrow: "মেনু",
    menuTitle: "আমাদের মেনু",
    galleryEyebrow: "Nababi Ristorante",
    galleryTitle: "আমাদের গ্যালারি",
    bookingEyebrow: "রিজার্ভেশন",
    bookingTitle: "টেবিল বুক করুন",
    name: "নাম",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    guests: "অতিথি",
    message: "বার্তা",
    send: "বুকিং পাঠান",
    bookingSaved:
      "আপনার বুকিং অনুরোধ পাঠানো হয়েছে।",
    reviewsEyebrow: "রিভিউ",
    reviewsTitle: "আমাদের অতিথিরা কী বলেন",
    hoursEyebrow: "সময়সূচি",
    hoursTitle: "খোলার সময়",
    contactTitle: "যোগাযোগ",
    address: "ঠিকানা",
    phone: "ফোন",
    whatsapp: "WhatsApp",
    call: "কল করুন",
    follow: "আমাদের অনুসরণ করুন",
    footerText:
      "ইতালিয়ান ঐতিহ্য, আন্তর্জাতিক স্বাদ এবং রোমান আতিথেয়তা।",
    allRights: "সর্বস্বত্ব সংরক্ষিত।",
    noMenu: "কোনো মেনু আইটেম পাওয়া যায়নি।",
    noReviews: "কোনো রিভিউ পাওয়া যায়নি।",
    noPromotions: "কোনো প্রমোশন পাওয়া যায়নি।",
  },
};

function readStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getWhatsappUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  return "https://wa.me/" + cleanPhone;
}

function getImage(
  image: string | undefined,
  fallback: string
): string {
  return image && image.trim() ? image : fallback;
}

function normalizeMenuItems(
  items: MenuItem[]
): MenuItem[] {
  return items
    .filter((item) => item && item.available !== false)
    .map((item, index) => ({
      ...item,
      id: item.id || "menu-" + String(index),
      name: item.name || item.title || "Nababi Special",
    }));
}

function normalizeGallery(
  items: GalleryItem[]
): GalleryItem[] {
  return items
    .filter((item) => item && item.image)
    .map((item, index) => ({
      ...item,
      id: item.id || "gallery-" + String(index),
    }));
}

export default function Home() {
  const [lang, setLang] =
    useState<Lang>("it");

  const [menu, setMenu] =
    useState<MenuItem[]>([]);

  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [promotions, setPromotions] =
    useState<Promotion[]>([]);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [settings, setSettings] =
    useState<Settings>({});

  const [bookingMessage, setBookingMessage] =
    useState("");

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });

  const t = translations[lang];

  useEffect(() => {
    function loadData() {
      const storedMenu = readStorage<MenuItem[]>(
        "nababi-menu",
        []
      );

      const storedGallery =
        readStorage<GalleryItem[]>(
          "nababi-gallery",
          []
        );

      const storedSettings =
        readStorage<Settings>(
          "nababi-settings",
          {}
        );

      const storedPromotions =
        readStorage<Promotion[]>(
          "nababi-promotions",
          readStorage<Promotion[]>(
            "nababi-promotion",
            []
          )
        );

      const storedReviews =
        readStorage<Review[]>(
          "nababi-reviews",
          readStorage<Review[]>(
            "nababi-review",
            []
          )
        );

      setMenu(normalizeMenuItems(storedMenu));
      setGallery(normalizeGallery(storedGallery));
      setSettings(storedSettings);
      setPromotions(storedPromotions);
      setReviews(storedReviews);
    }

    loadData();

    function handleStorage() {
      loadData();
    }

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "focus",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "focus",
        handleStorage
      );
    };
  }, []);

  const restaurantName =
    settings.restaurantName ||
    "Nababi Ristorante";

  const address =
    settings.address ||
    "Via Vespasiano 73/75/77, Roma";

  const phone =
    settings.phone ||
    "+39 393 3805350";

  const whatsapp =
    settings.whatsapp ||
    "+39 333 7687319";

  const heroImage = getImage(
    settings.heroImage,
    FALLBACK_HERO
  );

  const breakingNews =
    settings.breakingNews ||
    "Benvenuti da Nababi Ristorante • Roma";

  const openingHours =
    settings.openingHours ||
    "Monday — 12:00 – 23:00\nTuesday — 12:00 – 23:00\nWednesday — 12:00 – 23:00\nThursday — 12:00 – 23:00\nFriday — 12:00 – 23:00\nSaturday — 12:00 – 23:00\nSunday — 12:00 – 23:00";

  const visiblePromotions = useMemo(
    () =>
      promotions.filter(
        (promotion) =>
          promotion && promotion.active !== false
      ),
    [promotions]
  );

  const visibleReviews = useMemo(
    () =>
      reviews.filter(
        (review) =>
          review && review.active !== false
      ),
    [reviews]
  );

  const displayMenu =
    menu.length > 0
      ? menu
      : FALLBACK_MENU;

  const displayGallery =
    gallery.length > 0
      ? gallery
      : FALLBACK_GALLERY.map(
          (image, index) => ({
            id: "fallback-" + String(index),
            image,
            title: restaurantName,
          })
        );

  function handleBookingSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const reservation = {
      id:
        "reservation-" +
        String(Date.now()),
      ...booking,
      createdAt:
        new Date().toISOString(),
    };

    try {
      const current =
        readStorage<any[]>(
          "nababi-reservations",
          []
        );

      window.localStorage.setItem(
        "nababi-reservations",
        JSON.stringify([
          ...current,
          reservation,
        ])
      );

      setBookingMessage(
        t.bookingSaved
      );

      setBooking({
        name: "",
        email: "",
        date: "",
        time: "",
        guests: "2",
        message: "",
      });
    } catch {
      setBookingMessage(
        "Unable to save the reservation."
      );
    }
  }

  return (
    <main className="nababi-site">
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#home"
            className="brand"
          >
            <span className="brand-mark">
              N
            </span>

            <span>
              <strong>
                {restaurantName}
              </strong>

              <small>
                Roma • Ristorante
              </small>
            </span>
          </a>

          <nav className="desktop-nav">
            <a href="#home">
              {t.home}
            </a>

            <a href="#about">
              {t.about}
            </a>

            <a href="#menu">
              {t.menu}
            </a>

            <a href="#booking">
              {t.booking}
            </a>

            <a href="#contact">
              {t.contact}
            </a>
          </nav>

          <div className="language-switcher">
            <button
              type="button"
              onClick={() => setLang("it")}
              className={
                lang === "it"
                  ? "active"
                  : ""
              }
            >
              🇮🇹 Italiano
            </button>

            <button
              type="button"
              onClick={() => setLang("en")}
              className={
                lang === "en"
                  ? "active"
                  : ""
              }
            >
              🇬🇧 English
            </button>

            <button
              type="button"
              onClick={() => setLang("bn")}
              className={
                lang === "bn"
                  ? "active"
                  : ""
              }
            >
              🇧🇩 বাংলা
            </button>
          </div>

          <a
            href="#booking"
            className="btn btn-primary header-booking"
          >
            {t.reserve}
          </a>

          <button
            type="button"
            className="mobile-menu"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </header>

      <section
        id="home"
        className="hero"
        style={{
          backgroundImage:
            "url(\"" +
            heroImage +
            "\")",
        }}
      >
        <div className="hero-overlay" />

        <div className="container hero-content">
          <p className="eyebrow">
            ✦ {t.heroEyebrow}
          </p>

          <h1>
            {t.heroTitle}
          </h1>

          <div className="gold-line" />

          <p className="hero-description">
            {t.heroDescription}
          </p>

          <div className="hero-actions">
            <a
              href="#booking"
              className="btn btn-primary"
            >
              {t.reserve}
            </a>

            <a
              href="#menu"
              className="btn btn-outline"
            >
              {t.discover}
            </a>
          </div>

          <div className="hero-meta">
            <span>✦ Rome</span>
            <span>
              ✦ Via Vespasiano
            </span>
            <span>
              ✦ Fine Dining
            </span>
          </div>
        </div>
      </section>

      <div className="news-bar">
        <div className="container">
          <span>✦</span>
          <p>{breakingNews}</p>
        </div>
      </div>

      <section
        id="about"
        className="about section"
      >
        <div className="container about-grid">
          <div className="about-image">
            <img
              src={getImage(
                displayGallery[0]?.image,
                FALLBACK_GALLERY[0]
              )}
              alt={restaurantName}
            />

            <div className="about-badge">
              <strong>N</strong>
              <span>
                {restaurantName}
              </span>
            </div>
          </div>

          <div className="section-copy">
            <p className="eyebrow">
              ✦ {t.aboutEyebrow}
            </p>

            <h2>
              {t.aboutTitle}
            </h2>

            <div className="gold-line" />

            <p>
              {t.aboutText}
            </p>

            <p>
              Italian tradition, international
              flavours and Roman hospitality
              come together at our table.
            </p>

            <a
              href="#booking"
              className="btn btn-primary"
            >
              {t.reserve}
            </a>
          </div>
        </div>
      </section>

      <section
        className="promotions section"
      >
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              ✦ Nababi Ristorante
            </p>

            <h2>
              Promotions
            </h2>

            <div className="gold-line" />
          </div>

          {visiblePromotions.length > 0 ? (
            <div className="promotion-grid">
              {visiblePromotions.map(
                (promotion) => (
                  <article
                    className="promotion-card"
                    key={promotion.id}
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
                      <h3>
                        {promotion.title}
                      </h3>

                      <p>
                        {
                          promotion.description
                        }
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">
              {t.noPromotions}
            </p>
          )}
        </div>
      </section>

      <section
        id="menu"
        className="menu section"
      >
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              ✦ {t.menuEyebrow}
            </p>

            <h2>
              {t.menuTitle}
            </h2>

            <div className="gold-line" />
          </div>

          <div className="menu-grid">
            {displayMenu.map(
              (item) => (
                <article
                  className="menu-card"
                  key={item.id}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={
                        item.name ||
                        "Menu item"
                      }
                    />
                  )}

                  <div className="menu-card-content">
                    <div className="menu-card-top">
                      <h3>
                        {item.name ||
                          item.title}
                      </h3>

                      {item.price && (
                        <strong>
                          {item.price}
                        </strong>
                      )}
                    </div>

                    {item.category && (
                      <span className="menu-category">
                        {item.category}
                      </span>
                    )}

                    {item.description && (
                      <p>
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              )
            )}
          </div>

          {menu.length === 0 && (
            <p className="menu-note">
              {t.noMenu}
            </p>
          )}
        </div>
      </section>

      <section className="gallery section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              ✦ {t.galleryEyebrow}
            </p>

            <h2>
              {t.galleryTitle}
            </h2>

            <div className="gold-line" />
          </div>

          <div className="gallery-grid">
            {displayGallery.map(
              (item) => (
                <figure
                  className="gallery-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={
                      item.title ||
                      restaurantName
                    }
                  />
                </figure>
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="booking"
        className="booking section"
      >
        <div className="container booking-grid">
          <div className="section-copy">
            <p className="eyebrow">
              ✦ {t.bookingEyebrow}
            </p>

            <h2>
              {t.bookingTitle}
            </h2>

            <div className="gold-line" />

            <p>
              Reserve your table and enjoy
              an unforgettable dining
              experience in Rome.
            </p>
          </div>

          <form
            className="booking-form"
            onSubmit={
              handleBookingSubmit
            }
          >
            <label>
              {t.name}

              <input
                type="text"
                required
                value={booking.name}
                onChange={(event) =>
                  setBooking({
                    ...booking,
                    name:
                      event.target.value,
                  })
                }
              />
            </label>

            <label>
              {t.email}

              <input
                type="email"
                required
                value={booking.email}
                onChange={(event) =>
                  setBooking({
                    ...booking,
                    email:
                      event.target.value,
                  })
                }
              />
            </label>

            <div className="form-row">
              <label>
                {t.date}

                <input
                  type="date"
                  required
                  value={booking.date}
                  onChange={(event) =>
                    setBooking({
                      ...booking,
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
                  value={booking.time}
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      time:
                        event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <label>
              {t.guests}

              <select
                value={booking.guests}
                onChange={(event) =>
                  setBooking({
                    ...booking,
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
                  7
                </option>
                <option value="8">
                  8+
                </option>
              </select>
            </label>

            <label>
              {t.message}

              <textarea
                rows={4}
                value={booking.message}
                onChange={(event) =>
                  setBooking({
                    ...booking,
                    message:
                      event.target.value,
                  })
                }
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary"
            >
              {t.send}
            </button>

            {bookingMessage && (
              <p className="form-success">
                {bookingMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="reviews section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              ✦ {t.reviewsEyebrow}
            </p>

            <h2>
              {t.reviewsTitle}
            </h2>

            <div className="gold-line" />
          </div>

          {visibleReviews.length > 0 ? (
            <div className="reviews-grid">
              {visibleReviews.map(
                (review) => (
                  <article
                    className="review-card"
                    key={review.id}
                  >
                    <div className="review-stars">
                      {"★".repeat(
                        Math.max(
                          0,
                          Math.min(
                            5,
                            review.rating ||
                              5
                          )
                        )
                      )}
                    </div>

                    <p>
                      “
                      {review.text}
                      ”
                    </p>

                    <strong>
                      {review.name ||
                        "Guest"}
                    </strong>
                  </article>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">
              {t.noReviews}
            </p>
          )}
        </div>
      </section>

      <section className="hours section">
        <div className="container hours-grid">
          <div className="section-heading">
            <p className="eyebrow">
              ✦ NABABI RISTORANTE
            </p>

            <h2>
              {t.hoursTitle}
            </h2>

            <div className="gold-line" />
          </div>

          <div className="hours-content">
            {openingHours
              .split("\n")
              .map(
                (line, index) => (
                  <p
                    key={
                      "hour-" +
                      String(index)
                    }
                  >
                    {line}
                  </p>
                )
              )}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="contact section"
      >
        <div className="container contact-grid">
          <div className="contact-content">
            <p className="eyebrow">
              ROMA
            </p>

            <h2>
              {t.contactTitle}
            </h2>

            <div className="gold-line" />

            <div className="contact-details">
              <div>
                <span>
                  {t.address}
                </span>

                <p>{address}</p>
              </div>

              <div>
                <span>
                  {t.phone}
                </span>

                <p>
                  <a
                    href={
                      "tel:" +
                      phone
                    }
                  >
                    {phone}
                  </a>
                </p>
              </div>

              <div>
                <span>
                  {t.whatsapp}
                </span>

                <p>
                  <a
                    href={getWhatsappUrl(
                      whatsapp
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {whatsapp}
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-buttons">
              <a
                href={
                  "tel:" + phone
                }
                className="btn btn-primary"
              >
                {t.call}
              </a>

              <a
                href={getWhatsappUrl(
                  whatsapp
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                {t.whatsapp}
              </a>
            </div>
          </div>

          <div className="map-wrapper">
            <iframe
              title="Nababi Ristorante location"
              src={
                "https://www.google.com/maps?q=" +
                encodeURIComponent(
                  address
                ) +
                "&output=embed"
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">
              N
            </span>

            <div>
              <strong>
                {restaurantName}
              </strong>

              <p>
                {t.footerText}
              </p>
            </div>
          </div>

          <div className="footer-links">
            <a href="#home">
              {t.home}
            </a>

            <a href="#menu">
              {t.menu}
            </a>

            <a href="#booking">
              {t.booking}
            </a>

            <a href="#contact">
              {t.contact}
            </a>
          </div>

          <div className="footer-social">
            <span>
              {t.follow}
            </span>

            <div>
              <a
                href={getWhatsappUrl(
                  whatsapp
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            ©{" "}
            {new Date().getFullYear()}{" "}
            {restaurantName}.{" "}
            {t.allRights}
          </div>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={getWhatsappUrl(
          whatsapp
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        WhatsApp
      </a>
    </main>
  );
}
```
