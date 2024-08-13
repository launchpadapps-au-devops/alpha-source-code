import styles from './editTheme.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
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

export interface EditThemeProps {
    className?: string;
}

const initialLessons: Lesson[] = [
    {
        code: 1,
        title: 'Lesson 1',
        date: '26/06/2023',
        published: true,
        category: 'Nutrition',
        quiz: true,
        select: false,
    },
    {
        code: 2,
        title: 'Lesson 2',
        date: '26/06/2023',
        published: false,
        category: 'Nutrition',
        quiz: false,
        select: false,
    },
    {
        code: 3,
        title: 'Lesson 3',
        date: '26/06/2023',
        published: true,
        category: 'Nutrition',
        quiz: false,
        select: false,
    },
    {
        code: 4,
        title: 'Lesson 4',
        date: '26/06/2023',
        published: true,
        category: 'Nutrition',
        quiz: true,
        select: false,
    },
    {
        code: 5,
        title: 'Lesson 5',
        date: '26/06/2023',
        published: true,
        category: 'Nutrition',
        quiz: false,
        select: false,
    },
    {
        code: 6,
        title: 'Lesson 6',
        date: '26/06/2023',
        published: true,
        category: 'Nutrition',
        quiz: true,
        select: false,
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

    const handleUpdateLessons = (updatedLessons: Lesson[]) => {
        setLessons(updatedLessons);
    };

    const handleAddLessonsToTheme = (selected: Lesson[]) => {
        setSelectedLessons((prev) => [...prev, ...selected]);
        setIsSidebarOpen(false); // Close sidebar after adding lessons
    };

    const handleRemoveLessonFromTheme = (lessonCode: number) => {
        setSelectedLessons((prev) => prev.filter((lesson) => lesson.code !== lessonCode));
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
        dispatch(fetchLessonsThunk()).then((res: any) => {
            setNewLessons(res.payload.data);
            console.log(res.payload.data, 'lessons');
        });
    }, []);

    return (
        <div className={classNames(styles.container, className)}>
            <Sidebar />
            <div className={styles.content}>
                <header className={styles.header}>
                    <h4>Edit theme</h4>
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
                        <AppButton
                            buttonText="Publish"
                            onButtonClick={() => navigate('/careteam/createcontent')}
                        />
                    </div>
                </header>
                <div className={styles.themeContainer}>
                    <div className={styles.leftColumn}>
                        <ThemeDetails
                            onCategoryChange={setCategory}
                            data={undefined}
                            setData={undefined}
                        />
                    </div>
                    <div className={styles.rightColumn}>
                        <AddThemeDetails category={category} data={undefined} setData={undefined} />
                        {!hideLessons && (
                            <LessonManagement
                                selectedLessons={selectedLessons}
                                onRemoveLesson={handleRemoveLessonFromTheme}
                                onAddLessons={handleOpenSidebar}
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
                                    data={undefined}
                                    setData={undefined}
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
    );
};
