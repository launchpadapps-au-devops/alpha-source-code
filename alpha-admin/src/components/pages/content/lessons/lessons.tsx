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
import { LessonTable } from './lesson-components/lesson-table/lessonTable';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../back-button/backButton';
import CategoryDropdown from '../content-components/category-dropdown/categoryDropDown';
import { Vector } from '../../../icon/glyps/vector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchCategoriesForLessonsThunk } from '../categories/category-component/categorySlice';
import { useAppDispatch } from '../../../../app/hooks';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

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
    const [categories,setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState<DropdownState>({
        category: false
    });

    useEffect(() => {
        dispatch(fetchCategoriesForLessonsThunk(100)).then((response: any) => {
            if (response.payload) {
                const activeCategories = response.payload.data.filter((cat: { status: string; })=>cat.status.toLowerCase() === 'active');
                setCategories(activeCategories);
            }
        }
        );
        }, [dispatch]);
    
    const handleDropdownClick = (dropdown: string) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
    };
    const tabs = ['All lessons', 'Mental wellbeing', 'Nutrition', 'Physical activity'];

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
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
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
                    {/* <div className={styles.section}>
                        <label>Category</label>
                        <div
                            className={styles.customSelectWrapper}
                            onClick={() => handleDropdownClick('category')}
                        >
                            <select
                                className={styles.customSelect}
                                // value={data.categoryId || ''}
                                // onChange={(e) =>
                                //     setData({
                                //         ...data,
                                //         categoryId: parseInt(e.target.value, 10),
                                //     })
                                // }
                                required
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
                            <FontAwesomeIcon
                                icon={isOpen.category ? faCaretUp : faCaretDown}
                                className={styles.caretIcon}
                            />
                        </div>
                    </div> */}
                    <LessonTable />
                </div>
            </div>
        </>
    );
};
