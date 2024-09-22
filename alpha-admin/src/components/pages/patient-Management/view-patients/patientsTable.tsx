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
    searchValue?: string;
    sortField?: string;
    searchKey?: string;
}

export const PatientsTable = ({ className , searchKey , sortField , searchValue }: PatientsTableProps) => {
    // State to manage pagination
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 10; // Number of patients per page

    // Fetch patients and metadata from the Redux store
    const patients = useSelector((state: RootState) => state.patients.patients); // Only includes patients for the current page
    const totalPatients = useSelector((state: RootState) => state.patients.meta?.totalRecords || 0); // Assuming `meta` contains `totalRecords`

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

 

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        // Set the new current page
        setCurrentPage(newPage);
    
        // Dispatch the fetchPatients action with search and pagination params
        dispatch(fetchPatients({ 
            page: newPage, 
            sortField, 
            searchKey, 
            searchValue 
        }));
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
                        <th>Lifestyle Plan</th>
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
                                        alt={`${patient?.firstName} ${patient?.lastName}`}
                                        src={
                                            patient?.profilePicture || '/static/images/avatar/1.jpg'
                                        }
                                    />
                                    {patient?.firstName} {patient?.lastName}
                                </div>
                            </td>
                            <td>{patient?.phone}</td>
                            <td>{patient?.email}</td>
                            <td>{patient?.dob}</td>
                            <td>{patient?.planName  && patient?.planName || 'No Plan Assigned'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
    count={Math.ceil(totalPatients / patientsPerPage)} // Calculate the total number of pages
    page={currentPage} // Controlled pagination component
    onChange={handlePageChange} // Passes both event and page number
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
