import Link from "next/link";
import Hero from "./Components/Hero/Hero";
import Services from "./Components/Services/Services";
import AboutUs from "./Components/AboutUs/AboutUs";
import WhyChooseUs from "./Components/WhyChooseUs/WhyChooseUs";
import OurWorks from "./Components/OurWorks/OurWorks";
import Reviwes from "./Components/Reviwes/Reviwes";
import LetsStart from "./Components/Let'sStart/LetsStart";
import Footer from "./Components/Footer/Footer";
export default function Home() {
  return (
    <main
      dir="rtl">
      <Hero />
      <Services />
      <AboutUs />
      <WhyChooseUs />
      <OurWorks />
      <Reviwes />
      <LetsStart />
      <Footer />
    </main>
  );
}
