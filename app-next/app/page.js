import HomePage from "@/components/HomePage/HomePage";
import Card from "@/components/Card/Card";
import TravelCards from "@/components/TravelCards/TravelCards";
import Destination from "@/components/Destination/Destination";
import Community from "@/components/Community/Community";

export default function Home() {
  return (
    <>
      <section id="home">
        <HomePage />
      </section>
      <section id="trips">
        <TravelCards />
      </section>
      <section id="destination">
        <Destination />
      </section>
      <section id="community">
        <Community />
      </section>
    </>
  );
}
