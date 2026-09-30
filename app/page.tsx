"use client";

import { FormEvent, useEffect, useState } from "react";

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
  const [languages, setLanguages] = useState<AnyData>({});
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
    setLanguages(readStorage("nababi-languages", {}));

    const savedNews = readStorage<AnyData[]>("nababi-breaking-news", []);
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

    const savedMenu = readStorage<AnyData[]>("nababi-menu", []);

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
      savedGallery.filter((item) => item.visible !== false)
    );

    const savedReviews = readStorage<AnyData[]>(
      "nababi-reviews",
      []
    );

    setReviews(
      savedReviews.filter((item) => item.visible !== false)
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

  const aboutImage =
    about.image ||
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=90";

  const heroImage =
    home.heroImage ||
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2200&q=90";

  const bookingTitle =
    home.bookingTitle || "Reserve Your Table";

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

  const visibleSocial = social.visible !== false;

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
      description: "Fragrant basmati rice with aromatic spices.",
      price: "16",
      category: "Biryani",
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: "fallback-2",
      name: "Tandoori Chicken",
      description: "Tender chicken prepared with authentic spices.",
      price: "15",
      category: "Chicken",
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: "fallback-3",
      name: "Royal Mutton Curry",
      description: "Slow-cooked mutton in a rich house gravy.",
      price: "18",
      category: "Mutton",
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: "fallback-4",
      name: "Fresh Garden Salad",
      description: "Fresh seasonal vegetables with house dressing.",
      price: "9",
      category: "Starters",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
    },
  ];

  const displayedMenu =
    menu.length > 0 ? menu : fallbackMenu;

  const galleryImages =
    gallery.length > 0
      ? gallery.map((item) => item.image).filter(Boolean)
      : [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=90",
        ];

  const handleReservation = (e: FormEvent<HTMLFormElement>) => {
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

    const oldReservations = readStorage<AnyData[]>(
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

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f0e7] text-[#33251f]">

      {/* ================= BREAKING NEWS ================= */}
      {news.length > 0 && (
        <div className="sticky top-0 z-[100] overflow-hidden bg-[#a6402d] text-white shadow-lg">
          <div className="flex h-10 items-center">

            <div className="z-10 flex h-full shrink-0 items-center bg-[#7f2d20] px-4 text-[10px] font-black uppercase tracking-[0.18em] sm:px-6 sm:text-xs">
              <span className="mr-2 animate-pulse">
                ●
              </span>
              Breaking News
            </div>

            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-flex min-w-max animate-[nababiMarquee_28s_linear_infinite] gap-16 px-8">
                {[...news, ...news].map(
                  (item, index) => (
                    <span
                      key={`${item.id}-${index}`}
                      className="text-xs font-semibold sm:text-sm"
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

      {/* ================= HEADER ================= */}
      <header className="sticky top-10 z-50 border-b border-[#d8c5b2]/70 bg-[#f7f0e7]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">

          <button
            onClick={() => scrollTo("home")}
            className="text-left"
          >
            <div className="font-serif text-2xl font-black tracking-tight text-[#913a29] sm:text-3xl">
              {restaurantName}
            </div>

            <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.35em] text-[#a77957]">
              Ristorante • Roma
            </div>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            <button onClick={() => scrollTo("home")} className="text-sm font-semibold">
              Home
            </button>

            <button onClick={() => scrollTo("about")} className="text-sm font-semibold">
              About
            </button>

            <button onClick={() => scrollTo("menu")} className="text-sm font-semibold">
              Menu
            </button>

            <button onClick={() => scrollTo("gallery")} className="text-sm font-semibold">
              Gallery
            </button>

            <button onClick={() => scrollTo("reviews")} className="text-sm font-semibold">
              Reviews
            </button>

            <button onClick={() => scrollTo("contact")} className="text-sm font-semibold">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">

            <button
              onClick={() => scrollTo("reservation")}
              className="hidden rounded-full bg-[#a6402d] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-[#833324] sm:block"
            >
              Reserve Table
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ccb8a5] bg-white/60 lg:hidden"
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#dac8b6] bg-[#f7f0e7] px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-4">

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
                  className="border-b border-[#dfd0c1] pb-3 text-left text-sm font-bold"
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
        className="relative min-h-[calc(100vh-118px)] overflow-hidden"
      >

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${heroImage}")`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#241712]/85 via-[#241712]/55 to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-118px)] max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-12">

          <div className="max-w-3xl text-white">

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#e0ad67]" />

              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#e7bb7b]">
                {welcomeText}
              </span>
            </div>

            <h1 className="font-serif text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
              {heroTitle}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              {heroSubtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => scrollTo("reservation")}
                className="rounded-full bg-[#b34b34] px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-[#913826]"
              >
                Reserve Your Table
              </button>

              <button
                onClick={() => scrollTo("menu")}
                className="rounded-full border border-white/50 bg-white/10 px-8 py-4 text-sm font-bold backdrop-blur-md transition hover:bg-white/20"
              >
                Explore Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      {about.visible !== false && (
        <section id="about" className="px-6 py-20 sm:py-28">

          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">

            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={aboutImage}
                alt={restaurantName}
                className="h-[480px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div>

              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a6402d]">
                About Us
              </span>

              <h2 className="mt-4 font-serif text-4xl font-black leading-tight sm:text-5xl">
                {about.title || "Where every plate tells a story."}
              </h2>

              <div className="mt-6 whitespace-pre-line text-base leading-8 text-[#715f51]">
                {aboutText}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ================= MENU ================= */}
      <section id="menu" className="bg-[#2d1d18] px-6 py-20 text-[#f8eee4] sm:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#d7a463]">
              From Our Kitchen
            </span>

            <h2 className="mt-3 font-serif text-4xl font-black sm:text-6xl">
              Our Menu
            </h2>
          </div>

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-[#d7a463]/30 px-4 py-2 text-xs font-bold text-[#e0b678]"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {displayedMenu.slice(0, 8).map((item, index) => (
              <div
                key={item.id || index}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#3a2821] shadow-xl"
              >

                <div className="relative h-64 overflow-hidden">

                  <img
                    src={
                      item.image ||
                      fallbackMenu[index % fallbackMenu.length].image
                    }
                    alt={item.name || "Menu item"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-20">

                    <span className="rounded-full bg-[#d39a55] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#2d1d18]">
                      {item.category || "Chef Choice"}
                    </span>

                  </div>
                </div>

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <h3 className="font-serif text-xl font-black">
                      {item.name || "Special Dish"}
                    </h3>

                    <span className="shrink-0 text-base font-black text-[#e2ad69]">
                      {settings.currency === "EUR" || !settings.currency
                        ? "€"
                        : settings.currency}
                      {item.price}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#cdb9a9]">
                    {item.description || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROMOTIONS ================= */}
      {promotions.length > 0 && (
        <section className="bg-[#ead9c8] px-6 py-16">

          <div className="mx-auto max-w-6xl">

            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a6402d]">
                Special Offers
              </span>

              <h2 className="mt-3 font-serif text-4xl font-black">
                Our Latest Promotions
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              {promotions.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-xl"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <h3 className="font-serif text-2xl font-black">
                      {item.title}
                    </h3>

                    {item.offer && (
                      <div className="mt-3 font-black text-[#a6402d]">
                        {item.offer}
                      </div>
                    )}

                    <p className="mt-3 text-sm leading-6 text-[#725f50]">
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
      {gallery.length > 0 && (
        <section id="gallery" className="px-6 py-20 sm:py-28">

          <div className="mx-auto max-w-7xl">

            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a6402d]">
                Gallery
              </span>

              <h2 className="mt-3 font-serif text-4xl font-black sm:text-6xl">
                Inside {restaurantName}
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">

              {galleryImages.slice(0, 6).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="group overflow-hidden rounded-2xl"
                >
                  <img
                    src={image}
                    alt={`${restaurantName} gallery`}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= RESERVATION ================= */}
      <section
        id="reservation"
        className="bg-[#ead9c8] px-6 py-20 sm:py-28"
      >

        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-[#f8f0e7] shadow-2xl lg:grid-cols-2">

          <div
            className="min-h-[430px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=90')",
            }}
          />

          <div className="p-7 sm:p-10 lg:p-14">

            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a6402d]">
              Reservations
            </span>

            <h2 className="mt-3 font-serif text-4xl font-black sm:text-5xl">
              {bookingTitle}
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#725f50]">
              {bookingText}
            </p>

            {bookingSent && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
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
                className="w-full rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
              />

              <div className="grid gap-4 sm:grid-cols-2">

                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  className="w-full rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <input
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
                />

                <input
                  name="time"
                  type="time"
                  required
                  className="w-full rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
                />
              </div>

              <select
                name="guests"
                required
                defaultValue=""
                className="w-full rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
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
                className="w-full resize-none rounded-xl border border-[#d7c5b3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a6402d]"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[#a6402d] px-5 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-[#873324]"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      {reviews.length > 0 && (
        <section id="reviews" className="px-6 py-20 sm:py-28">

          <div className="mx-auto max-w-6xl text-center">

            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a6402d]">
              Guest Reviews
            </span>

            <h2 className="mt-3 font-serif text-4xl font-black sm:text-6xl">
              Loved by Our Guests
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-[#dfd0c1] bg-[#f9f3ec] p-7 text-left shadow-sm"
                >

                  <div className="text-lg tracking-widest text-[#c98d45]">
                    {"★".repeat(
                      Math.min(Number(review.rating) || 5, 5)
                    )}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#665449]">
                    “{review.review}”
                  </p>

                  <div className="mt-6 border-t border-[#dfd0c1] pt-4 font-serif font-black">
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
          className="bg-[#2d1d18] px-6 py-20 text-white sm:py-24"
        >

          <div className="mx-auto max-w-6xl">

            <div className="grid gap-12 md:grid-cols-3">

              <div>
                <div className="font-serif text-3xl font-black text-[#e2ad69]">
                  {restaurantName}
                </div>

                <p className="mt-6 text-sm leading-7 text-[#cdb9a9]">
                  {contact.contactText ||
                    "A beautiful dining experience with authentic flavours and warm hospitality."}
                </p>
              </div>

              <div>
                <h3 className="font-bold">
                  Contact
                </h3>

                <div className="mt-4 space-y-3 text-sm text-[#cdb9a9]">

                  {address && (
                    <div>
                      📍 {address}
                    </div>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="block hover:text-white"
                    >
                      📞 {phone}
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="block hover:text-white"
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
                    className="mt-5 inline-block rounded-full border border-[#d7a463]/40 px-5 py-3 text-xs font-bold text-[#e2ad69]"
                  >
                    Open Google Maps
                  </a>
                )}
              </div>

              <div>
                <h3 className="font-bold">
                  Opening Hours
                </h3>

                <div className="mt-4 text-sm leading-7 text-[#cdb9a9]">
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
                        className="rounded-full bg-white/10 px-4 py-2 text-xs"
                      >
                        Facebook
                      </a>
                    )}

                    {social.instagram && (
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white/10 px-4 py-2 text-xs"
                      >
                        Instagram
                      </a>
                    )}

                    {social.tiktok && (
                      <a
                        href={social.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white/10 px-4 py-2 text-xs"
                      >
                        TikTok
                      </a>
                    )}

                    {social.youtube && (
                      <a
                        href={social.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white/10 px-4 py-2 text-xs"
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
                        : `https://wa.me/${whatsapp.replace(/\D/g, "")}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-full bg-[#3b9b62] px-5 py-3 text-xs font-bold"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-7 text-center text-xs text-[#9f8c7f]">
              © {new Date().getFullYear()} {restaurantName}. All rights reserved.
            </div>
          </div>
        </section>
      )}

      {/* ================= MOBILE BOOK BUTTON ================= */}
      <button
        onClick={() => scrollTo("reservation")}
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#a6402d] px-7 py-4 text-xs font-black uppercase tracking-wider text-white shadow-2xl sm:hidden"
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
          background: #f7f0e7;
        }

        @keyframes nababiMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        ::selection {
          background: #a6402d;
          color: white;
        }
      `}</style>
    </main>
  );
}
