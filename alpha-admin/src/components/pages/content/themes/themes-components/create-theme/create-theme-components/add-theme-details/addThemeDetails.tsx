import React, { FC, useRef, useEffect, useState } from 'react';
import styles from './addThemeDetails.module.scss';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import { useNavigate } from 'react-router-dom';
import Habit from '../habit/habit';
import { DeleteButton } from '../../../../../content-components/delete-button/delete-button';
import { Vector } from '../../../../../../../icon/glyps/vector';

interface AddThemeDetailsProps {
    category: string;
    data: any;
    setData: any;
}

export const AddThemeDetails: FC<AddThemeDetailsProps> = ({ category, data, setData }) => {
    return (
        <div className={styles.container}>
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
                    className={styles.textarea}
                    value={data.themeData.internalNotes}
                    onChange={(e) => {
                        setData({
                            ...data,
                            themeData: { ...data.themeData, internalNotes: e.target.value },
                        });
                    }}
                    placeholder="This lesson will be great for anyone on the heart health plan."
                />
            </div>
            <div className={styles.section}>
                <h3>
                    Theme details <Vector />
                </h3>
                <label className={styles.label} htmlFor="themeName">
                    Theme name
                </label>
                <input
                    id="themeName"
                    className={styles.input}
                    type="text"
                    value={data.themeData.name}
                    onChange={(e) => {
                        setData({
                            ...data,
                            themeData: { ...data.themeData, name: e.target.value },
                        });
                    }}
                    placeholder="Enter the theme name"
                    required
                />
            </div>
            <div className={styles.section}>
                <label className={styles.label} htmlFor="themeDescription">
                    Theme description
                </label>
                <input
                    id="themeDescription"
                    type="text"
                    className={styles.textarea}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="Enter the theme description"
                    required
                />
            </div>
        </div>
    );
};
