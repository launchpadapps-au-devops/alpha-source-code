import React, { FC, useRef, useEffect, useState } from 'react';
import styles from './lessonManagement.module.scss';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Menu, MenuItem } from '@mui/material';
import { Lesson } from '../select-lessons/selectLessons';
import { Delete } from '../../../../../../../icon/glyps/delete';
import { Vector } from '../../../../../../../icon/glyps/vector';
import { useNavigate } from 'react-router-dom';

interface LessonManagementProps {
    selectedLessons: Lesson[];
    onRemoveLesson: (lessonCode: number) => void;
    onAddLessons: () => void;
    newLessons?: any;
    errors: any;
    setErrors: (errors: any) => void;
}

export const LessonManagement: FC<LessonManagementProps> = ({
    selectedLessons = [], // Default to an empty array if undefined
    onRemoveLesson,
    onAddLessons,
    newLessons,
    errors,
    setErrors,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddExistingLesson = () => {
        onAddLessons();
        handleClose();
    };

    const handleCreateNewLesson = () => {
        navigate('/content/lessons/createlesson');
        handleClose();
    };

    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    return (
        <div className={styles.section}>
            <h3>
                Lessons <Vector />
            </h3>
            {selectedLessons.length > 0 && (
                <table className={styles.lessonsTable}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Lesson name</th>
                            <th>Category</th>
                            <th>Quiz</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedLessons.map((lesson, index) => (
                            <tr key={index}>
                                <td>{lesson.lessonCode}</td>
                                <td>{lesson.name}</td>
                                <td>{lesson.category}</td>
                                <td>{lesson.quizData ? <CheckCircleOutlineIcon /> : ''}</td>
                                <td>
                                    <Delete onClick={() => onRemoveLesson(lesson.lessonCode)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <EditButton ref={buttonRef} buttonText="Add Lesson" onButtonClick={handleButtonClick} className={`${styles.editButton} ${errors.lessonData && selectedLessons.length === 0 ? styles.errorBorder : ''}`}/>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            width: menuWidth,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleAddExistingLesson}>Add existing lesson</MenuItem>
                <MenuItem onClick={handleCreateNewLesson}>Create new lesson</MenuItem>
            </Menu>
            {errors.lessonData && <p className={styles.errorText}>{errors.lessonData}</p>}
        </div>
    );
};
