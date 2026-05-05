"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiArrowRight } from "react-icons/fi";
import "../Login.css";
import "./Otp.css";
import submitLoginOtp from "../../API/OTP/OTP";

const OTP_LEN = 4;

function extractOtpError(response) {
  if (response?.error) return response.error;
  if (typeof response?.data?.message === "string") return response.data.message;
  if (typeof response?.data?.error === "string") return response.data.error;
  if (
    Array.isArray(response?.data?.message) &&
    response.data.message.length > 0
  ) {
    return String(response.data.message[0]);
  }
  return "تعذر التحقق من الرمز";
}

function isOtpSuccessResponse(response) {
  return response?.data?.success === true;
}

function readTokenFromObject(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (typeof obj.access_token === "string" && obj.access_token.trim()) {
    return obj.access_token.trim();
  }
  if (typeof obj.accessToken === "string" && obj.accessToken.trim()) {
    return obj.accessToken.trim();
  }
  return null;
}

/** يدعم شكل الـ response المسطح أو الملفوف داخل data / result */
function pickAccessToken(data) {
  if (data == null) return null;
  if (typeof data === "string" && data.trim()) return data.trim();
  if (typeof data !== "object") return null;

  return (
    readTokenFromObject(data) ||
    readTokenFromObject(data.data) ||
    readTokenFromObject(data.result) ||
    readTokenFromObject(
      data.data && typeof data.data === "object" ? data.data.data : null,
    )
  );
}

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get("phone") ?? "";

  const [digits, setDigits] = useState(() => Array(OTP_LEN).fill(""));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  const normalizedPhone = useMemo(
    () => String(phoneFromQuery).replace(/\D/g, ""),
    [phoneFromQuery],
  );

  const otpCode = useMemo(() => digits.join(""), [digits]);

  const canSubmit = useMemo(() => /^\d{4}$/.test(otpCode), [otpCode]);

  useEffect(() => {
    if (!/^\d{9}$/.test(normalizedPhone)) {
      router.replace("/login");
    }
  }, [normalizedPhone, router]);

  const setDigitAt = useCallback((index, value) => {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });
    setError("");
  }, []);

  const focusAt = useCallback((index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  }, []);

  const handleDigitChange = useCallback(
    (index, e) => {
      const v = e.target.value;
      if (!v) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }
      setDigitAt(index, v);
      if (v.replace(/\D/g, "") && index < OTP_LEN - 1) {
        focusAt(index + 1);
      }
    },
    [focusAt, setDigitAt],
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        e.preventDefault();
        focusAt(index - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusAt(Math.min(index + 1, OTP_LEN - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusAt(Math.max(index - 1, 0));
      }
    },
    [digits, focusAt],
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const text = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LEN);
      if (!text) return;
      const next = Array(OTP_LEN)
        .fill("")
        .map((_, i) => text[i] ?? "");
      setDigits(next);
      setError("");
      const last = Math.min(text.length, OTP_LEN) - 1;
      focusAt(last >= 0 ? last : 0);
    },
    [focusAt],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    if (!/^\d{9}$/.test(normalizedPhone)) return;

    setSubmitting(true);
    setError("");
    const response = await submitLoginOtp({
      phoneNumber: normalizedPhone,
      token: otpCode,
    });

    setSubmitting(false);

    if (response.ok && isOtpSuccessResponse(response)) {
      const access = pickAccessToken(response.data);
      if (access) {
        localStorage.setItem("access_token", access);
      }
      localStorage.setItem("otp_success", "true");
      window.location.assign("/");
      return;
    }

    if (response.ok && response?.data?.success === false) {
      localStorage.removeItem("otp_success");
      setError(extractOtpError(response));
      return;
    }

    setError(extractOtpError(response));
  }

  if (!/^\d{9}$/.test(normalizedPhone)) {
    return null;
  }

  return (
    <main className="otp-page">
      <div className="otp-inner">
        <Link href="/login" className="otp-back-link">
          <FiArrowRight /> العودة لتسجيل الدخول
        </Link>

        <header className="login-header">
          <span className="login-brand">Law.sa</span>
          <h1 className="login-heading">رمز التحقق</h1>
        </header>

        <p className="otp-subtitle">
          أدخل الرمز المكوّن من 4 أرقام المرسل إلى{" "}
          <span className="otp-phone-hint">+966 {normalizedPhone}</span>
        </p>

        <form className="otp-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <span className="otp-label" id="otp-label">
              الرمز <span>*</span>
            </span>
            <div
              className="otp-digits-row"
              role="group"
              aria-labelledby="otp-label"
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  className={`otp-digit${error ? " otp-digit--error" : ""}`}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-invalid={error ? "true" : "false"}
                  aria-label={`رقم ${i + 1} من ${OTP_LEN}`}
                />
              ))}
            </div>
            {error ? (
              <p className="otp-field-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="otp-submit"
            disabled={!canSubmit || submitting}
          >
            {submitting ? "جاري التحقق…" : "تأكيد"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ClientOtp() {
  return (
    <Suspense
      fallback={
        <main className="otp-page">
          <div className="otp-inner" />
        </main>
      }
    >
      <OtpForm />
    </Suspense>
  );
}
