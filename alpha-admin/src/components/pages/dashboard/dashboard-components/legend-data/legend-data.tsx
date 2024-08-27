import classNames from 'classnames';
import styles from './legend-data.module.scss';
export interface LegendItem {
    label: string;
    percentage: string;
    color: string;
}

export interface LegendDataProps {
    className?: string;
    data: LegendItem[];
}

export const LegendData = ({ className, data }: LegendDataProps) => {
    return (
        <div className={classNames(styles['legends-data'], className)}>
            {data.map((item, index) => (
                <div key={index} className={styles['legend-item']}>
                    <div
                        className={styles['ellipse']}
                        style={{ backgroundColor: item.color }}
                    ></div>
                    <div className={styles['label-wrap']}>
                        <span>{item.label}</span>
                        <span>{item.percentage}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
