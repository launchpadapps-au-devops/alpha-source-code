import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './patient-dashboard.module.scss';
import Avatar from '@mui/material/Avatar';
import { getInitials } from '../../../utils/get-intial-name';
import { Divider } from '../../../top-navigation/navigation-component/divider/divider';
import { ProgressBarLayout } from './patient-dashboard-components/progess-bar-layout/progress-bar-layout';
import { Badge } from '../../../badge/badge';
import { EmptyComponent } from '../../../empty-state-component/empty-component';
import { DataCard } from '../../../data-card/data-card';
import { ActivityChart } from '../activity/activity-bar-chart/activity-chart-';
import { SidebarPatient } from '../../patient-Management/patient-sidebar/patientSidebar';

// Define a type for the keys of motivationsData
type MotivationLevel =
    | 'Very unmotivated'
    | 'Somewhat unmotivated'
    | 'Neutral'
    | 'Somewhat motivated'
    | 'Very motivated';

export interface PatientDashboardProps {
    className?: string;
}

// Example motivationsData, you can replace this with data coming from props or an API
const motivationsData: Record<MotivationLevel, string[]> = {
    'Very unmotivated': [
        'I have no interest in changing my habits.',
        'I am satisfied with my current lifestyle.',
    ],
    'Somewhat unmotivated': [
        'I recognize the need for change but lack motivation.',
        'I find it hard to commit to new routines.',
    ],
    Neutral: [
        'I am open to making changes but not actively seeking them.',
        'I am not against change but need a push.',
    ],
    'Somewhat motivated': [
        'I am starting to see the benefits of change.',
        'I have begun taking small steps towards improvement.',
    ],
    'Very motivated': [
        'I am determined to make significant changes.',
        'I am fully committed to improving my health and lifestyle.',
    ],
};

