import "./HomePage.css";
import HeroSection from "../HeroSection/HeroSection";
import ToursSection from "../ToursSection/ToursSection"; 
import Community from "../Community/Community";
import BlogPostsSection from "../BlogPostsSection/BlogPostsSection";

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
      <section id="community" className="sectionWrapper">
        <Community />
      </section>
    </>
  );
}

export default HomePage;