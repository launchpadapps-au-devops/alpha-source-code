import styles from './newLifestyle.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useState } from 'react';
import { Vector } from '../../../../../icon/glyps/vector';
import { useAppDispatch } from '../../../../../../app/hooks';
import { addPlanThunk } from '../../lifeStyleSlice';

export interface NewLifestyleProps {
    className?: string;
    internalNotes: string;
    setInternalNotes: any;
    planName: string;
    setPlanName: any;
    planDescription: string;
    setPlanDescription: any;
}

export const NewLifestyle = ({
    className,
    internalNotes,
    setInternalNotes,
    planName,
    setPlanName,
    planDescription,
    setPlanDescription,
}: NewLifestyleProps) => {
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
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
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
                        value={planDescription}
                        onChange={(e) => setPlanDescription(e.target.value)}
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
