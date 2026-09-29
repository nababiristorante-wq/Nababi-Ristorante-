"use client";

import { ChangeEvent, useEffect, useState } from "react";

type MediaItem = {
  id: number;
  name: string;
  type: "image" | "video";
  url: string;
  size: string;
  uploadedAt: string;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<MediaItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nababi-media");

    if (saved) {
      try {
        setMedia(JSON.parse(saved));
      } catch {
        setMedia([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nababi-media", JSON.stringify(media));
  }, [media]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const uploadFiles = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const allowedFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
    );

    if (!allowedFiles.length) {
      alert("Image অথবা Video file নির্বাচন করুন।");
      return;
    }

    let completed = 0;

    allowedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const item: MediaItem = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith("video/")
            ? "video"
            : "image",
          url: String(reader.result),
          size: formatSize(file.size),
          uploadedAt: new Date().toLocaleString("it-IT"),
        };

        setMedia((prev) => [item, ...prev]);

        completed++;

        if (completed === allowedFiles.length) {
          setMessage(
            `${completed} file successfully uploaded.`
          );

          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const deleteMedia = (id: number) => {
    const confirmed = window.confirm(
      "আপনি কি এই media file-টি delete করতে চান?"
    );

    if (!confirmed) return;

    setMedia((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setMessage("Media deleted successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const filteredMedia = media.filter((item) => {
    if (filter === "all") return true;

    return item.type === filter;
  });

  const imageCount = media.filter(
    (item) => item.type === "image"
  ).length;

  const videoCount = media.filter(
    (item) => item.type === "video"
  ).length;

  return (
    <main className="media-page">

      {/* HEADER */}

      <header className="page-header">

        <div>
          <a href="/admin" className="back-link">
            ← Admin Dashboard
          </a>

          <div className="eyebrow">
            NABABI RISTORANTE
          </div>

          <h1>Media Library</h1>

          <p>
            Website-এর সব Photo ও Video এখান থেকে
            Upload, Preview এবং Delete করুন।
          </p>
        </div>

        <div className="header-actions">

          <a
            href="/admin/categories"
            className="secondary-button"
          >
            📂 Categories
          </a>

          <a
            href="/admin/menu"
            className="secondary-button"
          >
            🍛 Menu
          </a>

        </div>

      </header>

      {/* MESSAGE */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {/* STATS */}

      <section className="stats">

        <div className="stat-card">
          <span>🖼️</span>

          <div>
            <small>Total Media</small>
            <strong>{media.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>📷</span>

          <div>
            <small>Photos</small>
            <strong>{imageCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>🎬</span>

          <div>
            <small>Videos</small>
            <strong>{videoCount}</strong>
          </div>
        </div>

      </section>

      {/* UPLOAD */}

      <section className="upload-card">

        <div className="upload-icon">
          ↑
        </div>

        <div>
          <h2>
            Upload Photos & Videos
          </h2>

          <p>
            আপনার computer বা phone থেকে
            একসাথে একাধিক Photo/Video upload করতে পারবেন।
          </p>

          <small>
            JPG, PNG, WEBP, MP4 সহ সাধারণ media formats
          </small>
        </div>

        <label className="upload-button">

          ＋ Choose Files

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={uploadFiles}
          />

        </label>

      </section>

      {/* FILTER */}

      <section className="library-section">

        <div className="library-header">

          <div>
            <span className="eyebrow">
              YOUR MEDIA
            </span>

            <h2>
              Media Library
            </h2>
          </div>

          <div className="filters">

            <button
              className={
                filter === "all"
                  ? "filter active"
                  : "filter"
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "image"
                  ? "filter active"
                  : "filter"
              }
              onClick={() => setFilter("image")}
            >
              📷 Photos
            </button>

            <button
              className={
                filter === "video"
                  ? "filter active"
                  : "filter"
              }
              onClick={() => setFilter("video")}
            >
              🎬 Videos
            </button>

          </div>

        </div>

        {/* EMPTY */}

        {filteredMedia.length === 0 ? (

          <div className="empty">

            <div className="empty-icon">
              🖼️
            </div>

            <h3>
              No media uploaded yet
            </h3>

            <p>
              আপনার প্রথম Photo বা Video upload করতে
              উপরের “Choose Files” button ব্যবহার করুন।
            </p>

          </div>

        ) : (

          <div className="media-grid">

            {filteredMedia.map((item) => (

              <article
                className="media-card"
                key={item.id}
              >

                <div
                  className="media-preview"
                  onClick={() => setPreview(item)}
                >

                  {item.type === "image" ? (

                    <img
                      src={item.url}
                      alt={item.name}
                    />

                  ) : (

                    <video
                      src={item.url}
                      muted
                    />

                  )}

                  <div className="preview-overlay">
                    👁 Preview
                  </div>

                  <span className="media-type">
                    {item.type === "image"
                      ? "PHOTO"
                      : "VIDEO"}
                  </span>

                </div>

                <div className="media-info">

                  <h3 title={item.name}>
                    {item.name}
                  </h3>

                  <div className="media-meta">

                    <span>
                      {item.size}
                    </span>

                    <span>
                      {item.uploadedAt}
                    </span>

                  </div>

                  <div className="media-actions">

                    <button
                      className="preview-button"
                      onClick={() =>
                        setPreview(item)
                      }
                    >
                      👁 Preview
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteMedia(item.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* PREVIEW MODAL */}

      {preview && (

        <div
          className="modal"
          onClick={() => setPreview(null)}
        >

          <div
            className="modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() => setPreview(null)}
            >
              ✕
            </button>

            {preview.type === "image" ? (

              <img
                src={preview.url}
                alt={preview.name}
              />

            ) : (

              <video
                src={preview.url}
                controls
                autoPlay
              />

            )}

            <div className="modal-info">
              <strong>
                {preview.name}
              </strong>

              <span>
                {preview.size}
              </span>
            </div>

          </div>

        </div>

      )}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .media-page {
          min-height: 100vh;
          padding: 30px;
          background: #f5f1e8;
          color: #392b22;
          font-family:
            Arial,
            "Noto Sans Bengali",
            sans-serif;
        }

        .page-header {
          max-width: 1400px;
          margin: 0 auto 25px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #765d39;
          text-decoration: none;
          font-size: 12px;
        }

        .eyebrow {
          color: #a17c45;
          font-size: 9px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        h1 {
          margin: 5px 0;
          font-family: Georgia, serif;
          font-size: 36px;
          font-weight: 500;
        }

        .page-header p {
          margin: 0;
          color: #837665;
          font-size: 13px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .secondary-button {
          padding: 11px 15px;
          border-radius: 20px;
          background: #3b2920;
          color: #eed9a5;
          text-decoration: none;
          font-size: 11px;
        }

        .success-message {
          max-width: 1400px;
          margin: 0 auto 18px;
          padding: 13px 16px;
          border-radius: 9px;
          background: #edf7ed;
          color: #32703b;
          border: 1px solid #b6d6b9;
          font-size: 12px;
        }

        .stats {
          max-width: 1400px;
          margin: 0 auto 25px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 18px;
          background: #fffdf8;
          border: 1px solid #e2d7c6;
          border-radius: 13px;
        }

        .stat-card > span {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #f0e8da;
          font-size: 20px;
        }

        .stat-card small {
          display: block;
          color: #897c6b;
          font-size: 10px;
        }

        .stat-card strong {
          display: block;
          margin-top: 4px;
          font-family: Georgia, serif;
          font-size: 24px;
        }

        .upload-card {
          max-width: 1400px;
          margin: 0 auto 35px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: #fffdf8;
          border: 1px dashed #cdbb9e;
          border-radius: 15px;
        }

        .upload-icon {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #f0e6d5;
          color: #8c6737;
          font-size: 30px;
          font-weight: 300;
        }

        .upload-card h2 {
          margin: 0 0 5px;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 500;
        }

        .upload-card p {
          margin: 0 0 4px;
          color: #817363;
          font-size: 11px;
        }

        .upload-card small {
          color: #a09280;
          font-size: 9px;
        }

        .upload-button {
          margin-left: auto;
          flex-shrink: 0;
          padding: 13px 20px;
          border-radius: 8px;
          background: #a8783e;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .upload-button input {
          display: none;
        }

        .library-section {
          max-width: 1400px;
          margin: 0 auto;
        }

        .library-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .library-header h2 {
          margin: 5px 0 0;
          font-family: Georgia, serif;
          font-size: 27px;
          font-weight: 500;
        }

        .filters {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter {
          padding: 8px 13px;
          border: 1px solid #d7cbbb;
          border-radius: 20px;
          background: #fffaf1;
          color: #6c5b48;
          cursor: pointer;
          font-size: 10px;
        }

        .filter.active {
          background: #3b2920;
          color: #eed9a5;
          border-color: #3b2920;
        }

        .media-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
        }

        .media-card {
          overflow: hidden;
          background: #fffdf8;
          border: 1px solid #e0d5c3;
          border-radius: 13px;
          transition: .2s;
        }

        .media-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px
            rgba(52,39,27,.08);
        }

        .media-preview {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #e9dfd0;
          cursor: pointer;
        }

        .media-preview img,
        .media-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(45,32,23,.55);
          color: white;
          font-size: 12px;
          font-weight: 700;
          opacity: 0;
          transition: .2s;
        }

        .media-preview:hover .preview-overlay {
          opacity: 1;
        }

        .media-type {
          position: absolute;
          top: 9px;
          left: 9px;
          padding: 5px 8px;
          border-radius: 15px;
          background: rgba(255,255,255,.92);
          color: #60492f;
          font-size: 8px;
          font-weight: 800;
        }

        .media-info {
          padding: 13px;
        }

        .media-info h3 {
          margin: 0 0 8px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 11px;
          color: #4d3d30;
        }

        .media-meta {
          display: flex;
          justify-content: space-between;
          gap: 5px;
          color: #958676;
          font-size: 8px;
          margin-bottom: 11px;
        }

        .media-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .media-actions button {
          padding: 8px 4px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 9px;
        }

        .preview-button {
          border: 1px solid #d4bd91;
          background: #fff6df;
          color: #785b30;
        }

        .delete-button {
          border: 1px solid #e0b9b0;
          background: #fff0ed;
          color: #8b453a;
        }

        .empty {
          padding: 70px 20px;
          text-align: center;
          background: #fffdf8;
          border: 1px dashed #d6c7b0;
          border-radius: 14px;
        }

        .empty-icon {
          font-size: 50px;
        }

        .empty h3 {
          margin: 12px 0 6px;
          font-family: Georgia, serif;
          font-weight: 500;
        }

        .empty p {
          margin: 0;
          color: #8c7e6d;
          font-size: 11px;
        }

        .modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(35,25,18,.82);
        }

        .modal-content {
          position: relative;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          padding: 15px;
          border-radius: 14px;
          background: #fffdf8;
          overflow: auto;
        }

        .modal-content img,
        .modal-content video {
          display: block;
          width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,.95);
          cursor: pointer;
          font-size: 14px;
        }

        .modal-info {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 4px 2px;
          color: #5e4c3b;
          font-size: 11px;
        }

        @media (max-width: 1100px) {

          .media-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

        }

        @media (max-width: 800px) {

          .media-page {
            padding: 18px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          h1 {
            font-size: 29px;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .upload-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .upload-button {
            margin-left: 0;
          }

          .library-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .media-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 520px) {

          .media-grid {
            grid-template-columns: 1fr;
          }

          .media-preview {
            height: 220px;
          }

        }

      `}</style>

    </main>
  );
}