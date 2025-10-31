// src/components/ReportDetailPanel.js

import React from 'react';
import styles from './ReportDetailPanel.module.css';

const ReportDetailPanel = ({ report }) => {
  // If no report is selected, show a placeholder message
  if (!report) {
    return (
      <div className={styles.panelContainer}>
        <h3 className={styles.panelTitle}>Report Details</h3>
        <p className={styles.placeholder}>Click a marker on the map to see its details.</p>
      </div>
    );
  }

  // If a report is selected, show its details
  return (
    <div className={styles.panelContainer}>
      <h3 className={styles.panelTitle}>Report Details</h3>
      <div className={styles.detailItem}>
        <strong>Address:</strong>
        <p>{report.address}</p>
      </div>
      <div className={styles.detailItem}>
        <strong>Status:</strong>
        <p>{report.status}</p>
      </div>
      <div className={styles.detailItem}>
        <strong>Description:</strong>
        <p>{report.description}</p>
      </div>
      <div className={styles.detailItem}>
        <strong>Photos:</strong>
        <div className={styles.photoGallery}>
          {report.photos.map((photo, index) => (
            <a key={index} href={`http://localhost:9000/${photo}`} target="_blank" rel="noopener noreferrer">
              <img src={`http://localhost:9000/${photo}`} alt={`Report photo ${index + 1}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPanel;