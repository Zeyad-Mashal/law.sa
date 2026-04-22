import React from "react";
import Image from "next/image";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" aria-label="تذييل الصفحة">
      <div className="footer_container">
        <div className="footer_top">
          <div className="footer_brand">
            <div className="footer_logo-wrap">
              <Image
                src="/images/logo.png"
                alt="law.sa logo"
                width={42}
                height={42}
                className="footer_logo"
              />
              <div className="footer_brand-text">
                <h3>law.sa</h3>
                <span>المحاماة والاستشارات القانونية</span>
              </div>
            </div>
            <p>
              مكتب law.sa للمحاماة يقدم خدمات قانونية متكاملة بمعايير عالمية وثقة
              لا تتزعزع.
            </p>
            <div className="footer_social">
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="X">
                <FaXTwitter />
              </a>
            </div>
          </div>

          <div className="footer_col">
            <h4>روابط سريعة</h4>
            <a href="#">الرئيسية</a>
            <a href="#">خدماتنا</a>
            <a href="#">من نحن</a>
            <a href="#">أعمالنا</a>
            <a href="#">المدونة</a>
          </div>

          <div className="footer_col">
            <h4>خدماتنا</h4>
            <a href="#">الاستشارات القانونية</a>
            <a href="#">صياغة العقود</a>
            <a href="#">القضايا التجارية</a>
            <a href="#">التحكيم والنزاعات</a>
            <a href="#">قضايا الأسرة</a>
          </div>

          <div className="footer_col footer_contact">
            <h4>تواصل معنا</h4>
            <p>
              <FaLocationDot />
              طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية
            </p>
            <a href="tel:0574000016">
              <FaPhone />
              <span className="footer_ltr">0574 0000 16</span>
            </a>
            <a href="mailto:info@law.sa">
              <FaEnvelope />
              <span className="footer_ltr">info@law.sa</span>
            </a>
          </div>
        </div>

        <div className="footer_bottom">
          <span>© 2026 law.sa. جميع الحقوق محفوظة.</span>
          <div className="footer_bottom-links">
            <a href="#">سياسة الخصوصية</a>
            <a href="#">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
