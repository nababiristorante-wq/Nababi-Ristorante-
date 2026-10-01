"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type AnyData = Record<string, any>;

type MenuItem = {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  price?: string | number;
  category?: string;
  image?: string;
  available?: boolean;
};

type GalleryItem = {
  id?: string;
  title?: string;
  image?: string;
  visible?: boolean;
  show?: boolean;
  order?: number;
};

type Reservation = {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  category: string;
  item: string;
  note: string;
  status: string;
  createdAt: string;
};

type SocialData = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  visible?: boolean;
};

const DEFAULT_CATEGORIES = [
  "Biryani",
  "Pizza",
  "Burger",
  "Naan",
  "Chicken",
  "Mutton",
  "Drinks",
  "Desserts",
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function arrayData(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function categoryName(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (value && typeof value === "object") {
    const item = value as AnyData;

    return String(
      item.name ??
        item.title ??
        item.label ??
        "",
    ).trim();
  }

  return "";
}

function bookingCode(): string {
  const letters = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase();

  const number = Math.floor(
    1000 + Math.random() * 9000,
  );

  return `NAB-${letters}${number}`;
}

function Icon({
  name,
  size = 21,
}: {
  name: string;
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "phone") {
    return (
      <svg {...props}>
        <path d="M7 3.5 4.8 4.6c-.8.4-1.2 1.2-1 2.1 1.5 6.8 6.7 12 13.5 13.5.9.2 1.7-.2 2.1-1l1.1-2.2-4.1-2.1-1.8 1.9c-2.7-1.2-4.7-3.2-5.9-5.9l1.9-1.8L8.5 5Z" />
      </svg>
    );
  }

  if (name === "pin") {
    return (
      <svg {...props}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg {...props}>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...props}>
        <rect
          x="3.5"
          y="5"
          width="17"
          height="15"
          rx="2"
        />
        <path d="M7 3v4M17 3v4M3.5 9h17" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.7-3.6 3-5.5 7-5.5s6.3 1.9 7 5.5" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.3-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-4l-.3 3.2c-.6.2-1.2.5-1.7 1l-2.4-1-2 3.3L6 11c-.1.7-.1 1.3 0 2l-2 1.5 2 3.3 2.4-1c.5.4 1.1.8 1.7 1l.3 3.2h4l.3-3.2c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.3-2-1.5c.1-.3.1-.7.1-1Z" />
      </svg>
    );
  }

  if (name === "map") {
    return (
      <svg {...props}>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    );
  }

  if (name === "gallery") {
    return (
      <svg {...props}>
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
        />
        <circle cx="9" cy="9" r="1.5" />
        <path d="m5 17 5-5 3 3 2-2 4 4" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg {...props}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...props}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }

  if (name === "edit") {
    return (
      <svg {...props}>
        <path d="m4 16-.7 4.7L8 20l11-11-4-4L4 16Z" />
        <path d="m13.5 6.5 4 4" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg {...props}>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...props}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg
        {...props}
        fill="currentColor"
        stroke="none"
      >
        <path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...props}>
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="4"
        />
        <circle cx="12" cy="12" r="3.5" />
        <circle
          cx="17"
          cy="7"
          r=".7"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg {...props}>
        <path d="M15 4c.3 2 1.4 3.2 3.5 3.5v3c-1.4 0-2.5-.4-3.5-1v5.2a5.2 5.2 0 1 1-4.5-5.1v3a2.2 2.2 0 1 0 1.5 2.1V4H15Z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg {...props}>
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="3"
        />
        <path
          d="m10 9 5 3-5 3V9Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function CategoryIcon({
  name,
}: {
  name: string;
}) {
  const value = name.toLowerCase();

  const icons: Record<string, string> = {
    biryani: "🍛",
    pizza: "🍕",
    burger: "🍔",
    naan: "🫓",
    chicken: "🍗",
    mutton: "🥩",
    meat: "🥩",
    fish: "🐟",
    drinks: "🥤",
    dessert: "🍨",
    desserts: "🍨",
    vegetarian: "🥗",
    rice: "🍚",
  };

  return (
    <span className="category-icon">
      {icons[value] || "🍽️"}
    </span>
  );
}

