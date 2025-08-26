import Navbar from '../components/Navbar/Navbar';
import HeroSection from '../components/HeroSection/HeroSection';
import CategorySection from '../components/CategorySection/CategorySection';
import AboutSection from '../components/AboutSection/AboutSection';
import PromotionalSection from '../components/PromotionalSection/PromotionalSection';
import Footer from '../components/Footer/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <PromotionalSection />
      <Footer />
    </div>
  );
}