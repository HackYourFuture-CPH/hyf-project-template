import "./HomePage.css";
import HeroSection from "../HeroSection/HeroSection";
import ToursSection from "../ToursSection/ToursSection"; 
import BlogPostsSection from "../BlogPostsSection/BlogPostsSection";
import AttractionsSection from "../AttractionsSection/AttractionsSection";

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
      <section id="blogposts" className="sectionWrapper">
        <AttractionsSection />
      </section>
    </>
  );
}

export default HomePage;