"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type MediaType = "none" | "image" | "video";

type BreakingNews = {
  id: number;
  text: string;
  visible: boolean;
  startDate: string;
  endDate: string;
  mediaType?: MediaType;
  mediaId?: string;
};

type StoredMedia = {
  id: string;
  blob: Blob;
  type: MediaType;
  name: string;
};

const STORAGE_KEY = "nababi-breaking-news";

const MEDIA_DB_NAME = "nababi-breaking-news-media-db";
const MEDIA_DB_VERSION = 1;
const MEDIA_STORE_NAME = "media";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const SUPPORTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(MEDIA_DB_NAME, MEDIA_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        db.createObjectStore(MEDIA_STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error || new Error("Could not open media database.")
      );
    };
  });
}

async function saveMedia(
  media: StoredMedia
): Promise<void> {
  const db = await openMediaDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      MEDIA_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(MEDIA_STORE_NAME);

    store.put(media);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error = transaction.error;

      db.close();

      reject(
        error ||
          new Error("Could not save media file.")
      );
    };

    transaction.onabort = () => {
      const error = transaction.error;

      db.close();

      reject(
        error ||
          new Error("Media save operation was aborted.")
      );
    };
  });
}

async function getMedia(
  id: string
): Promise<StoredMedia | null> {
  const db = await openMediaDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      MEDIA_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(
      MEDIA_STORE_NAME
    );

    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(
        request.error ||
          new Error("Could not load media.")
      );
    };

    transaction.oncomplete = () => {
      db.close();
    };

    transaction.onerror = () => {
      db.close();
    };
  });
}

async function deleteMedia(id: string): Promise<void> {
  const db = await openMediaDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      MEDIA_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(
      MEDIA_STORE_NAME
    );

    store.delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error = transaction.error;

      db.close();

      reject(
        error ||
          new Error("Could not delete media.")
      );
    };
  });
}

