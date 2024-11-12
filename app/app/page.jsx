import AppLayoutContainer from "./components/AppLayoutContainer";
import MainPart from "./components/MainPart";
import About from "./components/About";
import SignIn from "./components/SignIn";
import OurTeam from "./components/OurTeam";
import RandomBooks from "./components/RandomBooks";
import MemorableLines from "./components/MemorableLines";

export default function Home() {
    return (
        <AppLayoutContainer>
            <MainPart />
            <About />
            <SignIn />
            <RandomBooks />
            <OurTeam />
            <MemorableLines />
        </AppLayoutContainer>
    );
}
