"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type GalleryItem = {
  id: number;
  image: string;
  category: string;
  visible: boolean;
  order: number;
};

const STORAGE_KEY = "nababi-gallery";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1800;
const JPEG_QUALITY = 0.82;

function createId() {
  return Date.now() + Math.floor(Math.random() * 100000);
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Unable to read image."));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("Unable to process image."));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_IMAGE_WIDTH) {
          const ratio = MAX_IMAGE_WIDTH / width;
          width = MAX_IMAGE_WIDTH;
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Unable to process image."));
          return;
        }

        context.drawImage(img, 0, 0, width, height);

        const result = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

        resolve(result);
      };

      img.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [filter, setFilter] = useState<"All" | "Visible" | "Hidden">("All");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      setItems([]);
    }
  }, []);

  const saveItems = (nextItems: GalleryItem[]) => {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  };

  const processFiles = async (files: File[]) => {
    if (!files.length) return;

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (!imageFiles.length) {
      setUploadMessage("Please select image files only.");
      return;
    }

    const oversized = imageFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversized.length > 0) {
      setUploadMessage(
        `${oversized.length} image${
          oversized.length > 1 ? "s were" : " was"
        } larger than 8MB and skipped.`
      );
    }

    const validFiles = imageFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE
    );

    if (!validFiles.length) return;

    setIsUploading(true);

    try {
      const compressedImages: string[] = [];

      for (const file of validFiles) {
        try {
          const compressed = await compressImage(file);
          compressedImages.push(compressed);
        } catch {
          // Skip files that cannot be processed.
        }
      }

      setSelectedImages((previous) => [
        ...previous,
        ...compressedImages,
      ]);

      setUploadMessage(
        `${compressedImages.length} image${
          compressedImages.length !== 1 ? "s" : ""
        } selected successfully.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    await processFiles(files);

    e.target.value = "";
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files || []);

    await processFiles(files);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const clearSelectedImages = () => {
    setSelectedImages([]);
    setUploadMessage("");
  };

  const uploadAllImages = () => {
    if (!selectedImages.length) {
      setUploadMessage("Please select one or more images first.");
      return;
    }

    const existingOrders = items.map((item) => item.order);

    const startingOrder =
      existingOrders.length > 0
        ? Math.max(...existingOrders) + 1
        : 1;

    const newItems: GalleryItem[] = selectedImages.map(
      (image, index) => ({
        id: createId() + index,
        image,
        category: "Restaurant",
        visible: true,
        order: startingOrder + index,
      })
    );

    try {
      saveItems([...items, ...newItems]);

      setSelectedImages([]);

      setUploadMessage(
        `${newItems.length} image${
          newItems.length !== 1 ? "s" : ""
        } uploaded successfully.`
      );
    } catch {
      setUploadMessage(
        "Unable to save all images. Browser storage may be full."
      );
    }
  };

  const deleteImage = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    const updatedItems = items.filter((item) => item.id !== id);

    saveItems(updatedItems);

    setUploadMessage("Image deleted successfully.");
  };

  const deleteAllImages = () => {
    if (!items.length) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all gallery images?"
    );

    if (!confirmDelete) return;

    saveItems([]);

    setUploadMessage("All gallery images deleted.");
  };

  const filteredItems = items.filter((item) => {
    if (filter === "Visible") return item.visible !== false;
    if (filter === "Hidden") return item.visible === false;

    return true;
  });

  const visibleCount = items.filter(
    (item) => item.visible !== false
  ).length;

  const hiddenCount = items.filter(
    (item) => item.visible === false
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="absolute right-[-120px] top-20 h-[450px] w-[450px] rounded-full bg-yellow-600/10 blur-3xl" />

        <div className="absolute bottom-[-150px] left-1/3 h-[450px] w-[450px] rounded-full bg-amber-700/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <div className="rounded-[28px] border border-amber-400/15 bg-gradient-to-r from-[#11110f] via-[#0b0b0a] to-[#12100a] p-6 shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/60" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                    Nababi Ristorante
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Gallery
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-white/45">
                  Upload and manage your restaurant photos.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-white/35">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-amber-300">
                    {items.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-400/10 bg-green-500/5 px-5 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-white/35">
                    Visible
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-300">
                    {visibleCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Upload Section */}
        <section className="mb-6 rounded-[28px] border border-amber-400/15 bg-[#0b0b0a] p-4 shadow-2xl shadow-black/30 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Upload Images
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Select multiple photos at once.
              </p>
            </div>

            {selectedImages.length > 0 && (
              <div className="rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-xs font-semibold text-amber-300">
                {selectedImages.length} selected
              </div>
            )}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            {/* Upload Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed p-8 text-center transition ${
                isDragging
                  ? "border-amber-300 bg-amber-400/10"
                  : "border-amber-400/30 bg-white/[0.02] hover:border-amber-300/60 hover:bg-amber-400/[0.04]"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-4xl shadow-xl shadow-amber-900/10">
                🖼️
              </div>

              <h3 className="text-lg font-bold text-white">
                Upload Multiple Images
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Drag and drop your images here, or click to select
                multiple photos.
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-6 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-amber-900/20 transition hover:scale-[1.02]"
              >
                {isUploading ? "Processing..." : "Select Images"}
              </button>

              <p className="mt-4 text-[11px] text-white/25">
                JPG, PNG, WEBP · Maximum 8MB per image
              </p>
            </div>

            {/* Selected Preview */}
            <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    Selected Images
                  </h3>

                  <p className="mt-1 text-xs text-white/35">
                    Preview before uploading
                  </p>
                </div>

                {selectedImages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSelectedImages}
                    className="text-xs font-medium text-red-300 transition hover:text-red-200"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedImages.length === 0 ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/5 bg-black/20">
                  <div className="text-center">
                    <div className="mb-3 text-3xl opacity-40">
                      📷
                    </div>

                    <p className="text-sm text-white/35">
                      No images selected
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid max-h-[300px] grid-cols-3 gap-3 overflow-y-auto pr-1 sm:grid-cols-4">
                  {selectedImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black"
                    >
                      <img
                        src={image}
                        alt={`Selected ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-sm text-white opacity-100 transition hover:bg-red-500"
                        aria-label="Remove selected image"
                      >
                        ×
                      </button>

                      <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-white/70">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedImages.length > 0 && (
                <button
                  type="button"
                  onClick={uploadAllImages}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-900/20 transition hover:scale-[1.01]"
                >
                  Upload All {selectedImages.length} Images
                </button>
              )}
            </div>
          </div>

          {uploadMessage && (
            <div className="mt-4 rounded-xl border border-amber-400/10 bg-amber-400/5 px-4 py-3 text-center text-sm text-amber-200">
              {uploadMessage}
            </div>
          )}
        </section>

        {/* Gallery Section */}
        <section className="rounded-[28px] border border-amber-400/15 bg-[#0b0b0a] p-4 shadow-2xl shadow-black/30 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Gallery Images
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Your uploaded restaurant photos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter("All")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  filter === "All"
                    ? "bg-amber-400 text-black"
                    : "border border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                }`}
              >
                All ({items.length})
              </button>

              <button
                type="button"
                onClick={() => setFilter("Visible")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  filter === "Visible"
                    ? "bg-green-500 text-white"
                    : "border border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                }`}
              >
                Visible ({visibleCount})
              </button>

              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("Hidden")}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    filter === "Hidden"
                      ? "bg-red-500 text-white"
                      : "border border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                  }`}
                >
                  Hidden ({hiddenCount})
                </button>
              )}

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={deleteAllImages}
                  className="rounded-xl border border-red-400/10 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Delete All
                </button>
              )}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex min-h-[380px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02]">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/5 text-4xl opacity-70">
                  🖼️
                </div>

                <h3 className="text-lg font-semibold text-white/70">
                  No Gallery Images
                </h3>

                <p className="mt-2 text-sm text-white/30">
                  Upload multiple restaurant photos to get started.
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                >
                  Upload Images
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredItems
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-amber-900/10"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt="Restaurant gallery"
                        className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                          item.visible === false
                            ? "opacity-40 grayscale"
                            : ""
                        }`}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-0 transition group-hover:opacity-100" />

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => deleteImage(item.id)}
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/75 text-lg text-white opacity-100 shadow-lg backdrop-blur-md transition hover:bg-red-500"
                        aria-label="Delete image"
                      >
                        ×
                      </button>

                      {/* Status */}
                      <div className="absolute bottom-2 left-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${
                            item.visible !== false
                              ? "bg-green-500/80 text-white"
                              : "bg-red-500/80 text-white"
                          }`}
                        >
                          {item.visible !== false
                            ? "Visible"
                            : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Bottom Note */}
        <footer className="py-8 text-center">
          <p className="text-xs text-white/20">
            Nababi Ristorante · Gallery Management
          </p>
        </footer>
      </div>
    </main>
  );
              }