function createMediaId() {
  return `breaking-media-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function isSupportedImage(file: File) {
  return SUPPORTED_IMAGE_TYPES.includes(
    file.type.toLowerCase()
  );
}

function isSupportedVideo(file: File) {
  return SUPPORTED_VIDEO_TYPES.includes(
    file.type.toLowerCase()
  );
}

async function compressImage(file: File): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>(
      (resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = () =>
          reject(
            new Error(
              "The selected image could not be read."
            )
          );

        img.src = objectUrl;
      }
    );

    const maxWidth = 1400;
    const maxHeight = 1400;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(
        maxWidth / width,
        maxHeight / height
      );

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Your browser could not prepare the image."
      );
    }

    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    const qualities = [
      0.78,
      0.68,
      0.58,
      0.48,
      0.4,
      0.32,
    ];

    for (const quality of qualities) {
      const blob = await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(
            resolve,
            "image/jpeg",
            quality
          );
        }
      );

      if (!blob) continue;

      if (blob.size <= 500 * 1024) {
        return blob;
      }
    }

    const finalBlob = await new Promise<Blob | null>(
      (resolve) => {
        canvas.toBlob(
          resolve,
          "image/jpeg",
          0.25
        );
      }
    );

    if (!finalBlob) {
      throw new Error(
        "Image compression failed."
      );
    }

    return finalBlob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function BreakingNewsPage() {
  const [newsList, setNewsList] = useState<
    BreakingNews[]
  >([]);

  const [text, setText] = useState("");

  const [visible, setVisible] = useState(true);

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [editingId, setEditingId] = useState<
    number | null
  >(null);

  const [saved, setSaved] = useState(false);

  const [mediaType, setMediaType] =
    useState<MediaType>("none");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [selectedPreview, setSelectedPreview] =
    useState("");

  const [existingMediaUrl, setExistingMediaUrl] =
    useState("");

  const [uploadingMedia, setUploadingMedia] =
    useState(false);

  const [mediaError, setMediaError] =
    useState("");

  const [previewUrls, setPreviewUrls] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setNewsList(parsed);
        }
      }
    } catch {
      setNewsList([]);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const saveNewsList = (
    nextList: BreakingNews[]
  ) => {
    setNewsList(nextList);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextList)
    );
  };

  const resetForm = () => {
    setText("");
    setVisible(true);
    setStartDate("");
    setEndDate("");
    setEditingId(null);
    setMediaType("none");
    setSelectedFile(null);
    setMediaError("");

    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
    }

    setSelectedPreview("");
    setExistingMediaUrl("");
  };

  const handleMediaTypeChange = (
    type: MediaType
  ) => {
    setMediaType(type);
    setMediaError("");

    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
    }

    setSelectedPreview("");
    setSelectedFile(null);
    setExistingMediaUrl("");
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMediaError("");

    if (
      mediaType === "image" &&
      !isSupportedImage(file)
    ) {
      setMediaError(
        "Please select a JPG, PNG or WEBP image."
      );

      e.target.value = "";
      return;
    }

    if (
      mediaType === "video" &&
      !isSupportedVideo(file)
    ) {
      setMediaError(
        "Please select an MP4, WEBM or MOV video."
      );

      e.target.value = "";
      return;
    }

    if (
      mediaType === "image" &&
      file.size > MAX_IMAGE_SIZE
    ) {
      setMediaError(
        `Image is too large. Maximum size is 8MB. Selected: ${formatFileSize(
          file.size
        )}`
      );

      e.target.value = "";
      return;
    }

    if (
      mediaType === "video" &&
      file.size > MAX_VIDEO_SIZE
    ) {
      setMediaError(
        `Video is too large. Maximum size is 50MB. Selected: ${formatFileSize(
          file.size
        )}`
      );

      e.target.value = "";
      return;
    }

    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setSelectedPreview(previewUrl);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanText = text.trim();

    if (!cleanText && mediaType === "none") {
      alert(
        "Please enter news text or add an image/video."
      );
      return;
    }

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      alert(
        "End date cannot be before start date."
      );
      return;
    }

    if (
      mediaType !== "none" &&
      !selectedFile &&
      !existingMediaUrl
    ) {
      alert(
        `Please select a ${mediaType}.`
      );
      return;
    }

    setUploadingMedia(true);
    setMediaError("");

    try {
      let mediaId: string | undefined =
        undefined;

      /*
       * If user selected a new media file,
       * save it into IndexedDB.
       */
      if (selectedFile && mediaType !== "none") {
        mediaId = createMediaId();

        let blobToSave: Blob = selectedFile;

        if (mediaType === "image") {
          blobToSave =
            await compressImage(selectedFile);
        }

        await saveMedia({
          id: mediaId,
          blob: blobToSave,
          type: mediaType,
          name: selectedFile.name,
        });
      }

      /*
       * Editing existing news
       */
      if (editingId !== null) {
        const oldItem = newsList.find(
          (item) => item.id === editingId
        );

        const oldMediaId = oldItem?.mediaId;

        const updated = newsList.map(
          (item) =>
            item.id === editingId
              ? {
                  ...item,
                  text: cleanText,
                  visible,
                  startDate,
                  endDate,
                  mediaType:
                    mediaType === "none"
                      ? undefined
                      : mediaType,
                  mediaId:
                    mediaId ||
                    (mediaType !== "none"
                      ? item.mediaId
                      : undefined),
                }
              : item
        );

        saveNewsList(updated);

        /*
         * Delete old media only after the
         * new media has been saved successfully.
         */
        if (
          mediaId &&
          oldMediaId &&
          oldMediaId !== mediaId
        ) {
          try {
            await deleteMedia(oldMediaId);
          } catch {
            // Keep old media if cleanup fails.
          }
        }

        if (
          mediaType === "none" &&
          oldMediaId
        ) {
          try {
            await deleteMedia(oldMediaId);
          } catch {
            // Ignore cleanup error.
          }
        }
      } else {
        /*
         * New news
         */
        const newNews: BreakingNews = {
          id: Date.now(),
          text: cleanText,
          visible,
          startDate,
          endDate,
          mediaType:
            mediaType === "none"
              ? undefined
              : mediaType,
          mediaId,
        };

        saveNewsList([
          newNews,
          ...newsList,
        ]);
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

      resetForm();
    } catch (error) {
      console.error(error);

      setMediaError(
        error instanceof Error
          ? error.message
          : "Could not save the breaking news."
      );
    } finally {
      setUploadingMedia(false);
    }
  };

  const editNews = async (
    item: BreakingNews
  ) => {
    setEditingId(item.id);
    setText(item.text);
    setVisible(item.visible);
    setStartDate(item.startDate);
    setEndDate(item.endDate);

    setMediaType(
      item.mediaType || "none"
    );

    setMediaError("");
    setSelectedFile(null);

    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
    }

    setSelectedPreview("");
    setExistingMediaUrl("");

    if (item.mediaId) {
      try {
        const media =
          await getMedia(item.mediaId);

        if (media) {
          const url = URL.createObjectURL(
            media.blob
          );

          setExistingMediaUrl(url);
        }
      } catch (error) {
        console.error(error);
      }
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNews = async (
    id: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this breaking news?"
      );

    if (!confirmDelete) return;

    const item = newsList.find(
      (news) => news.id === id
    );

    saveNewsList(
      newsList.filter(
        (news) => news.id !== id
      )
    );

    if (item?.mediaId) {
      try {
        await deleteMedia(item.mediaId);
      } catch (error) {
        console.error(error);
      }
    }

    if (editingId === id) {
      resetForm();
    }
  };

  const toggleVisibility = (
    id: number
  ) => {
    const updated = newsList.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              visible: !item.visible,
            }
          : item
    );

    saveNewsList(updated);
  };

  const activeNews = useMemo(() => {
    const now = new Date();

    return newsList.filter((item) => {
      if (!item.visible) return false;

      if (item.startDate) {
        const start = new Date(
          `${item.startDate}T00:00:00`
        );

        if (now < start) return false;
      }

      if (item.endDate) {
        const end = new Date(
          `${item.endDate}T23:59:59`
        );

        if (now > end) return false;
      }

      return true;
    });
  }, [newsList]);

  useEffect(() => {
    let cancelled = false;

    const loadMediaPreviews = async () => {
      const nextUrls: Record<
        number,
        string
      > = {};

      for (const item of newsList) {
        if (!item.mediaId) continue;

        try {
          const media =
            await getMedia(item.mediaId);

          if (
            media &&
            !cancelled
          ) {
            nextUrls[item.id] =
              URL.createObjectURL(
                media.blob
              );
          }
        } catch {
          // Ignore missing media.
        }
      }

      if (!cancelled) {
        setPreviewUrls(nextUrls);
      } else {
        Object.values(nextUrls).forEach(
          (url) => URL.revokeObjectURL(url)
        );
      }
    };

    loadMediaPreviews();

    return () => {
      cancelled = true;
    };
  }, [newsList]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090706] text-white">
      {/* Luxury Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(194,122,45,0.20),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(117,55,25,0.22),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(95,45,18,0.18),transparent_38%)]" />

        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="absolute right-[-180px] top-[10%] h-[500px] w-[500px] rounded-full bg-orange-700/10 blur-[130px]" />

        <div className="absolute bottom-[-220px] left-[35%] h-[520px] w-[520px] rounded-full bg-yellow-700/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-6xl">

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mb-3 inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-1.5 text-xs font-medium tracking-wide text-amber-200 backdrop-blur-xl">
              NABABI RISTORANTE
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Breaking News Management
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Create announcements with text,
              images or videos.
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-[30px] border border-amber-200/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[410px_1fr]">

              {/* Form */}
              <section className="rounded-[26px] border border-white/10 bg-black/20 p-5">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">
                    {editingId !== null
                      ? "Edit News"
                      : "Add Breaking News"}
                  </h2>

                  <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* Text */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      News Text
                    </label>

                    <textarea
                      rows={5}
                      value={text}
                      onChange={(e) =>
                        setText(e.target.value)
                      }
                      placeholder="Write your breaking news or announcement..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/50 focus:bg-white/[0.07]"
                    />
                  </div>

                  {/* Media Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Breaking News Media
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleMediaTypeChange(
                            "none"
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                          mediaType === "none"
                            ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
                            : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                        }`}
                      >
                        📝 Text
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleMediaTypeChange(
                            "image"
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                          mediaType === "image"
                            ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
                            : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                        }`}
                      >
                        🖼️ Image
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleMediaTypeChange(
                            "video"
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                          mediaType === "video"
                            ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
                            : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                        }`}
                      >
                        🎥 Video
                      </button>
                    </div>
                  </div>

                  {/* Media Upload */}
                  {mediaType !== "none" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/85">
                        {mediaType === "image"
                          ? "Upload Image"
                          : "Upload Video"}
                      </label>

                      <label className="block cursor-pointer rounded-2xl border border-dashed border-amber-300/20 bg-amber-400/[0.035] p-4 transition hover:border-amber-300/40 hover:bg-amber-400/[0.06]">
                        <input
                          type="file"
                          hidden
                          accept={
                            mediaType ===
                            "image"
                              ? "image/jpeg,image/png,image/webp"
                              : "video/mp4,video/webm,video/quicktime"
                          }
                          onChange={
                            handleFileChange
                          }
                        />

                        <div className="text-center">
                          <div className="mb-2 text-3xl">
                            {mediaType ===
                            "image"
                              ? "🖼️"
                              : "🎥"}
                          </div>

                          <p className="text-sm font-medium text-white/80">
                            Click to choose{" "}
                            {mediaType}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {mediaType ===
                            "image"
                              ? "JPG, PNG, WEBP — Maximum 8MB"
                              : "MP4, WEBM, MOV — Maximum 50MB"}
                          </p>
                        </div>
                      </label>

                      {/* Selected Preview */}
                      {(selectedPreview ||
                        existingMediaUrl) && (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                          {mediaType ===
                            "image" && (
                            <img
                              src={
                                selectedPreview ||
                                existingMediaUrl
                              }
                              alt="Selected media preview"
                              className="max-h-64 w-full object-cover"
                            />
                          )}

                          {mediaType ===
                            "video" && (
                            <video
                              src={
                                selectedPreview ||
                                existingMediaUrl
                              }
                              controls
                              playsInline
                              className="max-h-64 w-full bg-black object-contain"
                            />
                          )}

                          {selectedFile && (
                            <div className="border-t border-white/10 px-3 py-2 text-xs text-white/50">
                              {selectedFile.name}{" "}
                              •{" "}
                              {formatFileSize(
                                selectedFile.size
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {mediaError && (
                        <div className="mt-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                          {mediaError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/85">
                        Start Date
                      </label>

                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                          setStartDate(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/85">
                        End Date
                      </label>

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                          setEndDate(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">
                        Show on Website
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Display this news to visitors
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setVisible(!visible)
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        visible
                          ? "bg-amber-500"
                          : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
                          visible
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={uploadingMedia}
                      className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploadingMedia
                        ? "Saving..."
                        : editingId !== null
                        ? "Update News"
                        : "Save News"}
                    </button>

                    {editingId !== null && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {saved && (
                    <div className="rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-200">
                      Breaking news saved successfully.
                    </div>
                  )}
                </form>
              </section>

              {/* News List */}
              <section className="rounded-[26px] border border-white/10 bg-black/20 p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      News List
                    </h2>

                    <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                  </div>

                  <div className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-200">
                    Active:{" "}
                    {activeNews.length}
                  </div>
                </div>

                {/* Live Preview */}
                {activeNews.length > 0 && (
                  <div className="mb-5 overflow-hidden rounded-2xl border border-amber-400/20 bg-black/30">
                    <div className="border-b border-white/10 bg-amber-400/[0.06] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15">
                          🔔
                        </span>

                        <span className="text-sm font-semibold text-amber-100">
                          Live Website Preview
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      {activeNews[0].mediaType ===
                        "image" &&
                        activeNews[0].mediaId &&
                        previewUrls[
                          activeNews[0].id
                        ] && (
                          <img
                            src={
                              previewUrls[
                                activeNews[0].id
                              ]
                            }
                            alt="Breaking news"
                            className="mb-4 max-h-72 w-full rounded-xl object-cover"
                          />
                        )}

                      {activeNews[0].mediaType ===
                        "video" &&
                        activeNews[0].mediaId &&
                        previewUrls[
                          activeNews[0].id
                        ] && (
                          <video
                            src={
                              previewUrls[
                                activeNews[0].id
                              ]
                            }
                            controls
                            playsInline
                            className="mb-4 max-h-72 w-full rounded-xl bg-black object-contain"
                          />
                        )}

                      {activeNews[0].text && (
                        <p className="text-sm leading-6 text-white/75">
                          {
                            activeNews[0]
                              .text
                          }
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {newsList.length === 0 ? (
                  <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025]">
                    <div className="text-center">
                      <div className="mb-3 text-4xl">
                        📢
                      </div>

                      <p className="text-sm font-medium text-white/80">
                        No breaking news yet
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        Add text, image or video.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsList.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-amber-300/20"
                        >
                          {/* Media */}
                          {item.mediaType ===
                            "image" &&
                            item.mediaId &&
                            previewUrls[
                              item.id
                            ] && (
                              <img
                                src={
                                  previewUrls[
                                    item.id
                                  ]
                                }
                                alt="Breaking news media"
                                className="max-h-72 w-full object-cover"
                              />
                            )}

                          {item.mediaType ===
                            "video" &&
                            item.mediaId &&
                            previewUrls[
                              item.id
                            ] && (
                              <video
                                src={
                                  previewUrls[
                                    item.id
                                  ]
                                }
                                controls
                                playsInline
                                className="max-h-72 w-full bg-black object-contain"
                              />
                            )}

                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                                {item.mediaType ===
                                "image"
                                  ? "🖼️"
                                  : item.mediaType ===
                                    "video"
                                  ? "🎥"
                                  : "📢"}
                              </div>

                              <div className="min-w-0 flex-1">
                                {item.text && (
                                  <p className="text-sm leading-6 text-white/85">
                                    {item.text}
                                  </p>
                                )}

                                {!item.text && (
                                  <p className="text-sm text-white/40">
                                    Media-only breaking news
                                  </p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[11px] ${
                                      item.visible
                                        ? "bg-green-500/15 text-green-200"
                                        : "bg-red-500/15 text-red-200"
                                    }`}
                                  >
                                    {item.visible
                                      ? "Visible"
                                      : "Hidden"}
                                  </span>

                                  {item.mediaType &&
                                    item.mediaType !==
                                      "none" && (
                                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-200">
                                        {item.mediaType ===
                                        "image"
                                          ? "Image"
                                          : "Video"}
                                      </span>
                                    )}

                                  {item.startDate && (
                                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/40">
                                      Start:{" "}
                                      {
                                        item.startDate
                                      }
                                    </span>
                                  )}

                                  {item.endDate && (
                                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/40">
                                      End:{" "}
                                      {
                                        item.endDate
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-2 border-t border-white/10 pt-3">
                              <button
                                type="button"
                                onClick={() =>
                                  editNews(
                                    item
                                  )
                                }
                                className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleVisibility(
                                    item.id
                                  )
                                }
                                className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10"
                              >
                                {item.visible
                                  ? "Hide"
                                  : "Show"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteNews(
                                    item.id
                                  )
                                }
                                className="flex-1 rounded-lg border border-red-400/10 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
