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
const TARGET_IMAGE_SIZE = 500 * 1024;

const SUPPORTED_IMAGES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const SUPPORTED_VIDEOS = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

/* =========================================================
   INDEXEDDB
========================================================= */

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(
      MEDIA_DB_NAME,
      MEDIA_DB_VERSION
    );

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
        request.error ||
          new Error("Could not open media database.")
      );
    };
  });
}

async function saveMedia(media: StoredMedia): Promise<void> {
  const db = await openMediaDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      MEDIA_STORE_NAME,
      "readwrite"
    );

    transaction.objectStore(MEDIA_STORE_NAME).put(media);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error = transaction.error;
      db.close();

      reject(
        error || new Error("Could not save media.")
      );
    };

    transaction.onabort = () => {
      const error = transaction.error;
      db.close();

      reject(
        error || new Error("Media save was aborted.")
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

    const request = transaction
      .objectStore(MEDIA_STORE_NAME)
      .get(id);

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

    transaction
      .objectStore(MEDIA_STORE_NAME)
      .delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error = transaction.error;
      db.close();

      reject(
        error || new Error("Could not delete media.")
      );
    };
  });
}

/* =========================================================
   HELPERS
========================================================= */

function createMediaId() {
  return (
    "breaking-media-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}

function createNewsId() {
  return Date.now();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

/* =========================================================
   FILE READER
========================================================= */

function readFileWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );

        onProgress(percent);
      }
    };

    reader.onload = () => {
      onProgress(100);

      if (!(reader.result instanceof ArrayBuffer)) {
        reject(
          new Error("Could not read the selected file.")
        );

        return;
      }

      resolve(
        new Blob([reader.result], {
          type: file.type,
        })
      );
    };

    reader.onerror = () => {
      reject(
        reader.error ||
          new Error("Could not read the selected file.")
      );
    };

    reader.onabort = () => {
      reject(
        new Error("File reading was cancelled.")
      );
    };

    reader.readAsArrayBuffer(file);
  });
}

/* =========================================================
   IMAGE COMPRESSION
========================================================= */

