"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nababi-website-status";

type WebsiteStatus = {
  online: boolean;
  message: string;
};

const defaultStatus: WebsiteStatus = {
  online: true,
  message:
    "Nababi Ristorante is temporarily closed for maintenance. Please check again soon.",
};

export default function WebsiteStatusPage() {
  const [status, setStatus] = useState<WebsiteStatus>(defaultStatus);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
      try {
        setStatus(JSON.parse(data));
      } catch {
        setStatus(defaultStatus);
      }
    }
  }, []);

  function saveStatus() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  function resetStatus() {
    setStatus(defaultStatus);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultStatus)
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1b100b",
        color: "#f7ead2",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 850,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <div
            style={{
              color: "#d6a84f",
              letterSpacing: 2,
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            NABABI RISTORANTE
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 32,
            }}
          >
            Website Status
          </h1>

          <p
            style={{
              color: "#bcae9b",
              marginTop: 8,
            }}
          >
            Control whether the public restaurant website is online
            or in maintenance mode.
          </p>
        </div>

        {/* STATUS CARD */}
        <section
          style={{
            background: "#2a1911",
            border: "1px solid #533526",
            borderRadius: 16,
            padding: 25,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Current Website Status
          </h2>

          <button
            onClick={() =>
              setStatus((prev) => ({
                ...prev,
                online: true,
              }))
            }
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: 12,
              border: status.online
                ? "2px solid #62b36f"
                : "1px solid #624331",
              background: status.online
                ? "#254b2e"
                : "#1c100b",
              color: "#fff",
              cursor: "pointer",
              textAlign: "left",
              marginBottom: 12,
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 18,
                marginBottom: 5,
              }}
            >
              🟢 Website Online
            </strong>

            <span
              style={{
                color: "#bcae9b",
              }}
            >
              Visitors can access the public restaurant website.
            </span>
          </button>

          <button
            onClick={() =>
              setStatus((prev) => ({
                ...prev,
                online: false,
              }))
            }
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: 12,
              border: !status.online
                ? "2px solid #c45c57"
                : "1px solid #624331",
              background: !status.online
                ? "#4a2422"
                : "#1c100b",
              color: "#fff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 18,
                marginBottom: 5,
              }}
            >
              🔴 Maintenance Mode
            </strong>

            <span
              style={{
                color: "#bcae9b",
              }}
            >
              Visitors will see the maintenance message instead.
            </span>
          </button>
        </section>

        {/* MESSAGE */}
        <section
          style={{
            background: "#2a1911",
            border: "1px solid #533526",
            borderRadius: 16,
            padding: 25,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Maintenance Message
          </h2>

          <p
            style={{
              color: "#bcae9b",
              fontSize: 14,
            }}
          >
            This message will be shown to visitors when the website
            is in maintenance mode.
          </p>

          <textarea
            value={status.message}
            onChange={(e) =>
              setStatus((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
            rows={5}
            placeholder="Enter maintenance message..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #624331",
              background: "#1c100b",
              color: "#f7ead2",
              resize: "vertical",
              outline: "none",
            }}
          />
        </section>

        {/* PREVIEW */}
        <section
          style={{
            background: "#2a1911",
            border: "1px solid #533526",
            borderRadius: 16,
            padding: 25,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Preview
          </h2>

          <div
            style={{
              background: "#140b08",
              borderRadius: 12,
              padding: 35,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 42,
                marginBottom: 15,
              }}
            >
              {status.online ? "🟢" : "🔧"}
            </div>

            <h3
              style={{
                color: "#d6a84f",
                fontSize: 24,
                marginBottom: 10,
              }}
            >
              {status.online
                ? "Nababi Ristorante"
                : "We'll Be Back Soon"}
            </h3>

            <p
              style={{
                color: "#bcae9b",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {status.online
                ? "Our website is currently online."
                : status.message}
            </p>
          </div>
        </section>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={saveStatus}
            style={{
              padding: "13px 22px",
              border: "none",
              borderRadius: 9,
              background: "#d6a84f",
              color: "#1b100b",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Save Status
          </button>

          <button
            onClick={resetStatus}
            style={{
              padding: "13px 22px",
              border: "1px solid #624331",
              borderRadius: 9,
              background: "#24150e",
              color: "#f7ead2",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset
          </button>

          <a
            href="/admin"
            style={{
              padding: "13px 22px",
              border: "1px solid #624331",
              borderRadius: 9,
              background: "#24150e",
              color: "#f7ead2",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Dashboard
          </a>
        </div>

        {saved && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 9,
              background: "#254b2e",
              color: "#dff5e2",
            }}
          >
            ✓ Website status saved successfully.
          </div>
        )}

        <div
          style={{
            marginTop: 25,
            padding: 15,
            borderRadius: 10,
            background: "#26160f",
            color: "#9f8d79",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Note: This currently saves the setting in this browser's
          Local Storage. Later, when we connect the real database,
          this status will control the public website for all visitors.
        </div>
      </div>
    </main>
  );
}