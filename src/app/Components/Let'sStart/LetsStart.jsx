import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuPhoneCall } from "react-icons/lu";
import "./LetsStart.css";

const LetsStart = () => {
  return (
    <section className="lets-start" aria-label="ابدأ رحلتك القانونية">
      <div className="lets-start_container">
        <span className="lets-start_badge">
          <LuPhoneCall />
          قانوننا لخدمتكم على مدار الساعة
        </span>

        <h2>
          ابدأ رحلتك القانونية <span>بثقة</span> الآن
        </h2>

        <p>
          احجز استشارتك الأولى مع نخبة من المحامين المرخصين، وتأكد بنفسك من جودة
          خدماتنا.
        </p>

        <div className="lets-start_actions">
          <button type="button" className="lets-start_primary">
            <FaArrowLeftLong />
            احجز استشارتك
          </button>

          <a href="tel:0574000016" className="lets-start_phone">
            <LuPhoneCall />
            <span className="lets-start_phone-number">0574 0000 16</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LetsStart;
