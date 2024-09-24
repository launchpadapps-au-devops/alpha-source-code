import React from 'react';
import styles from './backButtonPatient.module.scss';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface BackButtonPatientProps {
    onClick?: () => void;  // Optional click handler
}

export const BackButtonPatient = ({ onClick }: BackButtonPatientProps) => {
    const defaultClick = () => {
        window.history.back();
    };

    const handleClick = onClick || defaultClick; // Use provided onClick, otherwise go back in history

    return (
        <div className={styles.backbutton}>
            <button className={styles.backButton} onClick={handleClick}>
                <KeyboardArrowLeftIcon className={styles.arrowIcon} />
                Back
            </button>
        </div>
    );
};
