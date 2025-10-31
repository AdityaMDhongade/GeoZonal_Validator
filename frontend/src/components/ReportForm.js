import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ReportForm.module.css';

const ReportForm = ({ plotData }) => {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = { id: 'user123', name: 'Test User' };

  useEffect(() => {
    if (plotData && plotData.address) {
      setAddress(plotData.address);
    } else {
      setAddress('');
    }
    setDescription('');
    setSelectedFiles([]);
    setFeedback({ message: '', type: '' });
  }, [plotData]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });

    if (!address.trim()) {
      setFeedback({ message: 'Please enter a valid address.', type: 'error' });
      return;
    }
    if (!description.trim()) {
      setFeedback({ message: 'Please enter the violation details.', type: 'error' });
      return;
    }
    if (selectedFiles.length === 0) {
      setFeedback({ message: 'Please upload at least one photo.', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    const finalPlotData = { ...plotData, address: address };

    const formData = new FormData();
    formData.append('plotData', JSON.stringify(finalPlotData));
    formData.append('address', address); // ✅ Added — backend requires `address`
    formData.append('description', description);
    formData.append('userId', user.id);
    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:9000/reports", // ✅ Fixed API path
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      setFeedback({ message: response.data.message, type: 'success' });
      setAddress('');
      setDescription('');
      setSelectedFiles([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Submission failed. Please try again.';
      setFeedback({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !plotData || isSubmitting;

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>File a Report</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="address" className={styles.label}>Site Address</label>
          <input
            type="text"
            name="address"
            id="address"
            className={styles.input}
            placeholder="Click map to auto-fill or enter address manually..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className={styles.label}>Violation Details</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className={styles.textarea}
            placeholder="e.g., 'New floor being added illegally'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="photos" className={styles.label}>Upload Site Photos</label>
          <input
            type="file"
            name="photos"
            id="photos"
            className={styles.fileInput}
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className={styles.fileList}>
            <p>Selected Files:</p>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>

        {feedback.message && (
          <div className={`${styles.feedback} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportForm;
