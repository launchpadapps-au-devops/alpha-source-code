import classNames from 'classnames';
import styles from './data-card.module.scss';
import React from 'react';

export interface DataCardProps {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

export const DataCard = ({ className, children, onClick }: DataCardProps) => {
    return (
        <div
            className={classNames(styles['data-card'], className)}
            onClick={onClick} // Ensure onClick is passed to the div
            style={{ cursor: onClick ? 'pointer' : 'default' }} // Change cursor when onClick exists
        >
            {children}
        </div>
    );
};
