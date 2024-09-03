// write back button code in react tsx
import React from 'react';
import styles from './backButton.module.scss'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
<div className={styles.backbutton}>
    <button className={styles.backButton} onClick={onClick}>
        <KeyboardArrowLeftIcon className={styles.arrowIcon} />
        Back
    </button>
</div>

    );
};
