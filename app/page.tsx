```tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Lang = "it" | "en" | "bn";

type MenuItem = {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  price?: string | number;
  category?: string;
  image?: string;
  imageUrl?: string;
  available?: boolean;
};

type GalleryItem = {
  id?: string | number;
  image?: string;
  imageUrl?: string;
  url?: string;
  title?: string;
};

type Promotion = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  discount?: string;
};

type Review = {
  id?: string | number;
  name?: string;
  author?: string;
  comment?: string;
  text?: string;
  rating?: number;
};

type Settings = {
  restaurantName?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  heroImage?: string;
  breakingNews?: string;
  openingHours?: string;
  [key: string]: unknown;
};

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85";

const FALLBACK_ABOUT =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85";

const FALLBACK_MENU =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85",
];

const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Chicken Tikka",
    description:
      "Tender chicken marinated with aromatic spices and grilled to perfection.",
    price: "€12",
    category: "Starters",
    image: FALLBACK_MENU,
    available: true,
  },
  {
    id: "2",
    name: "Biryani Nababi",
    description:
      "Fragrant basmati rice, tender meat and traditional aromatic spices.",
    price: "€16",
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=1000&q=85",
    available: true,
  },
  {
    id: "3",
    name: "Butter Chicken",
    description:
      "Classic creamy tomato curry with tender chicken and Indian spices.",
    price: "€15",
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85",
    available: true,
  },
  {
    id: "4",
    name: "Lamb Curry",
    description:
      "Slow-cooked lamb in a rich and aromatic traditional curry.",
    price: "€17",
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=85",
    available: true,
  },
];

const translations = {
  it: {
    home: "Home",
    about: "Chi Siamo",
    promotions: "Promozioni",
    menu: "Menu",
    gallery: "Galleria",
    booking: "Prenota",
    reviews: "Recensioni",
    contact: "Contatti",
    heroEyebrow: "Benvenuti da",
    heroTitle: "Nababi Ristorante",
    heroDescription:
      "Tradizione italiana, sapori indiani e autentica ospitalità nel cuore di Roma.",
    bookTable: "Prenota un Tavolo",
    viewMenu: "Scopri il Menu",
    aboutTitle: "Una tavola, tante tradizioni",
    aboutText:
      "Nababi Ristorante nasce dall'incontro tra l'eleganza della cucina italiana, i profumi dell'India e la calorosa ospitalità romana.",
    aboutText2:
      "Ogni piatto viene preparato con ingredienti selezionati e grande attenzione ai dettagli, per offrirti un'esperienza autentica e speciale.",
    discover: "Scopri di più",
    latestOffers: "Le Nostre Promozioni",
    menuTitle: "Il Nostro Menu",
    galleryTitle: "La Nostra Galleria",
    bookingTitle: "Prenota il Tuo Tavolo",
    bookingText:
      "Scegli data, ora e numero di persone. Ti aspettiamo da Nababi Ristorante.",
    name: "Nome",
    email: "Email",
    phone: "Telefono",
    date: "Data",
    time: "Ora",
    guests: "Ospiti",
    message: "Messaggio",
    sendBooking: "Invia Prenotazione",
    bookingSuccess: "La tua richiesta di prenotazione è stata inviata.",
    hoursTitle: "Orari di Apertura",
    contactTitle: "Contatti",
    address: "Indirizzo",
    call: "Chiama",
    whatsapp: "WhatsApp",
    follow: "Seguici",
    footerText:
      "Tradizione, sapore e ospitalità nel cuore di Roma.",
    allRights: "Tutti i diritti riservati.",
    noPromotions: "Nessuna promozione disponibile al momento.",
    noReviews: "Presto condivideremo qui le recensioni dei nostri ospiti.",
  },

  en: {
    home: "Home",
    about: "About",
    promotions: "Promotions",
    menu: "Menu",
    gallery: "Gallery",
    booking: "Book",
    reviews: "Reviews",
    contact: "Contact",
    heroEyebrow: "Welcome to",
    heroTitle: "Nababi Ristorante",
    heroDescription:
      "Italian tradition, Indian flavours and authentic Roman hospitality in the heart of Rome.",
    bookTable: "Book a Table",
    viewMenu: "View Menu",
    aboutTitle: "One table, many traditions",
    aboutText:
      "Nababi Ristorante brings together the elegance of Italian cuisine, the aromas of India and the warm hospitality of Rome.",
    aboutText2:
      "Every dish is prepared with selected ingredients and careful attention to detail, creating an authentic and memorable dining experience.",
    discover: "Discover More",
    latestOffers: "Our Promotions",
    menuTitle: "Our Menu",
    galleryTitle: "Our Gallery",
    bookingTitle: "Book Your Table",
    bookingText:
      "Choose your date, time and number of guests. We look forward to welcoming you at Nababi Ristorante.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Date",
    time: "Time",
    guests: "Guests",
    message: "Message",
    sendBooking: "Send Booking",
    bookingSuccess: "Your booking request has been sent.",
    hoursTitle: "Opening Hours",
    contactTitle: "Contact",
    address: "Address",
    call: "Call",
    whatsapp: "WhatsApp",
    follow: "Follow Us",
    footerText:
      "Tradition, flavour and hospitality in the heart of Rome.",
    allRights: "All rights reserved.",
    noPromotions: "No promotions are available at the moment.",
    noReviews: "Guest reviews will be shared here soon.",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    promotions: "প্রমোশন",
    menu: "মেনু",
    gallery: "গ্যালারি",
    booking: "বুকিং",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    heroEyebrow: "স্বাগতম",
    heroTitle: "নবাবি রিস্টোরান্তে",
    heroDescription:
      "রোমের হৃদয়ে ইতালিয়ান ঐতিহ্য, ভারতীয় স্বাদ এবং আন্তরিক আতিথেয়তার মিলন।",
    bookTable: "টেবিল বুক করুন",
    viewMenu: "মেনু দেখুন",
    aboutTitle: "এক টেবিলে অনেক ঐতিহ্য",
    aboutText:
      "Nababi Ristorante-এ ইতালিয়ান রান্নার সৌন্দর্য, ভারতের সুগন্ধি মসলা এবং রোমের উষ্ণ আতিথেয়তা একসাথে মিলিত হয়েছে।",
    aboutText2:
      "নির্বাচিত উপকরণ ও যত্নের সাথে প্রতিটি খাবার তৈরি করা হয়, যাতে আপনার জন্য একটি স্মরণীয় খাবারের অভিজ্ঞতা তৈরি হয়।",
    discover: "আরও জানুন",
    latestOffers: "আমাদের প্রমোশন",
    menuTitle: "আমাদের মেনু",
    galleryTitle: "আমাদের গ্যালারি",
    bookingTitle: "আপনার টেবিল বুক করুন",
    bookingText:
      "তারিখ, সময় এবং অতিথির সংখ্যা নির্বাচন করুন। Nababi Ristorante-এ আপনাকে স্বাগত জানাতে আমরা অপেক্ষায় আছি।",
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    date: "তারিখ",
    time: "সময়",
    guests: "অতিথি",
    message: "মেসেজ",
    sendBooking: "বুকিং পাঠান",
    bookingSuccess: "আপনার বুকিং অনুরোধ পাঠানো হয়েছে।",
    hoursTitle: "খোলার সময়",
    contactTitle: "যোগাযোগ",
    address: "ঠিকানা",
    call: "কল করুন",
    whatsapp: "WhatsApp",
    follow: "আমাদের অনুসরণ করুন",
    footerText:
      "রোমের হৃদয়ে ঐতিহ্য, স্বাদ এবং আন্তরিক আতিথেয়তা।",
    allRights: "সর্বস্বত্ব সংরক্ষিত।",
    noPromotions: "এই মুহূর্তে কোনো প্রমোশন নেই।",
    noReviews: "শীঘ্রই আমাদের অতিথিদের রিভিউ এখানে প্রকাশ করা হবে।",
  },
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

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

function getImage(item?: {
  image?: string;
  imageUrl?: string;
  url?: string;
}): string {
  return item?.image || item?.imageUrl || item?.url || FALLBACK_MENU;
}

function getWhatsappUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  return "https://wa.me/" + cleanPhone;
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("it");

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(FALLBACK_MENU_ITEMS);

  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>([]);

  const [promotions, setPromotions] =
    useState<Promotion[]>([]);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [settings, setSettings] =
    useState<Settings>({});

  const [bookingSent, setBookingSent] =
    useState(false);

  const [bookingError, setBookingError] =
    useState("");

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });

  const t = translations[lang];

  useEffect(() => {
    const loadData = () => {
      const savedMenu = readStorage<MenuItem[]>(
        "nababi-menu",
        FALLBACK_MENU_ITEMS
      );

      const savedGallery = readStorage<GalleryItem[]>(
        "nababi-gallery",
        []
      );

      const savedSettings = readStorage<Settings>(
        "nababi-settings",
        {}
      );

      const savedPromotions = readStorage<Promotion[]>(
        "nababi-promotions",
        []
      );

      const savedPromotionsAlt = readStorage<Promotion[]>(
        "nababi-promotion",
        []
      );

      const savedReviews = readStorage<Review[]>(
        "nababi-reviews",
        []
      );

      const savedReviewsAlt = readStorage<Review[]>(
        "nababi-review",
        []
      );

      if (Array.isArray(savedMenu) && savedMenu.length > 0) {
        setMenuItems(savedMenu);
      }

      if (Array.isArray(savedGallery)) {
        setGalleryItems(savedGallery);
      }

      if (savedSettings && typeof savedSettings === "object") {
        setSettings(savedSettings);
      }

      if (Array.isArray(savedPromotions) && savedPromotions.length > 0) {
        setPromotions(savedPromotions);
      } else if (
        Array.isArray(savedPromotionsAlt) &&
        savedPromotionsAlt.length > 0
      ) {
        setPromotions(savedPromotionsAlt);
      }

      if (Array.isArray(savedReviews) && savedReviews.length > 0) {
        setReviews(savedReviews);
      } else if (
        Array.isArray(savedReviewsAlt) &&
        savedReviewsAlt.length > 0
      ) {
        setReviews(savedReviewsAlt);
      }
    };

    loadData();

    const handleStorage = () => {
      loadData();
    };

    const handleFocus = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const restaurantName =
    settings.restaurantName || "Nababi Ristorante";

  const address =
    settings.address ||
    "Via Vespasiano 73/75/77, Roma";

  const phone =
    settings.phone ||
    "+39 393 3805350";

  const whatsapp =
    settings.whatsapp ||
    "+39 333 7687319";

  const heroImage =
    settings.heroImage || FALLBACK_HERO;

  const breakingNews =
    settings.breakingNews ||
    "Benvenuti da Nababi Ristorante — Italian tradition, Indian flavours & Roman hospitality.";

  const openingHours =
    settings.openingHours ||
    "Lun - Dom: 12:00 - 23:30";

  const availableMenuItems = useMemo(() => {
    return menuItems.filter(
      (item) => item.available !== false
    );
  }, [menuItems]);

  const displayGallery = useMemo(() => {
    if (galleryItems.length > 0) {
      return galleryItems;
    }

    return FALLBACK_GALLERY.map((image, index) => ({
      id: `fallback-${index}`,
      image,
      title: "Nababi Ristorante",
    }));
  }, [galleryItems]);

  function updateBooking(
    field: keyof typeof booking,
    value: string
  ) {
    setBooking((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleBookingSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setBookingSent(false);
    setBookingError("");

    if (
      !booking.name.trim() ||
      !booking.phone.trim() ||
      !booking.date ||
      !booking.time
    ) {
      setBookingError(
        lang === "it"
          ? "Compila tutti i campi obbligatori."
          : lang === "bn"
          ? "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।"
          : "Please complete all required fields."
      );

      return;
    }

    try {
      const existing = readStorage<unknown[]>(
        "nababi-reservations",
        []
      );

      const reservations = Array.isArray(existing)
        ? existing
        : [];

      const newReservation = {
        id: Date.now(),
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        message: booking.message,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      localStorage.setItem(
        "nababi-reservations",
        JSON.stringify([
          ...reservations,
          newReservation,
        ])
      );

      setBookingSent(true);

      setBooking({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        message: "",
      });
    } catch {
      setBookingError(
        lang === "it"
          ? "Si è verificato un errore. Riprova."
          : lang === "bn"
          ? "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।"
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="nababi-site">
      <header className="site-header">
        <div className="container header-inner">
          <a href="#home" className="brand">
            <span className="brand-mark">N</span>

            <span>
              <strong>{restaurantName}</strong>
              <small>RISTORANTE</small>
            </span>
          </a>

          <nav className="desktop-nav">
            <a href="#home">{t.home}</a>
            <a href="#about">{t.about}</a>
            <a href="#promotions">{t.promotions}</a>
            <a href="#menu">{t.menu}</a>
            <a href="#gallery">{t.gallery}</a>
            <a href="#booking">{t.booking}</a>
            <a href="#reviews">{t.reviews}</a>
            <a href="#contact">{t.contact}</a>
          </nav>

          <div className="language-switcher">
            {(["it", "en", "bn"] as Lang[]).map((item) => (
              <button
                key={item}
                type="button"
                className={lang === item ? "active" : ""}
                onClick={() => setLang(item)}
                aria-label={"Switch language to " + item}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section
        id="home"
        className="hero"
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
      >
        <div className="hero-overlay" />

        <div className="container hero-content">
          <p className="eyebrow">
            {t.heroEyebrow}
          </p>

          <h1>
            {lang === "bn"
              ? "নবাবি রিস্টোরান্তে"
              : restaurantName}
          </h1>

          <div className="gold-line" />

          <p className="hero-description">
            {t.heroDescription}
          </p>

          <div className="hero-buttons">
            <a
              href="#booking"
              className="btn btn-primary"
            >
              {t.bookTable}
            </a>

            <a
              href="#menu"
              className="btn btn-outline"
            >
              {t.viewMenu}
            </a>
          </div>
        </div>
      </section>

      <div className="news-bar">
        <div className="container">
          <span className="news-label">
            NEWS
          </span>

          <span>{breakingNews}</span>
        </div>
      </div>

      <section id="about" className="about section">
        <div className="container about-grid">
          <div className="about-image">
            <img
              src={FALLBACK_ABOUT}
              alt="Nababi Ristorante"
            />

            <div className="about-badge">
              <strong>NB</strong>
              <span>ROMA</span>
            </div>
          </div>

          <div className="about-content">
            <p className="eyebrow">
              NABABI RISTORANTE
            </p>

            <h2>{t.aboutTitle}</h2>

            <div className="gold-line" />

            <p>{t.aboutText}</p>

            <p>{t.aboutText2}</p>

            <a
              href="#contact"
              className="text-link"
            >
              {t.discover}
            </a>
          </div>
        </div>
      </section>

      <section
        id="promotions"
        className="promotions section"
      >
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              NABABI SPECIAL
            </p>

            <h2>{t.latestOffers}</h2>

            <div className="gold-line" />
          </div>

          {promotions.length > 0 ? (
            <div className="promotions-grid">
              {promotions.map(
                (promotion, index) => (
                  <article
                    className="promotion-card"
                    key={
                      promotion.id ??
                      `promotion-${index}`
                    }
                  >
                    <img
                      src={getImage(promotion)}
                      alt={
                        promotion.title ||
                        "Promotion"
                      }
                    />

                    <div className="promotion-content">
                      {promotion.discount && (
                        <span className="promotion-discount">
                          {promotion.discount}
                        </span>
                      )}

                      <h3>
                        {promotion.title ||
                          "Nababi Special"}
                      </h3>

                      <p>
                        {promotion.description ||
                          ""}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="empty-state">
              {t.noPromotions}
            </div>
          )}
        </div>
      </section>

      <section id="menu" className="menu section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              SAPORI AUTENTICI
            </p>

            <h2>{t.menuTitle}</h2>

            <div className="gold-line" />
          </div>

          <div className="menu-grid">
            {availableMenuItems.map(
              (item, index) => (
                <article
                  className="menu-card"
                  key={
                    item.id ??
                    `menu-${index}`
                  }
                >
                  <div className="menu-card-image">
                    <img
                      src={getImage(item)}
                      alt={
                        item.name ||
                        item.title ||
                        "Menu item"
                      }
                    />
                  </div>

                  <div className="menu-card-content">
                    <div className="menu-card-title">
                      <h3>
                        {item.name ||
                          item.title ||
                          "Nababi Special"}
                      </h3>

                      {item.price && (
                        <span>
                          {String(
                            item.price
                          ).includes("€")
                            ? String(item.price)
                            : `€${item.price}`}
                        </span>
                      )}
                    </div>

                    {item.category && (
                      <small className="menu-category">
                        {item.category}
                      </small>
                    )}

                    {item.description && (
                      <p>{item.description}</p>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="gallery section"
      >
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              MOMENTI NABABI
            </p>

            <h2>{t.galleryTitle}</h2>

            <div className="gold-line" />
          </div>

          <div className="gallery-grid">
            {displayGallery.map(
              (item, index) => (
                <div
                  className="gallery-item"
                  key={
                    item.id ??
                    `gallery-${index}`
                  }
                >
                  <img
                    src={getImage(item)}
                    alt={
                      item.title ||
                      "Nababi Ristorante"
                    }
                  />
                </div>
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
          <div className="booking-content">
            <p className="eyebrow">
              PRENOTAZIONE
            </p>

            <h2>{t.bookingTitle}</h2>

            <div className="gold-line" />

            <p>{t.bookingText}</p>

            <div className="booking-contact">
              <a href={`tel:${phone}`}>
                {phone}
              </a>

              <a
                href={getWhatsappUrl(
                  whatsapp
                )}
                target="_blank"
                rel="noreferrer"
              >
                {t.whatsapp}
              </a>
            </div>
          </div>

          <form
            className="booking-form"
            onSubmit={handleBookingSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-name">
                  {t.name} *
                </label>

                <input
                  id="booking-name"
                  type="text"
                  value={booking.name}
                  onChange={(event) =>
                    updateBooking(
                      "name",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-phone">
                  {t.phone} *
                </label>

                <input
                  id="booking-phone"
                  type="tel"
                  value={booking.phone}
                  onChange={(event) =>
                    updateBooking(
                      "phone",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-email">
                  {t.email}
                </label>

                <input
                  id="booking-email"
                  type="email"
                  value={booking.email}
                  onChange={(event) =>
                    updateBooking(
                      "email",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-guests">
                  {t.guests} *
                </label>

                <select
                  id="booking-guests"
                  value={booking.guests}
                  onChange={(event) =>
                    updateBooking(
                      "guests",
                      event.target.value
                    )
                  }
                >
                  {Array.from(
                    { length: 12 },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-date">
                  {t.date} *
                </label>

                <input
                  id="booking-date"
                  type="date"
                  value={booking.date}
                  onChange={(event) =>
                    updateBooking(
                      "date",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-time">
                  {t.time} *
                </label>

                <input
                  id="booking-time"
                  type="time"
                  value={booking.time}
                  onChange={(event) =>
                    updateBooking(
                      "time",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="booking-message">
                {t.message}
              </label>

              <textarea
                id="booking-message"
                rows={4}
                value={booking.message}
                onChange={(event) =>
                  updateBooking(
                    "message",
                    event.target.value
                  )
                }
              />
            </div>

            {bookingError && (
              <div className="form-message error">
                {bookingError}
              </div>
            )}

            {bookingSent && (
              <div className="form-message success">
                {t.bookingSuccess}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
            >
              {t.sendBooking}
            </button>
          </form>
        </div>
      </section>

      <section
        id="reviews"
        className="reviews section"
      >
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">
              ESPERIENZE
            </p>

            <h2>{t.reviewsTitle}</h2>

            <div className="gold-line" />
          </div>

          {reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map(
                (review, index) => (
                  <article
                    className="review-card"
                    key={
                      review.id ??
                      `review-${index}`
                    }
                  >
                    <div className="review-stars">
                      {"★".repeat(
                        Math.min(
                          5,
                          Math.max(
                            1,
                            Number(
                              review.rating ||
                                5
                            )
                          )
                        )
                      )}
                    </div>

                    <p>
                      “
                      {review.comment ||
                        review.text ||
                        ""}
                      ”
                    </p>

                    <strong>
                      {review.name ||
                        review.author ||
                        "Guest"}
                    </strong>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="empty-state">
              {t.noReviews}
            </div>
          )}
        </div>
      </section>

      <section
        id="hours"
        className="hours section"
      >
        <div className="container hours-inner">
          <div>
            <p className="eyebrow">
              NABABI RISTORANTE
            </p>

            <h2>{t.hoursTitle}</h2>
          </div>

          <div className="hours-content">
            <p>{openingHours}</p>
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

            <h2>{t.contactTitle}</h2>

            <div className="gold-line" />

            <div className="contact-details">
              <div>
                <span>{t.address}</span>
                <p>{address}</p>
              </div>

              <div>
                <span>{t.phone}</span>

                <p>
                  <a href={`tel:${phone}`}>
                    {phone}
                  </a>
                </p>
              </div>

              <div>
                <span>{t.whatsapp}</span>

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
                href={`tel:${phone}`}
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
                encodeURIComponent(address) +
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

              <p>{t.footerText}</p>
            </div>
          </div>

          <div className="footer-links">
            <a href="#home">{t.home}</a>
            <a href="#menu">{t.menu}</a>
            <a href="#booking">
              {t.booking}
            </a>
            <a href="#contact">
              {t.contact}
            </a>
          </div>

          <div className="footer-social">
            <span>{t.follow}</span>

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
            © {new Date().getFullYear()}{" "}
            {restaurantName}.{" "}
            {t.allRights}
          </div>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={getWhatsappUrl(whatsapp)}
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
