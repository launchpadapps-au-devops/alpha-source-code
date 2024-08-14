import React from 'react';
import styles from './lifestyle-information.module.scss';

type LifestyleInformationProps = {
    plan: any;
    setPlan: any;
};

const LifestyleInformation: React.FC<LifestyleInformationProps> = ({ plan, setPlan }) => {
    console.log('plan', plan);
    return (
        <div className={styles.LifestyleInformation}>
            <div className={styles.themeHeader}>
                <h2>Plan information</h2>
            </div>
            <div className={styles.themeDetails}>
                <div className={`${styles.themeItem} ${styles.levelCategory}`}>
                    <div className={styles.levelItem}>
                        <div className={styles.themeValue}>
                            <label>Plan name</label>
                            {plan.name}
                        </div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.themeValue}>
                            <label>Duration</label>
                            90 days
                        </div>
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Plan description</label>
                        {plan.description}
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Internal notes</label>
                        {plan.internalNotes}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LifestyleInformation;
