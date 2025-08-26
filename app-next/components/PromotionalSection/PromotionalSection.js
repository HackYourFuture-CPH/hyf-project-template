import styles from './PromotionalSection.module.css';

const PromotionalSection = () => {
  const promotions = [
    {
      title: 'Best Products for Your Companion',
      description: 'Discover premium quality products that your pets will love. From nutritious food to comfortable beds.',
      image: 'https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      buttonText: 'SHOP NOW'
    },
    {
      title: 'Must-Have Items',
      description: 'Essential accessories and toys that every pet owner needs. Quality guaranteed for happy pets.',
      image: 'https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      buttonText: 'SHOP NOW'
    }
  ];

  return (
    <section className={styles.promotionalSection}>
      <div className={styles.container}>
        <div className={styles.promotionsGrid}>
          {promotions.map((promo, index) => (
            <div key={index} className={styles.promotionCard}>
              <div className={styles.imageContainer}>
                <img 
                  src={promo.image}
                  alt={promo.title}
                  className={styles.promotionImage}
                />
                <div className={styles.overlay}></div>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.title}>{promo.title}</h3>
                <p className={styles.description}>{promo.description}</p>
                <button className={styles.shopButton}>
                  {promo.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;