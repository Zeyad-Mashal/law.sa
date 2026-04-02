"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import "./Login.css";

function validateLogin(phoneDigits, password) {
  const errors = { phone: "", password: "" };
  const pw = password.trim();

  if (!phoneDigits) {
    errors.phone = "أدخل رقم الجوال";
  } else if (!/^5\d{8}$/.test(phoneDigits)) {
    errors.phone =
      "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكوّن من 9 أرقام (مثل 5xxxxxxxx)";
  }

  if (!pw) {
    errors.password = "أدخل كلمة المرور";
  } else if (pw.length < 6) {
    errors.password = "كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام أو رموز";
  }

  return errors;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ phone: "", password: "" });

  function dismissResetBanner() {
    router.replace("/login", { scroll: false });
  }

  function handlePhoneChange(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(raw);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validateLogin(phone, password);
    setErrors(next);
    if (next.phone || next.password) return;
  }

  return (
    <main className="login-page">
      <div className="login-inner">
        {resetSuccess ? (
          <div className="login-reset-banner" role="status">
            <span className="login-reset-banner-text">
              تم تغيير كلمة المرور بنجاح
            </span>
            <button
              type="button"
              className="login-reset-dismiss"
              onClick={dismissResetBanner}
            >
              إغلاق
            </button>
          </div>
        ) : null}

        <header className="login-header">
          <span className="login-brand">واثقون</span>
          <h1 className="login-heading">تسجيل الدخول</h1>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
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

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              كلمة المرور <span>*</span>
            </label>
            <div className="login-password-row">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="كلمة المرور"
                className={`login-input-password${errors.password ? " login-input-password--error" : ""}`}
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="login-toggle-password"
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
              <p className="login-field-error" role="alert">
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className="login-forgot-wrap">
            <Link href="/forget-password/step-one" className="login-forgot">
              نسيت كلمة المرور ؟
            </Link>
          </div>

          <button type="submit" className="login-submit">
            تسجيل الدخول
          </button>
        </form>

        <p className="login-footer">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="login-footer-link">
            قم بالتسجيل
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ClientLogin() {
  return (
    <Suspense
      fallback={
        <main className="login-page">
          <div className="login-inner" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
