import classNames from 'classnames';
import styles from './assessments.module.scss';
import TabBar from '../../content/content-components/tab-bar/TabBar';
import { useState } from 'react';
import { DataCard } from '../../../data-card/data-card';
import { AssessmentCard } from './assessments-components/assestment-card/assessment-card';
import { EmptyComponent } from '../../../empty-state-component/empty-component';

export interface AssessmentsProps {
    className?: string;
}

interface AssessmentData {
    question: string;
    answers: string[];
}

export const Assessments = ({ className }: AssessmentsProps) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const tabs = ['Onboarding assessment', 'Health check-in responses'];

    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };

    const onboardingData: AssessmentData[] = [
        {
            question: 'Preferred name',
            answers: ['Sunnery'],
        },
        {
            question: 'What is your ethnic background?',
            answers: ['Chinese'],
        },
        {
            question:
                'If you had a spare moment and all the chores are done, what would you be doing?',
            answers: ['Cooking up a storm', 'Hanging out with my kids', 'Watching TV'],
        },
        {
            question: 'Do you have any dietary restrictions?',
            answers: ['Dairy intolerant or allergic', 'Egg allergy', 'Vegetarian'],
        },
        {
            question: 'Are you limited by lack of mobility or injury?',
            answers: ['Moderately'],
        },
        {
            question: 'Select the parts of your body that are affected by injury.',
            answers: ['Neck', 'Back'],
        },
    ];

    const healthCheckIn: AssessmentData[] = [
        // {
        //     question: 'Question 1',
        //     answers: ['Bowl cancer risk assessment'],
        // },
        // {
        //     question: 'Question 2',
        //     answers: ['WHO5'],
        // },
        // {
        //     question: 'Question 3',
        //     answers: ['AUSDRICK', 'Heart health check'],
        // },
    ];

    const onbordingIncomplete = onboardingData.length === 0 && healthCheckIn.length === 0;
    return (
        <div className={classNames(styles['assessment-wrapper'], className)}>
            {onbordingIncomplete ? (
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
                                        <AssessmentCard
                                            key={index}
                                            question={data.question}
                                            answers={data.answers}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyComponent
                                    title="Patient onboarding assessment incomplete"
                                    description="The patient has not yet completed the Onboarding Assessment. 
                                They can easily complete it through the patient app. 
                                Once completed, the assessment results will be available here."
                                />
                            )}
                        </DataCard>
                    )}

                    {selectedTab === 1 && (
                        <DataCard className={styles['tab-panel']}>
                            <h1>Health check-in responses</h1>
                            {healthCheckIn.length > 0 ? (
                                <div className={styles['assessment-list']}>
                                    {healthCheckIn.map((data, index) => (
                                        <AssessmentCard
                                            key={index}
                                            question={data.question}
                                            answers={data.answers}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyComponent
                                    title="Health check-in responses incomplete"
                                    description="The patient has not yet completed their Health check-in responses.
                                They can easily complete it through the patient app. 
                                Once completed, the assessment results will be available here."
                                />
                            )}
                        </DataCard>
                    )}
                </>
            )}
        </div>
    );
};
