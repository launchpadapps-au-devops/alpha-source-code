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
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchLessonsThunk, updateLessonThunk } from '../lessonsSlice';
import CategoryItem from '../../../categories/category-component/categoryItem/categoryItem';

// Define the Lesson type at the top of the file
type Lesson = {
    id: number;
    lessonCode: string;
    name: string;
    createdAt: string;
    quizData: any[];
    isPublished: boolean;
};

export const LessonTable: React.FC<{ className?: string }> = ({ className }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

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
        navigate(`/content/viewlesson/${lessons[index].lessonCode}`, {
            state: { isPublished: lessons[index].isPublished },
        });
    };

    useEffect(() => {
        dispatch(fetchLessonsThunk()).then((res: any) => {
            console.log('res', res.payload.data);
            setLessons(res.payload.data);
        });
    }, [dispatch]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classNames(styles['key-contacts-table'], className)}>
                    <TableHead>
                        <TableRow
                            style={{
                                textTransform: 'none',
                                fontFamily: 'Public Sans',
                                fontSize: '14px',
                            }}
                        >
                            <TableCell className={styles['theme-code']}>Lesson code</TableCell>
                            <TableCell className={styles['theme-name']}>Lesson name</TableCell>
                            <TableCell className={styles['theme-date']}>Date created</TableCell>
                            <TableCell className={styles['theme-habit']}>Quiz</TableCell>
                            <TableCell className={styles['theme-published']}>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessons.map((lesson: Lesson, index: number) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['theme-code']}>
                                    {lesson.lessonCode}
                                </TableCell>
                                <TableCell className={styles['theme-name']}>
                                    {lesson.name}
                                </TableCell>
                                <TableCell>
                                    {new Date(lesson.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {lesson.quizData.length > 0 ? <CheckCircleOutlineIcon /> : ''}
                                </TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <CategoryItem
                                        key={index}
                                        published={lesson.isPublished}
                                        onToggle={() => handleToggle(lesson, index)}
                                        name={''}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <Pagination count={10} showFirstButton showLastButton />
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
                    title="Publish lesson"
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
                    title="Unpublish lesson"
                    closeModal={handleCloseModal}
                    handleunpublish={handleUnpublish}
                />
            )}
        </>
    );
};
