import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import classNames from 'classnames';
import styles from './patient-profile.module.scss';
import Avatar from '@mui/material/Avatar';
import { AppButton } from '../../../app-button/app-button';
import { SidebarPatient } from '../patient-sidebar/patientSidebar';
import { getPatientProfile } from '../patientsAPI';


export interface PatientProfileProps {
    className?: string;
}

export const PatientProfile = ({ className }: PatientProfileProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const patients = useSelector((state: RootState) => state.patients.patients);

     const patientId =  localStorage.getItem('selectedPatientId');

    const [member, setMember] = React.useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        fullName: '',
        phone: '',
        profilePicture: '',
        gender: '',
        dob: '',
        height: 0,
        heightUnit: '',
        weight: 0,
        weightUnit: '',
        bmi: 0,
    });

    useEffect(() => {
        if (patientId) {
            const fetchProfile = async () => {
                try {
                    const response = await getPatientProfile(patientId);
                    const patientData = response.data;

                    setMember({
                        id: patientData.id,
                        email: patientData.email,
                        firstName: patientData.firstName,
                        lastName: patientData.lastName,
                        fullName: `${patientData.firstName} ${patientData.lastName}`,
                        phone: patientData.phone,
                        profilePicture: patientData.profilePicture,
                        gender: patientData.gender,
                        dob: patientData.dob,
                        height: patientData.height,
                        heightUnit: patientData.heightUnit,
                        weight: patientData.weight,
                        weightUnit: patientData.weightUnit,
                        bmi: patientData.bmi,
                    });
                } catch (error) {
                    console.error("Error fetching patient profile:", error);
                }
            };

            fetchProfile();
        }
    }, [patientId]);

    const handleEditClick = (memberId: string) => {
        navigate(`/careteam/editteamcare/${memberId}`);
    };

    return (
        <>
            <SidebarPatient />
            <div className={classNames(styles['care-team-profile'], className)}>
                <div className={styles['top-header-block']}>
                    <h2>Patient Profile</h2>
                    <AppButton
                        className={styles['edit-profile-button']}
                        buttonText="Edit profile"
                        showLeftIcon
                        icon="edit"
                        onButtonClick={() => handleEditClick(member.id)}
                    />
                </div>
                <div className={styles['profile-detail-wrapper']}>
                    <div className={styles['left-profile-block']}>
                        <Avatar className={styles['profile-image']} src={member.profilePicture || ""} />
                        <div className={styles['profile-info']}>
                            <span className={styles['profile-name']}>
                                {member.firstName} {member.lastName}
                            </span>
                            <br />
                            <span className={styles['profile-role']}>{member.gender}</span>
                            <br />
                            <span className={styles['profile-age']}>{member.fullName}</span>
                        </div>
                        <div className={styles['add-plan-button']}>Add lifestyle plan</div>
                        <div className={styles['profile-stats']}>
                            <div>
                                <span className={styles['stat-label']}>Height: {member.height} {member.heightUnit}</span>
                            </div>
                            <div>
                                <span className={styles['stat-label']}>Weight: {member.weight} {member.weightUnit}</span>
                            </div>
                            <div>
                                <span className={styles['stat-label']}>BMI: {member.bmi}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['right-profile-block']}>
                        <h3>Personal details</h3>
                        <div className={styles['details-block']}>
                            <div className={styles['profile-details-wrapper']}>
                                <span className={styles['label']}>Email</span>
                                <span className={styles['details']}>{member.email}</span>
                            </div>
                            <div className={styles['profile-details-wrapper']}>
                                <span className={styles['label']}>Phone</span>
                                <span className={styles['details']}>{member.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
