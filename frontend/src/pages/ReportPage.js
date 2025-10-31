import React, { useState } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import InfoPanel from '../components/InfoPanel';
import ReportForm from '../components/ReportForm';
import styles from './ReportPage.module.css';
import axios from 'axios';

const ReportPage = () => {
  const [plotData, setPlotData] = useState(null);
  const [permitResult, setPermitResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataFetch = async (data) => {
    setIsLoading(true);
    setPlotData(data);
    setPermitResult(null); // Clear previous results

    if (data && !data.error) {
      try {
        // Example backend route for compliance analysis (you can modify as per your backend)
        const response = await axios.post('http://localhost:9000/api/admin/analyze', data);
        setPermitResult(response.data);
      } catch (err) {
        console.error('Backend analysis failed:', err);
        setPermitResult({ message: 'Error analyzing data', status: 'Error' });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentGrid}>
        <div className={styles.mapColumn}>
          <InteractiveMap onDataFetch={handleDataFetch} />
        </div>

        <div className={styles.analysisColumn}>
          <InfoPanel plotData={plotData} permitResult={permitResult} isLoading={isLoading} />
          <ReportForm plotData={plotData} />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
