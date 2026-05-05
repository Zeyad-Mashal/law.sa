 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiBriefcase,
  FiChevronLeft,
  FiEdit2,
  FiFileText,
  FiMenu,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiUser,
  FiX,
} from "react-icons/fi";
import logOut from "../API/LogOut/LogOut";
import "./Profile.css";

const SAUDI_REGIONS_AND_CITIES = {
  "منطقة الرياض": [
    "الرياض",
    "الخرج",
    "الدوادمي",
    "المجمعة",
    "القويعية",
    "وادي الدواسر",
    "الأفلاج",
    "الزلفي",
    "شقراء",
    "حوطة بني تميم",
    "عفيف",
    "الغاط",
    "السليل",
    "ضرما",
    "المزاحمية",
    "رماح",
    "ثادق",
    "حريملاء",
  ],
  "منطقة مكة المكرمة": [
    "مكة المكرمة",
    "جدة",
    "الطائف",
    "القنفذة",
    "الليث",
    "رابغ",
    "الجموم",
    "الكامل",
    "خليص",
    "رنية",
    "الخرمة",
    "تربة",
    "العرضيات",
    "المويه",
    "بحرة",
  ],
  "المنطقة الشرقية": [
    "الدمام",
    "الخبر",
    "الظهران",
    "الأحساء",
    "الجبيل",
    "القطيف",
    "حفر الباطن",
    "الخفجي",
    "رأس تنورة",
    "بقيق",
    "النعيرية",
    "قرية العليا",
    "العديد",
  ],
  "منطقة المدينة المنورة": [
    "المدينة المنورة",
    "ينبع",
    "العلا",
    "المهد",
    "الحناكية",
    "بدر",
    "خيبر",
    "وادي الفرع",
  ],
  "منطقة القصيم": [
    "بريدة",
    "عنيزة",
    "الرس",
    "البكيرية",
    "البدائع",
    "المذنب",
    "رياض الخبراء",
    "عيون الجواء",
    "الشماسية",
    "النبهانية",
    "عقلة الصقور",
    "الأسياح",
  ],
  "منطقة عسير": [
    "أبها",
    "خميس مشيط",
    "بيشة",
    "النماص",
    "محايل عسير",
    "أحد رفيدة",
    "سراة عبيدة",
    "رجال ألمع",
    "ظهران الجنوب",
    "بلقرن",
    "تثليث",
    "المجاردة",
    "بارق",
    "تنومة",
  ],
  "منطقة تبوك": [
    "تبوك",
    "الوجه",
    "ضباء",
    "تيماء",
    "أملج",
    "حقل",
    "البدع",
  ],
  "منطقة حائل": ["حائل", "بقعاء", "الغزالة", "الشنان", "سميراء", "موقق"],
  "منطقة الحدود الشمالية": ["عرعر", "رفحاء", "طريف", "العويقيلة"],
  "منطقة جازان": [
    "جازان",
    "صبيا",
    "أبو عريش",
    "صامطة",
    "الدرب",
    "بيش",
    "أحد المسارحة",
    "الحرث",
    "العارضة",
    "ضمد",
    "الدائر",
    "فيفاء",
  ],
  "منطقة نجران": ["نجران", "شرورة", "حبونا", "يدمة", "بدر الجنوب", "ثار"],
  "منطقة الباحة": [
    "الباحة",
    "بلجرشي",
    "المندق",
    "المخواة",
    "قلوة",
    "العقيق",
    "القرى",
  ],
  "منطقة الجوف": ["سكاكا", "دومة الجندل", "القريات", "طبرجل"],
};

const REGIONS = Object.keys(SAUDI_REGIONS_AND_CITIES);

