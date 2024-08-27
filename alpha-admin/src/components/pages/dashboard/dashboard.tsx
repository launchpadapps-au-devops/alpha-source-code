import classNames from 'classnames';
import styles from './dashboard.module.scss';
import { DataCard } from '../../data-card/data-card';
import { Analytics } from '@mui/icons-material';
import { LegendData } from './dashboard-components/legend-data/legend-data';
import { DoughnutChart } from './dashboard-components/legend-data/doughnutChartData';
import DashboardBarGarph from './dashboard-components/dashboard-bar-graph/dashboard-bar-garph';

export const Dashboard: React.FC = () => {
    const legendItems = [
        { label: 'Fats', percentage: '63.2%', color: '#006FF7' },
        { label: 'Protein', percentage: '36.8%', color: '#FFAC2E' },
        { label: 'Carbohydrates', percentage: '36.8%', color: '#CA6B6E' },
    ];

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
                            <DashboardBarGarph />
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
