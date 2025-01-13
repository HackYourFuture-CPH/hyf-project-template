import React from "react";
import {
  FaTwitter,
  FaFacebook,
  FaRSS,
  FaInstagram,
  FaRss,
} from "react-icons/fa";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Top Section */}
      <div className={styles.footerTop}>
        <div className={styles.feature}>
          <i className={styles.icon}>✔️</i>
          <p>30 day money back guarantee</p>
        </div>
        <div className={styles.feature}>
          <i className={styles.icon}>🌍</i>
          <p>Support teams across the world</p>
        </div>
        <div className={styles.feature}>
          <i className={styles.icon}>🔒</i>
          <p>Safe & Secure online payment</p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Middle Section */}
      <div className={styles.footerMiddle}>
        <div className={styles.column}>
          <h3>WHO WE ARE</h3>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Team</a>
            </li>
            <li>
              <a href="#">Work With Us</a>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>COURSES</h3>
          <ul>
            <li>
              <a href="#">Python</a>
            </li>
            <li>
              <a href="#">PHP</a>
            </li>
            <li>
              <a href="#">JavaScript</a>
            </li>
            <li>
              <a href="#">React</a>
            </li>
            <li>
              <a href="#">Nodejs</a>
            </li>
            <li>
              <a href="#">eCommerce</a>
            </li>
            <li>
              <a href="#">Machine Learning</a>
            </li>
            <li>
              <a href="#">Angular</a>
            </li>
            <li>
              <a href="#">React Native</a>
            </li>
            <li>
              <a href="#">Java</a>
            </li>
            <li>
              <a href="#">Rust</a>
            </li>
            <li>
              <a href="#">Media Buying</a>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>TOP CATEGORIES</h3>
          <ul>
            <li>
              <a href="#">Programming</a>
            </li>
            <li>
              <a href="#">Design</a>
            </li>
            <li>
              <a href="#">Animation</a>
            </li>
            <li>
              <a href="#">Data</a>
            </li>
            <li>
              <a href="#">Engineering</a>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>SUPPORT</h3>
          <ul>
            <li>
              <a href="#">Documentation</a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
            <li>
              <a href="#">Support Policy</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">COVID-19 Resources</a>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>WE RECOMMEND</h3>
          <ul>
            <li>
              <a href="#">Community</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Success Stories</a>
            </li>
            <li>
              <a href="#">Take a Quiz</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.socialIcons}>
          <a href="#">
            <FaTwitter className={styles.icon} />
          </a>
          <a href="#">
            <FaFacebook className={styles.icon} />
          </a>
          <a href="#">
            <FaRss className={styles.icon} />
          </a>
          <a href="#">
            <FaInstagram className={styles.icon} />
          </a>
        </div>
        <p>
          &copy; COPYRIGHT BYTECODERS 2024 - Terms & Conditions | Privacy Policy
        </p>
        {/* UpSkillPro Logo */}
        <div className={styles.logoContainer}>
          <Image
            src="/upskillpro_logo.png"
            alt="UpSkillPro Logo"
            height={20}
            width={20}
            className={styles.logo}
          />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
