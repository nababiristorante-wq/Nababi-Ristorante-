"use client";

import { useState } from "react";

type Language = "it" | "en" | "bn";

type BookingForm = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  menu: string;
  note: string;
};

type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  menu: string;
  note: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: string;
};

const translations = {
  it: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    order: "Order Now",
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
      "Nababi Ristorante porta nel cuore di Roma le ricche tradizioni culinarie dell'India e del Bangladesh. Sapori autentici, ingredienti selezionati e una presentazione elegante.",
    galleryTitle: "La Nostra Gallery",
    galleryText:
      "Un viaggio attraverso i nostri piatti, il nostro ambiente e i momenti speciali.",
    bookingTitle: "Prenota un Tavolo",
    bookingText:
      "Prenota il tuo tavolo e vivi un'esperienza autentica da Nababi Ristorante.",
    name: "Nome",
    bookingPhone: "Telefono",
    date: "Data",
    time: "Orario",
    guests: "Numero di persone",
    food: "Menu / Piatti desiderati",
    note: "Richiesta speciale",
    confirm: "Conferma Prenotazione",
    bookingSuccess:
      "Prenotazione ricevuta! Ti contatteremo per confermare.",
    reviewsTitle: "Cosa Dicono i Nostri Clienti",
    reviewButton: "Scrivi una Recensione",
    contactTitle: "Contatti",
    contactText:
      "Siamo a tua disposizione. Contattaci per informazioni, prenotazioni e richieste.",
    follow: "Seguici sui Social",
    footer:
      "© 2026 Nababi Ristorante. Tutti i diritti riservati.",
  },

  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    order: "Order Now",
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
      "Nababi Ristorante brings the rich culinary traditions of India and Bangladesh to the heart of Rome. Authentic flavors, carefully selected ingredients and elegant presentation.",
    galleryTitle: "Our Gallery",
    galleryText:
      "A journey through our dishes, our restaurant and special moments.",
    bookingTitle: "Book a Table",
    bookingText:
      "Book your table and enjoy an authentic experience at Nababi Ristorante.",
    name: "Name",
    bookingPhone: "Phone",
    date: "Date",
    time: "Time",
    guests: "Number of guests",
    food: "Menu / Desired dishes",
    note: "Special request",
    confirm: "Confirm Booking",
    bookingSuccess:
      "Booking received! We will contact you to confirm.",
    reviewsTitle: "What Our Customers Say",
    reviewButton: "Write a Review",
    contactTitle: "Contact",
    contactText:
      "We are here for you. Contact us for information, reservations and requests.",
    follow: "Follow Us",
    footer:
      "© 2026 Nababi Ristorante. All rights reserved.",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    order: "অর্ডার করুন",
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
      "Nababi Ristorante রোমের হৃদয়ে ভারত ও বাংলাদেশের সমৃদ্ধ খাবারের ঐতিহ্য নিয়ে এসেছে। আসল স্বাদ, বাছাই করা উপকরণ এবং সুন্দর পরিবেশন আমাদের বিশেষত্ব।",
    galleryTitle: "আমাদের গ্যালারি",
    galleryText:
      "আমাদের খাবার, রেস্টুরেন্ট এবং বিশেষ মুহূর্তগুলোর একটি সুন্দর ভ্রমণ।",
    bookingTitle: "টেবিল বুক করুন",
    bookingText:
      "আপনার টেবিল বুক করুন এবং Nababi Ristorante-এ একটি বিশেষ অভিজ্ঞতা উপভোগ করুন।",
    name: "নাম",
    bookingPhone: "ফোন",
    date: "তারিখ",
    time: "সময়",
    guests: "কতজন",
    food: "মেনু / পছন্দের খাবার",
    note: "বিশেষ অনুরোধ",
    confirm: "বুকিং নিশ্চিত করুন",
    bookingSuccess:
      "বুকিং গ্রহণ করা হয়েছে! নিশ্চিত করার জন্য আমরা আপনার সাথে যোগাযোগ করব।",
    reviewsTitle: "আমাদের কাস্টমাররা কী বলেন",
    reviewButton: "রিভিউ লিখুন",
    contactTitle: "যোগাযোগ",
    contactText:
      "আমরা আপনার জন্য প্রস্তুত। তথ্য, বুকিং ও অন্যান্য বিষয়ে আমাদের সাথে যোগাযোগ করুন।",
    follow: "সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন",
    footer:
      "© 2026 Nababi Ristorante. সর্বস্বত্ব সংরক্ষিত।",
  },
};

