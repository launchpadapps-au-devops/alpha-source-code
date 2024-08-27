import classNames from 'classnames';
import styles from './data-card.module.scss';
import React from 'react';

export interface DataCardProps {
    className?: string;
    children?: React.ReactNode;
}

export const DataCard = ({ className, children }: DataCardProps) => {
    return <div className={classNames(styles['data-card'], className)}>{children}</div>;
};
