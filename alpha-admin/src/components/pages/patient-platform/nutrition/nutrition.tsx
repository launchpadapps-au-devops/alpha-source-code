import classNames from 'classnames';
import styles from './nutrition.module.scss';
import { DataCard } from '../../../data-card/data-card';
import { EmptyComponent } from '../../../empty-state-component/empty-component';

export interface NutritionProps {
    className?: string;
}

export const Nutrition = ({ className }: NutritionProps) => {
    return (
        <div className={classNames(styles['nutrition-wrapper'], className)}>
            <h1>Nutrition</h1>
            <div className={styles['grid-layout']}>
                <DataCard>
                    <span className={styles['label-text']}>Energy</span>
                    <div className={styles['data-value']}>
                        <span>80kj</span>
                        <span>/ per day</span>
                    </div>
                </DataCard>
                <DataCard>
                    <span className={styles['label-text']}>Protein</span>
                    <div className={styles['data-value']}>
                        <span>80g</span>
                        <span>/ per day</span>
                    </div>
                </DataCard>
                <DataCard>
                    <span className={styles['label-text']}>Fats</span>
                    <div className={styles['data-value']}>
                        <span>80g</span>
                        <span>/ per day</span>
                    </div>
                </DataCard>
                <DataCard>
                    <span className={styles['label-text']}>Fats</span>
                    <div className={styles['data-value']}>
                        <span>80g</span>
                        <span>/ per day</span>
                    </div>
                </DataCard>
                <DataCard>
                    <span className={styles['label-text']}>Carbohydrate</span>
                    <div className={styles['data-value']}>
                        <span>80g</span>
                        <span>/ per day</span>
                    </div>
                </DataCard>
                <DataCard>
                    <span className={styles['label-text']}>Cholesterol</span>
                    <div className={styles['data-value']}>
                        <span>80g</span>
                        <span>/ per day</span>
                    </div>
                </DataCard>
            </div>
            {/* <EmptyComponent
                title="No nutrition data available"
                description="The patient has not yet completed any food logging.
They can easily log their food intake through the patient app. 
Once completed, the food logging will be available here."
            /> */}
        </div>
    );
};
