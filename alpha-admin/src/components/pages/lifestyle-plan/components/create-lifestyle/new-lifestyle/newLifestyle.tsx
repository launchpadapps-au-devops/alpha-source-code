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
    errors: any;
    setErrors: (errors: any) => void;
}

export const NewLifestyle = ({
    className,
    internalNotes,
    setInternalNotes,
    planName,
    setPlanName,
    planDescription,
    setPlanDescription,
    errors,
    setErrors,
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
                        className= {`${styles.input} ${errors.planName ? styles.errorBorder : ''}`}
                        type="text"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="Enter the plan name"
                        required
                    />
                    {errors.planName && <span className={styles.errorText}>{errors.planName}</span>}
                </div>
                <div className={styles.section}>
                    <label className={styles.label} htmlFor="themeDescription">
                        Plan description
                    </label>
                    <input
                        id="themeDescription"
                        type="text"
                        className={`${styles.textarea} ${errors.planDescription ? styles.errorBorder : ''}`}
                        value={planDescription}
                        onChange={(e) => setPlanDescription(e.target.value)}
                        placeholder="Enter the Plan description "
                        required
                    />
                    {errors.planDescription && 
                        <span className={styles.errorText}>{errors.planDescription}</span>}
                </div>
            </div>
            <div className={styles.section}>
                <h3>
                    Internal notes <Vector />
                </h3>
                <label className={styles.label} htmlFor="internalNotes">
                    Internal notes
                </label>
                <input
                    id="internalNotes"
                    type="text"
                    className={`${styles.textarea} ${errors.internalNotes ? styles.errorBorder : ''}`}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="This lesson will be great for anyone on the heart health plan."
                    required
                />
                {errors.internalNotes && 
                    <span className={styles.errorText}>{errors.internalNotes}</span>}
            </div>
        </div>
    );
};
