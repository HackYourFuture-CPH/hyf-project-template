import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    'Home', 'Products', 'Blog', 'About Us', 'Contact Us'
  ];

  const categories = [
    'Dogs', 'Cats', 'Fish', 'Rabbits', 'Birds'
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>PetPass</h3>
            <p className={styles.description}>
              Your trusted partner in pet care for over 15 years. 
              We provide premium products and services for your beloved companions.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>info@PetPass.com</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>123 Pet Street, Animal City, AC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className={styles.footerLink}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Pet Categories</h4>
            <ul className={styles.linkList}>
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="#" className={styles.footerLink}>{category}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Stay Updated</h4>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for pet care tips and exclusive offers.
            </p>
            <div className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Enter your email"
                className={styles.emailInput}
              />
              <button className={styles.subscribeButton}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className={styles.footerBottom}>
          <div className={styles.socialMedia}>
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a 
                  key={index}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <IconComponent size={20} />
                </a>
              );
            })}
          </div>
          
          <div className={styles.copyright}>
            <p>&copy; 2025 PetPass. All rights reserved.</p>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>Privacy Policy</a>
              <span className={styles.separator}>|</span>
              <a href="#" className={styles.legalLink}>Terms of Service</a>
              <span className={styles.separator}>|</span>
              <a href="#" className={styles.legalLink}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;