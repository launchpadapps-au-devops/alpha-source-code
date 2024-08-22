import classNames from 'classnames';
import styles from './patientsTable.module.scss';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../app/store';
import { fetchPatients } from './patientsSlice';
import { Patient } from './patientsAPI';

export interface PatientsTableProps {
    className?: string;
}

export const PatientsTable = ({ className }: PatientsTableProps) => {
    // Directly accessing the patients array from state.patients
    const patients = useSelector((state: RootState) => state.patients.patients.patients);


    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPatients());
    }, [dispatch]);

    const handleEditClick = (patientId: string) => {
        navigate(`/patient/profile/${patientId}`);
    };

    return (
        <>
            <table className={classNames(styles['key-contacts-table'])}>
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
                        <tr key={index}>
                            <td >
                                <div className={styles['flex-table-column']}>
                                    <Avatar
                                        className={styles['profile-image']}
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        src={patient.profilePicture || "/static/images/avatar/1.jpg"}
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
                count={10} 
                showFirstButton 
                showLastButton
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
