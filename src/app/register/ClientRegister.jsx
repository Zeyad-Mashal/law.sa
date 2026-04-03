"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiUploadCloud } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import "./Register.css";

const REGIONS = [
  {
    id: "riyadh",
    name: "منطقة الرياض",
    cities: ["الرياض", "الخرج", "الدوادمي", "المزاحمية"],
  },
  {
    id: "makkah",
    name: "منطقة مكة المكرمة",
    cities: ["مكة المكرمة", "جدة", "الطائف", "رابغ"],
  },
  {
    id: "eastern",
    name: "المنطقة الشرقية",
    cities: ["الدمام", "الخبر", "الظهران", "الأحساء"],
  },
  {
    id: "asir",
    name: "منطقة عسير",
    cities: ["أبها", "خميس مشيط", "بيشة", "النماص"],
  },
];

const LICENSE_TYPES = [
  { value: "licensed", label: "محامي مرخص" },
  { value: "trainee", label: "محامي متدرب" },
  { value: "consultant", label: "مستشار قانوني" },
];

const COUNTRIES = [{ value: "SA", label: "المملكة العربية السعودية" }];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const ACCEPT_TYPES =
  "image/jpeg,image/png,image/jpg,image/webp,application/pdf";

function stepCircleClass(stepIndex, currentStep) {
  if (stepIndex < currentStep) return "reg-step reg-step--complete";
  if (stepIndex === currentStep) return "reg-step reg-step--active";
  return "reg-step";
}

function connectorClass(beforeStep, currentStep) {
  return beforeStep < currentStep
    ? "reg-step-connector reg-step-connector--done"
    : "reg-step-connector";
}

