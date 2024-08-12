import React from 'react';
import styles from './theme-information.module.scss';
import MenuBookIcon from '@mui/icons-material/MenuBook';

type ThemeInformationProps = {
  themeLevel: string;
  category: string;
  themeName: string;
  themeDescription: string;
  internalNotes: string;
};

const ThemeInformation: React.FC<ThemeInformationProps> = ({
  themeLevel,
  category,
  themeName,
  themeDescription,
  internalNotes,
}) => {
  return (
    <div className={styles.themeInformation}>
      <div className={styles.themeHeader}>
        <MenuBookIcon className={styles.menuBookIcon} />
        <h2>Theme information</h2>
      </div>
      <div className={styles.themeDetails}>
        <div className={`${styles.themeItem} ${styles.levelCategory}`}>
          <div className={styles.levelItem}>
            <div className={styles.themeValue}><label>Theme level</label>{themeLevel}</div>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.themeValue}><label>Category</label>{category}</div>
          </div>
        </div>
        <div className={`${styles.themeItem} ${styles.fullWidth}`}>
          <div className={styles.themeValue}><label>Theme name</label>{themeName}</div>
        </div>
        <div className={`${styles.themeItem} ${styles.fullWidth}`}>
          <div className={styles.themeValue}><label>Theme description</label>{themeDescription}</div>
        </div>
        <div className={`${styles.themeItem} ${styles.fullWidth}`}>
          <div className={styles.themeValue}><label>Internal notes</label>{internalNotes}</div>
        </div>
      </div>
    </div>
  );
};

export default ThemeInformation;
