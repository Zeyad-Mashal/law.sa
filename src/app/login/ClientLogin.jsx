"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import "./Login.css";
import signIn from "../API/SignIn/SignIn";

function validateLogin(phoneDigits) {
  const errors = { phone: "" };

  if (!phoneDigits) {
    errors.phone = "أدخل رقم الجوال";
  } else if (!/^\d{9}$/.test(phoneDigits)) {
    errors.phone = "رقم الجوال يجب أن يتكوّن من 9 أرقام";
  }

  return errors;
}

function extractLoginError(response) {
  if (response?.error) return response.error;
  if (typeof response?.data?.message === "string") return response.data.message;
  if (typeof response?.data?.error === "string") return response.data.error;
  if (Array.isArray(response?.data?.message) && response.data.message.length > 0) {
    return String(response.data.message[0]);
  }
  return "تعذر تسجيل الدخول";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ phone: "" });

  const canSubmitLogin = useMemo(() => {
    return /^\d{9}$/.test(phone);
  }, [phone]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmitLogin) return;
    const next = validateLogin(phone);
    setErrors(next);
    if (next.phone) return;

    const response = await signIn({ phoneNumber: phone.trim() });
    if (response.ok) {
      const token =
        response?.data?.accessToken ||
        response?.data?.token ||
        "temporary-login-token";
      localStorage.setItem("token", token);
      router.push(`/login/otp?phone=${encodeURIComponent(phone.trim())}`);
      return;
    }

    setErrors((prev) => ({
      ...prev,
      phone: extractLoginError(response),
    }));
  }

  return (
    <main className="login-page">
      <div className="login-inner">
        <Link href="/" style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <FiArrowRight /> العودة للرئيسية
        </Link>
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
          <span className="login-brand">Law.sa</span>
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


          <button
            type="submit"
            className="login-submit"
            disabled={!canSubmitLogin}
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="login-footer">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="login-footer-link">
            إنشاء حساب جديد
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
