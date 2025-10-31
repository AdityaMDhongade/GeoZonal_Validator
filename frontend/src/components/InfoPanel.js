import React from 'react';
import styles from './InfoPanel.module.css';

const InfoPanel = ({ plotData, permitResult, isLoading }) => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Analysis Report</h3>

      {isLoading && <div className={styles.loader}>Analyzing...</div>}
      
      {!isLoading && !plotData && (
        <div className={styles.placeholder}>
          <p>Click on a building or draw a plot on the map to begin analysis.</p>
        </div>
      )}

      {!isLoading && plotData && (
        <div className={styles.dataSection}>
          <h4>Source Data:</h4>
          {plotData.location && (
            <p><strong>📍 Location:</strong> {plotData.location.lat.toFixed(4)}, {plotData.location.lng.toFixed(4)}</p>
          )}
          {plotData.building && (
            <p><strong>🏢 Building Area:</strong> {plotData.building.area} m²</p>
          )}
          {plotData.plot && (
            <p><strong>📐 Plot Area (Drawn):</strong> {plotData.plot.area} m²</p>
          )}
          {plotData.road && (
            <p><strong>🛣️ Nearest Road:</strong> {plotData.road.width}m wide ({plotData.road.type}) at {plotData.road.distance}m</p>
          )}
          {plotData.error && (
            <p className={styles.error}>{plotData.error}</p>
          )}
        </div>
      )}
      
      {!isLoading && permitResult && (
        <div className={styles.resultSection}>
          <h4>Compliance Results:</h4>
          <ul>
            <li><strong>Permissible FSI:</strong> {permitResult.permissible_fsi}</li>
            <li><strong>Plot Area:</strong> {permitResult.plot_area_sqm} m²</li>
            <li><strong>Max Built-Up Area:</strong> {permitResult.max_builtup_area_sqm} m²</li>
            <li><strong>Max Building Height:</strong> {permitResult.max_building_height_m} m</li>
            <li className={permitResult.status === 'Violation' ? styles.violation : styles.compliant}>
              <strong>Status:</strong> {permitResult.message}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;