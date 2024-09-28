import classNames from 'classnames';
import { Typography, Menu, MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from './lessons.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../content-components/sidebar/Sidebar';
import { useEffect, useRef, useState } from 'react';
import TabBar from '../content-components/tab-bar/TabBar';
// import { LessonTable } from './lesson-components/lesson-table/lessonTable';
// import { LessonTable } from './lesson-components/lesson-table/lessonTable';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../back-button/backButton';
import CategoryDropdown from '../content-components/category-dropdown/categoryDropDown';
import { Vector } from '../../../icon/glyps/vector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchCategoriesForLessonsThunk } from '../categories/category-component/categorySlice';
import { useAppDispatch } from '../../../../app/hooks';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { fetchLessonsThunk } from './lesson-components/lessonsSlice';
// lessons.tsx
import { LessonTable, Lesson } from './lesson-components/lesson-table/lessonTable';

export interface LessonsProps {
    className?: string;
}

type DropdownState = {
    [key: string]: boolean;
};

export const Lessons = ({ className }: LessonsProps) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]); // State for categories
    const [lessons, setLessons] = useState<Lesson[]>([]); // State to store lessons
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]); // State to store filtered lessons
    const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category
    const [isOpen, setIsOpen] = useState<DropdownState>({
        category: false,
    });

    useEffect(() => {
        dispatch(fetchCategoriesForLessonsThunk(100)).then((response: any) => {
            if (response.payload) {
                const activeCategories = response.payload.data.filter(
                    (cat: { status: string }) => cat.status.toLowerCase() === 'active'
                );
                setCategories(activeCategories);
            }
        });

        dispatch(fetchLessonsThunk(currentPage)).then((res: any) => {
            if (res.payload) {
                setLessons(res.payload.data); // Store lessons in state
                setFilteredLessons(res.payload.data); // Initially, show all lessons
            }
        });
    }, [dispatch, currentPage]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        setSelectedCategory(selectedId);

        // Filter lessons based on the selected category
        if (selectedId) {
            const filtered = lessons.filter(
                (lesson) => lesson.categoryId.toString() === selectedId // Access category.id for filtering
            );
            setFilteredLessons(filtered);
        } else {
            setFilteredLessons(lessons); // Show all lessons if no category is selected
        }
    };

    const handleDropdownClick = (dropdown: string) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
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

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef]);

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <>
            <BackButton onClick={handleBackClick} />
            <div className={classNames(styles.container, className)}>
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles['header']}>
                        <Typography variant="h5">Lessons</Typography>
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
                    <div className={styles.section}>
                        <h3 className={styles.label}>Category</h3>
                        <select
                            id="categoryDropdown"
                            className={styles.textarea}
                            value={selectedCategory}
                            onChange={handleCategoryChange} // Add change handler
                        >
                            <option value="" disabled hidden>
                                Select category
                            </option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
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
                    <LessonTable
                        lessons={lessons}  // Pass lessons state
                        setLessons={setLessons}  // Pass setLessons
                        filteredLessons={filteredLessons}  // Pass filteredLessons state
                        setFilteredLessons={setFilteredLessons}  // Pass setFilteredLessons
                        currentPage={currentPage}  // Pass currentPage state
                        onPageChange={handlePageChange}  // Pass handlePageChange
                    />
                </div>
            </div>
        </>
    );
};

