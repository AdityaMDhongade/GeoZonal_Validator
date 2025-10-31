import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

const ADMIN_KEY = "mySuperSecretAdmin123";

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/admin/reports", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/admin/report/${id}`,
        { status },
        { headers: { "x-admin-key": ADMIN_KEY } }
      );
      fetchReports();
      if (selectedReport && selectedReport._id === id) {
        setSelectedReport({ ...selectedReport, status });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const deleteReport = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await axios.delete(`/api/admin/report/${id}`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      setSelectedReport(null);
      fetchReports();
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p className={styles.loading}>Loading reports...</p>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.listPanel}>
        <h2 className={styles.panelTitle}>All Reports</h2>
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <ul className={styles.reportList}>
            {reports.map((report) => (
              <li
                key={report._id}
                className={`${styles.reportItem} ${
                  selectedReport?._id === report._id ? styles.active : ""
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div>
                  <p className={styles.reportAddress}>{report.address}</p>
                  <p className={styles.reportStatus}>{report.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.detailPanel}>
        {!selectedReport ? (
          <div className={styles.placeholder}>
            <h3>Report Details</h3>
            <p>Select a report from the list to view details.</p>
          </div>
        ) : (
          <div>
            <h3 className={styles.panelTitle}>Report Details</h3>
            <div className={styles.detailItem}>
              <strong>Address:</strong>
              <p>{selectedReport.address}</p>
            </div>

            <div className={styles.detailItem}>
              <strong>Status:</strong>
              <p>{selectedReport.status}</p>
              <select
                className={styles.dropdown}
                onChange={(e) => updateStatus(selectedReport._id, e.target.value)}
                value={selectedReport.status}
              >
                <option>Newly Reported</option>
                <option>Under Verification</option>
                <option>Verified - Authorized</option>
                <option>Verified - Action Taken</option>
              </select>
            </div>

            <div className={styles.detailItem}>
              <strong>Description:</strong>
              <p>{selectedReport.description}</p>
            </div>

            {selectedReport.plot && (
              <div className={styles.detailItem}>
                <strong>Plot:</strong>
                <pre>{JSON.stringify(selectedReport.plot, null, 2)}</pre>
              </div>
            )}

            {selectedReport.building && (
              <div className={styles.detailItem}>
                <strong>Building:</strong>
                <pre>{JSON.stringify(selectedReport.building, null, 2)}</pre>
              </div>
            )}

            {selectedReport.road && (
              <div className={styles.detailItem}>
                <strong>Road:</strong>
                <pre>{JSON.stringify(selectedReport.road, null, 2)}</pre>
              </div>
            )}

            <div className={styles.detailItem}>
              <strong>Photos:</strong>
              <div className={styles.photoGallery}>
                {selectedReport.photos?.map((photo, index) => (
                  <a
                    key={index}
                    href={`http://localhost:9000/${photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:9000/${photo}`}
                      alt={`Report photo ${index + 1}`}
                    />
                  </a>
                ))}
              </div>
            </div>

            <button
              className={styles.deleteButton}
              onClick={() => deleteReport(selectedReport._id)}
            >
              Delete Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
