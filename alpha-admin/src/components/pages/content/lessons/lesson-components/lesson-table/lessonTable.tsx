import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
import { CustomPagination } from '../../../content-components/custom-pagination/customPagination';
import ToggleSwitch from '../../../content-components/toggle/toggle';

export type Lesson = {
    id: number;
    lessonCode: string;
    name: string;
    createdAt: string;
    quizData: any[];
    isPublished: boolean;
    categoryId: number;
    currentPage: number; // Add currentPage
    onPageChange: (newPage: number) => void; // Add onPageChange
};

export const LessonTable: React.FC<{
    className?: string;
    lessons: Lesson[];
    setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
    filteredLessons: Lesson[]; // Add filteredLessons here
    setFilteredLessons: React.Dispatch<React.SetStateAction<Lesson[]>>; // Add setFilteredLessons here
    currentPage: number;
    onPageChange: (newPage: number) => void;
}> = ({
    className,
    lessons,
    setLessons,
    filteredLessons,
    setFilteredLessons,
    currentPage,
    onPageChange,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(false); // Force re-render state

    useEffect(() => {
        fetchLessons(currentPage);
    }, [currentPage]);

    const fetchLessons = (page: number) => {
        dispatch(fetchLessonsThunk(page)).then((res: any) => {
            if (res.payload) {
                setLessons(res.payload.data);
                setFilteredLessons(res.payload.data); // Update filteredLessons
                setTotalPages(res.payload.meta.totalPages); // Ensure total pages are updated correctly
            }
        });
    };

    const handleToggle = (lesson: Lesson, index: number, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent row click propagation
    
        const newPublishedState = !lesson.isPublished; // Toggle the current state
    
        const updatedLesson = { ...lesson, isPublished: newPublishedState };
    
        // Dispatch API call to update the lesson's published status
        dispatch(updateLessonThunk({ id: lesson.id, data: updatedLesson })).then((response: any) => {
            if (response.payload) {
                // Optimistically update the lessons and filteredLessons states
                const updatedLessons = lessons.map((l, i) =>
                    i === index ? { ...l, isPublished: newPublishedState } : l
                );
                const updatedFilteredLessons = filteredLessons.map((l, i) =>
                    i === index ? { ...l, isPublished: newPublishedState } : l
                );
    
                setLessons(updatedLessons); // Update lessons in state
                setFilteredLessons(updatedFilteredLessons); // Update filtered lessons in state
            }
        });
    };
    

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            const lessonToUpdate = lessons[selectedThemeIndex];
            const updatedLesson = { ...lessonToUpdate, isPublished: true };

            dispatch(updateLessonThunk({ id: lessonToUpdate.id, data: updatedLesson })).then(
                (response: any) => {
                    if (response.payload) {
                        // Optimistically update the lessons and filteredLessons states
                        const updatedLessons = lessons.map((lesson, index) =>
                            index === selectedThemeIndex ? { ...lesson, isPublished: true } : lesson
                        );
                        const updatedFilteredLessons = filteredLessons.map((lesson, index) =>
                            index === selectedThemeIndex ? { ...lesson, isPublished: true } : lesson
                        );

                        setLessons(updatedLessons); // Update the lessons state
                        setFilteredLessons(updatedFilteredLessons); // Update filteredLessons
                        setForceUpdate((prev) => !prev); // Force re-render if necessary
                    }
                }
            );
            setOpenPublishModal(false); // Close the modal after publishing
        }
    };

    const handleUnpublish = () => {
        if (selectedThemeIndex !== null) {
            const lessonToUpdate = lessons[selectedThemeIndex];
            const updatedLesson = { ...lessonToUpdate, isPublished: false };

            dispatch(updateLessonThunk({ id: lessonToUpdate.id, data: updatedLesson })).then(
                (response: any) => {
                    if (response.payload) {
                        // Optimistically update the lessons and filteredLessons states
                        const updatedLessons = lessons.map((lesson, index) =>
                            index === selectedThemeIndex
                                ? { ...lesson, isPublished: false }
                                : lesson
                        );
                        const updatedFilteredLessons = filteredLessons.map((lesson, index) =>
                            index === selectedThemeIndex
                                ? { ...lesson, isPublished: false }
                                : lesson
                        );

                        setLessons(updatedLessons); // Update the lessons state
                        setFilteredLessons(updatedFilteredLessons); // Update filteredLessons
                        setForceUpdate((prev) => !prev); // Force re-render if necessary
                    }
                }
            );
            setOpenUnpublishModal(false); // Close the modal after unpublishing
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1); // Trigger the page change
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1); // Trigger the page change
        }
    };

    const handleRowClick = (index: number) => {
        navigate(`/content/lessons/viewlesson/${lessons[index].id}`, {
            state: { isPublished: lessons[index].isPublished },
        });
    };

    const handleCloseModal = () => {
        setOpenPublishModal(false);
        setOpenUnpublishModal(false);
    };

    const formatDate = (data: any) => {
        const date = new Date(data);
        return `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}/${
            date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        }/${date.getFullYear()}`;
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
                        {filteredLessons.map((lesson, index) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(index)} // Row click to navigate
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles.themecode}>
                                    {lesson.lessonCode}
                                </TableCell>
                                <TableCell className={styles.themename}>{lesson.name}</TableCell>
                                <TableCell className={styles.themedate}>
                                    {formatDate(lesson.createdAt)}
                                </TableCell>
                                <TableCell className={styles.themehabit}>
                                    {lesson.quizData.length > 0 ? <CheckCircleOutlineIcon /> : ''}
                                </TableCell>
                                <TableCell
                                    className={styles.themepublished}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <ToggleSwitch
                                        isPublished={lesson.isPublished} // Pass the isPublished state
                                        onToggle={(e) => handleToggle(lesson, index, e)} // Handle the toggle event
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={onPageChange}
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
