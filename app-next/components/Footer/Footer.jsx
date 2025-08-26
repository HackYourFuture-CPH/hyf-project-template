import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";
import logo from "../../assets/Logo.png";
export default function () {
  return (
    <>
      <footer className={` ${styles.footer}`}>
        <div className={`container  ${styles.footerContainer}`}>
          <div>
            <Link href="/" className={styles.logoDiv}>
              <Image src={logo} alt="logo" height={100} width={100} />
              <p className={styles.logoName}>
                <span>Better</span> <span>Travel</span>
              </p>
            </Link>
          </div>
          <div>
            <div className={styles.footerLinksContainer}>
              <ul className={styles.informationUl}>
                <h4>About</h4>
                <li>
                  <a href="">Information</a>
                </li>
                <li>
                  <a href="">FAQs</a>
                </li>
              </ul>
              <ul>
                <h4>Destination</h4>
                <li>
                  <a href="">News</a>
                </li>
                <li>
                  <a href="">Responsible travel</a>
                </li>
                <li>
                  <a href="">Tours</a>
                </li>
              </ul>
              <ul>
                <h4>Contact</h4>
                <li>
                  <a href="">Address</a>
                </li>
                <li>
                  <a href="">Tourist information</a>
                </li>
                <li>
                  <a href="">Media</a>
                </li>
              </ul>
              <ul>
                <h4>Community</h4>
                <li>
                  <a href="">About community</a>
                </li>
              
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
