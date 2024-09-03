import classNames from 'classnames';
import styles from './progress-bar-layout.module.scss';

export interface ProgressBarLayoutProps {
    className?: string;
    progressPercentage: number;
}

export const ProgressBarLayout = ({
    className,
    progressPercentage = 0,
}: ProgressBarLayoutProps) => {
    return (
        <div className={classNames(styles['progress-bar'], className)}>
            <div className={styles['progress-outer-block']}>
                <div
                    className={styles['filled-progress']}
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <span>{`${progressPercentage}%`}</span>
        </div>
    );
};
