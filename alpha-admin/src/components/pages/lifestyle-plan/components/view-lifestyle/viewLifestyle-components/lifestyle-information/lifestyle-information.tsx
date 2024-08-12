import React from 'react';
import styles from './lifestyle-information.module.scss';

type LifestyleInformationProps = {
    planName: string;
    planDuration: string;
    planDescription: string;
    internalNotes: string;
};

const LifestyleInformation: React.FC<LifestyleInformationProps> = ({
    planName,
    planDuration,
    planDescription,
    internalNotes,
}) => {
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
                            {planName}
                        </div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.themeValue}>
                            <label>Duration</label>
                            {planDuration}
                        </div>
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Plan description</label>
                        {planDescription}
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Internal notes</label>
                        {internalNotes}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LifestyleInformation;
