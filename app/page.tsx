"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Lang = "en" | "it" | "bn";

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
  name: string;
  image?: string;
  order?: number;
  visible?: boolean;
};

type GalleryItem = {
  id?: string;
  image?: string;
  category?: string;
  visible?: boolean;
  order?: number;
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

const GOLD = "#d9a441";
const GOLD_LIGHT = "#f6cf70";

const defaultCategories: MenuCategory[] = [
  {
    id: "biryani",
    name: "Biryani",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85",
    order: 1,
    visible: true,
  },
  {
    id: "pizza",
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=85",
    order: 2,
    visible: true,
  },
  {
    id: "burger",
    name: "Burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85",
    order: 3,
    visible: true,
  },
  {
    id: "naan",
    name: "Naan",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=85",
    order: 4,
    visible: true,
  },
  {
    id: "chicken",
    name: "Chicken",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=85",
    order: 5,
    visible: true,
  },
  {
    id: "mutton",
    name: "Mutton",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85",
    order: 6,
    visible: true,
  },
  {
    id: "drinks",
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85",
    order: 7,
    visible: true,
  },
  {
    id: "dessert",
    name: "Dessert",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=700&q=85",
    order: 8,
    visible: true,
  },
];

const translations = {
  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    login: "Login / Register",
    admin: "Admin",
    welcome: "WELCOME TO",
    subtitle: "Authentic Flavors of India & Bangladesh",
    heroText:
      "Experience royal taste with traditional spices, fresh ingredients and warm hospitality.",
    explore: "Explore Menu",
    fresh: "Fresh Ingredients",
    freshSub: "Only the best for you",
    chefs: "Skilled Chefs",
    chefsSub: "Crafted with love",
    ambience: "Cozy Ambience",
    ambienceSub: "Feel at home",
    service: "Fast Service",
    serviceSub: "Your time matters",
    aboutUs: "ABOUT US",
    ourStory: "Our Story",
    learnMore: "Learn More",
    watchVideo: "Watch Our Restaurant Video",
    playVideo: "Play Video",
    smallReviews: "Reviews",
    viewReviews: "View Reviews",
    ourMenu: "Our Menu",
    chooseCategory: "Choose Your Favourite Category",
    fullMenu: "View Full Menu",
    tableBooking: "Table Booking",
    reserve: "Reserve Your Table",
    phone: "Phone Number",
    email: "Email",
    date: "Date",
    time: "Time",
    persons: "No. of Persons",
    category: "Category",
    item: "Item",
    special: "Special Request",
    confirm: "Confirm Booking",
    cancel: "Cancel",
    bookingDetails: "Booking Details",
    viewEditCancel: "View, Edit or Cancel",
    bookingCode: "Booking Code",
    viewDetails: "View Details",
    edit: "Edit",
    galleryTitle: "Gallery",
    gallerySub: "Our Photo Gallery",
    viewGallery: "View Gallery",
    map: "Find Us on Map",
    openMap: "Open Map",
    contactUs: "Contact Us",
    socialMedia: "Social Media",
    quick: "Quick Links",
    writeReview: "Write a Review",
    allReviews: "All Reviews",
    reviewDetails: "Review Details",
    submitReview: "Submit Review",
    rating: "Rating",
    name: "Name",
    close: "Close",
    noReviews: "No reviews yet.",
    noGallery: "Gallery images will appear here.",
  },

  it: {
    home: "Home",
    about: "Chi siamo",
    menu: "Menu",
    gallery: "Galleria",
    reviews: "Recensioni",
    contact: "Contatti",
    login: "Login / Registrati",
    admin: "Admin",
    welcome: "BENVENUTI A",
    subtitle: "Autentici sapori dell'India e del Bangladesh",
    heroText:
      "Scopri il gusto reale con spezie tradizionali, ingredienti freschi e calorosa ospitalità.",
    explore: "Esplora Menu",
    fresh: "Ingredienti Freschi",
    freshSub: "Solo il meglio per te",
    chefs: "Chef Esperti",
    chefsSub: "Preparato con amore",
    ambience: "Atmosfera Accogliente",
    ambienceSub: "Sentiti a casa",
    service: "Servizio Veloce",
    serviceSub: "Il tuo tempo conta",
    aboutUs: "CHI SIAMO",
    ourStory: "La Nostra Storia",
    learnMore: "Scopri di più",
    watchVideo: "Guarda il Video del Ristorante",
    playVideo: "Guarda Video",
    smallReviews: "Recensioni",
    viewReviews: "Vedi Recensioni",
    ourMenu: "Il Nostro Menu",
    chooseCategory: "Scegli la tua categoria preferita",
    fullMenu: "Vedi Menu Completo",
    tableBooking: "Prenotazione Tavolo",
    reserve: "Prenota il tuo tavolo",
    phone: "Numero di telefono",
    email: "Email",
    date: "Data",
    time: "Ora",
    persons: "Numero persone",
    category: "Categoria",
    item: "Prodotto",
    special: "Richiesta speciale",
    confirm: "Conferma Prenotazione",
    cancel: "Annulla",
    bookingDetails: "Dettagli Prenotazione",
    viewEditCancel: "Visualizza, modifica o annulla",
    bookingCode: "Codice Prenotazione",
    viewDetails: "Vedi Dettagli",
    edit: "Modifica",
    galleryTitle: "Galleria",
    gallerySub: "La Nostra Galleria",
    viewGallery: "Vedi Galleria",
    map: "Trova sulla Mappa",
    openMap: "Apri Mappa",
    contactUs: "Contatti",
    socialMedia: "Social Media",
    quick: "Link Rapidi",
    writeReview: "Scrivi una Recensione",
    allReviews: "Tutte le Recensioni",
    reviewDetails: "Dettagli Recensione",
    submitReview: "Invia Recensione",
    rating: "Valutazione",
    name: "Nome",
    close: "Chiudi",
    noReviews: "Nessuna recensione.",
    noGallery: "Le immagini della galleria appariranno qui.",
  },

  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    login: "লগইন / রেজিস্টার",
    admin: "অ্যাডমিন",
    welcome: "স্বাগতম",
    subtitle: "ভারত ও বাংলাদেশের আসল স্বাদ",
    heroText:
      "ঐতিহ্যবাহী মসলা, তাজা উপকরণ এবং আন্তরিক আতিথেয়তার সঙ্গে রাজকীয় স্বাদ উপভোগ করুন।",
    explore: "মেনু দেখুন",
    fresh: "তাজা উপকরণ",
    freshSub: "আপনার জন্য সেরাটাই",
    chefs: "দক্ষ শেফ",
    chefsSub: "ভালোবাসা দিয়ে তৈরি",
    ambience: "আরামদায়ক পরিবেশ",
    ambienceSub: "ঘরের মতো অনুভূতি",
    service: "দ্রুত সার্ভিস",
    serviceSub: "আপনার সময় গুরুত্বপূর্ণ",
    aboutUs: "আমাদের সম্পর্কে",
    ourStory: "আমাদের গল্প",
    learnMore: "আরও জানুন",
    watchVideo: "রেস্টুরেন্ট ভিডিও দেখুন",
    playVideo: "ভিডিও দেখুন",
    smallReviews: "রিভিউ",
    viewReviews: "রিভিউ দেখুন",
    ourMenu: "আমাদের মেনু",
    chooseCategory: "আপনার পছন্দের ক্যাটাগরি নির্বাচন করুন",
    fullMenu: "সম্পূর্ণ মেনু",
    tableBooking: "টেবিল বুকিং",
    reserve: "টেবিল রিজার্ভ করুন",
    phone: "ফোন নম্বর",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    persons: "কতজন",
    category: "ক্যাটাগরি",
    item: "আইটেম",
    special: "বিশেষ অনুরোধ",
    confirm: "বুকিং নিশ্চিত করুন",
    cancel: "বাতিল",
    bookingDetails: "বুকিং ডিটেইলস",
    viewEditCancel: "দেখুন, পরিবর্তন বা বাতিল করুন",
    bookingCode: "বুকিং কোড",
    viewDetails: "ডিটেইলস দেখুন",
    edit: "এডিট",
    galleryTitle: "গ্যালারি",
    gallerySub: "আমাদের ছবি",
    viewGallery: "গ্যালারি দেখুন",
    map: "ম্যাপে খুঁজুন",
    openMap: "ম্যাপ খুলুন",
    contactUs: "যোগাযোগ",
    socialMedia: "সোশ্যাল মিডিয়া",
    quick: "কুইক লিংক",
    writeReview: "রিভিউ লিখুন",
    allReviews: "সব রিভিউ",
    reviewDetails: "রিভিউ ডিটেইলস",
    submitReview: "রিভিউ পাঠান",
    rating: "রেটিং",
    name: "নাম",
    close: "বন্ধ করুন",
    noReviews: "এখনও কোনো রিভিউ নেই।",
    noGallery: "গ্যালারির ছবি এখানে দেখা যাবে।",
  },
};

