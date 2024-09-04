import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './patients.module.scss';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../../app-button/app-button';
import { PatientsTable } from './patientsTable';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Icon } from '../../../icon/icon';

export interface PatientsProps {
    className?: string;
}

export const Patients = ({ className }: PatientsProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div className={classNames('page-padding', className, styles['patients-block'])}>
            <section className={styles['patients-main-wrapper']}>
                <header className={styles['header']}>
                    <h2 className={styles['header-title']}>Patients</h2>
                    <div className={styles['search-container']}>
                        <div className={styles['search-input']}>
                            <button
                                className={classNames(styles['dropdown-button'])}
                                onClick={handleClick}
                            >
                                Filter
                                <Icon glyph="keyboardArrowDown" width={20} height={20} />
                            </button>
                            <input type="text" placeholder="Search team member" />
                            <button className={styles['search-button']}>Search</button>
                        </div>
                        <AppButton
                            className={styles['AppButton']}
                            buttonText=" + Add patient "
                            onButtonClick={() => navigate('/create-patient')}
                        />
                        <div>
                            <Menu
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
                            >
                                <MenuItem onClick={() => navigate('/patients/sort-by-lastname')}>
                                    Sort by Last Name
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/patients/sort-by-firstname')}>
                                    Sort by First Name
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/patients/sort-by-date')}>
                                    Sort by Date
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </header>
                <PatientsTable />
            </section>
        </div>
    );
};