export default function ClientRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [regionId, setRegionId] = useState("");
  const [city, setCity] = useState("");

  const [licenseFile, setLicenseFile] = useState(null);
  const [fileImagePreview, setFileImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [licenseType, setLicenseType] = useState("licensed");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [country, setCountry] = useState("SA");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const cities = useMemo(() => {
    const r = REGIONS.find((x) => x.id === regionId);
    return r ? r.cities : [];
  }, [regionId]);

  const canStep1Next = useMemo(() => {
    if (!fullName.trim()) return false;
    if (!/^5\d{8}$/.test(phone)) return false;
    if (!EMAIL_RE.test(email.trim())) return false;
    const pw = password.trim();
    if (pw.length < 6) return false;
    return confirmPassword.trim() === pw;
  }, [fullName, phone, email, password, confirmPassword]);

  const canStep2Next = useMemo(
    () => Boolean(regionId && city),
    [regionId, city],
  );

  const canFinalSubmit = useMemo(() => {
    if (!canStep1Next || !canStep2Next) return false;
    if (!licenseFile || licenseFile.size > MAX_FILE_BYTES) return false;
    if (!startDate || !endDate) return false;
    if (endDate < startDate) return false;
    if (!licenseNumber.trim()) return false;
    if (!agreeTerms) return false;
    return Boolean(licenseType && country);
  }, [
    canStep1Next,
    canStep2Next,
    licenseFile,
    startDate,
    endDate,
    licenseNumber,
    agreeTerms,
    licenseType,
    country,
  ]);

  useEffect(() => {
    if (!licenseFile) {
      setFileImagePreview(null);
      return;
    }
    if (!licenseFile.type.startsWith("image/")) {
      setFileImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(licenseFile);
    setFileImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [licenseFile]);

  function removeLicenseFile() {
    setLicenseFile(null);
    clearFieldError("file");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearFieldError(key) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep1() {
    const e = {};
    if (!fullName.trim()) e.fullName = "أدخل الاسم بالكامل";
    if (!phone) e.phone = "أدخل رقم الجوال";
    else if (!/^5\d{8}$/.test(phone))
      e.phone =
        "رقم الجوال يجب أن يبدأ بـ 5 ويتكوّن من 9 أرقام (مثل 5xxxxxxxx)";
    if (!email.trim()) e.email = "أدخل البريد الإلكتروني";
    else if (!EMAIL_RE.test(email.trim())) e.email = "صيغة البريد غير صحيحة";
    const pw = password.trim();
    if (!pw) e.password = "أدخل كلمة المرور";
    else if (pw.length < 6)
      e.password = "كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام";
    const cp = confirmPassword.trim();
    if (!cp) e.confirmPassword = "أعد إدخال كلمة المرور";
    else if (cp !== pw) e.confirmPassword = "كلمة المرور غير متطابقة";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (!regionId) e.region = "اختر المنطقة";
    if (!city) e.city = "اختر المدينة";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e = {};
    if (!licenseFile) e.file = "ارفع ملف الرخصة";
    else if (licenseFile.size > MAX_FILE_BYTES)
      e.file = "حجم الملف يجب ألا يتجاوز 3 ميجابايت";
    if (!startDate) e.startDate = "اختر تاريخ البدء";
    if (!endDate) e.endDate = "اختر تاريخ الانتهاء";
    if (startDate && endDate && endDate < startDate)
      e.endDate = "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء";
    if (!licenseNumber.trim()) e.licenseNumber = "أدخل رقم الرخصة";
    if (!agreeTerms) e.terms = "يجب الموافقة على الشروط وسياسة الخصوصية";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePhoneChange(ev) {
    const raw = ev.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(raw);
    clearFieldError("phone");
  }

  function pickFile(file) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        file: "حجم الملف يجب ألا يتجاوز 3 ميجابايت",
      }));
      return;
    }
    setLicenseFile(file);
    clearFieldError("file");
  }

  function onFileChange(ev) {
    const f = ev.target.files?.[0];
    pickFile(f);
  }

  function onDrop(ev) {
    ev.preventDefault();
    setDragOver(false);
    const f = ev.dataTransfer.files?.[0];
    if (f) pickFile(f);
  }

  function goNext(ev) {
    ev.preventDefault();
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function onFinalSubmit(ev) {
    ev.preventDefault();
    if (!canFinalSubmit) return;
    if (!validateStep3()) return;
    // TODO: إرسال للخادم
    router.push("/");
  }

  return (
    <main className="reg-page">
      <div className="reg-inner">
        <header className="reg-header">
          <span className="reg-brand">Law.sa</span>
          <h1 className="reg-title">تسجيل حساب جديد</h1>
        </header>

        <nav className="reg-stepper" aria-label="مراحل التسجيل">
          <div className={stepCircleClass(1, step)}>
            <div className="reg-step-circle">
              {step > 1 ? <FiCheck size={14} strokeWidth={2.5} /> : "1"}
            </div>
            <span className="reg-step-label">البيانات الشخصية</span>
          </div>
          <div className={connectorClass(1, step)} aria-hidden />
          <div className={stepCircleClass(2, step)}>
            <div className="reg-step-circle">
              {step > 2 ? <FiCheck size={14} strokeWidth={2.5} /> : "2"}
            </div>
            <span className="reg-step-label">المنطقة والمدينة</span>
          </div>
          <div className={connectorClass(2, step)} aria-hidden />
          <div className={stepCircleClass(3, step)}>
            <div className="reg-step-circle">
              {step > 3 ? <FiCheck size={14} strokeWidth={2.5} /> : "3"}
            </div>
            <span className="reg-step-label">الرخصة</span>
          </div>
        </nav>

        {/* ——— المرحلة 1 ——— */}
        <div className="reg-panel" hidden={step !== 1}>
          <form className="reg-form" onSubmit={goNext} noValidate>
            <div className="reg-field">
              <label htmlFor="fullName" className="reg-label">
                الاسم بالكامل <span className="reg-req">*</span>
              </label>
              <input
                id="fullName"
                className={`reg-input${errors.fullName ? " reg-input--error" : ""}`}
                placeholder="الاسم بالكامل *"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearFieldError("fullName");
                }}
              />
              {errors.fullName ? (
                <p className="reg-field-error" role="alert">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div className="reg-field">
              <label htmlFor="reg-phone" className="reg-label">
                رقم الجوال <span className="reg-req">*</span>
              </label>
              <div
                className={`reg-phone-row${errors.phone ? " reg-phone-row--error" : ""}`}
              >
                <div className="reg-phone-prefix">
                  <span className="reg-phone-flag-wrap">
                    <Image
                      src="/images/flag.png"
                      alt=""
                      fill
                      className="reg-flag-img"
                      sizes="42px"
                    />
                  </span>
                  <span className="reg-phone-code">+966</span>
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="رقم الجوال *"
                  className="reg-input-phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={9}
                />
              </div>
              {errors.phone ? (
                <p className="reg-field-error" role="alert">
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div className="reg-field">
              <label htmlFor="email" className="reg-label">
                البريد الالكتروني <span className="reg-req">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`reg-input${errors.email ? " reg-input--error" : ""}`}
                placeholder="البريد الالكتروني *"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
              />
              {errors.email ? (
                <p className="reg-field-error" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="reg-field">
              <label htmlFor="reg-password" className="reg-label">
                كلمة المرور <span className="reg-req">*</span>
              </label>
              <div className="reg-password-row">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`reg-input${errors.password ? " reg-input--error" : ""}`}
                  placeholder="كلمة المرور *"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                />
                <button
                  type="button"
                  className="reg-toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff strokeWidth={1.5} />
                  ) : (
                    <FiEye strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="reg-field-error" role="alert">
                  {errors.password}
                </p>
              ) : null}
            </div>

            <div className="reg-field">
              <label htmlFor="confirmPassword" className="reg-label">
                إعادة كلمة المرور <span className="reg-req">*</span>
              </label>
              <div className="reg-password-row">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  className={`reg-input${errors.confirmPassword ? " reg-input--error" : ""}`}
                  placeholder="إعادة كلمة المرور *"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirmPassword");
                  }}
                />
                <button
                  type="button"
                  className="reg-toggle-password"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "إخفاء التأكيد" : "إظهار التأكيد"}
                >
                  {showConfirm ? (
                    <FiEyeOff strokeWidth={1.5} />
                  ) : (
                    <FiEye strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="reg-field-error" role="alert">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="reg-btn"
              disabled={!canStep1Next}
            >
              التالي
            </button>
          </form>
        </div>

        {/* ——— المرحلة 2 ——— */}
        <div className="reg-panel" hidden={step !== 2}>
          <form className="reg-form" onSubmit={goNext} noValidate>
            <div className="reg-field">
              <label htmlFor="region" className="reg-label">
                المنطقه <span className="reg-req">*</span>
              </label>
              <div className="reg-select-wrap">
                <select
                  id="region"
                  className={`reg-select${errors.region ? " reg-input--error" : ""}`}
                  value={regionId}
                  onChange={(e) => {
                    setRegionId(e.target.value);
                    setCity("");
                    clearFieldError("region");
                    clearFieldError("city");
                  }}
                >
                  <option value="">اختر المنطقة</option>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.region ? (
                <p className="reg-field-error" role="alert">
                  {errors.region}
                </p>
              ) : null}
            </div>

            <div className="reg-field">
              <label htmlFor="city" className="reg-label">
                المدينه <span className="reg-req">*</span>
              </label>
              <div className="reg-select-wrap">
                <select
                  id="city"
                  className={`reg-select${errors.city ? " reg-input--error" : ""}`}
                  value={city}
                  disabled={!regionId}
                  onChange={(e) => {
                    setCity(e.target.value);
                    clearFieldError("city");
                  }}
                >
                  <option value="">
                    {regionId ? "اختر المدينة" : "اختر المنطقة أولاً"}
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city ? (
                <p className="reg-field-error" role="alert">
                  {errors.city}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="reg-btn"
              disabled={!canStep2Next}
            >
              التالي
            </button>
          </form>
        </div>

        {/* ——— المرحلة 3 ——— */}
        <div className="reg-panel" hidden={step !== 3}>
          <form className="reg-form" onSubmit={onFinalSubmit} noValidate>
            <div className="reg-field">
              <input
                ref={fileInputRef}
                type="file"
                id="license-file"
                className="reg-upload-input"
                accept={ACCEPT_TYPES}
                onChange={onFileChange}
              />

              {licenseFile && fileImagePreview ? (
                <div className="reg-file-preview">
                  <div className="reg-file-preview-frame">
                    <img
                      src={fileImagePreview}
                      alt="معاينة الملف المرفوع"
                      className="reg-file-preview-img"
                    />
                  </div>
                  <p className="reg-file-preview-name">{licenseFile.name}</p>
                  <button
                    type="button"
                    className="reg-file-remove"
                    onClick={removeLicenseFile}
                  >
                    مسح الصورة
                  </button>
                </div>
              ) : null}

              {licenseFile && !fileImagePreview ? (
                <div className="reg-file-preview reg-file-preview--doc">
                  <p className="reg-file-preview-name">{licenseFile.name}</p>
                  <p className="reg-file-preview-type">ملف PDF</p>
                  <button
                    type="button"
                    className="reg-file-remove"
                    onClick={removeLicenseFile}
                  >
                    مسح الملف
                  </button>
                </div>
              ) : null}

              <label
                htmlFor="license-file"
                className={`reg-upload${dragOver ? " reg-upload--drag" : ""}${errors.file ? " reg-input--error" : ""}`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
              >
                <span className="reg-upload-icon" aria-hidden>
                  <FiUploadCloud strokeWidth={1.25} />
                </span>
                <p className="reg-upload-text">
                  اضغط <span className="reg-upload-link">هنا لرفع الملفات</span>{" "}
                  أو قم بإدراج الملفات هنا
                </p>
                <p className="reg-upload-hint">
                  image/jpeg, image/png, image/jpg, image/webp, application/pdf
                  <br />
                  (max. 3MB)
                </p>
              </label>
              {errors.file ? (
                <p className="reg-field-error" role="alert">
                  {errors.file}
                </p>
              ) : null}
            </div>

            <div className="reg-dates-row">
              <div className="reg-field reg-date-field">
                <label htmlFor="startDate" className="reg-label">
                  تاريخ البدء <span className="reg-req">*</span>
                </label>
                <div className="reg-date-inner">
                  <span className="reg-date-icon">
                    <LuCalendarDays />
                  </span>
                  <input
                    id="startDate"
                    type="date"
                    className={`reg-input${errors.startDate ? " reg-input--error" : ""}`}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      clearFieldError("startDate");
                    }}
                  />
                </div>
                {errors.startDate ? (
                  <p className="reg-field-error" role="alert">
                    {errors.startDate}
                  </p>
                ) : null}
              </div>
              <div className="reg-field reg-date-field">
                <label htmlFor="endDate" className="reg-label">
                  تاريخ الانتهاء <span className="reg-req">*</span>
                </label>
                <div className="reg-date-inner">
                  <span className="reg-date-icon">
                    <LuCalendarDays />
                  </span>
                  <input
                    id="endDate"
                    type="date"
                    className={`reg-input${errors.endDate ? " reg-input--error" : ""}`}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      clearFieldError("endDate");
                    }}
                  />
                </div>
                {errors.endDate ? (
                  <p className="reg-field-error" role="alert">
                    {errors.endDate}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="reg-field reg-field-floating">
              <label htmlFor="licenseType" className="reg-label-floating">
                نوع الرخصة
              </label>
              <div className="reg-select-wrap">
                <select
                  id="licenseType"
                  className="reg-select reg-select--bordered"
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                >
                  {LICENSE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="reg-field">
              <label htmlFor="licenseNumber" className="reg-label">
                رقم الرخصة <span className="reg-req">*</span>
              </label>
              <input
                id="licenseNumber"
                className={`reg-input${errors.licenseNumber ? " reg-input--error" : ""}`}
                placeholder="رقم الرخصة *"
                value={licenseNumber}
                onChange={(e) => {
                  setLicenseNumber(e.target.value);
                  clearFieldError("licenseNumber");
                }}
              />
              {errors.licenseNumber ? (
                <p className="reg-field-error" role="alert">
                  {errors.licenseNumber}
                </p>
              ) : null}
            </div>

            <div className="reg-field">
              <label htmlFor="country" className="reg-label">
                الدولة
              </label>
              <div className="reg-select-wrap">
                <select
                  id="country"
                  className="reg-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="reg-terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  clearFieldError("terms");
                }}
              />
              <span>
                أوافق على <Link href="/terms">الشروط و الأحكام</Link>
                {" و "}
                <Link href="/privacy">سياسة الخصوصية</Link>
              </span>
            </label>
            {errors.terms ? (
              <p className="reg-field-error" role="alert">
                {errors.terms}
              </p>
            ) : null}
            <button
              type="submit"
              className="reg-btn"
              disabled={!canFinalSubmit}
            >
              إرسال رمز التفعيل
            </button>
          </form>
        </div>

        <p className="reg-footer">
          لديك حساب؟ <Link href="/login">تسجيل الدخول</Link>
        </p>
      </div>
    </main>
  );
}
