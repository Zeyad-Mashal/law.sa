 "use client";

import { useMemo, useState } from "react";
import "./Profile.css";

const EMPTY_FORM = {
  title: "",
  duration: "",
  price: "",
  description: "",
};

function makeServicePayload(form) {
  return {
    title: form.title.trim(),
    duration: form.duration.trim(),
    price: form.price.trim(),
    description: form.description.trim(),
  };
}

const ClientProfile = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [error, setError] = useState("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  function onChangeField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
  }

  function validateForm() {
    if (!form.title.trim()) return "اكتبي اسم الخدمة.";
    if (!form.duration.trim()) return "اكتبي مدة الاستشارة.";
    if (!form.price.trim()) return "اكتبي سعر الخدمة.";
    if (!form.description.trim()) return "اكتبي وصف مختصر للخدمة.";
    return "";
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = makeServicePayload(form);

    if (isEditing) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingId ? { ...service, ...payload } : service,
        ),
      );
      resetForm();
      return;
    }

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}`;
    setServices((prev) => [{ id, ...payload }, ...prev]);
    resetForm();
  }

  function onDeleteService(id) {
    setServices((prev) => prev.filter((service) => service.id !== id));
    if (editingId === id) resetForm();
    setPendingDeleteId(null);
  }

  function onEditService(service) {
    setEditingId(service.id);
    setForm({
      title: service.title,
      duration: service.duration,
      price: service.price,
      description: service.description,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="lp-page">
      <div className="lp-wrap">
        <header className="lp-header">
          <button type="button" className="lp-btn-view">
            عرض الاستشارات
          </button>
          <h1 className="lp-title">إدارة خدمات المحامي</h1>
          <p className="lp-subtitle">
            أضيفي خدماتك، وحدّثي التفاصيل، واحذفي أي خدمة غير متاحة حالياً.
          </p>
        </header>

        <section className="lp-form-card">
          <h2 className="lp-section-title">
            {isEditing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </h2>
          <form className="lp-form" onSubmit={onSubmit}>
            <div className="lp-grid">
              <label className="lp-field">
                <span>اسم الخدمة</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onChangeField("title", e.target.value)}
                  placeholder="مثال: استشارة قانونية تجارية"
                />
              </label>

              <label className="lp-field">
                <span>مدة الاستشارة</span>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => onChangeField("duration", e.target.value)}
                  placeholder="مثال: 45 دقيقة"
                />
              </label>

              <label className="lp-field">
                <span>السعر</span>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => onChangeField("price", e.target.value)}
                  placeholder="مثال: 250 ريال"
                />
              </label>
            </div>

            <label className="lp-field">
              <span>وصف الخدمة</span>
              <textarea
                value={form.description}
                onChange={(e) => onChangeField("description", e.target.value)}
                rows={4}
                placeholder="اكتبي تفاصيل مختصرة عن الخدمة وما تتضمنه."
              />
            </label>

            {error ? <p className="lp-error">{error}</p> : null}

            <div className="lp-actions">
              <button type="submit" className="lp-btn-primary">
                {isEditing ? "حفظ التعديلات" : "إضافة الخدمة"}
              </button>
              {isEditing ? (
                <button
                  type="button"
                  className="lp-btn-secondary"
                  onClick={resetForm}
                >
                  إلغاء
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="lp-services">
          <h2 className="lp-section-title">الخدمات المضافة</h2>
          {services.length === 0 ? (
            <p className="lp-empty">لا توجد خدمات بعد. أضيفي أول خدمة الآن.</p>
          ) : (
            <div className="lp-cards">
              {services.map((service) => (
                <article key={service.id} className="lp-card">
                  <h3 className="lp-card-title">{service.title}</h3>
                  <p className="lp-card-meta">
                    <span>المدة: {service.duration}</span>
                    <span>السعر: {service.price}</span>
                  </p>
                  <p className="lp-card-desc">{service.description}</p>
                  <div className="lp-card-actions">
                    <button
                      type="button"
                      className="lp-btn-edit"
                      onClick={() => onEditService(service)}
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      className="lp-btn-delete"
                      onClick={() => setPendingDeleteId(service.id)}
                    >
                      حذف
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      {pendingDeleteId ? (
        <div
          className="lp-modal-overlay"
          role="presentation"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="lp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-service-title" className="lp-modal-title">
              هل تريد الحذف؟
            </h3>
            <p className="lp-modal-text">
              سيتم حذف الخدمة نهائيا من قائمتك.
            </p>
            <div className="lp-modal-actions">
              <button
                type="button"
                className="lp-btn-delete"
                onClick={() => onDeleteService(pendingDeleteId)}
              >
                نعم
              </button>
              <button
                type="button"
                className="lp-btn-secondary"
                onClick={() => setPendingDeleteId(null)}
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

export default ClientProfile;
