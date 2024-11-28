import AppLayoutContainer from "./components/AppLayoutContainer";
import MainPart from "./components/MainPart";
import About from "./components/About";
import TopBooks from "./components/TopBooks";

export default function Home() {
    return (
        <AppLayoutContainer>
            <MainPart />
            <TopBooks />
            <About />
        </AppLayoutContainer>
    );
}
