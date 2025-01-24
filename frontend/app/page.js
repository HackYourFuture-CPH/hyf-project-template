import HeroSection from "./_components/HomePageComponents/Hero";
import CategorySection from "./_components/HomePageComponents/CategorySection";
import FAQ from "./_components/HomePageComponents/FAQ";
import Testimonial from "./_components/HomePageComponents/Testimonial";
import CategoryTabs from "./_components/HomePageComponents/CategoryTabs";
import CoursesGrid from "./_components/HomePageComponents/CoursesGrid";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FAQ />
      <CategoryTabs />
      <CoursesGrid />
     <Testimonial />

    </div>
  );
}
