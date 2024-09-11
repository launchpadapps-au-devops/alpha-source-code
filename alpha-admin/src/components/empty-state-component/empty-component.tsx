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
                               <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <rect width="60" height="60" rx="30" fill="#E6F7FD"/>
                               <path d="M29 33H31V35H29V33ZM29 25H31V31H29V25ZM29.99 20C24.47 20 20 24.48 20 30C20 35.52 24.47 40 29.99 40C35.52 40 40 35.52 40 30C40 24.48 35.52 20 29.99 20ZM30 38C25.58 38 22 34.42 22 30C22 25.58 25.58 22 30 22C34.42 22 38 25.58 38 30C38 34.42 34.42 38 30 38Z" fill="#146CFD"/>
                               </svg>
            )}
            <span>{title}</span>
            <p>{description}</p>
        </div>
    );
};
