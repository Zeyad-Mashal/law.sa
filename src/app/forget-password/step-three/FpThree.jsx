"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../step-one/FpOne.css";
import "./FpThree.css";

function validatePasswords(password, confirm) {
  const errors = { password: "", confirm: "" };
  const pw = password.trim();
  if (!pw) errors.password = "أدخل كلمة المرور الجديدة";
  else if (pw.length < 6)
    errors.password = "كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام أو رموز";
  const cp = confirm.trim();
  if (!cp) errors.confirm = "أعد إدخال كلمة المرور";
  else if (cp !== pw) errors.confirm = "كلمة المرور غير متطابقة";
  return errors;
}

export default function FpThree() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirm: "" });

  function handleSubmit(e) {
    e.preventDefault();
    const next = validatePasswords(password, confirmPassword);
    setErrors(next);
    if (next.password || next.confirm) return;
    // TODO: استدعاء API تغيير كلمة المرور
    router.push("/login?reset=success");
  }

  return (
    <main className="fp-page">
      <div className="fp-inner">
        <header className="fp-header">
          <span className="fp-brand">Law.sa</span>
          <h1 className="fp-title">كلمة المرور الجديدة</h1>
          <p className="fp-subtitle">
            أدخل كلمة المرور الجديدة وتأكيدها ثم احفظ التغيير
          </p>
        </header>

        <form className="fp-form" onSubmit={handleSubmit} noValidate>
          <div className="fp-field">
            <label htmlFor="fp-new-password" className="fp-label">
              كلمة المرور الجديدة <span className="fp-req">*</span>
            </label>
            <div className="fp-password-row">
              <input
                id="fp-new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`fp-input-password${errors.password ? " fp-input-password--error" : ""}`}
                placeholder="كلمة المرور الجديدة"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: "" }));
                }}
              />
              <button
                type="button"
                className="fp-toggle-password"
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
              <p className="fp-field-error" role="alert">
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className="fp-field">
            <label htmlFor="fp-confirm-password" className="fp-label">
              تأكيد كلمة المرور <span className="fp-req">*</span>
            </label>
            <div className="fp-password-row">
              <input
                id="fp-confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className={`fp-input-password${errors.confirm ? " fp-input-password--error" : ""}`}
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
                }}
              />
              <button
                type="button"
                className="fp-toggle-password"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={
                  showConfirm ? "إخفاء التأكيد" : "إظهار التأكيد"
                }
              >
                {showConfirm ? (
                  <FiEyeOff strokeWidth={1.5} />
                ) : (
                  <FiEye strokeWidth={1.5} />
                )}
              </button>
            </div>
            {errors.confirm ? (
              <p className="fp-field-error" role="alert">
                {errors.confirm}
              </p>
            ) : null}
          </div>

          <button type="submit" className="fp-submit">
            تأكيد وتغيير كلمة المرور
          </button>
        </form>

        <Link href="/login" className="fp-back-link">
          العودة لتسجيل الدخول
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
