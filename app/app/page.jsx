// app/page.jsx
import Header from "./components/Header";
import MainPart from "./components/MainPart";
import Search from "./components/Search";
import About from "./components/About";
import SignIn from "./components/SignIn";
import OurTeam from "./components/OurTeam";
import MemorableLines from "./components/MemorableLines";
import Footer from "./components/Footer";
import styles from "./page.module.css"; // You can style the page here

export default function Home() {
    return (
        <div className={styles.container}>
            <Header />
            <MainPart />
            <Search />
            <About />
            <SignIn />
            <OurTeam />
            <MemorableLines />
            <Footer />
        </div>
    );
}
