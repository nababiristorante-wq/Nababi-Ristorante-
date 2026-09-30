"use client";

import { useState } from "react";

type Language = "it" | "en" | "bn";

type AnyData = Record<string, any>;

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function HomePage() {
  const [home, setHome] = useState<AnyData>({});
  const [about, setAbout] = useState<AnyData>({});
  const [contact, setContact] = useState<AnyData>({});
  const [settings, setSettings] = useState<AnyData>({});
  const [hours, setHours] = useState<AnyData>({});
  const [social, setSocial] = useState<AnyData>({});
  const [news, setNews] = useState<AnyData[]>([]);
  const [promotions, setPromotions] = useState<AnyData[]>([]);
  const [menu, setMenu] = useState<AnyData[]>([]);
  const [gallery, setGallery] = useState<AnyData[]>([]);
  const [reviews, setReviews] = useState<AnyData[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  const loadAllData = () => {
    const now = new Date();

    setHome(readStorage("nababi-home-settings", {}));
    setAbout(readStorage("nababi-about", {}));
    setContact(readStorage("nababi-contact", {}));
    setSettings(readStorage("nababi-settings", {}));
    setHours(readStorage("nababi-opening-hours", {}));
    setSocial(readStorage("nababi-social-media", {}));

    const savedNews = readStorage<AnyData[]>(
      "nababi-breaking-news",
      []
    );

    setNews(
      savedNews.filter((item) => {
        if (!item.visible || !item.text?.trim()) return false;
        if (item.startDate && now < new Date(item.startDate)) return false;
        if (item.endDate && now > new Date(item.endDate)) return false;
        return true;
      })
    );

    const savedPromotions = readStorage<AnyData[]>(
      "nababi-promotions",
      []
    );

    setPromotions(
      savedPromotions.filter((item) => {
        if (item.visible === false) return false;
        if (item.startDate && now < new Date(item.startDate)) return false;
        if (item.endDate && now > new Date(item.endDate)) return false;
        return true;
      })
    );

    const savedMenu = readStorage<AnyData[]>(
      "nababi-menu",
      []
    );

    setMenu(
      savedMenu.filter(
        (item) =>
          item.visible !== false &&
          item.availability !== false
      )
    );

    const savedGallery = readStorage<AnyData[]>(
      "nababi-gallery",
      []
    );

    setGallery(
      savedGallery.filter(
        (item) => item.visible !== false
      )
    );

    const savedReviews = readStorage<AnyData[]>(
      "nababi-reviews",
      []
    );

    setReviews(
      savedReviews.filter(
        (item) => item.visible !== false
      )
    );
  };

  useEffect(() => {
    loadAllData();

    const timer = setInterval(loadAllData, 800);

    window.addEventListener("storage", loadAllData);

    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", loadAllData);
    };
  }, []);

  const restaurantName =
    settings.restaurantName ||
    contact.restaurantName ||
    "Nababi Ristorante";

  const heroTitle =
    home.heroTitle ||
    "A Taste of Tradition.";

  const heroSubtitle =
    home.heroSubtitle ||
    "Authentic flavours, warm hospitality and unforgettable moments in Rome.";

  const welcomeText =
    home.welcomeText ||
    "Welcome to Nababi Ristorante";

  const aboutText =
    about.content ||
    about.text ||
    "We bring together authentic flavours, carefully selected ingredients and warm Italian hospitality.";

  const heroImage =
    home.heroImage ||
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2200&q=90";

  const aboutImage =
    about.image ||
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=90";

  const bookingTitle =
    home.bookingTitle ||
    "Reserve Your Table";

  const bookingText =
    home.bookingText ||
    "Choose your preferred date and time and enjoy a beautiful dining experience.";

  const address =
    contact.address || "Rome, Italy";

  const phone =
    contact.phone || "";

  const email =
    contact.email || "";

  const whatsapp =
    contact.whatsapp || "";

  const mapsUrl =
    contact.googleMapsUrl || "#";

  const visibleSocial =
    social.visible !== false;

  const categories = Array.from(
    new Set(
      menu
        .map((item) => item.category)
        .filter(Boolean)
    )
  );

  const fallbackMenu = [
    {
      id: "fallback-1",
      name: "Signature Biryani",
      description:
        "Fragrant basmati rice with aromatic spices.",
      price: "16",
      category: "Biryani",
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1000&q=90",
    },
    {
      id: "fallback-2",
      name: "Tandoori Chicken",
      description:
        "Tender chicken prepared with authentic spices.",
      price: "15",
      category: "Chicken",
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=90",
    },
    {
      id: "fallback-3",
      name: "Royal Mutton Curry",
      description:
        "Slow-cooked mutton in a rich house gravy.",
      price: "18",
      category: "Mutton",
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=90",
    },
    {
      id: "fallback-4",
      name: "Fresh Garden Salad",
      description:
        "Fresh seasonal vegetables with house dressing.",
      price: "9",
      category: "Starters",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=90",
    },
  ];

  const displayedMenu =
    menu.length > 0 ? menu : fallbackMenu;

  const galleryImages =
    gallery.length > 0
      ? gallery
          .map((item) => item.image)
          .filter(Boolean)
      : [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90",
          "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90",
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=90",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=90",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90",
        ];

  const scrollTo = (id: string) => {
    setMobileOpen(false);

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const handleReservation = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const reservation = {
      id: Date.now().toString(),
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      date: String(form.get("date") || ""),
      time: String(form.get("time") || ""),
      guests: String(form.get("guests") || ""),
      message: String(form.get("message") || ""),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const oldReservations =
      readStorage<AnyData[]>(
        "nababi-reservations",
        []
      );

    localStorage.setItem(
      "nababi-reservations",
      JSON.stringify([
        reservation,
        ...oldReservations,
      ])
    );

    setBookingSent(true);

    e.currentTarget.reset();

    setTimeout(() => {
      setBookingSent(false);
    }, 5000);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090806] text-[#f5eadb]">

      {/* ================= BREAKING NEWS ================= */}
      {news.length > 0 && (
        <div className="fixed left-0 right-0 top-0 z-[100] overflow-hidden border-b border-[#d5a85b]/30 bg-[#090806]/95 backdrop-blur-xl">
          <div className="flex h-9 items-center">
            <div className="shrink-0 bg-[#c9923e] px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-black">
              Breaking
            </div>

            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-flex min-w-max animate-[nababiMarquee_30s_linear_infinite] gap-16 px-8">
                {[...news, ...news].map(
                  (item, index) => (
                    <span
                      key={`${item.id}-${index}`}
                      className="text-xs text-[#ead8bd]"
                    >
                      {item.text}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
      <header
        className={`fixed left-0 right-0 z-[90] border-b border-white/10 bg-[#090806]/70 backdrop-blur-2xl ${
          news.length > 0 ? "top-9" : "top-0"
        }`}
      >
        <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">

          <button
            onClick={() => scrollTo("home")}
            className="group text-left"
          >
            <div className="font-serif text-xl font-black tracking-wide text-[#d9aa5c] sm:text-2xl">
              {restaurantName}
            </div>

            <div className="mt-1 text-[8px] uppercase tracking-[0.4em] text-[#aa9276]">
              Ristorante • Roma
            </div>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {[
              ["Home", "home"],
              ["About", "about"],
              ["Menu", "menu"],
              ["Gallery", "gallery"],
              ["Reviews", "reviews"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d6c6b3] transition hover:text-[#d8a75b]"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("reservation")}
              className="hidden rounded-full border border-[#d2a052] bg-[#d2a052] px-6 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-[0_10px_40px_rgba(210,160,82,.18)] transition hover:bg-[#edc477] sm:block"
            >
              Reserve Table
            </button>

            <button
              onClick={() =>
                setMobileOpen(!mobileOpen)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg lg:hidden"
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#0b0907]/98 px-6 py-6 lg:hidden">
            <div className="flex flex-col">
              {[
                ["Home", "home"],
                ["About", "about"],
                ["Menu", "menu"],
                ["Gallery", "gallery"],
                ["Reviews", "reviews"],
                ["Contact", "contact"],
                ["Reserve Table", "reservation"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="border-b border-white/10 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-[#dbcbb9]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${heroImage}")`,
          }}
        />

        <div className="absolute inset-0 bg-[#050403]/60" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050403]/95 via-[#050403]/55 to-[#050403]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090806] via-transparent to-[#090806]/30" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-6 pb-20 pt-32 sm:px-10 lg:px-16">

          <div className="max-w-4xl">

            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-14 bg-[#d7a653]" />

              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-[#d8ae6b]">
                {welcomeText}
              </span>
            </div>

            <h1 className="max-w-5xl font-serif text-6xl font-black leading-[0.9] tracking-[-0.03em] text-[#f8eee2] sm:text-8xl lg:text-[110px]">
              {heroTitle}
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#e0d2c2] sm:text-lg">
              {heroSubtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  scrollTo("reservation")
                }
                className="rounded-full bg-[#d3a253] px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_15px_50px_rgba(211,162,83,.2)] transition hover:bg-[#edc477]"
              >
                Reserve Your Table
              </button>

              <button
                onClick={() => scrollTo("menu")}
                className="rounded-full border border-white/25 bg-white/5 px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl transition hover:border-[#d3a253] hover:text-[#e0b467]"
              >
                Explore Menu
              </button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 text-[10px] uppercase tracking-[0.2em] text-[#ad9a84]">
              <span>Fine Dining</span>
              <span>•</span>
              <span>Authentic Flavours</span>
              <span>•</span>
              <span>Roma</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[8px] uppercase tracking-[0.3em] text-[#a9947c] sm:flex">
          <span>Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-[#d5a45c] to-transparent" />
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      {about.visible !== false && (
        <section
          id="about"
          className="relative overflow-hidden bg-[#0d0b09] px-6 py-24 sm:py-32 lg:py-40"
        >
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#bd873c]/10 blur-[120px]" />

          <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-2 lg:gap-24">

            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-[#c79a54]/20" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
                <img
                  src={aboutImage}
                  alt={restaurantName}
                  className="h-[520px] w-full object-cover transition duration-1000 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-7 left-7 rounded-2xl border border-white/15 bg-black/55 px-6 py-5 backdrop-blur-xl">
                <div className="font-serif text-2xl font-black text-[#e2b36a]">
                  {restaurantName}
                </div>
                <div className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#b8a28a]">
                  Since • Roma
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#d3a253]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d3a253]">
                  Our Story
                </span>
              </div>

              <h2 className="mt-6 font-serif text-5xl font-black leading-[1] text-[#f4e9dc] sm:text-6xl">
                {about.title ||
                  "Where every plate tells a story."}
              </h2>

              <p className="mt-8 whitespace-pre-line text-base leading-8 text-[#bcae9e]">
                {aboutText}
              </p>

              <div className="mt-10 h-px w-24 bg-[#d3a253]" />
            </div>
          </div>
        </section>
      )}

      {/* ================= MENU ================= */}
      <section
        id="menu"
        className="relative overflow-hidden bg-[#080706] px-6 py-24 sm:py-32 lg:py-40"
      >
        <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-[#8f5724]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-[1400px]">

          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#d3a253]" />

              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d3a253]">
                From Our Kitchen
              </span>
            </div>

            <h2 className="mt-5 font-serif text-5xl font-black leading-none text-[#f7eadc] sm:text-7xl">
              A menu made
              <br />
              for memories.
            </h2>
          </div>

          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-[#d3a253]/30 bg-[#d3a253]/5 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9b06b]"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {displayedMenu
              .slice(0, 8)
              .map((item, index) => (
                <article
                  key={item.id || index}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#12100d] shadow-2xl transition duration-500 hover:-translate-y-2 hover:border-[#c99951]/50"
                >
                  <div className="relative h-72 overflow-hidden">

                    <img
                      src={
                        item.image ||
                        fallbackMenu[
                          index %
                            fallbackMenu.length
                        ].image
                      }
                      alt={
                        item.name ||
                        "Menu item"
                      }
                      className="h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full border border-[#e0b56c]/30 bg-black/50 px-3 py-1 text-[8px] font-black uppercase tracking-[0.15em] text-[#e2b36a] backdrop-blur-md">
                        {item.category ||
                          "Chef Choice"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl font-black text-[#f2e6d8]">
                        {item.name ||
                          "Special Dish"}
                      </h3>

                      <span className="shrink-0 text-base font-black text-[#d7a653]">
                        {settings.currency ===
                          "EUR" ||
                        !settings.currency
                          ? "€"
                          : settings.currency}
                        {item.price}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#a99a8a]">
                      {item.description || ""}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* ================= PROMOTIONS ================= */}
      {promotions.length > 0 && (
        <section className="relative bg-[#100d0a] px-6 py-24 sm:py-32">

          <div className="mx-auto max-w-[1400px]">

            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d3a253]">
                Limited Experiences
              </span>

              <h2 className="mt-4 font-serif text-5xl font-black text-[#f4e8da] sm:text-6xl">
                Special Offers
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {promotions
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#18130f]"
                  >
                    {item.image && (
                      <div className="h-60 overflow-hidden">
                        <img
                          src={item.image}
                          alt={
                            item.title ||
                            "Promotion"
                          }
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-7">
                      <h3 className="font-serif text-2xl font-black text-[#f5e8d9]">
                        {item.title}
                      </h3>

                      {item.offer && (
                        <div className="mt-3 text-lg font-black text-[#d7a653]">
                          {item.offer}
                        </div>
                      )}

                      <p className="mt-3 text-sm leading-7 text-[#a99a89]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= GALLERY ================= */}
      <section
        id="gallery"
        className="relative bg-[#090806] px-6 py-24 sm:py-32 lg:py-40"
      >
        <div className="mx-auto max-w-[1500px]">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d3a253]">
                Visual Journey
              </span>

              <h2 className="mt-4 font-serif text-5xl font-black text-[#f4e8da] sm:text-7xl">
                Inside {restaurantName}
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#9f9182]">
              A glimpse into the atmosphere,
              flavours and moments waiting for
              you in Rome.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">

            {galleryImages
              .slice(0, 6)
              .map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`group relative overflow-hidden rounded-[1.3rem] ${
                    index === 0
                      ? "sm:col-span-2 sm:row-span-2"
                      : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${restaurantName} gallery`}
                    className={`w-full object-cover transition duration-1000 group-hover:scale-110 ${
                      index === 0
                        ? "h-[520px]"
                        : "h-64 sm:h-72"
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />

                  <div className="absolute bottom-5 left-5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/80">
                    Nababi • Roma
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ================= RESERVATION ================= */}
      <section
        id="reservation"
        className="relative overflow-hidden bg-[#0d0a08] px-6 py-24 sm:py-32 lg:py-40"
      >
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#b77b32]/10 blur-[150px]" />

        <div className="relative mx-auto grid max-w-[1400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#15110d] shadow-[0_30px_100px_rgba(0,0,0,.4)] lg:grid-cols-2">

          <div
            className="min-h-[500px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=90')",
            }}
          >
            <div className="flex h-full min-h-[500px] items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 sm:p-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d9aa5c]">
                  Your Evening
                </span>

                <h3 className="mt-4 max-w-lg font-serif text-4xl font-black leading-tight text-white sm:text-5xl">
                  Good food.
                  <br />
                  Good company.
                  <br />
                  Beautiful memories.
                </h3>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-14">

            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d3a253]">
              Reservations
            </span>

            <h2 className="mt-4 font-serif text-4xl font-black text-[#f3e7d8] sm:text-5xl">
              {bookingTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#a99a89]">
              {bookingText}
            </p>

            {bookingSent && (
              <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-300">
                ✓ Reservation request sent successfully.
              </div>
            )}

            <form
              onSubmit={handleReservation}
              className="mt-7 space-y-4"
            >
              <input
                name="name"
                required
                placeholder="Your Name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-[#857667] focus:border-[#d3a253]"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-[#857667] focus:border-[#d3a253]"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-[#857667] focus:border-[#d3a253]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d3a253]"
                />

                <input
                  name="time"
                  type="time"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d3a253]"
                />
              </div>

              <select
                name="guests"
                required
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-[#15110d] px-4 py-4 text-sm text-white outline-none focus:border-[#d3a253]"
              >
                <option value="" disabled>
                  Number of Guests
                </option>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5 Guests</option>
                <option>6 Guests</option>
                <option>7+ Guests</option>
              </select>

              <textarea
                name="message"
                rows={3}
                placeholder="Special request"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-[#857667] focus:border-[#d3a253]"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[#d3a253] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-black shadow-lg transition hover:bg-[#edc477]"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      {reviews.length > 0 && (
        <section
          id="reviews"
          className="bg-[#0a0807] px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1300px] text-center">

            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#d3a253]">
              Guest Reviews
            </span>

            <h2 className="mt-4 font-serif text-5xl font-black text-[#f3e7d8] sm:text-6xl">
              Loved by Our Guests
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {reviews
                .slice(0, 3)
                .map((review) => (
                  <div
                    key={review.id}
                    className="rounded-[1.5rem] border border-white/10 bg-[#12100d] p-7 text-left transition hover:border-[#d3a253]/30"
                  >
                    <div className="text-lg tracking-widest text-[#d3a253]">
                      {"★".repeat(
                        Math.min(
                          Number(review.rating) || 5,
                          5
                        )
                      )}
                    </div>

                    <p className="mt-5 text-sm leading-7 text-[#b1a292]">
                      “{review.review}”
                    </p>

                    <div className="mt-6 border-t border-white/10 pt-5 font-serif font-black text-[#e7d8c7]">
                      {review.customerName}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTACT ================= */}
      {contact.visible !== false && (
        <section
          id="contact"
          className="relative overflow-hidden border-t border-white/10 bg-[#080706] px-6 py-24 text-white sm:py-32"
        >
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#c08338]/10 blur-[140px]" />

          <div className="relative mx-auto max-w-[1400px]">

            <div className="grid gap-14 md:grid-cols-3">

              <div>
                <div className="font-serif text-3xl font-black text-[#d9aa5c]">
                  {restaurantName}
                </div>

                <p className="mt-6 max-w-sm text-sm leading-8 text-[#a99a8a]">
                  {contact.contactText ||
                    "A beautiful dining experience with authentic flavours and warm hospitality."}
                </p>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d3a253]">
                  Contact
                </h3>

                <div className="mt-6 space-y-4 text-sm text-[#b9aa99]">

                  {address && (
                    <div>📍 {address}</div>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="block transition hover:text-[#d3a253]"
                    >
                      📞 {phone}
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="block transition hover:text-[#d3a253]"
                    >
                      ✉️ {email}
                    </a>
                  )}
                </div>

                {mapsUrl !== "#" && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block rounded-full border border-[#d3a253]/40 px-5 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-[#d3a253] transition hover:bg-[#d3a253] hover:text-black"
                  >
                    Open Google Maps
                  </a>
                )}
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d3a253]">
                  Opening Hours
                </h3>

                <div className="mt-6 text-sm leading-8 text-[#b9aa99]">
                  {hours?.monday ? (
                    <>
                      Monday:{" "}
                      {hours.monday.open
                        ? `${hours.monday.opening || ""} - ${hours.monday.closing || ""}`
                        : "Closed"}
                    </>
                  ) : (
                    <>
                      Monday – Sunday
                      <br />
                      Please contact us for current hours.
                    </>
                  )}
                </div>

                {visibleSocial && (
                  <div className="mt-6 flex flex-wrap gap-2">

                    {social.facebook && (
                      <a
                        href={social.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[9px] uppercase tracking-wider text-[#c5b5a3] transition hover:border-[#d3a253]/40 hover:text-[#d3a253]"
                      >
                        Facebook
                      </a>
                    )}

                    {social.instagram && (
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[9px] uppercase tracking-wider text-[#c5b5a3] transition hover:border-[#d3a253]/40 hover:text-[#d3a253]"
                      >
                        Instagram
                      </a>
                    )}

                    {social.tiktok && (
                      <a
                        href={social.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[9px] uppercase tracking-wider text-[#c5b5a3] transition hover:border-[#d3a253]/40 hover:text-[#d3a253]"
                      >
                        TikTok
                      </a>
                    )}

                    {social.youtube && (
                      <a
                        href={social.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[9px] uppercase tracking-wider text-[#c5b5a3] transition hover:border-[#d3a253]/40 hover:text-[#d3a253]"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                )}

                {whatsapp && (
                  <a
                    href={
                      whatsapp.startsWith("http")
                        ? whatsapp
                        : `https://wa.me/${whatsapp.replace(
                            /\D/g,
                            ""
                          )}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block rounded-full bg-[#258b55] px-5 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-white"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="mt-16 border-t border-white/10 pt-7 text-center text-[9px] uppercase tracking-[0.2em] text-[#706458]">
              © {new Date().getFullYear()}{" "}
              {restaurantName}. All rights reserved.
            </div>
          </div>
        </section>
      )}

      {/* ================= MOBILE BOOKING ================= */}
      <button
        onClick={() => scrollTo("reservation")}
        className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-[#e1b467] bg-[#d3a253] px-7 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_40px_rgba(0,0,0,.5)] sm:hidden"
      >
        Reserve Table
      </button>

      {/* ================= GLOBAL STYLE ================= */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #090806;
        }

        ::selection {
          background: #d3a253;
          color: #090806;
        }

        @keyframes nababiMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  );
}
