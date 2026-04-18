"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import "../login/Login.css";
import "./SignUp.css";

function validateSignUp(name, phoneDigits) {
  const errors = { name: "", phone: "" };
  if (!name.trim()) {
    errors.name = "أدخل الاسم";
  }
  if (!phoneDigits) {
    errors.phone = "أدخل رقم الجوال";
  } else if (!/^5\d{8}$/.test(phoneDigits)) {
    errors.phone = "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكوّن من 9 أرقام (مثل 5xxxxxxxx)";
  }
  return errors;
}

function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const canSubmit = useMemo(() => {
    return /^5\d{8}$/.test(phone) && name.trim().length > 0;
  }, [phone, name]);

  function handleNameChange(e) {
    setName(e.target.value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  }

  function handlePhoneChange(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(raw);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    const next = validateSignUp(name, phone);
    setErrors(next);
    if (next.name || next.phone) return;
    // TODO: استدعاء انشاء حساب
    router.push("/");
  }

  return (
    <main className="login-page">
      <div className="login-inner">
        <Link href="/" style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <FiArrowRight /> العودة للرئيسية
        </Link>
        <header className="login-header">
          <span className="login-brand">Law.sa</span>
          <h1 className="login-heading">إنشاء حساب جديد</h1>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="name" className="login-label">
              الاسم <span>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="الاسم الكامل"
              className={`login-input-text${errors.name ? " login-input-text--error" : ""}`}
              value={name}
              onChange={handleNameChange}
            />
            {errors.name ? (
              <p className="login-field-error" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="login-field">
            <label htmlFor="phone" className="login-label">
              رقم الجوال <span>*</span>
            </label>
            <div
              className={`login-phone-row${errors.phone ? " login-phone-row--error" : ""}`}
            >
              <div className="login-phone-prefix">
                <span className="login-phone-code">+966</span>
                <span className="login-phone-flag-wrap" aria-hidden>
                  <Image
                    src="/images/flag.png"
                    alt=""
                    className="login-flag-img"
                    width={120}
                    height={120}
                  />
                </span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="5xxxxxxxx"
                className="login-input-phone"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={9}
              />
            </div>
            {errors.phone ? (
              <p className="login-field-error" role="alert">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="login-submit signup-submit"
            disabled={!canSubmit}
          >
            إنشاء حساب
          </button>
        </form>

        <div className="signup-footer-links">
          <p className="login-footer">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="login-footer-link">
              تسجيل الدخول
            </Link>
          </p>
          <div className="lawyer-register-wrap">
            <Link href="/register" className="lawyer-register-link">
              سجل كـ محامي
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ClientSignUp() {
  return (
    <Suspense
      fallback={
        <main className="login-page">
          <div className="login-inner" />
        </main>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}