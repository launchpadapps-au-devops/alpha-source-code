import styles from './editTheme.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames';
import ThemeDetails from '../create-theme/create-theme-components/theme-details/themeDetails';
import { AddThemeDetails } from '../create-theme/create-theme-components/add-theme-details/addThemeDetails';
import {
    Lesson,
    SelectLessonSidebar,
} from '../create-theme/create-theme-components/select-lessons/selectLessons';
import { LessonManagement } from '../../themes-components/create-theme/create-theme-components/lessonManagement/lessonManagement';
import { useEffect, useState } from 'react';
import { Vector } from '../../../../../icon/glyps/vector';
import { DeleteButton } from '../../../content-components/delete-button/delete-button';
import Habit from '../create-theme/create-theme-components/habit/habit';
import { useAppDispatch } from '../../../../../../app/hooks';
import { fetchLessonsThunk } from '../../../lessons/lesson-components/lessonsSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { addThemeThunk, fetchThemeByIdThunk, updateThemeThunk } from '../themeSlice';
import { BackButton } from '../../../../../back-button/backButton';
import NotificationBanner from '../../../../notification-banner/notificationBanner';

export interface EditThemeProps {
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

export const EditTheme = ({ className }: EditThemeProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
    const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newLessons, setNewLessons] = useState([]);
    const [category, setCategory] = useState<string>('');
    const [showHabit, setShowHabit] = useState(false);
    const { id } = useParams();
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'delete', // Add the 'delete' type
    });
    const [data, setData] = useState({
        themeData: {
            themeCode: '0',
            categoryId: 1,
            isPublished: false,
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
                    name: 'value',
                    timeAllocation: 1,
                    pointAllocation: 50,
                    instructions: 'value',
                    meta: [
                        {
                            key: 'value',
                        },
                    ],
                },
            ],
        },
        lessonData: [],
    });

    const submitData = (id: any) => {
        dispatch(updateThemeThunk({ id, theme: data.themeData }))
            .then((res: any) => {
                if (res?.payload?.statusCode === 200 || res?.payload?.statusCode === 201) {
                    // Show success notification
                    setNotification({
                        isVisible: true,
                        message: 'Theme updated successfully!',
                        type: 'success',
                    });
    
                    // Delay navigation until after the notification is shown
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, isVisible: false }));
                        navigate('/content/themes');
                    }, 1000); // Wait for 3 seconds before navigating
                } else {
                    // Show error notification if the status code is not 200 or 201
                    setNotification({
                        isVisible: true,
                        message: 'Failed to update the theme. Please try again.',
                        type: 'error',
                    });
    
                    // Hide notification after 3 seconds
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, isVisible: false }));
                    }, 3000);
                }
            })
            .catch((err: any) => {
                console.error('Error:', err);
                // Show error notification on catch
                setNotification({
                    isVisible: true,
                    message: `Error: ${err.message}`,
                    type: 'error',
                });
    
                // Hide notification after 3 seconds
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, isVisible: false }));
                }, 3000);
            });
    };
    
    const handleUpdateLessons = (updatedLessons: Lesson[]) => {
        setLessons(updatedLessons);
    };

    const handleAddLessonsToTheme = (selected: Lesson[]) => {
        setSelectedLessons((prev) => [...prev, ...selected]);
        setIsSidebarOpen(false); // Close sidebar after adding lessons
    };

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
    const dispatch = useAppDispatch();
    const hideLessons = location.state?.hideLessons;

    useEffect(() => {
        dispatch(fetchThemeByIdThunk(id)).then((res: any) => {
            setData({ themeData: res.payload.data, lessonData: res.payload.data.lessons });
            setSelectedLessons(res.payload.data.lessons);
        });
        dispatch(fetchLessonsThunk(1)).then((res: any) => {
            setNewLessons(res.payload.data);
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
                <NotificationBanner
                        isVisible={notification.isVisible}
                        message={notification.message}
                        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
                        type={notification.type}
                    />
                    <div className={styles.combinedHeader}>
                        <header className={styles.header}>
                            <h4>Edit theme</h4>
                            {/* <div className={styles.leftButtonContainer}> */}
                            <EditButton
                                buttonText="Cancel"
                                onButtonClick={() => navigate('/content/themes')}
                            />
                        </header>
                        {/* </div> */}
                        <div className={styles.rightButtonContainer}>
                            <EditButton
                                buttonText="Save as draft"
                                onButtonClick={() => navigate('/content/themes')}
                            />
                            <AppButton buttonText="Publish" onButtonClick={() => submitData(id)} />
                        </div>
                    </div>
                    <div className={styles.themeContainer}>
                        <div className={styles.leftColumn}>
                            <ThemeDetails
                                onCategoryChange={setCategory}
                                data={data}
                                setData={setData}
                                errors={{}}
                                setErrors={() => {}}
                            />
                        </div>
                        <div className={styles.rightColumn}>
                            <AddThemeDetails
                                category={category}
                                data={data}
                                setData={setData}
                                errors={{}}
                                setErrors={() => {}}
                            />
                            {!hideLessons && (
                                <LessonManagement
                                    selectedLessons={selectedLessons}
                                    onRemoveLesson={handleRemoveLessonFromTheme}
                                    onAddLessons={handleOpenSidebar}
                                    newLessons={newLessons}
                                    errors={{}}
                                    setErrors={() => {}}
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
                                        errors={{}}
                                        setErrors={() => {}}
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
