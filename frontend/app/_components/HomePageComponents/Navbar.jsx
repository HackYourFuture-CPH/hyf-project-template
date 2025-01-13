import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" passHref>
          <Image
            src="/upskillpro_logo.png"
            alt="UpSkillPro Logo"
            width={200}
            height={50}
          />
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/courses">Explore Courses</Link>
        </li>
        <li>
          <Link href="/signup?role=instructor">Become an Instructor</Link>
        </li>
        <li>
          <Link href="/contact_us">Contact Us</Link>
        </li>
      </ul>
      <button className={styles.button}>
        <Link href="/login">Log In</Link>
      </button>
      <button className={styles.button}>
        <Link href="/signup">Sign Up</Link>
      </button>
    </nav>
  );
};

export default Navbar;
