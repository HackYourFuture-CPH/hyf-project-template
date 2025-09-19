import "./HomePage.css";
import HeroSection from "../HeroSection/HeroSection";
import ToursSection from "../ToursSection/ToursSection";
import BlogPostsSection from "../BlogPostsSection/BlogPostsSection";
import AttractionsSection from "../AttractionsSection/AttractionsSection";
import TripPlannerSection from "../TripPlannerSection/TripPlannerSection";

function HomePage() {
  return (
    <>
      <section id="home" className="sectionWrapper">
        <HeroSection />
      </section>
      <section id="trips" className="sectionWrapper">
        <ToursSection />
      </section>
      <section id="blogposts" className="sectionWrapper">
        <BlogPostsSection />
      </section>
      <section id="attractions" className="sectionWrapper">
        <AttractionsSection />
      </section>
      <section id="planner" className="sectionWrapper">
        <TripPlannerSection />
      </section>
    </>
  );
}

export default HomePage;
