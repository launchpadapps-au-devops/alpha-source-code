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
import TableFooter from '../../../content/content-components/table-footer/TableFooter';

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

    const handleNextPage = () => {
        console.log('currentPage', currentPage);
        dispatch(staffThunk(currentPage + 1)).then((res: any) => {
            console.log('res', res);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const handlePreviousPage = () => {
        dispatch(staffThunk(currentPage - 1)).then((res: any) => {
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage - 1, totalPages));
    };

    useEffect(() => {
        dispatch(staffThunk(1)).then((response: any) => {
            if (response.payload) {
                setTotalPages(response.payload.meta.totalPages);
                setTotalRecords(response.payload.meta.totalRecords);
            }
        });
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
            <div className={styles.pagination}>
                <TableFooter
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
};
