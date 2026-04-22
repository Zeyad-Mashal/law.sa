import React from "react";
import "./Reviwes.css";

const Reviwes = () => {
  const reviews = [
    {
      id: 1,
      text: "تجربتي مع مكتب الصفوة كانت استثنائية، شفافية كاملة، تواصل ممتاز، ونتائج تفوق التوقعات في كل مرة.",
      name: "سلطان الزهراني",
      role: "رجل أعمال",
      initials: "س",
    },
    {
      id: 2,
      text: "الفريق على أعلى مستوى من الكفاءة والثقة، صاغوا لنا عقود استحواذ معقدة بدقة عالية وسرعة استجابة مذهلة.",
      name: "ريم الفهد",
      role: "مديرة قانونية - شركة استثمار",
      initials: "ر",
    },
    {
      id: 3,
      text: "خدمة قانونية احترافية جدًا واهتمام بأدق التفاصيل. أنقذونا في قضية تجارية بالغة التعقيد بحكم مرضٍ لصالحنا.",
      name: "خالد العمري",
      role: "الرئيس التنفيذي - مجموعة العمري",
      initials: "خ",
    },
  ];

  return (
    <section className="reviews" aria-label="آراء العملاء">
      <div className="reviews_container">
        <header className="reviews_header">
          <span>آراء العملاء</span>
          <h2>
            ثقة عملائنا <span>تاج فخرنا</span>
          </h2>
        </header>

        <div className="reviews_cards">
          {reviews.map((review) => (
            <article className="reviews_card" key={review.id}>
              <div className="reviews_card-top">
                <span className="reviews_quote">”</span>
                <span className="reviews_stars">★★★★★</span>
              </div>

              <p className="reviews_text">{review.text}</p>

              <div className="reviews_author">
                <div className="reviews_author-info">
                  <h3>{review.name}</h3>
                  <span>{review.role}</span>
                </div>
                <div className="reviews_avatar">{review.initials}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviwes;
