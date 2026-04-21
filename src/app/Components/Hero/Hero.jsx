import React from "react";
import "./Hero.css";
import Image from "next/image";
import { LuUsersRound } from "react-icons/lu";
import { BsLightningCharge } from "react-icons/bs";
import { IoShieldOutline } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <section className="hero hero_reveal" aria-label="مقدمة الموقع">
      <div className="hero_container">
        <div className="hero_content">
          <h1>
            تحتاج استشارة أو خدمة<span> قانونية؟</span>
          </h1>
          <p>
            نخبة من المحامين والمستشارين القانونيين المرخصين في المملكة العربية
            السعودية، نقدم خدماتنا بثقة واحترافية على مدار الساعة.
          </p>
          <div className="hero_buttons">
            <button>
              استشارة قانونية <FaArrowLeftLong />
            </button>
            <button>تعرف على خدماتنا</button>
          </div>
          <hr />
          <div className="hero_trust">
            <div className="hero_trust_item">
              <p>
                <LuUsersRound />
                +4000 محامي مرخص
              </p>
            </div>
            <div className="hero_trust_item">
              <p>
                <BsLightningCharge />
                استشارات فورية
              </p>
            </div>
            <div className="hero_trust_item">
              <p>
                {" "}
                <IoShieldOutline />
                سرية تامة
              </p>
            </div>
          </div>
        </div>
        <div className="hero_image">
          <p className="hero_image_text1">
            <LuUsersRound />
            <span>
              <span>متاح الآن</span>
              +3000 محامي
            </span>
          </p>
          <Image
            className="hero_photo"
            src="/images/hero-lawyer.jpg"
            alt="محامٍ محترف — Law.sa"
            width={500}
            height={500}
            sizes="(max-width: 789px) min(100vw, 22rem), 420px"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
