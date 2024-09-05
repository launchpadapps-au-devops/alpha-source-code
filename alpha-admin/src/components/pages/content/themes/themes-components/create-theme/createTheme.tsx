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
    },
    {
        lessonCode: 2,
        name: 'Lesson 2',
        createdAt: '26/06/2023',
        isPublished: false,
        category: 'Nutrition',
        quizData: false,
        select: false,
    },
    {
        lessonCode: 3,
        name: 'Lesson 3',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: false,
        select: false,
    },
    {
        lessonCode: 4,
        name: 'Lesson 4',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: true,
        select: false,
    },
    {
        lessonCode: 5,
        name: 'Lesson 5',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: false,
        select: false,
    },
    {
        lessonCode: 6,
        name: 'Lesson 6',
        createdAt: '26/06/2023',
        isPublished: true,
        category: 'Nutrition',
        quizData: true,
        select: false,
    },
];

export const CreateTheme = ({ className }: CreateThemeProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
    const [newLessons, setNewLessons] = useState([]);
    const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [category, setCategory] = useState<string>('');
    const [showHabit, setShowHabit] = useState(false);
    const dispatch = useAppDispatch();
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
        lessonData: [1],
    });

    const submitData = () => {
        const lessonIds = selectedLessons.map((lesson) => lesson.lessonCode);
        console.log('selectedLessons', lessonIds, typeof lessonIds[0]);
        data['lessonData'] = lessonIds;

        dispatch(addThemeThunk(data))
            .then((res: any) => {
                if (res.payload.statusCode === 200) {
                    navigate('/content/themes');
                } else if (res.payload.statusCode === 201) {
                    navigate('/content/themes');
                }
            })
            .catch((err: any) => {
                console.log(err);
                alert('Error' + err);
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
    const hideLessons = location.state?.hideLessons;

    useEffect(() => {
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
                                onButtonClick={() => navigate('/content/categories')}
                            />
                            <AppButton buttonText="Publish" onButtonClick={() => submitData()} />
                        </div>
                    </header>
                    <div className={styles.themeContainer}>
                        <div className={styles.leftColumn}>
                            <ThemeDetails
                                onCategoryChange={setCategory}
                                data={data}
                                setData={setData}
                            />
                        </div>
                        <div className={styles.rightColumn}>
                            <AddThemeDetails category={category} data={data} setData={setData} />
                            {!hideLessons && (
                                <LessonManagement
                                    selectedLessons={selectedLessons}
                                    onRemoveLesson={handleRemoveLessonFromTheme}
                                    onAddLessons={handleOpenSidebar}
                                    newLessons={newLessons}
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
                                    <Habit showDeleteButton={false} data={data} setData={setData} />
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
