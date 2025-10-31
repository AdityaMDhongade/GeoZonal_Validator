import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <div className={styles.navContent}>
          <div className={styles.logoContainer}>
            <NavLink to="/" className={styles.logo}>
              Compliance Compass
            </NavLink>
          </div>
          <div className={styles.navLinks}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              City Dashboard
            </NavLink>
            <NavLink to="/report" className={`${styles.link} ${styles.reportButton}`}>
              Analyze & Report
            </NavLink>

            {/* ✅ Simple Logout button */}
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
