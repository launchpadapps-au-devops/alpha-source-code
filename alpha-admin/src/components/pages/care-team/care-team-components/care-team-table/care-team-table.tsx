import classNames from 'classnames';
import styles from './care-team-table.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { useEffect, useState } from 'react';
import { staffThunk } from '../create-care-team/create-care-teamSlice';
import { useNavigate } from 'react-router-dom';
import { CustomPagination } from '../../../content/content-components/custom-pagination/customPagination';

export interface CareTeamTableProps {
    className?: string;
}

export const CareTeamTable = ({ className }: CareTeamTableProps) => {
    const { staff, loading, errorMessage } = useSelector((state: RootState) => state.staff.staff);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchStaffData = (page: number) => {
        dispatch(staffThunk(page)).then((res: any) => {
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

    const handleEditClick = (memberId: string) => {
        navigate(`/careteam/careteamprofile/${memberId}`);
    };

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
                            <td>
                                <div className={styles['flex-table-column']}>
                                    <Avatar
                                        className={styles['profile-image']}
                                        src="/static/images/avatar/1.jpg"
                                    />
                                    {member.firstName} {member.lastName}
                                </div>
                            </td>
                            <td>{member.role?.name}</td>
                            <td>{member.permissions?.length > 0 ? member.permissions[0]?.name : null}</td>
                            <td>
                                <AppButton
                                    icon='edit'
                                    className={classNames(AppButton_module['button-no-decoration'], styles['table-icon-button'])}
                                    onButtonClick={() => handleEditClick(member.id)}
                                    showLeftIcon
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={handlePageChange} // Now handles page number click
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
};
