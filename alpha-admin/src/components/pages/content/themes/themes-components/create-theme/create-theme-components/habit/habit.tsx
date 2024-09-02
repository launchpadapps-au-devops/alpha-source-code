import React, { useState } from 'react';
import styles from './habit.module.scss';

interface HabitFormState {
    habitName: string;
    timeAllocation: string;
    pointsAllocation: string;
    habitInstruction: string;
}

interface HabitProps {
    showDeleteButton: boolean;
    data: any;
    setData: any;
}

const Habit: React.FC<HabitProps> = ({ showDeleteButton, data, setData }) => {
    console.log(data, 'data');
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {};

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <div className={styles.inputGroup}>
                <label htmlFor="habitName">Habit name</label>
                <input
                    type="text"
                    id="habitName"
                    name="habitName"
                    value={data.themeData.habits[0].name}
                    onChange={(e) =>
                        setData({
                            ...data,
                            themeData: {
                                ...data.themeData,
                                habits: [{ ...data.themeData.habits[0], name: e.target.value }],
                            },
                        })
                    }
                    maxLength={150}
                    className={styles.habitNameInput}
                    placeholder="Enter the habit name"
                    required
                />
            </div>
            <div className={styles.sideBySide}>
                <div className={styles.inputGroup}>
                    <label htmlFor="timeAllocation">Time allocation</label>
                    <select
                        id="timeAllocation"
                        name="timeAllocation"
                        value={data.themeData.habits[0].timeAllocation}
                        onChange={(e) => {
                            setData({
                                ...data,
                                themeData: {
                                    ...data.themeData,
                                    habits: [
                                        {
                                            ...data.themeData.habits[0],
                                            timeAllocation: e.target.value,
                                        },
                                    ],
                                },
                            });
                        }}
                        className={styles.timeAllocationSelect}
                        required
                    >
                        <option hidden disabled selected>
                            Select duration
                        </option>
                        <option value={1}>1 weeks</option>
                        <option value={2}>2 weeks</option>
                        <option value={3}>3 weeks</option>
                        <option value={4}>4 weeks</option>
                        <option value={5}>5 weeks</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="pointsAllocation">Points allocation</label>
                    <select
                        id="pointsAllocation"
                        name="pointsAllocation"
                        value={data.themeData.habits[0].pointAllocation}
                        onChange={(e) => {
                            setData({
                                ...data,
                                habits: [
                                    {
                                        ...data.themeData.habits[0],
                                        pointsAllocation: e.target.value,
                                    },
                                ],
                            });
                        }}
                        className={styles.timeAllocationSelect}
                        required
                    >
                        <option hidden disabled selected>
                            Select points
                        </option>
                        <option value={50}>50 points</option>
                        <option value={100}>100 points</option>
                        <option value={150}>150 points</option>
                        <option value={200}>200 points</option>
                        <option value={250}>250 points</option>
                    </select>
                </div>
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="habitInstruction">Habit instruction</label>
                <input
                    id="habitInstruction"
                    name="habitInstruction"
                    type="text"
                    value={data.themeData.habits[0].instruction}
                    onChange={(e) =>
                        setData({
                            ...data,
                            themeData: {
                                ...data.themeData,
                                habits: [
                                    { ...data.themeData.habits[0], instruction: e.target.value },
                                ],
                            },
                        })
                    }
                    maxLength={200}
                    className={styles.textarea}
                    placeholder="Enter the habit instruction"
                    required
                />
            </div>
        </>
    );
};

export default Habit;
