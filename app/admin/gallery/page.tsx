"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
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

type StoredGalleryItem = {
  id: number;
  imageBlob: Blob;
  category: string;
  visible: boolean;
  order: number;
};

type SelectedImage = {
  id: number;
  file: File;
  preview: string;
};

const STORAGE_KEY = "nababi-gallery";

const DB_NAME = "nababi-gallery-db";
const DB_VERSION = 1;
const STORE_NAME = "gallery";

/*
 * We keep the existing database/store/schema.
 * Only the image data is compressed before saving.
 */

const MAX_FILE_SIZE = 15 * 1024 * 1024;

/*
 * Target is deliberately below 500 KB.
 * This gives a little safety margin for IndexedDB overhead.
 */
const TARGET_IMAGE_BYTES = 480 * 1024;

const MAX_IMAGE_WIDTH = 1280;
const MIN_IMAGE_WIDTH = 480;

const GOLD = "#d9a441";
const GOLD_LIGHT = "#f6cf70";
const BG = "#070707";
const CARD = "#101010";
const BORDER = "rgba(217,164,65,0.25)";
const TEXT = "#f5f1e8";
const MUTED = "#a9a39a";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function createId() {
  const random =
    typeof crypto !== "undefined" &&
    "getRandomValues" in crypto
      ? (() => {
          const array = new Uint32Array(1);
          crypto.getRandomValues(array);
          return array[0] % 1000;
        })()
      : Math.floor(Math.random() * 1000);

  return Date.now() * 1000 + random;
}

function isQuotaError(error: unknown) {
  if (!error) return false;

  const name =
    typeof error === "object" &&
    error !== null &&
    "name" in error
      ? String(
          (error as { name?: unknown }).name || ""
        )
      : "";

  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error
      ? String(
          (error as { message?: unknown }).message || ""
        )
      : String(error);

  return (
    name === "QuotaExceededError" ||
    /quota|storage|space|disk/i.test(message)
  );
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* -------------------------------------------------------------------------- */
/* IndexedDB                                                                  */
/* -------------------------------------------------------------------------- */

function openGalleryDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (
      typeof window === "undefined" ||
      !("indexedDB" in window)
    ) {
      reject(
        new Error(
          "IndexedDB is not supported in this browser."
        )
      );
      return;
    }

    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (
        !db.objectStoreNames.contains(
          STORE_NAME
        )
      ) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        db.close();
      };

      resolve(db);
    };

    request.onerror = () => {
      reject(
        request.error ||
          new Error(
            "Could not open the gallery database."
          )
      );
    };

    request.onblocked = () => {
      reject(
        new Error(
          "Gallery database is blocked. Please close another Nababi admin tab and try again."
        )
      );
    };
  });
}

function getAllStoredItems(): Promise<
  StoredGalleryItem[]
> {
  return new Promise(async (resolve, reject) => {
    let db: IDBDatabase | null = null;

    try {
      db = await openGalleryDB();

      const transaction = db.transaction(
        STORE_NAME,
        "readonly"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(
          (request.result || []) as StoredGalleryItem[]
        );
      };

      request.onerror = () => {
        reject(
          request.error ||
            new Error(
              "Could not read gallery images."
            )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not read gallery images."
            )
        );
      };
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        try {
          db?.close();
        } catch {}
      }, 0);
    }
  });
}

function saveStoredItem(
  item: StoredGalleryItem
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let db: IDBDatabase | null = null;

    try {
      db = await openGalleryDB();

      const transaction = db.transaction(
        STORE_NAME,
        "readwrite"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      store.put(item);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not save gallery image."
            )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not save gallery image."
            )
        );
      };
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        try {
          db?.close();
        } catch {}
      }, 0);
    }
  });
}

function deleteStoredItem(
  id: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let db: IDBDatabase | null = null;

    try {
      db = await openGalleryDB();

      const transaction = db.transaction(
        STORE_NAME,
        "readwrite"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      store.delete(id);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not delete gallery image."
            )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not delete gallery image."
            )
        );
      };
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        try {
          db?.close();
        } catch {}
      }, 0);
    }
  });
}

function clearStoredItems(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let db: IDBDatabase | null = null;

    try {
      db = await openGalleryDB();

      const transaction = db.transaction(
        STORE_NAME,
        "readwrite"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      store.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not clear gallery."
            )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
            new Error(
              "Could not clear gallery."
            )
        );
      };
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        try {
          db?.close();
        } catch {}
      }, 0);
    }
  });
}

/* -------------------------------------------------------------------------- */
/* LocalStorage migration                                                     */
/* -------------------------------------------------------------------------- */

function dataUrlToBlob(
  dataUrl: string
): Blob | null {
  try {
    const parts = dataUrl.split(",");

    if (parts.length < 2) {
      return null;
    }

    const header = parts[0];
    const data = parts.slice(1).join(",");

    const mimeMatch =
      header.match(/data:(.*?);base64/i);

    const mime =
      mimeMatch?.[1] || "image/jpeg";

    const binary = atob(data);

    const bytes = new Uint8Array(
      binary.length
    );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], {
      type: mime,
    });
  } catch {
    return null;
  }
}

