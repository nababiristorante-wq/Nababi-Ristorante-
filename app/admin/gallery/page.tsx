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

const MAX_FILE_SIZE = 15 * 1024 * 1024;

// More efficient browser storage
const MAX_IMAGE_WIDTH = 1800;
const JPEG_QUALITY = 0.78;

// No gallery-count limit
const MAX_UPLOAD_COUNT = 1000;

const GOLD = "#d9a441";
const GOLD_LIGHT = "#f6cf70";
const BG = "#070707";
const CARD = "#101010";
const CARD_2 = "#151515";
const BORDER = "rgba(217,164,65,0.25)";
const TEXT = "#f5f1e8";
const MUTED = "#a9a39a";

function createId() {
  return (
    Date.now() +
    Math.floor(Math.random() * 1000000)
  );
}

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

    request.onerror = () => {
      reject(
        request.error ||
          new Error(
            "Unable to open gallery database."
          )
      );
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (
        !db.objectStoreNames.contains(
          STORE_NAME
        )
      ) {
        const store =
          db.createObjectStore(
            STORE_NAME,
            {
              keyPath: "id",
            }
          );

        store.createIndex(
          "order",
          "order",
          {
            unique: false,
          }
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function getAllStoredItems(): Promise<
  StoredGalleryItem[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const db =
        await openGalleryDB();

      const transaction =
        db.transaction(
          STORE_NAME,
          "readonly"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.getAll();

      request.onerror = () => {
        db.close();

        reject(
          request.error ||
            new Error(
              "Unable to read gallery."
            )
        );
      };

      request.onsuccess = () => {
        const result =
          Array.isArray(
            request.result
          )
            ? (request.result as StoredGalleryItem[])
            : [];

        db.close();

        result.sort((a, b) => {
          const orderA =
            typeof a.order ===
            "number"
              ? a.order
              : 0;

          const orderB =
            typeof b.order ===
            "number"
              ? b.order
              : 0;

          return orderA - orderB;
        });

        resolve(result);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Save ONE image at a time.
 *
 * This is important because a large multi-image
 * IndexedDB transaction can fail on some browsers
 * when many images are uploaded together.
 */
function saveStoredItem(
  item: StoredGalleryItem
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db =
        await openGalleryDB();

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      store.put(item);

      transaction.onerror = () => {
        db.close();

        reject(
          transaction.error ||
            new Error(
              "Unable to save gallery image."
            )
        );
      };

      transaction.onabort = () => {
        db.close();

        reject(
          transaction.error ||
            new Error(
              "Gallery image save was aborted."
            )
        );
      };

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    } catch (error) {
      reject(error);
    }
  });
}

async function saveStoredItems(
  items: StoredGalleryItem[]
): Promise<void> {
  for (const item of items) {
    await saveStoredItem(item);
  }
}

function deleteStoredItem(
  id: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db =
        await openGalleryDB();

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      store.delete(id);

      transaction.onerror = () => {
        db.close();

        reject(
          transaction.error ||
            new Error(
              "Unable to delete image."
            )
        );
      };

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    } catch (error) {
      reject(error);
    }
  });
}

function clearStoredItems(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db =
        await openGalleryDB();

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      store.clear();

      transaction.onerror = () => {
        db.close();

        reject(
          transaction.error ||
            new Error(
              "Unable to clear gallery."
            )
        );
      };

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    } catch (error) {
      reject(error);
    }
  });
}

function dataUrlToBlob(
  dataUrl: string
): Blob | null {
  try {
    const parts =
      dataUrl.split(",");

    if (parts.length < 2) {
      return null;
    }

    const mimeMatch =
      parts[0].match(
        /data:(.*?);base64/
      );

    const mime =
      mimeMatch?.[1] ||
      "image/jpeg";

    const binary =
      atob(parts[1]);

    const bytes =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return new Blob([bytes], {
      type: mime,
    });
  } catch {
    return null;
  }
}

/**
 * Compress image before IndexedDB storage.
 *
 * WebP is attempted first because it normally
 * produces much smaller files.
 *
 * JPEG is used as a reliable fallback.
 */
