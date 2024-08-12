import classNames from 'classnames';
import styles from './care-team-table.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { useEffect, useState } from 'react';
import { staffThunk } from '../create-care-team/create-care-teamSlice';
import { useNavigate } from 'react-router-dom';

export interface CareTeamTableProps {
    className?: string;
}

// const dummyData = [
//     { name: 'Dr. John Doe', role: 'General Practitioner', permissionLevel: 'Full access' },
//     { name: 'Dr. Jane Smith', role: 'Cardiologist', permissionLevel: 'Read-only' },
//     { name: 'Nurse Mary Johnson', role: 'Nurse', permissionLevel: 'Limited access' },
//     { name: 'Dr. Emily Davis', role: 'Pediatrician', permissionLevel: 'Full access' },
//     { name: 'Dr. Michael Wilson', role: 'Surgeon', permissionLevel: 'Full access' },
//     { name: 'Dr. Sarah Brown', role: 'Psychiatrist', permissionLevel: 'Read-only' },
//     { name: 'Nurse Jessica Martinez', role: 'Nurse', permissionLevel: 'Limited access' },
//     { name: 'Dr. David Garcia', role: 'Oncologist', permissionLevel: 'Full access' },
//     { name: 'Dr. Jennifer Rodriguez', role: 'Dermatologist', permissionLevel: 'Full access' },
//     { name: 'Nurse James Lee', role: 'Nurse', permissionLevel: 'Limited access' }
// ];

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CareTeamTable = ({ className }: CareTeamTableProps) => {
    const { staff, loading, errorMessage } = useSelector((state: RootState) => state.staff.staff);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(staffThunk());
    }, [dispatch]);

    const handleEditClick = (memberId: string) => {
        navigate(`/careteam/careteamprofile/${memberId}`);
    };
    // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchQuery(e.target.value);
    // }

    // const filteredStaff = staff.filter((member) =>
    //     member.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <>

            <table className={classNames(styles['key-contacts-table'])}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Permission level</th>
                        <th style={{ width: '110px' }}>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((member, index) => (
                        <tr key={index}>
                            <td >
                                <div className={styles['flex-table-column']}>
                                    <Avatar
                                        className={styles['profile-image']}
                                        // alt="Remy Sharp"
                                        src="/static/images/avatar/1.jpg"
                                    />
                                    {member.firstName} {member.lastName}
                                    {console.log(member)}
                                </div>
                            </td>
                            <td>{member.role.name}</td>
                            <td>{member.permissions.length > 0 ? member.permissions[0].name : null}</td>
                            <td>
                                <AppButton icon='edit' className={classNames(AppButton_module['button-no-decoration'], styles['table-icon-button'])} onButtonClick={() => handleEditClick(member.id)} showLeftIcon />
                            </td>
                        </tr>
                    ))}
                </tbody>
                {/* <tbody>
                <tr>
                    <td>Dr. John Doe</td>
                    <td>General Practitioner</td>
                    <td>Full access</td>
                    <td>
                        <AppButton icon='edit' className={classNames(AppButton_module['button-no-decoration'], styles['table-icon-button'])} showLeftIcon />
                    </td>
                </tr>
            </tbody> */}
            </table>
            <Pagination count={10} showFirstButton showLastButton
                sx={{
                    '.MuiPagination-ul': {
                        display: "flex",
                        justifyContent: "center",
                        padding: '10px 16px',
                    },
                    '.MuiInputBase-root': {
                        display: 'none',
                    },
                    '.MuiTablePagination-selectLabel': {
                        display: 'none',
                    },
                    '.MuiTablePagination-displayedRows': {
                        fontSize: 14,
                        fontFamily: 'Inter',
                        color: '#B0B0B0',
                        '&:before': {
                            content: '"Showing "',
                        },
                    },
                }}
            />
        </>
    );
};
