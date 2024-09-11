import classNames from 'classnames';
import styles from './assessments.module.scss';
import TabBar from '../../content/content-components/tab-bar/TabBar';
import { useEffect, useState } from 'react';
import { DataCard } from '../../../data-card/data-card';
import { AssessmentCard } from './assessments-components/assestment-card/assessment-card';
import { EmptyComponent } from '../../../empty-state-component/empty-component';
import { SidebarPatient } from '../../patient-Management/patient-sidebar/patientSidebar';
import { onBoardingAssessment } from './assessmentAPI';

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
      //setIsLoading(true); // Set loading to true before API call
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
          // Show a loading indicator while the data is being fetched
          <DataCard className={classNames(styles['tab-panel'], styles['stretch-box'])}>
            {/* <h1>Loading...</h1> */}
          </DataCard>
        ) : (
          <>
            {onboardingIncomplete ? (
              <DataCard className={classNames(styles['tab-panel'], styles['stretch-box'])}>
                <h1>Onboarding Assessment</h1>
                <EmptyComponent
                  title="No assessment data available"
                  description="There is currently no assessment data available. The patient has not completed any assessments yet."
                />
              </DataCard>
            ) : (
              <>
                <TabBar
                  className={styles['stretched-tabs']}
                  tabs={tabs}
                  selectedTab={selectedTab}
                  onTabChange={handleTabChange}
                />

                {selectedTab === 0 && (
                  <DataCard className={styles['tab-panel']}>
                    <h1>Onboarding assessment</h1>
                    {onboardingData.length > 0 ? (
                      <div className={styles['assessment-list']}>
                        {onboardingData.map((data, index) => (
                          <AssessmentCard key={index} question={data.question} answers={data.answers} />
                        ))}
                      </div>
                    ) : (
                      <EmptyComponent
                        title="Patient onboarding assessment incomplete"
                        description="The patient has not yet completed the Onboarding Assessment. They can easily complete it through the patient app. Once completed, the assessment results will be available here."
                      />
                    )}
                  </DataCard>
                )}

                {selectedTab === 1 && (
                  <DataCard className={styles['tab-panel']}>
                    <h1>Health check-in responses</h1>
                    {/* Add logic for Health check-in responses here */}
                  </DataCard>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