const categories = [
  {
    icon: "🍛",
    it: "Biryani",
    en: "Biryani",
    bn: "বিরিয়ানি",
    text: "Authentic royal biryani",
  },
  {
    icon: "🍗",
    it: "Pollo",
    en: "Chicken",
    bn: "চিকেন",
    text: "Chicken specialities",
  },
  {
    icon: "🥩",
    it: "Carne",
    en: "Meat",
    bn: "মাংস",
    text: "Traditional meat dishes",
  },
  {
    icon: "🐟",
    it: "Pesce",
    en: "Fish",
    bn: "মাছ",
    text: "Fresh fish specialities",
  },
  {
    icon: "🥗",
    it: "Vegetariano",
    en: "Vegetarian",
    bn: "ভেজিটেরিয়ান",
    text: "Fresh vegetarian dishes",
  },
  {
    icon: "🥤",
    it: "Bevande",
    en: "Drinks",
    bn: "পানীয়",
    text: "Drinks and house specialities",
  },
];

const reviews = [
  {
    name: "Cliente Nababi",
    stars: 5,
    text: "Ottimo cibo, ambiente elegante e sapori autentici.",
  },
  {
    name: "Restaurant Guest",
    stars: 5,
    text: "A wonderful experience with delicious Indian and Bangladeshi food.",
  },
  {
    name: "Cliente",
    stars: 5,
    text: "Piatti molto buoni e servizio cordiale.",
  },
];

