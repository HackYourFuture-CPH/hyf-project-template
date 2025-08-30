'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navItems = ['Home', 'Products', 'Blog', 'About Us', 'Contact Us'];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            className={styles['logo__img']}
            src="/images/logo.png"
            alt="PetPass logo"
            width={120}
            height={120}
            priority
          />
          <span className={styles['logo__text']}>PetPass</span>
        </div>

        <ul className={styles.navItems}>
          {navItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <a href="#" className={styles.navLink}>{item}</a>
            </li>
          ))}
        </ul>

        <div className={styles.loginSection}>
          <button className={styles.loginButton}>
            <User size={20} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
