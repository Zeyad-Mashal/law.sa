"use client";

import { useMemo, useState } from "react";
import "./Consultations.css";

const INITIAL_BOOKINGS = [
  {
    id: "c1",
    clientName: "عبدالله محمد",
    service: "استشارة قانونية تجارية",
    date: "2026-04-10",
    time: "06:30 م",
    type: "عن بعد",
    amount: "250 ريال",
    note: "يرغب بمراجعة عقد شراكة.",
    status: "pending",
  },
  {
    id: "c2",
    clientName: "ريم السعد",
    service: "استشارة أحوال شخصية",
    date: "2026-04-11",
    time: "04:00 م",
    type: "حضوري",
    amount: "300 ريال",
    note: "استفسار بخصوص الحضانة والنفقة.",
    status: "pending",
  },
  {
    id: "c3",
    clientName: "شركة آفاق التقنية",
    service: "استشارة امتثال وعقود",
    date: "2026-04-13",
    time: "01:00 م",
    type: "عن بعد",
    amount: "500 ريال",
    note: "مراجعة شروط تعاقد SaaS.",
    status: "accepted",
  },
];

const STATUS_LABEL = {
  pending: "بانتظار الإجراء",
  accepted: "تم القبول",
  cancelled: "تم الإلغاء",
};

const STATUS_CLASS = {
  pending: "co-badge co-badge--pending",
  accepted: "co-badge co-badge--accepted",
  cancelled: "co-badge co-badge--cancelled",
};

const ClientConsultations = () => {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [modalError, setModalError] = useState("");

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const accepted = bookings.filter((b) => b.status === "accepted").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    return {
      pending,
      accepted,
      cancelled,
      total: bookings.length,
    };
  }, [bookings]);

  const visibleBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  }, [activeFilter, bookings]);

  function acceptBooking(id) {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "accepted" } : booking,
      ),
    );
  }

  function openCancelModal(id) {
    setCancelTargetId(id);
    setCancelReason("");
    setModalError("");
  }

  function closeCancelModal() {
    setCancelTargetId(null);
    setCancelReason("");
    setModalError("");
  }

  function confirmCancellation() {
    if (!cancelReason.trim()) {
      setModalError("يرجى كتابة سبب الإلغاء.");
      return;
    }
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === cancelTargetId
          ? {
              ...booking,
              status: "cancelled",
              cancelReason: cancelReason.trim(),
            }
          : booking,
      ),
    );
    closeCancelModal();
  }

  return (
    <main className="co-page">
      <div className="co-wrap">
        <header className="co-header">
          <h1 className="co-title">حجوزات الاستشارات</h1>
          <p className="co-subtitle">
            إدارة جميع الحجوزات بسهولة: قبول الحجز، أو إلغاؤه مع توضيح السبب.
          </p>
        </header>

        <section className="co-stats">
          <article className="co-stat">
            <p className="co-stat-label">إجمالي الحجوزات</p>
            <p className="co-stat-value">{stats.total}</p>
          </article>
          <article className="co-stat">
            <p className="co-stat-label">بانتظار الإجراء</p>
            <p className="co-stat-value">{stats.pending}</p>
          </article>
          <article className="co-stat">
            <p className="co-stat-label">تم القبول</p>
            <p className="co-stat-value">{stats.accepted}</p>
          </article>
          <article className="co-stat">
            <p className="co-stat-label">تم الإلغاء</p>
            <p className="co-stat-value">{stats.cancelled}</p>
          </article>
        </section>

        <section className="co-filters" aria-label="تصفية الحجوزات">
          <button
            type="button"
            className={`co-filter-btn${activeFilter === "all" ? " is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            الكل
          </button>
          <button
            type="button"
            className={`co-filter-btn${activeFilter === "pending" ? " is-active" : ""}`}
            onClick={() => setActiveFilter("pending")}
          >
            بانتظار الإجراء
          </button>
          <button
            type="button"
            className={`co-filter-btn${activeFilter === "accepted" ? " is-active" : ""}`}
            onClick={() => setActiveFilter("accepted")}
          >
            المقبولة
          </button>
          <button
            type="button"
            className={`co-filter-btn${activeFilter === "cancelled" ? " is-active" : ""}`}
            onClick={() => setActiveFilter("cancelled")}
          >
            الملغاة
          </button>
        </section>

        {visibleBookings.length === 0 ? (
          <p className="co-empty">لا توجد حجوزات في هذا القسم حالياً.</p>
        ) : (
          <section className="co-list">
            {visibleBookings.map((booking) => (
              <article key={booking.id} className="co-card">
                <div className="co-card-top">
                  <div>
                    <h2 className="co-client">{booking.clientName}</h2>
                    <p className="co-service">{booking.service}</p>
                  </div>
                  <span className={STATUS_CLASS[booking.status]}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                </div>

                <ul className="co-meta">
                  <li>
                    <span>التاريخ:</span> {booking.date}
                  </li>
                  <li>
                    <span>الوقت:</span> {booking.time}
                  </li>
                  <li>
                    <span>نوع الجلسة:</span> {booking.type}
                  </li>
                  <li>
                    <span>القيمة:</span> {booking.amount}
                  </li>
                </ul>

                <p className="co-note">{booking.note}</p>

                {booking.cancelReason ? (
                  <p className="co-cancel-reason">
                    <strong>سبب الإلغاء:</strong> {booking.cancelReason}
                  </p>
                ) : null}

                <div className="co-actions">
                  <button
                    type="button"
                    className="co-btn co-btn--cancel"
                    onClick={() => openCancelModal(booking.id)}
                    disabled={booking.status === "cancelled"}
                  >
                    إلغاء الحجز
                  </button>
                  <button
                    type="button"
                    className="co-btn co-btn--accept"
                    onClick={() => acceptBooking(booking.id)}
                    disabled={booking.status === "accepted"}
                  >
                    قبول الحجز
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {cancelTargetId ? (
        <div
          className="co-modal-overlay"
          role="presentation"
          onClick={closeCancelModal}
        >
          <div
            className="co-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="cancel-modal-title" className="co-modal-title">
              سبب إلغاء الحجز
            </h3>
            <p className="co-modal-subtitle">
              من فضلك اكتب سبب الإلغاء قبل تأكيد العملية.
            </p>
            <textarea
              className="co-modal-textarea"
              rows={4}
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (modalError) setModalError("");
              }}
              placeholder="اكتب سبب الإلغاء هنا..."
            />
            {modalError ? <p className="co-modal-error">{modalError}</p> : null}
            <div className="co-modal-actions">
              <button
                type="button"
                className="co-btn co-btn--cancel"
                onClick={confirmCancellation}
              >
                تأكيد الإلغاء
              </button>
              <button
                type="button"
                className="co-btn co-btn--ghost"
                onClick={closeCancelModal}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default ClientConsultations;
