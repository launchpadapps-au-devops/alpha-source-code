import classNames from 'classnames';
import styles from './activity.module.scss';
import { DataCard } from '../../../data-card/data-card';
import { EmptyComponent } from '../../../empty-state-component/empty-component';
import { useState } from 'react';

export interface ActivityProps {
    className?: string;
}

export const Activity = ({ className }: ActivityProps) => {
    const [isComingSoon, setIsComingSoon] = useState(false);

    const title = isComingSoon ? 'Coming Soon' : 'No activity data available';
    const description = isComingSoon
        ? "We're working hard to bring you exciting new features in our next release. Stay tuned for updates!"
        : 'The patient has not yet completed activity. Once they begin activity, the data will be available here.';

    return (
        <div className={classNames(styles['activity-wrapper'], className)}>
            <h1>Activity</h1>
            <EmptyComponent title={title} description={description} isComingSoon={isComingSoon} />
        </div>
    );
};
