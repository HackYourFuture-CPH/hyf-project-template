'use client';

import { User } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navItems = ['Home', 'Products', 'Blog', 'About Us', 'Contact Us'];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoText}>PetPass</span>
        </div>

        {/* Navigation Items */}
        <ul className={styles.navItems}>
          {navItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Login Icon */}
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