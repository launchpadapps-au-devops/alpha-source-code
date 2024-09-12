import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to get passed API endpoint
import styles from './healthCheckinDetails.module.scss';
import { DataCard } from '../../../../data-card/data-card';
import { EmptyComponent } from '../../../../empty-state-component/empty-component';
import { AssessmentCard } from '../assessments-components/assestment-card/assessment-card';

export const HealthCheckDetail = () => {
  const location = useLocation();
  const { apiEndpoint } = location.state; // Retrieve the API endpoint passed from the previous page
  const [assessmentData, setAssessmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const response = await fetch(apiEndpoint); // Fetch data using the passed API endpoint
        const data = await response.json();
        setAssessmentData(data);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (apiEndpoint) {
      fetchAssessmentData(); // Only call the API when the API endpoint is present
    }
  }, [apiEndpoint]); // Dependency on the API endpoint

  return (
    <div className={styles.detailWrapper}>
      {isLoading ? (
        <DataCard className={styles.loadingCard}>
          <h1>Loading...</h1>
        </DataCard>
      ) : (
        <>
          {assessmentData.length === 0 ? (
            <EmptyComponent
              title="No Data Available"
              description="There is no data available for this assessment."
            />
          ) : (
            <div className={styles.assessmentList}>
              {assessmentData.map((data, index) => (
                <AssessmentCard
                      key={index}
                      question={''} answers={[]}                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
