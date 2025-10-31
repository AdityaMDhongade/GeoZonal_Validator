import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.footerText}>
          &copy; 2025 Compliance Compass. A project for better urban planning.
        </p>
      </div>
    </footer>
  );
};

export default Footer;