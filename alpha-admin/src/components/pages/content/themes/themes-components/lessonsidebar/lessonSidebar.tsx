import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './lesson-Sidebar.module.scss';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Pagination } from '@mui/material';

export interface Lesson {
    id: number;
    name: string;
    quiz: boolean;
    isPublished: boolean;
}

export interface LessonSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    lessons: Lesson[];
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({ isOpen, onClose, lessons }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLessons = lessons.slice(indexOfFirstItem, indexOfLastItem);

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
                        {currentLessons.map((lesson, index) => (
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
                    <Pagination
                        count={Math.ceil(lessons.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                    />
                </div>
            </div>
        </>
    );
};
