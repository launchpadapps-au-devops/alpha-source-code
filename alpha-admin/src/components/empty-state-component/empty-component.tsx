import classNames from 'classnames';
import styles from './empty-componet.module.scss';

export interface EmptyComponentProps {
    className?: string;
    title?: string;
    description?: string;
    isComingSoon?: boolean;
}

export const EmptyComponent = ({
    className,
    title,
    description,
    isComingSoon = false,
}: EmptyComponentProps) => {
    return (
        <div className={classNames(styles['empty-charts-wrapper'], className)}>
            {!isComingSoon && (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="48" height="48" rx="24" fill="#E6F7FD" />
                    <path d="M20 21H16V32H20V21Z" fill="#146CFD" />
                    <path d="M32 25H28V32H32V25Z" fill="#146CFD" />
                    <path d="M26 16H22V32H26V16Z" fill="#146CFD" />
                </svg>
            )}
            {isComingSoon && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                        fill="#146CFD"
                    />
                </svg>
            )}
            <span>{title}</span>
            <p>{description}</p>
        </div>
    );
};