async function compressImage(
  file: File,
  onProgress: (percent: number) => void
): Promise<Blob> {
  onProgress(5);

  const objectUrl = URL.createObjectURL(file);

  try {
    const image =
      await new Promise<HTMLImageElement>(
        (resolve, reject) => {
          const img = new Image();

          img.onload = () => resolve(img);

          img.onerror = () =>
            reject(
              new Error(
                "The selected image could not be opened."
              )
            );

          img.src = objectUrl;
        }
      );

    onProgress(20);

    const maxWidth = 1400;
    const maxHeight = 1400;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (
      width > maxWidth ||
      height > maxHeight
    ) {
      const ratio = Math.min(
        maxWidth / width,
        maxHeight / height
      );

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Could not prepare the image."
      );
    }

    context.fillStyle = "#ffffff";

    context.fillRect(
      0,
      0,
      width,
      height
    );

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    onProgress(40);

    const qualities = [
      0.82,
      0.74,
      0.66,
      0.58,
      0.50,
      0.42,
      0.34,
    ];

    for (
      let index = 0;
      index < qualities.length;
      index++
    ) {
      const quality =
        qualities[index];

      const blob =
        await new Promise<Blob | null>(
          (resolve) => {
            canvas.toBlob(
              resolve,
              "image/jpeg",
              quality
            );
          }
        );

      if (!blob) continue;

      const progress =
        45 +
        Math.round(
          ((index + 1) /
            qualities.length) *
            45
        );

      onProgress(progress);

      if (
        blob.size <=
        TARGET_IMAGE_SIZE
      ) {
        onProgress(95);

        return blob;
      }
    }

    const finalBlob =
      await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.28
          );
        }
      );

    if (!finalBlob) {
      throw new Error(
        "Image compression failed."
      );
    }

    onProgress(95);

    return finalBlob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BreakingNewsPage() {
  const [newsList, setNewsList] =
    useState<BreakingNews[]>([]);

  const [text, setText] =
    useState("");

  const [visible, setVisible] =
    useState(true);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [saved, setSaved] =
    useState(false);

  const [mediaType, setMediaType] =
    useState<MediaType>("none");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [selectedPreview, setSelectedPreview] =
    useState("");

  const [existingMediaUrl, setExistingMediaUrl] =
    useState("");

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [uploadStage, setUploadStage] =
    useState("");

  const [mediaError, setMediaError] =
    useState("");

  const [previewUrls, setPreviewUrls] =
    useState<Record<number, string>>({});

  /* =========================================================
     LOAD NEWS
  ========================================================= */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!stored) return;

      const parsed =
        JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setNewsList(parsed);
      }
    } catch {
      setNewsList([]);
    }
  }, []);

  /* =========================================================
     CLEAN PREVIEW URLS WHEN COMPONENT UNMOUNTS
  ========================================================= */

  useEffect(() => {
    return () => {
      if (selectedPreview) {
        URL.revokeObjectURL(
          selectedPreview
        );
      }

      if (existingMediaUrl) {
        URL.revokeObjectURL(
          existingMediaUrl
        );
      }

      Object.values(
        previewUrls
      ).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  /* =========================================================
     SAVE LIST
  ========================================================= */

  const saveNewsList = (
    nextList: BreakingNews[]
  ) => {
    setNewsList(nextList);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextList)
    );
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetForm = () => {
    if (selectedPreview) {
      URL.revokeObjectURL(
        selectedPreview
      );
    }

    if (existingMediaUrl) {
      URL.revokeObjectURL(
        existingMediaUrl
      );
    }

    setText("");
    setVisible(true);
    setStartDate("");
    setEndDate("");

    setEditingId(null);

    setMediaType("none");

    setSelectedFile(null);
    setSelectedPreview("");
    setExistingMediaUrl("");

    setUploadProgress(0);
    setUploadStage("");
    setMediaError("");
  };

  /* =========================================================
     MEDIA TYPE
  ========================================================= */

  const selectMediaType = (
    type: MediaType
  ) => {
    if (selectedPreview) {
      URL.revokeObjectURL(
        selectedPreview
      );
    }

    if (existingMediaUrl) {
      URL.revokeObjectURL(
        existingMediaUrl
      );
    }

    setMediaType(type);

    setSelectedFile(null);
    setSelectedPreview("");
    setExistingMediaUrl("");

    setUploadProgress(0);
    setUploadStage("");
    setMediaError("");
  };

  /* =========================================================
     FILE CHANGE
  ========================================================= */

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setMediaError("");
    setUploadProgress(0);

    if (mediaType === "image") {
      if (
        !SUPPORTED_IMAGES.includes(
          file.type
        )
      ) {
        setMediaError(
          "Only JPG, PNG and WEBP images are supported."
        );

        e.target.value = "";
        return;
      }

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        setMediaError(
          `Image is too large. Maximum 8MB. Selected: ${formatFileSize(
            file.size
          )}`
        );

        e.target.value = "";
        return;
      }
    }

    if (mediaType === "video") {
      if (
        !SUPPORTED_VIDEOS.includes(
          file.type
        )
      ) {
        setMediaError(
          "Only MP4, WEBM and MOV videos are supported."
        );

        e.target.value = "";
        return;
      }

      if (
        file.size >
        MAX_VIDEO_SIZE
      ) {
        setMediaError(
          `Video is too large. Maximum 50MB. Selected: ${formatFileSize(
            file.size
          )}`
        );

        e.target.value = "";
        return;
      }
    }

    if (selectedPreview) {
      URL.revokeObjectURL(
        selectedPreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setSelectedPreview(preview);

    setUploadStage(
      "File selected — ready to upload"
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanText =
      text.trim();

    if (
      !cleanText &&
      mediaType === "none"
    ) {
      alert(
        "Please enter breaking news text or upload an image/video."
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

    setUploading(true);
    setSaved(false);
    setMediaError("");

    setUploadProgress(
      mediaType === "none"
        ? 50
        : 0
    );

    try {
      let mediaId:
        | string
        | undefined;

      /* =====================================================
         SAVE MEDIA
      ===================================================== */

      if (
        selectedFile &&
        mediaType !== "none"
      ) {
        mediaId =
          createMediaId();

        let blobToSave: Blob;

        if (
          mediaType === "image"
        ) {
          setUploadStage(
            "Compressing image..."
          );

          blobToSave =
            await compressImage(
              selectedFile,
              (progress) => {
                setUploadProgress(
                  progress
                );
              }
            );
        } else {
          setUploadStage(
            "Reading video..."
          );

          blobToSave =
            await readFileWithProgress(
              selectedFile,
              (progress) => {
                setUploadProgress(
                  progress
                );
              }
            );
        }

        setUploadProgress(96);

        setUploadStage(
          "Saving media..."
        );

        await saveMedia({
          id: mediaId,
          blob: blobToSave,
          type: mediaType,
          name: selectedFile.name,
        });

        setUploadProgress(100);

        setUploadStage(
          "Upload complete"
        );
      }

      /* =====================================================
         EDIT EXISTING NEWS
      ===================================================== */

      if (
        editingId !== null
      ) {
        const oldItem =
          newsList.find(
            (item) =>
              item.id ===
              editingId
          );

        const oldMediaId =
          oldItem?.mediaId;

        const updated =
          newsList.map(
            (item) =>
              item.id ===
              editingId
                ? {
                    ...item,
                    text: cleanText,
                    visible,
                    startDate,
                    endDate,
                    mediaType:
                      mediaType ===
                      "none"
                        ? undefined
                        : mediaType,
                    mediaId:
                      mediaId ||
                      (mediaType !==
                      "none"
                        ? item.mediaId
                        : undefined),
                  }
                : item
          );

        saveNewsList(updated);

        if (
          mediaId &&
          oldMediaId &&
          oldMediaId !== mediaId
        ) {
          try {
            await deleteMedia(
              oldMediaId
            );
          } catch {
            // Ignore cleanup errors.
          }
        }

        if (
          mediaType ===
            "none" &&
          oldMediaId
        ) {
          try {
            await deleteMedia(
              oldMediaId
            );
          } catch {
            // Ignore cleanup errors.
          }
        }
      } else {
        /* ===================================================
           NEW NEWS
        =================================================== */

        const newNews:
          BreakingNews = {
          id: createNewsId(),
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

      setUploadProgress(100);
      setUploadStage(
        "Successfully saved"
      );

      setSaved(true);

      setTimeout(() => {
        resetForm();
      }, 700);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(error);

      setMediaError(
        error instanceof Error
          ? error.message
          : "Could not save breaking news."
      );

      setUploadStage(
        "Upload failed"
      );
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 800);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

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
    setUploadProgress(0);
    setUploadStage("");

    setSelectedFile(null);

    if (selectedPreview) {
      URL.revokeObjectURL(
        selectedPreview
      );
    }

    if (existingMediaUrl) {
      URL.revokeObjectURL(
        existingMediaUrl
      );
    }

    setSelectedPreview("");
    setExistingMediaUrl("");

    if (item.mediaId) {
      try {
        const media =
          await getMedia(
            item.mediaId
          );

        if (media) {
          const url =
            URL.createObjectURL(
              media.blob
            );

          setExistingMediaUrl(
            url
          );
        }
      } catch (error) {
        console.error(error);

        setMediaError(
          "Could not load the existing media."
        );
      }
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteNews = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this breaking news?"
      );

    if (!confirmed) return;

    const item =
      newsList.find(
        (news) =>
          news.id === id
      );

    saveNewsList(
      newsList.filter(
        (news) =>
          news.id !== id
      )
    );

    if (item?.mediaId) {
      try {
        await deleteMedia(
          item.mediaId
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (editingId === id) {
      resetForm();
    }
  };

  /* =========================================================
     VISIBILITY
  ========================================================= */

  const toggleVisibility = (
    id: number
  ) => {
    const updated =
      newsList.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                visible:
                  !item.visible,
              }
            : item
      );

    saveNewsList(updated);
  };

  /* =========================================================
     ACTIVE NEWS
  ========================================================= */

  const activeNews =
    useMemo(() => {
      const now =
        new Date();

      return newsList.filter(
        (item) => {
          if (!item.visible) {
            return false;
          }

          if (item.startDate) {
            const start =
              new Date(
                `${item.startDate}T00:00:00`
              );

            if (now < start) {
              return false;
            }
          }

          if (item.endDate) {
            const end =
              new Date(
                `${item.endDate}T23:59:59`
              );

            if (now > end) {
              return false;
            }
          }

          return true;
        }
      );
    }, [newsList]);

  /* =========================================================
     LOAD MEDIA PREVIEWS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadPreviews =
      async () => {
        const nextUrls: Record<
          number,
          string
        > = {};

        for (const item of newsList) {
          if (!item.mediaId) {
            continue;
          }

          try {
            const media =
              await getMedia(
                item.mediaId
              );

            if (
              media &&
              !cancelled
            ) {
              nextUrls[
                item.id
              ] =
                URL.createObjectURL(
                  media.blob
                );
            }
          } catch {
            // Missing media is ignored.
          }
        }

        if (cancelled) {
          Object.values(
            nextUrls
          ).forEach((url) =>
            URL.revokeObjectURL(url)
          );

          return;
        }

        setPreviewUrls(
          (previous) => {
            Object.entries(
              previous
            ).forEach(
              ([id, url]) => {
                const numericId =
                  Number(id);

                if (
                  !nextUrls[
                    numericId
                  ]
                ) {
                  URL.revokeObjectURL(
                    url
                  );
                }
              }
            );

            return nextUrls;
          }
        );
      };

    loadPreviews();

    return () => {
      cancelled = true;
    };
  }, [newsList]);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080706] text-white">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_90%_15%,rgba(234,88,12,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(120,53,15,0.16),transparent_35%)]" />

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[130px]" />

        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] rounded-full bg-yellow-700/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">

        <div className="w-full max-w-6xl">

          {/* HEADER */}
          <div className="mb-7 text-center">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-5 py-2 text-xs font-semibold tracking-widest text-amber-200 backdrop-blur-xl">
              <span>✦</span>
              NABABI RISTORANTE
              <span>✦</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Breaking News
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Manage text, images and videos
              for your website.
            </p>
          </div>

          {/* MAIN CARD */}
          <div className="rounded-[32px] border border-amber-200/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-7">

            <div className="grid gap-6 lg:grid-cols-[410px_1fr]">

              {/* LEFT */}
              <section className="rounded-[26px] border border-white/10 bg-black/25 p-5">

                <div className="mb-6">

                  <h2 className="text-xl font-semibold">
                    {editingId !== null
                      ? "Edit Breaking News"
                      : "Add Breaking News"}
                  </h2>

                  <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* TEXT */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-white/80">
                      News Text
                    </label>

                    <textarea
                      rows={5}
                      value={text}
                      onChange={(e) =>
                        setText(
                          e.target.value
                        )
                      }
                      placeholder="Write your breaking news..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/50 focus:bg-white/[0.055]"
                    />

                  </div>

                  {/* NEWS TYPE */}
                  <div>

                    <label className="mb-3 block text-sm font-medium text-white/80">
                      Choose News Type
                    </label>

                    <div className="grid grid-cols-3 gap-2">

                      {/* TEXT */}
                      <button
                        type="button"
                        onClick={() =>
                          selectMediaType(
                            "none"
                          )
                        }
                        className={`group rounded-2xl border p-4 transition ${
                          mediaType ===
                          "none"
                            ? "border-amber-400/50 bg-amber-400/10 shadow-lg shadow-amber-900/10"
                            : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >

                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-2xl">
                          📝
                        </div>

                        <p className="text-xs font-medium">
                          Text
                        </p>

                      </button>

                      {/* IMAGE */}
                      <button
                        type="button"
                        onClick={() =>
                          selectMediaType(
                            "image"
                          )
                        }
                        className={`group rounded-2xl border p-4 transition ${
                          mediaType ===
                          "image"
                            ? "border-amber-400/50 bg-amber-400/10 shadow-lg shadow-amber-900/10"
                            : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >

                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
                          🖼️
                        </div>

                        <p className="text-xs font-medium">
                          Image
                        </p>

                      </button>

                      {/* VIDEO */}
                      <button
                        type="button"
                        onClick={() =>
                          selectMediaType(
                            "video"
                          )
                        }
                        className={`group rounded-2xl border p-4 transition ${
                          mediaType ===
                          "video"
                            ? "border-amber-400/50 bg-amber-400/10 shadow-lg shadow-amber-900/10"
                            : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >

                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
                          🎬
                        </div>

                        <p className="text-xs font-medium">
                          Video
                        </p>

                      </button>

                    </div>
                  </div>

                  {/* UPLOAD */}
                  {mediaType !==
                    "none" && (
                    <div>

                      <label className="mb-2 block text-sm font-medium text-white/80">
                        {mediaType ===
                        "image"
                          ? "Upload Breaking News Image"
                          : "Upload Breaking News Video"}
                      </label>

                      <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-amber-400/20 bg-gradient-to-br from-amber-400/[0.04] to-orange-500/[0.02] p-5 transition hover:border-amber-400/40 hover:bg-amber-400/[0.07]">

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

                          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-4xl shadow-inner">
                            {mediaType ===
                            "image"
                              ? "📷"
                              : "🎥"}
                          </div>

                          <p className="text-sm font-semibold text-white/85">
                            Click here to upload
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {mediaType ===
                            "image"
                              ? "JPG, PNG, WEBP"
                              : "MP4, WEBM, MOV"}
                          </p>

                          <p className="mt-2 text-[11px] text-amber-200/50">
                            {mediaType ===
                            "image"
                              ? "Maximum 8MB"
                              : "Maximum 50MB"}
                          </p>

                        </div>
                      </label>

                      {/* SELECTED FILE */}
                      {selectedFile && (
                        <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                              {mediaType ===
                              "image"
                                ? "🖼️"
                                : "🎬"}
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-xs font-medium text-white/80">
                                {
                                  selectedFile.name
                                }
                              </p>

                              <p className="mt-1 text-[11px] text-white/40">
                                {formatFileSize(
                                  selectedFile.size
                                )}
                              </p>

                            </div>

                            <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] text-green-300">
                              Ready
                            </span>

                          </div>
                        </div>
                      )}

                      {/* PREVIEW */}
                      {(selectedPreview ||
                        existingMediaUrl) && (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">

                          {mediaType ===
                            "image" && (
                            <img
                              src={
                                selectedPreview ||
                                existingMediaUrl
                              }
                              alt="Breaking news preview"
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

                        </div>
                      )}

                      {/* PROGRESS */}
                      {uploading && (
                        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-4">

                          <div className="mb-2 flex items-center justify-between">

                            <div className="flex items-center gap-2">

                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-sm">
                                ⬆️
                              </span>

                              <span className="text-xs font-medium text-white/75">
                                {uploadStage ||
                                  "Uploading..."}
                              </span>

                            </div>

                            <span className="text-sm font-bold text-amber-300">
                              {uploadProgress}%
                            </span>

                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-white/10">

                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transition-all duration-300"
                              style={{
                                width: `${uploadProgress}%`,
                              }}
                            />

                          </div>

                          <div className="mt-2 flex justify-between text-[10px] text-white/35">
                            <span>
                              0%
                            </span>

                            <span>
                              {uploadProgress <
                              100
                                ? "Uploading..."
                                : "Complete"}
                            </span>

                            <span>
                              100%
                            </span>
                          </div>

                        </div>
                      )}

                      {/* ERROR */}
                      {mediaError && (
                        <div className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-200">
                          ⚠️ {mediaError}
                        </div>
                      )}

                    </div>
                  )}

                  {/* DATES */}
                  <div className="grid gap-3 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-xs font-medium text-white/70">
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
                        className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-medium text-white/70">
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
                        className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                      />

                    </div>

                  </div>

                  {/* VISIBILITY */}
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">

                    <div>

                      <p className="text-sm font-medium">
                        Show on Website
                      </p>

                      <p className="mt-1 text-[11px] text-white/35">
                        Display this breaking news
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setVisible(
                          !visible
                        )
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        visible
                          ? "bg-amber-500"
                          : "bg-white/20"
                      }`}
                    >

                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                          visible
                            ? "left-6"
                            : "left-1"
                        }`}
                      />

                    </button>

                  </div>

                  {/* SAVE */}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {uploading ? (
                      <>
                        <span className="animate-spin">
                          ◌
                        </span>

                        Uploading{" "}
                        {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <span>
                          {mediaType ===
                          "image"
                            ? "🖼️"
                            : mediaType ===
                              "video"
                            ? "🎬"
                            : "📢"}
                        </span>

                        {editingId !==
                        null
                          ? "Update Breaking News"
                          : "Upload & Save Breaking News"}
                      </>
                    )}

                  </button>

                  {/* CANCEL */}
                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={
                        resetForm
                      }
                      disabled={
                        uploading
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm text-white/65 transition hover:bg-white/[0.07]"
                    >
                      Cancel Edit
                    </button>
                  )}

                  {/* SUCCESS */}
                  {saved && (
                    <div className="rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-200">
                      ✓ Breaking news uploaded successfully.
                    </div>
                  )}

                </form>
              </section>

              {/* RIGHT */}
              <section className="rounded-[26px] border border-white/10 bg-black/25 p-5">

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <h2 className="text-xl font-semibold">
                      News List
                    </h2>

                    <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

                  </div>

                  <div className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-200">
                    Active:{" "}
                    {activeNews.length}
                  </div>

                </div>

                {/* LIVE PREVIEW */}
                {activeNews.length >
                  0 && (
                  <div className="mb-5 overflow-hidden rounded-2xl border border-amber-400/20 bg-black/30">

                    <div className="flex items-center gap-2 border-b border-white/10 bg-amber-500/[0.06] px-4 py-3">

                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
                        🚨
                      </span>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                          Live Preview
                        </p>

                        <p className="text-[10px] text-white/35">
                          Currently visible
                        </p>

                      </div>

                    </div>

                    <div className="p-4">

                      {activeNews[0]
                        .mediaType ===
                        "image" &&
                        activeNews[0]
                          .mediaId &&
                        previewUrls[
                          activeNews[0]
                            .id
                        ] && (
                          <img
                            src={
                              previewUrls[
                                activeNews[0]
                                  .id
                              ]
                            }
                            alt="Breaking news"
                            className="mb-4 max-h-72 w-full rounded-xl object-cover"
                          />
                        )}

                      {activeNews[0]
                        .mediaType ===
                        "video" &&
                        activeNews[0]
                          .mediaId &&
                        previewUrls[
                          activeNews[0]
                            .id
                        ] && (
                          <video
                            src={
                              previewUrls[
                                activeNews[0]
                                  .id
                              ]
                            }
                            controls
                            playsInline
                            className="mb-4 max-h-72 w-full rounded-xl bg-black object-contain"
                          />
                        )}

                      {activeNews[0]
                        .text && (
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

                {/* EMPTY */}
                {newsList.length ===
                0 ? (
                  <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">

                    <div className="text-center">

                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-4xl">
                        📢
                      </div>

                      <p className="text-sm font-semibold text-white/75">
                        No Breaking News
                      </p>

                      <p className="mt-2 text-xs text-white/35">
                        Upload text, image or video
                        from the left panel.
                      </p>

                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {newsList.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-amber-300/20"
                        >

                          {/* MEDIA */}
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
                                alt="Breaking news"
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

                            <div className="flex gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                                {item.mediaType ===
                                "image"
                                  ? "🖼️"
                                  : item.mediaType ===
                                    "video"
                                  ? "🎬"
                                  : "📢"}
                              </div>

                              <div className="min-w-0 flex-1">

                                {item.text ? (
                                  <p className="text-sm leading-6 text-white/80">
                                    {
                                      item.text
                                    }
                                  </p>
                                ) : (
                                  <p className="text-sm text-white/35">
                                    Media-only breaking news
                                  </p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-2">

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] ${
                                      item.visible
                                        ? "bg-green-500/10 text-green-200"
                                        : "bg-red-500/10 text-red-200"
                                    }`}
                                  >
                                    {item.visible
                                      ? "Visible"
                                      : "Hidden"}
                                  </span>

                                  {item.mediaType &&
                                    item.mediaType !==
                                      "none" && (
                                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-200">
                                        {item.mediaType ===
                                        "image"
                                          ? "🖼️ Image"
                                          : "🎬 Video"}
                                      </span>
                                    )}

                                  {item.startDate && (
                                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/35">
                                      Start:{" "}
                                      {
                                        item.startDate
                                      }
                                    </span>
                                  )}

                                  {item.endDate && (
                                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/35">
                                      End:{" "}
                                      {
                                        item.endDate
                                      }
                                    </span>
                                  )}

                                </div>
                              </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">

                              <button
                                type="button"
                                onClick={() =>
                                  editNews(
                                    item
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
                              >
                                ✏️ Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleVisibility(
                                    item.id
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
                              >
                                {item.visible
                                  ? "👁️ Hide"
                                  : "👁️ Show"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteNews(
                                    item.id
                                  )
                                }
                                className="rounded-xl border border-red-400/10 bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                              >
                                🗑️ Delete
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