export default function HomePage() {
  const [home, setHome] =
    useState<AnyData>({});

  const [about, setAbout] =
    useState<AnyData>({});

  const [contact, setContact] =
    useState<AnyData>({});

  const [settings, setSettings] =
    useState<AnyData>({});

  const [social, setSocial] =
    useState<SocialData>({});

  const [menu, setMenu] =
    useState<MenuItem[]>([]);

  const [categories, setCategories] =
    useState<string[]>(
      DEFAULT_CATEGORIES,
    );

  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [reviews, setReviews] =
    useState<AnyData[]>([]);

  const [news, setNews] =
    useState<AnyData[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [galleryOpen, setGalleryOpen] =
    useState(false);

  const [bookingMessage, setBookingMessage] =
    useState("");

  const [booking, setBooking] =
    useState({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      category: "",
      item: "",
      note: "",
    });

  const [myBookingOpen, setMyBookingOpen] =
    useState(false);

  const [lookupValue, setLookupValue] =
    useState("");

  const [lookupCode, setLookupCode] =
    useState("");

  const [lookupStep, setLookupStep] =
    useState<
      "login" | "code" | "details"
    >("login");

  const [lookupMessage, setLookupMessage] =
    useState("");

  const [foundBooking, setFoundBooking] =
    useState<Reservation | null>(null);

  const [editingBooking, setEditingBooking] =
    useState(false);

  const [newsClosed, setNewsClosed] =
    useState(false);

  const loadData = () => {
    setHome(
      readStorage(
        "nababi-home-settings",
        {},
      ),
    );

    setAbout(
      readStorage(
        "nababi-about",
        {},
      ),
    );

    setContact(
      readStorage(
        "nababi-contact",
        {},
      ),
    );

    setSettings(
      readStorage(
        "nababi-settings",
        {},
      ),
    );

    setSocial(
      readStorage(
        "nababi-social-media",
        {},
      ),
    );

    const rawMenu =
      arrayData(
        readStorage(
          "nababi-menu",
          [],
        ),
      ) as MenuItem[];

    setMenu(
      rawMenu.filter(
        (item) =>
          item.available !== false,
      ),
    );

    const rawCategories =
      arrayData(
        readStorage(
          "nababi-categories",
          [],
        ),
      );

    const categoryList =
      Array.from(
        new Set(
          rawCategories
            .map(categoryName)
            .filter(Boolean),
        ),
      );

    setCategories(
      categoryList.length
        ? categoryList
        : DEFAULT_CATEGORIES,
    );

    const rawGallery =
      arrayData(
        readStorage(
          "nababi-gallery",
          [],
        ),
      ) as GalleryItem[];

    setGallery(
      rawGallery
        .filter(
          (item) =>
            item.image &&
            item.visible !== false &&
            item.show !== false,
        )
        .sort(
          (a, b) =>
            Number(a.order ?? 0) -
            Number(b.order ?? 0),
        ),
    );

    setReviews(
      arrayData(
        readStorage(
          "nababi-reviews",
          [],
        ),
      ).filter(
        (item: AnyData) =>
          item.visible !== false,
      ),
    );

    const currentTime =
      new Date();

    setNews(
      arrayData(
        readStorage(
          "nababi-breaking-news",
          [],
        ),
      ).filter(
        (item: AnyData) => {
          if (
            item.visible === false
          ) {
            return false;
          }

          if (
            item.startDate &&
            new Date(
              item.startDate,
            ) > currentTime
          ) {
            return false;
          }

          if (
            item.endDate &&
            new Date(
              item.endDate,
            ) < currentTime
          ) {
            return false;
          }

          return Boolean(
            item.text ||
              item.title ||
              item.image ||
              item.video ||
              item.mediaId,
          );
        },
      ),
    );
  };

  useEffect(() => {
    loadData();

    const interval =
      window.setInterval(
        loadData,
        1500,
      );

    window.addEventListener(
      "storage",
      loadData,
    );

    return () => {
      window.clearInterval(
        interval,
      );

      window.removeEventListener(
        "storage",
        loadData,
      );
    };
  }, []);

  const restaurantName =
    settings.restaurantName ||
    contact.restaurantName ||
    "Nababi Ristorante";

  const heroTitle =
    home.heroTitle ||
    "Authentic Royal Taste";

  const heroSubtitle =
    home.heroSubtitle ||
    "Authentic flavors of India & Bangladesh in the heart of Rome.";

  /*
   * HOME HERO IMAGE
   *
   * Admin → Home থেকে image থাকলে
   * সেটি দেখাবে।
   *
   * Admin থেকে image delete করলে
   * default biryani image দেখাবে।
   *
   * এই default image আপনার দেওয়া
   * Nababi Ristorante design-এর
   * biryani hero হিসেবে ব্যবহার করা হবে।
   */
  const DEFAULT_BIRYANI_IMAGE =
    "/images/default-biryani.jpg";

  const heroImage =
    home.heroImage ||
    home.image ||
    DEFAULT_BIRYANI_IMAGE;

  const heroVideo =
    home.heroVideo ||
    home.video ||
    "";

  const aboutText =
    about.content ||
    about.text ||
    "Authentic food, warm hospitality and traditional flavors.";

  const phone =
    contact.phone || "";

  const email =
    contact.email || "";

  const address =
    contact.address ||
    "Via Vespasiano 73/75/77, Roma";

  const mapUrl =
    contact.googleMapsUrl ||
    "";

  const whatsapp =
    contact.whatsapp ||
    social.whatsapp ||
    "";

  const visibleNews =
    news.length > 0 &&
    !newsClosed
      ? news[0]
      : null;

  const categoryCards =
    useMemo(() => {
      return categories.map(
        (category) => {
          const firstItem =
            menu.find(
              (item) =>
                categoryName(
                  item.category,
                )
                  .toLowerCase() ===
                category.toLowerCase(),
            );

          return {
            name: category,
            image:
              firstItem?.image ||
              "",
          };
        },
      );
    }, [
      categories,
      menu,
    ]);

  const selectedItems =
    selectedCategory
      ? menu.filter(
          (item) =>
            categoryName(
              item.category,
            )
              .toLowerCase() ===
            selectedCategory.toLowerCase(),
        )
      : [];

  const bookingItems =
    booking.category
      ? menu.filter(
          (item) =>
            categoryName(
              item.category,
            )
              .toLowerCase() ===
            booking.category.toLowerCase(),
        )
      : [];

  const socialLinks = [
    {
      name: "facebook",
      url: social.facebook,
    },
    {
      name: "instagram",
      url: social.instagram,
    },
    {
      name: "tiktok",
      url: social.tiktok,
    },
    {
      name: "youtube",
      url: social.youtube,
    },
  ].filter(
    (item) => item.url,
  );

  const scrollTo = (
    id: string,
  ) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setMobileOpen(false);
  };

  const submitBooking = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setBookingMessage("");

    if (
      !booking.name ||
      !booking.date ||
      !booking.time
    ) {
      setBookingMessage(
        "Name, date and time are required.",
      );
      return;
    }

    if (
      !booking.phone &&
      !booking.email
    ) {
      setBookingMessage(
        "Please enter a phone number or email.",
      );
      return;
    }

    const newReservation: Reservation =
      {
        id: `reservation-${Date.now()}`,
        code: bookingCode(),
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        guests:
          Number(
            booking.guests,
          ) || 2,
        category:
          booking.category,
        item: booking.item,
        note: booking.note,
        status: "Confirmed",
        createdAt:
          new Date().toISOString(),
      };

    const current =
      arrayData(
        readStorage(
          "nababi-reservations",
          [],
        ),
      ) as Reservation[];

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify([
        newReservation,
        ...current,
      ]),
    );

    setBookingMessage(
      `Booking confirmed. Your booking code is ${newReservation.code}`,
    );

    setBooking({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      category: "",
      item: "",
      note: "",
    });
  };

  const findMyBooking = () => {
    const value =
      lookupValue
        .trim()
        .toLowerCase();

    if (!value) {
      setLookupMessage(
        "Enter your phone number or email.",
      );
      return;
    }

    const reservations =
      arrayData(
        readStorage(
          "nababi-reservations",
          [],
        ),
      ) as Reservation[];

    const found =
      reservations.find(
        (item) =>
          String(
            item.phone || "",
          ).toLowerCase() ===
            value ||
          String(
            item.email || "",
          ).toLowerCase() ===
            value,
      );

    if (!found) {
      setLookupMessage(
        "No booking found for this phone number or email.",
      );
      return;
    }

    setFoundBooking(found);
    setLookupMessage("");
    setLookupStep("code");
  };

  const verifyCode = () => {
    if (!foundBooking)
      return;

    if (
      lookupCode
        .trim()
        .toUpperCase() !==
      foundBooking.code.toUpperCase()
    ) {
      setLookupMessage(
        "The booking code is incorrect.",
      );
      return;
    }

    setLookupMessage("");
    setLookupStep("details");
  };

  const updateMyBooking = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!foundBooking)
      return;

    const reservations =
      arrayData(
        readStorage(
          "nababi-reservations",
          [],
        ),
      ) as Reservation[];

    const updated =
      reservations.map(
        (item) =>
          item.id ===
          foundBooking.id
            ? foundBooking
            : item,
      );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify(updated),
    );

    setEditingBooking(false);

    setLookupMessage(
      "Your booking has been updated.",
    );
  };

  const cancelMyBooking = () => {
    if (!foundBooking)
      return;

    const reservations =
      arrayData(
        readStorage(
          "nababi-reservations",
          [],
        ),
      ) as Reservation[];

    const updated =
      reservations.map(
        (item) =>
          item.id ===
          foundBooking.id
            ? {
                ...item,
                status:
                  "Cancelled",
              }
            : item,
      );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify(updated),
    );

    setFoundBooking({
      ...foundBooking,
      status: "Cancelled",
    });

    setLookupMessage(
      "Your booking has been cancelled.",
    );
  };

  const openWhatsApp = () => {
    if (!whatsapp)
      return;

    const number =
      whatsapp.replace(
        /[^\d+]/g,
        "",
      );

    window.open(
      `https://wa.me/${number.replace(
        "+",
        "",
      )}`,
      "_blank",
    );
  };

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
          background: #050607;
          color: #fff;
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

        :root {
          --gold: #f2bd45;
          --gold-light: #ffe29a;
          --black: #050607;
          --panel: #0b0e10;
          --muted: #aaa69d;
          --line: rgba(242, 189, 69, 0.5);
        }

        .site {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(
                242,
                189,
                69,
                0.08
              ),
              transparent 28%
            ),
            #050607;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          min-height: 70px;
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 9px 4vw;
          background: rgba(
            4,
            6,
            7,
            0.97
          );
          border-bottom: 1px solid
            var(--line);
          backdrop-filter: blur(
            16px
          );
        }

        .brand {
          border: 0;
          background: transparent;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 220px;
          text-align: left;
        }

        .brand-mark {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border: 1px solid
            var(--gold);
          border-radius: 50%;
          color: var(--gold);
          font-size: 25px;
        }

        .brand-name {
          display: block;
          color: var(--gold);
          font-size: 19px;
          letter-spacing: 4px;
        }

        .brand-sub {
          display: block;
          font-size: 8px;
          letter-spacing: 3px;
        }

        .nav {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: 25px;
        }

        .nav button {
          border: 0;
          background: transparent;
          color: #eee;
          padding: 9px 0;
        }

        .nav button:hover {
          color: var(--gold);
        }

        .top-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pill,
        .gold-btn,
        .outline-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 999px;
          padding: 10px 17px;
          border: 1px solid
            var(--gold);
          background: transparent;
          color: var(--gold-light);
        }

        .gold-btn {
          color: #171108;
          background: linear-gradient(
            135deg,
            #f9d878,
            #d99a25
          );
          font-weight: 700;
        }

        .mobile-menu {
          display: none;
          border: 1px solid
            var(--line);
          background: transparent;
          color: var(--gold);
          padding: 8px 12px;
          border-radius: 8px;
        }

        .hero {
          min-height: 650px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-bottom: 1px solid
            var(--line);
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.88),
              rgba(0, 0, 0, 0.45),
              rgba(0, 0, 0, 0.8)
            ),
            #080a0c;
        }

        .hero.with-image {
          background-image:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.83),
              rgba(0, 0, 0, 0.38),
              rgba(0, 0, 0, 0.72)
            ),
            var(--hero-image);
          background-size: cover;
          background-position: center;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .hero-video::after {
          content: "";
        }

        .hero-content {
          position: relative;
          z-index: 5;
          width: min(
            1180px,
            92%
          );
          margin: 0 auto;
          padding: 130px 0 100px;
        }

        .eyebrow {
          color: var(--gold);
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 700px;
          margin: 10px 0 14px;
          color: #fff;
          font-size: clamp(
            50px,
            7vw,
            88px
          );
          line-height: 0.98;
          font-weight: 700;
        }

        .hero-description {
          max-width: 650px;
          color: #ddd;
          font-size: 18px;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .hero-contact {
          position: absolute;
          left: 4vw;
          right: 4vw;
          bottom: 25px;
          z-index: 7;
          display: flex;
          gap: 28px;
          align-items: center;
          color: #eee;
          font-size: 13px;
        }

        .hero-contact span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .hero-empty {
          margin-top: 25px;
          color: rgba(
            255,
            255,
            255,
            0.42
          );
          font-size: 12px;
        }

        /*
          BREAKING NEWS:
          শুধু একটি box — বাম পাশে।
          Home hero-এর দ্বিতীয় কোনো video box নেই।
        */

        .breaking-news {
          position: absolute;
          left: 22px;
          top: 25px;
          z-index: 20;
          width: 275px;
          background: rgba(
            4,
            6,
            7,
            0.96
          );
          border: 1px solid
            var(--gold);
          border-radius: 13px;
          overflow: hidden;
          box-shadow:
            0 20px 50px
              rgba(0, 0, 0, 0.5);
        }

        .breaking-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 11px;
          background: #df3434;
          font-weight: 700;
        }

        .breaking-close {
          border: 0;
          background: transparent;
          color: #fff;
        }

        .breaking-media {
          display: block;
          width: 100%;
          height: 150px;
          object-fit: cover;
          background: #111;
        }

        .breaking-body {
          padding: 11px;
        }

        .breaking-body strong {
          display: block;
          margin-bottom: 5px;
        }

        .breaking-body small {
          color: var(--gold);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          border-bottom: 1px solid
            var(--line);
          background: #07090a;
        }

        .feature {
          text-align: center;
          padding: 28px 12px;
          border-right: 1px solid
            rgba(
              242,
              189,
              69,
              0.25
            );
        }

        .feature:last-child {
          border-right: 0;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin: 0 auto 10px;
          border: 1px solid
            var(--gold);
          border-radius: 50%;
          color: var(--gold);
        }

        .feature strong {
          display: block;
          margin-bottom: 6px;
        }

        .feature span {
          color: var(--muted);
          font-size: 13px;
        }

        .section {
          width: min(
            1180px,
            92%
          );
          margin: 0 auto;
          padding: 75px 0;
        }

        .section-title {
          margin-bottom: 28px;
        }

        .section-title h2 {
          margin: 7px 0;
          color: var(--gold);
          font-size: clamp(
            30px,
            4vw,
            48px
          );
        }

        .section-title p {
          color: var(--muted);
          line-height: 1.7;
        }

        .about-grid {
          display: grid;
          grid-template-columns:
            1.1fr
            1fr
            0.8fr;
          gap: 18px;
        }

        .box {
          background: linear-gradient(
            145deg,
            rgba(
              255,
              255,
              255,
              0.035
            ),
            rgba(
              255,
              255,
              255,
              0.015
            )
          );
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.2
            );
          border-radius: 16px;
          padding: 22px;
        }

        .about-media {
          padding: 0;
          min-height: 340px;
          overflow: hidden;
        }

        .about-media img,
        .about-media video {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 340px;
          object-fit: cover;
        }

        .empty-box {
          min-height: 200px;
          display: grid;
          place-items: center;
          color: var(--muted);
          text-align: center;
          padding: 30px;
        }

        .about-text p {
          color: #d4d0c8;
          line-height: 1.8;
        }

        .info-box h4 {
          color: var(--gold);
          margin-top: 0;
        }

        .info-line {
          padding: 13px 0;
          border-bottom: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
          color: #ddd;
        }

        .menu-section {
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(
                242,
                189,
                69,
                0.07
              ),
              transparent 30%
            ),
            #07090a;
          border-top: 1px solid
            rgba(
              242,
              189,
              69,
              0.12
            );
          border-bottom: 1px solid
            rgba(
              242,
              189,
              69,
              0.12
            );
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 14px;
        }

        .category-card {
          position: relative;
          min-height: 180px;
          padding: 0;
          overflow: hidden;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.22
            );
          border-radius: 14px;
          background: #0a0c0e;
          color: #fff;
          text-align: left;
        }

        .category-card.active {
          border-color:
            var(--gold);
          box-shadow:
            0 0 0 1px
              var(--gold);
        }

        .category-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.72;
        }

        .category-placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle,
              rgba(
                242,
                189,
                69,
                0.15
              ),
              transparent 60%
            ),
            #101315;
        }

        .category-icon {
          font-size: 52px;
        }

        .category-name {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 15px;
          background: linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.9)
          );
          font-weight: 700;
          color: #fff;
        }

        .items-panel {
          margin-top: 22px;
          padding: 22px;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.25
            );
          border-radius: 16px;
          background: #0a0d0f;
        }

        .items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .items-header h3 {
          margin: 0;
          color: var(--gold);
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 15px;
        }

        .menu-item {
          overflow: hidden;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.18
            );
          border-radius: 13px;
          background: #0d1012;
        }

        .menu-item img {
          display: block;
          width: 100%;
          height: 210px;
          object-fit: cover;
        }

        .menu-item > div:last-child {
          padding: 15px;
        }

        .menu-item h4 {
          margin: 0 0 8px;
          color: var(--gold);
        }

        .menu-item p {
          color: var(--muted);
          line-height: 1.6;
        }

        .price {
          color: #fff;
          font-weight: 700;
        }

        .booking-section {
          background: #060809;
        }

        .booking-grid {
          display: grid;
          grid-template-columns:
            1fr
            0.8fr;
          gap: 20px;
        }

        .form-grid {
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
          grid-column: 1 / -1;
        }

        .field label {
          color: var(--gold-light);
          font-size: 13px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.22
            );
          border-radius: 10px;
          background: #080b0d;
          color: #fff;
          padding: 11px 12px;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color:
            var(--gold);
        }

        .field textarea {
          min-height: 110px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .booking-message {
          margin-top: 15px;
          padding: 12px;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.3
            );
          border-radius: 10px;
          color: var(--gold-light);
        }

        .gallery-review {
          display: grid;
          grid-template-columns:
            1.2fr
            0.8fr;
          gap: 20px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 10px;
        }

        .gallery-grid img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.18
            );
        }

        .review-list {
          display: grid;
          gap: 12px;
        }

        .review {
          padding: 15px;
          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
          border-radius: 12px;
          background: rgba(
            255,
            255,
            255,
            0.02
          );
        }

        .review strong {
          display: block;
          color: #fff;
          margin-bottom: 6px;
        }

        .stars {
          color: var(--gold);
          letter-spacing: 2px;
          margin-bottom: 7px;
        }

        .review p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 18px;
        }

        .contact-box h3 {
          margin-top: 0;
          color: var(--gold);
        }

        .contact-line {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 13px 0;
          color: #ddd;
          line-height: 1.6;
        }

        .contact-line svg {
          flex: 0 0 auto;
          color: var(--gold);
          margin-top: 2px;
        }

        .social-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .social-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(
              242,
              189,
              69,
              0.35
            );
          border-radius: 50%;
          color: var(--gold);
          background: rgba(
            242,
            189,
            69,
            0.04
          );
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .social-icon:hover {
          transform: translateY(
            -2px
          );
          background: rgba(
            242,
            189,
            69,
            0.12
          );
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 25px 4vw;
          border-top: 1px solid
            var(--line);
          color: var(--muted);
          font-size: 12px;
        }

        .floating-book {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 80;
        }

        .floating-book button {
          border: 1px solid
            var(--gold);
          border-radius: 999px;
          padding: 12px 18px;
          color: #171108;
          background: var(--gold);
          font-weight: 700;
          box-shadow:
            0 15px 35px
              rgba(0, 0, 0, 0.4);
        }

        .modal-bg {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(
            0,
            0,
            0,
            0.75
          );
          backdrop-filter: blur(
            8px
          );
        }

        .modal {
          width: min(
            620px,
            100%
          );
          max-height: 90vh;
          overflow: auto;
          background: #080b0d;
          border: 1px solid
            var(--gold);
          border-radius: 15px;
          box-shadow:
            0 30px 100px
              rgba(0, 0, 0, 0.7);
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          border-bottom: 1px solid
            rgba(
              242,
              189,
              69,
              0.25
            );
        }

        .modal-head h3 {
          margin: 0;
          color: var(--gold);
        }

        .modal-close {
          border: 0;
          background: transparent;
          color: #fff;
        }

        .modal-body {
          padding: 20px;
        }

        .code-display {
          text-align: center;
          margin: 20px 0;
          color: var(--gold);
          font-size: 28px;
          letter-spacing: 2px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 20px 0;
        }

        .detail {
          padding: 10px;
          border-bottom: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .detail small {
          display: block;
          color: #888;
          margin-bottom: 4px;
        }

        .detail strong {
          word-break: break-word;
        }

        .small-note {
          color: #8e8a82;
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 1050px) {
          .category-grid {
            grid-template-columns: repeat(
              4,
              1fr
            );
          }

          .about-grid {
            grid-template-columns:
              1fr
              1fr;
          }

          .info-box {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 800px) {
          .nav {
            display: none;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            padding: 20px;
            flex-direction: column;
            background: #050607;
            border-bottom: 1px solid
              var(--line);
          }

          .nav.open {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }

          .topbar {
            padding: 9px 15px;
          }

          .brand {
            min-width: auto;
          }

          .pill {
            display: none;
          }

          .features {
            grid-template-columns: 1fr 1fr;
          }

          .about-grid,
          .booking-grid,
          .gallery-review,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .item-grid {
            grid-template-columns: 1fr 1fr;
          }

          .breaking-news {
            left: 12px;
            top: 12px;
            width: 230px;
          }
        }

        @media (max-width: 560px) {
          .brand-name {
            font-size: 15px;
            letter-spacing: 2px;
          }

          .brand-sub {
            font-size: 7px;
          }

          .brand-mark {
            width: 40px;
            height: 40px;
          }

          .category-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .item-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .hero {
            min-height: 610px;
          }

          .hero h1 {
            font-size: 43px;
          }

          .hero-description {
            font-size: 15px;
          }

          .hero-contact {
            display: none;
          }

          .footer {
            flex-direction: column;
            text-align: center;
          }

          .breaking-news {
            width: 210px;
          }

          .breaking-media {
            height: 125px;
          }

          .gallery-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
                                    }
                            />
                          </div>
                        )}

                        <div className="menu-item-content">
                          <h4>
                            {item.name ||
                              item.title ||
                              "Menu Item"}
                          </h4>

                          {item.price !==
                            undefined &&
                            item.price !== "" && (
                              <div className="price">
                                {item.price}{" "}
                                {settings.currency ||
                                  "€"}
                              </div>
                            )}

                          {item.description && (
                            <p className="description">
                              {
                                item.description
                              }
                            </p>
                          )}
                        </div>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <div className="empty-box">
                  No items have been
                  added to this category
                  yet.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= BOOKING ================= */}

      <section
        id="booking"
        className="section"
      >
        <div className="section-title">
          <div className="eyebrow">
            Reservations
          </div>

          <h2>
            Book a Table
          </h2>

          <p>
            New booking করুন। আগে
            booking থাকলে My Booking
            দিয়ে দেখতে, edit করতে বা
            cancel করতে পারবেন।
          </p>
        </div>

        <div className="booking-grid">
          <form
            className="box booking-box"
            onSubmit={
              submitBooking
            }
          >
            <h3>
              Book Your Table
            </h3>

            <p>
              Booking confirm হলে
              একটি unique booking code
              তৈরি হবে।
            </p>

            <div className="form-grid">
              <div className="field">
                <label>
                  Name *
                </label>

                <input
                  value={
                    booking.name
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      name:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="field">
                <label>
                  Phone
                </label>

                <input
                  value={
                    booking.phone
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      phone:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Phone number"
                />
              </div>

              <div className="field">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    booking.email
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      email:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Email address"
                />
              </div>

              <div className="field">
                <label>
                  Date *
                </label>

                <input
                  type="date"
                  value={
                    booking.date
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      date:
                        event.target
                          .value,
                    })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>
                  Time *
                </label>

                <input
                  type="time"
                  value={
                    booking.time
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      time:
                        event.target
                          .value,
                    })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>
                  Persons
                </label>

                <select
                  value={
                    booking.guests
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      guests:
                        event.target
                          .value,
                    })
                  }
                >
                  {Array.from(
                    {
                      length: 12,
                    },
                    (_, index) =>
                      index + 1,
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

              <div className="field">
                <label>
                  Category
                </label>

                <select
                  value={
                    booking.category
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      category:
                        event.target
                          .value,
                      item: "",
                    })
                  }
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (
                      category,
                      index,
                    ) => (
                      <option
                        key={`${category}-${index}`}
                        value={
                          category
                        }
                      >
                        {category}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="field">
                <label>
                  Food / Item
                </label>

                <select
                  value={
                    booking.item
                  }
                  disabled={
                    !booking.category
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      item:
                        event.target
                          .value,
                    })
                  }
                >
                  <option value="">
                    Select item
                  </option>

                  {bookingItems.map(
                    (
                      item,
                      index,
                    ) => (
                      <option
                        key={`${
                          item.id ||
                          item.name ||
                          "food"
                        }-${index}`}
                        value={
                          item.name ||
                          item.title ||
                          ""
                        }
                      >
                        {item.name ||
                          item.title}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="field full">
                <label>
                  Special Request
                </label>

                <textarea
                  value={
                    booking.note
                  }
                  onChange={(event) =>
                    setBooking({
                      ...booking,
                      note:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Write your request"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="gold-btn"
                type="submit"
              >
                <Icon
                  name="check"
                  size={17}
                />
                Confirm Booking
              </button>

              <button
                className="outline-btn"
                type="button"
                onClick={() =>
                  setBooking({
                    name: "",
                    phone: "",
                    email: "",
                    date: "",
                    time: "",
                    guests: "2",
                    category: "",
                    item: "",
                    note: "",
                  })
                }
              >
                Cancel
              </button>
            </div>

            {bookingMessage && (
              <div className="message">
                {bookingMessage}
              </div>
            )}
          </form>

          <div className="box booking-box">
            <h3>
              My Booking
            </h3>

            <p>
              আগে booking করেছেন?
              একই phone/email দিয়ে
              আপনার booking খুঁজে
              বের করুন।
            </p>

            <button
              className="gold-btn"
              onClick={() => {
                setMyBookingOpen(
                  true,
                );
                setLookupStep(
                  "login",
                );
                setLookupMessage(
                  "",
                );
              }}
            >
              <Icon
                name="user"
                size={18}
              />
              My Booking
            </button>

            <p
              className="small-note"
              style={{
                marginTop: 20,
              }}
            >
              Phone অথবা Email →
              Booking Code →
              Booking Details →
              Edit / Cancel
            </p>
          </div>
        </div>
      </section>

      {/* ================= GALLERY + REVIEWS ================= */}

      <section className="section">
        <div className="gallery-review">

          <div
            id="gallery"
            className="box gallery-box"
          >
            <div className="section-title">
              <div className="eyebrow">
                Gallery
              </div>

              <h2>
                Our Gallery
              </h2>

              <p>
                Admin → Gallery থেকে
                image যোগ করলেই এখানে
                দেখাবে।
              </p>
            </div>

            {gallery.length > 0 ? (
              <>
                <div className="gallery-grid">
                  {gallery
                    .slice(0, 6)
                    .map(
                      (
                        item,
                        index,
                      ) => (
                        <img
                          key={`${
                            item.id ||
                            item.image
                          }-${index}`}
                          src={
                            item.image
                          }
                          alt={
                            item.title ||
                            "Gallery"
                          }
                        />
                      ),
                    )}
                </div>

                <button
                  className="outline-btn"
                  style={{
                    marginTop: 15,
                  }}
                  onClick={() =>
                    setGalleryOpen(
                      true,
                    )
                  }
                >
                  <Icon
                    name="gallery"
                    size={17}
                  />
                  View Gallery
                </button>
              </>
            ) : (
              <div className="empty-box">
                <div>
                  <Icon
                    name="gallery"
                    size={42}
                  />
                  <p>
                    No images yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ================= REVIEWS ================= */}

          <div
            id="reviews"
            className="box review-box"
          >
            <div className="section-title">
              <div className="eyebrow">
                Reviews
              </div>

              <h2>
                What Customers Say
              </h2>

              <p>
                Admin → Reviews থেকে
                যোগ করা customer reviews
                এখানে দেখাবে।
              </p>
            </div>

            {reviews.length > 0 ? (
              <div className="review-list">
                {reviews
                  .slice(0, 8)
                  .map(
                    (
                      review,
                      index,
                    ) => (
                      <div
                        className="review"
                        key={`${
                          review.id ||
                          review.customerName ||
                          "review"
                        }-${index}`}
                      >
                        <strong>
                          {review.customerName ||
                            review.name ||
                            "Customer"}
                        </strong>

                        <div className="stars">
                          {Array.from(
                            {
                              length: Math.min(
                                5,
                                Math.max(
                                  0,
                                  Number(
                                    review.rating,
                                  ) ||
                                    0,
                                ),
                              ),
                            },
                            (_, star) => (
                              <span
                                key={star}
                              >
                                ★
                              </span>
                            ),
                          )}
                        </div>

                        <p>
                          {review.review ||
                            review.text ||
                            ""}
                        </p>
                      </div>
                    ),
                  )}
              </div>
            ) : (
              <div className="empty-box">
                <div>
                  <div className="stars">
                    ★★★★★
                  </div>

                  <p>
                    No reviews added yet.
                  </p>

                  <p className="small-note">
                    Admin → Reviews থেকে
                    customer review যোগ
                    করুন।
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================= CONTACT + SOCIAL MEDIA ================= */}

      <section
        id="contact"
        className="section"
      >
        <div className="section-title">
          <div className="eyebrow">
            Contact
          </div>

          <h2>
            Find & Contact Us
          </h2>

          <p>
            আপনার restaurant-এর
            phone number, address এবং
            social media এখানে
            দেখাবে।
          </p>
        </div>

        <div className="contact-grid">

          {/* ADDRESS */}

          <div className="box contact-box">
            <h3>
              Find Us
            </h3>

            <div className="contact-line">
              <Icon
                name="pin"
                size={20}
              />

              <span>
                {address}
              </span>
            </div>

            {mapUrl ? (
              <a
                className="outline-btn"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon
                  name="map"
                  size={17}
                />
                Open Google Maps
              </a>
            ) : (
              <span className="small-note">
                Google Maps link Admin →
                Contact থেকে যোগ করুন।
              </span>
            )}
          </div>

          {/* PHONE / EMAIL */}

          <div className="box contact-box">
            <h3>
              Contact Us
            </h3>

            {phone && (
              <div className="contact-line">
                <Icon
                  name="phone"
                  size={20}
                />

                <a
                  href={`tel:${phone}`}
                >
                  {phone}
                </a>
              </div>
            )}

            {email && (
              <div className="contact-line">
                <Icon
                  name="mail"
                  size={20}
                />

                <a
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              </div>
            )}

            {whatsapp && (
              <div className="contact-line">
                <button
                  style={{
                    background:
                      "transparent",
                    border: 0,
                    padding: 0,
                    color: "#fff",
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 10,
                  }}
                  onClick={
                    openWhatsApp
                  }
                >
                  <Icon
                    name="phone"
                    size={20}
                  />

                  WhatsApp
                </button>
              </div>
            )}

            {!phone &&
              !email &&
              !whatsapp && (
                <p className="small-note">
                  Phone, Email এবং
                  WhatsApp Admin →
                  Contact থেকে যোগ করুন।
                </p>
              )}
          </div>

          {/* SOCIAL MEDIA */}

          <div
            id="social-media"
            className="box contact-box"
          >
            <h3>
              Follow Us
            </h3>

            <p className="small-note">
              আমাদের Social Media-তে
              follow করুন।
            </p>

            {social.visible !==
            false ? (
              socialLinks.length >
              0 ? (
                <div className="social-row">
                  {socialLinks.map(
                    (item) => (
                      <a
                        key={item.name}
                        className="social-icon"
                        href={
                          item.url
                        }
                        target="_blank"
                        rel="noreferrer"
                        title={
                          item.name
                        }
                      >
                        <Icon
                          name={
                            item.name
                          }
                          size={22}
                        />
                      </a>
                    ),
                  )}
                </div>
              ) : (
                <p className="small-note">
                  Facebook,
                  Instagram, TikTok
                  এবং YouTube link
                  Admin → Social Media
                  থেকে যোগ করুন।
                </p>
              )
            ) : (
              <p className="small-note">
                Social Media বর্তমানে
                hidden করা আছে।
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <span>
          © 2026 {restaurantName}.
          All rights reserved.
        </span>

        <span>
          Good Food • Good Mood
        </span>
      </footer>

      {/* ================= FLOATING BOOKING ================= */}

      <div className="floating-book">
        <button
          onClick={() =>
            scrollTo("booking")
          }
        >
          Table Booking
        </button>
      </div>

      {/* ================= MY BOOKING MODAL ================= */}

      {myBookingOpen && (
        <div
          className="modal-bg"
          onMouseDown={() =>
            setMyBookingOpen(false)
          }
        >
          <div
            className="modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-head">
              <h3>
                My Booking
              </h3>

              <button
                className="modal-close"
                onClick={() =>
                  setMyBookingOpen(
                    false,
                  )
                }
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-body">

              {/* STEP 1 */}

              {lookupStep ===
                "login" && (
                <>
                  <p className="small-note">
                    যে phone number
                    অথবা email দিয়ে
                    booking করেছিলেন
                    সেটি দিন।
                  </p>

                  <div className="field">
                    <label>
                      Phone / Email
                    </label>

                    <input
                      value={
                        lookupValue
                      }
                      onChange={(event) =>
                        setLookupValue(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Phone number or email"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      className="gold-btn"
                      onClick={
                        findMyBooking
                      }
                    >
                      Continue
                      <Icon
                        name="arrow"
                        size={17}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2 */}

              {lookupStep ===
                "code" &&
                foundBooking && (
                <>
                  <p className="small-note">
                    আপনার booking
                    পাওয়া গেছে। এখন
                    আপনার booking
                    code দিন।
                  </p>

                  <div className="code-display">
                    {foundBooking.code}
                  </div>

                  <div className="field">
                    <label>
                      Booking Code
                    </label>

                    <input
                      value={
                        lookupCode
                      }
                      onChange={(event) =>
                        setLookupCode(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Enter booking code"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      className="gold-btn"
                      onClick={
                        verifyCode
                      }
                    >
                      Verify Code
                    </button>

                    <button
                      className="outline-btn"
                      onClick={() => {
                        setLookupStep(
                          "login",
                        );
                        setFoundBooking(
                          null,
                        );
                      }}
                    >
                      Back
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 */}

              {lookupStep ===
                "details" &&
                foundBooking && (
                <>
                  <div className="details-grid">

                    <div className="detail">
                      <small>
                        Name
                      </small>

                      <strong>
                        {
                          foundBooking.name
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Status
                      </small>

                      <strong>
                        {
                          foundBooking.status
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Date
                      </small>

                      <strong>
                        {
                          foundBooking.date
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Time
                      </small>

                      <strong>
                        {
                          foundBooking.time
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Persons
                      </small>

                      <strong>
                        {
                          foundBooking.guests
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Category
                      </small>

                      <strong>
                        {
                          foundBooking.category ||
                          "—"
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Item
                      </small>

                      <strong>
                        {
                          foundBooking.item ||
                          "—"
                        }
                      </strong>
                    </div>

                    <div className="detail">
                      <small>
                        Booking Code
                      </small>

                      <strong>
                        {
                          foundBooking.code
                        }
                      </strong>
                    </div>

                  </div>

                  {editingBooking ? (
                    <form
                      onSubmit={
                        updateMyBooking
                      }
                    >
                      <div className="form-grid">

                        <div className="field">
                          <label>
                            Name
                          </label>

                          <input
                            value={
                              foundBooking.name
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  name:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="field">
                          <label>
                            Phone
                          </label>

                          <input
                            value={
                              foundBooking.phone ||
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  phone:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="field">
                          <label>
                            Email
                          </label>

                          <input
                            value={
                              foundBooking.email ||
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  email:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="field">
                          <label>
                            Date
                          </label>

                          <input
                            type="date"
                            value={
                              foundBooking.date
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  date:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="field">
                          <label>
                            Time
                          </label>

                          <input
                            type="time"
                            value={
                              foundBooking.time
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  time:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="field">
                          <label>
                            Persons
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={
                              foundBooking.guests
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  guests:
                                    Number(
                                      event
                                        .target
                                        .value,
                                    ) || 1,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="field full">
                          <label>
                            Special Request
                          </label>

                          <textarea
                            value={
                              foundBooking.note
                            }
                            onChange={(
                              event,
                            ) =>
                              setFoundBooking(
                                {
                                  ...foundBooking,
                                  note:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />
                        </div>

                      </div>

                      <div className="form-actions">
                        <button
                          className="gold-btn"
                          type="submit"
                        >
                          Save Changes
                        </button>

                        <button
                          className="outline-btn"
                          type="button"
                          onClick={() =>
                            setEditingBooking(
                              false,
                            )
                          }
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="form-actions">

                      <button
                        className="gold-btn"
                        onClick={() =>
                          setEditingBooking(
                            true,
                          )
                        }
                      >
                        <Icon
                          name="edit"
                          size={17}
                        />

                        Edit
                      </button>

                      <button
                        className="outline-btn"
                        style={{
                          borderColor:
                            "#e74b4b",
                          color:
                            "#ff8d8d",
                        }}
                        disabled={
                          foundBooking.status ===
                          "Cancelled"
                        }
                        onClick={
                          cancelMyBooking
                        }
                      >
                        <Icon
                          name="trash"
                          size={17}
                        />

                        Cancel Booking
                      </button>

                    </div>
                  )}

                </>
              )}

              {lookupMessage && (
                <div className="message">
                  {lookupMessage}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ================= GALLERY MODAL ================= */}

      {galleryOpen && (
        <div
          className="modal-bg"
          onMouseDown={() =>
            setGalleryOpen(false)
          }
        >
          <div
            className="modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-head">
              <h3>
                Gallery
              </h3>

              <button
                className="modal-close"
                onClick={() =>
                  setGalleryOpen(false)
                }
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-body">
              <div className="gallery-grid">
                {gallery.map(
                  (
                    item,
                    index,
                  ) => (
                    <img
                      key={`gallery-${
                        item.id ||
                        index
                      }`}
                      src={
                        item.image
                      }
                      alt={
                        item.title ||
                        "Gallery"
                      }
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
