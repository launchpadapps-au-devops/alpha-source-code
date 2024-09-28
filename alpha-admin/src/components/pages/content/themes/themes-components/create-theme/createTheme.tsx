import styles from './createTheme.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ThemeDetails from './create-theme-components/theme-details/themeDetails';
import { AddThemeDetails } from './create-theme-components/add-theme-details/addThemeDetails';
import {
    Lesson,
    SelectLessonSidebar,
} from './create-theme-components/select-lessons/selectLessons';
import { LessonManagement } from '../../themes-components/create-theme/create-theme-components/lessonManagement/lessonManagement';
import { useEffect, useState } from 'react';
import { Vector } from '../../../../../icon/glyps/vector';
import { DeleteButton } from '../../../content-components/delete-button/delete-button';
import Habit from './create-theme-components/habit/habit';
import { useDispatch } from 'react-redux';
import { addThemeThunk } from '../themeSlice';
import { useAppDispatch } from '../../../../../../app/hooks';
import { fetchLessonsThunk } from '../../../lessons/lesson-components/lessonsSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../../../back-button/backButton';
import React from 'react';

export interface CreateThemeProps {
    className?: string;
}

const initialLessons: Lesson[] = [
    {
        lessonCode: 1,
        name: 'Lesson 1',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: true,
        select: false,
        status: '',
    },
    {
        lessonCode: 2,
        name: 'Lesson 2',
        createdAt: '26/06/2023',
        isPublished: false,
        category: 'Nutrition',
        quizData: false,
        select: false,
        status: '',
    },
    {
        lessonCode: 3,
        name: 'Lesson 3',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: false,
        select: false,
        status: '',
    },
    {
        lessonCode: 4,
        name: 'Lesson 4',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: true,
        select: false,
        status: '',
    },
    {
        lessonCode: 5,
        name: 'Lesson 5',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: false,
        select: false,
        status: '',
    },
    {
        lessonCode: 6,
        name: 'Lesson 6',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: true,
        select: false,
        status: '',
    },
];

