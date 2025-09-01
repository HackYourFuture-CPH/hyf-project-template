import "./HomePage.css";
import HeroSection from "../HeroSection/HeroSection";
import ToursSection from "../ToursSection/ToursSection";
import Destination from "../Destination/Destination";
import Community from "../Community/Community";

function HomePage() {
  return (
    <>
      <section id="home" className="sectionWrapper">
        <HeroSection />
      </section>
      <section id="trips" className="sectionWrapper">
        <ToursSection />
      </section>
      <section id="destination" className="sectionWrapper">
        <Destination />
      </section>
      <section id="community" className="sectionWrapper">
        <Community />
      </section>
    </>
  );
}

export default HomePage;