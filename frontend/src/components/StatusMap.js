import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import styles from './StatusMap.module.css';
import 'leaflet/dist/leaflet.css';

// Helper function to create custom colored icons
const createDotIcon = (color) => {
  return L.divIcon({
    html: `<span class="${styles.mapDot}" style="background-color: ${color};"></span>`,
    className: '',
    iconSize: [12, 12],
  });
};

const icons = {
  'Newly Reported': createDotIcon('#dc3545'), // Red
  'Under Verification': createDotIcon('#ffc107'), // Yellow
  'Verified - Authorized': createDotIcon('#28a745'), // Green
  'Verified - Action Taken': createDotIcon('#212529'), // Black
};

const StatusMap = ({ onReportSelect }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // ✅ Correct public reports endpoint (from submitRoutes)
        const response = await axios.get('http://localhost:9000/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading Map Data...</div>;
  }

  return (
    <MapContainer
      center={[19.9975, 73.7898]} // Nashik
      zoom={12}
      className={styles.mapContainer}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {reports.map((report) => (
        report.location?.coordinates && (
          <Marker
            key={report._id}
            position={[
              report.location.coordinates[1],
              report.location.coordinates[0],
            ]}
            icon={icons[report.status] || createDotIcon('grey')}
            eventHandlers={{
              click: () => onReportSelect(report),
            }}
          >
            <Popup>
              <div className={styles.popup}>
                <strong>Status:</strong> {report.status}<br />
                <p>{report.address}</p>
                <small>{new Date(report.createdAt).toLocaleDateString()}</small>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default StatusMap;
