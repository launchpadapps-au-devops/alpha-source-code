import React, { useEffect, useState } from 'react';
import styles from './lessonInformation.module.scss';
import { Add as AddIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SelectTheme } from '../add-to-theme/addToTheme';
import { useAppDispatch, useAppSelector } from '../../../../../../../../app/hooks';
import { fetchCategoriesForLessonsThunk } from '../../../../../categories/category-component/categorySlice';
import classNames from 'classnames';
import { LessonTags } from '../lesson-tags/lessonTag';

type DropdownState = {
    [key: string]: boolean;
};

export interface LessonInformationProps {
    data: any;
    setData: any;
    theme: any;
    setTheme: any;
    selectedTheme: any;
    setSelectedTheme: any;
    isEditMode?: boolean;
    errors: any; // Accept errors prop for validation
    setErrors: (errors: any) => void; // Add setter for errors
    setDirty?: any;
}

export const LessonInformation = ({
    data,
    setData,
    theme,
    setTheme,
    selectedTheme,
    setSelectedTheme,
    isEditMode,
    errors, // Accept errors prop
    setErrors, // Pass a setErrors function to reset the errors
    setDirty,
}: LessonInformationProps) => {
    const [isOpen, setIsOpen] = useState<DropdownState>({
        category: false,
        duration: false,
        points: false,
    });
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCategoriesForLessonsThunk(100)).then((response: any) => {
            if (response.payload) {
                const activeCategories = response.payload.data.filter(
                    (cat: { status: string }) => cat.status.toLowerCase() === 'active'
                );
                setCategories(activeCategories);
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if (isEditMode) {
            setSelectedTheme(data.theme);
        }
    }, [data.theme, isEditMode, setSelectedTheme]);

    const handleDropdownClick = (dropdown: string) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
    };

    const handleClick = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Function to reset the error and update state
    const handleInputChange = (field: string, value: any) => {
        setData((prevState: any) => ({ ...prevState, [field]: value }));
        setDirty(true); // Set the dirty flag to true
        // Reset the error for this field when the user starts typing or selecting
        if (errors[field]) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [field]: '', // Clear the specific error for this field
            }));
        }
    };

    return (
        <div className={styles.lessonForm}>
            <h3>Lesson information</h3>
            <div className={styles.section}>
                <label>Lesson Code</label>
                <input
                    type="number"
                    placeholder="Add lesson code"
                    className={classNames(styles.lessonCodeInput, {
                        [styles.errorBorder]: errors.lessonCode, // Apply error border if validation fails
                    })}
                    value={data.lessonCode}
                    onChange={(e) => handleInputChange('lessonCode', e.target.value)}
                    required
                />
                {errors.lessonCode && <p className={styles.errorText}>{errors.lessonCode}</p>} {/* Display error message */}
            </div>

            <div className={styles.section} onClick={handleClick}>
                <label>Assign Theme (optional)</label>
                <div className={styles.inputWithIcon}>
                    <input
                        type="text"
                        placeholder="Add to theme"
                        readOnly
                        className={styles.inputWithPlusIcon}
                        value={selectedTheme?.name}
                        required
                    />
                    <AddIcon className={styles.plusIcon} />
                </div>
            </div>

            <div className={styles.section}>
                <label>Category</label>
                <div
                    className={styles.customSelectWrapper}
                    onClick={() => handleDropdownClick('category')}
                >
                    <select
                        className={classNames(styles.customSelect, {
                            [styles.errorBorder]: errors.categoryId, // Apply error border if validation fails
                        })}
                        value={data.categoryId || ''}
                        onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value, 10))}
                        required
                    >
                        <option value="" disabled hidden>
                            Select category
                        </option>
                        {categories.map((category: any) => (
                            <option key={category.id} value={category.id}>
                                {category?.name}
                            </option>
                        ))}
                    </select>
                    <FontAwesomeIcon
                        icon={isOpen.category ? faCaretUp : faCaretDown}
                        className={styles.caretIcon}
                    />
                </div>
                {errors.categoryId && <p className={styles.errorText}>{errors.categoryId}</p>} {/* Display error message */}
            </div>

            <div className={styles.section}>
                <label>Lesson Duration</label>
                <div
                    className={styles.customSelectWrapper}
                    onClick={() => handleDropdownClick('duration')}
                >
                    <select
                        className={classNames(styles.customSelect, {
                            [styles.errorBorder]: errors.duration, // Apply error border if validation fails
                        })}
                        value={data.duration || ''}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value, 10))}
                        required
                    >
                        <option value="" disabled>
                            Select duration
                        </option>
                        <option value={10}>10 minutes</option>
                        <option value={5}>5 minutes</option>
                        <option value={3}>3 minutes</option>
                    </select>
                    <FontAwesomeIcon
                        icon={isOpen.duration ? faCaretUp : faCaretDown}
                        className={styles.caretIcon}
                    />
                </div>
                {errors.duration && <p className={styles.errorText}>{errors.duration}</p>} {/* Display error message */}
            </div>

            <div className={styles.section}>
                <label>Points Allocation</label>
                <div
                    className={styles.customSelectWrapper}
                    onClick={() => handleDropdownClick('points')}
                >
                    <select
                        className={classNames(styles.customSelect, {
                            [styles.errorBorder]: errors.points, // Apply error border if validation fails
                        })}
                        value={data.points || ''}
                        onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                        required
                    >
                        <option value="" hidden disabled>
                            Select points
                        </option>
                        <option value={200}>200 points</option>
                        <option value={150}>150 points</option>
                        <option value={100}>100 points</option>
                        <option value={50}>50 points</option>
                    </select>
                    <FontAwesomeIcon
                        icon={isOpen.points ? faCaretUp : faCaretDown}
                        className={styles.caretIcon}
                    />
                </div>
                {errors.points && <p className={styles.errorText}>{errors.points}</p>} {/* Display error message */}
            </div>

            <LessonTags data={data} setData={setData} isEditMode={isEditMode}  errors={errors} // Pass errors to LessonTags
    setErrors={setErrors}  />
            <SelectTheme
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                data={data}
                setData={setData}
                theme={theme}
                setTheme={setTheme}
                setSelectedTheme={setSelectedTheme}
            />
        </div>
    );
};
