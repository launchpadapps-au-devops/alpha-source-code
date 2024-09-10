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
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    // const totalPages = 10;

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
                setTotalPages(response.payload.meta.totalPages);
                setTotalRecords(response.payload.meta.totalRecords);
                setThemes(response.payload.data);
            }
        });
    }, []);

    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleToggle = (theme: any, index: number) => {

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
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                    totalRecords={totalRecords}
                    setTotalRecords={setTotalRecords}
                />
            </TableContainer>
        </>
    );
};
