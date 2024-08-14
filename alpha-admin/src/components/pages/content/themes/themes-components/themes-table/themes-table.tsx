import React, { useEffect, useState } from 'react';
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
import styles from './themes-table.module.scss';
import { PublishThemesModal } from '../publish-theme-modal/PublisThemeModal';
import { LessonSidebar, Lesson } from '../lessonsidebar/lessonSidebar';
import { useAppDispatch } from '../../../../../../app/hooks';
import { fetchThemesThunk, updateThemeThunk } from '../themeSlice';

const initialLessons: Lesson[] = [
    { code: 1, title: 'Lesson 1', quiz: true, published: true },
    { code: 2, title: 'Lesson 2', quiz: false, published: false },
    { code: 3, title: 'Lesson 3', quiz: true, published: true },
];

export interface ThemesTableProps {
    themes: any;
    setThemes: any;
}

export const ThemesTable: React.FC<ThemesTableProps> = ({ themes, setThemes }) => {
    // const [themes, setThemes] = useState(initialThemes);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedLessons, setSelectedLessons] = useState<any>([]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleToggle = (theme: any, index: number) => {
        // const theme = themes[index];
        // if (!theme.published) {
        //     setSelectedThemeIndex(index);
        //     setOpenModal(true);
        // } else {
        //     // setThemes((prevThemes) =>
        //     //     prevThemes.map((theme, i) =>
        //     //         i === index ? { ...theme, published: !theme.published } : theme
        //     //     )
        //     // );
        // }

        // Create a new copy of the theme object
        const newTheme = { ...theme, isPublished: !theme.isPublished };

        setThemes((prevThemes: any) => {
            const newThemes = [...prevThemes];
            newThemes[index] = newTheme;
            return newThemes;
        });

        dispatch(updateThemeThunk({ id: theme.id, theme: newTheme }));
    };

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            // setThemes((prevThemes) =>
            //     prevThemes.map((theme, i) =>
            //         i === selectedThemeIndex ? { ...theme, published: true } : theme
            //     )
            // );
        }
        setOpenModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleViewLessons = (event: React.MouseEvent, lessons: any) => {
        event.stopPropagation();
        setSelectedLessons(lessons);

        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleRowClick = (index: number) => {
        navigate(`/content/viewtheme/${themes[index].id}`, {
            state: { isPublished: themes[index].published },
        });
    };

    const selectedThemeHasLessons = () => {
        const selectedTheme = selectedThemeIndex !== null ? themes[selectedThemeIndex] : null;
        return (
            selectedTheme && initialLessons.some((lesson) => lesson.code === selectedTheme?.code)
        );
    };
    const formatDate = (data: any) => {
        var date = new Date(data);
        return (
            (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
            '/' +
            (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
            '/' +
            date.getFullYear()
        );
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classNames(styles['key-contacts-table'])}>
                    <TableHead>
                        <TableRow
                            style={{
                                textTransform: 'none',
                                fontFamily: 'Public Sans',
                                fontSize: '14px',
                            }}
                        >
                            <TableCell className={styles['theme-code']}>Theme code</TableCell>
                            <TableCell className={styles['theme-name']}>Theme name</TableCell>
                            <TableCell className={styles['theme-date']}>Date created</TableCell>
                            <TableCell className={styles['theme-habit']}>Habit</TableCell>
                            <TableCell className={styles['theme-published']}>Published</TableCell>
                            <TableCell className={styles['theme-lessons']}>Lessons</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {themes &&
                            themes.length > 0 &&
                            themes.map((theme: any, index: any) => (
                                <TableRow
                                    key={index}
                                    onClick={() => handleRowClick(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell className={styles['theme-code']}>
                                        {theme.themeCode}
                                    </TableCell>
                                    <TableCell className={styles['theme-name']}>
                                        {theme.name}
                                    </TableCell>
                                    <TableCell>{formatDate(theme.createdAt)}</TableCell>
                                    <TableCell>
                                        {theme.habit ? <CheckCircleOutlineIcon /> : ''}
                                    </TableCell>
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                        <Switch
                                            key={index}
                                            name={theme.name}
                                            checked={theme.published}
                                            onChange={() => handleToggle(theme, index)}
                                        />
                                    </TableCell>
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                        <a
                                            href="#"
                                            onClick={(event) =>
                                                handleViewLessons(event, theme.lessons)
                                            }
                                        >
                                            View lessons
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <Pagination count={10} showFirstButton showLastButton />
            </div>
            {openModal &&
                selectedThemeIndex !== null &&
                (selectedThemeHasLessons() ? (
                    <PublishThemesModal
                        open={openModal}
                        descriptionText={
                            <>
                                <p>Are you sure you wish to publish this theme?</p>
                                <br />
                                <p>
                                    All lessons and themes tagged with this theme will now be
                                    visible to patients.
                                </p>
                            </>
                        }
                        title="Publish Theme"
                        closeModal={handleCloseModal}
                        handlePublish={handlePublish}
                    />
                ) : (
                    <PublishThemesModal
                        open={openModal}
                        descriptionText={
                            <>
                                <p>Some lessons are currently unpublished</p>
                                <br />
                                <p>
                                    You will need to go into “Lessons” and publish your lessons in
                                    order to publish this theme.
                                </p>
                                <br />
                                <p>
                                    Alternatively, move your draft lessons out of this theme before
                                    you publish.
                                </p>
                            </>
                        }
                        title="Unpublished lesson alert"
                        closeModal={handleCloseModal}
                        handlePublish={handlePublish}
                    />
                ))}
            {isSidebarOpen && (
                <LessonSidebar
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                    lessons={selectedLessons}
                />
            )}
        </>
    );
};