const emptyBookingForm: BookingForm = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  menu: "",
  note: "",
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("it");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const [bookingForm, setBookingForm] =
    useState<BookingForm>(emptyBookingForm);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const t = translations[language];

  const handleBookingSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const storedReservations = localStorage.getItem(
        "nababi-reservations"
      );

      let existingReservations: Reservation[] = [];

      if (storedReservations) {
        try {
          const parsed = JSON.parse(storedReservations);

          if (Array.isArray(parsed)) {
            existingReservations = parsed;
          }
        } catch {
          existingReservations = [];
        }
      }

      const newReservation: Reservation = {
        id: Date.now().toString(),
        name: bookingForm.name.trim(),
        phone: bookingForm.phone.trim(),
        date: bookingForm.date,
        time: bookingForm.time,
        guests: Number(bookingForm.guests),
        menu: bookingForm.menu.trim(),
        note: bookingForm.note.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const updatedReservations = [
        ...existingReservations,
        newReservation,
      ];

      localStorage.setItem(
        "nababi-reservations",
        JSON.stringify(updatedReservations)
      );

      setBookingForm(emptyBookingForm);
      setBookingSuccess(true);

      setTimeout(() => {
        setBookingSuccess(false);
      }, 6000);
    } catch (error) {
      console.error("Booking save error:", error);
      alert(
        "Unable to save the booking. Please try again."
      );
    }
  };

  return (
    <main className="site">

      {/* HEADER */}
      <header className="header">
        <a href="#home" className="logo">
          <span className="logo-crown">♛</span>

          <span>
            <strong>NABABI</strong>
            <small>RISTORANTE</small>
          </span>
        </a>

        <nav className="nav">
          <a href="#home">{t.home}</a>
          <a href="#about">{t.about}</a>
          <a href="#menu">{t.menu}</a>
          <a href="#gallery">{t.gallery}</a>
          <a href="#reviews">{t.reviews}</a>
          <a href="#contact">{t.contact}</a>
        </nav>

        <div className="header-actions">
          <a href="#booking" className="order-btn">
            {t.order}
          </a>

          <a href="/admin" className="admin-btn">
            🔒 {t.admin}
          </a>

          <select
            className="language"
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value as Language)
            }
          >
            <option value="it">🇮🇹 IT</option>
            <option value="en">🇬🇧 EN</option>
            <option value="bn">🇧🇩 বাংলা</option>
          </select>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-content">
          <p className="eyebrow">{t.heroSmall}</p>

          <h1>{t.heroTitle}</h1>

          <p className="hero-text">{t.heroText}</p>

          <div className="hero-buttons">
            <a href="#menu" className="primary-btn">
              🍛 {t.viewMenu}
            </a>

            <a href="#booking" className="secondary-btn">
              ◉ {t.book}
            </a>
          </div>

          <div className="quick-info">
            <div>
              <span>📍</span>
              <small>Address</small>
              <strong>{t.address}</strong>
            </div>

            <div>
              <span>☎</span>
              <small>{t.phone}</small>
              <strong>+39 393 3805350</strong>
            </div>

            <div>
              <span>💬</span>
              <small>{t.whatsapp}</small>
              <strong>+39 333 7687319</strong>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="royal-circle">
            <div className="food-circle">🍛</div>
          </div>

          <div className="hero-art-buttons">
            <button type="button">▶ {t.watch}</button>

            <a href="#gallery">▣ {t.gallery}</a>
          </div>
        </div>
      </section>

      {/* SPECIALITIES */}
      <section id="menu" className="section specialities">
        <div className="section-heading">
          <p className="eyebrow">NABABI RISTORANTE</p>

          <h2>{t.specialTitle}</h2>

          <p>{t.specialText}</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const title =
              language === "it"
                ? category.it
                : language === "en"
                ? category.en
                : category.bn;

            return (
              <button
                type="button"
                key={category.it}
                className={`category-card ${
                  selectedCategory === category.it
                    ? "category-active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.it
                      ? null
                      : category.it
                  )
                }
              >
                <div className="category-image">
                  {category.icon}
                </div>

                <h3>{title}</h3>

                <p>{category.text}</p>

                <span>View Menu →</span>
              </button>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="selected-category">
            <span>✓</span>
            {selectedCategory} selected — menu items will appear here.
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="section about-section">
        <div className="about-image">
          <div className="about-placeholder">
            <span>👑</span>

            <strong>NABABI</strong>

            <small>RISTORANTE</small>
          </div>
        </div>

        <div className="about-content">
          <p className="eyebrow">NABABI RISTORANTE</p>

          <h2>{t.aboutTitle}</h2>

          <p>{t.aboutText}</p>

          <p>
            India and Bangladesh meet in Rome through authentic recipes,
            traditional spices and a warm royal atmosphere.
          </p>

          <a href="#contact" className="primary-btn">
            {t.contact} →
          </a>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section gallery-section">
        <div className="section-heading">
          <p className="eyebrow">NABABI RISTORANTE</p>

          <h2>{t.galleryTitle}</h2>

          <p>{t.galleryText}</p>
        </div>

        <div className="gallery-grid">
          <div className="gallery-card large">🍛</div>
          <div className="gallery-card">🍗</div>
          <div className="gallery-card">🥘</div>
          <div className="gallery-card">🍚</div>
          <div className="gallery-card">🥗</div>
          <div className="gallery-card large">👨‍🍳</div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="section booking-section">
        <div className="section-heading">
          <p className="eyebrow">RESERVATION</p>

          <h2>{t.bookingTitle}</h2>

          <p>{t.bookingText}</p>
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
                placeholder={t.name}
                required
                value={bookingForm.name}
                onChange={(e) => {
                  setBookingSuccess(false);

                  setBookingForm({
                    ...bookingForm,
                    name: e.target.value,
                  });
                }}
              />
            </label>

            <label>
              {t.bookingPhone}

              <input
                type="tel"
                placeholder="+39 ..."
                required
                value={bookingForm.phone}
                onChange={(e) => {
                  setBookingSuccess(false);

                  setBookingForm({
                    ...bookingForm,
                    phone: e.target.value,
                  });
                }}
              />
            </label>

            <label>
              {t.date}

              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) => {
                  setBookingSuccess(false);

                  setBookingForm({
                    ...bookingForm,
                    date: e.target.value,
                  });
                }}
              />
            </label>

            <label>
              {t.time}

              <input
                type="time"
                required
                value={bookingForm.time}
                onChange={(e) => {
                  setBookingSuccess(false);

                  setBookingForm({
                    ...bookingForm,
                    time: e.target.value,
                  });
                }}
              />
            </label>

            <label>
              {t.guests}

              <select
                required
                value={bookingForm.guests}
                onChange={(e) => {
                  setBookingSuccess(false);

                  setBookingForm({
                    ...bookingForm,
                    guests: e.target.value,
                  });
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7+</option>
              </select>
            </label>

            <label>
              {t.food}

              <input
                type="text"
                placeholder={t.food}
                value={bookingForm.menu}
                onChange={(e) => {
                  setBookingSuccess(false);

                  setBookingForm({
                    ...bookingForm,
                    menu: e.target.value,
                  });
                }}
              />
            </label>
          </div>

          <label>
            {t.note}

            <textarea
              rows={5}
              placeholder={t.note}
              value={bookingForm.note}
              onChange={(e) => {
                setBookingSuccess(false);

                setBookingForm({
                  ...bookingForm,
                  note: e.target.value,
                });
              }}
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
            </div>
          )}
        </form>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="section reviews-section">
        <div className="section-heading">
          <p className="eyebrow">REVIEWS</p>

          <h2>{t.reviewsTitle}</h2>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.name}>
              <div className="stars">
                {"★".repeat(review.stars)}
              </div>

              <p>“{review.text}”</p>

              <strong>{review.name}</strong>

              <small>Verified Customer</small>
            </div>
          ))}
        </div>

        <div className="center">
          <button type="button" className="secondary-btn">
            ✦ {t.reviewButton}
          </button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section contact-section">
        <div className="contact-content">
          <p className="eyebrow">NABABI RISTORANTE</p>

          <h2>{t.contactTitle}</h2>

          <p>{t.contactText}</p>

          <div className="contact-list">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77+Roma"
              target="_blank"
              rel="noreferrer"
            >
              📍 <span>{t.address}</span>
            </a>

            <a href="tel:+393933805350">
              ☎ <span>+39 393 3805350</span>
            </a>

            <a
              href="https://wa.me/393337687319"
              target="_blank"
              rel="noreferrer"
            >
              💬 <span>WhatsApp +39 333 7687319</span>
            </a>
          </div>
        </div>

        <div className="map-box">
          <div>
            <span>📍</span>

            <strong>Roma</strong>

            <small>Via Vespasiano 73/75/77</small>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77+Roma"
              target="_blank"
              rel="noreferrer"
            >
              Open Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="social-section">
        <p className="eyebrow">{t.follow}</p>

        <div className="social-links">
          <a
            href="https://www.facebook.com/share/1HEDPavdg6/?mibextid=wwXIfr"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>

          <a
            href="https://www.tiktok.com/@nababiristorante?_r=1&_t=ZN-9A75cGh3gec"
            target="_blank"
            rel="noreferrer"
          >
            TikTok
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <span className="footer-logo">♛ NABABI</span>

          <p>RISTORANTE</p>
        </div>

        <p>{t.footer}</p>

        <a href="/admin">Admin Panel</a>
      </footer>

      {/* PAGE STYLE */}
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
          font-family: Georgia, "Times New Roman", serif;
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
          background: rgba(16, 13, 12, 0.94);
          border-bottom: 1px solid rgba(202, 164, 83, 0.3);
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
          background: linear-gradient(
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
          box-shadow: 0 8px 25px rgba(201, 165, 90, 0.2);
        }

        .language {
          color: #ead9b0;
          background: #211a17;
          border: 1px solid #6e5933;
          border-radius: 20px;
          padding: 9px 10px;
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
          font-size: clamp(55px, 7vw, 92px);
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
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(207, 172, 94, 0.3);
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
          width: min(390px, 80vw);
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 2px solid #aa8140;
          box-shadow:
            0 0 0 16px rgba(172, 130, 64, 0.08),
            0 0 0 32px rgba(172, 130, 64, 0.04);
          background:
            radial-gradient(
              circle,
              #5d392d 0%,
              #211817 47%,
              #100d0c 70%
            );
        }

        .food-circle {
          width: 52%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: clamp(70px, 9vw, 125px);
          background: radial-gradient(circle, #d99d51, #7c4a31);
          border: 12px solid #5c3930;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);
        }

        .hero-art-buttons {
          display: flex;
          gap: 12px;
          margin-top: 30px;
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
        }

        .section {
          padding: 100px 8%;
          border-top: 1px solid rgba(203, 163, 78, 0.13);
        }

        .section-heading {
          max-width: 700px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .section-heading h2,
        .about-content h2,
        .contact-content h2 {
          font-size: clamp(38px, 5vw, 60px);
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
          grid-template-columns: repeat(6, 1fr);
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
          border: 1px solid rgba(194, 154, 77, 0.35);
          border-radius: 16px;
          cursor: pointer;
          transition: 0.3s;
        }

        .category-card:hover,
        .category-active {
          transform: translateY(-8px);
          border-color: #d2ac5f;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
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

        .selected-category {
          margin: 30px auto 0;
          max-width: 600px;
          padding: 15px;
          text-align: center;
          border: 1px solid #806331;
          border-radius: 12px;
          color: #ddc68e;
          background: rgba(74, 48, 39, 0.3);
        }

        .selected-category span {
          color: #d8b365;
          margin-right: 8px;
        }

        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 70px;
          background: rgba(52, 34, 28, 0.2);
        }

        .about-image {
          min-height: 480px;
          display: grid;
          place-items: center;
          border-radius: 25px;
          border: 1px solid rgba(201, 165, 90, 0.4);
          background:
            radial-gradient(
              circle at center,
              #744b38,
              #241815 65%
            );
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
          box-shadow: 0 0 0 20px rgba(198, 161, 90, 0.05);
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

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 190px;
          gap: 15px;
        }

        .gallery-card {
          display: grid;
          place-items: center;
          font-size: 65px;
          border-radius: 15px;
          border: 1px solid rgba(198, 161, 90, 0.35);
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

        .booking-section {
          background:
            radial-gradient(
              circle at center,
              rgba(116, 75, 56, 0.25),
              transparent 50%
            );
        }

        .booking-form {
          max-width: 900px;
          margin: auto;
          padding: 35px;
          border-radius: 20px;
          border: 1px solid rgba(199, 163, 88, 0.4);
          background: rgba(35, 25, 21, 0.9);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
        .booking-form textarea {
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
        .booking-form textarea:focus {
          border-color: #cba65d;
        }

        .submit-btn {
          margin-top: 20px;
          border: 0;
        }

        .booking-success {
          margin-top: 20px;
          padding: 15px 18px;
          border: 1px solid #806331;
          border-radius: 10px;
          background: rgba(74, 48, 39, 0.45);
          color: #e5cd91;
          text-align: center;
          line-height: 1.6;
        }

        .reviews-section {
          background: rgba(48, 31, 25, 0.2);
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1050px;
          margin: auto;
        }

        .review-card {
          padding: 30px;
          border-radius: 17px;
          border: 1px solid rgba(195, 158, 83, 0.3);
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

        .review-card small {
          color: #897b68;
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
          border: 1px solid rgba(195, 158, 83, 0.2);
          border-radius: 12px;
          background: rgba(50, 33, 27, 0.3);
        }

        .map-box {
          min-height: 350px;
          border-radius: 20px;
          border: 1px solid rgba(200, 164, 86, 0.4);
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
          border-top: 1px solid rgba(203, 163, 78, 0.13);
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
          border: 1px solid #6c5430;
          border-radius: 30px;
        }

        .footer {
          padding: 35px 8%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(203, 163, 78, 0.2);
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

        @media (max-width: 1100px) {
          .nav {
            display: none;
          }

          .category-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 800px) {
          .header {
            flex-wrap: wrap;
          }

          .header-actions {
            margin-left: auto;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 60px;
          }

          .hero h1 {
            font-size: 55px;
          }

          .quick-info {
            grid-template-columns: 1fr;
          }

          .about-section,
          .contact-section {
            grid-template-columns: 1fr;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-grid {
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
        }
      `}</style>
    </main>
  );
}