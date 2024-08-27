import classNames from 'classnames';
import styles from './assessment-badge.module.scss';

export interface AssessmentBadgeProps {
    className?: string;
    text: string;
}

export const AssessmentBadge = ({ className, text }: AssessmentBadgeProps) => {
    return <div className={classNames(styles['badge-wrapper'], className)}>{text}</div>;
};
