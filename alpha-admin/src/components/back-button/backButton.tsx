// write back button code in react tsx
import React from 'react';
import styles from './backButton.module.scss'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export const BackButton = () => {
    return (
<div className={styles.backbutton}>
    <button className={styles.backButton}>
        <KeyboardArrowLeftIcon className={styles.arrowIcon} />
        Back
    </button>
</div>

    );
};
