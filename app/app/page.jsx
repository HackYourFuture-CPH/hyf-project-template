import AppLayoutContainer from "./components/AppLayoutContainer";
import MainPart from "./components/MainPart";
import About from "./components/About";
import TopBooks from "./components/TopBooks";
import OurTeam from "./components/OurTeam";
import RandomBooks from "./components/RandomBooks";
import MemorableLines from "./components/MemorableLines";

export default function Home() {
    return (
        <AppLayoutContainer>
            <MainPart />
            <TopBooks />
            <About />
            <MemorableLines />
            <OurTeam />
            <RandomBooks />
        </AppLayoutContainer>
    );
}
