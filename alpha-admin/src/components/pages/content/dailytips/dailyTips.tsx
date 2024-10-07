import classNames from 'classnames';
import { List, Menu, MenuItem, Typography } from '@mui/material';
import styles from './dailyTips.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../content-components/sidebar/Sidebar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { EditButton } from '../content-components/edit-button/edit-button';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { addTipThunk, fetchTipsThunk } from './viewTipsSlice';
import { DeleteButton } from '../content-components/delete-button/delete-button';
// import {TableFooter} from '../content-components/table-footer/TableFooter';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../back-button/backButton';
import { CustomPagination } from '../content-components/custom-pagination/customPagination';
import NotificationBanner from '../../notification-banner/notificationBanner';

export interface ContentProps {
    className?: string;
}

interface Tip {
    id: number;
    day: number;
    content: string;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    tip: string; // Add this property if required
    date: string; // Add this property if required
    totalPages: number;
    setTotalPages: any;
    totalRecords: number;
    setTotalRecords: any;
}

export const DailyTips = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    let tips = useAppSelector((state) => state.tips.tips.tips);
    const dispatch = useAppDispatch();

    // State to track if tips are editable
    const [isEditable, setIsEditable] = useState(false);
    const [editTipId, setEditTipId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'delete', // Add the 'delete' type
    });

    const fetchStaffData = (page: number) => {
        dispatch(fetchTipsThunk(page)).then((res: any) => {
            if (res.payload) {
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
            }
        });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            fetchStaffData(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchStaffData(currentPage - 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        fetchStaffData(pageNumber);
    };

    useEffect(() => {
        fetchStaffData(1);
    }, [dispatch]);
    const handleEditClick = (tipId: number, content: string) => {
        setIsEditable(true);
        setEditTipId(tipId);
        setEditContent(content);
    };

    const handleSaveClick = (tipId: number) => {
        if (editContent.trim() === '') {
            alert('Tip content cannot be empty.');
            return;
        }

        console.log('Saving tip with ID:', tipId, 'Content:', editContent);

        // Find and update the specific tip by ID
        const updatedTip = tips.find((tip: Tip) => tip.id === tipId);
        if (!updatedTip) {
            alert('Tip not found.');
            return;
        }

        // Construct the updated tip data with all required fields
        const updatedTipData: any = {
            ...updatedTip,
            content: editContent,
            status: 'ACTIVE',
            tip: updatedTip.tip || '',
            date: updatedTip.date || new Date().toISOString(),
        };

        dispatch(addTipThunk(updatedTipData)).then((res: any) => {
            if (res.payload) {
                // Show success notification
                setNotification({
                    isVisible: true,
                    message: 'Daily tip updated successfully!',
                    type: 'success',
                });
            } else {
                // Show error notification if save fails
                setNotification({
                    isVisible: true,
                    message: 'Failed to update daily tip. Please try again.',
                    type: 'error',
                });
            }

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, isVisible: false }));
            }, 3000);

            // Fetch the latest tips to refresh the list
            dispatch(fetchTipsThunk(1));

            // Reset the state after save
            setEditTipId(null);
            setEditContent('');
        });
    };

    const handleDeleteClick = (tipId: number) => {
        const updatedTip = tips.find((tip: Tip) => tip.id === tipId);
        if (!updatedTip) {
            alert('Tip not found.');
            return;
        }

        // Construct the updated tip data with the "ARCHIVE" status
        const updatedTipData: any = {
            ...updatedTip,
            content: updatedTip.content,
            status: 'ARCHIVE',
            tip: updatedTip.tip || '',
            date: updatedTip.date || new Date().toISOString(),
        };

        dispatch(addTipThunk(updatedTipData)).then((res: any) => {
            if (res.payload) {
                // Show success notification
                setNotification({
                    isVisible: true,
                    message: 'Daily tip deleted successfully!',
                    type: 'delete',
                });
            } else {
                // Show error notification if delete fails
                setNotification({
                    isVisible: true,
                    message: 'Failed to delete daily tip. Please try again.',
                    type: 'error',
                });
            }

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, isVisible: false }));
            }, 3000);

            // Fetch the latest tips to refresh the list
            dispatch(fetchTipsThunk(1));

            // Reset the state after delete
            setEditTipId(null);
            setEditContent('');
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditContent(e.target.value);
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

    useEffect(() => {
        dispatch(fetchTipsThunk(1)).then((res: any) => {
            console.log('res', res);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
    }, [dispatch]);

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
            <BackButton onClick={handleBackClick} />
            <div className={classNames(styles.container, className)}>
                <Sidebar />
                <div className={styles.content}>
                    <NotificationBanner
                        isVisible={notification.isVisible}
                        message={notification.message}
                        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
                        type={notification.type}
                    />
                    <div className={styles.combinedHeader}>
                        <header className={styles.header}>
                            <Typography variant="h5">
                                {isEditable ? 'Edit Daily tips' : 'Daily tips'}
                            </Typography>
                            {isEditable ? (
                                <EditButton
                                    buttonText="Cancel"
                                    onButtonClick={() => setIsEditable(!isEditable)}
                                />
                            ) : null}
                        </header>
                        <div className={styles.buttonContainer}>
                            {isEditable ? (
                                ''
                            ) : (
                                <EditButton
                                    showLeftIcon={!isEditable}
                                    buttonText="Edit Daily tips"
                                    onButtonClick={() => setIsEditable(!isEditable)}
                                />
                            )}
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
                                        style: { width: menuWidth },
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
                    </div>

                    <div className={styles.categories}>
                        <div className={styles.tableheader}>
                            <span className={styles.headerText}>Day</span>
                            <span className={styles.headerText}>Daily tips</span>
                        </div>
                        <List>
                            {tips &&
                                tips.length > 0 &&
                                tips
                                    .filter((tip: Tip) => tip.status.toLowerCase() === 'active')
                                    .map((tip: Tip) => (
                                        <div className={styles.listItem} key={tip.id}>
                                            {editTipId === tip.id ? (
                                                <>
                                                    <div className={styles.dayInput}>{tip.day}</div>
                                                    <input
                                                        className={styles.contentInput}
                                                        type="text"
                                                        value={editContent}
                                                        onChange={handleInputChange}
                                                    />
                                                    <AppButton
                                                        buttonText="Save & add more"
                                                        className={styles.button}
                                                        onButtonClick={() =>
                                                            handleSaveClick(tip.id)
                                                        }
                                                    />
                                                    <EditButton
                                                        buttonText="Save"
                                                        className={styles.button}
                                                        onButtonClick={() =>
                                                            handleSaveClick(tip.id)
                                                        }
                                                    />
                                                    <DeleteButton
                                                        buttonText="Delete"
                                                        className={styles.button}
                                                        onButtonClick={() =>
                                                            handleDeleteClick(tip.id)
                                                        } // Use tip.id instead of tip.day for deletion
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div className={styles.day}>{tip.day}</div>
                                                    <div className={styles.content}>
                                                        {tip.content}
                                                    </div>
                                                    {isEditable ? (
                                                        <EditButton
                                                            buttonText="Edit"
                                                            className={styles.editButton}
                                                            onButtonClick={() =>
                                                                handleEditClick(tip.id, tip.content)
                                                            }
                                                        />
                                                    ) : (
                                                        <div>...</div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                        </List>
                    </div>
                    <div className={styles.pagination}>
                        <CustomPagination
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                            onPageChange={handlePageChange}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
