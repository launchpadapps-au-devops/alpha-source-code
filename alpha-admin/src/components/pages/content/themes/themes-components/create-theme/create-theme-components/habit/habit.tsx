import React from 'react';
import styles from './habit.module.scss';

interface HabitProps {
    showDeleteButton: boolean;
    data: any;
    setData: any;
    errors: any;
    setErrors: (errors: any) => void;
}

const Habit: React.FC<HabitProps> = ({ showDeleteButton, data, setData, errors, setErrors }) => {
    const habitIndex = 0; // Assuming we're only dealing with the first habit for now

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData({
            ...data,
            themeData: {
                ...data.themeData,
                habits: data.themeData.habits.map((habit: any, index: number) =>
                    index === habitIndex ? { ...habit,  [name]: name === "timeAllocation" || name === "pointAllocation" ? Number(value) : value } : habit
                ),
            },
        });
    };

    return (
        <>
            <div className={styles.inputGroup}>
                <label htmlFor="habitName">Habit name</label>
                <input
                    type="text"
                    id="habitName"
                    name="name"
                    value={data.themeData.habits[habitIndex].name}
                    onChange={handleInputChange}
                    maxLength={150}
                    className={`${styles.habitNameInput} ${errors.name ? styles.errorBorder : ''}`}
                    placeholder="Enter the habit name"
                    required
                />
                {errors?.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.sideBySide}>
                <div className={styles.inputGroup}>
                    <label htmlFor="timeAllocation">Time allocation</label>
                    <select
                        id="timeAllocation"
                        name="timeAllocation"
                        value={data.themeData.habits[habitIndex].timeAllocation}
                        onChange={handleInputChange}
                        className={`${styles.timeAllocationSelect} ${errors.timeAllocation ? styles.errorBorder : ''}`}
                        required
                    >
                        <option value="">Select time allocation</option>
                        <option value="1">1 week</option>
                        <option value="2">2 weeks</option>
                        <option value="3">3 weeks</option>
                        <option value="4">4 weeks</option>
                        <option value="5">5 weeks</option>
                    </select>
                    {errors?.timeAllocation && <span className={styles.errorText}>{errors.timeAllocation}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="pointsAllocation">Points allocation</label>
                    <select
                        id="pointsAllocation"
                        name="pointAllocation"
                        value={data.themeData.habits[habitIndex].pointAllocation}
                        onChange={handleInputChange}
                        className={`${styles.pointsAllocationSelect} ${errors.pointAllocation ? styles.errorBorder : ''}`}
                        required
                    >
                        <option value="">Select points allocation</option>
                        <option value="50">50 points</option>
                        <option value="100">100 points</option>
                        <option value="150">150 points</option>
                        <option value="200">200 points</option>
                        <option value="250">250 points</option>
                    </select>
                    {errors?.pointAllocation && <span className={styles.errorText}>{errors.pointAllocation}</span>}
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="habitInstruction">Habit instruction</label>
                <input
                    id="habitInstruction"
                    name="instruction"
                    type="text"
                    value={data.themeData.habits[habitIndex].instructions}
                    onChange={handleInputChange}
                    maxLength={200}
                    className={`${styles.textarea} ${errors.instruction ? styles.errorBorder : ''}`}
                    placeholder="Enter the habit instruction"
                    required
                />
                {errors?.instruction && <span className={styles.errorText}>{errors.instruction}</span>}
            </div>
        </>
    );
};

export default Habit;