function getText(
  lang: Lang,
  key: keyof typeof translations.en
) {
  return translations[lang][key];
}

function readStorage<T>(
  key: string,
  fallback: T
): T {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) return fallback;

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeImage(value?: string) {
  if (!value) return "";
  return value;
}

function normalizeCategories(
  rawCategories: any[]
): MenuCategory[] {
  if (!Array.isArray(rawCategories)) {
    return defaultCategories;
  }

  const normalized =
    rawCategories
      .map(
        (
          category: any,
          index: number
        ) => {
          if (
            typeof category ===
            "string"
          ) {
            const fallback =
              defaultCategories.find(
                (item) =>
                  item.name.toLowerCase() ===
                  category
                    .toLowerCase()
              );

            return {
              id:
                fallback?.id ||
                `category-${index}`,
              name: category,
              image:
                fallback?.image ||
                "",
              order:
                fallback?.order ||
                index + 1,
              visible:
                true,
            };
          }

          const name = String(
            category?.name ??
              category?.title ??
              ""
          ).trim();

          if (!name) {
            return null;
          }

          const fallback =
            defaultCategories.find(
              (item) =>
                item.name.toLowerCase() ===
                name.toLowerCase()
            );

          return {
            id:
              String(
                category?.id ||
                  fallback?.id ||
                  `category-${index}`
              ),
            name,
            image:
              category?.image ||
              category?.categoryImage ||
              fallback?.image ||
              "",
            order:
              Number(
                category?.order
              ) || index + 1,
            visible:
              category?.visible !==
              false,
          };
        }
      )
      .filter(
        Boolean
      ) as MenuCategory[];

  const unique =
    normalized.filter(
      (
        category,
        index,
        array
      ) =>
        array.findIndex(
          (item) =>
            item.name.toLowerCase() ===
            category.name.toLowerCase()
        ) === index
    );

  return unique.length
    ? unique
        .filter(
          (item) =>
            item.visible !==
            false
        )
        .sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        )
    : defaultCategories;
}

