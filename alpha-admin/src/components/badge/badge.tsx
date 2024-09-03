import classNames from 'classnames';
import styles from './badge.module.scss';

export interface BadgeProps {
    className?: string;
    badgeTest?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const Badge = ({ className, badgeTest, isActive = false, onClick }: BadgeProps) => {
    return (
        <div
            className={classNames(
                styles['badge-wrapper'],
                { [styles.active]: isActive },
                className
            )}
            onClick={onClick}
        >
            {badgeTest}
        </div>
    );
};
