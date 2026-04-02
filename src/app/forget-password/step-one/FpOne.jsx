"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./FpOne.css";

function validatePhone(phoneDigits) {
  if (!phoneDigits) return "أدخل رقم الجوال";
  if (!/^5\d{8}$/.test(phoneDigits)) {
    return "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكوّن من 9 أرقام (مثل 5xxxxxxxx)";
  }
  return "";
}

export default function FpOne() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function handlePhoneChange(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(raw);
    if (phoneError) setPhoneError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validatePhone(phone);
    setPhoneError(err);
    if (err) return;
    // TODO: استدعاء API إرسال رمز التفعيل
    router.push("/forget-password/step-two");
  }

  return (
    <main className="fp-page">
      <div className="fp-inner">
        <header className="fp-header">
          <span className="fp-brand">واثقون</span>
          <h1 className="fp-title">استرجاع كلمة المرور</h1>
          <p className="fp-subtitle">
            قم بادخال رقم الجوال وسنقوم بارسال رمز التفعيل
          </p>
        </header>

        <form className="fp-form" onSubmit={handleSubmit} noValidate>
          <div className="fp-field">
            <label htmlFor="fp-phone" className="fp-label">
              رقم الجوال <span className="fp-req">*</span>
            </label>
            <div
              className={`fp-phone-row${phoneError ? " fp-phone-row--error" : ""}`}
            >
              <div className="fp-phone-prefix">
                <span className="fp-phone-flag-wrap" aria-hidden>
                  <Image
                    src="/images/flag.png"
                    alt=""
                    fill
                    className="fp-flag-img"
                    sizes="42px"
                  />
                </span>
                <span className="fp-phone-code">+966</span>
              </div>
              <input
                id="fp-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="رقم الجوال"
                className="fp-input-phone"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={9}
              />
            </div>
            {phoneError ? (
              <p className="fp-field-error" role="alert">
                {phoneError}
              </p>
            ) : null}
          </div>

          <button type="submit" className="fp-submit">
            إرسال رمز التفعيل
          </button>
        </form>

        <p className="fp-footer">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="fp-footer-link">
            قم بالتسجيل
          </Link>
        </p>
      </div>
    </main>
  );
}
