"use client";

import { useEffect, useMemo, useState } from "react";

type ReservationStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  menu: string;
  note: string;
  status: ReservationStatus;
  createdAt: string;
};

const STORAGE_KEY = "nababi-reservations";

const emptyForm = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: 2,
  menu: "",
  note: "",
  status: "Pending" as ReservationStatus,
};

const statusColors: Record<ReservationStatus, string> = {
  Pending: "#b88a35",
  Confirmed: "#4e8a5b",
  Cancelled: "#9a4945",
  Completed: "#557c9d",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch {
        setReservations([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reservations)
    );
  }, [reservations]);

  function updateField(
    field: keyof typeof emptyForm,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveReservation() {
    if (!form.name.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    if (!form.date) {
      alert("Please select booking date.");
      return;
    }

    if (!form.time) {
      alert("Please select booking time.");
      return;
    }

    if (editingId) {
      setReservations((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );
    } else {
      const newReservation: Reservation = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
      };

      setReservations((prev) => [
        ...prev,
        newReservation,
      ]);
    }

    resetForm();
  }

  function editReservation(item: Reservation) {
    setEditingId(item.id);

    setForm({
      name: item.name,
      phone: item.phone,
      date: item.date,
      time: item.time,
      guests: item.guests,
      menu: item.menu,
      note: item.note,
      status: item.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteReservation(id: string) {
    if (!confirm("Delete this reservation?")) return;

    setReservations((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  function changeStatus(
    id: string,
    status: ReservationStatus
  ) {
    setReservations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      guests: 2,
    });

    setEditingId(null);
  }

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((item) => {
        const text = [
          item.name,
          item.phone,
          item.menu,
          item.note,
          item.date,
          item.time,
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(search.toLowerCase());
      })
      .filter((item) => {
        if (statusFilter === "All") return true;
        return item.status === statusFilter;
      })
      .sort((a, b) => {
        const first = `${a.date} ${a.time}`;
        const second = `${b.date} ${b.time}`;

        return first.localeCompare(second);
      });
  }, [reservations, search, statusFilter]);

  const pendingCount = reservations.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedCount = reservations.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedCount = reservations.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = reservations.filter(
    (item) => item.status === "Cancelled"
  ).length;

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
          maxWidth: 1250,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                color: "#d6a84f",
                fontSize: 13,
                letterSpacing: 2,
                marginBottom: 7,
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
              Reservations
            </h1>

            <p
              style={{
                color: "#bcae9b",
                marginTop: 8,
              }}
            >
              Manage table bookings and reservation requests.
            </p>
          </div>

          <a
            href="/admin"
            style={{
              background: "#d6a84f",
              color: "#1b100b",
              padding: "12px 20px",
              borderRadius: 9,
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            ← Dashboard
          </a>
        </header>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 15,
            marginBottom: 25,
          }}
        >
          <StatCard
            title="Total Reservations"
            value={reservations.length}
          />

          <StatCard
            title="Pending"
            value={pendingCount}
          />

          <StatCard
            title="Confirmed"
            value={confirmedCount}
          />

          <StatCard
            title="Completed"
            value={completedCount}
          />

          <StatCard
            title="Cancelled"
            value={cancelledCount}
          />
        </div>

        {/* FORM */}
        <section
          style={{
            background: "#2a1911",
            border: "1px solid #533526",
            borderRadius: 16,
            padding: 22,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                {editingId
                  ? "Edit Reservation"
                  : "Add Reservation"}
              </h2>

              <p
                style={{
                  color: "#a99784",
                  marginBottom: 0,
                }}
              >
                Enter customer booking details.
              </p>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                style={secondaryButton}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: 17,
            }}
          >
            <Field
              label="Customer Name *"
              value={form.name}
              onChange={(value) =>
                updateField("name", value)
              }
              placeholder="Customer name"
            />

            <Field
              label="Phone *"
              value={form.phone}
              onChange={(value) =>
                updateField("phone", value)
              }
              placeholder="+39 ..."
            />

            <div>
              <label style={labelStyle}>
                Booking Date *
              </label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  updateField("date", e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Booking Time *
              </label>

              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  updateField("time", e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Number of Guests
              </label>

              <input
                type="number"
                min="1"
                max="50"
                value={form.guests}
                onChange={(e) =>
                  updateField(
                    "guests",
                    Number(e.target.value)
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Reservation Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <Field
              label="Menu / Food Selection"
              value={form.menu}
              onChange={(value) =>
                updateField("menu", value)
              }
              placeholder="Example: Chicken Biryani, Mango Lassi..."
            />
          </div>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <label style={labelStyle}>
              Special Request / Note
            </label>

            <textarea
              value={form.note}
              onChange={(e) =>
                updateField("note", e.target.value)
              }
              rows={4}
              placeholder="Birthday, child seat, allergy information, special request..."
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <button
              onClick={saveReservation}
              style={primaryButton}
            >
              {editingId
                ? "Update Reservation"
                : "Add Reservation"}
            </button>

            <button
              onClick={resetForm}
              style={secondaryButton}
            >
              Clear
            </button>
          </div>
        </section>

        {/* LIST HEADER */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <h2 style={{ margin: 0 }}>
              All Reservations
            </h2>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search customer..."
                style={{
                  ...inputStyle,
                  width: 210,
                }}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={{
                  ...inputStyle,
                  width: 160,
                }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">
                  Confirmed
                </option>
                <option value="Cancelled">
                  Cancelled
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          {filteredReservations.length === 0 ? (
            <div
              style={{
                background: "#2a1911",
                border: "1px dashed #624331",
                borderRadius: 14,
                padding: 45,
                textAlign: "center",
                color: "#bcae9b",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  marginBottom: 10,
                }}
              >
                🍽️
              </div>

              <h3
                style={{
                  color: "#d6a84f",
                  marginBottom: 7,
                }}
              >
                No reservations yet
              </h3>

              <p style={{ margin: 0 }}>
                New table bookings will appear here.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(330px,1fr))",
                gap: 18,
              }}
            >
              {filteredReservations.map((item) => (
                <ReservationCard
                  key={item.id}
                  item={item}
                  onEdit={() =>
                    editReservation(item)
                  }
                  onDelete={() =>
                    deleteReservation(item.id)
                  }
                  onStatusChange={(status) =>
                    changeStatus(item.id, status)
                  }
                />
              ))}
            </div>
          )}
        </section>

        <div
          style={{
            marginTop: 28,
            padding: 15,
            borderRadius: 10,
            background: "#26160f",
            color: "#9f8d79",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Note: Reservations are currently saved in this
          browser's Local Storage. Later we will connect this
          section to the real database and WhatsApp
          notification system.
        </div>
      </div>
    </main>
  );
}

function ReservationCard({
  item,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  item: Reservation;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (
    status: ReservationStatus
  ) => void;
}) {
  return (
    <article
      style={{
        background: "#2a1911",
        border: "1px solid #533526",
        borderRadius: 16,
        padding: 19,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#d6a84f",
              fontSize: 20,
            }}
          >
            {item.name}
          </h3>

          <div
            style={{
              color: "#bcae9b",
              marginTop: 5,
            }}
          >
            📞 {item.phone}
          </div>
        </div>

        <span
          style={{
            background:
              statusColors[item.status],
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {item.status}
        </span>
      </div>

      <div
        style={{
          marginTop: 18,
          background: "#1c100b",
          borderRadius: 11,
          padding: 14,
        }}
      >
        <InfoRow
          label="Date"
          value={`📅 ${item.date}`}
        />

        <InfoRow
          label="Time"
          value={`🕐 ${item.time}`}
        />

        <InfoRow
          label="Guests"
          value={`👥 ${item.guests}`}
        />
      </div>

      {item.menu && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 9,
            background: "#321d13",
          }}
        >
          <strong
            style={{
              color: "#d6a84f",
              display: "block",
              marginBottom: 5,
            }}
          >
            🍽️ Menu / Food
          </strong>

          <span
            style={{
              color: "#c8b9a5",
            }}
          >
            {item.menu}
          </span>
        </div>
      )}

      {item.note && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 9,
            background: "#321d13",
          }}
        >
          <strong
            style={{
              color: "#d6a84f",
              display: "block",
              marginBottom: 5,
            }}
          >
            📝 Special Request
          </strong>

          <span
            style={{
              color: "#c8b9a5",
              lineHeight: 1.5,
            }}
          >
            {item.note}
          </span>
        </div>
      )}

      <div style={{ marginTop: 15 }}>
        <label style={labelStyle}>
          Change Status
        </label>

        <select
          value={item.status}
          onChange={(e) =>
            onStatusChange(
              e.target.value as ReservationStatus
            )
          }
          style={inputStyle}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 15,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onEdit}
          style={smallButton}
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          style={{
            ...smallButton,
            background: "#6e302d",
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        padding: "7px 0",
        color: "#c8b9a5",
      }}
    >
      <span
        style={{
          color: "#8f7d6a",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#eee0ca",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "#2a1911",
        border: "1px solid #533526",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#a99784",
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#d6a84f",
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 7,
  color: "#d8c7ad",
  fontSize: 13,
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "12px 13px",
  borderRadius: 9,
  border: "1px solid #624331",
  background: "#1c100b",
  color: "#f7ead2",
  outline: "none",
};

const primaryButton = {
  padding: "12px 20px",
  borderRadius: 9,
  border: "none",
  background: "#d6a84f",
  color: "#1b100b",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton = {
  padding: "12px 20px",
  borderRadius: 9,
  border: "1px solid #624331",
  background: "#24150e",
  color: "#f7ead2",
  fontWeight: 700,
  cursor: "pointer",
};

const smallButton = {
  padding: "9px 14px",
  borderRadius: 8,
  border: "none",
  background: "#60462e",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};