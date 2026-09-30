"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "it" | "en" | "bn";

type Settings = {
  restaurantName: string;
  adminEmail: string;
  currency: string;
  timeZone: string;
  dateFormat: string;
  maintenanceMode: boolean;
  adminNotifications: boolean;
};

type LanguageSettings = {
  italian: boolean;
  english: boolean;
  bengali: boolean;
  defaultLanguage: "Italian" | "English" | "Bengali";
  languageSwitcherVisible: boolean;
};

type HomeSettings = {
  heroTitle: string;
  heroSubtitle: string;
  welcomeText: string;
  heroImage: string;
  bookingTitle: string;
  bookingText: string;
  heroVisible: boolean;
  welcomeVisible: boolean;
  bookingVisible: boolean;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
};

type GalleryItem = {
  id: number;
  image: string;
  category: string;
  visible: boolean;
  order: number;
};

type BreakingNews = {
  id: number;
  text: string;
  visible: boolean;
  startDate: string;
  endDate: string;
};

type Review = {
  id: number;
  customerName: string;
  rating: number;
  review: string;
  image: string;
  date: string;
  visible: boolean;
};

type ContactSettings = {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  googleMapsUrl: string;
  contactTitle: string;
  contactText: string;
  visible: boolean;
  contactFormVisible: boolean;
};

type DaySchedule = {
  day: string;
  open: boolean;
  openingTime: string;
  closingTime: string;
  breakEnabled: boolean;
  breakStart: string;
  breakEnd: string;
};

type OpeningHoursSettings = {
  visible: boolean;
  title: string;
  days: DaySchedule[];
};

type SocialMediaSettings = {
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
  visible: boolean;
};

type AboutData = {
  content: string;
  image: string;
  visible: boolean;
};

type Reservation = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  contactMethod?: "phone" | "email";
  date: string;
  time: string;
  guests: number;
  menu: string;
  note: string;
  status:
    | "Pending"
    | "Confirmed"
    | "Cancelled"
    | "Completed";
  createdAt: string;
};

const STORAGE = {
  settings: "nababi-settings",
  languages: "nababi-languages",
  home: "nababi-home-settings",
  menu: "nababi-menu",
  categories: "nababi-categories",
  menuBackground: "nababi-menu-background",
  gallery: "nababi-gallery",
  breakingNews: "nababi-breaking-news",
  reviews: "nababi-reviews",
  contact: "nababi-contact",
  openingHours: "nababi-opening-hours",
  social: "nababi-social-media",
  about: "nababi-about",
  reservations: "nababi-reservations",
  promotions: "nababi-promotions",
};

const defaultSettings: Settings = {
  restaurantName: "Nababi Ristorante",
  adminEmail: "",
  currency: "EUR (€)",
  timeZone: "Europe/Rome",
  dateFormat: "DD/MM/YYYY",
  maintenanceMode: false,
  adminNotifications: true,
};

const defaultLanguages: LanguageSettings = {
  italian: true,
  english: true,
  bengali: true,
  defaultLanguage: "Italian",
  languageSwitcherVisible: true,
};

const defaultHome: HomeSettings = {
  heroTitle: "Welcome to Nababi Ristorante",
  heroSubtitle: "Authentic Italian Dining Experience in Rome",
  welcomeText:
    "Experience delicious food, warm hospitality and an unforgettable dining experience at Nababi Ristorante.",
  heroImage: "",
  bookingTitle: "Reserve Your Table",
  bookingText:
    "Book your table and enjoy a memorable dining experience with us.",
  heroVisible: true,
  welcomeVisible: true,
  bookingVisible: true,
};

const defaultContact: ContactSettings = {
  restaurantName: "Nababi Ristorante",
  address: "Via Vespasiano 73/75/77, Roma",
  phone: "+39 393 3805350",
  email: "",
  whatsapp: "+39 333 7687319",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77%2C+Roma",
  contactTitle: "Contact Us",
  contactText:
    "Get in touch with Nababi Ristorante for reservations, questions and more information.",
  visible: true,
  contactFormVisible: true,
};

const defaultSocial: SocialMediaSettings = {
  facebook:
    "https://www.facebook.com/share/1HEDPavdg6/?mibextid=wwXIfr",
  instagram: "",
  tiktok:
    "https://www.tiktok.com/@nababiristorante?_r=1&_t=ZN-9A75cGh3gec",
  youtube: "",
  whatsapp: "+39 333 7687319",
  visible: true,
};

const defaultAbout: AboutData = {
  content:
    "Welcome to Nababi Ristorante. Enjoy delicious food, warm hospitality and a memorable dining experience in the heart of Rome.",
  image: "",
  visible: true,
};

const defaultOpeningHours: OpeningHoursSettings = {
  visible: true,
  title: "Opening Hours",
  days: [
    {
      day: "Monday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:00",
      breakEnabled: true,
      breakStart: "16:00",
      breakEnd: "18:00",
    },
    {
      day: "Tuesday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:00",
      breakEnabled: true,
      breakStart: "16:00",
      breakEnd: "18:00",
    },
    {
      day: "Wednesday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:00",
      breakEnabled: true,
      breakStart: "16:00",
      breakEnd: "18:00",
    },
    {
      day: "Thursday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:00",
      breakEnabled: true,
      breakStart: "16:00",
      breakEnd: "18:00",
    },
    {
      day: "Friday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:30",
      breakEnabled: true,
      breakStart: "16:00",
      breakEnd: "18:00",
    },
    {
      day: "Saturday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:30",
      breakEnabled: false,
      breakStart: "",
      breakEnd: "",
    },
    {
      day: "Sunday",
      open: true,
      openingTime: "12:00",
      closingTime: "23:00",
      breakEnabled: false,
      breakStart: "",
      breakEnd: "",
    },
  ],
};

