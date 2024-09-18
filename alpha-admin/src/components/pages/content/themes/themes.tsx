import classNames from 'classnames';
import { Typography, Menu, MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from './themes.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../content-components/sidebar/Sidebar';
import { useEffect, useRef, useState } from 'react';
import TabBar from '../content-components/tab-bar/TabBar';
import { ThemesTable } from '../themes/themes-components/themes-table/themes-table';
import { useAppDispatch } from '../../../../app/hooks';
import { fetchThemesThunk } from './themes-components/themeSlice';
import { Lesson } from './themes-components/lessonsidebar/lessonSidebar';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../back-button/backButton';
import { fetchCategoriesForLessonsThunk } from '../categories/category-component/categorySlice';

export interface ContentProps {
    className?: string;
}

export const Themes = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dispatch = useAppDispatch();
    const [categories,setCategories] = useState([]);

    const tabs = ['All themes', 'Mental wellbeing', 'Nutrition', 'Physical activity'];
    const [theme, setTheme] = useState([]);

    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleClose();
    };

    useEffect(() => {
        dispatch(fetchThemesThunk(1)).then((res: any) => {
            console.log('res', res);
            setTheme(res.payload.data);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
    }, []);
    
    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    useEffect(() => {
        dispatch(fetchCategoriesForLessonsThunk(100)).then((response: any) => {
            if (response.payload) {
                const activeCategories = response.payload.data.filter((cat: { status: string; })=>cat.status.toLowerCase() === 'active');
                setCategories(activeCategories);
            }
        }
        );
        }, [dispatch]);

    return (
        <>
            <BackButton onClick={handleBackClick}/>
            <div
                className={classNames(styles.container, className, {
                    'blur-effect': isSidebarOpen,
                })}
            >
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles['header']}>
                        <Typography variant="h5">Themes</Typography>
                        <div className={styles.buttonContainer}>
                            <AppButton
                                ref={buttonRef}
                                showLeftIcon
                                buttonText="Create content"
                                onButtonClick={handleButtonClick}
                            />
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                slotProps={{
                                    paper: {
                                        style: {
                                            width: menuWidth,
                                        },
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => handleMenuItemClick('/content/createcategories')}
                                >
                                    <DashboardIcon style={{ marginRight: 8 }} />
                                    Category
                                </MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        handleMenuItemClick('/content/themes/createtheme')
                                    }
                                >
                                    <MenuBookIcon style={{ marginRight: 8 }} />
                                    Theme
                                </MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        handleMenuItemClick('/content/lessons/createlesson')
                                    }
                                >
                                    <LightbulbIcon style={{ marginRight: 8 }} />
                                    Lesson
                                </MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        handleMenuItemClick('/content/dailytips/createdailytips')
                                    }
                                >
                                    <CalendarMonthIcon style={{ marginRight: 8 }} />
                                    Daily tip
                                </MenuItem>
                            </Menu>
                        </div>
                    </header>
                    {/* <TabBar tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} /> */}
                    <div className={styles.section}>
                        <h3 className={styles.label}>Category</h3>
                        <select
                            id="internalNotes"
                            className={styles.textarea}
                            value={'data.themeData.internalNotes'}
                        >
                                                            <option value="" disabled hidden>
                                    Select category
                                </option>
                                {categories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <ThemesTable
                        themes={theme}
                        setThemes={setTheme}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        setTotalPages={setTotalPages}
                        setTotalRecords={setTotalRecords}
                        onUpdateThemes={function (updatedLessons: Lesson[]): void {
                            throw new Error('Function not implemented.');
                        }}
                    />
                </div>
            </div>
        </>
    );
};
