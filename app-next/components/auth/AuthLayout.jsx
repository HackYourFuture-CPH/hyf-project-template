import Image from "next/image";
import React from "react";
import styles from "./AuthLayout.module.css"; // import the CSS module

export default function AuthLayout({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <Image
          src="/background.jpg"
          alt="background"
          fill
          priority
          className={styles.bgImage}
        />
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.innerWrapper}>
          <div className={styles.logoWrapper}>
            {/* todo later */}
            <Image
              src="/hyf.svg"
              alt="Logo"
              className={styles.bgImageLogo}
              height={0}
              width={0}
              sizes="100vw"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
