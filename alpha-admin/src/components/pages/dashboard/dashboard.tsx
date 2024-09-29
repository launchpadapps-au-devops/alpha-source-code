import classNames from 'classnames';
import styles from './dashboard.module.scss';
import { DataCard } from '../../data-card/data-card';
import { Analytics } from '@mui/icons-material';
import { LegendData } from './dashboard-components/legend-data/legend-data';
import { DoughnutChart } from './dashboard-components/legend-data/doughnutChartData';
import DashboardBarGarph from './dashboard-components/dashboard-bar-graph/dashboard-bar-garph';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchActivePatientsThunk } from './dashboard-components/activePatientsSlice';
import { useEffect, useMemo, useState } from 'react';
import { fetchUserDataOverviewThunk } from './dashboard-components/user-data-overvie-store/userDataOverviewSlice';
import { DropdownPatientAnalytics } from './dashboard-components/dashboard-dropdown-patient-analytics/patient-analytics-dashboard';

export const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const demographicOptions = ["All", "Male", "Female", "Other"];
    const [selectedDemographic, setSelectedDemographic] = useState<string>("All");
    
    const { users, loading, errorMessage, count } = useSelector(
        (state: RootState) => state.activePatients.activePatients
    );

    const { data: userOverviewData } = useSelector(
        (state: RootState) => state.userDataOverview.userDataOverview
    );

    const loggedUserID = localStorage.getItem('loggedUserID');
    const FirstName = localStorage.getItem('LoggedInUserFirstName');

    useEffect(() => {
        if (loggedUserID) {
            dispatch(fetchUserDataOverviewThunk(loggedUserID));
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchActivePatientsThunk());
    }, [dispatch]);

    const demographicChangeHandler = (option: string) => {
        setSelectedDemographic(option);
    };

    // Calculate percentages dynamically based on userOverviewData
    const legendItems = useMemo(() => {
        if (userOverviewData?.nutritionData) {
            const { protien = 0, carbs = 0, fats = 0 } = userOverviewData.nutritionData;

            const total = protien + carbs + fats;

            if (total === 0) {
                return [
                    { label: 'Fats', percentage: '0%', color: '#006FF7' },
                    { label: 'Protein', percentage: '0%', color: '#FFAC2E' },
                    { label: 'Carbohydrates', percentage: '0%', color: '#CA6B6E' },
                ];
            }

            const fatPercentage = ((fats / total) * 100).toFixed(2);
            const proteinPercentage = ((protien / total) * 100).toFixed(2);
            const carbsPercentage = ((carbs / total) * 100).toFixed(2);

            return [
                { label: 'Fats', percentage: `${fatPercentage}%`, color: '#006FF7' },
                { label: 'Protein', percentage: `${proteinPercentage}%`, color: '#FFAC2E' },
                { label: 'Carbohydrates', percentage: `${carbsPercentage}%`, color: '#CA6B6E' },
            ];
        }
        return [
            { label: 'Fats', percentage: '0%', color: '#006FF7' },
            { label: 'Protein', percentage: '0%', color: '#FFAC2E' },
            { label: 'Carbohydrates', percentage: '0%', color: '#CA6B6E' },
        ];
    }, [userOverviewData]);

    return (
        <main className={classNames(styles['container'], styles['dashboard-block'])}>
            <h1>Hi {FirstName}!</h1>
            <section className={styles['dashboard-graph-section']}>
                <div className={styles['graph-block']}>
                    <label>Food logged</label>
                    <DataCard className={classNames(styles['graph-card'], styles['doughnut-card'])}>
                        <div className={styles['min-height']}>
                            <DoughnutChart
                                legendItems={legendItems}
                                emptyDoughnut={{
                                    color: 'rgba(0, 0, 0, 0.08)',
                                    width: 1,
                                    radiusDecrease: 20,
                                }}
                            />
                        </div>

                        <LegendData data={legendItems} />
                    </DataCard>
                </div>
                <div className={styles['graph-block']}>
                    <label>Total active patients in age group</label>
                    <DataCard className={classNames(styles['graph-card'])}>
                        <div className={styles['min-height']}>
                            <DashboardBarGarph users={users} count={count} />
                        </div>
                    </DataCard>
                </div>
            </section>
            <section className={styles['analytics-block']}>
                <label>Patient analytics</label>
                <div className={styles['analytics-wrapper']}>
                    <DataCard className={styles['analytics-item']}>
                        <div className={styles['label-with-dropdown']}>
                            <span className={styles['analytics-label']}>Average steps per day</span>
                            <DropdownPatientAnalytics
                                options={["20-29", "30-39", "40-49", "50+"]}
                                onSelect={demographicChangeHandler}
                                label="Select Age Group"
                            />
                        </div>
                        <span className={styles['analytics-count']}>2933</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>

                    <div className={styles['divider']}>
                        <div className={styles['line']}></div>
                    </div>

                    <DataCard className={styles['analytics-item']}>
                        <div className={styles['label-with-dropdown']}>
                            <span className={styles['analytics-label']}>Total enrolled patients</span>
                            <DropdownPatientAnalytics
                                options={["Male", "Female", "Non-binary"]}
                                onSelect={demographicChangeHandler}
                                label="Select Gender"
                            />
                        </div>
                        <span className={styles['analytics-count']}>336</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>

                    <div className={styles['divider']}>
                        <div className={styles['line']}></div>
                    </div>

                    <DataCard className={styles['analytics-item']}>
                        <div className={styles['label-with-dropdown']}>
                            <span className={styles['analytics-label']}>
                                Patients per lifestyle plan
                            </span>
                            <DropdownPatientAnalytics
                                options={["Heart Health", "Wealth", "Weight Health"]}
                                onSelect={demographicChangeHandler}
                                label="Select Lifestyle Plan"
                            />
                        </div>
                        <span className={styles['analytics-count']}>234</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>
                </div>
            </section>
        </main>
    );
};
