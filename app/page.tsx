"use client";

import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from "react";

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

const number = Math.floor(1000 + Math.random() * 9000);

return "NAB-" + letters + number;
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
<rect x="3" y="5" width="18" height="14" rx="2" />
<path d="m4 7 8 6 8-6" />
</svg>
);
}

if (name === "calendar") {
return (
<svg {...props}>
<rect x="3.5" y="5" width="17" height="15" rx="2" />
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
<rect x="3" y="4" width="18" height="16" rx="2" />
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
<svg {...props} fill="currentColor" stroke="none">
<path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
</svg>
);
}

if (name === "instagram") {
return (
<svg {...props}>
<rect x="4" y="4" width="16" height="16" rx="4" />
<circle cx="12" cy="12" r="3.5" />
<circle cx="17" cy="7" r=".7" fill="currentColor" />
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
<rect x="3" y="6" width="18" height="12" rx="3" />
<path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
</svg>
);
}

return (
<svg {...props}>
<circle cx="12" cy="12" r="8" />
</svg>
);
}

function CategoryIcon({ name }: { name: string }) {
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
const [home, setHome] = useState<AnyData>({});
const [about, setAbout] = useState<AnyData>({});
const [contact, setContact] = useState<AnyData>({});
const [settings, setSettings] = useState<AnyData>({});
const [social, setSocial] = useState<SocialData>({});

const [menu, setMenu] = useState<MenuItem[]>([]);
const [categories, setCategories] =
useState<string[]>(DEFAULT_CATEGORIES);

const [gallery, setGallery] = useState<GalleryItem[]>([]);
const [reviews, setReviews] = useState<AnyData[]>([]);
const [news, setNews] = useState<AnyData[]>([]);

const [reviewName, setReviewName] = useState("");
const [reviewRating, setReviewRating] = useState("5");
const [reviewText, setReviewText] = useState("");
const [reviewMessage, setReviewMessage] = useState("");

const [selectedCategory, setSelectedCategory] = useState("");

const [mobileOpen, setMobileOpen] = useState(false);
const [galleryOpen, setGalleryOpen] = useState(false);

const [bookingMessage, setBookingMessage] = useState("");

const [booking, setBooking] = useState({
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

const [myBookingOpen, setMyBookingOpen] = useState(false);

const [lookupValue, setLookupValue] = useState("");
const [lookupCode, setLookupCode] = useState("");

const [lookupStep, setLookupStep] =
useState<"login" | "code" | "details">("login");

const [lookupMessage, setLookupMessage] = useState("");

const [foundBooking, setFoundBooking] =
useState<Reservation | null>(null);

const [editingBooking, setEditingBooking] =
useState(false);

const [newsClosed, setNewsClosed] = useState(false);

const [newsMediaUrls, setNewsMediaUrls] = useState<Record<string, string>>({});

const BREAKING_NEWS_MEDIA_DB_NAME = "nababi-breaking-news-media-db";
const BREAKING_NEWS_MEDIA_DB_VERSION = 1;
const BREAKING_NEWS_MEDIA_STORE_NAME = "media";

const openBreakingNewsMediaDB = (): Promise<IDBDatabase> =>
new Promise((resolve, reject) => {
if (typeof window === "undefined" || !("indexedDB" in window)) {
reject(new Error("IndexedDB is not available in this browser."));
return;
}

const request = indexedDB.open(
BREAKING_NEWS_MEDIA_DB_NAME,
BREAKING_NEWS_MEDIA_DB_VERSION,
);

request.onupgradeneeded = () => {
const db = request.result;
if (!db.objectStoreNames.contains(BREAKING_NEWS_MEDIA_STORE_NAME)) {
db.createObjectStore(BREAKING_NEWS_MEDIA_STORE_NAME, {
keyPath: "id",
});
}
};

request.onsuccess = () => resolve(request.result);
request.onerror = () =>
reject(request.error || new Error("Could not open media database."));
});

const loadBreakingNewsMedia = async (items: AnyData[]) => {
const mediaItems = items.filter(
(item) => item.mediaType === "video" && item.mediaId,
);

if (!mediaItems.length) {
setNewsMediaUrls((previous) => {
Object.values(previous).forEach((url) => URL.revokeObjectURL(url));
return {};
});
return;
}

let db: IDBDatabase | null = null;

try {
db = await openBreakingNewsMediaDB();
const nextUrls: Record<string, string> = {};

await Promise.all(
mediaItems.map(
(item) =>
new Promise<void>((resolve) => {
if (!db) {
resolve();
return;
}

const request = db    
        .transaction(BREAKING_NEWS_MEDIA_STORE_NAME, "readonly")    
        .objectStore(BREAKING_NEWS_MEDIA_STORE_NAME)    
        .get(item.mediaId);    

      request.onsuccess = () => {    
        if (request.result?.blob) {    
          nextUrls[item.id] = URL.createObjectURL(    
            request.result.blob,    
          );    
        }    
        resolve();    
      };    

      request.onerror = () => resolve();    
    }),    
),

);

setNewsMediaUrls((previous) => {
  const sameUrls =
    Object.keys(previous).length ===
      Object.keys(nextUrls).length &&
    Object.keys(nextUrls).every(
      (key) => previous[key] === nextUrls[key],
    );

  if (sameUrls) {
    return previous;
  }

  Object.values(previous).forEach((url) =>
    URL.revokeObjectURL(url),
  );

  return nextUrls;
});
} catch {
setNewsMediaUrls((previous) => {
Object.values(previous).forEach((url) => URL.revokeObjectURL(url));
return {};
});
} finally {
db?.close();
}

};

const loadData = () => {
setHome(readStorage("nababi-home-settings", {}));
setAbout(readStorage("nababi-about", {}));
setContact(readStorage("nababi-contact", {}));
setSettings(readStorage("nababi-settings", {}));
setSocial(readStorage("nababi-social-media", {}));

const rawMenu = arrayData(
readStorage("nababi-menu", []),
) as MenuItem[];

setMenu(
rawMenu.filter((item) => item.available !== false),
);

const rawCategories = arrayData(
readStorage("nababi-categories", []),
);

const categoryList = Array.from(
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

const rawGallery = arrayData(
readStorage("nababi-gallery", []),
) as GalleryItem[];

setGallery(
rawGallery
.map((item: AnyData) => ({
...item,
image:
item.image ||
item.imageUrl ||
item.src ||
item.url ||
"",
visible:
item.visible ??
item.showOnWebsite ??
item.isVisible ??
true,
show:
item.show ??
item.showOnWebsite ??
item.isVisible ??
true,
order:
item.order ??
item.displayOrder ??
0,
}))
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
readStorage("nababi-reviews", []),
).filter(
(item: AnyData) =>
item.visible !== false,
),
);

const currentTime = new Date();

setNews(
arrayData(
readStorage(
"nababi-breaking-news",
[],
),
).filter((item: AnyData) => {
if (item.visible === false) return false;

if (    
  item.startDate &&    
  new Date(item.startDate) > currentTime    
) {    
  return false;    
}    

if (    
  item.endDate &&    
  new Date(item.endDate) < currentTime    
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

}),
);

};

useEffect(() => {
loadData();

const interval = window.setInterval(
loadData,

);

window.addEventListener(
"storage",
loadData,
);

return () => {
window.clearInterval(interval);
window.removeEventListener(
"storage",
loadData,
);
};

}, []);
useEffect(() => {
  const timer = window.setInterval(() => {
    const video = document.querySelector(
      ".breaking-news video"
    ) as HTMLVideoElement | null;

    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, 60000);

  return () => {
    window.clearInterval(timer);
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

IMPORTANT:

এখানে কোনো default Home image নেই।

Admin → Home থেকে image/video না দিলে Home-এ

কোনো restaurant image দেখাবে না।
*/
const heroImage =
home.heroImage ||
home.image ||
"";

const heroVideo =
home.heroVideo ||
home.video ||
"";

const aboutText =
about.content ||
about.text ||
"Authentic food, warm hospitality and traditional flavors.";

const phone = contact.phone || "";
const email = contact.email || "";
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

useEffect(() => {
loadBreakingNewsMedia(news);

return () => {
setNewsMediaUrls((previous) => {
Object.values(previous).forEach((url) => URL.revokeObjectURL(url));
return {};
});
};

}, [news]);

const visibleNews =
news.length > 0 && !newsClosed
? news[0]
: null;

const categoryCards = useMemo(() => {
return categories.map((category) => {
const firstItem = menu.find(
(item) =>
categoryName(item.category)
.toLowerCase() ===
category.toLowerCase(),
);

return {
name: category,
image: firstItem?.image || "",
};
});

}, [categories, menu]);

const selectedItems = selectedCategory
? menu.filter(
(item) =>
categoryName(item.category)
.toLowerCase() ===
selectedCategory.toLowerCase(),
)
: [];

const bookingItems = booking.category
? menu.filter(
(item) =>
categoryName(item.category)
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
].filter((item) => item.url);

const scrollTo = (id: string) => {
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

if (!booking.phone && !booking.email) {
setBookingMessage(
"Please enter a phone number or email.",
);
return;
}

const newReservation: Reservation = {
  id: `reservation-${Date.now()}`,
  code: bookingCode(),
  name: booking.name,
  phone: booking.phone,
email: booking.email,
date: booking.date,
time: booking.time,
guests:
Number(booking.guests) || 2,
category: booking.category,
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
lookupValue.trim().toLowerCase();

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

const found = reservations.find(
(item) =>
String(item.phone || "")
.toLowerCase() === value ||
String(item.email || "")
.toLowerCase() === value,
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
if (!foundBooking) return;

if (
lookupCode.trim().toUpperCase() !==
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

if (!foundBooking) return;

const reservations =
arrayData(
readStorage(
"nababi-reservations",
[],
),
) as Reservation[];

const updated =
reservations.map((item) =>
item.id === foundBooking.id
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
if (!foundBooking) return;

const reservations =
arrayData(
readStorage(
"nababi-reservations",
[],
),
) as Reservation[];

const updated =
reservations.map((item) =>
item.id === foundBooking.id
? {
...item,
status: "Cancelled",
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

const submitReview = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();
setReviewMessage("");

const name = reviewName.trim();
const review = reviewText.trim();
const rating = Math.min(
5,
Math.max(1, Number(reviewRating) || 5),
);

if (!name || !review) {
setReviewMessage(
"Name and review are required.",
);
return;
}

const current = arrayData(
readStorage("nababi-reviews", []),
);

const newReview = {
id: "review-" + Date.now(),
customerName: name,
rating,
review,
date: new Date().toISOString(),
visible: true,
};

localStorage.setItem(
"nababi-reviews",
JSON.stringify([
newReview,
...current,
]),
);

setReviews((previous) => [
newReview,
...previous,
]);

setReviewName("");
setReviewRating("5");
setReviewText("");
setReviewMessage(
"Thank you! Your review has been added.",
);

};

const openWhatsApp = () => {
if (!whatsapp) return;

const number =
whatsapp.replace(/[^\d+]/g, "");

window.open(
  "https://wa.me/" + number.replace("+", ""),
  "_blank",
);

};

return (

<main className="site">  
<style jsx global>{`  
* {  
box-sizing: border-box;  
}  html {
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
      rgba(242, 189, 69, 0.08),    
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
  background: rgba(4, 6, 7, 0.97);    
  border-bottom: 1px solid var(--line);    
  backdrop-filter: blur(16px);    
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
  border: 1px solid var(--gold);    
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
  border: 1px solid var(--gold);    
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
  border: 1px solid var(--line);    
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
  border-bottom: 1px solid var(--line);    
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
  opacity: 0.45;    
}    

.hero-content {    
  position: relative;    
  z-index: 2;    
  width: min(950px, 92%);    
  padding: 100px 0;    
  text-align: center;    
}    

.eyebrow {    
  color: var(--gold);    
  text-transform: uppercase;    
  letter-spacing: 4px;    
  font-size: 13px;    
}    

.hero h1 {    
  margin: 15px 0;    
  color: var(--gold);    
  font-size: clamp(45px, 7vw, 88px);    
  line-height: 1;    
}    

.hero-description {    
  max-width: 700px;    
  margin: 0 auto 28px;    
  color: #eee;    
  line-height: 1.7;    
  font-size: 18px;    
}    

.hero-buttons {    
  display: flex;    
  justify-content: center;    
  flex-wrap: wrap;    
  gap: 12px;    
}    

.hero-contact {    
  position: absolute;    
  left: 4vw;    
  bottom: 25px;    
  z-index: 3;    
  display: grid;    
  gap: 8px;    
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
  color: rgba(255, 255, 255, 0.42);    
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
  background: rgba(4, 6, 7, 0.96);    
  border: 1px solid var(--gold);    
  border-radius: 13px;    
  overflow: hidden;    
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);    
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
  grid-template-columns: repeat(4, 1fr);    
  border-bottom: 1px solid var(--line);    
  background: #07090a;    
}    

.feature {    
  text-align: center;    
  padding: 28px 12px;    
  border-right: 1px solid rgba(242, 189, 69, 0.25);    
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
  border: 1px solid var(--gold);    
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
  width: min(1180px, 92%);    
  margin: 0 auto;    
  padding: 75px 0;    
}    

.section-title {    
  margin-bottom: 28px;    
}    

.section-title h2 {    
  margin: 7px 0;    
  color: var(--gold);    
  font-size: clamp(30px, 4vw, 50px);    
}    

.section-title p {    
  color: var(--muted);    
  margin: 0;    
}    

.about-grid {    
  display: grid;    
  grid-template-columns: 1fr 1.2fr 280px;    
  gap: 25px;    
  align-items: center;    
}    

.box {    
  background:    
    linear-gradient(    
      145deg,    
      rgba(17, 20, 22, 0.98),    
      rgba(6, 8, 9, 0.96)    
    );    
  border: 1px solid var(--line);    
  border-radius: 14px;    
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.22);    
}    

.about-media {    
  min-height: 260px;    
  overflow: hidden;    
  display: grid;    
  place-items: center;    
}    

.about-media img,    
.about-media video {    
  width: 100%;    
  height: 100%;    
  min-height: 260px;    
  object-fit: cover;    
}    

.empty-box {    
  min-height: 260px;    
  display: grid;    
  place-items: center;    
  text-align: center;    
  padding: 25px;    
  color: var(--muted);    
}    

.about-text {    
  padding: 27px;    
}    

.about-text h3 {    
  margin: 7px 0 15px;    
  color: var(--gold-light);    
  font-size: 32px;    
}    

.about-text p {    
  color: #d5d0c6;    
  line-height: 1.8;    
}    

.info-box {    
  padding: 25px;    
}    

.info-box h4 {    
  margin-top: 0;    
  color: var(--gold);    
  font-size: 19px;    
}    

.info-line {    
  display: flex;    
  gap: 9px;    
  align-items: center;    
  margin: 16px 0;    
  color: #eee;    
}    

.menu-section {    
  background: linear-gradient(    
    180deg,    
    #07090a,    
    #0b0d0f    
  );    
  border-top: 1px solid var(--line);    
  border-bottom: 1px solid var(--line);    
}    

.category-grid {    
  display: grid;    
  grid-template-columns: repeat(8, 1fr);    
  gap: 10px;    
}    

.category-card {    
  min-height: 150px;    
  padding: 9px;    
  border: 1px solid var(--line);    
  border-radius: 12px;    
  background: #090c0e;    
  color: #fff;    
  transition: 0.2s;    
}    

.category-card:hover,    
.category-card.active {    
  transform: translateY(-3px);    
  border-color: #ffe29a;    
  box-shadow: 0 10px 30px rgba(242, 189, 69, 0.15);    
}    

.category-photo {    
  width: 100%;    
  height: 95px;    
  object-fit: cover;    
  border-radius: 8px;    
}    

.category-placeholder {    
  width: 100%;    
  height: 95px;    
  display: grid;    
  place-items: center;    
  border-radius: 8px;    
  background: radial-gradient(    
    circle,    
    #30240f,    
    #101214    
  );    
}    

.category-icon {    
  font-size: 42px;    
}    

.category-name {    
  margin-top: 9px;    
  color: var(--gold-light);    
  font-weight: 700;    
  font-size: 13px;    
}    

.items-panel {    
  margin-top: 25px;    
  padding: 25px;    
  border: 1px solid var(--line);    
  border-radius: 14px;    
  background: #050708;    
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
  grid-template-columns: repeat(3, 1fr);    
  gap: 18px;    
}    

.menu-item {    
  overflow: hidden;    
  background: #0b0e10;    
  border: 1px solid rgba(242, 189, 69, 0.4);    
  border-radius: 12px;    
}    

.menu-item img {    
  width: 100%;    
  height: 190px;    
  object-fit: cover;    
}    

.menu-item-content {    
  padding: 16px;    
}    

.menu-item-content h4 {    
  margin: 0 0 7px;    
}    

.price {    
  color: var(--gold);    
  font-size: 18px;    
  font-weight: 700;    
}    

.description {    
  color: var(--muted);    
  font-size: 13px;    
  line-height: 1.6;    
}    

.booking-grid {    
  display: grid;    
  grid-template-columns: 1.2fr 0.8fr;    
  gap: 20px;    
}    

.booking-box {    
  padding: 25px;    
}    

.booking-box h3 {    
  color: var(--gold);    
  margin: 0 0 7px;    
}    

.booking-box > p {    
  color: var(--muted);    
}    

.form-grid {    
  display: grid;    
  grid-template-columns: repeat(2, 1fr);    
  gap: 13px;    
}    

.field {    
  display: flex;    
  flex-direction: column;    
  gap: 6px;    
}    

.field.full {    
  grid-column: 1 / -1;    
}    

.field label {    
  color: #ddd;    
  font-size: 12px;    
}    

.field input,    
.field select,    
.field textarea {    
  width: 100%;    
  border: 1px solid #46515d;    
  background: #101a25;    
  color: #fff;    
  border-radius: 7px;    
  padding: 12px;    
  outline: none;    
}    

.field input:focus,    
.field select:focus,    
.field textarea:focus {    
  border-color: var(--gold);    
}    

.field textarea {    
  min-height: 90px;    
  resize: vertical;    
}    

.form-actions {    
  display: flex;    
  flex-wrap: wrap;    
  gap: 9px;    
  margin-top: 17px;    
}    

.message {    
  margin-top: 13px;    
  padding: 11px;    
  border: 1px solid var(--line);    
  border-radius: 8px;    
  color: var(--gold-light);    
  background: rgba(242, 189, 69, 0.07);    
  font-size: 13px;    
}    

.gallery-review {    
  display: grid;    
  grid-template-columns: 1fr 1fr;    
  gap: 20px;    
}    

.gallery-box,    
.review-box {    
  padding: 25px;    
}    

.gallery-grid {    
  display: grid;    
  grid-template-columns: repeat(3, 1fr);    
  gap: 8px;    
}    

.gallery-grid img {    
  width: 100%;    
  aspect-ratio: 1;    
  object-fit: cover;    
  border-radius: 8px;    
}    

.review-list {    
  display: grid;    
  gap: 10px;    
  max-height: 320px;    
  overflow: auto;    
}    

.review {    
  padding: 14px;    
  border: 1px solid rgba(242, 189, 69, 0.25);    
  border-radius: 9px;    
}    

.review strong {    
  display: block;    
}    

.stars {    
  color: var(--gold);    
  letter-spacing: 2px;    
}    

.review p {    
  color: #c8c3ba;    
  font-size: 13px;    
  line-height: 1.6;    
}    

.contact-grid {    
  display: grid;    
  grid-template-columns: repeat(3, 1fr);    
  gap: 18px;    
}    

.contact-box {    
  padding: 25px;    
}    

.contact-box h3 {    
  color: var(--gold);    
  margin-top: 0;    
}    

.contact-line {    
  display: flex;    
  gap: 10px;    
  align-items: flex-start;    
  margin: 14px 0;    
  color: #ddd;    
}    

.social-row {    
  display: flex;    
  gap: 10px;    
  flex-wrap: wrap;    
}    

.social-icon {    
  width: 44px;    
  height: 44px;    
  display: grid;    
  place-items: center;    
  border: 1px solid var(--line);    
  border-radius: 50%;    
  color: var(--gold);    
}    

.footer {    
  display: flex;    
  justify-content: space-between;    
  gap: 20px;    
  padding: 22px 4vw;    
  border-top: 1px solid var(--line);    
  color: #9c978e;    
  font-size: 12px;    
}    

.floating-book {    
  position: fixed;    
  right: 20px;    
  bottom: 20px;    
  z-index: 80;    
}    

.floating-book button {    
  border: 1px solid #ffe29a;    
  border-radius: 999px;    
  padding: 13px 19px;    
  background: linear-gradient(    
    135deg,    
    #f9d878,    
    #d99a25    
  );    
  color: #171108;    
  font-weight: 700;    
  box-shadow: 0 15px 40px rgba(0,0,0,.45);    
}    

.modal-bg {    
  position: fixed;    
  inset: 0;    
  z-index: 300;    
  display: grid;    
  place-items: center;    
  padding: 20px;    
  background: rgba(0,0,0,.75);    
  backdrop-filter: blur(8px);    
}    

.modal {    
  width: min(620px, 100%);    
  max-height: 90vh;    
  overflow: auto;    
  background: #080b0d;    
  border: 1px solid var(--gold);    
  border-radius: 15px;    
  box-shadow: 0 30px 100px rgba(0,0,0,.7);    
}    

.modal-head {    
  display: flex;    
  justify-content: space-between;    
  align-items: center;    
  padding: 18px 20px;    
  border-bottom: 1px solid rgba(242,189,69,.25);    
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
  border-bottom: 1px solid rgba(255,255,255,.08);    
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
    grid-template-columns: repeat(4, 1fr);    
  }    

  .about-grid {    
    grid-template-columns: 1fr 1fr;    
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
    border-bottom: 1px solid var(--line);    
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
    grid-template-columns: repeat(2, 1fr);    
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
}

`}</style>
  {/* ================= HEADER ================= */}

  <header className="topbar">    
    <button    
      className="brand"    
      onClick={() => scrollTo("home")}    
    >    
      <span className="brand-mark">♛</span>    <span>    
    <strong className="brand-name">    
      NABABI    
    </strong>    

    <span className="brand-sub">    
      RISTORANTE    
    </span>    
  </span>    
</button>    

<nav    
  className={`nav ${    
    mobileOpen ? "open" : ""    
  }`}    
>    
  <button onClick={() => scrollTo("home")}>    
    Home    
  </button>    

  <button onClick={() => scrollTo("about")}>    
    About    
  </button>    

  <button onClick={() => scrollTo("menu")}>    
    Menu    
  </button>    

  <button onClick={() => scrollTo("gallery")}>    
    Gallery    
  </button>    

  <button onClick={() => scrollTo("booking")}>    
    Booking    
  </button>    

  <button onClick={() => scrollTo("reviews")}>    
    Reviews    
  </button>    

  <button onClick={() => scrollTo("contact")}>    
    Contact    
  </button>    
</nav>    

<div className="top-actions">    
  <a    
    className="pill"    
    href="/admin"    
    aria-label="Admin"    
    title="Admin"    
  >    
    <Icon name="settings" size={19} />    
  </a>    

  <button    
    className="mobile-menu"    
    onClick={() =>    
      setMobileOpen(    
        (value) => !value,    
      )    
    }    
  >    
    ☰    
  </button>    
</div>

  </header>    {/* ================= HOME ================= */}

  <section    
    id="home"    
    className={`hero ${    
      heroImage || heroVideo    
        ? "with-image"    
        : ""    
    }`}    
    style={    
      heroImage    
        ? ({    
            "--hero-image": `url("${heroImage}")`,    
          } as CSSProperties)    
        : undefined    
    }    
  >    
    {heroVideo && (    
      <video    
        className="hero-video"    
        src={heroVideo}    
        autoPlay    
        muted    
        loop    
        playsInline    
      />    
    )}    {/* ONLY ONE BREAKING NEWS BOX */}    
{visibleNews && (
  <aside className="breaking-news">
    <div className="breaking-head">
      <span>Breaking News</span>

      <button
        className="breaking-close"
        onClick={() => setNewsClosed(true)}
      >
        <Icon name="close" size={18} />
      </button>
    </div>

    {visibleNews.image ? (
      <img
        className="breaking-media"
        src={visibleNews.image}
        alt={visibleNews.title || "Breaking News"}
      />
    ) : visibleNews.mediaType === "video" &&
      newsMediaUrls[visibleNews.id] ? (
      <video
        className="breaking-media"
        src={newsMediaUrls[visibleNews.id]}
        autoPlay
        muted
        loop
        playsInline
        controls
      />
    ) : visibleNews.video ? (
      <video
        className="breaking-media"
        src={visibleNews.video}
        autoPlay
        muted
        loop
        playsInline
        controls
      />
    ) : (
      <div className="breaking-media" />
    )}

    <div className="breaking-body">
      <strong>
        {visibleNews.title ||
          visibleNews.text ||
          "Restaurant News"}
      </strong>

      <small>
        {visibleNews.description ||
          "Latest restaurant update"}
      </small>
    </div>
  </aside>
)}

  </section>    {/* ================= FEATURES ================= */}

  <section className="features">    
    <div className="feature">    
      <div className="feature-icon">    
        ✦    
      </div>    
      <strong>    
        Fresh Ingredients    
      </strong>    
      <span>    
        Only the best for you    
      </span>    
    </div>    <div className="feature">    
  <div className="feature-icon">    
    ♛    
  </div>    
  <strong>    
    Skilled Chefs    
  </strong>    
  <span>    
    Crafted with love    
  </span>    
</div>    

<div className="feature">    
  <div className="feature-icon">    
    ⌂    
  </div>    
  <strong>    
    Cozy Ambience    
  </strong>    
  <span>    
    Feel at home    
  </span>    
</div>    

<div className="feature">    
  <div className="feature-icon">    
    ◷    
  </div>    
  <strong>    
    Fast Service    
  </strong>    
  <span>    
    Your time matters    
  </span>    
</div>

  </section>    {/* ================= ABOUT ================= */}

  <section    
    id="about"    
    className="section"    
  >    
    <div className="about-grid">    
      <div className="box about-media">    
        {about.video ? (    
          <video    
            src={about.video}    
            controls    
            playsInline    
          />    
        ) : about.image ? (    
          <img    
            src={about.image}    
            alt="About restaurant"    
          />    
        ) : (    
          <div className="empty-box">    
            <div>    
              <Icon    
                name="gallery"    
                size={40}    
              />    
              <p>    
                No About image/video    
                added yet.    
              </p>    
            </div>    
          </div>    
        )}    
      </div>    <div className="box about-text">    
    <div className="eyebrow">    
      About Us    
    </div>    

    <h3>    
      {about.title ||    
        "A Place for Food Lovers"}    
    </h3>    

    <p>{aboutText}</p>    

    <button    
      className="outline-btn"    
      onClick={() =>    
        scrollTo("contact")    
      }    
    >    
      Learn More    
      <Icon    
        name="arrow"    
        size={16}    
      />    
    </button>    
  </div>    

  <div className="box info-box">    
    <h4>    
      Restaurant Experience    
    </h4>    

    <div className="info-line">    
      ✦ Fresh & Organic Food    
    </div>    

    <div className="info-line">    
      ♨ Authentic Recipes    
    </div>    

    <div className="info-line">    
      ♛ Royal Dining Experience    
    </div>    

    <div className="info-line">    
      ♡ Family Friendly    
    </div>    
  </div>    
</div>

  </section>    {/* ================= MENU ================= */}

  <section    
    id="menu"    
    className="menu-section"    
  >    
    <div className="section">    
      <div className="section-title">    
        <div className="eyebrow">    
          Our Menu    
        </div>    <h2>    
      Choose Your Favourite    
      Category    
    </h2>    

    
  </div>    

  <div className="category-grid">    
    {categoryCards.map(    
      (category, index) => (    
        <button    
          key={`${category.name}-${index}`}    
          className={`category-card ${    
            selectedCategory ===    
            category.name    
              ? "active"    
              : ""    
          }`}    
          onClick={() =>    
            setSelectedCategory(    
              selectedCategory ===    
                category.name    
                ? ""    
                : category.name,    
            )    
          }    
        >    
          {category.image ? (    
            <img    
              className="category-photo"    
              src={    
                category.image    
              }    
              alt={    
                category.name    
              }    
            />    
          ) : (    
            <span className="category-placeholder">    
              <CategoryIcon    
                name={    
                  category.name    
                }    
              />    
            </span>    
          )}    

          <div className="category-name">    
            {category.name} →    
          </div>    
        </button>    
      ),    
    )}    
  </div>    

  {/* আগে কোনো food item নেই।    
      Category click করার পরেই items দেখাবে। */}    

  {selectedCategory && (    
    <div className="items-panel">    
      <div className="items-header">    
        <h3>    
          {selectedCategory}    
        </h3>    

        <button    
          className="outline-btn"    
          onClick={() =>    
            setSelectedCategory(    
              "",    
            )    
          }    
        >    
          Close    
        </button>    
      </div>    

      {selectedItems.length >    
      0 ? (    
        <div className="item-grid">    
          {selectedItems.map(    
            (item, index) => (    
              <article    
                className="menu-item"    
                key={`${    
                  item.id ||    
                  item.name ||    
                  "item"    
                }-${index}`}    
              >    
                {item.image ? (    
                  <img    
                    src={item.image}    
                    alt={    
                      item.name ||    
                      item.title ||    
                      "Food"    
                    }    
                  />    
                ) : (    
                  <div className="category-placeholder">    
                    <CategoryIcon    
                      name={    
                        selectedCategory    
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
                    item.price !==    
                      "" && (    
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

  </section>    {/* ================= BOOKING ================= */}

  <section    
    id="booking"    
    className="section"    
  >    
    <div className="section-title">    
      <div className="eyebrow">    
        Reservations    
      </div>    <h2>    
    Book a Table    
  </h2>    


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

    
      
  </div>    
</div>

  </section>    {/* ================= GALLERY + REVIEWS ================= */}

  <section    
    className="section"    
  >    
    <div className="gallery-review">    
      <div    
        id="gallery"    
        className="box gallery-box"    
      >    
        <div className="section-title">    
          <div className="eyebrow">    
            Gallery    
          </div>    <h2>    
        Our Gallery    
      </h2>    

      
    </div>    

    {gallery.length >    
    0 ? (    
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

      
    </div>    

    {reviews.length >    
    0 ? (    
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
                  {"★".repeat(    
                    Math.min(    
                      5,    
                      Math.max(    
                        0,    
                        Number(    
                          review.rating,    
                        ) ||    
                          0,    
                      ),    
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
        No reviews added yet.    
      </div>    
    )}    

    <form    
      onSubmit={submitReview}    
      style={{    
        marginTop: 20,    
        paddingTop: 20,    
        borderTop:    
          "1px solid rgba(242,189,69,0.25)",    
      }}    
    >    
      <div className="eyebrow">    
        Share Your Experience    
      </div>    

      <h3    
        style={{    
          margin: "7px 0 16px",    
          color: "var(--gold)",    
        }}    
      >    
        Write a Review    
      </h3>    

      <div className="form-grid">    
        <div className="field">    
          <label>Your Name *</label>    
          <input    
            value={reviewName}    
            onChange={(event) =>    
              setReviewName(    
                event.target.value,    
              )    
            }    
            placeholder="Your name"    
            required    
          />    
        </div>    

        <div className="field">    
          <label>Rating *</label>    
          <select    
            value={reviewRating}    
            onChange={(event) =>    
              setReviewRating(    
                event.target.value,    
              )    
            }    
          >    
            <option value="5">    
              ★★★★★ — 5    
            </option>    
            <option value="4">    
              ★★★★☆ — 4    
            </option>    
            <option value="3">    
              ★★★☆☆ — 3    
            </option>    
            <option value="2">    
              ★★☆☆☆ — 2    
            </option>    
            <option value="1">    
              ★☆☆☆☆ — 1    
            </option>    
          </select>    
        </div>    

        <div className="field full">    
          <label>Your Review *</label>    
          <textarea    
            value={reviewText}    
            onChange={(event) =>    
              setReviewText(    
                event.target.value,    
              )    
            }    
            placeholder="Write your review"    
            required    
          />    
        </div>    
      </div>    

      <div className="form-actions">    
        <button    
          className="gold-btn"    
          type="submit"    
        >    
          ★ Submit Review    
        </button>    
      </div>    

      {reviewMessage && (    
        <div className="message">    
          {reviewMessage}    
        </div>    
      )}    
    </form>    
  </div>    
</div>

  </section>    {/* ================= CONTACT ================= */}

  <section    
    id="contact"    
    className="section"    
  >    
    <div className="section-title">    
      <div className="eyebrow">    
        Contact    
      </div>    <h2>    
    Find & Contact Us    
  </h2>    

  
</div>    

<div className="contact-grid">    
  <div className="box contact-box">    
    <h3>    
      Find Us on Map    
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
         
      </span>    
    )}    
  </div>    

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

    <div className="contact-line">    
      <Icon    
        name="pin"    
        size={20}    
      />    

      <span>    
        {address}    
      </span>    
    </div>    
  </div>    

  <div className="box contact-box">    
    <h3>    
      Follow Us    
    </h3>    
          
</div>
</div>

  </section>    <footer className="footer">    
    <span>    
      © 2026 {restaurantName}.    
      All rights reserved.    
    </span>    <span>    
  Good Food • Good Mood    
</span>

  </footer>      <div className="floating-book">    
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
      {lookupStep ===    
        "login" && (    
        <>    
          

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

      {lookupStep ===    
        "code" &&    
        foundBooking && (    
          <>    
            

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
                            name: event    
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
                            phone: event    
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
                            email: event    
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
                            date: event    
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
                            time: event    
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
                            note: event    
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

</main>  );
                    }
