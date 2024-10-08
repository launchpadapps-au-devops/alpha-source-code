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
import { fetchPatientsDataByGender, fetchPatientsDataByPlan, fetchSleepDataByAgeRange } from './dashboard-components/dashboard-dropdown-patient-analytics/patient-analytics-API';
import { getLifestylePlans } from '../patient-platform/patient-lifestyle-plan/patientLifeStyleAPI';

export const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const demographicOptions = ["All", "Male", "Female", "Non-binary"];

    const [selectedGender, setSelectedGender] = useState<string>("All");
    const [genderResponse, setGenderResponse] = useState<any>(null);
    const [lifestylePlans, setLifestylePlans] = useState<any[]>([]);
    const [lifestylePlanResponse, setLifestylePlanResponse] = useState<any>(null);
    const [totalSteps, setTotalSteps] = useState<number>(0);
    const [averageSteps, setAverageSteps] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [selectedAgeRange, setSelectedAgeRange] = useState<string>("20-29");

    const { users, loading, errorMessage, count } = useSelector(
        (state: RootState) => state.activePatients.activePatients
    );
    const { data: userOverviewData } = useSelector(
        (state: RootState) => state.userDataOverview.userDataOverview
    );

    const loggedUserID = localStorage.getItem('loggedUserID');
    const FirstName = localStorage.getItem('LoggedInUserFirstName');
    
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getLifestylePlans();
                setLifestylePlans(response.data);
                // Set the first plan as default if available
                if (response.data.length > 0) {
                    setSelectedPlan(response.data[0].name);
                    handlePlanChange(response.data[0].name);
                }
            } catch (error) {
                console.error("Error fetching lifestyle plans:", error);
            }
        };
    
        fetchPlans();
    }, []);
    
    useEffect(() => {
        fetchPatientsDataByGender("All").then((data) => {
            setGenderResponse(data.data.count);
        }); 
    }, []);


    useEffect(() => {
        const data =  fetchSleepDataByAgeRange(20, 29).then((data) => {
            setTotalSteps(data.data.totalStepsInDate);
            setAverageSteps(data.data.averageStepsInDate);
        });
    }, []);


    useEffect(() => {
        if (loggedUserID) {
            dispatch(fetchUserDataOverviewThunk(loggedUserID));
        }
    }, [dispatch, loggedUserID]);

    useEffect(() => {
        dispatch(fetchActivePatientsThunk());
    }, [dispatch]);

    const handleGenderChange = async (gender: string) => {
        setSelectedGender(gender);
        try {
            const data = await fetchPatientsDataByGender(gender);
            setGenderResponse(data.data.count);
        } catch (error) {
            console.error("Error fetching data by gender:", error);
        }
    };

    const handlePlanChange = async (plan: string) => {
        setSelectedPlan(plan);
        try {
            const planId = lifestylePlans.find(p => p.name === plan)?.id;
            const data = await fetchPatientsDataByPlan(planId);
            setLifestylePlanResponse(data.data.count);
        } catch (error) {
            console.error("Error fetching data by plan:", error);
        }
    };

    const handleAgeRangeChange = async (selectedRange: string) => {
        setSelectedAgeRange(selectedRange); 
        const rangeToSend = selectedRange === "50+" ? "50-100" : selectedRange;
        const [fromAge, toAge] = rangeToSend.split('-').map(Number);
        
        try {
            const data = await fetchSleepDataByAgeRange(fromAge, toAge);
            setTotalSteps(data.data.totalStepsInDate);
            setAverageSteps(data.data.averageStepsInDate);
        } catch (error) {
            console.error("Error fetching data by age range:", error);
        }
    };
    
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
                                onSelect={handleAgeRangeChange}
                                label="Select Age Group"
                                selectedValue={selectedAgeRange}
                            />
                        </div>
                        <span className={styles['analytics-count']}>{averageSteps}</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>

                    <div className={styles['divider']}>
                        <div className={styles['line']}></div>
                    </div>

                    <DataCard className={styles['analytics-item']}>
                        <div className={styles['label-with-dropdown']}>
                            <span className={styles['analytics-label']}>Total enrolled patients</span>
                            <DropdownPatientAnalytics
                                options={demographicOptions}
                                onSelect={handleGenderChange}
                                label="Select Gender"
                                selectedValue={selectedGender}
                            />
                        </div>
                        <span className={styles['analytics-count']}>{genderResponse}</span>
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
                                options={lifestylePlans.map((plan) => plan.name)}
                                onSelect={(selectedName) => {
                                    const selectedPlan = lifestylePlans.find((plan) => plan.name === selectedName);
                                    handlePlanChange(selectedPlan ? selectedPlan.name : "");
                                }}
                                label="Select Lifestyle Plan"
                                selectedValue={selectedPlan}
                            />
                        </div>
                        <span className={styles['analytics-count']}>{lifestylePlanResponse}</span>
                    </DataCard>
                </div>
            </section>
        </main>
    );
};
