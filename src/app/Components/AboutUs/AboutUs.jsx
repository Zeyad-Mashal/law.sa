import React from "react";
import Image from "next/image";
import { RiMedalLine } from "react-icons/ri";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-us" aria-label="من نحن">
      <div className="about-us_container">
        <div className="about-us_content">
          <span className="about-us_label">من نحن</span>
          <h2 className="about-us_title">
            إرث من <span>التميز القانوني</span> في خدمتكم
          </h2>
          <p className="about-us_description">
            تأسس مكتب الصفوة على مبادئ الاحترافية والثقة، وتطور ليصبح من أبرز
            المكاتب القانونية في المملكة العربية السعودية. نضم نخبة من المحامين
            المعتمدين ذوي الخبرة الواسعة في مختلف التخصصات القانونية.
          </p>
          <ul className="about-us_list">
            <li>
              <IoCheckmarkCircleOutline />
              ترافع أمام المحاكم السعودية بكافة درجاتها
            </li>
            <li>
              <IoCheckmarkCircleOutline />
              خبرة موثقة في الأنظمة التجارية وقضايا الأعمال
            </li>
            <li>
              <IoCheckmarkCircleOutline />
              فريق متعدد التخصصات يضم محامين واستشاريين
            </li>
          </ul>
          <div className="about-us_footer">
            <button type="button" className="about-us_button">
              المزيد عنا
            </button>
            <div className="about-us_name">
              <h3>أ. احمد سالم الغامدي</h3>
              <p>المؤسس والشريك الإداري</p>
            </div>
          </div>
        </div>
        <div className="about-us_visual">
          <div className="about-us_badge">
            <RiMedalLine />
            <span>
              20+
              <small>سنة خبرة</small>
            </span>
          </div>
          <div className="about-us_image-wrap">
            <Image
              src="/images/hero-lawyer.jpg"
              alt="صورة المؤسس"
              width={610}
              height={720}
              className="about-us_image"
              sizes="(max-width: 992px) 100vw, 45vw"
            />
          </div>
          <div className="about-us_stats">
            <div>
              <strong>98%</strong>
              <span>رضا العملاء</span>
            </div>
            <div>
              <strong>1500+</strong>
              <span>قضية ناجحة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
