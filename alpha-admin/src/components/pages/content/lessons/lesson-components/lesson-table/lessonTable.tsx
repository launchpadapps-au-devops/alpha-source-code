import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    Pagination,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './lessonTable.module.scss';
import { PublishLessonModal } from '../publish-lesson-modal/publishLessonModal';
import { UnpublishLessonModal } from '../unpublish-lesson-modal/unpublishLessonModal';
import { useAppSelector } from '../../../../../../app/hooks';

const initialLessons = [
    {
        code: 1,
        name: 'Title...',
        dateCreated: '26/06/2024',
        habit: true,
        published: false,
        lessons: 'View lessons',
    },
    {
        code: 2,
        name: 'Protein',
        dateCreated: '26/06/2024',
        habit: false,
        published: false,
        lessons: 'View lessons',
    },
    {
        code: 3,
        name: 'Sleep 101',
        dateCreated: '26/06/2024',
        habit: false,
        published: true,
        lessons: 'View lessons',
    },
    {
        code: 4,
        name: 'Goal setting',
        dateCreated: '26/06/2024',
        habit: false,
        published: false,
        lessons: 'View lessons',
    },
    {
        code: 5,
        name: 'Mindfulness',
        dateCreated: '26/06/2024',
        habit: true,
        published: true,
        lessons: 'View lessons',
    },
    {
        code: 6,
        name: 'Movement 101',
        dateCreated: '26/06/2024',
        habit: false,
        published: false,
        lessons: 'View lessons',
    },
    {
        code: 7,
        name: 'Staying active',
        dateCreated: '26/06/2024',
        habit: true,
        published: false,
        lessons: 'View lessons',
    },
    {
        code: 8,
        name: 'Steps',
        dateCreated: '26/06/2024',
        habit: false,
        published: true,
        lessons: 'View lessons',
    },
];

export const LessonTable: React.FC<{ className?: string }> = ({ className }) => {
    const [themes, setThemes] = useState(initialLessons);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const [lessons, setLessons] = useAppSelector((state) => state.lessons.lessons.lessons);
    const navigate = useNavigate();

    const handleToggle = (index: number) => {
        const theme = themes[index];
        setSelectedThemeIndex(index);
        if (!theme.published) {
            setOpenPublishModal(true);
        } else {
            setOpenUnpublishModal(true);
        }
    };

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            setThemes((prevThemes) =>
                prevThemes.map((theme, i) =>
                    i === selectedThemeIndex ? { ...theme, published: true } : theme
                )
            );
        }
        setOpenPublishModal(false);
    };

    const handleUnpublish = () => {
        if (selectedThemeIndex !== null) {
            setThemes((prevThemes) =>
                prevThemes.map((theme, i) =>
                    i === selectedThemeIndex ? { ...theme, published: false } : theme
                )
            );
        }
        setOpenUnpublishModal(false);
    };

    const handleCloseModal = () => {
        setOpenPublishModal(false);
        setOpenUnpublishModal(false);
    };

    const handleRowClick = (index: number) => {
        navigate(`/content/viewlesson/${themes[index].code}`, {
            state: { isPublished: themes[index].published },
        });
    };

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
                        {themes.map((theme, index) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['theme-code']}>{theme.code}</TableCell>
                                <TableCell className={styles['theme-name']}>{theme.name}</TableCell>
                                <TableCell>{theme.dateCreated}</TableCell>
                                <TableCell>
                                    {theme.habit ? <CheckCircleOutlineIcon /> : ''}
                                </TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={theme.published}
                                        onChange={() => handleToggle(index)}
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
