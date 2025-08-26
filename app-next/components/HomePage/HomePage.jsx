import HYFLogo from "@/assets/hyf.svg";
import Image from "next/image";
import "./HomePage.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

// Feel free to replace the content of this component with your own
function HomePage() {
  return (
    <>
    <FontAwesomeIcon icon={faCoffee}  style={{ color: "blue", width: "32px" }} />

      <a href="https://www.hackyourfuture.dk/" target="_blank" className="link">
        <Image src={HYFLogo.src} width={HYFLogo.width} height={HYFLogo.height} className="logo" />
      </a>
      <a href="/nested" className="link">
        <span className="message">Go to the nested page</span>
      </a>
    </>
  );
}

export default HomePage;
