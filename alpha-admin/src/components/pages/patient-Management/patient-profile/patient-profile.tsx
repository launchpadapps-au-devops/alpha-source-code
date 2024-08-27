import classNames from 'classnames';
import styles from './patient-profile.module.scss';
import Avatar from '@mui/material/Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { AppButton } from '../../../app-button/app-button';
import { SidebarPatient } from '../patient-sidebar/patientSidebar';

export interface PatientProfileProps {
    className?: string;
}

export const PatientProfile = ({ className }: PatientProfileProps) => {
    const navigate = useNavigate();
    const params = useParams();

    const [member, setMember] = React.useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        fullName: '',
        phone: '',
        role: {
            id: '',
            name: '',
        },
        permissions: [
            {
                id: '',
                name: '',
            },
        ],
    });

    const dummydata = {
        id: 6,
        email: 'alpha@alpha.com.au',
        firstName: 'Nahid',
        lastName: 'Hasan',
        fullName: 'Nahid Hasan',
        phone: '0483 987 738',
        role: {
            id: 1,
            name: 'Male',
        },
        age: '37 years 03 months',
        height: '170cm',
        weight: '75kg',
        bmi: '25.95',
        address: '10 Gumtree court, Sydney, NSW, 2001',
    };

    const handleEditClick = (memberId: string) => {
        navigate(`/careteam/editteamcare/${memberId}`);
    };

    return (
        <>
        <SidebarPatient/>
        <div className={classNames(styles['care-team-profile'], className)}>
            <div className={styles['top-header-block']}>
                <h2>Patient Profile</h2>
                <AppButton
                    className={styles['edit-profile-button']} // Add this class
                    buttonText="Edit profile"
                    showLeftIcon
                    icon="edit"
                    onButtonClick={() => handleEditClick(member.id)}
                />
            </div>
            <div className={styles['profile-detail-wrapper']}>
                <div className={styles['left-profile-block']}>
                    <Avatar className={styles['profile-image']} src="" />
                    <div className={styles['profile-info']}>
                        <span className={styles['profile-name']}>
                            {dummydata.firstName} {dummydata.lastName}
                        </span>
                        <br></br>
                        <br></br>
                        <span className={styles['profile-role']}>{dummydata.role.name}</span>
                        <br></br>
                        <br></br>
                        <span className={styles['profile-age']}>{dummydata.age}</span>
                    </div>
                    <div className={styles['add-plan-button']}>Add lifestyle plan</div>
                    <div className={styles['profile-stats']}>
                        <div>
                            <span className={styles['stat-label']}>Height</span>
                            <span className={styles['stat-value']}>{dummydata.height}</span>
                            <br></br>
                            <br></br>
                        </div>
                        <div>
                            <span className={styles['stat-label']}>Weight</span>
                            <span className={styles['stat-value']}>{dummydata.weight}</span>
                            <br></br>
                            <br></br>
                        </div>
                        <div>
                            <span className={styles['stat-label']}>BMI</span>
                            <span className={styles['stat-value']}>{dummydata.bmi}</span>
                        </div>
                    </div>
                </div>

                <div className={styles['right-profile-block']}>
                    <h3>Personal details</h3>
                    <div className={styles['details-block']}>
                        <div className={styles['profile-details-wrapper']}>
                            <span className={styles['label']}>Email</span>
                            <span className={styles['details']}>{dummydata.email}</span>
                        </div>
                        <div className={styles['profile-details-wrapper']}>
                            <span className={styles['label']}>Phone</span>
                            <span className={styles['details']}>{dummydata.phone}</span>
                        </div>
                        <div className={styles['profile-details-wrapper']}>
                            <span className={styles['label']}>Address</span>
                            <span className={styles['details']}>{dummydata.address}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
