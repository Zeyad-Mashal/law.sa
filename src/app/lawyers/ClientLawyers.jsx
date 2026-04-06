"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiFilter,
  FiMapPin,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import {
  LICENSE_LABELS,
  PLATFORM_LAWYERS,
  SAUDI_CITIES,
  getSpecializationsList,
} from "@/data/lawyersDirectory";
import "./Lawyers.css";

function initials(name) {
  const parts = name.replace(/^د\.\s*|أ\.\s*/u, "").trim().split(/\s+/u);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).slice(0, 2).toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

export default function ClientLawyers() {
  const specializations = useMemo(() => getSpecializationsList(), []);
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [nameQuery, setNameQuery] = useState("");

  const filtered = useMemo(() => {
    const q = nameQuery.trim();
    return PLATFORM_LAWYERS.filter((l) => {
      if (specialty && l.specialization !== specialty) return false;
      if (city && l.city !== city) return false;
      if (q && !l.name.includes(q)) return false;
      return true;
    });
  }, [specialty, city, nameQuery]);

  function resetFilters() {
    setSpecialty("");
    setCity("");
    setNameQuery("");
  }

  const hasActiveFilters = Boolean(specialty || city || nameQuery.trim());

  return (
    <main className="law-page">
      <div className="law-wrap">
        <header className="law-hero">
          <p className="law-eyebrow">دليل المحامين</p>
          <h1 className="law-title">المحامون على المنصة</h1>
          <p className="law-lead">
            تصفح المحامين المرخصين والمستشارين حسب التخصص والمدينة في أنحاء
            المملكة.
          </p>
        </header>

        <section className="law-filters" aria-label="تصفية القائمة">
          <div className="law-filters-head">
            <span className="law-filters-icon" aria-hidden>
              <FiFilter strokeWidth={1.5} size={18} />
            </span>
            <span className="law-filters-label">تصفية النتائج</span>
          </div>
          <div className="law-field law-field--search">
            <label className="law-field-label" htmlFor="law-name-search">
              بحث بالاسم
            </label>
            <div className="law-search-wrap">
              <FiSearch
                aria-hidden
                className="law-search-icon"
                strokeWidth={1.5}
                size={18}
              />
              <input
                id="law-name-search"
                type="search"
                className="law-search-input"
                placeholder="اكتب اسم المحامي أو جزءاً منه..."
                autoComplete="off"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="law-filters-grid">
            <div className="law-field">
              <label className="law-field-label" htmlFor="law-specialty">
                <FiBriefcase aria-hidden className="law-field-icon" />
                التخصص
              </label>
              <select
                id="law-specialty"
                className="law-select"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">جميع التخصصات</option>
                {specializations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="law-field">
              <label className="law-field-label" htmlFor="law-city">
                <FiMapPin aria-hidden className="law-field-icon" />
                المدينة
              </label>
              <select
                id="law-city"
                className="law-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">جميع المدن</option>
                {SAUDI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hasActiveFilters ? (
            <div className="law-filters-actions">
              <button
                type="button"
                className="law-btn-reset"
                onClick={resetFilters}
              >
                مسح التصفية
              </button>
            </div>
          ) : null}
        </section>

        <p className="law-count" role="status">
          <FiUsers aria-hidden className="law-count-icon" strokeWidth={1.5} />
          {filtered.length === PLATFORM_LAWYERS.length
            ? `${PLATFORM_LAWYERS.length} محامٍ على المنصة`
            : `${filtered.length} نتيجة من أصل ${PLATFORM_LAWYERS.length}`}
        </p>

        {filtered.length === 0 ? (
          <div className="law-empty">
            <p className="law-empty-title">لا يوجد محامٍ يطابق التصفية</p>
            <p className="law-empty-hint">
              جرّب تعديل البحث بالاسم أو التخصص أو المدينة، أو امسح التصفية
              لعرض الجميع.
            </p>
            <button
              type="button"
              className="law-btn-primary"
              onClick={resetFilters}
            >
              عرض كل المحامين
            </button>
          </div>
        ) : (
          <ul className="law-grid">
            {filtered.map((lawyer) => (
              <li key={lawyer.id}>
                <article className="law-card">
                  <div className="law-card-top">
                    <div
                      className="law-avatar"
                      aria-hidden
                      title={lawyer.name}
                    >
                      {initials(lawyer.name)}
                    </div>
                    <div className="law-card-head">
                      <h2 className="law-card-name">{lawyer.name}</h2>
                      <span className="law-card-badge">
                        {LICENSE_LABELS[lawyer.licenseType] ??
                          lawyer.licenseType}
                      </span>
                    </div>
                  </div>
                  <ul className="law-card-meta">
                    <li>
                      <FiBriefcase aria-hidden />
                      {lawyer.specialization}
                    </li>
                    <li>
                      <FiMapPin aria-hidden />
                      {lawyer.city}
                    </li>
                    <li className="law-card-exp">
                      الخبرة:{" "}
                      <strong>{lawyer.experienceYears} سنة</strong>
                    </li>
                  </ul>
                  <Link
                    href={`/lawyer-details/${lawyer.id}`}
                    className="law-card-cta"
                  >
                    طلب التواصل
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
