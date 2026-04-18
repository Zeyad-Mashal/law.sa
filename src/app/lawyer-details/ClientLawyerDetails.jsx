"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowRight, FiBriefcase, FiLock, FiMapPin } from "react-icons/fi";
import {
  getLawyerById,
  LICENSE_LABELS,
} from "@/data/lawyersDirectory";
import "./LawyerDetails.css";

function initials(name) {
  const parts = name.replace(/^د\.\s*|أ\.\s*/u, "").trim().split(/\s+/u);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).slice(0, 2).toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

export default function ClientLawyerDetails() {
  const params = useParams();
  const id = params?.id;
  const lawyer =
    typeof id === "string"
      ? getLawyerById(id)
      : Array.isArray(id)
        ? getLawyerById(id[0])
        : null;

  if (!lawyer) {
    return (
      <main className="ld-page">
        <div className="ld-wrap">
          <div className="ld-not-found">
            <h1 className="ld-not-found-title">المحامي غير موجود</h1>
            <p className="ld-not-found-hint">
              ربما حُذف الرابط أو تغيّر المعرف. عد إلى دليل المحامين واختر
              اسماً من القائمة.
            </p>
            <Link href="/lawyers" className="ld-btn-book">
              العودة إلى المحامين
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ld-page">
      <div className="ld-wrap">
        <Link href="/lawyers" className="ld-back">
          <FiArrowRight aria-hidden className="ld-back-icon" />
          العودة إلى دليل المحامين
        </Link>

        <header className="ld-profile">
          <div className="ld-profile-top">
            <div className="ld-avatar" aria-hidden>
              {initials(lawyer.name)}
            </div>
            <div className="ld-profile-head">
              <h1 className="ld-name">{lawyer.name}</h1>
              <span className="ld-badge">
                {LICENSE_LABELS[lawyer.licenseType] ?? lawyer.licenseType}
              </span>
            </div>
          </div>

          <ul className="ld-meta">
            <li>
              <FiBriefcase aria-hidden />
              <span>{lawyer.specialization}</span>
            </li>
            <li>
              <FiMapPin aria-hidden />
              <span>{lawyer.city}</span>
            </li>
            <li>
              سنوات الخبرة:{" "}
              <strong className="ld-exp">{lawyer.experienceYears} سنة</strong>
            </li>
          </ul>
        </header>

        <section className="ld-section" aria-labelledby="ld-about-heading">
          <h2 id="ld-about-heading" className="ld-section-title">
            نبذة
          </h2>
          <p className="ld-bio">{lawyer.bio}</p>
        </section>

        <section
          className="ld-section ld-contact-gate"
          aria-labelledby="ld-contact-heading"
        >
          <h2 id="ld-contact-heading" className="ld-section-title">
            التواصل والحجز
          </h2>
          <div className="ld-lock-card">
            <span className="ld-lock-icon-wrap" aria-hidden>
              <FiLock strokeWidth={1.5} size={22} />
            </span>
            <p className="ld-lock-text">
              يجب الاشتراك في المنصة لإظهار بيانات التواصل مع هذا المحامي
              وإتمام الحجز.
            </p>
            <p className="ld-lock-sub">
              لا تُعرض هنا أرقام الجوال أو البريد الإلكتروني أو أي وسيلة تواصل
              مباشرة قبل تفعيل اشتراكك.
            </p>
          </div>
        </section>

        <div className="ld-cta-row">
          <Link href="/book-consultation" className="ld-btn-book">
            احجز استشارتك الآن
          </Link>
        </div>
      </div>
    </main>
  );
}
