"use client";

import { useEffect, useMemo, useState } from "react";

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

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2000&q=90";

const FALLBACK_FOOD =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
];

const translations = {
  it: {
    navHome: "Home",
    navAbout: "Chi siamo",
    navMenu: "Menu",
    navGallery: "Galleria",
    navBooking: "Prenota",
    navContact: "Contatti",
    heroSmall: "Benvenuti da",
    heroTitle: "Nababi",
    heroAccent: "Ristorante",
    heroText:
      "Un viaggio di sapori tra tradizione italiana, cucina indiana e ospitalità romana.",
    viewMenu: "Scopri il Menu",
    bookTable: "Prenota un Tavolo",
    breaking: "Ultime Notizie",
    aboutSmall: "La nostra storia",
    aboutTitle: "Sapori autentici,",
    aboutAccent: "momenti indimenticabili",
    aboutText:
      "Nel cuore di Roma, Nababi Ristorante porta a tavola una cucina ricca di profumi, spezie e tradizioni. Un ambiente elegante e accogliente dove ogni piatto racconta una storia.",
    discover: "Scopri di più",
    specials: "Le nostre specialità",
    specialsTitle: "Un menu creato",
    specialsAccent: "con passione",
    gallerySmall: "Esperienze Nababi",
    galleryTitle: "Galleria",
    bookingSmall: "Il tuo tavolo ti aspetta",
    bookingTitle: "Prenota la tua",
    bookingAccent: "esperienza",
    name: "Nome",
    phone: "Telefono",
    date: "Data",
    time: "Ora",
    guests: "Persone",
    sendBooking: "Richiedi Prenotazione",
    reviewsSmall: "Cosa dicono di noi",
    reviewsTitle: "Le parole dei nostri",
    reviewsAccent: "ospiti",
    hoursSmall: "Quando trovarci",
    hoursTitle: "Orari di apertura",
    contactSmall: "Vieni a trovarci",
    contactTitle: "Contatti",
    address: "Indirizzo",
    call: "Chiama",
    whatsapp: "WhatsApp",
    footerText:
      "Nababi Ristorante — un incontro tra sapori, cultura e ospitalità.",
    menu: "Menu",
    follow: "Seguici",
  },

  en: {
    navHome: "Home",
    navAbout: "About",
    navMenu: "Menu",
    navGallery: "Gallery",
    navBooking: "Book",
    navContact: "Contact",
    heroSmall: "Welcome to",
    heroTitle: "Nababi",
    heroAccent: "Ristorante",
    heroText:
      "A journey of flavours combining Italian tradition, Indian cuisine and Roman hospitality.",
    viewMenu: "Explore Menu",
    bookTable: "Book a Table",
    breaking: "Latest News",
    aboutSmall: "Our story",
    aboutTitle: "Authentic flavours,",
    aboutAccent: "unforgettable moments",
    aboutText:
      "In the heart of Rome, Nababi Ristorante brings together aromas, spices and culinary traditions. An elegant and welcoming place where every dish tells a story.",
    discover: "Discover more",
    specials: "Our specialties",
    specialsTitle: "A menu created",
    specialsAccent: "with passion",
    gallerySmall: "The Nababi experience",
    galleryTitle: "Gallery",
    bookingSmall: "Your table is waiting",
    bookingTitle: "Book your",
    bookingAccent: "experience",
    name: "Name",
    phone: "Phone",
    date: "Date",
    time: "Time",
    guests: "Guests",
    sendBooking: "Request Booking",
    reviewsSmall: "What our guests say",
    reviewsTitle: "Words from our",
    reviewsAccent: "guests",
    hoursSmall: "When to visit",
    hoursTitle: "Opening Hours",
    contactSmall: "Come and visit us",
    contactTitle: "Contact",
    address: "Address",
    call: "Call",
    whatsapp: "WhatsApp",
    footerText:
      "Nababi Ristorante — where flavours, culture and hospitality meet.",
    menu: "Menu",
    follow: "Follow us",
  },

  bn: {
    navHome: "হোম",
    navAbout: "আমাদের সম্পর্কে",
    navMenu: "মেনু",
    navGallery: "গ্যালারি",
    navBooking: "বুকিং",
    navContact: "যোগাযোগ",
    heroSmall: "স্বাগতম",
    heroTitle: "Nababi",
    heroAccent: "Ristorante",
    heroText:
      "ইতালিয়ান ঐতিহ্য, ভারতীয় স্বাদ এবং রোমান আতিথেয়তার এক অনন্য যাত্রা।",
    viewMenu: "মেনু দেখুন",
    bookTable: "টেবিল বুক করুন",
    breaking: "সর্বশেষ খবর",
    aboutSmall: "আমাদের গল্প",
    aboutTitle: "আসল স্বাদ,",
    aboutAccent: "স্মরণীয় মুহূর্ত",
    aboutText:
      "রোমের হৃদয়ে Nababi Ristorante নিয়ে এসেছে সুগন্ধ, মসলা ও ঐতিহ্যের অসাধারণ সমন্বয়। প্রতিটি খাবার এখানে একটি গল্প বলে।",
    discover: "আরও জানুন",
    specials: "আমাদের বিশেষ আয়োজন",
    specialsTitle: "ভালোবাসা দিয়ে তৈরি",
    specialsAccent: "আমাদের মেনু",
    gallerySmall: "Nababi experience",
    galleryTitle: "গ্যালারি",
    bookingSmall: "আপনার টেবিল অপেক্ষায়",
    bookingTitle: "আপনার",
    bookingAccent: "অভিজ্ঞতা বুক করুন",
    name: "নাম",
    phone: "ফোন",
    date: "তারিখ",
    time: "সময়",
    guests: "জন",
    sendBooking: "বুকিং অনুরোধ পাঠান",
    reviewsSmall: "আমাদের অতিথিদের মতামত",
    reviewsTitle: "আমাদের অতিথিদের",
    reviewsAccent: "কথায়",
    hoursSmall: "কখন আসবেন",
    hoursTitle: "খোলার সময়",
    contactSmall: "আমাদের কাছে আসুন",
    contactTitle: "যোগাযোগ",
    address: "ঠিকানা",
    call: "কল করুন",
    whatsapp: "WhatsApp",
    footerText:
      "Nababi Ristorante — স্বাদ, সংস্কৃতি ও আতিথেয়তার এক মিলনস্থল।",
    menu: "মেনু",
    follow: "আমাদের অনুসরণ করুন",
  },
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;

    const parsed = JSON.parse(value);

    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

function imageFromItem(item: any, fallback = FALLBACK_FOOD) {
  return (
    item?.image ||
    item?.imageUrl ||
    item?.url ||
    item?.photo ||
    item?.src ||
    fallback
  );
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("it");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [reservationMessage, setReservationMessage] = useState("");

  const t = translations[lang];

  useEffect(() => {
    const load = () => {
      setMenu(readStorage<MenuItem[]>("nababi-menu", []));
      setGallery(readStorage<GalleryItem[]>("nababi-gallery", []));
      setSettings(readStorage<any>("nababi-settings", {}));

      const possiblePromotions =
        readStorage<any>("nababi-promotions", []) ||
        readStorage<any>("nababi-promotion", []);

      setPromotions(Array.isArray(possiblePromotions) ? possiblePromotions : []);

      const possibleReviews =
        readStorage<any>("nababi-reviews", []) ||
        readStorage<any>("nababi-review", []);

      setReviews(Array.isArray(possibleReviews) ? possibleReviews : []);
    };

    load();

    const handleStorage = () => load();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleStorage);
    };
  }, []);

  const visibleMenu = useMemo(() => {
    const active = menu.filter(
      (item) => item.available !== false
    );

    return active.length
      ? active.slice(0, 8)
      : [
          {
            name: "Chicken Tikka",
            description: "Tender chicken with aromatic spices",
            price: "14",
          },
          {
            name: "Biryani Nababi",
            description: "Fragrant rice, herbs and traditional spices",
            price: "16",
          },
          {
            name: "Butter Chicken",
            description: "Creamy tomato sauce and Indian spices",
            price: "15",
          },
          {
            name: "Lamb Curry",
            description: "Slow cooked lamb with rich spices",
            price: "18",
          },
        ];
  }, [menu]);

  const visibleGallery =
    gallery.length > 0
      ? gallery.slice(0, 6)
      : FALLBACK_GALLERY.map((image, index) => ({
          id: index,
          image,
        }));

  const heroImage =
    settings?.heroImage ||
    settings?.hero?.image ||
    settings?.homePage?.heroImage ||
    FALLBACK_HERO;

  const restaurantName =
    settings?.restaurantName ||
    settings?.name ||
    "Nababi Ristorante";

  const address =
    settings?.address ||
    "Via Vespasiano 73/75/77, Roma";

  const phone =
    settings?.phone ||
    "+39 393 3805350";

  const whatsapp =
    settings?.whatsapp ||
    "+39 333 7687319";

  const breakingNews =
    settings?.breakingNews ||
    settings?.announcement ||
    "Benvenuti da Nababi Ristorante — scopri la nostra cucina.";

  const openingHours =
    settings?.openingHours ||
    settings?.hours ||
    null;

  const submitReservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const reservation = {
      id: Date.now().toString(),
      name: form.get("name"),
      phone: form.get("phone"),
      date: form.get("date"),
      time: form.get("time"),
      guests: form.get("guests"),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    try {
      const existing = readStorage<any[]>("nababi-reservations", []);
      const updated = [reservation, ...existing];

      localStorage.setItem(
        "nababi-reservations",
        JSON.stringify(updated)
      );

      setReservationMessage(
        lang === "it"
          ? "Richiesta inviata con successo."
          : lang === "en"
          ? "Booking request sent successfully."
          : "বুকিং অনুরোধ সফলভাবে পাঠানো হয়েছে।"
      );

      e.currentTarget.reset();
    } catch {
      setReservationMessage(
        "Unable to save reservation. Please call us."
      );
    }
  };

  const whatsappNumber = whatsapp.replace(/[^\d]/g, "");

  return (
    <main className="nababi-site">
      {/* HEADER */}
      <header className="site-header">
        <a href="#home" className="brand">
          <span className="brand-mark">N</span>
          <span>
            <strong>NABABI</strong>
            <small>RISTORANTE</small>
          </span>
        </a>

        <nav className="desktop-nav">
          <a href="#home">{t.navHome}</a>
          <a href="#about">{t.navAbout}</a>
          <a href="#menu">{t.navMenu}</a>
          <a href="#gallery">{t.navGallery}</a>
          <a href="#booking">{t.navBooking}</a>
          <a href="#contact">{t.navContact}</a>
        </nav>

        <div className="language-switcher">
          {(["it", "en", "bn"] as Lang[]).map((item) => (
            <button
              key={item}
              className={lang === item ? "active" : ""}
              onClick={() => setLang(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="eyebrow">{t.heroSmall}</p>

          <h1>
            {t.heroTitle}
            <em>{t.heroAccent}</em>
          </h1>

          <span className="gold-line" />

          <p className="hero-description">{t.heroText}</p>

          <div className="hero-buttons">
            <a href="#menu" className="btn btn-gold">
              {t.viewMenu}
            </a>

            <a href="#booking" className="btn btn-outline">
              {t.bookTable}
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <span>ROMA · ITALIA</span>
          <span className="scroll-line" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* BREAKING NEWS */}
      <section className="news-bar">
        <span className="news-label">{t.breaking}</span>
        <span className="news-text">{breakingNews}</span>
      </section>

      {/* ABOUT */}
      <section id="about" className="section about-section">
        <div className="section-image about-image">
          <img src={FALLBACK_FOOD} alt="Nababi food" />
          <div className="image-badge">
            <strong>10+</strong>
            <span>Years of<br />Passion</span>
          </div>
        </div>

        <div className="section-copy">
          <p className="eyebrow">{t.aboutSmall}</p>

          <h2>
            {t.aboutTitle}
            <em>{t.aboutAccent}</em>
          </h2>

          <span className="gold-line left" />

          <p>{t.aboutText}</p>

          <div className="signature">
            <span>Nababi</span>
            <small>RISTORANTE ROMA</small>
          </div>

          <a href="#contact" className="text-link">
            {t.discover} →
          </a>
        </div>
      </section>

      {/* PROMOTIONS */}
      {promotions.length > 0 && (
        <section className="section promotions-section">
          <div className="center-heading">
            <p className="eyebrow">NABABI SPECIAL</p>
            <h2>Special <em>Offers</em></h2>
            <span className="gold-line" />
          </div>

          <div className="promotion-grid">
            {promotions.slice(0, 3).map((promotion, index) => (
              <article className="promotion-card" key={promotion.id ?? index}>
                <img
                  src={imageFromItem(promotion)}
                  alt={promotion.title || "Promotion"}
                />

                <div className="promotion-content">
                  {promotion.discount && (
                    <span className="discount">
                      {promotion.discount}
                    </span>
                  )}

                  <h3>{promotion.title || "Nababi Special"}</h3>

                  <p>{promotion.description || ""}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* MENU */}
      <section id="menu" className="menu-section">
        <div className="menu-background" />

        <div className="menu-inner">
          <div className="center-heading light">
            <p className="eyebrow">{t.specials}</p>

            <h2>
              {t.specialsTitle}
              <em>{t.specialsAccent}</em>
            </h2>

            <span className="gold-line" />
          </div>

          <div className="menu-grid">
            {visibleMenu.map((item, index) => (
              <article className="menu-card" key={item.id ?? index}>
                <div className="menu-image">
                  <img
                    src={imageFromItem(item)}
                    alt={item.name || item.title || "Menu item"}
                  />
                </div>

                <div className="menu-info">
                  <div className="menu-title-row">
                    <h3>{item.name || item.title || "Nababi Special"}</h3>
                    <span className="price">
                      {item.price ? `€${item.price}` : "€"}
                    </span>
                  </div>

                  <p>{item.description || ""}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="menu-action">
            <a href="#booking" className="btn btn-gold">
              {t.bookTable}
            </a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section gallery-section">
        <div className="center-heading">
          <p className="eyebrow">{t.gallerySmall}</p>
          <h2>{t.galleryTitle}</h2>
          <span className="gold-line" />
        </div>

        <div className="gallery-grid">
          {visibleGallery.map((item, index) => (
            <div className={`gallery-item gallery-${index + 1}`} key={item.id ?? index}>
              <img
                src={imageFromItem(item)}
                alt={item.title || "Nababi Ristorante"}
              />
              <div className="gallery-overlay">
                <span>+</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="booking-section">
        <div className="booking-overlay" />

        <div className="booking-inner">
          <div className="center-heading light">
            <p className="eyebrow">{t.bookingSmall}</p>

            <h2>
              {t.bookingTitle}
              <em>{t.bookingAccent}</em>
            </h2>

            <span className="gold-line" />
          </div>

          <form className="booking-form" onSubmit={submitReservation}>
            <label>
              <span>{t.name}</span>
              <input name="name" required placeholder={t.name} />
            </label>

            <label>
              <span>{t.phone}</span>
              <input
                name="phone"
                required
                type="tel"
                placeholder={phone}
              />
            </label>

            <label>
              <span>{t.date}</span>
              <input name="date" required type="date" />
            </label>

            <label>
              <span>{t.time}</span>
              <input name="time" required type="time" />
            </label>

            <label>
              <span>{t.guests}</span>
              <select name="guests" defaultValue="2">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8+</option>
              </select>
            </label>

            <button type="submit" className="btn btn-gold submit-btn">
              {t.sendBooking}
            </button>
          </form>

          {reservationMessage && (
            <p className="reservation-success">
              {reservationMessage}
            </p>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section reviews-section">
        <div className="center-heading">
          <p className="eyebrow">{t.reviewsSmall}</p>

          <h2>
            {t.reviewsTitle}
            <em>{t.reviewsAccent}</em>
          </h2>

          <span className="gold-line" />
        </div>

        <div className="reviews-grid">
          {(reviews.length
            ? reviews.slice(0, 3)
            : [
                {
                  name: "Our Guest",
                  comment:
                    "A beautiful evening, wonderful food and excellent hospitality.",
                  rating: 5,
                },
                {
                  name: "Our Guest",
                  comment:
                    "Amazing flavours and a warm atmosphere in the heart of Rome.",
                  rating: 5,
                },
                {
                  name: "Our Guest",
                  comment:
                    "A restaurant we will definitely visit again.",
                  rating: 5,
                },
              ]
          ).map((review, index) => (
            <article className="review-card" key={review.id ?? index}>
              <div className="stars">
                {"★★★★★".slice(0, review.rating || 5)}
              </div>

              <p>
                “{review.comment || review.text || "Wonderful experience."}”
              </p>

              <div className="review-author">
                <span>
                  {(review.name || review.author || "Guest")
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <strong>{review.name || review.author || "Guest"}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HOURS */}
      <section className="hours-section">
        <div>
          <p className="eyebrow">{t.hoursSmall}</p>
          <h2>{t.hoursTitle}</h2>
        </div>

        <div className="hours-list">
          {openingHours && typeof openingHours === "object" ? (
            Object.entries(openingHours)
              .slice(0, 7)
              .map(([day, value]) => (
                <div className="hours-row" key={day}>
                  <span>{day}</span>
                  <strong>{String(value)}</strong>
                </div>
              ))
          ) : (
            <>
              <div className="hours-row">
                <span>Monday</span>
                <strong>12:00 — 23:00</strong>
              </div>
              <div className="hours-row">
                <span>Tuesday</span>
                <strong>12:00 — 23:00</strong>
              </div>
              <div className="hours-row">
                <span>Wednesday</span>
                <strong>12:00 — 23:00</strong>
              </div>
              <div className="hours-row">
                <span>Thursday</span>
                <strong>12:00 — 23:00</strong>
              </div>
              <div className="hours-row">
                <span>Friday</span>
                <strong>12:00 — 23:30</strong>
              </div>
              <div className="hours-row">
                <span>Saturday</span>
                <strong>12:00 — 23:30</strong>
              </div>
              <div className="hours-row">
                <span>Sunday</span>
                <strong>12:00 — 23:00</strong>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-info">
          <p className="eyebrow">{t.contactSmall}</p>

          <h2>{t.contactTitle}</h2>

          <span className="gold-line left" />

          <div className="contact-item">
            <span className="contact-icon">⌖</span>
            <div>
              <small>{t.address}</small>
              <p>{address}</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="contact-icon">☎</span>
            <div>
              <small>{t.call}</small>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>
                {phone}
              </a>
            </div>
          </div>

          <div className="contact-actions">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              {t.whatsapp}
            </a>

            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="btn btn-dark"
            >
              {t.call}
            </a>
          </div>
        </div>

        <div className="map-container">
          <iframe
            title="Nababi Ristorante Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              address
            )}&output=embed`}
            loading="lazy"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-brand">
          <div className="brand footer-logo">
            <span className="brand-mark">N</span>
            <span>
              <strong>NABABI</strong>
              <small>RISTORANTE</small>
            </span>
          </div>

          <p>{t.footerText}</p>
        </div>

        <div className="footer-column">
          <h3>{t.menu}</h3>
          <a href="#home">{t.navHome}</a>
          <a href="#about">{t.navAbout}</a>
          <a href="#menu">{t.navMenu}</a>
          <a href="#gallery">{t.navGallery}</a>
          <a href="#booking">{t.navBooking}</a>
        </div>

        <div className="footer-column">
          <h3>{t.follow}</h3>

          <a href={settings?.instagram || "#"} target="_blank" rel="noreferrer">
            Instagram
          </a>

          <a href={settings?.facebook || "#"} target="_blank" rel="noreferrer">
            Facebook
          </a>

          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nababi Ristorante</span>
          <span>{address}</span>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        className="floating-whatsapp"
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        WA
      </a>
    </main>
  );
}
