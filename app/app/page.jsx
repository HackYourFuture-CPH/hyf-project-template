import AppLayoutContainer from "./components/AppLayoutContainer";
import MainPart from "./components/MainPart";
import Search from "./components/Search";
import About from "./components/About";
import SignIn from "./components/SignIn";
import OurTeam from "./components/OurTeam";
import MemorableLines from "./components/MemorableLines";
import styles from "./page.module.css";

export default function Home() {
    return (
        <AppLayoutContainer>
            <div className={styles.container}>
                <MainPart />
                <Search />
                <About />
                <SignIn />
                <OurTeam />
                <MemorableLines />
            </div>
        </AppLayoutContainer>
    );
}
