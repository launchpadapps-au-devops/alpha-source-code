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

export interface LessonsProps {
    className?: string;
}

export const Lessons = ({ className }: LessonsProps) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

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

    return (
        <div className={classNames(styles.container, className, { 'blur-effect': isSidebarOpen })}>
            <Sidebar />
            <div className="w-100" style={{ margin: '4%' }}>
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
                            <MenuItem onClick={() => handleMenuItemClick('/content/createtheme')}>
                                <MenuBookIcon style={{ marginRight: 8 }} />
                                Theme
                            </MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('/content/createlesson')}>
                                <LightbulbIcon style={{ marginRight: 8 }} />
                                Lesson
                            </MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('/content/dailytips')}>
                                <CalendarMonthIcon style={{ marginRight: 8 }} />
                                Daily tip
                            </MenuItem>
                        </Menu>
                    </div>
                </header>
                <TabBar tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
                <LessonTable />
            </div>
        </div>
    );
};
