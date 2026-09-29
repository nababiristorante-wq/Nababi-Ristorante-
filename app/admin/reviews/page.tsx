"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type Review = {
  id: number;
  customerName: string;
  rating: number;
  review: string;
  image: string;
  date: string;
  visible: boolean;
};

const STORAGE_KEY = "nababi-reviews";

const defaultReviews: Review[] = [
  {
    id: 1,
    customerName: "Marco Rossi",
    rating: 5,
    review:
      "Amazing food, beautiful atmosphere and very friendly service. A wonderful dining experience in Rome.",
    image: "",
    date: new Date().toISOString().slice(0, 10),
    visible: true,
  },
];

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [visible, setVisible] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch {
        setReviews(defaultReviews);
      }
    } else {
      setReviews(defaultReviews);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
    }
  }, []);

  const visibleReviews = useMemo(
    () => reviews.filter((item) => item.visible),
    [reviews]
  );

  const averageRating = useMemo(() => {
    if (!visibleReviews.length) return "0.0";

    const total = visibleReviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    return (total / visibleReviews.length).toFixed(1);
  }, [visibleReviews]);

  const saveReviews = (nextReviews: Review[]) => {
    setReviews(nextReviews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReviews));
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const resetForm = () => {
    setCustomerName("");
    setRating(5);
    setReview("");
    setImage("");
    setDate(new Date().toISOString().slice(0, 10));
    setVisible(true);
    setEditingId(null);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image size must be 8MB or less.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerName.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!review.trim()) {
      alert("Review text is required.");
      return;
    }

    if (!date) {
      alert("Date is required.");
      return;
    }

    if (editingId !== null) {
      const updated = reviews.map((item) =>
        item.id === editingId
          ? {
              ...item,
              customerName: customerName.trim(),
              rating,
              review: review.trim(),
              image,
              date,
              visible,
            }
          : item
      );

      saveReviews(updated);
    } else {
      const newReview: Review = {
        id: Date.now(),
        customerName: customerName.trim(),
        rating,
        review: review.trim(),
        image,
        date,
        visible,
      };

      saveReviews([newReview, ...reviews]);
    }

    resetForm();
  };

  const handleEdit = (item: Review) => {
    setCustomerName(item.customerName);
    setRating(item.rating);
    setReview(item.review);
    setImage(item.image);
    setDate(item.date);
    setVisible(item.visible);
    setEditingId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    saveReviews(reviews.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  const toggleVisibility = (id: number) => {
    const updated = reviews.map((item) =>
      item.id === id ? { ...item, visible: !item.visible } : item
    );

    saveReviews(updated);
  };

  const renderStars = (value: number, clickable = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={
              clickable
                ? () => setRating(star)
                : undefined
            }
            className={`text-2xl transition ${
              star <= value
                ? "text-yellow-300"
                : "text-white/20"
            } ${
              clickable
                ? "cursor-pointer hover:scale-110"
                : "cursor-default"
            }`}
            aria-label={`${star} star`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#35130c] via-[#7b2617] to-[#35104f] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-100 backdrop-blur-xl">
            Nababi Ristorante
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Reviews Management
          </h1>
        </header>

        <section className="w-full rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Total Reviews
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {reviews.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Visible Reviews
              </p>
              <p className="mt-2 text-3xl font-bold text-green-300">
                {visibleReviews.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Average Rating
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-3xl font-bold text-yellow-300">
                  {averageRating}
                </span>
                <span className="text-yellow-300">★</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">
                  {editingId !== null ? "Edit Review" : "Add Review"}
                </h2>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Customer Name
                  </label>

                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-orange-300/50 focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Rating
                  </label>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {renderStars(rating, true)}
                    <p className="mt-1 text-xs text-white/45">
                      {rating} out of 5
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Review
                  </label>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write customer review..."
                    rows={6}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-orange-300/50 focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Customer Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500/80 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-orange-500"
                  />

                  {image && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={image}
                        alt="Customer preview"
                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/20"
                      />

                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="rounded-xl bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-orange-300/50 focus:bg-white/15"
                  />
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">
                      Show Review
                    </p>
                    <p className="text-xs text-white/45">
                      Visible reviews can appear on the website.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="h-5 w-5 accent-orange-500"
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01]"
                  >
                    {editingId !== null
                      ? "Update Review"
                      : "Add Review"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 font-semibold text-white transition hover:bg-white/15"
                  >
                    Reset
                  </button>
                </div>

                {saved && (
                  <div className="rounded-2xl border border-green-300/20 bg-green-500/10 px-4 py-3 text-center text-sm font-semibold text-green-200">
                    Changes saved successfully.
                  </div>
                )}
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Review List
                </h2>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {reviews.length} Reviews
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                  <div>
                    <div className="mb-3 text-5xl">⭐</div>
                    <h3 className="font-bold text-white">
                      No reviews yet
                    </h3>
                    <p className="mt-1 text-sm text-white/45">
                      Add your first customer review.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-h-[720px] space-y-4 overflow-y-auto pr-1">
                  {reviews.map((item) => (
                    <article
                      key={item.id}
                      className={`rounded-3xl border p-4 transition ${
                        item.visible
                          ? "border-white/10 bg-white/10"
                          : "border-red-300/10 bg-red-500/5 opacity-70"
                      }`}
                    >
                      <div className="flex gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.customerName}
                            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-white/20"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/30 to-fuchsia-500/30 text-xl font-bold text-white">
                            {item.customerName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-bold text-white">
                                {item.customerName}
                              </h3>

                              <div className="mt-1">
                                {renderStars(item.rating)}
                              </div>
                            </div>

                            <span className="text-xs text-white/40">
                              {item.date}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-white/70">
                            {item.review}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                toggleVisibility(item.id)
                              }
                              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                                item.visible
                                  ? "bg-green-500/15 text-green-200 hover:bg-green-500/25"
                                  : "bg-red-500/15 text-red-200 hover:bg-red-500/25"
                              }`}
                            >
                              {item.visible ? "Visible" : "Hidden"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-xl bg-blue-500/15 px-3 py-2 text-xs font-bold text-blue-200 transition hover:bg-blue-500/25"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="rounded-xl bg-red-500/15 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-500/25"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}