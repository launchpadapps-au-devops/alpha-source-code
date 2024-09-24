import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './healthCheckIn.module.scss';
import { SidebarPatient } from '../../../patient-Management/patient-sidebar/patientSidebar';
import { DataCard } from '../../../../data-card/data-card';
import { getHealthCheckinResponse } from '../assessmentAPI';
import { AssessmentCard } from '../assessments-components/assestment-card/assessment-card';
import { BackButtonPatient } from '../../../../back-button-patient/backButtonPatient';


export const HealthCheckinResponse = () => {
  const [selectedTab, setSelectedTab] = useState(1); // Default to 'Health check-in responses'
  const [healthCheckData, setHealthCheckData] = useState<any[]>([]); // State to store health check-in response
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedSurveyTitle, setSelectedSurveyTitle] = useState<string | null>(null); // Store survey title
  const navigate = useNavigate();

  const healthCheckOptions = [
    { title: 'The Australian Type 2 Diabetes Risk Assessment (AUSDRISK)', surveyType: 'diabetesAssessment' },
    { title: 'Breast Cancer Risk Assessment', surveyType: 'breastCancerAssessment' },
    { title: 'Heart Health Risk Assessment', surveyType: 'heartHealthAssessment' },
    { title: 'Wellbeing Survey (WHO5)', surveyType: 'wellbeingSurvey' }
  ];

  const handleCardClick = async (surveyType: string, surveyTitle: string) => {
    const userId = localStorage.getItem('selectedPatientId');
    setLoading(true);
    setSelectedSurveyTitle(surveyTitle);
    try {
      const response = await getHealthCheckinResponse(userId, surveyType);
      setHealthCheckData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching health check-in response:', error);
      setLoading(false);
    }
  };

  return (
    <>
     {  selectedSurveyTitle && <BackButtonPatient onClick={() => setSelectedSurveyTitle(null)} /> }
      <div className={styles.healthCheckinWrapper}>
        <div className={classNames(styles.contentWrapper, { [styles.healthCheckinCardLayout]: !selectedSurveyTitle })}>
          {selectedTab === 1 && (
            !selectedSurveyTitle ? (
              <>
                {healthCheckOptions.map((option, index) => (
                  <DataCard
                    key={index}
                    className={styles.dataCard}
                    onClick={() => handleCardClick(option.surveyType, option.title)}
                  >
                    <h3>{option.title}</h3>
                  </DataCard>
                ))}
              </>
            ) : (
              <>
                {/* If survey data is being loaded */}
                {loading && (
                  <div className={styles.loaderOverlay}>
                    <p>Loading survey data...</p>
                  </div>
                )}

                {/* If survey data has been fetched, display it */}
                {!loading && (
                  <>
                    <h2>{selectedSurveyTitle} Responses</h2>
                    <br />
                    <div className={styles.assessmentList}>
                      {healthCheckData.length === 0 ? (
                        <p>No responses available for this survey.</p>
                      ) : (
                        healthCheckData.map((data, index) => (
                          <AssessmentCard
                            key={index}
                            question={data.question || 'No question available'} // Handle null questions
                            answers={data.answer ? data.answer.map((ans: any) => ans.value) : []} // Handle multiple answers
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default HealthCheckinResponse;
