import classNames from 'classnames';
import styles from './assessments.module.scss';
import TabBar from '../../content/content-components/tab-bar/TabBar';
import { useEffect, useState } from 'react';
import { DataCard } from '../../../data-card/data-card';
import { AssessmentCard } from './assessments-components/assestment-card/assessment-card';
import { EmptyComponent } from '../../../empty-state-component/empty-component';
import { SidebarPatient } from '../../patient-Management/patient-sidebar/patientSidebar';
import { onBoardingAssessment } from './assessmentAPI';
import { HealthCheckinResponse } from './health-checkin/healthCheckIn';
import { PuffLoader } from 'react-spinners'; // Import PuffLoader

export interface AssessmentsProps {
  className?: string;
}

interface AssessmentData {
  question: string;
  answers: string[];
}

export const Assessments = ({ className }: AssessmentsProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [onboardingData, setOnboardingData] = useState<AssessmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const tabs = ['Onboarding assessment', 'Health check-in responses'];

  const patientId = localStorage.getItem('selectedPatientId');

  useEffect(() => {
    const fetchOnBoardingAssessment = async () => {
      try {
        const response = await onBoardingAssessment(patientId);
        // Extract the relevant data from the response and map to the required structure
        const assessmentData = response.data.map((item: any) => ({
          question: item.question,
          answers: Array.isArray(item.answer) 
            ? item.answer.map((ans: any) => ans.tag) // Display answerTags for multiple choice
            : [item.answerTags] // If the answer is a string or a single value
        }));
        setOnboardingData(assessmentData);
      } catch (error) {
        console.error('Error fetching onboarding assessment:', error);
      } finally {
        setIsLoading(false); // Set loading to false after API call
      }
    };

    if (patientId) {
      fetchOnBoardingAssessment();
    }
  }, [patientId]);

  const handleTabChange = (newValue: number) => {
    setSelectedTab(newValue);
  };

  const onboardingIncomplete = onboardingData.length === 0;

  return (
    <>
      <SidebarPatient />
      <div className={classNames(styles['assessment-wrapper'], className)}>
        {isLoading ? (
          // Show a loading spinner while the data is being fetched
          <div className={styles.loaderOverlay}>
            <PuffLoader color="#007bff" /> {/* Centered loader */}
          </div>
        ) : (
          <>
            {/* Move TabBar outside the conditional block so it's always displayed */}
            <TabBar
              className={styles['stretched-tabs']}
              tabs={tabs}
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
            />

            {selectedTab === 0 && (
              <DataCard className={styles['tab-panel']}>
                <h1>Onboarding assessment</h1>
                {onboardingIncomplete ? (
                  <EmptyComponent
                    title="Patient onboarding assessment incomplete"
                    description="The patient has not yet completed the Onboarding Assessment. They can easily complete it through the patient app. Once completed, the assessment results will be available here."
                  />
                ) : (
                  <div className={styles['assessment-list']}>
                    {onboardingData.map((data, index) => (
                      <AssessmentCard key={index} question={data.question} answers={data.answers} />
                    ))}
                  </div>
                )}
              </DataCard>
            )}

            {selectedTab === 1 && (
              <DataCard className={styles['tab-panel']}>
                <h1>Health check-in responses</h1>
                <br />
                <HealthCheckinResponse />
              </DataCard>
            )}
          </>
        )}
      </div>
    </>
  );
};