async function migrateOldLocalStorage() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);

    if (
      !Array.isArray(parsed) ||
      parsed.length === 0
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const existing =
      await getAllStoredItems();

    if (existing.length > 0) {
      /*
       * Existing IndexedDB gallery wins.
       * We do not touch existing gallery data.
       */
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const migrated: StoredGalleryItem[] =
      [];

    for (
      let index = 0;
      index < parsed.length;
      index++
    ) {
      const item = parsed[index];

      if (
        !item ||
        typeof item.image !== "string"
      ) {
        continue;
      }

      const blob =
        dataUrlToBlob(item.image);

      if (!blob) {
        continue;
      }

      migrated.push({
        id:
          typeof item.id === "number"
            ? item.id
            : createId(),

        imageBlob: blob,

        category:
          typeof item.category ===
          "string"
            ? item.category
            : "General",

        visible:
          typeof item.visible ===
          "boolean"
            ? item.visible
            : true,

        order:
          typeof item.order ===
          "number"
            ? item.order
            : index,
      });
    }

    /*
     * Migration is deliberately sequential.
     * We never use a single giant transaction.
     */
    for (const item of migrated) {
      try {
        await saveStoredItem(item);
      } catch {
        /*
         * Never delete the original localStorage
         * if migration could not finish.
         */
        return;
      }
    }

    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /*
     * Migration failure must not stop the page.
     */
  }
}

/* -------------------------------------------------------------------------- */
/* Image compression                                                          */
/* -------------------------------------------------------------------------- */

function loadImageFromBlob(
  blob: Blob
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const objectUrl =
        URL.createObjectURL(blob);

      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        reject(
          new Error(
            "Could not read this image."
          )
        );
      };

      image.src = objectUrl;
    }
  );
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Could not compress image."
              )
            );
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    }
  );
}

/*
 * Returns several widths from large -> small.
 */
function buildWidths(
  sourceWidth: number
) {
  const values = [
    Math.min(
      sourceWidth,
      MAX_IMAGE_WIDTH
    ),
    1150,
    1050,
    950,
    850,
    750,
    650,
    560,
    MIN_IMAGE_WIDTH,
  ];

  return values.filter(
    (value, index, array) =>
      value > 0 &&
      value <= sourceWidth &&
      array.indexOf(value) ===
        index
  );
}

/*
 * Compression strategy:
 *
 * 1. Large image gets resized.
 * 2. JPEG quality is reduced gradually.
 * 3. We stop as soon as the result is <= 480 KB.
 * 4. If impossible, the smallest generated result
 *    is returned.
 *
 * This means a 5MB / 10MB / 15MB photo does not
 * remain a multi-megabyte Blob in IndexedDB.
 */
async function compressImageToTarget(
  source: Blob
): Promise<Blob> {
  if (!source.type.startsWith("image/")) {
    throw new Error(
      "Only image files are supported."
    );
  }

  if (
    source.size <=
    TARGET_IMAGE_BYTES
  ) {
    /*
     * Small files are already safe enough.
     * We do not recompress them unnecessarily.
     */
    return source;
  }

  const image =
    await loadImageFromBlob(source);

  const sourceWidth =
    image.naturalWidth ||
    image.width;

  const sourceHeight =
    image.naturalHeight ||
    image.height;

  if (
    !sourceWidth ||
    !sourceHeight
  ) {
    throw new Error(
      "Invalid image dimensions."
    );
  }

  const widths =
    buildWidths(sourceWidth);

  const qualities = [
    0.82,
    0.76,
    0.70,
    0.64,
    0.58,
    0.52,
    0.46,
    0.40,
    0.34,
  ];

  let smallestBlob: Blob | null =
    null;

  for (const width of widths) {
    const height = Math.max(
      1,
      Math.round(
        (sourceHeight /
          sourceWidth) *
          width
      )
    );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = width;
    canvas.height = height;

    const context =
      canvas.getContext("2d");

    if (!context) {
      continue;
    }

    /*
     * JPEG cannot store transparency.
     * White background prevents transparent PNGs
     * from becoming black.
     */
    context.fillStyle = "#ffffff";

    context.fillRect(
      0,
      0,
      width,
      height
    );

    context.imageSmoothingEnabled =
      true;

    context.imageSmoothingQuality =
      "high";

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    for (const quality of qualities) {
      const blob =
        await canvasToBlob(
          canvas,
          quality
        );

      if (
        !smallestBlob ||
        blob.size <
          smallestBlob.size
      ) {
        smallestBlob = blob;
      }

      if (
        blob.size <=
        TARGET_IMAGE_BYTES
      ) {
        return blob;
      }
    }
  }

  if (smallestBlob) {
    return smallestBlob;
  }

  throw new Error(
    "Could not compress image."
  );
}

