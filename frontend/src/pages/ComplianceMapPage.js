// src/pages/ComplianceMapPage.js

import React, { useState } from 'react';
import StatusMap from '../components/StatusMap';
import ReportDetailPanel from '../pages/ReportDetailPanel'; // 👈 NEW: Import the detail panel
import styles from './ComplianceMapPage.module.css';

const ComplianceMapPage = () => {
  // 👇 NEW: State to hold the report that the user clicks on
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>City-Wide Compliance Dashboard</h2>
        <p className={styles.subtitle}>
          This map shows the current status of reported constructions across the city.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mapColumn}>
          {/* 👇 NEW: Pass the handler function as a prop */}
          <StatusMap onReportSelect={handleReportSelect} />
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.infoPanel}>
            <h3 className={styles.panelTitle}>Legend</h3>
            <ul className={styles.legendList}>
              <li className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotRed}`}></span>
                <span>Newly Reported</span>
              </li>
              <li className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotYellow}`}></span>
                <span>Under Verification</span>
              </li>
              <li className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotGreen}`}></span>
                <span>Verified - Authorized</span>
              </li>
              <li className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotBlack}`}></span>
                <span>Verified - Action Taken</span>
              </li>
            </ul>
          </div>

          {/* 👇 NEW: Add the detail panel below the legend */}
          <ReportDetailPanel report={selectedReport} />
        </div>
      </div>
    </div>
  );
};

export default ComplianceMapPage;