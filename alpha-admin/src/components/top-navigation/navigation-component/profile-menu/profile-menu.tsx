import classNames from 'classnames';
import styles from './profile-menu.module.scss';
import React, { useState } from 'react';
import { Icon } from '../../../icon/icon';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '../divider/divider';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../../../pages/logout/logout';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useUnsavedChanges } from '../../../pages/content/lessons/lesson-components/unchanged-warning-hook-context';

export interface ProfileMenuProps {
    className?: string;
}

export const ProfileMenu = ({ className }: ProfileMenuProps) => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Access unsaved changes context
    const { dirty, discardChanges, cancelNavigation } = useUnsavedChanges();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const { userType } = useSelector((state: RootState) => state.login);

    // Handle navigation with unsaved changes prompt
    const handleNavigation = (path: string) => {
        if (dirty) {
            const shouldNavigate = window.confirm('You have unsaved changes. Do you want to leave without saving?');
            if (shouldNavigate) {
                discardChanges(); // Discard changes
                navigate(path);
            } else {
                cancelNavigation(); // Stay on the page
            }
        } else {
            navigate(path); // Navigate normally if no unsaved changes
        }
    };

    return (
        <div className={classNames(styles.root, className)}>
            <button
                className={classNames(styles['account-button'], open ? styles['active'] : '')}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Avatar className={styles['avatar-wrap']}>OP</Avatar>
                <div className={styles['profile-detail']}>
                    <span>Alpha user</span>
                    {userType === 'admin' ? <span>Admin</span> : <span>Staff</span>}
                </div>
                <Icon glyph="keyboardArrowDown" width={20} height={20} />
            </button>
            <Menu
                elevation={0}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '.MuiList-root': {
                        marginTop: '8px',
                        minWidth: '196px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #E0E0E0',
                        borderRadius: '2px',
                        paddingTop: '0px',
                        paddingBottom: '0px',
                        '.MuiButtonBase-root': {
                            padding: '10px 16px',
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => handleNavigation('/terms-and-condition')}
                >
                    <div className={styles['menu-item']}>
                        <Icon glyph="settings" width={18} height={18} currentColor="currentColor" />
                        <span>Settings</span>
                    </div>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={handleModalOpen} // You can add unsaved changes logic here as well if needed for logout
                >
                    <div className={styles['menu-item']}>
                        <Icon glyph="logout" width={18} height={18} currentColor="currentColor" />
                        <span>Logout</span>
                    </div>
                </MenuItem>
                {modalOpen && <Logout open={modalOpen} closeModal={handleModalClose} />}
            </Menu>
        </div>
    );
};