export const CreateTheme = ({ className }: CreateThemeProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
    const [newLessons, setNewLessons] = useState<Lesson[]>([]);
    const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [category, setCategory] = useState<string>('');
    const [showHabit, setShowHabit] = useState(false);
    const [errors, setErrors] = React.useState<any>({});
    const dispatch = useAppDispatch();

    const [data, setData] = useState({
        themeData: {
            themeCode: 1,
            categoryId: 1,
            isPublished: false,
            status: 'ACTIVE',
            internalNotes: '',
            name: '',
            image: 'https://sample.com/sample.jpg',
            description: 'Theme Description',
            propertyTags: [
                {
                    key: 'value',
                },
            ],
            habits: [
                {
                    id: 1,
                    order: 1,
                    name: '',
                    timeAllocation: 1,
                    pointAllocation: 50,
                    instructions: '',
                    meta: [
                        {
                            key: 'value',
                        },
                    ],
                },
            ],
        },
        lessonData: [1],
    });

    const validateFields = () => {
        let fieldErrors: any = {};
        if (!data.themeData.themeCode) {
            fieldErrors.themeCode = 'Theme Code is required';
        }
        if (!data.themeData.name) {
            fieldErrors.name = 'Name is required';
        }
        if (!data.themeData.description) {
            fieldErrors.description = 'Description is required';
        }

        if (!data.themeData.categoryId) {
            fieldErrors.categoryId = 'Category is required';
        }
        if (selectedLessons.length === 0) {
            fieldErrors.lessonData = 'At least one lesson is required';
        }

       // Validate habits
    if (data.themeData.habits.length > 0) {
        data.themeData.habits.forEach((habit, index) => {
            let habitErrors: any = {};

            if (!habit.name) {
                habitErrors.name = 'Habit name is required';
            }
            if (!habit.timeAllocation) {
                habitErrors.timeAllocation = 'Time allocation is required';
            }
            if (!habit.pointAllocation) {
                habitErrors.pointAllocation = 'Point allocation is required';
            }
            if (!habit.instructions) {
                habitErrors.instructions = 'Instructions are required';
            }

            if (Object.keys(habitErrors).length > 0) {
                fieldErrors[`habits_${index}`] = habitErrors; // Store errors for each habit
            }
        });
    } else {
        fieldErrors.habits = 'At least one habit is required';
    }

        setErrors(fieldErrors);

        return Object.keys(fieldErrors).length === 0;
    };
    // Submit data to the backend with selected lessons and status
    const submitData = (status: string) => {
        const lessonIds = selectedLessons.map((lesson) => lesson.lessonCode);
        console.log('selectedLessons', lessonIds);

        const updatedData = {
            ...data,
            themeData: {
                ...data.themeData,
                status, // Update status based on the passed argument
            },
            lessonData: lessonIds, // Ensure lessonData is an array of lesson codes
        };

        if (!validateFields()) {
            dispatch(addThemeThunk(updatedData))
                .then((res: any) => {
                    if (res.payload.statusCode === 200 || res.payload.statusCode === 201) {
                        navigate('/content/themes');
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    alert('Error' + err);
                });
        } else {
            console.log('Validation failed', errors);
        }
    };

    // Handle updates to the lessons
    const handleUpdateLessons = (updatedLessons: Lesson[]) => {
        setLessons(updatedLessons);
    };

    // Handle adding lessons to the theme and ensuring prev is always an array
    const handleAddLessonsToTheme = (selected: Lesson[]) => {
        setSelectedLessons((prev) =>
            Array.isArray(prev) ? [...prev, ...selected] : [...selected]
        );
        setIsSidebarOpen(false); // Close sidebar after adding lessons
    };

    // Remove a lesson from the selected lessons
    const handleRemoveLessonFromTheme = (lessonCode: number) => {
        setSelectedLessons((prev) => prev.filter((lesson) => lesson.lessonCode !== lessonCode));
    };

    const handleOpenSidebar = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleAddHabitClick = () => {
        setShowHabit(true);
    };

    const handleRemoveHabitClick = () => {
        setShowHabit(false);
    };

    const hideLessons = location.state?.hideLessons;

    useEffect(() => {
        // Fetch lessons from the API and ensure the lessons list is valid
        dispatch(fetchLessonsThunk(1)).then((res: any) => {
            const lessonsFromAPI = res.payload.data.lessons;
            if (Array.isArray(lessonsFromAPI)) {
                setNewLessons(lessonsFromAPI); // Populate new lessons from the API response
                setSelectedLessons(lessonsFromAPI); // Set the initial selected lessons
            } else {
                setNewLessons([]); // Handle if lessons is not an array
            }
            console.log(res.payload.data, 'lessons');
        });
    }, []);

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
            <BackButton onClick={handleBackClick} />
            <div className={classNames(styles.container, className)}>
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles.header}>
                        <h4>Create a new Theme</h4>
                        <div className={styles.leftButtonContainer}>
                            <EditButton
                                buttonText="Cancel"
                                onButtonClick={() => navigate('/content/themes')}
                            />
                        </div>
                        <div className={styles.rightButtonContainer}>
                            <EditButton
                                buttonText="Save as draft"
                                onButtonClick={() => submitData('DRAFT')}
                            />
                            <AppButton
                                buttonText="Publish"
                                onButtonClick={() => submitData('ACTIVE')}
                            />
                        </div>
                    </header>
                    <div className={styles.themeContainer}>
                        <div className={styles.leftColumn}>
                            <ThemeDetails
                                onCategoryChange={setCategory}
                                data={data}
                                setData={setData}
                                errors={errors}
                                setErrors={setErrors}
                            />
                        </div>
                        <div className={styles.rightColumn}>
                            <AddThemeDetails
                                category={category}
                                data={data}
                                setData={setData}
                                errors={errors}
                                setErrors={setErrors}
                            />
                            {!hideLessons && (
                                <LessonManagement
                                    selectedLessons={selectedLessons}
                                    onRemoveLesson={handleRemoveLessonFromTheme}
                                    onAddLessons={handleOpenSidebar}
                                    newLessons={newLessons}
                                    errors={errors}
                                    setErrors={setErrors}
                                />
                            )}
                            <div className={styles.section}>
                                <div className={styles.habitHeader}>
                                    <h3>
                                        Habit <Vector />
                                    </h3>
                                    {showHabit && (
                                        <DeleteButton
                                            showLeftIcon
                                            buttonText="Remove habit"
                                            className={styles.removeHabitButton}
                                            onButtonClick={handleRemoveHabitClick}
                                        />
                                    )}
                                </div>
                                {showHabit ? (
                                    <Habit
                                        showDeleteButton={false}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        setErrors={setErrors}
                                    />
                                ) : (
                                    <EditButton
                                        buttonText="Add Habit"
                                        onButtonClick={handleAddHabitClick}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <SelectLessonSidebar
                        isOpen={isSidebarOpen}
                        onClose={handleCloseSidebar}
                        lessons={lessons}
                        onUpdateLessons={handleUpdateLessons}
                        onAddLessonsToTheme={handleAddLessonsToTheme}
                    />
                </div>
            </div>
        </>
    );
};
