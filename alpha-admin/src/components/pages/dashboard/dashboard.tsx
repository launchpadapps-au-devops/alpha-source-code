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
import { useEffect } from 'react';

export const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, errorMessage, count } = useSelector(
        (state: RootState) => state.activePatients.activePatients
    );

    useEffect(() => {
        dispatch(fetchActivePatientsThunk());
    }, [dispatch]);

    const legendItems = [
        { label: 'Fats', percentage: '63.2%', color: '#006FF7' },
        { label: 'Protein', percentage: '36.8%', color: '#FFAC2E' },
        { label: 'Carbohydrates', percentage: '36.8%', color: '#CA6B6E' },
    ];

    console.log(count);

    return (
        <main className={classNames(styles['container'], styles['dashboard-block'])}>
            <h1>Hi [insert name]!</h1>
            <section className={styles['dashboard-graph-section']}>
                <div className={styles['graph-block']}>
                    <label>Food logged</label>
                    <DataCard className={classNames(styles['graph-card'], styles['doughnut-card'])}>
                        <div className={styles['min-height']}>
                            <DoughnutChart legendItems={legendItems} />
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
                        <span className={styles['analytics-label']}>Average steps per day</span>
                        <span className={styles['analytics-count']}>2933</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>
                    <div className={styles['divider']}>
                        <div className={styles['line']}></div>
                    </div>

                    <DataCard className={styles['analytics-item']}>
                        <span className={styles['analytics-label']}>Total enrolled patients</span>
                        <span className={styles['analytics-count']}>336</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>
                    <div className={styles['divider']}>
                        <div className={styles['line']}></div>
                    </div>
                    <DataCard className={styles['analytics-item']}>
                        <span className={styles['analytics-label']}>
                            Patients per lifestyle plan
                        </span>
                        <span className={styles['analytics-count']}>234</span>
                        <span className={styles['assigned-by']}>by demographic</span>
                    </DataCard>
                </div>
            </section>
        </main>
    );
};
