import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage}>
        <img 
          src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Beautiful cat"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h1 className={styles.heroTitle}>
            Everything Your Pet Needs, All In One Place
          </h1>
          <p className={styles.heroDescription}>
            Discover premium pet products, expert advice, and caring services 
            for your beloved companions. From nutrition to toys, we've got you covered.
          </p>
          <button className={styles.shopButton}>
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;