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
    Checkbox,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './themes-table.module.scss';
import { PublishThemesModal } from '../publish-theme-modal/PublisThemeModal';
import { LessonSidebar, Lesson } from '../lessonsidebar/lessonSidebar';
import { CustomPagination } from '../../../content-components/custom-pagination/customPagination';
import { useAppDispatch } from '../../../../../../app/hooks';
import { updateThemeThunk } from '../themeSlice';

export interface ThemesTableProps {
    themes: any;
    setThemes: any;
    totalPages: number;
    setTotalPages: any;
    totalRecords: number;
    setTotalRecords: any;
    // currentPage: number; // Add currentPage
    // onPageChange: (newPage: number) => void; // Add onPageChange
    currentPage: number; // Add currentPage
    onPageChange: (newPage: number) => void; // Add onPageChange
    onUpdateThemes: (updatedLessons: Lesson[]) => void;
    showSelectColumn?: boolean;
}

export const ThemesTable: React.FC<ThemesTableProps> = ({
    themes,
    setThemes,
    onUpdateThemes,
    showSelectColumn = false,
    totalPages,
    setTotalPages,
    totalRecords,
    setTotalRecords,
    // currentPage, // Use currentPage from props
    // onPageChange, // Use onPageChange from props
    currentPage, // Use currentPage from props
    onPageChange, // Use onPageChange from props
}) => {
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedLessons, setSelectedLessons] = useState<any>([]);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleToggle = (theme: any, index: number) => {
        const isCurrentlyPublished = theme.isPublished;
        const themeHasUnpublishedLessons = theme.lessons?.some((lesson: any) => !lesson.isPublished);
    
        if (!isCurrentlyPublished) {
            // Set selected theme index
            setSelectedThemeIndex(index);
            
            // Show modal for publishing based on lesson status
            if (themeHasUnpublishedLessons) {
                // Show "unpublished lessons" modal
                setOpenModal(true);
            } else {
                // Show confirmation to publish
                setOpenModal(true);
            }
        } else {
            // If theme is already published, toggle the published state
            const newTheme = { ...theme, isPublished: !theme.isPublished };
            setThemes((prevThemes: any) => {
                const newThemes = [...prevThemes];
                newThemes[index] = newTheme;
                return newThemes;
            });
            const newData = {
                themeData: {
                    isPublished: newTheme.isPublished,
                },
            };
            dispatch(updateThemeThunk({ id: theme.id, theme: newData }));
        }
    };
    

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            const updatedTheme = {
                ...themes[selectedThemeIndex],
                isPublished: true,
            };

            setThemes((prevThemes: any) => {
                const newThemes = [...prevThemes];
                newThemes[selectedThemeIndex] = updatedTheme;
                return newThemes;
            });

            const newData = {
                themeData: {
                    isPublished: updatedTheme.isPublished,
                },
            };

            dispatch(updateThemeThunk({ id: themes[selectedThemeIndex].id, theme: newData }));
        }

        setOpenModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCheckboxChange = (theme: any, index: number) => {
        const updatedThemes = [...themes];
        updatedThemes[index].select = !updatedThemes[index].select;
        setThemes(updatedThemes);
        onUpdateThemes(theme);
        localStorage.setItem('selectedThemes', JSON.stringify(updatedThemes));
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
        navigate(`/content/themes/viewtheme/${themes[index].id}`, {
            state: { isPublished: themes[index].isPublished },
        });
    };

    const selectedThemeHasLessons = () => {
        const selectedTheme = selectedThemeIndex !== null ? themes[selectedThemeIndex] : null;
        return selectedTheme && selectedTheme.lessons?.every((lesson: any) => lesson.isPublished);
    };

    const formatDate = (data: any) => {
        const date = new Date(data);
        return `${
            date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
        }/${date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}/${date.getFullYear()}`;
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classNames(styles['key-contacts-table'])}>
                    <TableHead>
                        <TableRow
                            className={styles['table-row']}
                            style={{
                                cursor: 'pointer',
                            }}
                        >
                            <TableCell className={styles['theme-code']}>Theme code</TableCell>
                            <TableCell className={styles['theme-name']}>Theme name</TableCell>
                            {showSelectColumn && (
                                <TableCell className={styles['theme-date']}>Category</TableCell>
                            )}
                            <TableCell className={styles['theme-date']}>Date created</TableCell>
                            <TableCell className={styles['theme-habit']}>Habit</TableCell>
                            <TableCell className={styles['theme-published']}>Published</TableCell>
                            <TableCell className={styles['theme-lessons']}>Lessons</TableCell>
                            {showSelectColumn && (
                                <TableCell className={styles['theme-lessons']}>Select</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {themes.map((theme: any, index: any) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['theme-code']}>
                                    {theme.themeCode}
                                </TableCell>
                                <TableCell className={styles['theme-name']}>{theme.name}</TableCell>
                                {showSelectColumn && (
                                    <TableCell className={styles['theme-date']}>
                                        {theme.category.name}
                                    </TableCell>
                                )}
                                <TableCell>{formatDate(theme.createdAt)}</TableCell>
                                <TableCell>
                                    {theme.habits ? <CheckCircleOutlineIcon /> : ''}
                                </TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={theme.isPublished}
                                        onChange={() => handleToggle(theme, index)}
                                    />
                                </TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <a
                                        href="#"
                                        onClick={(event) => handleViewLessons(event, theme.lessons)}
                                    >
                                        View lessons
                                    </a>
                                </TableCell>
                                {showSelectColumn && (
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                        <Checkbox
                                            checked={theme.select}
                                            onChange={() => handleCheckboxChange(theme, index)}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={onPageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
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
