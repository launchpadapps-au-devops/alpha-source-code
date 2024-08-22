import classNames from 'classnames';
import styles from './create-patient.module.scss';
import { useState } from 'react';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { CoustomMenuItem, CustomizedSelects, MenuProps } from '../../../../mui-select-style';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import { FormSucessModal } from '../../../../form-sucess-modal/form-sucess-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../app/store';
import { Checkbox, Radio } from '@mui/material';

export interface CreatePatientProps {
    className?: string;
}

export const CreatePatient = ({ className }: CreatePatientProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [roles, SetRoles] = useState([
        { id: 1, name: 'Nurse', description: 'Nurse role' },
        { id: 2, name: 'MPA', description: 'Medical Practitioner Assistant role' },
        { id: 3, name: 'Content Creator', description: 'Content Creator role' },
        { id: 4, name: 'GP', description: 'General Practitioner role' },
    ]);

    const [permissions, SetPermissions] = useState([
        { id: 1, name: 'Super Admin' },
        { id: 2, name: 'Care Team Member' },
    ]);

    const [openModal, setOpenModal] = useState(false);

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        permission: '',
        gender: '',
        dateOfBirth: { day: '', month: '', year: '' },
        address: '',
        height: '',
        weight: '',
        bmi: '',
        patientConsent: false,
    });

    const handleChange = (field: string, value: string) => {
        console.log(`Field: ${field}, Value: ${value}`);
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleFormSuccessModal = () => {
        // const roleId = formValues.role ? parseInt(formValues.role, 10) : null;
        // const permissionId = formValues.permission ? parseInt(formValues.permission, 10) : null;
        // console.log(`Role ID: ${roleId}, Permission ID: ${permissionId}`);
        // if (roleId === null || permissionId === null) {
        //     alert('Please select a valid role and permission');
        //     return;
        // }
        // const data = {
        //     userData: {
        //         firstName: formValues.firstName,
        //         lastName: formValues.lastName,
        //         email: formValues.email,
        //         phone: formValues.phoneNumber,
        //         roleId: roleId,
        //     },
        //     permissions: [permissionId]
        // };
        // console.log('Payload data:', data);
        // dispatch(addNewStaffThunk(data));
        // navigate('/careteam');
    };

    const handleCloseModal = () => {
        // setOpenModal(false);
        // navigate('/careteam');
    };

    return (
        <>
            <div className={classNames(styles['create-team-wrapper'], className)}>
                <div>
                    <h2>Create new patient</h2>
                    <br></br>
                    <h4>Personal Details</h4>
                    <br></br>
                    <div className={styles['form-grid-layout']}>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="First name" />
                            <InputField
                                id="first-name"
                                name="First name"
                                placeholder="First name"
                                type="text"
                                value={formValues.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Last name" />
                            <InputField
                                id="last-name"
                                name="Last name"
                                placeholder="Last name"
                                type="text"
                                value={formValues.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Phone number" />
                            <InputField
                                id="phone-number"
                                name="Phone number"
                                placeholder="Phone number"
                                type="text"
                                value={formValues.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Email address" />
                            <InputField
                                id="email-address"
                                name="Email address"
                                placeholder="Email address"
                                type="email"
                                value={formValues.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Gender" />
                            <CustomizedSelects
                                id="gender"
                                value={formValues.gender || 'Gender'}
                                onChange={(e) => handleChange('gender', e.target.value as string)}
                                MenuProps={MenuProps}
                            >
                                {['Male', 'Female', 'Other'].map((option) => (
                                    <CoustomMenuItem key={option} value={option}>
                                        {option}
                                    </CoustomMenuItem>
                                ))}
                            </CustomizedSelects>
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Date of birth" />
                            <div className={styles['date-of-birth']}>
                                <InputField
                                    id="dob-day"
                                    name="Day"
                                    placeholder="DD"
                                    type="text"
                                    value={formValues.dateOfBirth.day}
                                    onChange={(e) => handleChange('dateOfBirthDay', e.target.value)}
                                    className={styles['dob-input']}
                                />
                                <InputField
                                    id="dob-month"
                                    name="Month"
                                    placeholder="MM"
                                    type="text"
                                    value={formValues.dateOfBirth.month}
                                    onChange={(e) =>
                                        handleChange('dateOfBirthMonth', e.target.value)
                                    }
                                    className={styles['dob-input']}
                                />
                                <InputField
                                    id="dob-year"
                                    name="Year"
                                    placeholder="YYYY"
                                    type="text"
                                    value={formValues.dateOfBirth.year}
                                    onChange={(e) =>
                                        handleChange('dateOfBirthYear', e.target.value)
                                    }
                                    className={styles['dob-input']}
                                />
                            </div>
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Address" />
                            <InputField
                                id="address"
                                name="Address"
                                placeholder="Address"
                                type="text"
                                value={formValues.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Height (cm)" />
                            <InputField
                                id="height"
                                name="Height"
                                placeholder="Height"
                                type="text"
                                value={formValues.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Weight (kg)" />
                            <InputField
                                id="weight"
                                name="Weight"
                                placeholder="Weight"
                                type="text"
                                value={formValues.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="BMI (calculated automatically)" />
                            <InputField
                                id="bmi"
                                name="BMI"
                                placeholder="BMI"
                                type="text"
                                value={formValues.bmi}
                                readOnly
                                // Add logic to calculate BMI based on height and weight
                            />
                        </div>
                        <div className={styles['consent-wrapper']}>
                            <Checkbox
                                id="patient-consent"
                                checked={formValues.patientConsent}
                                onChange={(e) =>
                                    handleChange('patientConsent', e.target.checked.toString())
                                }
                                className={styles['circle-checkbox']}
                                color="primary"
                            />

                            <label
                                htmlFor="patient-consent"
                                className={styles['consent-label-djnin']}
                            >
                                I confirm that I have the patient’s consent to edit their details
                                with
                                <span className={styles['nowrap']}>
                                    {' '}
                                    Alpha according to the
                                    <a href="#" className={styles['terms-link']}>
                                        {' '}
                                        Terms & Conditions of Alpha.
                                    </a>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className={styles['button-action-wrapper']}>
                    <AppButton
                        buttonText="Cancel"
                        onButtonClick={() => navigate('/careteam')}
                        className={classNames(AppButton_module['button-no-decoration'])}
                    />
                    <AppButton buttonText="Save Patient" onButtonClick={handleFormSuccessModal} />
                </div>
            </div>
            {openModal && (
                <FormSucessModal
                    open={openModal}
                    descriptionText="Profile has been successfully created and the sign-up link sent to the patient."
                    title="Profile created & link sent"
                    closeModal={handleCloseModal}
                    handleButton={() => navigate('/careteam/editcareteam')}
                />
            )}
        </>
    );
};
