import React from 'react';
import styles from './theme-information.module.scss';
import MenuBookIcon from '@mui/icons-material/MenuBook';

type ThemeInformationProps = {
    theme: any;
};

const ThemeInformation: React.FC<ThemeInformationProps> = ({ theme }) => {
    const {
        name: themeName,
        description: themeDescription,
        internalNotes,
        category,
        level: themeLevel,
    } = theme;

    return (
        <div className={styles.themeInformation}>
            <div className={styles.themeHeader}>
                <MenuBookIcon className={styles.menuBookIcon} />
                <h2>Theme information</h2>
            </div>
            <div className={styles.themeDetails}>
                <div className={`${styles.themeItem} ${styles.levelCategory}`}>
                    <div className={styles.levelItem}>
                        <div className={styles.themeValue}>
                            <label>Theme level</label>
                            {themeLevel || 'N/A'}
                        </div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.themeValue}>
                            <label>Category</label>
                            {category?.name || 'N/A'}
                        </div>
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Theme name</label>
                        {themeName || 'N/A'}
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Theme description</label>
                        {themeDescription || 'N/A'}
                    </div>
                </div>
                <div className={`${styles.themeItem} ${styles.fullWidth}`}>
                    <div className={styles.themeValue}>
                        <label>Internal notes</label>
                        {internalNotes || 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeInformation;
