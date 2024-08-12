import classNames from 'classnames';
import styles from './profile-menu.module.scss';
import React from 'react';
import { Icon } from '../../../icon/icon';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '../divider/divider';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Logout } from '../../../pages/logout/logout';


export interface ProfileMenuProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ProfileMenu = ({ className }: ProfileMenuProps) => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    //const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
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

    return <div className={classNames(styles.root, className)}>
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
                <span>Admin</span>
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
                // onClick={() => {
                //     history('/settings');
                //     handleClose();
                // }}
                onClick={() => navigate('/terms-and-condition')}

            >
                <div className={styles['menu-item']}>
                    <Icon glyph="settings" width={18} height={18} currentColor="currentColor" />
                    <span>Settings</span>
                </div>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleModalOpen}
            >
                <div className={styles['menu-item']}>
                    <Icon glyph="logout" width={18} height={18} currentColor="currentColor" />
                    <span>Logout</span>
                </div>
            </MenuItem>
            {modalOpen && <Logout open={modalOpen} closeModal={handleModalClose} />}
        </Menu>
    </div>;
};
