import React from "react";
import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import "./OurWorks.css";

const OurWorks = () => {
  const works = [
    {
      id: 1,
      category: "قضية تجارية",
      title: "نزاع شركات بقيمة 50 مليون ريال",
      description:
        "نمثل إحدى الشركات الاستثمارية في نزاع تجاري معقد انتهى بحكم لصالح موكلنا.",
      image: "/images/hero-mockup-blue.png",
    },
    {
      id: 2,
      category: "صياغة عقود",
      title: "صفقة استحواذ دولية",
      description:
        "صياغة ومراجعة عقود الاستحواذ بين شركة سعودية ونظيرة أوروبية بكامل الضمانات.",
      image: "/images/hero-mockup.png",
    },
    {
      id: 3,
      category: "تحكيم",
      title: "تحكيم في عقد إنشاعات كبير",
      description:
        "تحقيق تسوية مرضية لطرفي نزاع إنشائي عبر التحكيم التجاري المعتمد.",
      image: "/images/hero-lawyer.jpg",
    },
  ];

  return (
    <section className="our-works" aria-label="أعمالنا">
      <div className="our-works_container">
        <header className="our-works_header">
          <div className="our-works_title-wrap">
            <span>أعمالنا</span>
            <h2>
              قضايا حقيقية. <span>انتصارات ملموسة</span>
            </h2>
          </div>
          <a href="#" className="our-works_all-link">
            عرض جميع القضايا
            <FaArrowLeftLong />
          </a>
        </header>

        <div className="our-works_cards">
          {works.map((work) => (
            <article key={work.id} className="our-works_card">
              <div className="our-works_image-wrap">
                <Image
                  src={work.image}
                  alt={work.title}
                  width={560}
                  height={340}
                  className="our-works_image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <div className="our-works_content">
                <span className="our-works_tag">{work.category}</span>
                <h3>{work.title}</h3>
                <p>{work.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurWorks;
