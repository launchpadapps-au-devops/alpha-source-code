import classNames from 'classnames';
import styles from './in-progress-plan.module.scss';
import { ProgressBarLayout } from '../../../patient-dashboard/patient-dashboard-components/progess-bar-layout/progress-bar-layout';
import { DataCard } from '../../../../../data-card/data-card';

export interface InProgressProps {
    className?: string;
}

export const InProgress = ({ className }: InProgressProps) => {
    return (
        <div className={classNames(styles['in-progress-wrapper'], className)}>
            <div className={classNames(styles['content-block'], styles['flex-horizontal'])}>
                <h2 className={styles['header-text']}>Progress through plan</h2>
                <ProgressBarLayout
                    progressPercentage={50}
                    className={styles['progress-bar-width']}
                />
            </div>
            <DataCard className={styles['in-progress-item']}>
                <div className={styles['item-header-block']}>
                    <div className={styles['icon-wrap']}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="29"
                            height="29"
                            viewBox="0 0 29 29"
                            fill="none"
                        >
                            <path
                                d="M18.583 13.334C19.5495 13.334 20.333 12.5505 20.333 11.584C20.333 10.6175 19.5495 9.83398 18.583 9.83398C17.6165 9.83398 16.833 10.6175 16.833 11.584C16.833 12.5505 17.6165 13.334 18.583 13.334Z"
                                fill="#146CFD"
                            />
                            <path
                                d="M10.4163 13.334C11.3828 13.334 12.1663 12.5505 12.1663 11.584C12.1663 10.6175 11.3828 9.83398 10.4163 9.83398C9.44984 9.83398 8.66634 10.6175 8.66634 11.584C8.66634 12.5505 9.44984 13.334 10.4163 13.334Z"
                                fill="#146CFD"
                            />
                            <path
                                d="M14.4997 19.1673C12.773 19.1673 11.2913 18.2223 10.4747 16.834H8.52634C9.45967 19.2257 11.7813 20.9173 14.4997 20.9173C17.218 20.9173 19.5397 19.2257 20.473 16.834H18.5247C17.7197 18.2223 16.2263 19.1673 14.4997 19.1673ZM14.488 2.83398C8.04801 2.83398 2.83301 8.06065 2.83301 14.5007C2.83301 20.9407 8.04801 26.1673 14.488 26.1673C20.9397 26.1673 26.1663 20.9407 26.1663 14.5007C26.1663 8.06065 20.9397 2.83398 14.488 2.83398ZM14.4997 23.834C9.34301 23.834 5.16634 19.6573 5.16634 14.5007C5.16634 9.34398 9.34301 5.16732 14.4997 5.16732C19.6563 5.16732 23.833 9.34398 23.833 14.5007C23.833 19.6573 19.6563 23.834 14.4997 23.834Z"
                                fill="#146CFD"
                            />
                        </svg>
                    </div>
                    <span>The Healthy Lifestyle Plan</span>
                </div>
                <p>
                    The healthy lifestyle plan focuses on holistic wellness, emphasising balanced
                    nutrition, regular physical activity, adequate sleep, and stress management
                    techniques.
                </p>
            </DataCard>
        </div>
    );
};
