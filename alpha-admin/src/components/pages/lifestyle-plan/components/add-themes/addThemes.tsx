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
import { LessonSidebar, Lesson } from '../../../content/themes/themes-components/lessonsidebar/lessonSidebar';
import { useAppDispatch } from '../../../../../app/hooks';
import { fetchThemesThunk, updateThemeThunk } from '../../../content/themes/themes-components/themeSlice';
import TabBar from '../../../content/content-components/tab-bar/TabBar';
import { AppButton } from '../../../../app-button/app-button';
import { CheckBox } from '@mui/icons-material';
import { Check } from '../../../../icon/glyps/check';
const initialThemes = [
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

const initialLessons: Lesson[] = [
    { code: 1, title: 'Lesson 1', quiz: true, published: true },
    { code: 2, title: 'Lesson 2', quiz: false, published: false },
    { code: 3, title: 'Lesson 3', quiz: true, published: true },
];

export interface ThemesTableProps {
    themes: any;
    
    onUpdateThemes: (updatedLessons: Lesson[]) => void;
    onAddThemesToPlan: (selected: Lesson[]) => void;
}

export const AddThemes: React.FC<ThemesTableProps> = ({themes,onUpdateThemes}) => {
    // const [themes, setThemes] = useState(initialThemes);
    var [themes, setThemes] = useState<any>([]);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedTab, setSelectedTab] = useState(0);
    const tabs = ['All themes', 'Mental wellbeing', 'Nutrition', 'Physical activity'];

    useEffect(() => {
        dispatch(fetchThemesThunk()).then((response: any) => {
            if (response.payload) {
                console.log('Response ', response);
                setThemes(response.payload.data);
            }
        });
    }, []);

    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };


    const handleToggle = (theme: any,index: number) => {
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

    const handleCheckboxChange = (index: number) => {
        const updatedThemes = [...themes];
        updatedThemes[index].select = !updatedThemes[index].select;
        setThemes(updatedThemes);
        onUpdateThemes(updatedThemes);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleViewLessons = (event: React.MouseEvent) => {
        event.stopPropagation();
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
            <header className={styles['header']}>
            <Typography variant="h5">Add Themes</Typography>
            <div className={styles.buttonContainer}>
                        <AppButton
                            showLeftIcon
                            buttonText="Add themes to plan"
                            // onButtonClick={handleButtonClick}
                        />
            </div>
            </header>
            <TabBar tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
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
                            <TableCell className={styles['theme-date']}>Category</TableCell>
                            <TableCell className={styles['theme-date']}>Date created</TableCell>
                            <TableCell className={styles['theme-habit']}>Habit</TableCell>
                            <TableCell className={styles['theme-published']}>Published</TableCell>
                            <TableCell className={styles['theme-lessons']}>Lessons</TableCell>
                            <TableCell className={styles['theme-lessons']}>Select</TableCell>
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
                                            onChange={() => handleToggle(theme,index)}
                                        />
                                    </TableCell>
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                        <a href="#" onClick={handleViewLessons}>
                                            View lessons
                                        </a>
                                    </TableCell>
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Checkbox
                                        checked={themes.select}
                                        onChange={() => handleCheckboxChange(index)}
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
            <LessonSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                lessons={initialLessons}
            />
        </>
    );
};