export default function HomePage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const [home, setHome] =
    useState<any>({});

  const [contact, setContact] =
    useState<any>({});

  const [social, setSocial] =
    useState<any>({});

  const [
    openingHours,
    setOpeningHours,
  ] = useState<any[]>([]);

  const [settings, setSettings] =
    useState<any>({});

  const [
    menuItems,
    setMenuItems,
  ] = useState<MenuItem[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<MenuCategory[]>(
    defaultCategories
  );

  const [
    gallery,
    setGallery,
  ] = useState<GalleryItem[]>(
    []
  );

  const [
    reviews,
    setReviews,
  ] = useState<Review[]>([]);

  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>(
    []
  );

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("Biryani");

  const [
    galleryOpen,
    setGalleryOpen,
  ] = useState(false);

  const [
    reviewsOpen,
    setReviewsOpen,
  ] = useState(false);

  const [
    reviewForm,
    setReviewForm,
  ] = useState({
    name: "",
    phone: "",
    email: "",
    rating: 5,
    review: "",
  });

  const [
    bookingForm,
    setBookingForm,
  ] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    persons: "2",
    category: "Biryani",
    item: "",
    note: "",
  });

  const [
    bookingMessage,
    setBookingMessage,
  ] = useState("");

  const [
    reviewMessage,
    setReviewMessage,
  ] = useState("");

  const [
    breakingNews,
    setBreakingNews,
  ] = useState<any[]>([]);

  const [
    newsClosed,
    setNewsClosed,
  ] = useState(false);

  const t = (
    key: keyof typeof translations.en
  ) =>
    getText(
      lang,
      key
    );

  useEffect(() => {
    const savedLang =
      localStorage.getItem(
        "nababi-language"
      ) as Lang | null;

    if (
      savedLang === "en" ||
      savedLang === "it" ||
      savedLang === "bn"
    ) {
      setLang(savedLang);
    }

    setHome(
      readStorage(
        "nababi-home-settings",
        {}
      )
    );

    setContact(
      readStorage(
        "nababi-contact",
        {}
      )
    );

    setSocial(
      readStorage(
        "nababi-social-media",
        {}
      )
    );

    setOpeningHours(
      readStorage(
        "nababi-opening-hours",
        []
      )
    );

    setSettings(
      readStorage(
        "nababi-settings",
        {}
      )
    );

    const rawMenu =
      readStorage<any[]>(
        "nababi-menu",
        []
      );

    setMenuItems(
      Array.isArray(rawMenu)
        ? rawMenu
        : []
    );

    /*
     * IMPORTANT:
     * Category images now come ONLY
     * from nababi-categories.
     *
     * Product image is never used
     * as category image.
     */
    const rawCategories =
      readStorage<any[]>(
        "nababi-categories",
        defaultCategories
      );

    const normalizedCategories =
      normalizeCategories(
        rawCategories
      );

    setCategories(
      normalizedCategories
    );

    if (
      normalizedCategories.length >
      0
    ) {
      setSelectedCategory(
        (
          previous
        ) => {
          const exists =
            normalizedCategories.some(
              (category) =>
                category.name.toLowerCase() ===
                previous.toLowerCase()
            );

          return exists
            ? previous
            : normalizedCategories[0]
                .name;
        }
      );
    }

    const rawGallery =
      readStorage<GalleryItem[]>(
        "nababi-gallery",
        []
      );

    setGallery(
      Array.isArray(rawGallery)
        ? rawGallery.filter(
            (item) =>
              item.visible !==
              false
          )
        : []
    );

    const rawReviews =
      readStorage<Review[]>(
        "nababi-reviews",
        []
      );

    setReviews(
      Array.isArray(rawReviews)
        ? rawReviews
            .filter(
              (review) =>
                review.visible !==
                false
            )
            .sort(
              (a, b) =>
                new Date(
                  b.date
                ).getTime() -
                new Date(
                  a.date
                ).getTime()
            )
        : []
    );

    setReservations(
      readStorage<Reservation[]>(
        "nababi-reservations",
        []
      )
    );

    const news =
      readStorage<any[]>(
        "nababi-breaking-news",
        []
      );

    const now =
      new Date();

    const activeNews =
      Array.isArray(news)
        ? news.filter(
            (item) => {
              if (
                item.visible ===
                false
              ) {
                return false;
              }

              if (
                item.startDate
              ) {
                const start =
                  new Date(
                    item.startDate
                  );

                if (
                  now < start
                ) {
                  return false;
                }
              }

              if (
                item.endDate
              ) {
                const end =
                  new Date(
                    item.endDate
                  );

                if (
                  now > end
                ) {
                  return false;
                }
              }

              return true;
            }
          )
        : [];

    setBreakingNews(
      activeNews
    );
  }, []);

  const heroImage =
    home?.heroImage ||
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1400&q=85";

  const aboutImage =
    home?.aboutImage ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85";

  const restaurantName =
    settings?.restaurantName ||
    contact?.restaurantName ||
    "Nababi Ristorante";

  const address =
    contact?.address ||
    "Via Vespasiano 73/75/77, Roma";

  const phone =
    contact?.phone ||
    "+39 393 3805350";

  const email =
    contact?.email ||
    "info@nababi.it";

  const whatsapp =
    contact?.whatsapp ||
    phone;

  const mapUrl =
    contact?.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73+Roma";

  const facebook =
    social?.facebook || "";

  const instagram =
    social?.instagram || "";

  const tiktok =
    social?.tiktok || "";

  const youtube =
    social?.youtube || "";

  const currentItems =
    useMemo(() => {
      return menuItems.filter(
        (item) => {
          const category =
            String(
              item.category ||
                ""
            )
              .trim()
              .toLowerCase();

          return (
            category ===
            selectedCategory.toLowerCase()
          );
        }
      );
    }, [
      menuItems,
      selectedCategory,
    ]);

  const displayItems =
    currentItems.slice(
      0,
      8
    );

  const totalReviews =
    reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (
              sum,
              item
            ) =>
              sum +
              Number(
                item.rating ||
                  0
              ),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  function saveReservation(
    e: FormEvent
  ) {
    e.preventDefault();

    setBookingMessage("");

    if (
      !bookingForm.name ||
      !bookingForm.phone ||
      !bookingForm.email ||
      !bookingForm.date ||
      !bookingForm.time
    ) {
      setBookingMessage(
        "Please complete the required booking fields."
      );

      return;
    }

    const code =
      "NAB-" +
      Math.random()
        .toString(36)
        .substring(
          2,
          8
        )
        .toUpperCase();

    const reservation: Reservation =
      {
        id:
          Date.now().toString(),
        code,
        name:
          bookingForm.name,
        phone:
          bookingForm.phone,
        email:
          bookingForm.email,
        date:
          bookingForm.date,
        time:
          bookingForm.time,
        persons:
          bookingForm.persons,
        category:
          bookingForm.category,
        item:
          bookingForm.item,
        note:
          bookingForm.note,
        status:
          "Confirmed",
      };

    const next = [
      ...reservations,
      reservation,
    ];

    setReservations(
      next
    );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify(next)
    );

    setBookingMessage(
      `Booking confirmed. Your code is ${code}.`
    );

    setBookingForm({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      persons: "2",
      category:
        categories[0]?.name ||
        "Biryani",
      item: "",
      note: "",
    });
  }

  function submitReview(
    e: FormEvent
  ) {
    e.preventDefault();

    setReviewMessage("");

    if (
      !reviewForm.name.trim()
    ) {
      setReviewMessage(
        "Please enter your name."
      );

      return;
    }

    if (
      !reviewForm.phone.trim() &&
      !reviewForm.email.trim()
    ) {
      setReviewMessage(
        "Please enter phone number or email."
      );

      return;
    }

    if (
      !reviewForm.review.trim()
    ) {
      setReviewMessage(
        "Please write your review."
      );

      return;
    }

    const newReview: Review =
      {
        id:
          Date.now().toString(),
        customerName:
          reviewForm.name.trim(),
        phone:
          reviewForm.phone.trim(),
        email:
          reviewForm.email.trim(),
        rating:
          reviewForm.rating,
        review:
          reviewForm.review.trim(),
        date:
          new Date().toISOString(),
        visible: true,
        replies: [],
      };

    const next = [
      ...reviews,
      newReview,
    ].sort(
      (a, b) =>
        new Date(
          b.date
        ).getTime() -
        new Date(
          a.date
        ).getTime()
    );

    setReviews(
      next
    );

    localStorage.setItem(
      "nababi-reviews",
      JSON.stringify(next)
    );

    setReviewMessage(
      "Thank you. Your review has been submitted."
    );

    setReviewForm({
      name: "",
      phone: "",
      email: "",
      rating: 5,
      review: "",
    });
  }

  function openAdmin() {
    window.location.href =
      "/admin";
  }

  return (
    <main className="site">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #02090a;
          color: #f7f0df;
          font-family: Georgia, "Times New Roman", serif;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .site {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(217, 164, 65, 0.08),
              transparent 35%
            ),
            #02090a;
          overflow-x: hidden;
        }

        .gold {
          color: ${GOLD_LIGHT};
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 30px;
          background: rgba(
            1,
            7,
            8,
            0.96
          );
          border-bottom: 1px solid ${GOLD};
          backdrop-filter: blur(15px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 210px;
        }

        .brandMark {
          color: ${GOLD_LIGHT};
          font-size: 37px;
          line-height: 1;
        }

        .brandText {
          font-size: 25px;
          font-weight: 700;
          letter-spacing: 4px;
          color: ${GOLD_LIGHT};
          line-height: 0.9;
        }

        .brandSub {
          display: block;
          margin-top: 5px;
          font-size: 9px;
          letter-spacing: 4px;
          color: ${GOLD};
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 25px;
          font-size: 14px;
          white-space: nowrap;
        }

        .nav a:hover {
          color: ${GOLD_LIGHT};
        }

        .navActive {
          color: ${GOLD_LIGHT};
          border-bottom: 2px solid ${GOLD_LIGHT};
          padding-bottom: 8px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 280px;
          justify-content: flex-end;
        }

        .langButton,
        .adminButton {
          border: 1px solid ${GOLD};
          color: #fff;
          background: transparent;
          border-radius: 25px;
          padding: 8px 13px;
        }

        .adminButton {
          color: ${GOLD_LIGHT};
          font-weight: 700;
        }

        .loginLink {
          color: #fff;
          font-size: 14px;
        }

        .hero {
          min-height: 350px;
          position: relative;
          display: grid;
          grid-template-columns: 30% 40% 30%;
          align-items: center;
          border-bottom: 1px solid ${GOLD};
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.7),
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0.2)
            ),
            url("${heroImage}") center / cover no-repeat;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.75),
              rgba(0, 0, 0, 0.2) 55%,
              rgba(0, 0, 0, 0.15)
            );
        }

        .heroLeft,
        .heroCenter,
        .heroRight {
          position: relative;
          z-index: 2;
        }

        .heroLeft {
          padding: 25px;
          align-self: end;
          padding-bottom: 25px;
        }

        .heroCenter {
          text-align: center;
        }

        .heroRight {
          height: 100%;
        }

        .breaking {
          position: absolute;
          top: 17px;
          left: 20px;
          width: 222px;
          padding: 8px;
          background: rgba(
            2,
            9,
            10,
            0.92
          );
          border: 1px solid #b9c2c4;
          border-radius: 8px;
          box-shadow: 0 10px 30px
            rgba(0, 0, 0, 0.5);
        }

        .breakingHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .breakingTitle {
          background: #ff2424;
          color: #fff;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 5px;
          font-size: 13px;
        }

        .breakingClose {
          color: #fff;
          background: transparent;
          border: 0;
          font-size: 21px;
        }

        .breakingImage {
          width: 100%;
          height: 86px;
          object-fit: cover;
          border-radius: 5px;
        }

        .breakingText {
          margin: 5px 0 2px;
          font-size: 12px;
          font-weight: 700;
        }

        .breakingTime {
          color: ${GOLD_LIGHT};
          font-size: 11px;
        }

        .heroContact {
          margin-top: 130px;
          display: grid;
          gap: 15px;
          font-size: 14px;
        }

        .heroCenterSmall {
          color: ${GOLD_LIGHT};
          font-size: 16px;
          letter-spacing: 1px;
        }

        .heroTitle {
          margin: 8px 0;
          font-size: clamp(
            40px,
            5vw,
            66px
          );
          color: ${GOLD_LIGHT};
          text-shadow: 0 4px 20px
            rgba(0, 0, 0, 0.7);
        }

        .heroSubtitle {
          font-size: 21px;
          font-style: italic;
          color: #fff;
        }

        .heroLine {
          width: 230px;
          height: 1px;
          margin: 23px auto;
          background: ${GOLD};
          position: relative;
        }

        .heroLine::after {
          content: "❧";
          position: absolute;
          left: 50%;
          top: -17px;
          transform: translateX(
            -50%
          );
          color: ${GOLD_LIGHT};
          font-size: 25px;
        }

        .heroDescription {
          max-width: 430px;
          margin: 0 auto 18px;
          line-height: 1.5;
        }

        .goldButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid ${GOLD_LIGHT};
          background: linear-gradient(
            135deg,
            #211700,
            #6e4b08
          );
          color: #fff4d5;
          padding: 11px 24px;
          border-radius: 24px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .goldButton:hover {
          transform: translateY(
            -1px
          );
          box-shadow:
            0 0 18px
              rgba(
                217,
                164,
                65,
                0.25
              );
        }

        .highlights {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          border-bottom: 1px solid ${GOLD};
          background: #021011;
        }

        .highlight {
          min-height: 105px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          border-right: 1px solid ${GOLD};
          text-align: center;
        }

        .highlight:last-child {
          border-right: 0;
        }

        .roundIcon {
          width: 49px;
          height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid ${GOLD};
          border-radius: 50%;
          color: ${GOLD_LIGHT};
          font-size: 25px;
        }

        .highlight strong {
          font-size: 15px;
        }

        .highlight small {
          opacity: 0.8;
          font-size: 11px;
        }

        .aboutSection {
          display: grid;
          grid-template-columns: 1.05fr 1.2fr 0.75fr;
          gap: 28px;
          padding: 27px 40px;
          border-bottom: 1px solid ${GOLD};
          align-items: center;
        }

        .videoCard {
          position: relative;
          min-height: 170px;
          border: 1px solid ${GOLD};
          border-radius: 8px;
          overflow: hidden;
          background: #071113;
        }

        .videoImage {
          width: 100%;
          height: 170px;
          object-fit: cover;
          display: block;
        }

        .videoPlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(
            -50%,
            -50%
          );
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #fff;
          color: #fff;
          background: rgba(
            0,
            0,
            0,
            0.45
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .videoLabel {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 8px;
          background: linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.95)
          );
          text-align: center;
          color: #fff;
        }

        .aboutContent h4 {
          margin: 0 0 5px;
          color: ${GOLD};
          letter-spacing: 1px;
          font-size: 13px;
        }

        .aboutContent h2 {
          margin: 0 0 8px;
          color: ${GOLD_LIGHT};
          font-size: 28px;
        }

        .aboutContent p {
          line-height: 1.5;
          font-size: 14px;
          color: #eee;
        }

        .reviewMini {
          border: 1px solid ${GOLD};
          border-radius: 8px;
          padding: 18px;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background:
            linear-gradient(
              rgba(0, 0, 0, 0.65),
              rgba(0, 0, 0, 0.8)
            ),
            url("${heroImage}") center /
              cover;
        }

        .reviewMiniTitle {
          font-size: 21px;
          color: ${GOLD_LIGHT};
          margin-bottom: 7px;
        }

        .stars {
          color: ${GOLD_LIGHT};
          letter-spacing: 2px;
          font-size: 18px;
        }

        .reviewMiniText {
          font-size: 12px;
          margin: 7px 0 13px;
        }

        .menuSection {
          padding: 12px 40px 25px;
          border-bottom: 1px solid ${GOLD};
        }

        .sectionHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 14px;
        }

        .sectionHeader h2 {
          margin: 0;
          color: ${GOLD_LIGHT};
          font-size: 29px;
        }

        .sectionHeader p {
          margin: 2px 0 0;
          font-size: 13px;
        }

        .categoryRow {
          display: grid;
          grid-template-columns: repeat(
            8,
            1fr
          );
          gap: 9px;
        }

        .categoryCard {
          min-height: 115px;
          border: 1px solid ${GOLD};
          border-radius: 7px;
          background: #041012;
          overflow: hidden;
          color: #fff;
          padding: 0;
          transition: 0.2s ease;
        }

        .categoryCard:hover,
        .categoryCard.active {
          border-color: ${GOLD_LIGHT};
          box-shadow:
            0 0 16px
              rgba(
                217,
                164,
                65,
                0.2
              );
          transform: translateY(
            -2px
          );
        }

        .categoryImage {
          width: 100%;
          height: 80px;
          object-fit: cover;
          display: block;
        }

        .categoryName {
          padding: 7px 3px;
          font-size: 13px;
        }

        .menuItems {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 13px;
        }

        .menuItem {
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.65
            );
          border-radius: 8px;
          overflow: hidden;
          background: #071214;
        }

        .menuItem img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .menuItemBody {
          padding: 10px;
        }

        .menuItemName {
          color: ${GOLD_LIGHT};
          font-weight: 700;
        }

        .menuItemDescription {
          color: #ddd;
          font-size: 12px;
          min-height: 32px;
          margin: 5px 0;
        }

        .menuItemPrice {
          color: #fff;
          font-weight: 700;
        }

        .utilityGrid {
          padding: 17px 36px 20px;
          display: grid;
          grid-template-columns: 1.45fr 0.85fr 0.85fr;
          gap: 10px;
          border-bottom: 1px solid ${GOLD};
        }

        .utilityCard {
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.7
            );
          border-radius: 7px;
          padding: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(
                8,
                20,
                21,
                0.98
              ),
              rgba(
                1,
                10,
                11,
                0.98
              )
            );
          min-width: 0;
        }

        .utilityTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${GOLD_LIGHT};
          font-size: 17px;
          font-weight: 700;
        }

        .utilitySub {
          font-size: 10px;
          opacity: 0.8;
          margin: 2px 0 12px 31px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .field {
          display: grid;
          gap: 4px;
          font-size: 11px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field input,
        .field select,
        .field textarea,
        .reviewForm input,
        .reviewForm textarea {
          width: 100%;
          border: 1px solid #1c566c;
          border-radius: 5px;
          background: #052535;
          color: #fff;
          padding: 9px 10px;
          outline: none;
        }

        .field textarea,
        .reviewForm textarea {
          min-height: 55px;
          resize: vertical;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus,
        .reviewForm input:focus,
        .reviewForm textarea:focus {
          border-color: ${GOLD_LIGHT};
        }

        .formButtons {
          display: flex;
          gap: 8px;
          margin-top: 9px;
        }

        .dangerButton,
        .blueButton,
        .smallButton {
          border-radius: 5px;
          padding: 9px 13px;
          background: transparent;
          color: #fff;
          border: 1px solid ${GOLD};
        }

        .dangerButton {
          border-color: red;
          color: #ff6d6d;
        }

        .blueButton {
          border-color: #00a6e8;
          color: #54c9ff;
        }

        .galleryPreview {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 5px;
          margin: 5px 0 10px;
        }

        .utilityStack {
          display: grid;
          gap: 10px;
        }

        .miniAction {
          min-height: 118px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .footer {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 0;
          border-bottom: 1px solid ${GOLD};
        }

        .footerCol {
          padding: 18px 35px;
          border-right: 1px solid
            rgba(
              217,
              164,
              65,
              0.75
            );
          min-height: 135px;
        }

        .footerCol:last-child {
          border-right: 0;
        }

        .footerTitle {
          color: ${GOLD_LIGHT};
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .footerLine {
          display: flex;
          gap: 8px;
          margin: 6px 0;
          font-size: 12px;
        }

        .footerLink:hover {
          color: ${GOLD_LIGHT};
        }

        .copyright {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 11px 40px;
          font-size: 11px;
        }

        .modalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(
            0,
            0,
            0,
            0.78
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .modal {
          width: min(
            1100px,
            100%
          );
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid ${GOLD};
          border-radius: 10px;
          background:
            radial-gradient(
              circle at top,
              rgba(
                217,
                164,
                65,
                0.1
              ),
              transparent 35%
            ),
            #031011;
          box-shadow:
            0 25px 80px
              rgba(
                0,
                0,
                0,
                0.8
              );
          padding: 20px;
        }

        .modalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid
            rgba(
              217,
              164,
              65,
              0.5
            );
          padding-bottom: 12px;
          margin-bottom: 15px;
        }

        .modalHeader h2 {
          margin: 0;
          color: ${GOLD_LIGHT};
        }

        .closeButton {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid ${GOLD};
          background: transparent;
          color: #fff;
        }

        .reviewLayout {
          display: grid;
          grid-template-columns: 0.85fr 1.5fr;
          gap: 12px;
        }

        .reviewForm,
        .reviewList {
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.7
            );
          border-radius: 7px;
          padding: 14px;
          background: #061315;
        }

        .reviewForm h3,
        .reviewList h3 {
          color: ${GOLD_LIGHT};
          margin: 0 0 10px;
        }

        .reviewForm {
          display: grid;
          gap: 8px;
        }

        .ratingButtons {
          display: flex;
          gap: 4px;
        }

        .starButton {
          border: 0;
          background: transparent;
          color: #444;
          font-size: 22px;
          padding: 0;
        }

        .starButton.active {
          color: ${GOLD_LIGHT};
        }

        .reviewItem {
          border-bottom: 1px solid
            rgba(
              217,
              164,
              65,
              0.2
            );
          padding: 10px 0;
        }

        .reviewItem:last-child {
          border-bottom: 0;
        }

        .reviewTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .reviewName {
          color: #fff;
          font-weight: 700;
        }

        .reviewDate {
          color: #999;
          font-size: 10px;
        }

        .reviewText {
          margin: 5px 0;
          color: #ddd;
          font-size: 12px;
          line-height: 1.5;
        }

        .reply {
          margin: 7px 0 0 20px;
          padding: 7px 10px;
          border-left: 2px solid ${GOLD};
          color: #cfcfcf;
          font-size: 11px;
        }

        .replyDate {
          color: #888;
          font-size: 9px;
          margin-top: 3px;
        }

        .galleryGrid {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 10px;
        }

        .galleryGrid img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.6
            );
        }

        .message {
          margin-top: 8px;
          color: ${GOLD_LIGHT};
          font-size: 11px;
        }

        @media (max-width: 1050px) {
          .header {
            padding: 0 15px;
          }

          .nav {
            gap: 13px;
          }

          .headerActions {
            min-width: auto;
          }

          .aboutSection {
            grid-template-columns: 1fr 1fr;
          }

          .reviewMini {
            grid-column: 1 / -1;
          }

          .categoryRow {
            grid-template-columns: repeat(
              4,
              1fr
            );
          }

          .utilityGrid {
            grid-template-columns: 1fr 1fr;
          }

          .footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .header {
            height: auto;
            min-height: 62px;
            padding: 9px 12px;
            flex-wrap: wrap;
          }

          .brand {
            min-width: auto;
          }

          .brandText {
            font-size: 20px;
          }

          .nav {
            display: none;
          }

          .headerActions {
            margin-left: auto;
          }

          .loginLink {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            min-height: 600px;
          }

          .heroCenter {
            padding: 120px 20px 30px;
          }

          .heroLeft {
            position: absolute;
            inset: 0;
            padding: 0;
          }

          .heroContact {
            position: absolute;
            bottom: 25px;
            left: 20px;
            margin: 0;
          }

          .heroRight {
            display: none;
          }

          .breaking {
            width: 205px;
          }

          .highlights {
            grid-template-columns: 1fr 1fr;
          }

          .highlight:nth-child(2) {
            border-right: 0;
          }

          .highlight:nth-child(-n + 2) {
            border-bottom: 1px solid ${GOLD};
          }

          .aboutSection {
            grid-template-columns: 1fr;
            padding: 20px;
          }

          .reviewMini {
            grid-column: auto;
          }

          .menuSection {
            padding: 15px;
          }

          .sectionHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .categoryRow {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .menuItems {
            grid-template-columns: 1fr 1fr;
          }

          .utilityGrid {
            grid-template-columns: 1fr;
            padding: 15px;
          }

          .footer {
            grid-template-columns: 1fr;
          }

          .footerCol {
            border-right: 0;
            border-bottom: 1px solid
              rgba(
                217,
                164,
                65,
                0.4
              );
          }

          .copyright {
            flex-direction: column;
            padding: 12px 20px;
          }

          .reviewLayout {
            grid-template-columns: 1fr;
          }

          .galleryGrid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <a
          href="#home"
          className="brand"
        >
          <span className="brandMark">
            ♛
          </span>

          <span className="brandText">
            NABABI
            <span className="brandSub">
              RISTORANTE
            </span>
          </span>
        </a>

        <nav className="nav">
          <a
            href="#home"
            className="navActive"
          >
            {t("home")}
          </a>

          <a href="#about">
            {t("about")}
          </a>

          <a href="#menu">
            {t("menu")}
          </a>

          <button
            onClick={() =>
              setGalleryOpen(
                true
              )
            }
            style={{
              background:
                "transparent",
              border: 0,
              color:
                "inherit",
            }}
          >
            {t("gallery")}
          </button>

          <button
            onClick={() =>
              setReviewsOpen(
                true
              )
            }
            style={{
              background:
                "transparent",
              border: 0,
              color:
                "inherit",
            }}
          >
            {t("reviews")}
          </button>

          <a href="#contact">
            {t("contact")}
          </a>
        </nav>

        <div className="headerActions">
          <select
            className="langButton"
            value={lang}
            onChange={(e) => {
              const next =
                e.target.value as Lang;

              setLang(next);

              localStorage.setItem(
                "nababi-language",
                next
              );
            }}
          >
            <option value="en">
              🇬🇧 EN
            </option>

            <option value="it">
              🇮🇹 IT
            </option>

            <option value="bn">
              🇧🇩 BN
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
            onClick={
              openAdmin
            }
          >
            ⚙ {t("admin")}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        className="hero"
        id="home"
      >
        <div className="heroOverlay" />

        <div className="heroLeft">
          {!newsClosed &&
            breakingNews.length >
              0 && (
              <div className="breaking">
                <div className="breakingHeader">
                  <span className="breakingTitle">
                    Breaking News
                  </span>

                  <button
                    className="breakingClose"
                    onClick={() =>
                      setNewsClosed(
                        true
                      )
                    }
                  >
                    ×
                  </button>
                </div>

                {breakingNews[0]
                  ?.image ? (
                  <img
                    src={
                      breakingNews[0]
                        .image
                    }
                    className="breakingImage"
                    alt="Breaking News"
                  />
                ) : (
                  <img
                    src={
                      heroImage
                    }
                    className="breakingImage"
                    alt="Breaking News"
                  />
                )}

                <div className="breakingText">
                  {breakingNews[0]
                    ?.text ||
                    "Special Discount on Biryani!"}
                </div>

                <div className="breakingTime">
                  ◷ Live Offer
                </div>
              </div>
            )}

          <div className="heroContact">
            <div>
              ☎ {phone}
            </div>

            <div>
              📍 {address}
            </div>
          </div>
        </div>

        <div className="heroCenter">
          <div className="heroCenterSmall">
            → {t("welcome")}
          </div>

          <h1 className="heroTitle">
            {restaurantName.toUpperCase()}
          </h1>

          <div className="heroSubtitle">
            {t("subtitle")}
          </div>

          <div className="heroLine" />

          <p className="heroDescription">
            {t("heroText")}
          </p>

          <a
            className="goldButton"
            href="#menu"
          >
            {t("explore")} →
          </a>
        </div>

        <div className="heroRight" />
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlights">
        <div className="highlight">
          <div className="roundIcon">
            🍃
          </div>

          <strong>
            {t("fresh")}
          </strong>

          <small>
            {t("freshSub")}
          </small>
        </div>

        <div className="highlight">
          <div className="roundIcon">
            👨‍🍳
          </div>

          <strong>
            {t("chefs")}
          </strong>

          <small>
            {t("chefsSub")}
          </small>
        </div>

        <div className="highlight">
          <div className="roundIcon">
            ⌂
          </div>

          <strong>
            {t("ambience")}
          </strong>

          <small>
            {t("ambienceSub")}
          </small>
        </div>

        <div className="highlight">
          <div className="roundIcon">
            ⏱
          </div>

          <strong>
            {t("service")}
          </strong>

          <small>
            {t("serviceSub")}
          </small>
        </div>
      </section>

      {/* ABOUT + VIDEO + SMALL REVIEW */}
      <section
        className="aboutSection"
        id="about"
      >
        <div className="videoCard">
          <img
            className="videoImage"
            src={aboutImage}
            alt="Nababi Restaurant"
          />

          <div className="videoPlay">
            ▶
          </div>

          <div className="videoLabel">
            {t("watchVideo")}
          </div>
        </div>

        <div className="aboutContent">
          <h4>
            {t("aboutUs")}
          </h4>

          <h2>
            {home?.welcomeTitle ||
              t("ourStory")}
          </h2>

          <p>
            {home?.welcomeText ||
              "At Nababi Ristorante, we bring the rich culinary traditions of India and Bangladesh to the heart of Rome. Our goal is to serve you the freshest, tastiest and most memorable food with a cozy atmosphere."}
          </p>

          <a
            className="goldButton"
            href="#about"
          >
            {t("learnMore")} →
          </a>
        </div>

        <div className="reviewMini">
          <div className="reviewMiniTitle">
            ★{" "}
            {t(
              "smallReviews"
            )}
          </div>

          <div className="stars">
            {totalReviews > 0
              ? "★★★★★"
              : "☆☆☆☆☆"}
          </div>

          <strong>
            {averageRating}/5
          </strong>

          <div className="reviewMiniText">
            {totalReviews >
            0
              ? `Based on ${totalReviews} reviews`
              : "Share your experience with us"}
          </div>

          <button
            className="goldButton"
            onClick={() =>
              setReviewsOpen(
                true
              )
            }
          >
            {t(
              "viewReviews"
            )}{" "}
            →
          </button>
        </div>
      </section>

      {/* MENU */}
      <section
        className="menuSection"
        id="menu"
      >
        <div className="sectionHeader">
          <div>
            <h2>
              {t("ourMenu")}
            </h2>

            <p>
              {t(
                "chooseCategory"
              )}
            </p>
          </div>

          <button
            className="goldButton"
            onClick={() => {
              document
                .getElementById(
                  "menuItems"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth",
                });
            }}
          >
            🍴{" "}
            {t(
              "fullMenu"
            )}{" "}
            →
          </button>
        </div>

        {/* CATEGORY CARDS */}
        <div className="categoryRow">
          {categories.map(
            (
              category
            ) => {
              /*
               * IMPORTANT:
               * This image comes from
               * category.image ONLY.
               *
               * Product image is NOT used
               * here anymore.
               */
              const categoryImage =
                category.image ||
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85";

              return (
                <button
                  key={
                    category.id ||
                    category.name
                  }
                  className={`categoryCard ${
                    selectedCategory.toLowerCase() ===
                    category.name.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(
                      category.name
                    );

                    setBookingForm(
                      (
                        prev
                      ) => ({
                        ...prev,
                        category:
                          category.name,
                        item: "",
                      })
                    );
                  }}
                >
                  <img
                    className="categoryImage"
                    src={
                      categoryImage
                    }
                    alt={
                      category.name
                    }
                  />

                  <div className="categoryName">
                    {
                      category.name
                    }{" "}
                    →
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* PRODUCTS */}
        <div
          className="menuItems"
          id="menuItems"
        >
          {displayItems.length >
          0 ? (
            displayItems.map(
              (
                item,
                index
              ) => (
                <div
                  className="menuItem"
                  key={
                    item.id ||
                    `${item.name}-${index}`
                  }
                >
                  {/* PRODUCT IMAGE IS COMPLETELY SEPARATE */}
                  {item.image ? (
                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name ||
                        "Food"
                      }
                    />
                  ) : (
                    <img
                      src={
                        heroImage
                      }
                      alt={
                        item.name ||
                        "Food"
                      }
                    />
                  )}

                  <div className="menuItemBody">
                    <div className="menuItemName">
                      {item.name ||
                        "Menu Item"}
                    </div>

                    <div className="menuItemDescription">
                      {item.description ||
                        ""}
                    </div>

                    <div className="menuItemPrice">
                      {item.price !==
                        undefined &&
                      item.price !==
                        ""
                        ? `${
                            settings?.currency ||
                            "€"
                          } ${
                            item.price
                          }`
                        : ""}
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div
              style={{
                gridColumn:
                  "1 / -1",
                padding:
                  "25px",
                textAlign:
                  "center",
                border: `1px solid ${GOLD}`,
                borderRadius:
                  "8px",
              }}
            >
              {selectedCategory}{" "}
              items will
              appear here
              after adding
              them from
              Admin Menu.
            </div>
          )}
        </div>
      </section>

      {/* BOOKING + DETAILS + GALLERY + REVIEWS */}
      <section
        className="utilityGrid"
        id="booking"
      >
        {/* BOOKING */}
        <div className="utilityCard">
          <div className="utilityTitle">
            <span>▣</span>
            {t(
              "tableBooking"
            )}
          </div>

          <div className="utilitySub">
            {t(
              "reserve"
            )}
          </div>

          <form
            onSubmit={
              saveReservation
            }
          >
            <div className="formGrid">
              <label className="field">
                {t(
                  "name"
                )}

                <input
                  value={
                    bookingForm.name
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        name:
                          e.target
                            .value,
                      }
                    )
                  }
                  placeholder="Your name"
                />
              </label>

              <label className="field">
                {t(
                  "phone"
                )}

                <input
                  value={
                    bookingForm.phone
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        phone:
                          e.target
                            .value,
                      }
                    )
                  }
                  placeholder="Enter phone number"
                />
              </label>

              <label className="field">
                {t(
                  "email"
                )}

                <input
                  type="email"
                  value={
                    bookingForm.email
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        email:
                          e.target
                            .value,
                      }
                    )
                  }
                  placeholder="Enter email address"
                />
              </label>

              <label className="field">
                {t(
                  "date"
                )}

                <input
                  type="date"
                  value={
                    bookingForm.date
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        date:
                          e.target
                            .value,
                      }
                    )
                  }
                />
              </label>

              <label className="field">
                {t(
                  "time"
                )}

                <input
                  type="time"
                  value={
                    bookingForm.time
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        time:
                          e.target
                            .value,
                      }
                    )
                  }
                />
              </label>

              <label className="field">
                {t(
                  "persons"
                )}

                <select
                  value={
                    bookingForm.persons
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        persons:
                          e.target
                            .value,
                      }
                    )
                  }
                >
                  {[
                    1, 2, 3, 4, 5,
                    6, 7, 8, 9, 10,
                  ].map(
                    (
                      number
                    ) => (
                      <option
                        key={
                          number
                        }
                        value={
                          number
                        }
                      >
                        {
                          number
                        }
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="field">
                {t(
                  "category"
                )}

                <select
                  value={
                    bookingForm.category
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        category:
                          e.target
                            .value,
                        item: "",
                      }
                    )
                  }
                >
                  {categories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category.id ||
                          category.name
                        }
                        value={
                          category.name
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="field">
                {t(
                  "item"
                )}

                <select
                  value={
                    bookingForm.item
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        item:
                          e.target
                            .value,
                      }
                    )
                  }
                >
                  <option value="">
                    Select item
                  </option>

                  {menuItems
                    .filter(
                      (
                        item
                      ) =>
                        String(
                          item.category ||
                            ""
                        ).toLowerCase() ===
                        bookingForm.category.toLowerCase()
                    )
                    .map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={
                            item.id ||
                            `${item.name}-${index}`
                          }
                          value={
                            item.name ||
                            ""
                          }
                        >
                          {
                            item.name
                          }
                        </option>
                      )
                    )}
                </select>
              </label>

              <label className="field full">
                {t(
                  "special"
                )}

                <textarea
                  value={
                    bookingForm.note
                  }
                  onChange={(
                    e
                  ) =>
                    setBookingForm(
                      {
                        ...bookingForm,
                        note:
                          e.target
                            .value,
                      }
                    )
                  }
                  placeholder="Write your request (Optional)"
                />
              </label>
            </div>

            <div className="formButtons">
              <button
                className="goldButton"
                type="submit"
              >
                {t(
                  "confirm"
                )}
              </button>

              <button
                className="dangerButton"
                type="button"
                onClick={() =>
                  setBookingForm(
                    {
                      name: "",
                      phone: "",
                      email: "",
                      date: "",
                      time: "",
                      persons:
                        "2",
                      category:
                        categories[0]
                          ?.name ||
                        "Biryani",
                      item: "",
                      note: "",
                    }
                  )
                }
              >
                {t(
                  "cancel"
                )}
              </button>
            </div>

            {bookingMessage && (
              <div className="message">
                {
                  bookingMessage
                }
              </div>
            )}
          </form>
        </div>

        {/* BOOKING DETAILS */}
        <div className="utilityCard miniAction">
          <div>
            <div className="utilityTitle">
              <span>▣</span>
              {t(
                "bookingDetails"
              )}
            </div>

            <div className="utilitySub">
              {t(
                "viewEditCancel"
              )}
            </div>
          </div>

          <div
            style={{
              fontSize:
                "11px",
              lineHeight: 1.6,
              opacity: 0.8,
              marginBottom:
                "10px",
            }}
          >
            Find your
            booking using
            your phone/email
            and booking code.
            You can view,
            edit or cancel
            your reservation.
          </div>

          <a
            href="/booking-details"
            className="goldButton"
          >
            {t(
              "bookingDetails"
            )}{" "}
            →
          </a>
        </div>

        {/* GALLERY + REVIEWS */}
        <div className="utilityStack">
          <div className="utilityCard miniAction">
            <div>
              <div className="utilityTitle">
                <span>▣</span>
                {t(
                  "galleryTitle"
                )}
              </div>

              <div className="utilitySub">
                {t(
                  "gallerySub"
                )}
              </div>
            </div>

            {gallery.length >
            0 ? (
              <img
                className="galleryPreview"
                src={
                  safeImage(
                    gallery[0]
                      .image
                  ) ||
                  heroImage
                }
                alt="Gallery"
              />
            ) : (
              <img
                className="galleryPreview"
                src={
                  heroImage
                }
                alt="Gallery"
              />
            )}

            <button
              className="goldButton"
              onClick={() =>
                setGalleryOpen(
                  true
                )
              }
            >
              {t(
                "viewGallery"
              )}{" "}
              →
            </button>
          </div>

          <div className="utilityCard miniAction">
            <div>
              <div className="utilityTitle">
                <span>★</span>
                {t(
                  "reviews"
                )}
              </div>

              <div className="utilitySub">
                {totalReviews >
                0
                  ? `${averageRating}/5 · ${totalReviews} reviews`
                  : "Share your experience with us"}
              </div>
            </div>

            <button
              className="goldButton"
              onClick={() =>
                setReviewsOpen(
                  true
                )
              }
            >
              {t(
                "viewReviews"
              )}{" "}
              →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="footer"
        id="contact"
      >
        <div className="footerCol">
          <div className="footerTitle">
            📍{" "}
            {t("map")}
          </div>

          <div className="footerLine">
            Google Maps
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="goldButton"
          >
            {t(
              "openMap"
            )}
          </a>
        </div>

        <div className="footerCol">
          <div className="footerTitle">
            ☎{" "}
            {t(
              "contactUs"
            )}
          </div>

          <div className="footerLine">
            ☎{" "}
            <a
              href={`tel:${phone}`}
              className="footerLink"
            >
              {phone}
            </a>
          </div>

          {whatsapp && (
            <div className="footerLine">
              🟢{" "}
              <a
                href={`https://wa.me/${whatsapp.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                WhatsApp
              </a>
            </div>
          )}

          <div className="footerLine">
            ✉{" "}
            <a
              href={`mailto:${email}`}
              className="footerLink"
            >
              {email}
            </a>
          </div>

          <div className="footerLine">
            📍 {address}
          </div>
        </div>

        <div className="footerCol">
          <div className="footerTitle">
            ◉{" "}
            {t(
              "socialMedia"
            )}
          </div>

          {facebook && (
            <div className="footerLine">
              🔵{" "}
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Facebook
              </a>
            </div>
          )}

          {instagram && (
            <div className="footerLine">
              🟣{" "}
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Instagram
              </a>
            </div>
          )}

          {tiktok && (
            <div className="footerLine">
              ⚫{" "}
              <a
                href={tiktok}
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                TikTok
              </a>
            </div>
          )}

          {youtube && (
            <div className="footerLine">
              🔴{" "}
              <a
                href={youtube}
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                YouTube
              </a>
            </div>
          )}

          {whatsapp && (
            <div className="footerLine">
              🟢{" "}
              <a
                href={`https://wa.me/${whatsapp.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                WhatsApp
              </a>
            </div>
          )}

          {!facebook &&
            !instagram &&
            !tiktok &&
            !youtube &&
            !whatsapp && (
              <div className="footerLine">
                Social media
                links can be
                added from
                Admin.
              </div>
            )}
        </div>

        <div className="footerCol">
          <div className="footerTitle">
            ⚡{" "}
            {t("quick")}
          </div>

          <div className="footerLine">
            <a
              href="#about"
              className="footerLink"
            >
              👥{" "}
              {t("about")}
            </a>
          </div>

          <div className="footerLine">
            <a
              href="#menu"
              className="footerLink"
            >
              ✉{" "}
              {t("menu")}
            </a>
          </div>

          <div className="footerLine">
            <button
              onClick={() =>
                setGalleryOpen(
                  true
                )
              }
              className="footerLink"
              style={{
                background:
                  "transparent",
                border: 0,
                padding: 0,
                color:
                  "inherit",
              }}
            >
              ▣{" "}
              {t(
                "gallery"
              )}
            </button>
          </div>

          <div className="footerLine">
            <button
              onClick={() =>
                setReviewsOpen(
                  true
                )
              }
              className="footerLink"
              style={{
                background:
                  "transparent",
                border: 0,
                padding: 0,
                color:
                  "inherit",
              }}
            >
              ★{" "}
              {t(
                "reviews"
              )}
            </button>
          </div>

          <div className="footerLine">
            <a
              href="/booking-details"
              className="footerLink"
            >
              ▣{" "}
              {t(
                "bookingDetails"
              )}
            </a>
          </div>

          <div className="footerLine">
            <a
              href="#contact"
              className="footerLink"
            >
              ☎{" "}
              {t(
                "contact"
              )}
            </a>
          </div>
        </div>
      </footer>

      <div className="copyright">
        <span>
          © 2025{" "}
          {restaurantName}.
          All rights
          reserved.
        </span>

        <span
          style={{
            color:
              GOLD_LIGHT,
          }}
        >
          ❧ Good Food&nbsp; • &nbsp;Good Mood ❧
        </span>
      </div>

      {/* REVIEWS MODAL */}
      {reviewsOpen && (
        <div
          className="modalBackdrop"
          onClick={() =>
            setReviewsOpen(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modalHeader">
              <div>
                <h2>
                  ★{" "}
                  {t(
                    "reviews"
                  )}
                </h2>

                <div
                  style={{
                    marginTop:
                      "4px",
                  }}
                >
                  <span className="stars">
                    {totalReviews >
                    0
                      ? "★★★★★"
                      : "☆☆☆☆☆"}
                  </span>{" "}
                  {averageRating}/5
                  {" · "}
                  {totalReviews}{" "}
                  reviews
                </div>
              </div>

              <button
                className="closeButton"
                onClick={() =>
                  setReviewsOpen(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="reviewLayout">
              <form
                className="reviewForm"
                onSubmit={
                  submitReview
                }
              >
                <h3>
                  {t(
                    "writeReview"
                  )}
                </h3>

                <input
                  placeholder={`${t(
                    "name"
                  )} *`}
                  value={
                    reviewForm.name
                  }
                  onChange={(
                    e
                  ) =>
                    setReviewForm(
                      {
                        ...reviewForm,
                        name:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder={`${t(
                    "phone"
                  )} (Phone or Email — one required)`}
                  value={
                    reviewForm.phone
                  }
                  onChange={(
                    e
                  ) =>
                    setReviewForm(
                      {
                        ...reviewForm,
                        phone:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  type="email"
                  placeholder={`${t(
                    "email"
                  )} (Phone or Email — one required)`}
                  value={
                    reviewForm.email
                  }
                  onChange={(
                    e
                  ) =>
                    setReviewForm(
                      {
                        ...reviewForm,
                        email:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <div>
                  <div
                    style={{
                      fontSize:
                        "11px",
                      marginBottom:
                        "4px",
                    }}
                  >
                    {t(
                      "rating"
                    )}{" "}
                    ⭐
                  </div>

                  <div className="ratingButtons">
                    {[
                      1,
                      2,
                      3,
                      4,
                      5,
                    ].map(
                      (
                        star
                      ) => (
                        <button
                          key={
                            star
                          }
                          type="button"
                          className={`starButton ${
                            reviewForm.rating >=
                            star
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setReviewForm(
                              {
                                ...reviewForm,
                                rating:
                                  star,
                              }
                            )
                          }
                        >
                          ★
                        </button>
                      )
                    )}
                  </div>
                </div>

                <textarea
                  placeholder={`${t(
                    "reviewDetails"
                  )} *`}
                  value={
                    reviewForm.review
                  }
                  onChange={(
                    e
                  ) =>
                    setReviewForm(
                      {
                        ...reviewForm,
                        review:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <button
                  className="goldButton"
                  type="submit"
                >
                  {t(
                    "submitReview"
                  )}
                </button>

                {reviewMessage && (
                  <div className="message">
                    {
                      reviewMessage
                    }
                  </div>
                )}

                <div
                  style={{
                    fontSize:
                      "9px",
                    color:
                      "#888",
                    lineHeight:
                      1.4,
                    marginTop:
                      "2px",
                  }}
                >
                  Your phone
                  number and
                  email are used
                  only for
                  customer
                  identification
                  and will never
                  be shown
                  publicly.
                </div>
              </form>

              <div className="reviewList">
                <h3>
                  {t(
                    "allReviews"
                  )}
                </h3>

                {reviews.length >
                0 ? (
                  reviews.map(
                    (
                      review
                    ) => (
                      <div
                        className="reviewItem"
                        key={
                          review.id
                        }
                      >
                        <div className="reviewTop">
                          <div className="reviewName">
                            👤{" "}
                            {
                              review.customerName
                            }
                          </div>

                          <div className="reviewDate">
                            {new Date(
                              review.date
                            ).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="stars">
                          {"★".repeat(
                            Math.max(
                              0,
                              Math.min(
                                5,
                                Number(
                                  review.rating
                                )
                              )
                            )
                          )}

                          <span
                            style={{
                              color:
                                "#555",
                            }}
                          >
                            {"★".repeat(
                              Math.max(
                                0,
                                5 -
                                  Math.min(
                                    5,
                                    Number(
                                      review.rating
                                    )
                                  )
                              )
                            )}
                          </span>
                        </div>

                        <div className="reviewText">
                          {
                            review.review
                          }
                        </div>

                        {review.replies
                          ?.slice()
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
                                className="reply"
                                key={
                                  reply.id
                                }
                              >
                                <strong>
                                  Restaurant:
                                </strong>{" "}
                                {
                                  reply.text
                                }

                                <div className="replyDate">
                                  {new Date(
                                    reply.date
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    )
                  )
                ) : (
                  <div
                    style={{
                      padding:
                        "25px 5px",
                      textAlign:
                        "center",
                      opacity:
                        0.7,
                    }}
                  >
                    {t(
                      "noReviews"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {galleryOpen && (
        <div
          className="modalBackdrop"
          onClick={() =>
            setGalleryOpen(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modalHeader">
              <h2>
                ▣{" "}
                {t(
                  "galleryTitle"
                )}
              </h2>

              <button
                className="closeButton"
                onClick={() =>
                  setGalleryOpen(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            {gallery.length >
            0 ? (
              <div className="galleryGrid">
                {gallery.map(
                  (
                    item,
                    index
                  ) => (
                    <img
                      key={
                        item.id ||
                        index
                      }
                      src={
                        item.image ||
                        heroImage
                      }
                      alt={
                        item.category ||
                        "Gallery"
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "50px 20px",
                  opacity:
                    0.75,
                }}
              >
                {t(
                  "noGallery"
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
