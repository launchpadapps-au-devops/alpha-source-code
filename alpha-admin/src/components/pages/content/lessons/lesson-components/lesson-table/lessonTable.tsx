import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './lessonTable.module.scss';
import { PublishLessonModal } from '../publish-lesson-modal/publishLessonModal';
import { UnpublishLessonModal } from '../unpublish-lesson-modal/unpublishLessonModal';
import { useAppDispatch } from '../../../../../../app/hooks';
import { fetchLessonsThunk, updateLessonThunk } from '../lessonsSlice';
import CategoryItem from '../../../categories/category-component/categoryItem/categoryItem';
import TableFooter from '../../../content-components/table-footer/TableFooter';

// Define the Lesson type
type Lesson = {
    id: number;
    lessonCode: string;
    name: string;
    createdAt: string;
    quizData: any[];
    isPublished: boolean;
};

export const LessonTable: React.FC<{ className?: string }> = ({ className }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);

    useEffect(() => {
        dispatch(fetchLessonsThunk()).then((res: any) => {
            if (res.payload) {
                setLessons(res.payload.data);
                setTotalPages(Math.ceil(res.payload.data.length / itemsPerPage));
            }
        });
    }, [dispatch]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleToggle = (lesson: Lesson, index: number) => {
        setSelectedThemeIndex(index);
        if (!lesson.isPublished) {
            setOpenPublishModal(true);
        } else {
            setOpenUnpublishModal(true);
        }
    };

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            const lessonToUpdate = lessons[selectedThemeIndex];
            const updatedLesson = { ...lessonToUpdate, isPublished: true };
            dispatch(updateLessonThunk({ id: lessonToUpdate.id, data: updatedLesson })).then(
                (response: any) => {
                    if (response.payload) {
                        dispatch(fetchLessonsThunk()).then((res: any) => {
                            if (res.payload) {
                                setLessons(res.payload.data);
                                setTotalPages(Math.ceil(res.payload.data.length / itemsPerPage));
                            }
                        });
                    }
                }
            );
            setOpenPublishModal(false);
        }
    };

    const handleUnpublish = () => {
        if (selectedThemeIndex !== null) {
            const lessonToUpdate = lessons[selectedThemeIndex];
            const updatedLesson = { ...lessonToUpdate, isPublished: false };
            dispatch(updateLessonThunk({ id: lessonToUpdate.id, data: updatedLesson })).then(
                (response: any) => {
                    if (response.payload) {
                        dispatch(fetchLessonsThunk()).then((res: any) => {
                            if (res.payload) {
                                setLessons(res.payload.data);
                                setTotalPages(Math.ceil(res.payload.data.length / itemsPerPage));
                            }
                        });
                    }
                }
            );
            setOpenUnpublishModal(false);
        }
    };

    const handleCloseModal = () => {
        setOpenPublishModal(false);
        setOpenUnpublishModal(false);
    };

    const handleRowClick = (index: number) => {
        navigate(`/content/lessons/viewlesson/${lessons[index].lessonCode}`, {
            state: { isPublished: lessons[index].isPublished },
        });
    };

    return (
        <>
            <TableContainer
                component={Paper}
                className={classNames(styles['key-contacts-table'], className)}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles.themecode}>Lesson Code</TableCell>
                            <TableCell className={styles.themename}>Lesson Name</TableCell>
                            <TableCell className={styles.themedate}>Date Created</TableCell>
                            <TableCell className={styles.themehabit}>Quiz</TableCell>
                            <TableCell className={styles.themepublished}>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessons
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((lesson, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => handleRowClick(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell className={styles.themecode}>{lesson.lessonCode}</TableCell>
                                    <TableCell className={styles.themename}>{lesson.name}</TableCell>
                                    <TableCell className={styles.themedate}>
                                        {new Date(lesson.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className={styles.themehabit}>
                                        {lesson.quizData.length > 0 ? (
                                            <CheckCircleOutlineIcon />
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                    <TableCell className={styles.themepublished} onClick={(event) => event.stopPropagation()}>
                                        <CategoryItem
                                            key={index}
                                            published={lesson.isPublished}
                                            onToggle={() => handleToggle(lesson, index)}
                                            name={''} // Placeholder for actual name
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <TableFooter
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {openPublishModal && selectedThemeIndex !== null && (
                <PublishLessonModal
                    open={openPublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to publish this lesson?</p>
                            <br />
                            <p>This lesson will be made available to patients.</p>
                        </>
                    }
                    title="Publish Lesson"
                    closeModal={handleCloseModal}
                    handlePublish={handlePublish}
                />
            )}
            {openUnpublishModal && selectedThemeIndex !== null && (
                <UnpublishLessonModal
                    open={openUnpublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to unpublish this lesson?</p>
                            <br />
                            <p>
                                This lesson will be saved to ‘Drafts’ and won’t be visible to
                                patients.
                            </p>
                        </>
                    }
                    title="Unpublish Lesson"
                    closeModal={handleCloseModal}
                    handleunpublish={handleUnpublish}
                />
            )}
        </>
    );
};
