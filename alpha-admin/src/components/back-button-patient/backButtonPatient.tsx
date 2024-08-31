// write back button code in react tsx
import React from 'react';
import styles from './backButtonPatient.module.scss';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export const BackButtonPatient = () => {
    const handleClick = () => {
        window.history.back();
    };

    return (
        <div className={styles.backbutton}>
            <button className={styles.backButton} onClick={handleClick}>
                <KeyboardArrowLeftIcon className={styles.arrowIcon} />
                Back
            </button>
        </div>
    );
};
