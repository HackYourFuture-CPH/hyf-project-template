import styles from './AboutSection.module.css';

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>About PetPass</h2>
            <p className={styles.description}>
              For over 15 years, PetPass has been dedicated to providing the highest quality 
              products and services for your beloved pets. We understand that pets are family, 
              and they deserve nothing but the best.
            </p>
            <p className={styles.description}>
              Our team of pet experts carefully curates every product in our collection, 
              ensuring that each item meets our strict standards for quality, safety, and 
              effectiveness. From premium nutrition to engaging toys, we have everything 
              your pet needs to live a happy and healthy life.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Premium Quality Products</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Expert Pet Care Advice</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Fast & Reliable Delivery</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>24/7 Customer Support</span>
              </div>
            </div>
            <button className={styles.learnMoreButton}>
              Learn More About Us
            </button>
          </div>
          
          <div className={styles.imageContent}>
            <div className={styles.imageContainer}>
              <img 
                src="https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                alt="Happy pet owner with dog"
                className={styles.aboutImage}
              />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <h3>15+ Years</h3>
                  <p>of Pet Care Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;