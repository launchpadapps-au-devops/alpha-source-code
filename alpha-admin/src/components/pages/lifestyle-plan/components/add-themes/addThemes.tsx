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
    Typography,
    Checkbox,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './addThemes.module.scss';
// import { PublishThemesModal } from '../publish-theme-modal/PublisThemeModal';
import {
    LessonSidebar,
    Lesson,
} from '../../../content/themes/themes-components/lessonsidebar/lessonSidebar';
import { useAppDispatch } from '../../../../../app/hooks';
import {
    fetchThemesThunk,
    updateThemeThunk,
} from '../../../content/themes/themes-components/themeSlice';
import TabBar from '../../../content/content-components/tab-bar/TabBar';
import { AppButton } from '../../../../app-button/app-button';
import { CheckBox } from '@mui/icons-material';
import { Check } from '../../../../icon/glyps/check';
// import {TableFooter} from '../../../content/content-components/table-footer/TableFooter';
import { ThemesTable } from '../../../content/themes/themes-components/themes-table/themes-table';

// const initialLessons: Lesson[] = [
//     { code: 1, title: 'Lesson 1', quiz: true, published: true },
//     { code: 2, title: 'Lesson 2', quiz: false, published: false },
//     { code: 3, title: 'Lesson 3', quiz: true, published: true },
// ];

export interface ThemesTableProps {
    themes: any;

    onUpdateThemes: (updatedLessons: Lesson[]) => void;
    setThemeView: any;
    // onAddThemesToPlan: (selected: Lesson[]) => void;
}

export const AddThemes: React.FC<ThemesTableProps> = ({ themes, onUpdateThemes, setThemeView }) => {
    // const [themes, setThemes] = useState(initialThemes);
    var [themes, setThemes] = useState<any>([]);
    const [theme, setTheme] = useState([]);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedLessons, setSelectedLessons] = useState<any>([]);
    const tabs = ['All themes', 'Mental wellbeing', 'Nutrition', 'Physical activity'];

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    useEffect(() => {
        dispatch(fetchThemesThunk(1)).then((response: any) => {
            if (response.payload) {
                console.log('Response ', response);
                setThemes(response.payload.data);
            }
        });
    }, []);

    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };

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

        const newData = {
            themeData: {
                isPublished: newTheme.isPublished,
            },
        };

        dispatch(updateThemeThunk({ id: theme.id, theme: newData }));
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

    const handleCheckboxChange = (theme: any, index: number) => {
        const updatedThemes = [...themes];
        updatedThemes[index].select = !updatedThemes[index].select;
        setThemes(updatedThemes);
        onUpdateThemes(theme);
        localStorage.setItem('selectedThemes', JSON.stringify(updatedThemes));
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleViewLessons = (event: React.MouseEvent, lessons: any) => {
        event.stopPropagation();
        setIsSidebarOpen(true);
        setSelectedLessons(lessons);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleRowClick = (index: number) => {
        navigate(`/content/themes/viewtheme/${themes[index].id}`, {
            state: { isPublished: themes[index].published },
        });
    };

    // const selectedThemeHasLessons = () => {
    //     const selectedTheme = selectedThemeIndex !== null ? themes[selectedThemeIndex] : null;
    //     return (
    //         selectedTheme && initialLessons.some((lesson) => lesson.code === selectedTheme?.code)
    //     );
    // };
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
                <header className={styles['header']}>
                    <Typography variant="h5">Add Themes</Typography>
                    <div className={styles.buttonContainer}>
                        <AppButton
                            showLeftIcon
                            buttonText="Add themes to plan"
                            onButtonClick={() => setThemeView(false)}
                        />
                    </div>
                </header>
                <TabBar tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
                <ThemesTable
                    themes={themes}
                    setThemes={setThemes}
                    onUpdateThemes={onUpdateThemes}
                    showSelectColumn
                    totalPages={0}
                    setTotalPages={undefined}
                    totalRecords={0}
                    setTotalRecords={undefined}
                />
                {/* <Table className={classNames(styles['key-contacts-table'])}>
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
                            <TableCell className={styles['theme-date']}>Category</TableCell>
                            <TableCell className={styles['theme-date']}>Date created</TableCell>
                            <TableCell className={styles['theme-habit']}>Habit</TableCell>
                            <TableCell className={styles['theme-published']}>Published</TableCell>
                            <TableCell className={styles['theme-lessons']}>Lessons</TableCell>
                            <TableCell className={styles['theme-lessons']}>Select</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {console.log('Themes', themes)}
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
                                    <TableCell></TableCell>
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
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                        <Checkbox
                                            checked={themes.select}
                                            onChange={() => handleCheckboxChange(theme, index)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table> */}
            </TableContainer>
            {/* <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div> */}
            {/* {openModal &&
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
                ))} */}
            {/* {console.log('lessonss', themes)} */}
            {/* {isSidebarOpen && (
                <LessonSidebar
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                    lessons={selectedLessons}
                />
            )} */}
        </>
    );
};
