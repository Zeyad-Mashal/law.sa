"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import "../step-one/FpOne.css";
import "./FpTwo.css";

const OTP_LEN = 6;

function parseOtpPaste(text) {
  return text.replace(/\D/g, "").slice(0, OTP_LEN);
}

export default function FpTwo() {
  const router = useRouter();
  const [digits, setDigits] = useState(() => Array(OTP_LEN).fill(""));
  const [error, setError] = useState("");
  const [resendSec, setResendSec] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setTimeout(() => setResendSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSec]);

  const setRef = useCallback((el, i) => {
    inputRefs.current[i] = el;
  }, []);

  function updateDigits(next) {
    setDigits(next);
    if (error) setError("");
  }

  function handleChange(i, raw) {
    const c = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = c;
    updateDigits(next);
    if (c && i < OTP_LEN - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        updateDigits(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
        const next = [...digits];
        next[i - 1] = "";
        updateDigits(next);
      }
    }
    if (e.key === "ArrowLeft" && i < OTP_LEN - 1) {
      e.preventDefault();
      inputRefs.current[i + 1]?.focus();
    }
    if (e.key === "ArrowRight" && i > 0) {
      e.preventDefault();
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = parseOtpPaste(e.clipboardData.getData("text") || "");
    if (!pasted) return;
    const next = Array(OTP_LEN)
      .fill("")
      .map((_, j) => pasted[j] || "");
    updateDigits(next);
    const idx = Math.min(pasted.length, OTP_LEN - 1);
    inputRefs.current[idx]?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join("");
    if (!/^\d{6}$/.test(code)) {
      setError("أدخل الرمز المكوّن من 6 أرقام");
      return;
    }
    setError("");
    // TODO: التحقق من الرمز مع الخادم
    router.push("/forget-password/step-three");
  }

  function handleResend() {
    if (resendSec > 0) return;
    setResendSec(60);
    // TODO: استدعاء API إعادة الإرسال
  }

  return (
    <main className="fp-page">
      <div className="fp-inner">
        <header className="fp-header">
          <span className="fp-brand">Law.sa</span>
          <h1 className="fp-title">رمز التحقق</h1>
          <p className="fp-subtitle">
            أدخل الرمز المكوّن من 6 أرقام المرسل إلى جوالك
          </p>
        </header>

        <form className="fp-form" onSubmit={handleSubmit} noValidate>
          <div className="fp-otp-field">
            <span id="otp-label" className="fp-otp-label">
              رمز التحقق <span className="fp-req">*</span>
            </span>
            <div
              className={`fp-otp-row${error ? " fp-otp-row--error" : ""}`}
              onPaste={handlePaste}
              role="group"
              aria-labelledby="otp-label"
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => setRef(el, i)}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  aria-label={`رقم ${i + 1}`}
                  className="fp-otp-cell"
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                />
              ))}
            </div>
            {error ? (
              <p className="fp-field-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <button type="submit" className="fp-submit">
            تحقق من الرمز
          </button>

          <p className="fp-resend">
            لم يصلك الرمز؟{" "}
            <button
              type="button"
              className="fp-resend-btn"
              onClick={handleResend}
              disabled={resendSec > 0}
            >
              {resendSec > 0
                ? `إعادة الإرسال خلال ${resendSec} ث`
                : "إعادة إرسال الرمز"}
            </button>
          </p>
        </form>

        <Link href="/forget-password/step-one" className="fp-back-link">
          تعديل رقم الجوال
        </Link>

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
