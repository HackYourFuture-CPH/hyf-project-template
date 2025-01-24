import HeroSection from "./_components/HomePageComponents/Hero";
import CategoryTabs from "./_components/HomePageComponents/CategoryTabs";
import CoursesGrid from "./_components/HomePageComponents/CoursesGrid";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryTabs />
      <CoursesGrid />
    </div>
  );
}