export const PatientDashboard = ({ className }: PatientDashboardProps) => {
    const [selectedMotivation, setSelectedMotivation] = useState<MotivationLevel | null>(
        'Very unmotivated'
    );

    useEffect(() => {
        if (Object.keys(motivationsData).length === 0) {
            setSelectedMotivation(null);
        }
    }, []);

    const handleBadgeClick = (badgeTest: MotivationLevel) => {
        setSelectedMotivation(badgeTest);
    };

    const hasMotivations = Object.keys(motivationsData).length > 0;

    return (
        <>
        <SidebarPatient/>
        <div className={classNames(styles['patient-dashboard'], className)}>
            <h1>Patient dashboard</h1>
            <div className={styles['patient-flex-layout']}>
                <div className={styles['left-block']}>
                    <div className={styles['profile-block']}>
                        <Avatar
                            sx={{ width: 96, height: 96 }}
                            alt="Nahid Hasan"
                            src=""
                            aria-haspopup="true"
                            className={styles['profile-image-wrapper']}
                        >
                            {getInitials('Nahid Hasan')}
                        </Avatar>

                        <span className={styles['name-text']}>Nahid Hasan</span>
                        <div className={styles['group-text']}>
                            <span>Male </span>
                            <span>37 years 03 months</span>
                        </div>
                        <div className={styles['group-text']}>
                            <span>Heart Health Plan</span>
                            <span>Since April 2024</span>
                        </div>
                    </div>
                    <Divider />
                    <div className={styles['profile-footer']}>
                        <div className={styles['label-group']}>
                            <span>Height</span>
                            <span>170cm</span>
                        </div>
                        <div className={styles['label-group']}>
                            <span>Weight</span>
                            <span>75kg</span>
                        </div>
                        <div className={styles['label-group']}>
                            <span>BMI</span>
                            <span>25.95</span>
                        </div>
                    </div>
                </div>
                <div className={styles['right-block']}>
                    <div className={classNames(styles['content-block'], styles['flex-horizontal'])}>
                        <h2 className={styles['header-text']}>Progress through plan</h2>
                        <ProgressBarLayout progressPercentage={50} />
                    </div>
                    <div className={classNames(styles['content-block'], styles['flex-verticle'])}>
                        <h2 className={styles['header-text']}>Motivations</h2>
                        {hasMotivations ? (
                            <>
                                <div className={styles['badges-wrapper']}>
                                    {Object.keys(motivationsData).map((motivation) => (
                                        <Badge
                                            key={motivation}
                                            badgeTest={motivation}
                                            isActive={selectedMotivation === motivation}
                                            onClick={() =>
                                                handleBadgeClick(motivation as MotivationLevel)
                                            }
                                        />
                                    ))}
                                </div>
                                {selectedMotivation &&
                                motivationsData[selectedMotivation]?.length > 0 ? (
                                    <div className={styles['motivation-list']}>
                                        <ul>
                                            {motivationsData[selectedMotivation].map(
                                                (detail, index) => (
                                                    <li key={index}>{detail}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <div>No data available</div>
                                )}
                            </>
                        ) : (
                            <div>No data available</div>
                        )}
                    </div>
                    {/* ACTIVITY */}
                    <div
                        className={classNames(
                            styles['content-block'],
                            styles['flex-verticle'],
                            styles['activity-wrapper']
                        )}
                    >
                        <h2 className={styles['header-text']}>Activity</h2>
                        {/* <EmptyComponent
                            title="No data available"
                            description="Check back later for updates or start adding data to populate the dashboard."
                        /> */}
                        <ActivityChart />
                    </div>
                </div>
            </div>
            <div className={styles['data-list-grid']}>
                <DataCard>
                    <div className={styles['flex-row']}>
                        <div className={styles['circular-wrapper']}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="29"
                                height="28"
                                viewBox="0 0 29 28"
                                fill="none"
                            >
                                <path
                                    d="M19.167 7.58268L18.6537 8.22435C18.1637 8.83102 17.5103 9.09935 16.857 9.09935C15.667 9.09935 14.5003 8.18935 14.5003 6.76602V2.91602C14.5003 2.91602 5.16699 7.58268 5.16699 15.7493C5.16699 20.906 9.34366 25.0827 14.5003 25.0827C19.657 25.0827 23.8337 20.906 23.8337 15.7493C23.8337 12.296 21.9553 9.19268 19.167 7.58268ZM14.5003 22.7493C13.217 22.7493 12.167 21.7344 12.167 20.486C12.167 19.891 12.4003 19.331 12.8437 18.8994L14.5003 17.266L16.1687 18.8994C16.6003 19.331 16.8337 19.891 16.8337 20.486C16.8337 21.7344 15.7837 22.7493 14.5003 22.7493ZM19.1203 20.9993C19.167 20.5793 19.377 18.7943 17.802 17.2427L14.5003 13.9993L11.1987 17.2427C9.61199 18.806 9.83366 20.6027 9.88033 20.9993C8.42199 19.716 7.50033 17.8377 7.50033 15.7493C7.50033 12.0627 9.98533 9.15768 12.202 7.29102C12.4703 9.61268 14.4537 11.4327 16.857 11.4327C17.767 11.4327 18.6537 11.1643 19.4003 10.6627C20.7303 11.9927 21.5003 13.8243 21.5003 15.7493C21.5003 17.8377 20.5787 19.716 19.1203 20.9993Z"
                                    fill="#146CFD"
                                />
                            </svg>
                        </div>
                        <span className={styles['header-text']}>Calories consumed</span>
                    </div>
                    <div className={styles['data-value']}>
                        <span>80</span>
                        <span>ave / per day</span>
                    </div>
                </DataCard>
                <DataCard>
                    <div className={styles['flex-row']}>
                        <div className={styles['circular-wrapper']}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="29"
                                height="28"
                                viewBox="0 0 29 28"
                                fill="none"
                            >
                                <path
                                    d="M17.4167 4.66732C17.8133 4.66732 18.21 4.69065 18.595 4.74898C16.3667 7.26898 15.0833 10.559 15.0833 14.0007C15.0833 17.4423 16.3667 20.7323 18.595 23.2523C18.21 23.3106 17.8133 23.334 17.4167 23.334C12.2717 23.334 8.08333 19.1457 8.08333 14.0007C8.08333 8.85565 12.2717 4.66732 17.4167 4.66732ZM17.4167 2.33398C10.9767 2.33398 5.75 7.56065 5.75 14.0007C5.75 20.4407 10.9767 25.6673 17.4167 25.6673C19.54 25.6673 21.535 25.084 23.25 24.0923C19.7617 22.074 17.4167 18.3173 17.4167 14.0007C17.4167 9.68398 19.7617 5.92732 23.25 3.90898C21.535 2.91732 19.54 2.33398 17.4167 2.33398Z"
                                    fill="#146CFD"
                                />
                            </svg>
                        </div>
                        <span className={styles['header-text']}>Sleep</span>
                    </div>
                    <div className={styles['data-value']}>
                        <span>80</span>
                        <span>ave / per day</span>
                    </div>
                </DataCard>
            </div>
        </div>
        </>
    );
};
