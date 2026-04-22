import React from "react";
import "./Services.css";
import { FiMessageSquare } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";

const Services = () => {
  return (
    <div className="services">
      <div className="services_container">
        <span>خدماتنا</span>
        <h2>
          احصل على المشورة القانونية
          <br />
          <span>الفعالة</span>
          التي تحتاج إليها
        </h2>
        <p>باقة متكاملة من الحلول القانونية المصممة بعناية لتلبية احتياجاتك.</p>
        <div className="services_cards">
          <div className="services_card">
            <FiMessageSquare />
            <h3>الاستشارات القانونية</h3>
            <p>استشارات دقيقة من خبراء قانونيين في جميع التخصصات والقطاعات.</p>
            <button>
              ابدأ الآن <FaArrowLeftLong />
            </button>
          </div>
          <div className="services_card prime">
            <FiMessageSquare />
            <h3>الاستشارات القانونية</h3>
            <p>استشارات دقيقة من خبراء قانونيين في جميع التخصصات والقطاعات.</p>
            <button>
              ابدأ الآن <FaArrowLeftLong />
            </button>
          </div>
          <div className="services_card">
            <FiMessageSquare />
            <h3>الاستشارات القانونية</h3>
            <p>استشارات دقيقة من خبراء قانونيين في جميع التخصصات والقطاعات.</p>
            <button>
              ابدأ الآن <FaArrowLeftLong />
            </button>
          </div>
          <div className="services_card">
            <FiMessageSquare />
            <h3>الاستشارات القانونية</h3>
            <p>استشارات دقيقة من خبراء قانونيين في جميع التخصصات والقطاعات.</p>
            <button>
              ابدأ الآن <FaArrowLeftLong />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