function compressImage(
  file: File
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        reject(
          new Error(
            `${file.name} is not a supported image file.`
          )
        );
        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        reject(
          new Error(
            `${file.name} is larger than 15 MB.`
          )
        );
        return;
      }

      const reader =
        new FileReader();

      reader.onerror = () => {
        reject(
          new Error(
            `Unable to read ${file.name}.`
          )
        );
      };

      reader.onload = () => {
        const img =
          new Image();

        img.onerror = () => {
          reject(
            new Error(
              `Unable to process ${file.name}.`
            )
          );
        };

        img.onload = () => {
          let width =
            img.naturalWidth ||
            img.width;

          let height =
            img.naturalHeight ||
            img.height;

          if (
            width >
            MAX_IMAGE_WIDTH
          ) {
            const ratio =
              MAX_IMAGE_WIDTH /
              width;

            width =
              MAX_IMAGE_WIDTH;

            height =
              Math.round(
                height * ratio
              );
          }

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            width;

          canvas.height =
            height;

          const context =
            canvas.getContext(
              "2d"
            );

          if (!context) {
            reject(
              new Error(
                "Unable to process image."
              )
            );
            return;
          }

          context.imageSmoothingEnabled =
            true;

          context.imageSmoothingQuality =
            "high";

          context.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          // Try WebP first.
          canvas.toBlob(
            (webpBlob) => {
              if (
                webpBlob &&
                webpBlob.size > 0 &&
                webpBlob.type ===
                  "image/webp"
              ) {
                resolve(
                  webpBlob
                );
                return;
              }

              // JPEG fallback.
              canvas.toBlob(
                (jpegBlob) => {
                  if (
                    !jpegBlob
                  ) {
                    reject(
                      new Error(
                        `Unable to compress ${file.name}.`
                      )
                    );
                    return;
                  }

                  resolve(
                    jpegBlob
                  );
                },
                "image/jpeg",
                JPEG_QUALITY
              );
            },
            "image/webp",
            0.78
          );
        };

        img.src =
          String(
            reader.result
          );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
}

async function migrateOldLocalStorage(): Promise<number> {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return 0;
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem(
        STORAGE_KEY
      );

      return 0;
    }

    const existing =
      await getAllStoredItems();

    const existingIds =
      new Set(
        existing.map(
          (item) => item.id
        )
      );

    const migrated: StoredGalleryItem[] =
      [];

    for (
      const item of parsed
    ) {
      if (
        !item ||
        !item.image ||
        typeof item.image !==
          "string"
      ) {
        continue;
      }

      const id =
        typeof item.id ===
        "number"
          ? item.id
          : createId();

      if (
        existingIds.has(id)
      ) {
        continue;
      }

      const blob =
        dataUrlToBlob(
          item.image
        );

      if (!blob) {
        continue;
      }

      migrated.push({
        id,
        imageBlob: blob,
        category:
          typeof item.category ===
          "string"
            ? item.category
            : "Restaurant",
        visible:
          item.visible !==
          false,
        order:
          typeof item.order ===
          "number"
            ? item.order
            : migrated.length,
      });
    }

    if (
      migrated.length > 0
    ) {
      await saveStoredItems(
        migrated
      );
    }

    localStorage.removeItem(
      STORAGE_KEY
    );

    return migrated.length;
  } catch (error) {
    console.error(
      "Gallery migration error:",
      error
    );

    return 0;
  }
}

