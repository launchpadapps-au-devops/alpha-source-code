import classNames from 'classnames';
import { Menu, MenuItem, Typography } from '@mui/material';
import styles from './categories.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../content-components/sidebar/Sidebar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { EditButton } from '../content-components/edit-button/edit-button';
import { ViewCategories } from './category-component/view-category/viewCategories';
import { useEffect, useRef, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../back-button/backButton';

export interface ContentProps {
    className?: string;
}

export const Categories = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

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
            <BackButton onClick={handleBackClick}/>
            <div className={classNames(styles.container, className)}>
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles.header}>
                        <Typography variant="h5">Categories</Typography>
                        <div className={styles.buttonContainer}>
                            <EditButton
                                showLeftIcon
                                buttonText="Edit categories"
                                onButtonClick={() => navigate('/content/editcategories')}
                            />
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
                    <ViewCategories />
                </div>
            </div>
        </>
    );
};
