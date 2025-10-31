import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.mainHeading}>
        Empowering Citizens for Planned Development
      </h1>
      <p className={styles.subHeading}>
        Our tools help you instantly check construction rules and report potential violations, creating a more transparent and accountable city.
      </p>
      <div className={styles.buttonGroup}>
        <Link to="/report" className={styles.primaryButton}>
          Analyze & Report Construction
        </Link>
        <Link to="/map" className={styles.secondaryButton}>
          View City Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;