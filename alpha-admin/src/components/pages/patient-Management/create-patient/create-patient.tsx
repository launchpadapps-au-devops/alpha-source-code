import classNames from 'classnames';
import styles from './create-patient.module.scss';
import { useState, useEffect } from 'react';
import { InputFieldLabel } from '../../../input-field-label/input-field-label';
import { InputField } from '../../../input-field/input-field';
import { CoustomMenuItem, CustomizedSelects, MenuProps } from '../../../mui-select-style';
import { FormSucessModal } from '../../../form-sucess-modal/form-sucess-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../app/store';
import { Checkbox } from '@mui/material';
import { addNewPatient } from '../patientsSlice';
import { toast } from 'react-toastify';
import { AppButton } from '../../../app-button/app-button';
import Sidebar from '../../content/content-components/sidebar/Sidebar';
import { SidebarPatient } from '../patient-sidebar/patientSidebar';

export interface CreatePatientProps {
    className?: string;
}

export interface CreatePatientData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: string;
    dob: string;
    address: string;
    height: number;
    weight: number;
    bmi: number;
    patientDetailsEditConsent: boolean;
}

export const CreatePatient = ({ className }: CreatePatientProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: { day: '', month: '', year: '' },
        address: '',
        height: '',
        weight: '',
        bmi: '',
        patientConsent: false,
    });

    const [openModal, setOpenModal] = useState(false);

    // Automatically calculate BMI when height or weight changes
    useEffect(() => {
        const { height, weight } = formValues;
        if (height && weight) {
            const heightInMeters = Number(height) / 100; // convert cm to meters
            const bmi = (Number(weight) / (heightInMeters * heightInMeters)).toFixed(2);
            setFormValues((prevValues) => ({
                ...prevValues,
                bmi: bmi.toString(),
            }));
        }
    }, [formValues.height, formValues.weight]);

    const handleChange = (field: string, value: any) => {
        if (field.startsWith('dateOfBirth.')) {
            const dateField = field.split('.')[1];
            setFormValues((prevValues) => ({
                ...prevValues,
                dateOfBirth: {
                    ...prevValues.dateOfBirth,
                    [dateField]: value,
                },
            }));
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                [field]: value,
            }));
        }
    };

    const handleFormSuccessModal = async () => {
        const { day, month, year } = formValues.dateOfBirth;

        if (!day || !month || !year) {
            alert('Please enter a valid date of birth');
            return;
        }

        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');

        const dob = `${year}-${formattedMonth}-${formattedDay}`;

        const patientData: CreatePatientData = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phone: formValues.phoneNumber,
            email: formValues.email,
            gender: formValues.gender,
            dob: dob,
            address: formValues.address,
            height: Math.round(Number(formValues.height)),
            weight: Math.round(Number(formValues.weight)),
            bmi: Math.round(Number(formValues.bmi)),
            patientDetailsEditConsent: formValues.patientConsent,
        };

        try {
            console.log('Patient Data:', JSON.stringify(patientData)); // Debugging output
            await dispatch(addNewPatient(patientData));
            toast.success('Patient profile created.');
            navigate('/patient-profile')
            setOpenModal(true);
        } catch (error) {
            console.error('Error adding patient:', error);
            toast.error('Failed to create patient profile.');
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/careteam');
    };

    return (
        <>
        <SidebarPatient/>
            <div className={classNames(styles['create-team-wrapper'], className)}>
                <div>
                    <h2>Create new patient</h2>
                    <br />
                    <h4>Personal Details</h4>
                    <br />
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
                                value={formValues.gender}
                                displayEmpty
                                onChange={(e) => handleChange('gender', e.target.value as string)}
                                MenuProps={MenuProps}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Gender</em>;
                                    }
                                    return selected as string;
                                }}
                            >
                                {['Male', 'Female', 'Non-Binary'].map((option) => (
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
                                    onChange={(e) =>
                                        handleChange('dateOfBirth.day', e.target.value)
                                    }
                                    className={styles['dob-input']}
                                />
                                <InputField
                                    id="dob-month"
                                    name="Month"
                                    placeholder="MM"
                                    type="text"
                                    value={formValues.dateOfBirth.month}
                                    onChange={(e) =>
                                        handleChange('dateOfBirth.month', e.target.value)
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
                                        handleChange('dateOfBirth.year', e.target.value)
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
                        <div className={classNames(styles['input-wrapper'])}>
                            <InputFieldLabel labelText="BMI (calculated automatically)" />
                            <InputField
                                id="bmi"
                                name="BMI"
                                placeholder="BMI"
                                type="text"
                                value={formValues.bmi}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['consent-wrapper']}>
                    <Checkbox
                        id="patient-consent"
                        checked={formValues.patientConsent}
                        onChange={(e) => handleChange('patientConsent', e.target.checked)}
                        className={styles['circle-checkbox']}
                        color="primary"
                    />

                    <label htmlFor="patient-consent" className={styles['consent-label-djnin']}>
                        I confirm that I have the patient’s consent to edit their details with
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
                <div className={styles['button-action-wrapper']}>
                    <AppButton
                        buttonText="Cancel"
                        onButtonClick={() => navigate('/careteam')}
                        //className={classNames(AppButton_module['button-no-decoration'])}
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