const ClientProfile = () => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    region: REGIONS[0],
    city: SAUDI_REGIONS_AND_CITIES[REGIONS[0]][0],
    accountType: "فرد",
  });
  const [draftForm, setDraftForm] = useState(profileForm);

  function openLogoutModal() {
    setIsLogoutModalOpen(true);
  }

  function closeLogoutModal() {
    setIsLogoutModalOpen(false);
  }

  function openEditModal(type) {
    setDraftForm(profileForm);
    setEditModal(type);
  }

  function closeEditModal() {
    setEditModal(null);
  }

  function handleDraftFieldChange(e) {
    const { name, value } = e.target;
    setSaveMessage("");
    setDraftForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDraftRegionChange(e) {
    const nextRegion = e.target.value;
    const firstCity = SAUDI_REGIONS_AND_CITIES[nextRegion]?.[0] ?? "";
    setSaveMessage("");
    setDraftForm((prev) => ({
      ...prev,
      region: nextRegion,
      city: firstCity,
    }));
  }

  function applyEditModal() {
    const nextProfile = {
      ...draftForm,
      phoneNumber: draftForm.phoneNumber.replace(/\D/g, "").slice(0, 9),
    };
    setProfileForm(nextProfile);
    setEditModal(null);
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    localStorage.setItem("profile_data", JSON.stringify(profileForm));
    setSaveMessage("تم حفظ بيانات الملف الشخصي بنجاح.");
  }

  async function handleConfirmLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const accessToken =
      localStorage.getItem("access_token") || localStorage.getItem("token") || "";
    await logOut({ accessToken });
    localStorage.removeItem("otp_success");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("profile_data");
    setIsLoggingOut(false);
    router.push("/");
    router.refresh();
    closeLogoutModal();
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("profile_data");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") return;
      const next = {
        fullName: parsed.fullName || "",
        phoneNumber: parsed.phoneNumber || "",
        email: parsed.email || "",
        gender: parsed.gender || "",
        region:
          parsed.region && SAUDI_REGIONS_AND_CITIES[parsed.region]
            ? parsed.region
            : REGIONS[0],
        city: "",
        accountType: parsed.accountType === "منشأة" ? "منشأة" : "فرد",
      };
      const cityOptions = SAUDI_REGIONS_AND_CITIES[next.region] || [];
      next.city = cityOptions.includes(parsed.city) ? parsed.city : cityOptions[0] || "";
      setProfileForm(next);
      setDraftForm(next);
    } catch {
      // ignore invalid localStorage data
    }
  }, []);

  const accountTypeIcon = useMemo(() => {
    return profileForm.accountType === "منشأة" ? (
      <FiBriefcase />
    ) : (
      <FiUser />
    );
  }, [profileForm.accountType]);

  return (
    <main className="profile-page" dir="rtl">
      <div
        className={`profile-layout${isSidebarCollapsed ? " is-collapsed" : ""}`}
      >
        <aside
          className={`profile-sidebar${isSidebarCollapsed ? " is-collapsed" : ""}${isMobileSidebarOpen ? " is-mobile-open" : ""}`}
        >
          <div className="profile-sidebar-head">
            <h2 className="profile-sidebar-title">لوحة التحكم</h2>
            <button
              type="button"
              className="profile-mobile-close"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <FiX />
            </button>
          </div>
          <button
            type="button"
            className="profile-sidebar-toggle"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? "فتح القائمة" : "طي القائمة"}
          >
            <FiChevronLeft />
          </button>
          <nav className="profile-menu" aria-label="قائمة الملف الشخصي">
            <Link href="/" className="profile-menu-item" data-label="الرئيسية">
              <FiHome className="profile-menu-icon" />
              <span className="profile-menu-text">الرئيسية</span>
            </Link>
            <button
              type="button"
              className="profile-menu-item"
              data-label="طلباتي"
            >
              <FiFileText className="profile-menu-icon" />
              <span className="profile-menu-text">طلباتي</span>
            </button>
            <Link
              href="/profile"
              className="profile-menu-item profile-menu-item--active"
              aria-current="page"
              data-label="الملف الشخصي"
            >
              <FiUser className="profile-menu-icon" />
              <span className="profile-menu-text">الملف الشخصي</span>
            </Link>
            <button
              type="button"
              className="profile-menu-item profile-menu-item--danger"
              onClick={openLogoutModal}
              data-label="تسجيل الخروج"
            >
              <FiLogOut className="profile-menu-icon" />
              <span className="profile-menu-text">تسجيل الخروج</span>
            </button>
          </nav>
        </aside>

        <section className="profile-content">
          <button
            type="button"
            className="profile-mobile-menu-btn"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="فتح قائمة الملف الشخصي"
          >
            <FiMenu />
            <span>القائمة</span>
          </button>
          <h1 className="profile-content-title">الملف الشخصي</h1>
          <p className="profile-content-subtitle">
            يمكنك تعديل جميع بيانات حسابك من هنا.
          </p>

          <form className="profile-form" onSubmit={handleSaveProfile}>
            <div className="profile-summary-grid">
              <div className="profile-summary-card">
                <h3>البيانات الأساسية</h3>
                <p>الاسم، الجوال، البريد، الجنس</p>
                <button
                  type="button"
                  className="profile-edit-trigger"
                  onClick={() => openEditModal("basic")}
                >
                  <FiEdit2 /> تعديل
                </button>
              </div>
              <div className="profile-summary-card">
                <h3>المنطقة والمدينة</h3>
                <p>
                  <FiMapPin /> {profileForm.region} - {profileForm.city}
                </p>
                <button
                  type="button"
                  className="profile-edit-trigger"
                  onClick={() => openEditModal("location")}
                >
                  <FiEdit2 /> تعديل
                </button>
              </div>
              <div className="profile-summary-card">
                <h3>نوع الحساب</h3>
                <p>
                  {accountTypeIcon} {profileForm.accountType}
                </p>
                <button
                  type="button"
                  className="profile-edit-trigger"
                  onClick={() => openEditModal("account")}
                >
                  <FiEdit2 /> تعديل
                </button>
              </div>
            </div>

            <div className="profile-info-list">
              <div className="profile-info-row">
                <span>الاسم الكامل</span>
                <strong>{profileForm.fullName || "-"}</strong>
              </div>
              <div className="profile-info-row">
                <span>رقم الجوال</span>
                <strong>{profileForm.phoneNumber || "-"}</strong>
              </div>
              <div className="profile-info-row">
                <span>البريد الإلكتروني</span>
                <strong>{profileForm.email || "-"}</strong>
              </div>
              <div className="profile-info-row">
                <span>الجنس</span>
                <strong>{profileForm.gender || "-"}</strong>
              </div>
            </div>

            <div className="profile-form-actions">
              <button type="submit" className="profile-save-btn">
                حفظ التعديلات
              </button>
              {saveMessage ? (
                <span className="profile-save-message">{saveMessage}</span>
              ) : null}
            </div>
          </form>
        </section>
      </div>

      {isMobileSidebarOpen ? (
        <button
          type="button"
          className="profile-mobile-overlay"
          aria-label="إغلاق القائمة الجانبية"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}

      {editModal ? (
        <div className="profile-modal-backdrop" onClick={closeEditModal}>
          <div
            className="profile-modal profile-modal--animated"
            role="dialog"
            aria-modal="true"
            aria-label="تعديل بيانات الملف الشخصي"
            onClick={(e) => e.stopPropagation()}
          >
            {editModal === "basic" ? (
              <>
                <h3 className="profile-modal-title">تعديل البيانات الأساسية</h3>
                <div className="profile-form-grid">
                  <label className="profile-field">
                    <span className="profile-field-label">الاسم الكامل</span>
                    <input
                      type="text"
                      name="fullName"
                      className="profile-input"
                      value={draftForm.fullName}
                      onChange={handleDraftFieldChange}
                    />
                  </label>
                  <label className="profile-field">
                    <span className="profile-field-label">رقم الجوال</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="profile-input"
                      value={draftForm.phoneNumber}
                      onChange={handleDraftFieldChange}
                      maxLength={9}
                    />
                  </label>
                  <label className="profile-field">
                    <span className="profile-field-label">البريد الإلكتروني</span>
                    <input
                      type="email"
                      name="email"
                      className="profile-input"
                      value={draftForm.email}
                      onChange={handleDraftFieldChange}
                    />
                  </label>
                  <label className="profile-field">
                    <span className="profile-field-label">الجنس</span>
                    <select
                      name="gender"
                      className="profile-input"
                      value={draftForm.gender}
                      onChange={handleDraftFieldChange}
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </label>
                </div>
              </>
            ) : null}

            {editModal === "location" ? (
              <>
                <h3 className="profile-modal-title">تعديل المنطقة والمدينة</h3>
                <div className="profile-form-grid">
                  <label className="profile-field">
                    <span className="profile-field-label">المنطقة</span>
                    <select
                      name="region"
                      className="profile-input"
                      value={draftForm.region}
                      onChange={handleDraftRegionChange}
                    >
                      {REGIONS.map((regionName) => (
                        <option key={regionName} value={regionName}>
                          {regionName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="profile-field">
                    <span className="profile-field-label">المدينة</span>
                    <select
                      name="city"
                      className="profile-input"
                      value={draftForm.city}
                      onChange={handleDraftFieldChange}
                    >
                      {(SAUDI_REGIONS_AND_CITIES[draftForm.region] || []).map(
                        (cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
              </>
            ) : null}

            {editModal === "account" ? (
              <>
                <h3 className="profile-modal-title">اختر نوع الحساب</h3>
                <div className="account-type-options">
                  <button
                    type="button"
                    className={`account-type-option${draftForm.accountType === "فرد" ? " is-active" : ""}`}
                    onClick={() =>
                      setDraftForm((prev) => ({ ...prev, accountType: "فرد" }))
                    }
                  >
                    <FiUser />
                    <span>فرد</span>
                  </button>
                  <button
                    type="button"
                    className={`account-type-option${draftForm.accountType === "منشأة" ? " is-active" : ""}`}
                    onClick={() =>
                      setDraftForm((prev) => ({ ...prev, accountType: "منشأة" }))
                    }
                  >
                    <FiBriefcase />
                    <span>منشأة</span>
                  </button>
                </div>
              </>
            ) : null}

            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-modal-btn profile-modal-btn--ghost"
                onClick={closeEditModal}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="profile-modal-btn profile-modal-btn--primary"
                onClick={applyEditModal}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isLogoutModalOpen ? (
        <div className="profile-modal-backdrop" onClick={closeLogoutModal}>
          <div
            className="profile-modal profile-modal--logout profile-modal--animated"
            role="dialog"
            aria-modal="true"
            aria-label="تأكيد تسجيل الخروج"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-logout-warning">
              <FiAlertTriangle />
            </div>
            <h3 className="profile-modal-title">تأكيد تسجيل الخروج</h3>
            <p className="profile-modal-text">
              هل أنت متأكد أنك تريد تسجيل الخروج؟
            </p>
            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-modal-btn profile-modal-btn--ghost"
                onClick={closeLogoutModal}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="profile-modal-btn profile-modal-btn--danger"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default ClientProfile;