async function compressFile(
  file: File
): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error(
      `"${file.name}" is not an image file.`
    );
  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      `"${file.name}" is larger than 15 MB.`
    );
  }

  return compressImageToTarget(
    file
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery conversion                                                         */
/* -------------------------------------------------------------------------- */

function storedItemToGalleryItem(
  item: StoredGalleryItem
): GalleryItem {
  return {
    id: item.id,

    image:
      URL.createObjectURL(
        item.imageBlob
      ),

    category: item.category,

    visible: item.visible,

    order: item.order,
  };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AdminGalleryPage() {
  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [
    selectedImages,
    setSelectedImages,
  ] = useState<SelectedImage[]>([]);

  const [category, setCategory] =
    useState("General");

  const [filter, setFilter] =
    useState<
      "all" | "visible" | "hidden"
    >("all");

  const [dragActive, setDragActive] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [optimizing, setOptimizing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<
      "success" | "error" | "info"
    >("info");

  const [storageInfo, setStorageInfo] =
    useState<{
      usage: number;
      quota: number;
    } | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  /* ---------------------------------------------------------------------- */
  /* Messages                                                               */
  /* ---------------------------------------------------------------------- */

  const showMessage =
    useCallback(
      (
        text: string,
        type:
          | "success"
          | "error"
          | "info" = "info"
      ) => {
        setMessage(text);
        setMessageType(type);

        window.setTimeout(() => {
          setMessage(
            (current) =>
              current === text
                ? ""
                : current
          );
        }, 6000);
      },
      []
    );

  /* ---------------------------------------------------------------------- */
  /* Storage information                                                    */
  /* ---------------------------------------------------------------------- */

  const refreshStorageInfo =
    useCallback(async () => {
      try {
        if (
          typeof navigator ===
            "undefined" ||
          !navigator.storage ||
          !navigator.storage.estimate
        ) {
          return;
        }

        const estimate =
          await navigator.storage.estimate();

        setStorageInfo({
          usage:
            estimate.usage || 0,

          quota:
            estimate.quota || 0,
        });
      } catch {
        // Optional information only.
      }
    }, []);

  /* ---------------------------------------------------------------------- */
  /* Load gallery                                                           */
  /* ---------------------------------------------------------------------- */

  const loadGallery =
    useCallback(async () => {
      setLoading(true);

      try {
        await migrateOldLocalStorage();

        const stored =
          await getAllStoredItems();

        stored.sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        );

        const nextGallery =
          stored.map(
            storedItemToGalleryItem
          );

        setGallery(
          (previous) => {
            for (const item of previous) {
              try {
                URL.revokeObjectURL(
                  item.image
                );
              } catch {}
            }

            return nextGallery;
          }
        );

        await refreshStorageInfo();
      } catch (error) {
        console.error(error);

        showMessage(
          error instanceof Error
            ? error.message
            : "Could not load gallery.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }, [
      refreshStorageInfo,
      showMessage,
    ]);

  useEffect(() => {
    loadGallery();

    return () => {
      /*
       * The current gallery URLs are revoked
       * by loadGallery before replacement.
       */
    };

    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------------- */
  /* File selection                                                          */
  /* ---------------------------------------------------------------------- */

  const addFiles =
    useCallback(
      (files: File[]) => {
        const imageFiles =
          files.filter((file) =>
            file.type.startsWith(
              "image/"
            )
          );

        if (
          imageFiles.length === 0
        ) {
          showMessage(
            "Please select image files only.",
            "error"
          );

          return;
        }

        const newSelected: SelectedImage[] =
          imageFiles.map((file) => ({
            id: createId(),
            file,
            preview:
              URL.createObjectURL(
                file
              ),
          }));

        /*
         * NO 4-image limit.
         * NO 10-image limit.
         * NO 20-image limit.
         */
        setSelectedImages(
          (previous) => [
            ...previous,
            ...newSelected,
          ]
        );

        showMessage(
          `${newSelected.length} image${
            newSelected.length ===
            1
              ? ""
              : "s"
          } added to the upload list.`,
          "success"
        );
      },
      [showMessage]
    );

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length > 0) {
      addFiles(files);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const files = Array.from(
      event.dataTransfer.files || []
    );

    if (files.length > 0) {
      addFiles(files);
    }
  };

  const removeSelectedImage = (
    id: number
  ) => {
    setSelectedImages(
      (previous) => {
        const found =
          previous.find(
            (item) =>
              item.id === id
          );

        if (found) {
          try {
            URL.revokeObjectURL(
              found.preview
            );
          } catch {}
        }

        return previous.filter(
          (item) =>
            item.id !== id
        );
      }
    );
  };

  const clearSelectedImages =
    useCallback(() => {
      setSelectedImages(
        (previous) => {
          for (const item of previous) {
            try {
              URL.revokeObjectURL(
                item.preview
              );
            } catch {}
          }

          return [];
        }
      );
    }, []);

  /* ---------------------------------------------------------------------- */
  /* Optimize existing gallery                                              */
  /* ---------------------------------------------------------------------- */

  const optimizeExistingGallery =
    useCallback(async () => {
      if (optimizing) return;

      setOptimizing(true);

      try {
        const stored =
          await getAllStoredItems();

        if (
          stored.length === 0
        ) {
          showMessage(
            "There are no existing gallery images to optimize.",
            "info"
          );

          return;
        }

        let optimizedCount = 0;
        let savedBytes = 0;

        /*
         * IMPORTANT:
         *
         * We do NOT automatically rewrite every old image.
         *
         * Replacing a large Blob inside IndexedDB can temporarily
         * require additional quota. If the database is already full,
         * that replacement itself can cause QuotaExceededError.
         *
         * Therefore optimization is done one image at a time and
         * failures are reported without deleting the original first.
         */
        for (
          let index = 0;
          index < stored.length;
          index++
        ) {
          const item = stored[index];

          if (
            item.imageBlob.size <=
            TARGET_IMAGE_BYTES
          ) {
            continue;
          }

          try {
            const oldSize =
              item.imageBlob.size;

            const compressed =
              await compressImageToTarget(
                item.imageBlob
              );

            if (
              compressed.size >=
              oldSize
            ) {
              continue;
            }

            /*
             * Same id => existing record remains
             * logically the same gallery item.
             */
            await saveStoredItem({
              ...item,
              imageBlob: compressed,
            });

            optimizedCount++;

            savedBytes +=
              oldSize -
              compressed.size;
          } catch (error) {
            if (
              isQuotaError(error)
            ) {
              /*
               * Do not continue attempting more replacements
               * when the browser is already out of quota.
               */
              throw new Error(
                "Browser storage is too full to replace an existing image safely. Delete one old image first, then run Optimize Gallery again."
              );
            }

            console.error(
              "Could not optimize image:",
              error
            );
          }
        }

        await loadGallery();
        await refreshStorageInfo();

        if (
          optimizedCount > 0
        ) {
          showMessage(
            `Optimized ${optimizedCount} image${
              optimizedCount ===
              1
                ? ""
                : "s"
            } and reduced approximately ${formatBytes(
              savedBytes
            )}.`,
            "success"
          );
        } else {
          showMessage(
            "Existing gallery images are already optimized, or could not be safely replaced because of browser storage limits.",
            "info"
          );
        }
      } catch (error) {
        console.error(error);

        if (
          isQuotaError(error)
        ) {
          showMessage(
            "Browser storage is full. Delete one or more old images and try Optimize Gallery again.",
            "error"
          );
        } else {
          showMessage(
            error instanceof Error
              ? error.message
              : "Could not optimize gallery images.",
            "error"
          );
        }
      } finally {
        setOptimizing(false);
      }
    }, [
      loadGallery,
      optimizing,
      refreshStorageInfo,
      showMessage,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Upload                                                                  */
  /* ---------------------------------------------------------------------- */

  const uploadSelectedImages =
    async () => {
      if (
        selectedImages.length ===
        0
      ) {
        showMessage(
          "Please select at least one image.",
          "error"
        );

        return;
      }

      if (uploading) {
        return;
      }

      setUploading(true);

      let uploadedCount = 0;
      let failedCount = 0;

      try {
        /*
         * Read existing metadata once.
         *
         * We DO NOT keep all original selected files
         * inside IndexedDB.
         */
        const stored =
          await getAllStoredItems();

        let maxOrder =
          stored.reduce(
            (max, item) =>
              Math.max(
                max,
                Number(item.order) ||
                  0
              ),
            0
          );

        /*
         * Each selected file is processed and saved
         * individually.
         *
         * This is important for 10 / 20 / 50+ uploads:
         * we never create one giant IndexedDB transaction.
         */
        for (
          let index = 0;
          index <
          selectedImages.length;
          index++
        ) {
          const selected =
            selectedImages[index];

          showMessage(
            `Processing image ${
              index + 1
            } of ${
              selectedImages.length
            }: ${selected.file.name}`,
            "info"
          );

          let compressed: Blob;

          try {
            compressed =
              await compressFile(
                selected.file
              );
          } catch (error) {
            failedCount++;

            console.error(
              "Image compression failed:",
              error
            );

            showMessage(
              error instanceof Error
                ? error.message
                : `Could not process ${selected.file.name}.`,
              "error"
            );

            /*
             * Continue with the next image.
             */
            continue;
          }

          const newItem: StoredGalleryItem =
            {
              id: createId(),

              imageBlob: compressed,

              category:
                category.trim() ||
                "General",

              visible: true,

              order:
                ++maxOrder,
            };

          try {
            /*
             * ONE image = ONE transaction.
             */
            await saveStoredItem(
              newItem
            );

            stored.push(newItem);

            uploadedCount++;
          } catch (error) {
            failedCount++;

            console.error(
              "Gallery save failed:",
              error
            );

            if (
              isQuotaError(error)
            ) {
              /*
               * Do NOT start rewriting/deleting old
               * gallery records automatically.
               *
               * Existing 4 images must not be destroyed
               * just to make a new upload fit.
               */
              showMessage(
                `Storage quota reached while saving "${selected.file.name}". ${uploadedCount} image${
                  uploadedCount === 1
                    ? ""
                    : "s"
                } were already saved successfully. Delete an old image or free browser storage before adding more.`,
                "error"
              );

              /*
               * Stop this batch cleanly.
               * Already uploaded images remain intact.
               */
              break;
            }

            showMessage(
              error instanceof Error
                ? error.message
                : `Could not save ${selected.file.name}.`,
              "error"
            );
          }
        }

        await loadGallery();
        await refreshStorageInfo();

        /*
         * Remove previews only after processing.
         * Existing gallery data is untouched.
         */
        clearSelectedImages();

        if (
          uploadedCount > 0 &&
          failedCount === 0
        ) {
          showMessage(
            `${uploadedCount} image${
              uploadedCount ===
              1
                ? ""
                : "s"
            } uploaded successfully.`,
            "success"
          );
        } else if (
          uploadedCount > 0
        ) {
          showMessage(
            `${uploadedCount} image${
              uploadedCount ===
              1
                ? ""
                : "s"
            } uploaded. ${failedCount} could not be saved.`,
            "info"
          );
        } else {
          showMessage(
            "No images were uploaded. Check the storage error above.",
            "error"
          );
        }
      } catch (error) {
        console.error(error);

        if (
          isQuotaError(error)
        ) {
          showMessage(
            "Browser storage quota is full. Existing gallery images were not deleted automatically.",
            "error"
          );
        } else {
          showMessage(
            error instanceof Error
              ? error.message
              : "Could not upload images.",
            "error"
          );
        }
      } finally {
        setUploading(false);
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Delete this gallery image permanently?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStoredItem(id);

      const found =
        gallery.find(
          (item) =>
            item.id === id
        );

      if (found) {
        try {
          URL.revokeObjectURL(
            found.image
          );
        } catch {}
      }

      setGallery(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );

      await refreshStorageInfo();

      showMessage(
        "Gallery image deleted.",
        "success"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Could not delete image.",
        "error"
      );
    }
  };

  const handleDeleteAll =
    async () => {
      if (gallery.length === 0) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete all ${gallery.length} gallery images permanently?`
        );

      if (!confirmed) {
        return;
      }

      try {
        await clearStoredItems();

        for (const item of gallery) {
          try {
            URL.revokeObjectURL(
              item.image
            );
          } catch {}
        }

        setGallery([]);

        await refreshStorageInfo();

        showMessage(
          "All gallery images have been deleted.",
          "success"
        );
      } catch (error) {
        console.error(error);

        showMessage(
          error instanceof Error
            ? error.message
            : "Could not clear gallery.",
          "error"
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Visibility                                                              */
  /* ---------------------------------------------------------------------- */

  const toggleVisibility =
    async (
      item: GalleryItem
    ) => {
      try {
        const stored =
          await getAllStoredItems();

        const found =
          stored.find(
            (storedItem) =>
              storedItem.id ===
              item.id
          );

        if (!found) {
          throw new Error(
            "Gallery image could not be found."
          );
        }

        const updated: StoredGalleryItem =
          {
            ...found,

            visible:
              !found.visible,
          };

        await saveStoredItem(
          updated
        );

        setGallery(
          (previous) =>
            previous.map(
              (galleryItem) =>
                galleryItem.id ===
                item.id
                  ? {
                      ...galleryItem,
                      visible:
                        updated.visible,
                    }
                  : galleryItem
            )
        );

        showMessage(
          updated.visible
            ? "Image is now visible on the website."
            : "Image is now hidden from the website.",
          "success"
        );
      } catch (error) {
        console.error(error);

        showMessage(
          error instanceof Error
            ? error.message
            : "Could not update image visibility.",
          "error"
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Derived values                                                          */
  /* ---------------------------------------------------------------------- */

  const visibleCount =
    gallery.filter(
      (item) => item.visible
    ).length;

  const hiddenCount =
    gallery.length -
    visibleCount;

  const filteredGallery =
    gallery.filter(
      (item) => {
        if (
          filter === "visible"
        ) {
          return item.visible;
        }

        if (
          filter === "hidden"
        ) {
          return !item.visible;
        }

        return true;
      }
    );

  const storagePercent =
    storageInfo &&
    storageInfo.quota > 0
      ? Math.min(
          100,
          (storageInfo.usage /
            storageInfo.quota) *
            100
        )
      : 0;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        padding:
          "28px 18px 60px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "flex-start",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 26,
          }}
        >
          <div>
            <div
              style={{
                color: GOLD,
                fontSize: 12,
                letterSpacing: 3,
                textTransform:
                  "uppercase",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              NABABI RISTORANTE
            </div>

            <h1
              style={{
                margin: 0,
                fontSize:
                  "clamp(28px, 5vw, 42px)",
                lineHeight: 1.1,
                fontWeight: 800,
              }}
            >
              Gallery
            </h1>

            <p
              style={{
                margin:
                  "10px 0 0",
                color: MUTED,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Upload restaurant
              photos, manage
              visibility, and
              keep your public
              gallery updated.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <StatCard
              label="Total"
              value={
                gallery.length
              }
            />

            <StatCard
              label="Visible"
              value={
                visibleCount
              }
            />

            <StatCard
              label="Hidden"
              value={
                hiddenCount
              }
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              marginBottom: 18,
              padding:
                "13px 15px",
              borderRadius: 12,
              border:
                messageType ===
                "error"
                  ? "1px solid rgba(255,80,80,.35)"
                  : `1px solid ${BORDER}`,
              background:
                messageType ===
                "error"
                  ? "rgba(120,20,20,.18)"
                  : "rgba(217,164,65,.08)",
              color:
                messageType ===
                "error"
                  ? "#ffb0b0"
                  : GOLD_LIGHT,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

        {/* Upload card */}
        <section
          style={{
            background: CARD,
            border:
              `1px solid ${BORDER}`,
            borderRadius: 18,
            padding: 20,
            marginBottom: 22,
            boxShadow:
              "0 20px 50px rgba(0,0,0,.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                }}
              >
                Add Gallery Images
              </h2>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color: MUTED,
                  fontSize: 12,
                }}
              >
                No 4-image limit.
                Images are
                compressed before
                IndexedDB storage.
              </p>
            </div>

            <button
              type="button"
              onClick={
                optimizeExistingGallery
              }
              disabled={
                optimizing ||
                uploading ||
                loading
              }
              style={{
                border:
                  `1px solid ${BORDER}`,
                background:
                  "rgba(217,164,65,.08)",
                color:
                  GOLD_LIGHT,
                borderRadius: 10,
                padding:
                  "10px 14px",
                cursor:
                  optimizing ||
                  uploading ||
                  loading
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  optimizing ||
                  uploading ||
                  loading
                    ? 0.55
                    : 1,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {optimizing
                ? "Optimizing..."
                : "Optimize Gallery"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 220px",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              <label
                style={{
                  display:
                    "block",
                  color: MUTED,
                  fontSize: 12,
                  marginBottom: 7,
                }}
              >
                Category
              </label>

              <input
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value
                  )
                }
                placeholder="e.g. Restaurant, Food, Interior"
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  background:
                    "#0b0b0b",
                  color: TEXT,
                  border:
                    `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding:
                    "12px 13px",
                  outline: "none",
                  fontSize: 13,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems:
                  "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: 10,
                  padding:
                    "12px 14px",
                  background: GOLD,
                  color: "#080808",
                  fontWeight: 800,
                  cursor:
                    "pointer",
                  fontSize: 13,
                }}
              >
                Choose Images
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleFileChange
            }
            style={{
              display: "none",
            }}
          />

          {/* Drop zone */}
          <div
            onDragEnter={(
              event
            ) => {
              event.preventDefault();
              event.stopPropagation();
              setDragActive(
                true
              );
            }}
            onDragOver={(
              event
            ) => {
              event.preventDefault();
              event.stopPropagation();
              setDragActive(
                true
              );
            }}
            onDragLeave={(
              event
            ) => {
              event.preventDefault();
              event.stopPropagation();
              setDragActive(
                false
              );
            }}
            onDrop={handleDrop}
            onClick={() =>
              fileInputRef.current?.click()
            }
            style={{
              border:
                `1px dashed ${
                  dragActive
                    ? GOLD
                    : "rgba(217,164,65,.4)"
                }`,
              background:
                dragActive
                  ? "rgba(217,164,65,.08)"
                  : "#0b0b0b",
              borderRadius: 14,
              padding:
                "28px 18px",
              textAlign:
                "center",
              cursor:
                "pointer",
              transition:
                "all .2s ease",
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 9,
              }}
            >
              ↑
            </div>

            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Drag & Drop
              Images Here
            </div>

            <div
              style={{
                color: MUTED,
                fontSize: 12,
                marginTop: 7,
              }}
            >
              or click to
              select multiple
              images
            </div>

            <div
              style={{
                color:
                  "rgba(246,207,112,.75)",
                fontSize: 11,
                marginTop: 9,
              }}
            >
              Images are
              automatically
              compressed before
              saving.
            </div>
          </div>

          {/* Selected images */}
          {selectedImages.length >
            0 && (
            <div
              style={{
                marginTop: 18,
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Selected
                  Images (
                  {
                    selectedImages.length
                  }
                  )
                </div>

                <button
                  type="button"
                  onClick={
                    clearSelectedImages
                  }
                  disabled={
                    uploading
                  }
                  style={{
                    background:
                      "transparent",
                    border: "none",
                    color: MUTED,
                    cursor:
                      uploading
                        ? "not-allowed"
                        : "pointer",
                    fontSize: 12,
                  }}
                >
                  Clear all
                </button>
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 10,
                }}
              >
                {selectedImages.map(
                  (item) => (
                    <div
                      key={item.id}
                      style={{
                        position:
                          "relative",
                        borderRadius:
                          12,
                        overflow:
                          "hidden",
                        border:
                          `1px solid ${BORDER}`,
                        background:
                          "#090909",
                      }}
                    >
                      <img
                        src={
                          item.preview
                        }
                        alt={
                          item.file.name
                        }
                        style={{
                          width:
                            "100%",
                          height: 120,
                          objectFit:
                            "cover",
                          display:
                            "block",
                        }}
                      />

                      <div
                        style={{
                          padding:
                            "8px 9px",
                          fontSize: 10,
                          color:
                            MUTED,
                          overflow:
                            "hidden",
                          whiteSpace:
                            "nowrap",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {
                          item.file
                            .name
                        }
                      </div>

                      <button
                        type="button"
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          removeSelectedImage(
                            item.id
                          );
                        }}
                        disabled={
                          uploading
                        }
                        style={{
                          position:
                            "absolute",
                          top: 7,
                          right: 7,
                          width: 28,
                          height: 28,
                          borderRadius:
                            "50%",
                          border:
                            "1px solid rgba(255,255,255,.15)",
                          background:
                            "rgba(0,0,0,.72)",
                          color:
                            "#fff",
                          cursor:
                            uploading
                              ? "not-allowed"
                              : "pointer",
                          fontSize: 15,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={
                  uploadSelectedImages
                }
                disabled={
                  uploading ||
                  optimizing ||
                  selectedImages.length ===
                    0
                }
                style={{
                  width:
                    "100%",
                  marginTop: 16,
                  border: "none",
                  borderRadius: 11,
                  padding:
                    "13px 16px",
                  background:
                    uploading
                      ? "#5d4b25"
                      : GOLD,
                  color:
                    "#080808",
                  fontWeight:
                    900,
                  cursor:
                    uploading ||
                    optimizing
                      ? "not-allowed"
                      : "pointer",
                  fontSize: 13,
                }}
              >
                {uploading
                  ? "Uploading & Compressing..."
                  : `Upload ${
                      selectedImages.length
                    } Image${
                      selectedImages.length ===
                      1
                        ? ""
                        : "s"
                    }`}
              </button>
            </div>
          )}
        </section>

        {/* Storage information */}
        {storageInfo && (
          <section
            style={{
              background: CARD,
              border:
                `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: 15,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap: 12,
                flexWrap:
                  "wrap",
                marginBottom: 9,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Browser Storage
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: MUTED,
                }}
              >
                {formatBytes(
                  storageInfo.usage
                )}{" "}
                used of
                approximately{" "}
                {formatBytes(
                  storageInfo.quota
                )}
              </div>
            </div>

            <div
              style={{
                height: 6,
                borderRadius:
                  99,
                background:
                  "#222",
                overflow:
                  "hidden",
              }}
            >
              <div
                style={{
                  width: `${storagePercent}%`,
                  height: "100%",
                  background:
                    storagePercent >
                    85
                      ? "#b94a48"
                      : GOLD,
                  borderRadius:
                    99,
                  transition:
                    "width .25s ease",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                color: MUTED,
                fontSize: 11,
                lineHeight:
                  1.5,
              }}
            >
              Gallery images
              are stored in
              IndexedDB. New
              images are
              compressed before
              they are saved.
              Existing images
              are never
              automatically
              deleted to make
              room.
            </div>
          </section>
        )}

        {/* Gallery controls */}
        <section>
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: 14,
              flexWrap:
                "wrap",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                }}
              >
                All Gallery
                Images
              </h2>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  color: MUTED,
                  fontSize: 12,
                }}
              >
                Visible
                images appear
                on the public
                website.
              </p>
            </div>

            <div
              style={{
                display:
                  "flex",
                gap: 7,
                flexWrap:
                  "wrap",
              }}
            >
              {(
                [
                  ["all", "All"],
                  [
                    "visible",
                    "Visible",
                  ],
                  [
                    "hidden",
                    "Hidden",
                  ],
                ] as const
              ).map(
                ([
                  value,
                  label,
                ]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setFilter(
                        value
                      )
                    }
                    style={{
                      border:
                        `1px solid ${
                          filter ===
                          value
                            ? GOLD
                            : BORDER
                        }`,
                      background:
                        filter ===
                        value
                          ? "rgba(217,164,65,.14)"
                          : CARD,
                      color:
                        filter ===
                        value
                          ? GOLD_LIGHT
                          : MUTED,
                      borderRadius:
                        9,
                      padding:
                        "8px 11px",
                      cursor:
                        "pointer",
                      fontSize: 11,
                      fontWeight:
                        700,
                    }}
                  >
                    {label}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={
                  handleDeleteAll
                }
                disabled={
                  gallery.length ===
                  0
                }
                style={{
                  border:
                    "1px solid rgba(255,80,80,.28)",
                  background:
                    "rgba(120,20,20,.08)",
                  color:
                    "#ff9d9d",
                  borderRadius:
                    9,
                  padding:
                    "8px 11px",
                  cursor:
                    gallery.length ===
                    0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    gallery.length ===
                    0
                      ? 0.45
                      : 1,
                  fontSize: 11,
                  fontWeight:
                    700,
                }}
              >
                Delete All
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                padding: 50,
                textAlign:
                  "center",
                background:
                  CARD,
                border:
                  `1px solid ${BORDER}`,
                borderRadius:
                  16,
                color: MUTED,
              }}
            >
              Loading gallery...
            </div>
          )}

          {/* Empty */}
          {!loading &&
            filteredGallery.length ===
              0 && (
              <div
                style={{
                  padding: 55,
                  textAlign:
                    "center",
                  background:
                    CARD,
                  border:
                    `1px solid ${BORDER}`,
                  borderRadius:
                    16,
                }}
              >
                <div
                  style={{
                    fontSize: 35,
                    marginBottom:
                      10,
                  }}
                >
                  ◇
                </div>

                <div
                  style={{
                    fontWeight:
                      700,
                    fontSize:
                      16,
                  }}
                >
                  No images
                  found
                </div>

                <div
                  style={{
                    color:
                      MUTED,
                    fontSize:
                      12,
                    marginTop:
                      7,
                  }}
                >
                  Upload some
                  restaurant
                  photos to
                  build your
                  gallery.
                </div>
              </div>
            )}

          {/* Gallery grid */}
          {!loading &&
            filteredGallery.length >
              0 && (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 16,
                }}
              >
                {filteredGallery.map(
                  (item) => (
                    <article
                      key={
                        item.id
                      }
                      style={{
                        background:
                          CARD,
                        border:
                          `1px solid ${
                            item.visible
                              ? BORDER
                              : "rgba(255,255,255,.08)"
                          }`,
                        borderRadius:
                          16,
                        overflow:
                          "hidden",
                        opacity:
                          item.visible
                            ? 1
                            : 0.72,
                      }}
                    >
                      <div
                        style={{
                          position:
                            "relative",
                          background:
                            "#090909",
                        }}
                      >
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.category ||
                            "Gallery image"
                          }
                          style={{
                            display:
                              "block",
                            width:
                              "100%",
                            height: 220,
                            objectFit:
                              "cover",
                          }}
                        />

                        <div
                          style={{
                            position:
                              "absolute",
                            top: 10,
                            left: 10,
                            padding:
                              "5px 8px",
                            borderRadius:
                              99,
                            background:
                              item.visible
                                ? "rgba(20,100,50,.86)"
                                : "rgba(100,30,30,.86)",
                            color:
                              "#fff",
                            fontSize:
                              10,
                            fontWeight:
                              800,
                          }}
                        >
                          {item.visible
                            ? "VISIBLE"
                            : "HIDDEN"}
                        </div>
                      </div>

                      <div
                        style={{
                          padding:
                            13,
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: 10,
                            marginBottom:
                              12,
                          }}
                        >
                          <div
                            style={{
                              minWidth:
                                0,
                            }}
                          >
                            <div
                              style={{
                                color:
                                  GOLD_LIGHT,
                                fontSize:
                                  12,
                                fontWeight:
                                  800,
                                overflow:
                                  "hidden",
                                whiteSpace:
                                  "nowrap",
                                textOverflow:
                                  "ellipsis",
                              }}
                            >
                              {item.category ||
                                "General"}
                            </div>

                            <div
                              style={{
                                color:
                                  MUTED,
                                fontSize:
                                  10,
                                marginTop:
                                  4,
                              }}
                            >
                              Order:{" "}
                              {
                                item.order
                              }
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr 1fr",
                            gap: 8,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggleVisibility(
                                item
                              )
                            }
                            style={{
                              border:
                                `1px solid ${BORDER}`,
                              background:
                                "rgba(217,164,65,.06)",
                              color:
                                GOLD_LIGHT,
                              borderRadius:
                                9,
                              padding:
                                "9px 8px",
                              cursor:
                                "pointer",
                              fontSize:
                                11,
                              fontWeight:
                                700,
                            }}
                          >
                            {item.visible
                              ? "Hide"
                              : "Show"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            style={{
                              border:
                                "1px solid rgba(255,80,80,.25)",
                              background:
                                "rgba(120,20,20,.08)",
                              color:
                                "#ff9d9d",
                              borderRadius:
                                9,
                              padding:
                                "9px 8px",
                              cursor:
                                "pointer",
                              fontSize:
                                11,
                              fontWeight:
                                700,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
        </section>

        {/* Footer note */}
        <div
          style={{
            marginTop: 25,
            padding: 14,
            borderRadius: 12,
            border:
              `1px solid ${BORDER}`,
            background:
              "rgba(217,164,65,.035)",
            color: MUTED,
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
          <strong
            style={{
              color:
                GOLD_LIGHT,
            }}
          >
            Storage note:
          </strong>{" "}
          Gallery images are
          stored in IndexedDB.
          New images are
          compressed before
          saving. Existing
          gallery records are
          not automatically
          deleted when storage
          becomes full.
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Small stat card                                                            */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        minWidth: 82,
        padding:
          "11px 13px",
        borderRadius: 12,
        border:
          `1px solid ${BORDER}`,
        background: CARD,
        textAlign:
          "center",
      }}
    >
      <div
        style={{
          color:
            GOLD_LIGHT,
          fontSize: 19,
          fontWeight: 800,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 3,
          color: MUTED,
          fontSize: 10,
          textTransform:
            "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
}
