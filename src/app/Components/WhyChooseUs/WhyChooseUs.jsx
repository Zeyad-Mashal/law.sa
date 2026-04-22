import React from "react";
import "./WhyChooseUs.css";
import { FaBrain, FaBolt, FaLock, FaCircleCheck } from "react-icons/fa6";

const WhyChooseUs = () => {
  const cards = [
    {
      id: "01",
      icon: <FaBrain />,
      title: "خبرة قانونية عالية",
      text: "نخبة من المحامين بخبرات تتجاوز عقدين في مختلف التخصصات.",
    },
    {
      id: "02",
      icon: <FaBolt />,
      title: "سرعة في الاستجابة",
      text: "نلتزم بالرد على استفساراتكم خلال ساعات من تواصلكم معنا.",
    },
    {
      id: "03",
      icon: <FaLock />,
      title: "خصوصية وأمان",
      text: "حماية كاملة لمعلوماتكم ضمن أعلى معايير السرية المهنية.",
    },
    {
      id: "04",
      icon: <FaCircleCheck />,
      title: "فريق سعودي معتمد",
      text: "محامون مرخصون من وزارة العدل وفق الأنظمة السعودية.",
    },
  ];

  return (
    <section className="why-choose-us" aria-label="لماذا نحن">
      <div className="why-choose-us_container">
        <div className="why-choose-us_heading">
          <span>لماذا نحن</span>
          <h2>
            لماذا يثق بنا <span>الآلاف؟</span>
          </h2>
          <p>نلتزم بأعلى معايير الجودة في تقديم خدماتنا القانونية لكل عميل.</p>
        </div>

        <div className="why-choose-us_cards">
          {cards.map((card) => (
            <article className="why-choose-us_card" key={card.id}>
              <strong className="why-choose-us_number">{card.id}</strong>
              <div className="why-choose-us_icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
