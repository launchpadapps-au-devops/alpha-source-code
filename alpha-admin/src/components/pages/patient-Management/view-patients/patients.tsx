import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './patients.module.scss';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../../app-button/app-button';
import { PatientsTable } from './patientsTable';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Icon } from '../../../icon/icon';
import { useDispatch } from 'react-redux';
import { fetchPatients } from '../patientsSlice';
import { AppDispatch } from '../../../../app/store';

export interface PatientsProps {
    className?: string;
}

// Utility to map sort fields to display text
const sortFieldDisplayNames: { [key: string]: string } = {
    lastName: 'Last Name',
    firstName: 'First Name',
    planName: 'Lifestyle Plan',
    dob: 'Date of Birth',
    phone: 'Phone Number',
};

export const Patients = ({ className }: PatientsProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();  // Cast dispatch to AppDispatch type
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [sortField, setSortField] = useState<string>(''); // Add state for sort field

    useEffect(() => {
        dispatch(fetchPatients({ page: 1, sortField })); // Fetch patients with the sortField
    }, [dispatch, sortField]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSortBy = (field: string) => {
        setSortField(field); // Set the sortField state
        setAnchorEl(null); // Close the menu
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
                                {/* Show the selected sortField or default to "Filter" */}
                                {sortFieldDisplayNames[sortField] || 'Filter'}
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
                                <MenuItem onClick={() => handleSortBy('lastName')}>Last Name</MenuItem>
                                <MenuItem onClick={() => handleSortBy('firstName')}>First Name</MenuItem>
                                <MenuItem onClick={() => handleSortBy('planName')}>Lifestyle Plan</MenuItem>
                                <MenuItem onClick={() => handleSortBy('dob')}>Date of Birth</MenuItem>
                                <MenuItem onClick={() => handleSortBy('phone')}>Phone Number</MenuItem>
                            </Menu>
                        </div>
                    </div>
                </header>
                <PatientsTable />
            </section>
        </div>
    );
};
