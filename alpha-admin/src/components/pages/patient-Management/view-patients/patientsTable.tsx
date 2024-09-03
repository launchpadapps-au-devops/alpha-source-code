import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './patientsTable.module.scss';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../app/store';
import { fetchPatients } from '../patientsSlice';
import { Patient } from '../patientsAPI';

export interface PatientsTableProps {
    className?: string;
}

export const PatientsTable = ({ className }: PatientsTableProps) => {
    // State to manage pagination
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 10; // Number of patients per page

    // Fetch patients and metadata from the Redux store
    const patients = useSelector((state: RootState) => state.patients.patients); // Only includes patients for the current page
    const totalPatients = useSelector((state: RootState) => state.patients.meta?.totalRecords || 0); // Assuming `meta` contains `totalRecords`

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch patients for the current page with the limit of 10 per page
        dispatch(fetchPatients(currentPage));
    }, [dispatch, currentPage]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page); // Update the current page
    };

    const handleEditClick = (patientId: string) => {
        navigate('/patient-dashboard', { state: { patientId } });
        localStorage.setItem('selectedPatientId', patientId);
        navigate('/patient-dashboard');
    };

    return (
        <>
            <table className={classNames(styles['key-contacts-table'], className)}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>Platform</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient: Patient, index: number) => (
                        <tr
                            key={index}
                            onClick={() => handleEditClick(patient.id)}
                            className={styles['clickable-row']}
                        >
                            <td>
                                <div className={styles['flex-table-column']}>
                                    <Avatar
                                        className={styles['profile-image']}
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        src={
                                            patient.profilePicture || '/static/images/avatar/1.jpg'
                                        }
                                    />
                                    {patient.firstName} {patient.lastName}
                                </div>
                            </td>
                            <td>{patient.phone}</td>
                            <td>{patient.email}</td>
                            <td>{patient.dob}</td>
                            <td>{patient.platform}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                count={Math.ceil(totalPatients / patientsPerPage)} // Calculate the total number of pages
                page={currentPage} // Controlled pagination component
                onChange={handlePageChange}
                showFirstButton
                showLastButton
                sx={{
                    '.MuiPagination-ul': {
                        display: 'flex',
                        justifyContent: 'center',
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
