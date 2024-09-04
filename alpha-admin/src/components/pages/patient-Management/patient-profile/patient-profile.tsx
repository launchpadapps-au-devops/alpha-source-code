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

  const patientId = localStorage.getItem('selectedPatientId');

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
    ageYears: 0,
    ageMonths: 0,
    planName: '',
    startDate: '',
  });

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    } else if (ageMonths === 0 && today.getDate() < birthDate.getDate()) {
      ageYears--;
      ageMonths = 11;
    }

    return { ageYears, ageMonths };
  };

  const  handleClick = () => {
    navigate('/patient-dashboard/patient-lifestyle-plan')
  }
  useEffect(() => {
    if (patientId) {
      const fetchProfile = async () => {
        try {
          const response = await getPatientProfile(patientId);
          const patientData = response.data;

          const { ageYears, ageMonths } = calculateAge(patientData.dob);
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
            ageYears: ageYears,
            ageMonths: ageMonths,
            planName: patientData.planName,
            startDate: patientData.startDate,
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
              <br/>
              <br />
              <span className={styles['profile-role']}>{member.gender}</span>
              <br />
              {member.ageYears && (
                <span className={styles['profile-age']}>
                  {member.ageYears} years {member.ageMonths} months
                </span>
              )}
              <br />
              {member.planName && member.startDate ? (
                <>
                 <br/>
                  <span  className={styles['profile-age']}>{member.planName}</span>
                  <br />
                  <span  className={styles['profile-age']}>Since {new Date(member.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <div className={styles['profile-buttons']}>
                    <AppButton
                      buttonText="Send link to patient"
                      className={styles['primary-button']}
                    />
                    <AppButton
                      buttonText="Change lifestyle plan"
                      className={styles['secondary-button']}
                      onButtonClick={handleClick}
                    />
                  </div>
                </>
              ) : (
                <div className={styles['no-plan']}>
                 
                  <div className={styles['profile-buttons']}>
                    <AppButton
                      buttonText="Add lifestyle plan"
                      className={styles['primary-button']}
                      onButtonClick={handleClick}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles['profile-stats']}>
              <div>
                <span className={styles['stat-label']}>Height:</span> <span className={styles['stat-value']}> {member.height} {member.heightUnit}</span>
              </div>
              <div>
                <span className={styles['stat-label']}>Weight:</span><span className={styles['stat-value']}> {member.weight} {member.weightUnit}</span>
              </div>
              <div>
                <span className={styles['stat-label']}>BMI:</span><span className={styles['stat-value']}> {member.bmi}</span>
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
