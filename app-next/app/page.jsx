import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Footer from "@/components/footer";
// import  Autificationform  from    "@/components/autificationform.jsx"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      <div className="container mx-auto px-4 flex-grow">
        <Navbar />
        <Hero />
        <Features />
      </div>
      {/* <Autificationform/> */}
      <Footer />
    </div>
  );
}
