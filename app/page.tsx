"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AnyData = Record<string, any>;

type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
  createdAt: string;
};

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=2200&q=90";

const FALLBACK_ABOUT =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=90";

const FALLBACK_FOOD =
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=90";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
];

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const isActiveDate = (item: AnyData) => {
  const now = new Date();

  if (item.startDate) {
    const start = new Date(item.startDate);
    if (now < start) return false;
  }

  if (item.endDate) {
    const end = new Date(item.endDate);
    end.setHours(23, 59, 59, 999);
    if (now > end) return false;
  }

  return true;
};

const getImage = (value: any, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

export default function Home() {
  const [settings, setSettings] = useState<AnyData>({});
  const [home, setHome] = useState<AnyData>({});
  const [about, setAbout] = useState<AnyData>({});
  const [menu, setMenu] = useState<AnyData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [gallery, setGallery] = useState<AnyData[]>([]);
  const [promotions, setPromotions] = useState<AnyData[]>([]);
  const [reviews, setReviews] = useState<AnyData[]>([]);
  const [contact, setContact] = useState<AnyData>({});
  const [hours, setHours] = useState<AnyData>({});
  const [social, setSocial] = useState<AnyData>({});
  const [languages, setLanguages] = useState<AnyData>({});
  const [breakingNews, setBreakingNews] = useState<AnyData[]>([]);
  const [websiteStatus, setWebsiteStatus] = useState<AnyData>({});

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [language, setLanguage] = useState("en");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });

  const loadAllData = () => {
    const storedSettings = readStorage("nababi-settings", {});
    const storedHome = readStorage("nababi-home-settings", {});
    const storedAbout = readStorage("nababi-about", {});
    const storedMenu = readStorage("nababi-menu", []);
    const storedCategories = readStorage("nababi-categories", []);
    const storedGallery = readStorage("nababi-gallery", []);
    const storedPromotions = readStorage("nababi-promotions", []);
    const storedReviews = readStorage("nababi-reviews", []);
    const storedContact = readStorage("nababi-contact", {});
    const storedHours = readStorage("nababi-opening-hours", {});
    const storedSocial = readStorage("nababi-social-media", {});
    const storedLanguages = readStorage("nababi-languages", {});
    const storedNews = readStorage("nababi-breaking-news", []);
    const storedStatus = readStorage("nababi-website-status", {});

    setSettings(storedSettings);
    setHome(storedHome);
    setAbout(storedAbout);
    setMenu(Array.isArray(storedMenu) ? storedMenu : []);
    setCategories(
      Array.isArray(storedCategories) ? storedCategories : []
    );
    setGallery(Array.isArray(storedGallery) ? storedGallery : []);
    setPromotions(Array.isArray(storedPromotions) ? storedPromotions : []);
    setReviews(Array.isArray(storedReviews) ? storedReviews : []);
    setContact(storedContact);
    setHours(storedHours);
    setSocial(storedSocial);
    setLanguages(storedLanguages);
    setBreakingNews(Array.isArray(storedNews) ? storedNews : []);
    setWebsiteStatus(storedStatus);

    if (storedLanguages?.defaultLanguage) {
      setLanguage(storedLanguages.defaultLanguage);
    }
  };

  useEffect(() => {
    loadAllData();

    const timer = window.setInterval(loadAllData, 1000);

    const handleStorage = () => loadAllData();
    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const restaurantName =
    settings.restaurantName ||
    contact.restaurantName ||
    "NABABI RISTORANTE";

  const currency = settings.currency || "€";

  const heroTitle =
    home.heroTitle ||
    "A Taste of Tradition";

  const heroSubtitle =
    home.heroSubtitle ||
    "Authentic Italian & Asian cuisine, crafted with passion and served with warmth.";

  const welcomeText =
    home.welcomeText ||
    "Experience rich flavours, exquisite ingredients and warm hospitality at Nababi Ristorante.";

  const heroImage = getImage(home.heroImage, FALLBACK_HERO);
  const aboutImage = getImage(about.image, FALLBACK_ABOUT);

  const activeNews = useMemo(
    () =>
      breakingNews.filter(
        (item) => item.visible !== false && isActiveDate(item)
      ),
    [breakingNews]
  );

  const activePromotions = useMemo(
    () =>
      promotions.filter(
        (item) => item.visible !== false && isActiveDate(item)
      ),
    [promotions]
  );

  const visibleMenu = useMemo(
    () => menu.filter((item) => item.available !== false && item.visible !== false),
    [menu]
  );

  const filteredMenu = useMemo(() => {
    if (selectedCategory === "All") return visibleMenu;

    return visibleMenu.filter(
      (item) =>
        String(item.category || "").toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }, [visibleMenu, selectedCategory]);

  const visibleGallery = useMemo(
    () =>
      gallery
        .filter((item) => item.visible !== false)
        .sort(
          (a, b) =>
            Number(a.displayOrder || 0) - Number(b.displayOrder || 0)
        ),
    [gallery]
  );

  const visibleReviews = useMemo(
    () => reviews.filter((item) => item.visible !== false),
    [reviews]
  );

  const menuCategories = useMemo(() => {
    const fromProducts = visibleMenu
      .map((item) => item.category)
      .filter(Boolean);

    const all = [...categories, ...fromProducts].filter(Boolean);

    return Array.from(new Set(all));
  }, [categories, visibleMenu]);

  const enabledLanguages = useMemo(() => {
    const result: string[] = [];

    if (languages.italian !== false) result.push("it");
    if (languages.english !== false) result.push("en");
    if (languages.bengali !== false) result.push("bn");

    return result.length ? result : ["it", "en", "bn"];
  }, [languages]);

  const averageRating = useMemo(() => {
    if (!visibleReviews.length) return 5;

    const total = visibleReviews.reduce(
      (sum, item) => sum + Number(item.rating || 5),
      0
    );

    return total / visibleReviews.length;
  }, [visibleReviews]);

  const submitBooking = (e: FormEvent) => {
    e.preventDefault();

    const existing = readStorage<Reservation[]>("nababi-reservations", []);

    const reservation: Reservation = {
      id: Date.now().toString(),
      ...booking,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify([reservation, ...existing])
    );

    setBooking({
      name: "",
      phone: "",
      date: "",
      time: "",
      guests: "2",
      message: "",
    });

    setBookingSent(true);

    window.setTimeout(() => {
      setBookingSent(false);
    }, 5000);
  };

  const scrollTo = (id: string) => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const formatPrice = (price: any) => {
    if (price === undefined || price === null || price === "") return "";

    const value = String(price);

    if (value.includes(currency)) return value;

    return `${currency}${value}`;
  };

  const dayNames = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const getDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    };

    return labels[day] || day;
  };

  const currentHours = dayNames.map((day) => {
    const data = hours?.[day] || {};

    return {
      day,
      ...data,
    };
  });

  const maintenance =
    websiteStatus?.maintenanceMode === true ||
    websiteStatus?.status === "maintenance";

  return (
    <main className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #d7a84b;
          --gold-light: #f4d486;
          --gold-dark: #8f6720;
          --black: #050606;
          --black2: #0a0c0c;
          --glass: rgba(10, 12, 12, .72);
          --line: rgba(215,168,75,.28);
          --text: #f4f1e8;
          --muted: #aaa79f;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--black);
          color: var(--text);
          font-family: Inter, sans-serif;
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

        button {
          cursor: pointer;
        }

        .site {
          background:
            radial-gradient(circle at 10% 10%, rgba(190,130,30,.12), transparent 30%),
            radial-gradient(circle at 90% 50%, rgba(190,130,30,.08), transparent 35%),
            #050606;
          overflow-x: hidden;
        }

        .top-news {
          min-height: 34px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 20px;
          background: linear-gradient(90deg, #5e3d0c, #c08b2f, #5e3d0c);
          color: #fff;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-align: center;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5vw;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,.92),
            rgba(0,0,0,.35)
          );
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: .9;
          min-width: 150px;
        }

        .logo-crown {
          color: var(--gold);
          font-size: 17px;
          margin-bottom: 3px;
        }

        .logo-main {
          font-family: "Cormorant Garamond", serif;
          font-size: 29px;
          letter-spacing: 2px;
          color: var(--gold-light);
        }

        .logo-sub {
          margin-top: 5px;
          color: #eee;
          font-size: 7px;
          letter-spacing: 4px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .nav-links button {
          border: 0;
          background: transparent;
          color: #e9e6de;
          position: relative;
          padding: 10px 0;
        }

        .nav-links button:hover {
          color: var(--gold-light);
        }

        .nav-links button::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: .25s;
        }

        .nav-links button:hover::after {
          width: 100%;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .language-btn {
          border: 0;
          background: transparent;
          color: #aaa;
          font-size: 10px;
          text-transform: uppercase;
        }

        .language-btn.active {
          color: var(--gold-light);
        }

        .gold-btn {
          border: 1px solid var(--gold);
          border-radius: 999px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f2c867, #c58d27);
          color: #17120a;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 8px 35px rgba(214,164,60,.2);
        }

        .gold-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.06);
        }

        .outline-btn {
          border: 1px solid var(--gold);
          border-radius: 999px;
          padding: 12px 20px;
          background: transparent;
          color: var(--gold-light);
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .outline-btn:hover {
          background: rgba(215,168,75,.12);
        }

        .menu-toggle {
          display: none;
          border: 1px solid var(--line);
          background: rgba(0,0,0,.6);
          color: white;
          border-radius: 8px;
          padding: 9px 12px;
        }

        .hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          background-image:
            linear-gradient(90deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.52) 45%, rgba(0,0,0,.1) 100%),
            linear-gradient(0deg, rgba(0,0,0,.78), transparent 40%),
            url("${heroImage}");
          background-size: cover;
          background-position: center;
          padding: 130px 8vw 80px;
        }

        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 70% 50%, transparent, rgba(0,0,0,.38) 65%),
            linear-gradient(to right, rgba(0,0,0,.2), transparent);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .eyebrow {
          color: var(--gold-light);
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .hero h1 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(62px, 8vw, 116px);
          line-height: .78;
          font-weight: 500;
          margin: 0;
          letter-spacing: -3px;
        }

        .hero h1 span {
          color: var(--gold-light);
          font-style: italic;
          display: block;
          margin-top: 12px;
        }

        .hero-text {
          max-width: 490px;
          margin: 30px 0;
          color: #d0cec7;
          font-size: 14px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .hero-side {
          position: absolute;
          right: 4vw;
          bottom: 70px;
          z-index: 2;
          writing-mode: vertical-rl;
          font-size: 9px;
          letter-spacing: 3px;
          color: #bbb;
          text-transform: uppercase;
        }

        .hero-side::before {
          content: "";
          width: 1px;
          height: 65px;
          background: var(--gold);
          display: block;
          margin-bottom: 12px;
        }

        .section {
          position: relative;
          padding: 100px 7vw;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .section-label {
          color: var(--gold);
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .section-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(45px, 5vw, 70px);
          font-weight: 500;
          line-height: .9;
          margin: 0;
        }

        .section-title span {
          color: var(--gold-light);
          font-style: italic;
        }

        .story {
          min-height: 620px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
          padding: 0;
        }

        .story-image {
          min-height: 620px;
          background:
            linear-gradient(90deg, transparent 50%, #050606 100%),
            url("${aboutImage}") center/cover;
        }

        .story-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 70px 8vw 70px 3vw;
          background:
            radial-gradient(circle at 0 50%, rgba(215,168,75,.1), transparent 35%),
            #050606;
        }

        .story-text {
          color: #aaa9a2;
          line-height: 1.9;
          max-width: 570px;
          font-size: 14px;
          margin: 25px 0;
        }

        .feature-list {
          margin-top: 35px;
          display: grid;
          gap: 0;
          max-width: 430px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 0;
          border-bottom: 1px solid var(--line);
        }

        .feature-icon {
          width: 38px;
          height: 38px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--gold);
        }

        .feature-text {
          font-family: "Cormorant Garamond", serif;
          font-size: 20px;
        }

        .menu-section {
          background:
            linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.72)),
            url("${FALLBACK_FOOD}") center/cover fixed;
        }

        .menu-head {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          align-items: end;
          margin-bottom: 45px;
        }

        .category-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 35px;
        }

        .category {
          border: 1px solid rgba(215,168,75,.35);
          background: rgba(0,0,0,.5);
          color: #aaa;
          border-radius: 999px;
          padding: 9px 16px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .category.active,
        .category:hover {
          background: rgba(215,168,75,.14);
          border-color: var(--gold);
          color: var(--gold-light);
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .menu-card {
          background: rgba(5,7,7,.75);
          border: 1px solid rgba(215,168,75,.38);
          border-radius: 4px;
          overflow: hidden;
          transition: .3s;
          backdrop-filter: blur(10px);
        }

        .menu-card:hover {
          transform: translateY(-6px);
          border-color: var(--gold);
          box-shadow: 0 18px 50px rgba(0,0,0,.45);
        }

        .menu-image {
          height: 220px;
          background-size: cover;
          background-position: center;
        }

        .menu-info {
          padding: 20px;
        }

        .menu-category {
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .menu-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 27px;
          margin: 8px 0;
        }

        .menu-desc {
          color: #92928d;
          font-size: 12px;
          line-height: 1.7;
          min-height: 40px;
        }

        .menu-price {
          color: var(--gold-light);
          margin-top: 15px;
          font-size: 15px;
          font-weight: 600;
        }

        .empty {
          padding: 50px;
          border: 1px dashed rgba(215,168,75,.35);
          color: #999;
          text-align: center;
          grid-column: 1/-1;
        }

        .gallery-section {
          background: #080909;
        }

        .gallery-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 50px;
          align-items: center;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .gallery-item {
          height: 260px;
          border: 1px solid rgba(255,255,255,.08);
          overflow: hidden;
          position: relative;
          background: #111;
        }

        .gallery-item:first-child {
          height: 360px;
        }

        .gallery-item:nth-child(2) {
          height: 300px;
          margin-top: 60px;
        }

        .gallery-item:nth-child(3) {
          height: 330px;
          margin-top: 25px;
        }

        .gallery-item:nth-child(4) {
          height: 280px;
          margin-top: 75px;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: .6s;
        }

        .gallery-item:hover img {
          transform: scale(1.07);
        }

        .promotion-section {
          padding-top: 80px;
          padding-bottom: 80px;
          background:
            radial-gradient(circle at 50% 0%, rgba(215,168,75,.13), transparent 40%),
            #060707;
        }

        .promo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 45px;
        }

        .promo-card {
          min-height: 360px;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          background: #101111;
        }

        .promo-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .55;
        }

        .promo-overlay {
          position: absolute;
          inset: 0;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: end;
          background: linear-gradient(transparent, rgba(0,0,0,.95));
        }

        .promo-offer {
          color: var(--gold-light);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .promo-title {
          font-family: "Cormorant Garamond", serif;
          font-size: 35px;
          margin: 8px 0;
        }

        .booking-section {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          background:
            linear-gradient(90deg, rgba(0,0,0,.9), rgba(0,0,0,.45)),
            url("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2200&q=90")
            center/cover;
        }

        .booking-copy {
          padding-right: 8vw;
        }

        .booking-copy p {
          color: #aaa;
          max-width: 450px;
          line-height: 1.8;
        }

        .booking-card {
          background: rgba(4,6,6,.78);
          border: 1px solid rgba(215,168,75,.55);
          padding: 30px;
          backdrop-filter: blur(14px);
          box-shadow: 0 25px 80px rgba(0,0,0,.4);
        }

        .booking-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field.full {
          grid-column: 1/-1;
        }

        .field label {
          color: #aaa;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .field input,
        .field textarea,
        .field select {
          width: 100%;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.16);
          color: #eee;
          padding: 13px;
          border-radius: 4px;
          outline: none;
        }

        .field select option {
          background: #111;
        }

        .field input:focus,
        .field textarea:focus,
        .field select:focus {
          border-color: var(--gold);
        }

        .field textarea {
          min-height: 90px;
          resize: vertical;
        }

        .booking-message {
          margin-top: 14px;
          padding: 12px;
          border: 1px solid rgba(100,190,120,.4);
          background: rgba(60,130,70,.12);
          color: #b9e9c0;
          font-size: 12px;
        }

        .reviews-section {
          background:
            linear-gradient(90deg, rgba(0,0,0,.94), rgba(0,0,0,.8)),
            url("${FALLBACK_FOOD}") center/cover;
        }

        .reviews-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
          margin-bottom: 45px;
        }

        .rating {
          color: var(--gold-light);
          letter-spacing: 4px;
          font-size: 14px;
        }

        .rating-number {
          color: #aaa;
          letter-spacing: 0;
          margin-left: 10px;
          font-size: 12px;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .review-card {
          border: 1px solid rgba(255,255,255,.17);
          background: rgba(5,7,7,.72);
          padding: 25px;
          min-height: 230px;
          backdrop-filter: blur(10px);
        }

        .review-stars {
          color: var(--gold-light);
          letter-spacing: 3px;
        }

        .review-text {
          color: #bbb;
          line-height: 1.8;
          font-size: 13px;
          margin: 20px 0;
        }

        .review-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 20px;
        }

        .review-date {
          color: #777;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contact-section {
          padding: 75px 7vw 40px;
          background:
            linear-gradient(0deg, rgba(0,0,0,.93), rgba(0,0,0,.2)),
            url("https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=2200&q=85")
            center/cover;
        }

        .contact-top {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 30px;
          align-items: center;
        }

        .contact-big {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(42px, 5vw, 70px);
          line-height: .85;
        }

        .contact-big span {
          color: var(--gold-light);
          font-style: italic;
        }

        .contact-item {
          display: flex;
          gap: 13px;
          align-items: start;
        }

        .contact-icon {
          color: var(--gold);
          font-size: 20px;
        }

        .contact-label {
          color: #777;
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .contact-value {
          color: #ddd;
          font-size: 12px;
          line-height: 1.6;
          word-break: break-word;
        }

        .socials {
          display: flex;
          gap: 9px;
          margin-top: 25px;
        }

        .social {
          width: 35px;
          height: 35px;
          border: 1px solid var(--line);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--gold-light);
          font-size: 10px;
        }

        .footer {
          min-height: 90px;
          border-top: 1px solid rgba(255,255,255,.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 7vw;
          background: #030404;
          color: #777;
          font-size: 10px;
        }

        .footer-logo {
          color: var(--gold);
          font-family: "Cormorant Garamond", serif;
          font-size: 25px;
        }

        .maintenance {
          min-height: 100vh;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 30px;
          background:
            radial-gradient(circle, rgba(215,168,75,.13), transparent 40%),
            #050606;
        }

        .maintenance-box {
          max-width: 600px;
          border: 1px solid var(--line);
          padding: 55px;
          background: rgba(255,255,255,.025);
        }

        .mobile-bottom {
          display: none;
        }

        @media (max-width: 1100px) {
          .nav-links {
            gap: 15px;
          }

          .menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gallery-item,
          .gallery-item:first-child,
          .gallery-item:nth-child(2),
          .gallery-item:nth-child(3),
          .gallery-item:nth-child(4) {
            height: 280px;
            margin-top: 0;
          }

          .contact-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 820px) {
          .navbar {
            height: 70px;
            padding: 0 20px;
          }

          .nav-links {
            display: none;
            position: absolute;
            top: 70px;
            left: 15px;
            right: 15px;
            padding: 18px;
            flex-direction: column;
            align-items: stretch;
            background: rgba(5,6,6,.97);
            border: 1px solid var(--line);
            border-radius: 12px;
          }

          .nav-links.open {
            display: flex;
          }

          .nav-links button {
            text-align: left;
            padding: 12px;
          }

          .nav-right {
            display: none;
          }

          .menu-toggle {
            display: block;
          }

          .logo {
            min-width: 120px;
            align-items: flex-start;
          }

          .logo-main {
            font-size: 24px;
          }

          .hero {
            min-height: 92vh;
            padding: 120px 25px 70px;
            background-position: 60% center;
          }

          .hero h1 {
            font-size: clamp(58px, 17vw, 95px);
          }

          .hero-side {
            display: none;
          }

          .section {
            padding: 75px 22px;
          }

          .story {
            grid-template-columns: 1fr;
          }

          .story-image {
            min-height: 400px;
          }

          .story-content {
            padding: 65px 25px;
          }

          .menu-head {
            display: block;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }

          .menu-image {
            height: 250px;
          }

          .gallery-layout {
            grid-template-columns: 1fr;
          }

          .gallery-grid {
            grid-template-columns: 1fr 1fr;
          }

          .promo-grid {
            grid-template-columns: 1fr;
          }

          .booking-section {
            grid-template-columns: 1fr;
            padding: 80px 22px;
            gap: 35px;
          }

          .booking-copy {
            padding-right: 0;
          }

          .reviews-head {
            display: block;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .contact-top {
            grid-template-columns: 1fr;
          }

          .footer {
            flex-direction: column;
            text-align: center;
          }

          .mobile-bottom {
            position: fixed;
            z-index: 120;
            bottom: 0;
            left: 0;
            right: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: rgba(4,5,5,.96);
            backdrop-filter: blur(15px);
            border-top: 1px solid var(--line);
            padding: 8px;
          }

          .mobile-bottom button {
            border: 0;
            padding: 13px;
            background: transparent;
            color: #ccc;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .mobile-bottom button:last-child {
            background: linear-gradient(135deg, #f2c867, #c58d27);
            color: #17120a;
            border-radius: 5px;
          }
        }

        @media (max-width: 520px) {
          .top-news {
            font-size: 8px;
          }

          .hero-text {
            font-size: 12px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-actions button {
            width: 100%;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .gallery-item,
          .gallery-item:first-child,
          .gallery-item:nth-child(2),
          .gallery-item:nth-child(3),
          .gallery-item:nth-child(4) {
            height: 270px;
          }

          .booking-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .booking-card {
            padding: 18px;
          }

          .contact-section {
            padding-left: 22px;
            padding-right: 22px;
          }
        }
      `}</style>

      {maintenance ? (
        <section className="maintenance">
          <div className="maintenance-box">
            <div className="section-label">NABABI RISTORANTE</div>
            <h1 className="section-title">
              Website <span>Maintenance</span>
            </h1>
            <p className="story-text" style={{ marginInline: "auto" }}>
              We are preparing something beautiful for you. Please check back
              shortly.
            </p>
          </div>
        </section>
      ) : (
        <>
          {activeNews.length > 0 && (
            <div className="top-news">
              {activeNews[0].text || activeNews[0].title || ""}
            </div>
          )}

          <header className="navbar">
            <button
              className="logo"
              onClick={() => scrollTo("home")}
              style={{
                border: 0,
                background: "transparent",
                color: "inherit",
              }}
            >
              <span className="logo-crown">♛</span>
              <span className="logo-main">
                {restaurantName.split(" ")[0] || "NABABI"}
              </span>
              <span className="logo-sub">RISTORANTE</span>
            </button>

            <nav className={`nav-links ${mobileMenu ? "open" : ""}`}>
              <button onClick={() => scrollTo("home")}>Home</button>
              {about.visible !== false && (
                <button onClick={() => scrollTo("about")}>About</button>
              )}
              <button onClick={() => scrollTo("menu")}>Menu</button>
              <button onClick={() => scrollTo("gallery")}>Gallery</button>
              <button onClick={() => scrollTo("reviews")}>Reviews</button>
              <button onClick={() => scrollTo("contact")}>Contact</button>
            </nav>

            <div className="nav-right">
              {languages.switcherVisible !== false &&
                enabledLanguages.map((lang) => (
                  <button
                    key={lang}
                    className={`language-btn ${
                      language === lang ? "active" : ""
                    }`}
                    onClick={() => setLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}

              <button
                className="gold-btn"
                onClick={() => scrollTo("reservation")}
              >
                Reserve a Table
              </button>
            </div>

            <button
              className="menu-toggle"
              onClick={() => setMobileMenu((v) => !v)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </header>

          <section id="home" className="hero">
            <div className="hero-content">
              <div className="eyebrow">
                Authentic Italian & Asian Cuisine
              </div>

              <h1>
                {heroTitle}
                <span>Tradition</span>
              </h1>

              <p className="hero-text">{heroSubtitle || welcomeText}</p>

              <div className="hero-actions">
                <button
                  className="gold-btn"
                  onClick={() => scrollTo("menu")}
                >
                  Explore Menu →
                </button>

                <button
                  className="outline-btn"
                  onClick={() => scrollTo("about")}
                >
                  Discover Our Story
                </button>
              </div>
            </div>

            <div className="hero-side">Scroll Down</div>
          </section>

          {about.visible !== false && (
            <section id="about" className="story">
              <div className="story-image" />

              <div className="story-content">
                <div className="section-label">Our Story</div>

                <h2 className="section-title">
                  More Than
                  <span> Just Food</span>
                </h2>

                <p className="story-text">
                  {about.content ||
                    welcomeText ||
                    "At Nababi Ristorante, we believe food brings people together. Our cuisine is a story of passion, tradition and a deep love for authentic flavours."}
                </p>

                <button
                  className="outline-btn"
                  style={{ width: "fit-content" }}
                  onClick={() => scrollTo("menu")}
                >
                  Explore Our Menu →
                </button>

                <div className="feature-list">
                  <div className="feature">
                    <div className="feature-icon">♡</div>
                    <div className="feature-text">Authentic Recipes</div>
                  </div>

                  <div className="feature">
                    <div className="feature-icon">✦</div>
                    <div className="feature-text">Fresh Ingredients</div>
                  </div>

                  <div className="feature">
                    <div className="feature-icon">♢</div>
                    <div className="feature-text">Warm Hospitality</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section id="menu" className="section menu-section">
            <div className="menu-head">
              <div>
                <div className="section-label">Our Menu</div>

                <h2 className="section-title">
                  Signature
                  <span> Dishes</span>
                </h2>
              </div>

              <button
                className="outline-btn"
                onClick={() => scrollTo("reservation")}
              >
                Book Your Table →
              </button>
            </div>

            <div className="category-row">
              <button
                className={`category ${
                  selectedCategory === "All" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                All
              </button>

              {menuCategories.map((category) => (
                <button
                  key={category}
                  className={`category ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {filteredMenu.length === 0 ? (
                <div className="empty">
                  Menu items will appear here after you add them from the
                  Admin Menu.
                </div>
              ) : (
                filteredMenu.map((item, index) => (
                  <article
                    className="menu-card"
                    key={item.id || `${item.name}-${index}`}
                  >
                    <div
                      className="menu-image"
                      style={{
                        backgroundImage: `url("${getImage(
                          item.image,
                          FALLBACK_FOOD
                        )}")`,
                      }}
                    />

                    <div className="menu-info">
                      <div className="menu-category">
                        {item.category || "Signature"}
                      </div>

                      <h3 className="menu-name">
                        {item.name || "Signature Dish"}
                      </h3>

                      <p className="menu-desc">
                        {item.description || "Prepared fresh with care."}
                      </p>

                      <div className="menu-price">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {activePromotions.length > 0 && (
            <section className="section promotion-section">
              <div className="section-label">Special Offers</div>

              <h2 className="section-title">
                Taste Something
                <span> Special</span>
              </h2>

              <div className="promo-grid">
                {activePromotions.map((promo, index) => (
                  <article
                    className="promo-card"
                    key={promo.id || `${promo.title}-${index}`}
                  >
                    <img
                      src={getImage(promo.image, FALLBACK_FOOD)}
                      alt={promo.title || "Nababi promotion"}
                    />

                    <div className="promo-overlay">
                      <div className="promo-offer">
                        {promo.offer || "Special Offer"}
                      </div>

                      <h3 className="promo-title">
                        {promo.title || "Nababi Special"}
                      </h3>

                      <p className="story-text" style={{ margin: 0 }}>
                        {promo.description || ""}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section id="gallery" className="section gallery-section">
            <div className="gallery-layout">
              <div>
                <div className="section-label">Our Gallery</div>

                <h2 className="section-title">
                  A Glimpse of
                  <span> Nababi</span>
                </h2>

                <p className="story-text">
                  A visual taste of our restaurant, dishes and dining
                  atmosphere.
                </p>

                <button
                  className="outline-btn"
                  onClick={() => scrollTo("reservation")}
                >
                  Reserve a Table →
                </button>
              </div>

              <div className="gallery-grid">
                {(visibleGallery.length > 0
                  ? visibleGallery.slice(0, 8)
                  : FALLBACK_GALLERY.map((image, index) => ({
                      id: `fallback-${index}`,
                      image,
                    }))
                ).map((item: AnyData, index: number) => (
                  <div
                    className="gallery-item"
                    key={item.id || index}
                  >
                    <img
                      src={getImage(
                        item.image || item.url,
                        FALLBACK_GALLERY[index % FALLBACK_GALLERY.length]
                      )}
                      alt={item.title || "Nababi Ristorante"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="reservation" className="section booking-section">
            <div className="booking-copy">
              <div className="section-label">Reservation</div>

              <h2 className="section-title">
                Book Your
                <span> Table</span>
              </h2>

              <p>
                {home.bookingText ||
                  "Give yourself an unforgettable dining experience at Nababi Ristorante."}
              </p>

              <button
                className="outline-btn"
                onClick={() => scrollTo("contact")}
              >
                Need Help? Contact Us
              </button>
            </div>

            <form className="booking-card" onSubmit={submitBooking}>
              <div className="booking-grid">
                <div className="field">
                  <label>Name *</label>
                  <input
                    required
                    value={booking.name}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your name"
                  />
                </div>

                <div className="field">
                  <label>Phone *</label>
                  <input
                    required
                    value={booking.phone}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Your phone number"
                  />
                </div>

                <div className="field">
                  <label>Date *</label>
                  <input
                    required
                    type="date"
                    value={booking.date}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="field">
                  <label>Time *</label>
                  <input
                    required
                    type="time"
                    value={booking.time}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        time: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="field">
                  <label>Guests *</label>
                  <select
                    value={booking.guests}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        guests: e.target.value,
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Message</label>
                  <textarea
                    value={booking.message}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        message: e.target.value,
                      })
                    }
                    placeholder="Special requests..."
                  />
                </div>

                <div className="field full">
                  <button className="gold-btn" type="submit">
                    Send Reservation →
                  </button>
                </div>
              </div>

              {bookingSent && (
                <div className="booking-message">
                  Your reservation request has been received successfully.
                </div>
              )}
            </form>
          </section>

          <section id="reviews" className="section reviews-section">
            <div className="reviews-head">
              <div>
                <div className="section-label">What Our Guests Say</div>

                <h2 className="section-title">
                  Guest
                  <span> Reviews</span>
                </h2>
              </div>

              <div>
                <div className="rating">
                  {"★★★★★"}
                  <span className="rating-number">
                    {averageRating.toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </div>

            <div className="reviews-grid">
              {visibleReviews.length === 0 ? (
                <div className="empty">
                  Reviews will appear here after you add them from Admin.
                </div>
              ) : (
                visibleReviews.slice(0, 6).map((review, index) => (
                  <article
                    className="review-card"
                    key={review.id || `${review.customerName}-${index}`}
                  >
                    <div className="review-stars">
                      {"★".repeat(
                        Math.max(
                          1,
                          Math.min(5, Number(review.rating || 5))
                        )
                      )}
                    </div>

                    <p className="review-text">
                      “{review.review || "Wonderful dining experience."}”
                    </p>

                    <div className="review-name">
                      {review.customerName || "Guest"}
                    </div>

                    <div className="review-date">
                      {review.date || "Nababi Guest"}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {Object.keys(hours || {}).length > 0 && (
            <section className="section" style={{ background: "#070808" }}>
              <div className="section-label">Opening Hours</div>

              <h2 className="section-title">
                Visit
                <span> Nababi</span>
              </h2>

              <div
                style={{
                  marginTop: 40,
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 12,
                }}
              >
                {currentHours.map((item) => (
                  <div
                    key={item.day}
                    style={{
                      border: "1px solid rgba(215,168,75,.25)",
                      padding: 18,
                      background: "rgba(255,255,255,.02)",
                    }}
                  >
                    <div
                      style={{
                        color: "#d7a84b",
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {getDayLabel(item.day)}
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        color: "#ddd",
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: 22,
                      }}
                    >
                      {item.open === false || item.closed === true
                        ? "Closed"
                        : `${item.opening || "11:00"} — ${
                            item.closing || "23:00"
                          }`}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {contact.visible !== false && (
            <section id="contact" className="contact-section">
              <div className="contact-top">
                <div>
                  <div className="section-label">Get In Touch</div>

                  <h2 className="contact-big">
                    Let's Make
                    <span> Memories Together</span>
                  </h2>

                  <div className="socials">
                    {social.facebook && (
                      <a
                        className="social"
                        href={social.facebook}
                        target="_blank"
                        rel="noreferrer"
                      >
                        f
                      </a>
                    )}

                    {social.instagram && (
                      <a
                        className="social"
                        href={social.instagram}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ◎
                      </a>
                    )}

                    {social.tiktok && (
                      <a
                        className="social"
                        href={social.tiktok}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ♪
                      </a>
                    )}

                    {social.youtube && (
                      <a
                        className="social"
                        href={social.youtube}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ▶
                      </a>
                    )}
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">⌖</div>
                  <div>
                    <div className="contact-label">Address</div>
                    <div className="contact-value">
                      {contact.address || "Rome, Italy"}
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">☎</div>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">
                      {contact.phone || "+39 06 123 4567"}
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">✉</div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">
                      {contact.email || "info@nababi.it"}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 40,
                }}
              >
                {contact.googleMapsUrl && (
                  <a
                    className="gold-btn"
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Google Maps →
                  </a>
                )}
              </div>
            </section>
          )}

          <footer className="footer">
            <div className="footer-logo">
              {restaurantName.split(" ")[0] || "NABABI"}
            </div>

            <div>
              © {new Date().getFullYear()} {restaurantName}. All rights
              reserved.
            </div>

            <div>Admin Panel</div>
          </footer>

          <div className="mobile-bottom">
            <button onClick={() => scrollTo("menu")}>View Menu</button>
            <button onClick={() => scrollTo("reservation")}>
              Reserve Table
            </button>
          </div>
        </>
      )}
    </main>
  );
}