export default function AdminGalleryPage() {
  const [
    items,
    setItems,
  ] = useState<GalleryItem[]>(
    []
  );

  const [
    selectedImages,
    setSelectedImages,
  ] = useState<
    SelectedImage[]
  >([]);

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    isDeletingAll,
    setIsDeletingAll,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error" | ""
  >("");

  const [
    filter,
    setFilter,
  ] = useState<
    "all" | "visible" | "hidden"
  >("all");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    "Restaurant"
  );

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const objectUrlsRef =
    useRef<string[]>([]);

  const selectedUrlsRef =
    useRef<string[]>([]);

  const showMessage =
    useCallback(
      (
        text: string,
        type:
          | "success"
          | "error"
      ) => {
        setMessage(text);
        setMessageType(type);

        window.setTimeout(
          () => {
            setMessage("");
            setMessageType(
              ""
            );
          },
          4500
        );
      },
      []
    );

  const loadGallery =
    useCallback(
      async () => {
        try {
          setIsLoading(
            true
          );

          await migrateOldLocalStorage();

          const stored =
            await getAllStoredItems();

          objectUrlsRef.current.forEach(
            (url) => {
              URL.revokeObjectURL(
                url
              );
            }
          );

          objectUrlsRef.current =
            [];

          const loaded: GalleryItem[] =
            stored.map(
              (item) => {
                const url =
                  URL.createObjectURL(
                    item.imageBlob
                  );

                objectUrlsRef.current.push(
                  url
                );

                return {
                  id: item.id,
                  image: url,
                  category:
                    item.category ||
                    "Restaurant",
                  visible:
                    item.visible !==
                    false,
                  order:
                    typeof item.order ===
                    "number"
                      ? item.order
                      : 0,
                };
              }
            );

          setItems(
            loaded
          );
        } catch (error) {
          console.error(
            "Gallery load error:",
            error
          );

          showMessage(
            "Unable to load gallery images.",
            "error"
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      [showMessage]
    );

  useEffect(() => {
    loadGallery();

    return () => {
      objectUrlsRef.current.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );

      selectedUrlsRef.current.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );
    };
  }, [loadGallery]);

  const addFiles =
    useCallback(
      (
        files:
          | FileList
          | File[]
      ) => {
        const fileArray =
          Array.from(
            files
          );

        if (
          !fileArray.length
        ) {
          return;
        }

        const imageFiles =
          fileArray.filter(
            (file) =>
              file.type.startsWith(
                "image/"
              )
          );

        if (
          !imageFiles.length
        ) {
          showMessage(
            "Please select image files only.",
            "error"
          );
          return;
        }

        const newSelections: SelectedImage[] =
          [];

        /*
         * There is intentionally NO 4-image limit.
         *
         * 1000 is only a browser-safety ceiling
         * for an accidental massive file selection.
         */
        const filesToAdd =
          imageFiles.slice(
            0,
            MAX_UPLOAD_COUNT
          );

        for (
          const file of filesToAdd
        ) {
          if (
            file.size >
            MAX_FILE_SIZE
          ) {
            showMessage(
              `${file.name} is larger than 15 MB and was skipped.`,
              "error"
            );
            continue;
          }

          const preview =
            URL.createObjectURL(
              file
            );

          selectedUrlsRef.current.push(
            preview
          );

          newSelections.push({
            id: createId(),
            file,
            preview,
          });
        }

        if (
          !newSelections.length
        ) {
          return;
        }

        setSelectedImages(
          (previous) => [
            ...previous,
            ...newSelections,
          ]
        );
      },
      [showMessage]
    );

  const handleFileChange =
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      if (
        event.target.files
      ) {
        addFiles(
          event.target.files
        );
      }

      /*
       * Allows selecting the same file again
       * after removing it.
       */
      event.target.value = "";
    };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(false);

    if (
      event.dataTransfer
        .files
    ) {
      addFiles(
        event.dataTransfer.files
      );
    }
  };

  const handleDragOver =
    (
      event: DragEvent<HTMLDivElement>
    ) => {
      event.preventDefault();
      setIsDragging(true);
    };

  const handleDragLeave =
    (
      event: DragEvent<HTMLDivElement>
    ) => {
      event.preventDefault();
      setIsDragging(false);
    };

  const removeSelectedImage =
    (id: number) => {
      setSelectedImages(
        (previous) => {
          const found =
            previous.find(
              (item) =>
                item.id === id
            );

          if (found) {
            URL.revokeObjectURL(
              found.preview
            );

            selectedUrlsRef.current =
              selectedUrlsRef.current.filter(
                (url) =>
                  url !==
                  found.preview
              );
          }

          return previous.filter(
            (item) =>
              item.id !== id
          );
        }
      );
    };

  const clearSelectedImages =
    () => {
      selectedImages.forEach(
        (item) => {
          URL.revokeObjectURL(
            item.preview
          );
        }
      );

      selectedUrlsRef.current =
        [];

      setSelectedImages(
        []
      );
    };

  const uploadSelectedImages =
    async () => {
      if (
        !selectedImages.length
      ) {
        showMessage(
          "Please select at least one image.",
          "error"
        );
        return;
      }

      try {
        setIsUploading(
          true
        );

        const stored =
          await getAllStoredItems();

        let currentMaxOrder =
          stored.reduce(
            (max, item) =>
              Math.max(
                max,
                typeof item.order ===
                  "number"
                  ? item.order
                  : 0
              ),
            -1
          );

        let uploadedCount =
          0;

        let failedCount =
          0;

        /*
         * IMPORTANT:
         * Process images one by one.
         *
         * This prevents a large batch transaction
         * from failing after only a few images.
         */
        for (
          let index = 0;
          index <
          selectedImages.length;
          index++
        ) {
          const selected =
            selectedImages[index];

          try {
            const blob =
              await compressImage(
                selected.file
              );

            currentMaxOrder += 1;

            const newItem: StoredGalleryItem =
              {
                id: createId(),
                imageBlob: blob,
                category:
                  selectedCategory.trim() ||
                  "Restaurant",
                visible: true,
                order:
                  currentMaxOrder,
              };

            await saveStoredItem(
              newItem
            );

            uploadedCount += 1;
          } catch (error) {
            failedCount += 1;

            console.error(
              `Unable to upload ${selected.file.name}:`,
              error
            );
          }

          /*
           * Give the browser a tiny chance to breathe
           * between many large images.
           */
          await new Promise(
            (resolve) =>
              window.setTimeout(
                resolve,
                0
              )
          );
        }

        selectedImages.forEach(
          (item) => {
            URL.revokeObjectURL(
              item.preview
            );
          }
        );

        selectedUrlsRef.current =
          [];

        setSelectedImages(
          []
        );

        await loadGallery();

        if (
          uploadedCount === 0
        ) {
          showMessage(
            "No images could be saved. Please try smaller images or check browser storage permission.",
            "error"
          );
        } else if (
          failedCount > 0
        ) {
          showMessage(
            `${uploadedCount} image${
              uploadedCount === 1
                ? ""
                : "s"
            } uploaded. ${failedCount} image${
              failedCount === 1
                ? ""
                : "s"
            } could not be saved.`,
            "error"
          );
        } else {
          showMessage(
            `${uploadedCount} image${
              uploadedCount === 1
                ? ""
                : "s"
            } uploaded successfully.`,
            "success"
          );
        }
      } catch (error) {
        console.error(
          "Gallery upload error:",
          error
        );

        showMessage(
          error instanceof Error
            ? error.message
            : "Unable to save gallery images.",
          "error"
        );
      } finally {
        setIsUploading(
          false
        );
      }
    };

  const deleteImage =
    async (id: number) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this image?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteStoredItem(
          id
        );

        const item =
          items.find(
            (galleryItem) =>
              galleryItem.id ===
              id
          );

        if (item) {
          URL.revokeObjectURL(
            item.image
          );

          objectUrlsRef.current =
            objectUrlsRef.current.filter(
              (url) =>
                url !== item.image
            );
        }

        setItems(
          (previous) =>
            previous.filter(
              (galleryItem) =>
                galleryItem.id !==
                id
            )
        );

        showMessage(
          "Image deleted successfully.",
          "success"
        );
      } catch (error) {
        console.error(
          "Delete gallery image error:",
          error
        );

        showMessage(
          "Unable to delete image.",
          "error"
        );
      }
    };

  const deleteAllImages =
    async () => {
      if (
        !items.length
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete all ${items.length} gallery images? This cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setIsDeletingAll(
          true
        );

        await clearStoredItems();

        objectUrlsRef.current.forEach(
          (url) => {
            URL.revokeObjectURL(
              url
            );
          }
        );

        objectUrlsRef.current =
          [];

        setItems([]);

        showMessage(
          "All gallery images deleted.",
          "success"
        );
      } catch (error) {
        console.error(
          "Delete all gallery images error:",
          error
        );

        showMessage(
          "Unable to delete all images.",
          "error"
        );
      } finally {
        setIsDeletingAll(
          false
        );
      }
    };

  const toggleVisibility =
    async (id: number) => {
      try {
        const stored =
          await getAllStoredItems();

        const target =
          stored.find(
            (item) =>
              item.id === id
          );

        if (!target) {
          return;
        }

        target.visible =
          !target.visible;

        await saveStoredItem(
          target
        );

        setItems(
          (previous) =>
            previous.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      visible:
                        target.visible,
                    }
                  : item
            )
        );

        showMessage(
          target.visible
            ? "Image is now visible."
            : "Image is now hidden.",
          "success"
        );
      } catch (error) {
        console.error(
          "Visibility update error:",
          error
        );

        showMessage(
          "Unable to update image visibility.",
          "error"
        );
      }
    };

  const filteredItems =
    items.filter((item) => {
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
    });

  const visibleCount =
    items.filter(
      (item) =>
        item.visible
    ).length;

  const hiddenCount =
    items.filter(
      (item) =>
        !item.visible
    ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        padding: "28px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "20px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: GOLD,
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing:
                  "3px",
                textTransform:
                  "uppercase",
                marginBottom: "8px",
              }}
            >
              Nababi Ristorante
            </div>

            <h1
              style={{
                margin: 0,
                fontSize:
                  "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing:
                  "-1px",
              }}
            >
              Gallery
            </h1>

            <p
              style={{
                margin:
                  "10px 0 0",
                color: MUTED,
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "700px",
              }}
            >
              Upload and manage
              restaurant gallery
              images. Images are
              stored separately from
              menu products.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                border:
                  `1px solid ${BORDER}`,
                background:
                  "rgba(217,164,65,0.08)",
                borderRadius:
                  "12px",
                padding:
                  "12px 16px",
                minWidth: "90px",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  color: GOLD_LIGHT,
                  fontSize:
                    "22px",
                  fontWeight: 800,
                }}
              >
                {items.length}
              </div>

              <div
                style={{
                  color: MUTED,
                  fontSize:
                    "11px",
                  marginTop: "3px",
                }}
              >
                Total
              </div>
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(80,180,110,0.25)",
                background:
                  "rgba(80,180,110,0.07)",
                borderRadius:
                  "12px",
                padding:
                  "12px 16px",
                minWidth: "90px",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  color:
                    "#78d99a",
                  fontSize:
                    "22px",
                  fontWeight: 800,
                }}
              >
                {visibleCount}
              </div>

              <div
                style={{
                  color: MUTED,
                  fontSize:
                    "11px",
                    marginTop: "3px",
                }}
              >
                Visible
              </div>
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(220,100,100,0.25)",
                background:
                  "rgba(220,100,100,0.07)",
                borderRadius:
                  "12px",
                padding:
                  "12px 16px",
                minWidth: "90px",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  color:
                    "#e58b8b",
                  fontSize:
                    "22px",
                  fontWeight: 800,
                }}
              >
                {hiddenCount}
              </div>

              <div
                style={{
                  color: MUTED,
                  fontSize:
                    "11px",
                    marginTop: "3px",
                }}
              >
                Hidden
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding:
                "13px 16px",
              borderRadius:
                "10px",
              border:
                messageType ===
                "success"
                  ? "1px solid rgba(90,190,120,0.35)"
                  : "1px solid rgba(220,100,100,0.35)",
              background:
                messageType ===
                "success"
                  ? "rgba(90,190,120,0.09)"
                  : "rgba(220,100,100,0.09)",
              color:
                messageType ===
                "success"
                  ? "#9be3b2"
                  : "#f1aaaa",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* UPLOAD AREA */}
        <div
          style={{
            background: CARD,
            border:
              `1px solid ${BORDER}`,
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "26px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom:
                "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Upload Images
              </h2>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color: MUTED,
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                Select as many
                images as you need.
                There is no 4-image
                restriction.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
              }}
            >
              <label
                style={{
                  color: MUTED,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Category
              </label>

              <input
                value={
                  selectedCategory
                }
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                placeholder="Restaurant"
                style={{
                  width: "180px",
                  background:
                    "#080808",
                  color: TEXT,
                  border:
                    `1px solid ${BORDER}`,
                  borderRadius:
                    "9px",
                  padding:
                    "10px 12px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div
            onClick={() =>
              inputRef.current?.click()
            }
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border:
                isDragging
                  ? `2px solid ${GOLD}`
                  : "2px dashed rgba(217,164,65,0.35)",
              borderRadius:
                "15px",
              minHeight: "190px",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              textAlign: "center",
              cursor: "pointer",
              background:
                isDragging
                  ? "rgba(217,164,65,0.09)"
                  : "rgba(255,255,255,0.015)",
              transition:
                "all 0.2s ease",
              padding: "25px",
            }}
          >
            <div>
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius:
                    "50%",
                  border:
                    `1px solid ${BORDER}`,
                  background:
                    "rgba(217,164,65,0.08)",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  margin:
                    "0 auto 14px",
                  color: GOLD_LIGHT,
                  fontSize:
                    "25px",
                }}
              >
                ↑
              </div>

              <div
                style={{
                  color:
                    GOLD_LIGHT,
                  fontSize:
                    "16px",
                  fontWeight: 700,
                }}
              >
                Click to select
                images
              </div>

              <div
                style={{
                  color: MUTED,
                  fontSize:
                    "13px",
                  marginTop: "6px",
                }}
              >
                or drag and drop
                multiple images here
              </div>

              <div
                style={{
                  color:
                    "#77736c",
                  fontSize:
                    "11px",
                  marginTop:
                    "10px",
                }}
              >
                JPG, JPEG, PNG, WEBP
                • Maximum 15 MB per
                image
              </div>
            </div>
          </div>

          <input
            ref={inputRef}
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

          {/* SELECTED PREVIEWS */}
          {selectedImages.length >
            0 && (
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: "15px",
                  marginBottom:
                    "12px",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "14px",
                    fontWeight: 700,
                  }}
                >
                  Selected Images (
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
                    isUploading
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    color:
                      "#e7a0a0",
                    cursor:
                      "pointer",
                    fontSize:
                      "12px",
                    fontWeight: 700,
                  }}
                >
                  Clear All
                </button>
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "12px",
                }}
              >
                {selectedImages.map(
                  (item) => (
                    <div
                      key={item.id}
                      style={{
                        position:
                          "relative",
                        border:
                          `1px solid ${BORDER}`,
                        borderRadius:
                          "12px",
                        overflow:
                          "hidden",
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
                          width: "100%",
                          height: "130px",
                          objectFit:
                            "cover",
                          display:
                            "block",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedImage(
                            item.id
                          )
                        }
                        disabled={
                          isUploading
                        }
                        style={{
                          position:
                            "absolute",
                          top: "7px",
                          right: "7px",
                          width: "28px",
                          height: "28px",
                          borderRadius:
                            "50%",
                          border:
                            "1px solid rgba(255,255,255,0.2)",
                          background:
                            "rgba(0,0,0,0.75)",
                          color:
                            "#fff",
                          cursor:
                            "pointer",
                          fontSize:
                            "16px",
                        }}
                      >
                        ×
                      </button>

                      <div
                        style={{
                          padding:
                            "8px",
                          color:
                            MUTED,
                          fontSize:
                            "11px",
                          whiteSpace:
                            "nowrap",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {
                          item.file
                            .name
                        }
                      </div>
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
                  isUploading
                }
                style={{
                  width: "100%",
                  marginTop: "18px",
                  border: "none",
                  borderRadius:
                    "10px",
                  padding:
                    "14px 18px",
                  background:
                    isUploading
                      ? "#6e5422"
                      : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#090909",
                  cursor:
                    isUploading
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 900,
                  fontSize: "14px",
                  boxShadow:
                    "0 8px 25px rgba(217,164,65,0.18)",
                }}
              >
                {isUploading
                  ? "Uploading & Saving..."
                  : `Upload ${selectedImages.length} Image${
                      selectedImages.length ===
                      1
                        ? ""
                        : "s"
                    }`}
              </button>
            </div>
          )}
        </div>

        {/* FILTER BAR */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: "15px",
            marginBottom:
              "18px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {(
              [
                ["all", "All"],
                ["visible", "Visible"],
                ["hidden", "Hidden"],
              ] as const
            ).map(
              ([value, label]) => (
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
                      filter === value
                        ? `1px solid ${GOLD}`
                        : `1px solid ${BORDER}`,
                    background:
                      filter === value
                        ? "rgba(217,164,65,0.13)"
                        : CARD,
                    color:
                      filter === value
                        ? GOLD_LIGHT
                        : MUTED,
                    borderRadius:
                      "9px",
                    padding:
                      "9px 14px",
                    cursor:
                      "pointer",
                    fontSize:
                      "12px",
                    fontWeight: 700,
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={
                deleteAllImages
              }
              disabled={
                isDeletingAll
              }
              style={{
                border:
                  "1px solid rgba(220,100,100,0.3)",
                background:
                  "rgba(220,100,100,0.07)",
                color:
                  "#e7a0a0",
                borderRadius:
                  "9px",
                padding:
                  "9px 14px",
                cursor:
                  isDeletingAll
                    ? "not-allowed"
                    : "pointer",
                fontSize:
                  "12px",
                fontWeight: 700,
              }}
            >
              {isDeletingAll
                ? "Deleting..."
                : "Delete All"}
            </button>
          )}
        </div>

        {/* GALLERY */}
        <div
          style={{
            background: CARD,
            border:
              `1px solid ${BORDER}`,
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          {isLoading ? (
            <div
              style={{
                minHeight:
                  "300px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                color: MUTED,
                fontSize:
                  "14px",
              }}
            >
              Loading gallery...
            </div>
          ) : filteredItems.length ===
            0 ? (
            <div
              style={{
                minHeight:
                  "300px",
                display: "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                textAlign:
                  "center",
                color: MUTED,
              }}
            >
              <div
                style={{
                  fontSize:
                    "45px",
                  marginBottom:
                    "12px",
                  opacity: 0.55,
                }}
              >
                ◇
              </div>

              <div
                style={{
                  color: TEXT,
                  fontSize:
                    "18px",
                  fontWeight: 700,
                }}
              >
                No gallery images
              </div>

              <div
                style={{
                  marginTop:
                    "7px",
                  fontSize:
                    "13px",
                }}
              >
                Upload your first
                restaurant image
                above.
              </div>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredItems.map(
                (item) => (
                  <div
                    key={item.id}
                    style={{
                      position:
                        "relative",
                      overflow:
                        "hidden",
                      border:
                        `1px solid ${
                          item.visible
                            ? BORDER
                            : "rgba(255,255,255,0.08)"
                        }`,
                      borderRadius:
                        "14px",
                      background:
                        CARD_2,
                    }}
                  >
                    <div
                      style={{
                        position:
                          "relative",
                        height:
                          "220px",
                        background:
                          "#080808",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={
                          item.category ||
                          "Gallery image"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit:
                            "cover",
                          display:
                            "block",
                          opacity:
                            item.visible
                              ? 1
                              : 0.42,
                        }}
                      />

                      <div
                        style={{
                          position:
                            "absolute",
                          top: "10px",
                          left: "10px",
                          display:
                            "flex",
                          gap: "6px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <span
                          style={{
                            background:
                              "rgba(0,0,0,0.75)",
                            color:
                              GOLD_LIGHT,
                            border:
                              `1px solid ${BORDER}`,
                            borderRadius:
                              "999px",
                            padding:
                              "5px 9px",
                            fontSize:
                              "10px",
                            fontWeight:
                              800,
                          }}
                        >
                          {item.category ||
                            "Restaurant"}
                        </span>

                        <span
                          style={{
                            background:
                              item.visible
                                ? "rgba(70,170,100,0.85)"
                                : "rgba(160,80,80,0.85)",
                            color:
                              "#fff",
                            borderRadius:
                              "999px",
                            padding:
                              "5px 9px",
                            fontSize:
                              "10px",
                            fontWeight:
                              800,
                          }}
                        >
                          {item.visible
                            ? "Visible"
                            : "Hidden"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(
                            item.id
                          )
                        }
                        style={{
                          position:
                            "absolute",
                          right: "10px",
                          top: "10px",
                          width: "34px",
                          height: "34px",
                          borderRadius:
                            "50%",
                          border:
                            "1px solid rgba(255,255,255,0.18)",
                          background:
                            "rgba(0,0,0,0.78)",
                          color:
                            "#fff",
                          cursor:
                            "pointer",
                          fontSize:
                            "17px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                        aria-label="Delete image"
                      >
                        ×
                      </button>
                    </div>

                    <div
                      style={{
                        padding:
                          "12px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            MUTED,
                          fontSize:
                            "11px",
                          marginBottom:
                            "10px",
                        }}
                      >
                        Gallery Image
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleVisibility(
                            item.id
                          )
                        }
                        style={{
                          width: "100%",
                          border:
                            `1px solid ${BORDER}`,
                          background:
                            "rgba(217,164,65,0.05)",
                          color:
                            GOLD_LIGHT,
                          borderRadius:
                            "8px",
                          padding:
                            "9px 10px",
                          cursor:
                            "pointer",
                          fontSize:
                            "12px",
                          fontWeight:
                            700,
                        }}
                      >
                        {item.visible
                          ? "Hide Image"
                          : "Show Image"}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* STORAGE NOTE */}
        <div
          style={{
            marginTop: "18px",
            padding:
              "13px 15px",
            borderRadius:
              "10px",
            border:
              "1px solid rgba(255,255,255,0.07)",
            background:
              "rgba(255,255,255,0.025)",
            color: "#85817a",
            fontSize: "11px",
            lineHeight: 1.7,
          }}
        >
          Gallery images are stored
          in browser IndexedDB. Images
          are compressed before saving
          and are saved one by one so a
          large upload does not fail as
          one large database transaction.
        </div>
      </div>
    </div>
  );
}
