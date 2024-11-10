import AppLayoutContainer from "./components/AppLayoutContainer";
import MainPart from "./components/MainPart";
import Search from "./components/Search";
import About from "./components/About";
import SignIn from "./components/SignIn";
import OurTeam from "./components/OurTeam";
import MemorableLines from "./components/MemorableLines";

export default function Home() {
    return (
        <AppLayoutContainer>
            <MainPart />
            <Search />
            <About />
            <SignIn />
            <OurTeam />
            <MemorableLines />
        </AppLayoutContainer>
    );
}
