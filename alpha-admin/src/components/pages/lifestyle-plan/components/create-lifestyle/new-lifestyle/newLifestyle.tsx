import styles from './newLifestyle.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useState } from 'react';
import { Vector } from '../../../../../icon/glyps/vector';

export interface NewLifestyleProps {
    className?: string;
}

export const NewLifestyle = ({ className }: NewLifestyleProps) => {
    const [internalNotes, setInternalNotes] = useState('');
    const [themeName, setThemeName] = useState('');
    const [themeDescription, setThemeDescription] = useState('');

    return (
        <div className={styles.container}>
            <h3>
                Lifestyle plan details <Vector />
            </h3>
            <div className={styles['section-container']}>
                <div className={styles.section}>
                    <label className={styles.label} htmlFor="themeName">
                        Plan name
                    </label>
                    <input
                        id="themeName"
                        className={styles.input}
                        type="text"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="Enter the plan name"
                    />
                </div>
                <div className={styles.section}>
                    <label className={styles.label} htmlFor="themeDescription">
                        Plan description
                    </label>
                    <textarea
                        id="themeDescription"
                        className={styles.textarea}
                        value={themeDescription}
                        onChange={(e) => setThemeDescription(e.target.value)}
                        placeholder="Enter the Plan description "
                    />
                </div>
            </div>
            <div className={styles.section}>
                <h3>
                    Internal notes <Vector />
                </h3>
                <label className={styles.label} htmlFor="internalNotes">
                    Internal notes
                </label>
                <textarea
                    id="internalNotes"
                    className={styles.textarea}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="This lesson will be great for anyone on the heart health plan."
                />
            </div>
        </div>
    );
};
