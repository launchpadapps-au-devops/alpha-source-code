import classNames from 'classnames';
import styles from './sleep-analysis.module.scss';
import { EmptyComponent } from '../../../empty-state-component/empty-component';
import { useState } from 'react';

export interface SleepAnalysisProps {
    className?: string;
}

export const SleepAnalysis = ({ className }: SleepAnalysisProps) => {
    const [isComingSoon, setIsComingSoon] = useState(false);

    const title = isComingSoon ? 'Coming Soon' : 'No sleep analysis data available';
    const description = isComingSoon
        ? "We're working hard to bring you exciting new features in our next release. Stay tuned for updates!"
        : 'The patient has not yet completed any sleep logging. They can easily log their sleep patterns through the patient app. Once completed, the sleep analysis data will be available here.';

    return (
        <div className={classNames(styles['sleep-analysis-wrapper'], className)}>
            <h1>Sleep analysis</h1>
            <EmptyComponent title={title} description={description} isComingSoon={isComingSoon} />
        </div>
    );
};
