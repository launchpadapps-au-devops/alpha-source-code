import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './selectLessons.module.scss';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, TextField, InputAdornment } from '@mui/material';
import { AppButton } from '../../../../../../../app-button/app-button';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../../../../../app/hooks';
import { fetchThemesThunk } from '../../../themeSlice';
import { fetchLessonsThunk } from '../../../../../lessons/lesson-components/lessonsSlice';

export interface Lesson {
    lessonCode: number;
    name: string;
    createdAt: string;
    isPublished: boolean;
    category: string;
    quizData: boolean;
    select: boolean;
}

export interface SelectLessonSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    lessons: Lesson[];
    onUpdateLessons: (updatedLessons: Lesson[]) => void;
    onAddLessonsToTheme: (selected: Lesson[]) => void;
}

export const SelectLessonSidebar: React.FC<SelectLessonSidebarProps> = ({
    isOpen,
    onClose,
    lessons,
    onUpdateLessons,
    onAddLessonsToTheme,
}) => {
    const [Lessons, setLessons] = useState<Lesson[]>([]);
    const [isAnyLessonSelected, setIsAnyLessonSelected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchThemesThunk(1)).then((res: any) => {
            console.log('res', res);

            // Extract lessons from the response and set them in the Lessons state
            // const extractedLessons = res.payload.data.flatMap((theme: any) =>
            //     theme.lessons.map((lesson: any) => ({
            //         code: lesson.id,
            //         title: lesson.name,
            //         date: theme.createdAt,
            //         published: lesson.isPublished,
            //         category: theme.category.name,
            //         quiz: false, // Assuming no quiz data is provided
            //         select: false,
            //     }))
            // );

            // setLessons(extractedLessons);
        });
    }, []);
    useEffect(() => {
        dispatch(fetchLessonsThunk(1)).then((res: any) => {
            console.log('res', res);

            const extractedLessons = res.payload.data.flatMap((lesson: any) => ({
                lessonCode: lesson.id,
                name: lesson.name,
                createdAt: lesson.createdAt,
                isPublished: lesson.isPublished,
                category: lesson.category.name,
                quizData: false,
                select: false,
            }));

            setLessons(extractedLessons);

            // Extract lessons from the response and set them in the Lessons state
            // const extractedLessons = res.payload.data.Flatmap((lesson: any) =>
            //     lessons.map((lesson: any) =>
            // ({
            //         code: lesson.id,
            //         title: lesson.name,
            //         date: lesson.createdAt,
            //         published: lesson.isPublished,
            //         category: lesson.category.name,
            //         quiz: false, // Assuming no quiz data is provided
            //         select: false,
            //     })
            //     )
            // )

            // setLessons(res.payload.data);
            // setLessons(extractedLessons);
        });
    }, []);

    useEffect(() => {
        setLessons(lessons);
    }, [lessons]);

    useEffect(() => {
        const isAnyLessonSelected = Lessons.some((lesson: Lesson) => lesson.select);
        setIsAnyLessonSelected(isAnyLessonSelected);
    }, [Lessons]);

    const handleCheckboxChange = (index: number) => {
        const updatedLessons = [...Lessons];
        updatedLessons[index].select = !updatedLessons[index].select;
        setLessons(updatedLessons);
        onUpdateLessons(updatedLessons);
    };

    const handleAddToThemeClick = () => {
        if (isAnyLessonSelected) {
            onAddLessonsToTheme(Lessons.filter((lesson: Lesson) => lesson.select));
            onClose();
        } else {
            console.log('No lesson selected');
        }
    };

    const handleRowClick = (lesson: Lesson) => {
        navigate(`/content/lessons/viewlesson/${lesson.lessonCode}`, {
            state: { showTags: false, showAlternateButtons: true },
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredLessons = Lessons.filter((lesson: Lesson) =>
        lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateNewLesson = () => {
        navigate('/content/lessons/createlesson');
    };

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}
            <div className={classNames(styles.sidebar, { [styles.open]: isOpen })}>
                {isOpen && (
                    <button onClick={onClose} className={styles.closeButton}>
                        <ChevronRightIcon className={styles.arrowIcon} />
                    </button>
                )}
                <div className={styles.header}>
                    <h2>Select lessons</h2>
                    <div className={styles.rightButtonContainer}>
                        <EditButton
                            buttonText="Create new lesson"
                            onButtonClick={handleCreateNewLesson}
                        />
                        <AppButton
                            buttonText="Add to theme"
                            onButtonClick={handleAddToThemeClick}
                            className={!isAnyLessonSelected ? styles.disabledButton : ''}
                        />
                    </div>
                </div>
                <div className={styles.searchBarContainer}>
                    <TextField
                        placeholder="Search lesson title"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <table className={styles.lessonsTable}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Lesson title</th>
                            <th>Date</th>
                            <th>Published</th>
                            <th>Quiz</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.map((lesson: Lesson, index: number) => (
                            <tr key={index} onClick={() => handleRowClick(lesson)}>
                                <td>{lesson.lessonCode}</td>
                                <td>{lesson.name}</td>
                                <td>{lesson.createdAt}</td>
                                <td>{lesson.isPublished ? <CheckCircleOutlineIcon /> : ''}</td>
                                <td>{lesson.quizData ? <CheckCircleOutlineIcon /> : ''}</td>
                                <td onClick={(event) => event.stopPropagation()}>
                                    <Checkbox
                                        checked={lesson.select}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <a href="#">Next</a>
                </div>
            </div>
        </>
    );
};
