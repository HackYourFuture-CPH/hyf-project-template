import HeroSection from "./_components/HomePageComponents/Hero";
import CategorySection from "./_components/HomePageComponents/CategorySection";
import Testimonial from "./_components/HomePageComponents/Testimonial";
import CategoryTabs from "./_components/HomePageComponents/CategoryTabs";
import CoursesGrid from "./_components/HomePageComponents/CoursesGrid";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryTabs />
      <CoursesGrid />
     <Testimonial />
    </div>
  );
}
