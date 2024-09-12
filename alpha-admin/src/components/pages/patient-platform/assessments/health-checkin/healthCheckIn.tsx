import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import classNames from 'classnames';
import styles from './healthCheckIn.module.scss';
import { SidebarPatient } from '../../../patient-Management/patient-sidebar/patientSidebar';
import TabBar from '../../../content/content-components/tab-bar/TabBar';
import { DataCard } from '../../../../data-card/data-card';

export const HealthCheckinResponse = () => {
  const [selectedTab, setSelectedTab] = useState(1); // Set default to 'Health check-in responses'
  const navigate = useNavigate(); // React Router v6 navigate hook

  const handleTabChange = (newValue: any) => {
    setSelectedTab(newValue);
  };

  const healthCheckOptions = [
    {
      title: 'The Australian Type 2 Diabetes Risk Assessment (AUSDRISK)',
      api: '/api/diabetes-assessment', // Example API endpoint for each card
    },
    {
      title: 'Breast Cancer Risk Assessment',
      api: '/api/breast-cancer-assessment',
    },
    {
      title: 'Heart health risk assessment',
      api: '/api/heart-health-assessment',
    },
    {
      title: 'Wellbeing Survey (WHO5)',
      api: '/api/wellbeing-survey',
    }
  ];

  const handleCardClick = (apiEndpoint: string) => {
    navigate('/health-check-detail', {
      state: { apiEndpoint } // Pass the API endpoint to the next screen
    });
  };

  return (
    <>
      <div className={styles.healthCheckinWrapper}>
        <div className={styles.contentWrapper}>
          {selectedTab === 1 && (
            <div className={styles.cardLayout}>
              {healthCheckOptions.map((option, index) => (
                <DataCard
                  key={index}
                  className={styles.dataCard}
                  onClick={() => handleCardClick(option.api)} // Handle click event
                >
                  <h3>{option.title}</h3>
                </DataCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
