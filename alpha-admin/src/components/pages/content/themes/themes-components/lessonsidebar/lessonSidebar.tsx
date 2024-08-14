import React from 'react';
import classNames from 'classnames';
import styles from './lesson-Sidebar.module.scss';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export interface Lesson {
    code: number;
    title: string;
    quiz: boolean;
    published: boolean;
}

export interface LessonSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    lessons: Lesson[];
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({ isOpen, onClose, lessons }) => {
    console.log('lessons', lessons);
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
                    <h2>View Lessons in Theme</h2>
                </div>
                <table className={styles.lessonsTable}>
                    <thead>
                        <tr>
                            <th>Lesson code</th>
                            <th>Lesson title</th>
                            <th>Quiz</th>
                            <th>Published</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons &&
                            lessons.length > 0 &&
                            lessons.map((lesson: any, index: any) => (
                                <tr key={index}>
                                    <td>{lesson.id}</td>
                                    <td>{lesson.name}</td>
                                    <td>{lesson.quiz ? <CheckCircleOutlineIcon /> : ''}</td>
                                    <td>{lesson.isPublished ? <CheckCircleOutlineIcon /> : ''}</td>
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