const defaultTranslations = {
  it: {
    home: "Home",
    about: "Chi Siamo",
    menu: "Menu",
    gallery: "Galleria",
    booking: "Prenota",
    reviews: "Recensioni",
    contact: "Contatti",
    reserve: "Prenota il Tavolo",
    discover: "Scopri il Menu",
    welcome: "Benvenuti da Nababi Ristorante",
    ourMenu: "Il Nostro Menu",
    ourGallery: "La Nostra Galleria",
    aboutTitle: "La Nostra Storia",
    bookingTitle: "Prenota il Tuo Tavolo",
    reviewsTitle: "Cosa Dicono i Nostri Ospiti",
    contactTitle: "Contattaci",
    openingHours: "Orari di Apertura",
    name: "Nome",
    phone: "Telefono",
    email: "Email",
    date: "Data",
    time: "Ora",
    guests: "Ospiti",
    menuChoice: "Menu",
    note: "Note",
    submit: "Invia Richiesta",
    manage: "Gestisci la Mia Prenotazione",
    pending: "In attesa",
    confirmed: "Confermata",
    cancelled: "Cancellata",
    closed: "Chiuso",
    available: "Disponibile",
    noItems: "Nessun piatto disponibile.",
    viewMenu: "Vedi Menu",
    call: "Chiama",
    whatsapp: "WhatsApp",
    directions: "Indicazioni",
    follow: "Seguici",
    all: "Tutti",
    bookingReceived: "Richiesta di prenotazione ricevuta.",
  },
  en: {
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    booking: "Booking",
    reviews: "Reviews",
    contact: "Contact",
    reserve: "Reserve a Table",
    discover: "Discover Menu",
    welcome: "Welcome to Nababi Ristorante",
    ourMenu: "Our Menu",
    ourGallery: "Our Gallery",
    aboutTitle: "Our Story",
    bookingTitle: "Reserve Your Table",
    reviewsTitle: "What Our Guests Say",
    contactTitle: "Contact Us",
    openingHours: "Opening Hours",
    name: "Name",
    phone: "Phone",
    email: "Email",
    date: "Date",
    time: "Time",
    guests: "Guests",
    menuChoice: "Menu",
    note: "Note",
    submit: "Send Request",
    manage: "Manage My Booking",
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    closed: "Closed",
    available: "Available",
    noItems: "No dishes available.",
    viewMenu: "View Menu",
    call: "Call",
    whatsapp: "WhatsApp",
    directions: "Directions",
    follow: "Follow Us",
    all: "All",
    bookingReceived: "Booking request received.",
  },
  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    booking: "বুকিং",
    reviews: "রিভিউ",
    contact: "যোগাযোগ",
    reserve: "টেবিল বুক করুন",
    discover: "মেনু দেখুন",
    welcome: "Nababi Ristorante-এ স্বাগতম",
    ourMenu: "আমাদের মেনু",
    ourGallery: "আমাদের গ্যালারি",
    aboutTitle: "আমাদের গল্প",
    bookingTitle: "আপনার টেবিল বুক করুন",
    reviewsTitle: "আমাদের অতিথিদের মতামত",
    contactTitle: "যোগাযোগ করুন",
    openingHours: "খোলার সময়",
    name: "নাম",
    phone: "ফোন",
    email: "ইমেইল",
    date: "তারিখ",
    time: "সময়",
    guests: "অতিথি",
    menuChoice: "মেনু",
    note: "নোট",
    submit: "বুকিং পাঠান",
    manage: "আমার বুকিং ম্যানেজ করুন",
    pending: "অপেক্ষমাণ",
    confirmed: "নিশ্চিত",
    cancelled: "বাতিল",
    closed: "বন্ধ",
    available: "খোলা",
    noItems: "কোনো খাবার পাওয়া যায়নি।",
    viewMenu: "মেনু দেখুন",
    call: "কল করুন",
    whatsapp: "WhatsApp",
    directions: "দিকনির্দেশ",
    follow: "আমাদের অনুসরণ করুন",
    all: "সব",
    bookingReceived: "বুকিং রিকোয়েস্ট গ্রহণ করা হয়েছে।",
  },
};

function readStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(key);

    if (!stored) return fallback;

    const parsed = JSON.parse(stored);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      fallback &&
      typeof fallback === "object" &&
      !Array.isArray(fallback)
    ) {
      return {
        ...(fallback as object),
        ...(parsed as object),
      } as T;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeStorage(
  key: string,
  value: unknown
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

function parseCurrency(currency: string) {
  if (currency.includes("USD")) return "$";
  if (currency.includes("GBP")) return "£";
  if (currency.includes("CHF")) return "Fr";
  return "€";
}

function formatPrice(
  price: string,
  currency: string
) {
  if (!price) return "";

  const symbol = parseCurrency(currency);

  if (
    price.includes("€") ||
    price.includes("$") ||
    price.includes("£") ||
    price.includes("Fr")
  ) {
    return price;
  }

  return `${price} ${symbol}`;
}

function dateIsInsideNews(
  item: BreakingNews
) {
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
}

function getDayIndex(
  dateString: string
) {
  const date = new Date(
    `${dateString}T12:00:00`
  );

  return date.getDay();
}

function getScheduleForDate(
  dateString: string,
  openingHours: OpeningHoursSettings
) {
  const index = getDayIndex(dateString);

  const dayMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = dayMap[index];

  return openingHours.days.find(
    (day) =>
      day.day.toLowerCase() ===
      dayName.toLowerCase()
  );
}

function timeToMinutes(
  value: string
) {
  const parts = value.split(":");

  if (parts.length !== 2) return 0;

  return (
    Number(parts[0]) * 60 +
    Number(parts[1])
  );
}

function isTimeAvailable(
  dateString: string,
  timeString: string,
  openingHours: OpeningHoursSettings
) {
  const schedule = getScheduleForDate(
    dateString,
    openingHours
  );

  if (!schedule || !schedule.open) {
    return false;
  }

  const time = timeToMinutes(timeString);
  const open = timeToMinutes(
    schedule.openingTime
  );
  const close = timeToMinutes(
    schedule.closingTime
  );

  if (time < open || time > close) {
    return false;
  }

  if (
    schedule.breakEnabled &&
    schedule.breakStart &&
    schedule.breakEnd
  ) {
    const breakStart = timeToMinutes(
      schedule.breakStart
    );

    const breakEnd = timeToMinutes(
      schedule.breakEnd
    );

    if (
      time >= breakStart &&
      time < breakEnd
    ) {
      return false;
    }
  }

  return true;
}

export default function PublicWebsite() {
  const [mounted, setMounted] = useState(false);

  const [language, setLanguage] =
    useState<Language>("it");

  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [languages, setLanguages] =
    useState<LanguageSettings>(
      defaultLanguages
    );

  const [home, setHome] =
    useState<HomeSettings>(defaultHome);

  const [menu, setMenu] =
    useState<MenuItem[]>([]);

  const [categories, setCategories] =
    useState<string[]>([]);

  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [breakingNews, setBreakingNews] =
    useState<BreakingNews[]>([]);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [contact, setContact] =
    useState<ContactSettings>(
      defaultContact
    );

  const [openingHours, setOpeningHours] =
    useState<OpeningHoursSettings>(
      defaultOpeningHours
    );

  const [social, setSocial] =
    useState<SocialMediaSettings>(
      defaultSocial
    );

  const [about, setAbout] =
    useState<AboutData>(defaultAbout);

  const [menuBackground, setMenuBackground] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [bookingMessage, setBookingMessage] =
    useState("");

  const [bookingForm, setBookingForm] =
    useState({
      name: "",
      phone: "",
      email: "",
      contactMethod: "phone" as
        | "phone"
        | "email",
      date: "",
      time: "",
      guests: "2",
      menu: "",
      note: "",
    });

  const [manageOpen, setManageOpen] =
    useState(false);

  const [manageContact, setManageContact] =
    useState("");

  const [manageBookings, setManageBookings] =
    useState<Reservation[]>([]);

  const [manageMessage, setManageMessage] =
    useState("");

  const [editingBookingId, setEditingBookingId] =
    useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const t = defaultTranslations[language];

  useEffect(() => {
    setMounted(true);

    const savedSettings =
      readStorage<Settings>(
        STORAGE.settings,
        defaultSettings
      );

    const savedLanguages =
      readStorage<LanguageSettings>(
        STORAGE.languages,
        defaultLanguages
      );

    const savedHome =
      readStorage<HomeSettings>(
        STORAGE.home,
        defaultHome
      );

    const savedMenu =
      readStorage<MenuItem[]>(
        STORAGE.menu,
        []
      );

    const savedCategories =
      readStorage<string[]>(
        STORAGE.categories,
        []
      );

    const savedGallery =
      readStorage<GalleryItem[]>(
        STORAGE.gallery,
        []
      );

    const savedNews =
      readStorage<BreakingNews[]>(
        STORAGE.breakingNews,
        []
      );

    const savedReviews =
      readStorage<Review[]>(
        STORAGE.reviews,
        []
      );

    const savedContact =
      readStorage<ContactSettings>(
        STORAGE.contact,
        defaultContact
      );

    const savedOpeningHours =
      readStorage<OpeningHoursSettings>(
        STORAGE.openingHours,
        defaultOpeningHours
      );

    const savedSocial =
      readStorage<SocialMediaSettings>(
        STORAGE.social,
        defaultSocial
      );

    const savedAbout =
      readStorage<AboutData>(
        STORAGE.about,
        defaultAbout
      );

    const savedMenuBackground =
      localStorage.getItem(
        STORAGE.menuBackground
      ) || "";

    setSettings(savedSettings);
    setLanguages(savedLanguages);
    setHome(savedHome);
    setMenu(
      Array.isArray(savedMenu)
        ? savedMenu
        : []
    );
    setCategories(
      Array.isArray(savedCategories)
        ? savedCategories
        : []
    );
    setGallery(
      Array.isArray(savedGallery)
        ? savedGallery
        : []
    );
    setBreakingNews(
      Array.isArray(savedNews)
        ? savedNews
        : []
    );
    setReviews(
      Array.isArray(savedReviews)
        ? savedReviews
        : []
    );
    setContact(savedContact);
    setOpeningHours(savedOpeningHours);
    setSocial(savedSocial);
    setAbout(savedAbout);
    setMenuBackground(
      savedMenuBackground
    );

    let initialLanguage: Language = "it";

    if (
      savedLanguages.defaultLanguage ===
      "English"
    ) {
      initialLanguage = "en";
    }

    if (
      savedLanguages.defaultLanguage ===
      "Bengali"
    ) {
      initialLanguage = "bn";
    }

    if (
      initialLanguage === "it" &&
      !savedLanguages.italian
    ) {
      if (savedLanguages.english) {
        initialLanguage = "en";
      } else if (savedLanguages.bengali) {
        initialLanguage = "bn";
      }
    }

    if (
      initialLanguage === "en" &&
      !savedLanguages.english
    ) {
      if (savedLanguages.italian) {
        initialLanguage = "it";
      } else if (savedLanguages.bengali) {
        initialLanguage = "bn";
      }
    }

    if (
      initialLanguage === "bn" &&
      !savedLanguages.bengali
    ) {
      if (savedLanguages.italian) {
        initialLanguage = "it";
      } else if (savedLanguages.english) {
        initialLanguage = "en";
      }
    }

    setLanguage(initialLanguage);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleStorage = () => {
      setSettings(
        readStorage<Settings>(
          STORAGE.settings,
          defaultSettings
        )
      );

      setLanguages(
        readStorage<LanguageSettings>(
          STORAGE.languages,
          defaultLanguages
        )
      );

      setHome(
        readStorage<HomeSettings>(
          STORAGE.home,
          defaultHome
        )
      );

      setMenu(
        readStorage<MenuItem[]>(
          STORAGE.menu,
          []
        )
      );

      setCategories(
        readStorage<string[]>(
          STORAGE.categories,
          []
        )
      );

      setGallery(
        readStorage<GalleryItem[]>(
          STORAGE.gallery,
          []
        )
      );

      setBreakingNews(
        readStorage<BreakingNews[]>(
          STORAGE.breakingNews,
          []
        )
      );

      setReviews(
        readStorage<Review[]>(
          STORAGE.reviews,
          []
        )
      );

      setContact(
        readStorage<ContactSettings>(
          STORAGE.contact,
          defaultContact
        )
      );

      setOpeningHours(
        readStorage<OpeningHoursSettings>(
          STORAGE.openingHours,
          defaultOpeningHours
        )
      );

      setSocial(
        readStorage<SocialMediaSettings>(
          STORAGE.social,
          defaultSocial
        )
      );

      setAbout(
        readStorage<AboutData>(
          STORAGE.about,
          defaultAbout
        )
      );

      setMenuBackground(
        localStorage.getItem(
          STORAGE.menuBackground
        ) || ""
      );
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    const interval = window.setInterval(
      handleStorage,
      1500
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.clearInterval(interval);
    };
  }, [mounted]);

  const activeNews = useMemo(() => {
    return breakingNews.filter(
      (item) =>
        item.visible &&
        dateIsInsideNews(item)
    );
  }, [breakingNews]);

  const visibleMenu = useMemo(() => {
    return menu.filter(
      (item) => item.available !== false
    );
  }, [menu]);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === "All") {
      return visibleMenu;
    }

    return visibleMenu.filter(
      (item) =>
        item.category === selectedCategory
    );
  }, [
    visibleMenu,
    selectedCategory,
  ]);

  const visibleGallery = useMemo(() => {
    return [...gallery]
      .filter((item) => item.visible)
      .sort(
        (a, b) => a.order - b.order
      );
  }, [gallery]);

  const visibleReviews = useMemo(() => {
    return reviews.filter(
      (item) => item.visible
    );
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (!visibleReviews.length) return 0;

    return (
      visibleReviews.reduce(
        (sum, review) =>
          sum + Number(review.rating || 0),
        0
      ) / visibleReviews.length
    );
  }, [visibleReviews]);

  const menuCategoryList = useMemo(() => {
    const fromAdmin = categories.filter(
      Boolean
    );

    if (fromAdmin.length) {
      return fromAdmin;
    }

    return Array.from(
      new Set(
        visibleMenu
          .map((item) => item.category)
          .filter(Boolean)
      )
    );
  }, [categories, visibleMenu]);

  const languageOptions = [
    languages.italian
      ? {
          key: "it" as Language,
          label: "Italiano",
          flag: "🇮🇹",
        }
      : null,
    languages.english
      ? {
          key: "en" as Language,
          label: "English",
          flag: "🇬🇧",
        }
      : null,
    languages.bengali
      ? {
          key: "bn" as Language,
          label: "বাংলা",
          flag: "🇧🇩",
        }
      : null,
  ].filter(Boolean) as {
    key: Language;
    label: string;
    flag: string;
  }[];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleBookingSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setBookingMessage("");

    const {
      name,
      phone,
      email,
      contactMethod,
      date,
      time,
      guests,
      menu: selectedMenu,
      note,
    } = bookingForm;

    if (!name.trim()) {
      setBookingMessage(
        language === "bn"
          ? "নাম দিন।"
          : language === "en"
          ? "Please enter your name."
          : "Inserisci il tuo nome."
      );
      return;
    }

    if (
      contactMethod === "phone" &&
      !phone.trim()
    ) {
      setBookingMessage(
        language === "bn"
          ? "ফোন নম্বর দিন।"
          : language === "en"
          ? "Please enter your phone number."
          : "Inserisci il numero di telefono."
      );
      return;
    }

    if (
      contactMethod === "email" &&
      !email.trim()
    ) {
      setBookingMessage(
        language === "bn"
          ? "ইমেইল দিন।"
          : language === "en"
          ? "Please enter your email."
          : "Inserisci la tua email."
      );
      return;
    }

    if (!date || !time) {
      setBookingMessage(
        language === "bn"
          ? "তারিখ ও সময় নির্বাচন করুন।"
          : language === "en"
          ? "Please select a date and time."
          : "Seleziona data e ora."
      );
      return;
    }

    if (
      !isTimeAvailable(
        date,
        time,
        openingHours
      )
    ) {
      setBookingMessage(
        language === "bn"
          ? "এই তারিখ বা সময়ে রেস্টুরেন্ট বন্ধ।"
          : language === "en"
          ? "The restaurant is closed at the selected date or time."
          : "Il ristorante è chiuso nella data o nell'orario selezionato."
      );
      return;
    }

    const currentReservations =
      readStorage<Reservation[]>(
        STORAGE.reservations,
        []
      );

    const newReservation: Reservation = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: name.trim(),
      phone:
        phone.trim() || undefined,
      email:
        email.trim() || undefined,
      contactMethod,
      date,
      time,
      guests: Number(guests) || 2,
      menu: selectedMenu,
      note: note.trim(),
      status: "Pending",
      createdAt:
        new Date().toISOString(),
    };

    writeStorage(
      STORAGE.reservations,
      [
        ...currentReservations,
        newReservation,
      ]
    );

    setBookingForm({
      name: "",
      phone: "",
      email: "",
      contactMethod: "phone",
      date: "",
      time: "",
      guests: "2",
      menu: "",
      note: "",
    });

    setBookingMessage(
      language === "bn"
        ? "আপনার বুকিং রিকোয়েস্ট গ্রহণ করা হয়েছে। Admin confirmation-এর জন্য অপেক্ষা করুন।"
        : language === "en"
        ? "Your booking request has been received. Please wait for admin confirmation."
        : "La tua richiesta di prenotazione è stata ricevuta. Attendi la conferma dell'amministrazione."
    );

    window.setTimeout(() => {
      setBookingMessage("");
    }, 7000);
  };

  const handleFindBookings = () => {
    const value = manageContact.trim();

    setManageMessage("");
    setManageBookings([]);

    if (!value) {
      setManageMessage(
        language === "bn"
          ? "ফোন অথবা ইমেইল দিন।"
          : language === "en"
          ? "Enter your phone or email."
          : "Inserisci telefono o email."
      );
      return;
    }

    const reservations =
      readStorage<Reservation[]>(
        STORAGE.reservations,
        []
      );

    const normalized = value
      .toLowerCase()
      .replace(/\s+/g, "");

    const matches = reservations.filter(
      (reservation) => {
        const phone = (
          reservation.phone || ""
        )
          .toLowerCase()
          .replace(/\s+/g, "");

        const email = (
          reservation.email || ""
        )
          .toLowerCase()
          .replace(/\s+/g, "");

        return (
          phone === normalized ||
          email === normalized
        );
      }
    );

    if (!matches.length) {
      setManageMessage(
        language === "bn"
          ? "কোনো matching booking পাওয়া যায়নি।"
          : language === "en"
          ? "No matching booking was found."
          : "Nessuna prenotazione trovata."
      );
      return;
    }

    /*
     * IMPORTANT:
     * This browser-only version reads the shared localStorage
     * used by the Admin Panel.
     *
     * Production OTP verification must be connected to a
     * server-side SMS/Email provider before this lookup is
     * exposed publicly.
     */
    setManageBookings(matches);
  };

  const cancelBooking = (
    bookingId: string
  ) => {
    const reservations =
      readStorage<Reservation[]>(
        STORAGE.reservations,
        []
      );

    const updated = reservations.map(
      (reservation) =>
        reservation.id === bookingId
          ? {
              ...reservation,
              status: "Cancelled" as const,
            }
          : reservation
    );

    writeStorage(
      STORAGE.reservations,
      updated
    );

    setManageBookings((current) =>
      current.map((reservation) =>
        reservation.id === bookingId
          ? {
              ...reservation,
              status: "Cancelled",
            }
          : reservation
      )
    );

    setManageMessage(
      language === "bn"
        ? "বুকিং বাতিল করা হয়েছে।"
        : language === "en"
        ? "Booking cancelled."
        : "Prenotazione cancellata."
    );
  };

  const startEditBooking = (
    reservation: Reservation
  ) => {
    setEditingBookingId(
      reservation.id
    );

    setBookingForm({
      name: reservation.name,
      phone: reservation.phone || "",
      email: reservation.email || "",
      contactMethod:
        reservation.contactMethod ||
        (reservation.phone
          ? "phone"
          : "email"),
      date: reservation.date,
      time: reservation.time,
      guests: String(
        reservation.guests
      ),
      menu: reservation.menu,
      note: reservation.note,
    });

    setManageOpen(false);

    setTimeout(() => {
      scrollTo("booking");
    }, 100);
  };

  const updateExistingBooking = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingBookingId) {
      handleBookingSubmit(event);
      return;
    }

    if (
      !bookingForm.name.trim() ||
      !bookingForm.date ||
      !bookingForm.time
    ) {
      setBookingMessage(
        language === "bn"
          ? "নাম, তারিখ এবং সময় প্রয়োজন।"
          : language === "en"
          ? "Name, date and time are required."
          : "Nome, data e ora sono obbligatori."
      );
      return;
    }

    if (
      bookingForm.contactMethod ===
        "phone" &&
      !bookingForm.phone.trim()
    ) {
      setBookingMessage(
        language === "bn"
          ? "ফোন নম্বর দিন।"
          : language === "en"
          ? "Please enter your phone number."
          : "Inserisci il numero di telefono."
      );
      return;
    }

    if (
      bookingForm.contactMethod ===
        "email" &&
      !bookingForm.email.trim()
    ) {
      setBookingMessage(
        language === "bn"
          ? "ইমেইল দিন।"
          : language === "en"
          ? "Please enter your email."
          : "Inserisci la tua email."
      );
      return;
    }

    if (
      !isTimeAvailable(
        bookingForm.date,
        bookingForm.time,
        openingHours
      )
    ) {
      setBookingMessage(
        language === "bn"
          ? "এই তারিখ বা সময়ে রেস্টুরেন্ট বন্ধ।"
          : language === "en"
          ? "The restaurant is closed at the selected date or time."
          : "Il ristorante è chiuso nella data o nell'orario selezionato."
      );
      return;
    }

    const reservations =
      readStorage<Reservation[]>(
        STORAGE.reservations,
        []
      );

    const updated =
      reservations.map((reservation) =>
        reservation.id ===
        editingBookingId
          ? {
              ...reservation,
              name: bookingForm.name.trim(),
              phone:
                bookingForm.phone.trim() ||
                undefined,
              email:
                bookingForm.email.trim() ||
                undefined,
              contactMethod:
                bookingForm.contactMethod,
              date: bookingForm.date,
              time: bookingForm.time,
              guests:
                Number(
                  bookingForm.guests
                ) || 2,
              menu: bookingForm.menu,
              note: bookingForm.note.trim(),
            }
          : reservation
      );

    writeStorage(
      STORAGE.reservations,
      updated
    );

    setEditingBookingId(null);

    setBookingForm({
      name: "",
      phone: "",
      email: "",
      contactMethod: "phone",
      date: "",
      time: "",
      guests: "2",
      menu: "",
      note: "",
    });

    setBookingMessage(
      language === "bn"
        ? "আপনার booking update হয়েছে।"
        : language === "en"
        ? "Your booking has been updated."
        : "La tua prenotazione è stata aggiornata."
    );

    window.setTimeout(() => {
      setBookingMessage("");
    }, 6000);
  };

  const maintenanceScreen =
    mounted && settings.maintenanceMode;

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#100807] text-white" />
    );
  }

  if (maintenanceScreen) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#100807] px-6 text-white">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#c9a45c]/40 bg-[#c9a45c]/10 text-4xl">
            ♛
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#d7b56d]">
            {settings.restaurantName}
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Website Under Maintenance
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-white/60">
            We are currently updating our website.
            Please come back soon.
          </p>

          {contact.phone && (
            <a
              href={`tel:${contact.phone.replace(
                /\s/g,
                ""
              )}`}
              className="mt-8 inline-flex rounded-full border border-[#c9a45c]/50 px-7 py-3 font-semibold text-[#e8c979]"
            >
              {t.call}: {contact.phone}
            </a>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#100807] text-white">
      {/* Breaking News */}
      {activeNews.length > 0 && (
        <div className="border-b border-[#d7b56d]/20 bg-[#24100e]">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-2.5">
            <span className="rounded-full bg-[#b58a3a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
              News
            </span>

            <div className="min-w-0 overflow-hidden">
              <div className="animate-pulse truncate text-xs font-medium text-[#ead8ad] sm:text-sm">
                {activeNews[0].text}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100807]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#c9a45c]/10 text-xl text-[#e6c77a] shadow-[0_0_25px_rgba(201,164,92,0.15)]">
              ♛
            </div>

            <div className="text-left">
              <div className="font-serif text-lg font-bold tracking-wide text-[#e5c87b]">
                {settings.restaurantName}
              </div>

              <div className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                Roma • Ristorante
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            <button
              onClick={() => scrollTo("home")}
              className="nav-link"
            >
              {t.home}
            </button>

            {about.visible && (
              <button
                onClick={() => scrollTo("about")}
                className="nav-link"
              >
                {t.about}
              </button>
            )}

            <button
              onClick={() => scrollTo("menu")}
              className="nav-link"
            >
              {t.menu}
            </button>

            {visibleGallery.length > 0 && (
              <button
                onClick={() => scrollTo("gallery")}
                className="nav-link"
              >
                {t.gallery}
              </button>
            )}

            {home.bookingVisible && (
              <button
                onClick={() => scrollTo("booking")}
                className="nav-link"
              >
                {t.booking}
              </button>
            )}

            {visibleReviews.length > 0 && (
              <button
                onClick={() => scrollTo("reviews")}
                className="nav-link"
              >
                {t.reviews}
              </button>
            )}

            {contact.visible && (
              <button
                onClick={() => scrollTo("contact")}
                className="nav-link"
              >
                {t.contact}
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {languages.languageSwitcherVisible &&
              languageOptions.length > 1 && (
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value as Language
                    )
                  }
                  className="hidden rounded-full border border-[#c9a45c]/30 bg-[#20100d] px-3 py-2 text-xs text-[#e9d18c] outline-none sm:block"
                >
                  {languageOptions.map(
                    (option) => (
                      <option
                        key={option.key}
                        value={option.key}
                      >
                        {option.flag}{" "}
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              )}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg lg:hidden"
            >
              ☰
            </button>

            <button
              type="button"
              onClick={() => scrollTo("booking")}
              className="hidden rounded-full bg-gradient-to-r from-[#a9792e] to-[#e0bc68] px-5 py-2.5 text-xs font-bold text-[#170c08] shadow-lg shadow-[#a9792e]/10 sm:block"
            >
              {t.reserve}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#160b09] px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollTo("home")}
                className="mobile-nav"
              >
                {t.home}
              </button>

              {about.visible && (
                <button
                  onClick={() => scrollTo("about")}
                  className="mobile-nav"
                >
                  {t.about}
                </button>
              )}

              <button
                onClick={() => scrollTo("menu")}
                className="mobile-nav"
              >
                {t.menu}
              </button>

              <button
                onClick={() => scrollTo("gallery")}
                className="mobile-nav"
              >
                {t.gallery}
              </button>

              <button
                onClick={() => scrollTo("booking")}
                className="mobile-nav"
              >
                {t.booking}
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="mobile-nav"
              >
                {t.contact}
              </button>

              {languages.languageSwitcherVisible &&
                languageOptions.length > 1 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {languageOptions.map(
                      (option) => (
                        <button
                          key={option.key}
                          onClick={() =>
                            setLanguage(
                              option.key
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-xs ${
                            language ===
                            option.key
                              ? "border-[#d7b56d] bg-[#d7b56d]/10 text-[#e7c978]"
                              : "border-white/10 text-white/60"
                          }`}
                        >
                          {option.flag}{" "}
                          {option.label}
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      {home.heroVisible && (
        <section
          id="home"
          className="relative min-h-[720px] overflow-hidden"
        >
          {home.heroImage ? (
            <img
              src={home.heroImage}
              alt={settings.restaurantName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(134,67,37,0.45),transparent_32%),linear-gradient(125deg,#120807_0%,#35130f_48%,#100807_100%)]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0605]/95 via-[#170908]/75 to-[#0d0605]/30" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#100807] via-transparent to-[#100807]/30" />

          <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-5 py-24">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#d7b56d]/30 bg-black/20 px-4 py-2 backdrop-blur">
                <span className="text-[#e1bf70]">
                  ✦
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e8d29a]">
                  Authentic Dining Experience
                </span>
              </div>

              <h1 className="font-serif text-5xl font-bold leading-[1.05] text-white sm:text-7xl lg:text-8xl">
                {home.heroTitle}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                {home.heroSubtitle}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    scrollTo("booking")
                  }
                  className="rounded-full bg-gradient-to-r from-[#a9792e] to-[#e2c16f] px-7 py-4 text-sm font-bold text-[#160b07] shadow-xl shadow-black/30 transition hover:-translate-y-0.5"
                >
                  {t.reserve}
                </button>

                <button
                  onClick={() =>
                    scrollTo("menu")
                  }
                  className="rounded-full border border-[#d7b56d]/50 bg-black/20 px-7 py-4 text-sm font-bold text-[#ead18e] backdrop-blur transition hover:bg-[#d7b56d]/10"
                >
                  {t.discover}
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-white/45">
                <span>✦ Rome</span>
                <span>✦ Via Vespasiano</span>
                <span>✦ Fine Dining</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Welcome */}
      {home.welcomeVisible && (
        <section className="relative overflow-hidden border-y border-white/5 bg-[#130908] py-24">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8d5228]/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#cfa95b]">
              Nababi Ristorante
            </span>

            <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
              {t.welcome}
            </h2>

            <div className="mx-auto mt-6 h-px w-24 bg-[#c9a45c]/60" />

            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
              {home.welcomeText}
            </p>
          </div>
        </section>
      )}

      {/* About */}
      {about.visible && (
        <section
          id="about"
          className="border-b border-white/5 bg-[#100807] py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-[30px] border border-[#c9a45c]/20 bg-[#1b0d0a] shadow-2xl">
              {about.image ? (
                <img
                  src={about.image}
                  alt="About Nababi Ristorante"
                  className="h-[430px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[430px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(150,92,42,0.25),transparent_45%),#1a0b09]">
                  <div className="text-center">
                    <div className="text-7xl text-[#c9a45c]/70">
                      ♛
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[#c9a45c]/60">
                      Nababi Ristorante
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
                {t.about}
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {t.aboutTitle}
              </h2>

              <div className="mt-6 h-px w-20 bg-[#c9a45c]" />

              <div className="mt-7 whitespace-pre-line text-base leading-8 text-white/60">
                {about.content}
              </div>

              <button
                onClick={() =>
                  scrollTo("booking")
                }
                className="mt-8 rounded-full border border-[#c9a45c]/40 px-6 py-3 text-sm font-bold text-[#dfbf72] transition hover:bg-[#c9a45c]/10"
              >
                {t.reserve}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Menu */}
      <section
        id="menu"
        className="relative overflow-hidden border-b border-white/5 py-24"
        style={
          menuBackground
            ? {
                backgroundImage: `linear-gradient(rgba(16,8,7,0.88),rgba(16,8,7,0.94)),url(${menuBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {!menuBackground && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,72,33,0.12),transparent_30%),#110807]" />
        )}

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
              {t.menu}
            </span>

            <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
              {t.ourMenu}
            </h2>

            <div className="mx-auto mt-5 h-px w-20 bg-[#c9a45c]" />
          </div>

          {menuCategoryList.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <button
                onClick={() =>
                  setSelectedCategory(
                    "All"
                  )
                }
                className={`rounded-full border px-5 py-2.5 text-xs font-semibold ${
                  selectedCategory ===
                  "All"
                    ? "border-[#d7b56d] bg-[#d7b56d] text-[#160b07]"
                    : "border-white/10 bg-white/5 text-white/60"
                }`}
              >
                {t.all}
              </button>

              {menuCategoryList.map(
                (category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    className={`rounded-full border px-5 py-2.5 text-xs font-semibold ${
                      selectedCategory ===
                      category
                        ? "border-[#d7b56d] bg-[#d7b56d] text-[#160b07]"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          )}

          {filteredMenu.length === 0 ? (
            <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <div className="text-4xl">
                🍽️
              </div>

              <p className="mt-4 text-white/50">
                {t.noItems}
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map(
                (item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#1a0c0a]/90 shadow-xl transition hover:-translate-y-1 hover:border-[#c9a45c]/30"
                  >
                    <div className="relative h-56 overflow-hidden bg-[#24100d]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(177,116,51,0.25),transparent_50%)]">
                          <span className="text-6xl">
                            🍽️
                          </span>
                        </div>
                      )}

                      <div className="absolute right-3 top-3 rounded-full border border-[#d7b56d]/30 bg-black/60 px-3 py-1 text-xs font-bold text-[#e8cc84] backdrop-blur">
                        {formatPrice(
                          item.price,
                          settings.currency
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b98e45]">
                        {item.category}
                      </div>

                      <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-5 h-px bg-white/5" />

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-[#ddbd70]">
                          {formatPrice(
                            item.price,
                            settings.currency
                          )}
                        </span>

                        <button
                          onClick={() =>
                            scrollTo("booking")
                          }
                          className="text-xs font-bold text-white/50 transition hover:text-[#dfc274]"
                        >
                          {t.reserve} →
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {visibleGallery.length > 0 && (
        <section
          id="gallery"
          className="border-b border-white/5 bg-[#130908] py-24"
        >
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
                {t.gallery}
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {t.ourGallery}
              </h2>

              <div className="mx-auto mt-5 h-px w-20 bg-[#c9a45c]" />
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleGallery.map(
                (item, index) => (
                  <div
                    key={item.id}
                    className={`group overflow-hidden rounded-[26px] border border-white/10 bg-[#1b0d0a] ${
                      index === 0
                        ? "sm:row-span-2"
                        : ""
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={
                          item.category ||
                          "Nababi Ristorante"
                        }
                        className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                          index === 0
                            ? "h-[520px]"
                            : "h-[250px]"
                        }`}
                      />
                    ) : (
                      <div
                        className={`flex items-center justify-center bg-[#21100d] ${
                          index === 0
                            ? "h-[520px]"
                            : "h-[250px]"
                        }`}
                      >
                        <span className="text-5xl">
                          📷
                        </span>
                      </div>
                    )}

                    <div className="absolute" />

                    <div className="relative -mt-14 mx-4 mb-4 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e0c47d]">
                        {item.category}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Opening Hours */}
      {openingHours.visible && (
        <section className="border-b border-white/5 bg-[#100807] py-24">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
                Nababi Ristorante
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {openingHours.title ||
                  t.openingHours}
              </h2>
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              {openingHours.days.map(
                (day) => (
                  <div
                    key={day.day}
                    className="flex flex-col gap-2 border-b border-white/5 px-5 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-semibold text-white">
                      {day.day}
                    </span>

                    {day.open ? (
                      <div className="text-sm text-white/50 sm:text-right">
                        <div>
                          {day.openingTime} –{" "}
                          {day.closingTime}
                        </div>

                        {day.breakEnabled && (
                          <div className="mt-1 text-xs text-[#c9a45c]/70">
                            Break:{" "}
                            {day.breakStart} –{" "}
                            {day.breakEnd}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-red-300/70">
                        {t.closed}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Booking */}
      {home.bookingVisible && (
        <section
          id="booking"
          className="relative overflow-hidden border-b border-white/5 bg-[#170a08] py-24"
        >
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#8f4b27]/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-5">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
                Reservation
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {home.bookingTitle ||
                  t.bookingTitle}
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/45">
                {home.bookingText}
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-4xl rounded-[32px] border border-[#c9a45c]/20 bg-black/20 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <form
                onSubmit={
                  editingBookingId
                    ? updateExistingBooking
                    : handleBookingSubmit
                }
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="form-label">
                      {t.name}
                    </label>

                    <input
                      className="form-input"
                      value={
                        bookingForm.name
                      }
                      onChange={(e) =>
                        setBookingForm(
                          (current) => ({
                            ...current,
                            name: e.target.value,
                          })
                        )
                      }
                      placeholder={t.name}
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Contact Method
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setBookingForm(
                            (current) => ({
                              ...current,
                              contactMethod:
                                "phone",
                            })
                          )
                        }
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                          bookingForm.contactMethod ===
                          "phone"
                            ? "border-[#d7b56d] bg-[#d7b56d]/10 text-[#e4c77c]"
                            : "border-white/10 bg-white/5 text-white/50"
                        }`}
                      >
                        📱 {t.phone}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setBookingForm(
                            (current) => ({
                              ...current,
                              contactMethod:
                                "email",
                            })
                          )
                        }
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                          bookingForm.contactMethod ===
                          "email"
                            ? "border-[#d7b56d] bg-[#d7b56d]/10 text-[#e4c77c]"
                            : "border-white/10 bg-white/5 text-white/50"
                        }`}
                      >
                        ✉️ {t.email}
                      </button>
                    </div>
                  </div>

                  {bookingForm.contactMethod ===
                    "phone" && (
                    <div>
                      <label className="form-label">
                        {t.phone}
                      </label>

                      <input
                        className="form-input"
                        type="tel"
                        value={
                          bookingForm.phone
                        }
                        onChange={(e) =>
                          setBookingForm(
                            (current) => ({
                              ...current,
                              phone: e.target.value,
                            })
                          )
                        }
                        placeholder="+39 ..."
                      />
                    </div>
                  )}

                  {bookingForm.contactMethod ===
                    "email" && (
                    <div>
                      <label className="form-label">
                        {t.email}
                      </label>

                      <input
                        className="form-input"
                        type="email"
                        value={
                          bookingForm.email
                        }
                        onChange={(e) =>
                          setBookingForm(
                            (current) => ({
                              ...current,
                              email: e.target.value,
                            })
                          )
                        }
                        placeholder="email@example.com"
                      />
                    </div>
                  )}

                  <div>
                    <label className="form-label">
                      {t.date}
                    </label>

                    <input
                      className="form-input"
                      type="date"
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      value={
                        bookingForm.date
                      }
                      onChange={(e) =>
                        setBookingForm(
                          (current) => ({
                            ...current,
                            date: e.target.value,
                          })
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      {t.time}
                    </label>

                    <input
                      className="form-input"
                      type="time"
                      value={
                        bookingForm.time
                      }
                      onChange={(e) =>
                        setBookingForm(
                          (current) => ({
                            ...current,
                            time: e.target.value,
                          })
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      {t.guests}
                    </label>

                    <select
                      className="form-input"
                      value={
                        bookingForm.guests
                      }
                      onChange={(e) =>
                        setBookingForm(
                          (current) => ({
                            ...current,
                            guests:
                              e.target.value,
                          })
                        )
                      }
                    >
                      {Array.from(
                        { length: 15 },
                        (_, index) =>
                          index + 1
                      ).map((number) => (
                        <option
                          key={number}
                          value={number}
                          className="bg-[#24100d]"
                        >
                          {number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">
                      {t.menuChoice}
                    </label>

                    <select
                      className="form-input"
                      value={
                        bookingForm.menu
                      }
                      onChange={(e) =>
                        setBookingForm(
                          (current) => ({
                            ...current,
                            menu: e.target.value,
                          })
                        )
                      }
                    >
                      <option
                        value=""
                        className="bg-[#24100d]"
                      >
                        Select menu
                      </option>

                      {menuCategoryList.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                            className="bg-[#24100d]"
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">
                      {t.note}
                    </label>

                    <textarea
                      className="form-input min-h-28 resize-none"
                      value={
                        bookingForm.note
                      }
                      onChange={(e) =>
                        setBookingForm(
                          (current) => ({
                            ...current,
                            note: e.target.value,
                          })
                        )
                      }
                      placeholder="Special request..."
                    />
                  </div>
                </div>

                {bookingMessage && (
                  <div className="mt-5 rounded-2xl border border-[#d7b56d]/20 bg-[#d7b56d]/10 px-4 py-4 text-center text-sm font-semibold text-[#ead28f]">
                    {bookingMessage}
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-gradient-to-r from-[#a9792e] to-[#e2c16f] px-7 py-4 text-sm font-bold text-[#160b07] shadow-xl transition hover:-translate-y-0.5"
                  >
                    {editingBookingId
                      ? "Update Booking"
                      : t.submit}
                  </button>

                  {editingBookingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBookingId(
                          null
                        );

                        setBookingForm({
                          name: "",
                          phone: "",
                          email: "",
                          contactMethod:
                            "phone",
                          date: "",
                          time: "",
                          guests: "2",
                          menu: "",
                          note: "",
                        });
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white/60"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Manage Booking */}
              <div className="mt-8 border-t border-white/10 pt-8">
                <button
                  type="button"
                  onClick={() =>
                    setManageOpen(
                      (current) => !current
                    )
                  }
                  className="mx-auto flex rounded-full border border-[#c9a45c]/30 bg-[#c9a45c]/5 px-6 py-3 text-sm font-bold text-[#dfc273]"
                >
                  {t.manage}
                </button>

                {manageOpen && (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="mb-4 text-center text-xs leading-6 text-white/40">
                      Enter the phone number or email
                      used for your reservation.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={
                          manageContact
                        }
                        onChange={(e) =>
                          setManageContact(
                            e.target.value
                          )
                        }
                        className="form-input flex-1"
                        placeholder="Phone or Email"
                      />

                      <button
                        type="button"
                        onClick={
                          handleFindBookings
                        }
                        className="rounded-2xl bg-[#d1ac5f] px-6 py-3 font-bold text-[#160b07]"
                      >
                        Find Booking
                      </button>
                    </div>

                    {manageMessage && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
                        {manageMessage}
                      </div>
                    )}

                    {manageBookings.length >
                      0 && (
                      <div className="mt-5 space-y-4">
                        {manageBookings.map(
                          (reservation) => (
                            <div
                              key={
                                reservation.id
                              }
                              className="rounded-2xl border border-white/10 bg-white/5 p-5"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <h3 className="font-serif text-xl font-bold text-white">
                                    {
                                      reservation.name
                                    }
                                  </h3>

                                  <p className="mt-1 text-xs text-white/40">
                                    {
                                      reservation.date
                                    }{" "}
                                    •{" "}
                                    {
                                      reservation.time
                                    }{" "}
                                    •{" "}
                                    {
                                      reservation.guests
                                    }{" "}
                                    guests
                                  </p>
                                </div>

                                <span
                                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                                    reservation.status ===
                                    "Confirmed"
                                      ? "bg-green-500/10 text-green-200"
                                      : reservation.status ===
                                        "Cancelled"
                                      ? "bg-red-500/10 text-red-200"
                                      : "bg-yellow-500/10 text-yellow-200"
                                  }`}
                                >
                                  {
                                    reservation.status
                                  }
                                </span>
                              </div>

                              <div className="mt-4 grid gap-3 text-xs text-white/45 sm:grid-cols-2">
                                <div>
                                  Menu:{" "}
                                  {reservation.menu ||
                                    "—"}
                                </div>

                                <div>
                                  Contact:{" "}
                                  {reservation.phone ||
                                    reservation.email ||
                                    "—"}
                                </div>
                              </div>

                              {reservation.note && (
                                <p className="mt-4 text-xs leading-6 text-white/40">
                                  {
                                    reservation.note
                                  }
                                </p>
                              )}

                              {reservation.status !==
                                "Cancelled" && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditBooking(
                                        reservation
                                      )
                                    }
                                    className="rounded-xl border border-[#c9a45c]/30 px-4 py-2 text-xs font-bold text-[#dfc273]"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      cancelBooking(
                                        reservation.id
                                      )
                                    }
                                    className="rounded-xl border border-red-300/20 bg-red-500/5 px-4 py-2 text-xs font-bold text-red-200"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {visibleReviews.length > 0 && (
        <section
          id="reviews"
          className="border-b border-white/5 bg-[#130908] py-24"
        >
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
                {t.reviews}
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {t.reviewsTitle}
              </h2>

              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="text-[#e2c16f]">
                  {"★".repeat(
                    Math.round(
                      averageRating
                    )
                  )}
                </span>

                <span className="text-sm text-white/50">
                  {averageRating.toFixed(
                    1
                  )} / 5
                </span>
              </div>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleReviews.map(
                (review) => (
                  <article
                    key={review.id}
                    className="rounded-[26px] border border-white/10 bg-white/[0.035] p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {review.image ? (
                          <img
                            src={review.image}
                            alt={
                              review.customerName
                            }
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a45c]/10 text-lg text-[#e0c276]">
                            {review.customerName
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-white">
                            {
                              review.customerName
                            }
                          </p>

                          <p className="text-[10px] text-white/30">
                            {review.date}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm text-[#e2c16f]">
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
                      </span>
                    </div>

                    <p className="mt-6 text-sm leading-7 text-white/55">
                      “{review.review}”
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {contact.visible && (
        <section
          id="contact"
          className="border-b border-white/5 bg-[#100807] py-24"
        >
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
                {t.contact}
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {contact.contactTitle ||
                  t.contactTitle}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45">
                {contact.contactText}
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <div className="contact-card">
                <div className="contact-icon">
                  📍
                </div>

                <h3 className="contact-title">
                  Address
                </h3>

                <p className="contact-text">
                  {contact.address ||
                    "Via Vespasiano 73/75/77, Roma"}
                </p>

                <a
                  href={
                    contact.googleMapsUrl ||
                    "https://www.google.com/maps/search/?api=1&query=Via+Vespasiano+73%2F75%2F77%2C+Roma"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  {t.directions} →
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  ☎
                </div>

                <h3 className="contact-title">
                  {t.phone}
                </h3>

                <p className="contact-text">
                  {contact.phone ||
                    "+39 393 3805350"}
                </p>

                <a
                  href={`tel:${(
                    contact.phone ||
                    "+39 393 3805350"
                  ).replace(
                    /\s/g,
                    ""
                  )}`}
                  className="contact-link"
                >
                  {t.call} →
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  💬
                </div>

                <h3 className="contact-title">
                  WhatsApp
                </h3>

                <p className="contact-text">
                  {contact.whatsapp ||
                    "+39 333 7687319"}
                </p>

                <a
                  href={`https://wa.me/${(
                    contact.whatsapp ||
                    "+39 333 7687319"
                  ).replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  {t.whatsapp} →
                </a>
              </div>
            </div>

            {contact.email && (
              <div className="mx-auto mt-5 max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Email
                </p>

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 block text-[#dfc273]"
                >
                  {contact.email}
                </a>
              </div>
            )}

            <div className="mt-10 overflow-hidden rounded-[30px] border border-white/10 bg-[#1a0c0a]">
              <iframe
                title="Nababi Ristorante Location"
                src={
                  contact.googleMapsUrl
                    ? contact.googleMapsUrl.replace(
                        "/maps/search/",
                        "/maps/embed?"
                      )
                    : "https://www.google.com/maps?q=Via+Vespasiano+73%2F75%2F77%2C+Roma&output=embed"
                }
                className="h-[380px] w-full border-0 opacity-80 grayscale-[0.3]"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* Social */}
      {social.visible && (
        <section className="border-b border-white/5 bg-[#130908] py-16">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a45c]">
              {t.follow}
            </span>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="social-button"
                >
                  Facebook
                </a>
              )}

              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="social-button"
                >
                  Instagram
                </a>
              )}

              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="social-button"
                >
                  TikTok
                </a>
              )}

              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="social-button"
                >
                  YouTube
                </a>
              )}

              {social.whatsapp && (
                <a
                  href={`https://wa.me/${social.whatsapp.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-button"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0b0504] py-12">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a45c]/40 bg-[#c9a45c]/10 text-xl text-[#e0c276]">
                  ♛
                </div>

                <div>
                  <p className="font-serif text-xl font-bold text-[#dfc273]">
                    {settings.restaurantName}
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                    Roma
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/35">
                Authentic dining, warm hospitality and
                memorable moments in Rome.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Navigation
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/40">
                <button
                  onClick={() =>
                    scrollTo("home")
                  }
                  className="text-left transition hover:text-[#dfc273]"
                >
                  {t.home}
                </button>

                <button
                  onClick={() =>
                    scrollTo("menu")
                  }
                  className="text-left transition hover:text-[#dfc273]"
                >
                  {t.menu}
                </button>

                <button
                  onClick={() =>
                    scrollTo("booking")
                  }
                  className="text-left transition hover:text-[#dfc273]"
                >
                  {t.booking}
                </button>

                <button
                  onClick={() =>
                    scrollTo("contact")
                  }
                  className="text-left transition hover:text-[#dfc273]"
                >
                  {t.contact}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Contact
              </h3>

              <div className="mt-4 space-y-3 text-sm text-white/40">
                <p>
                  📍{" "}
                  {contact.address ||
                    "Via Vespasiano 73/75/77, Roma"}
                </p>

                <p>
                  ☎{" "}
                  {contact.phone ||
                    "+39 393 3805350"}
                </p>

                <p>
                  💬{" "}
                  {contact.whatsapp ||
                    "+39 333 7687319"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-white/25">
            © {new Date().getFullYear()}{" "}
            {settings.restaurantName}. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #dfc273;
        }

        .mobile-nav {
          text-align: left;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
          font-weight: 600;
        }

        .mobile-nav:hover {
          color: #dfc273;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          font-weight: 700;
        }

        .form-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.055);
          padding: 13px 15px;
          color: white;
          outline: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .form-input:focus {
          border-color: rgba(215, 181, 109, 0.55);
          background: rgba(255, 255, 255, 0.075);
        }

        .form-input option {
          background: #24100d;
          color: white;
        }

        .contact-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
          border-radius: 26px;
          padding: 28px;
          text-align: center;
        }

        .contact-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(201, 164, 92, 0.25);
          background: rgba(201, 164, 92, 0.07);
          font-size: 20px;
        }

        .contact-title {
          margin-top: 18px;
          color: white;
          font-family: Georgia, serif;
          font-size: 21px;
          font-weight: 700;
        }

        .contact-text {
          margin-top: 9px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 13px;
          line-height: 1.8;
        }

        .contact-link {
          display: inline-block;
          margin-top: 18px;
          color: #dfc273;
          font-size: 12px;
          font-weight: 700;
        }

        .social-button {
          border: 1px solid rgba(201, 164, 92, 0.22);
          border-radius: 999px;
          background: rgba(201, 164, 92, 0.04);
          padding: 11px 18px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .social-button:hover {
          border-color: rgba(201, 164, 92, 0.5);
          color: #dfc273;
          background: rgba(201, 164, 92, 0.08);
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .form-input {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}
