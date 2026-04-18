"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiUser, FiPhone, FiBriefcase, FiFileText, FiCheckCircle } from 'react-icons/fi';
import "./Bookin.css";

const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 
  'الأحساء', 'الطائف', 'بريدة', 'تبوك', 'أبها', 'خميس مشيط', 'حائل', 'حفر الباطن', 
  'الجبيل', 'الخرج', 'ينبع', 'نجران', 'جازان', 'عرعر', 'سكاكا', 'الباحة', 'القطيف'
];

const CASE_TYPES = [
  'أحوال شخصية', 'تجارية', 'جنائية', 'عمالية', 'عقارية', 'إدارية', 'مالية', 'تنفيذ', 'مرورية', 'ملكية فكرية', 'أخرى'
];

const ClientBooking = () => {
  const [formData, setFormData] = useState({
    location: '',
    name: '',
    phone: '',
    caseType: '',
    brief: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'phone') {
      if (/^05\d{8}$/.test(value)) {
        setPhoneError('');
      } else {
        setPhoneError('يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!/^05\d{8}$/.test(formData.phone)) {
      setPhoneError('يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام');
      return;
    }
    
    setPhoneError('');
    // Handle form submission logic here
    console.log("Form successfully submitted:", formData);
    
    setShowModal(true);
    
    // Redirect after 5 seconds
    setTimeout(() => {
      setShowModal(false);
      router.push('/');
    }, 5000);
  };

  return (
    <main className="booking-page">
      <div className="booking-wrap">
        <Link href="/lawyers" className="booking-back">
          <FiArrowRight aria-hidden className="booking-back-icon" />
          العودة للمحامين
        </Link>

        <section className="booking-card">
          <header className="booking-header">
            <h1 className="booking-title">حجز استشارة قانونية</h1>
            <p className="booking-subtitle">يرجى تعبئة البيانات التالية لإتمام عملية الحجز وسنتواصل معك في أقرب وقت.</p>
          </header>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">الاسم <span className="required">*</span></label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="الاسم الكامل"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">رقم الجوال <span className="required">*</span></label>
              <div className="input-wrapper">
                <FiPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${phoneError ? 'error' : ''}`}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  required
                />
              </div>
              {phoneError && <span className="error-text">{phoneError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">الموقع <span className="required">*</span></label>
              <div className="input-wrapper">
                <FiMapPin className="input-icon" />
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input form-select"
                  required
                >
                  <option value="" disabled>اختر المدينة / المنطقة...</option>
                  {SAUDI_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="caseType" className="form-label">نوع القضية <span className="optional">(اختياري)</span></label>
              <div className="input-wrapper">
                <FiBriefcase className="input-icon" />
                <select
                  id="caseType"
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="">اختر أو ابحث عن نوع القضية...</option>
                  {CASE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="brief" className="form-label">نبذة عن الموضوع <span className="optional">(اختياري)</span></label>
              <div className="input-wrapper">
                <FiFileText className="input-icon texarea-icon" />
                <textarea
                  id="brief"
                  name="brief"
                  value={formData.brief}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="اكتب وصفاً مختصراً لموضوع الاستشارة هنا..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="booking-btn-submit">
                تأكيد الحجز
              </button>
            </div>
          </form>
        </section>
      </div>

      {showModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="booking-modal-icon-wrap">
              <FiCheckCircle className="booking-modal-icon" />
            </div>
            <h2 className="booking-modal-title">تم استلام طلبك بنجاح!</h2>
            <p className="booking-modal-text">
              شكرًا لك، لقد استلمنا طلبك وسيقوم فريقنا بالتواصل معك في أقرب وقت. جاري تحويلك للصفحة الرئيسية...
            </p>
            <div className="booking-modal-loader"></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ClientBooking;