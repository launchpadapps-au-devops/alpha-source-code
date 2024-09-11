import classNames from 'classnames';
import styles from './editPatient.module.scss';
import { useState, useEffect } from 'react';
import { InputFieldLabel } from '../../../input-field-label/input-field-label';
import { InputField } from '../../../input-field/input-field';
import { CoustomMenuItem, CustomizedSelects, MenuProps } from '../../../mui-select-style';
import { FormSucessModal } from '../../../form-sucess-modal/form-sucess-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../app/store';
import { Checkbox } from '@mui/material';
import { toast } from 'react-toastify';
import { AppButton } from '../../../app-button/app-button';
import { SidebarPatient } from '../patient-sidebar/patientSidebar';
import { getPatientProfile, sentInvite } from '../patientsAPI';

export interface EditPatientProps {
    className?: string;
}

export interface EditPatientData {
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

export const EditPatient = ({ className }: EditPatientProps) => {

    const patientId = localStorage.getItem('selectedPatientId');
    
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

    const [formErrors, setFormErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        height: '',
        weight: '',
        consent: '',
    });

    const [openModal, setOpenModal] = useState(false);

    // Fetch patient data when component mounts
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await getPatientProfile(patientId)

                const patientData = response.data;
                setFormValues({
                    firstName: patientData.firstName || '',
                    lastName: patientData.lastName || '',
                    email: patientData.email || '',
                    phoneNumber: patientData.phone || '',
                    gender: patientData.gender || '',
                    dateOfBirth: {
                        day: patientData.dob?.split('-')[2] || '',
                        month: patientData.dob?.split('-')[1] || '',
                        year: patientData.dob?.split('-')[0] || '',
                    },
                    address: patientData.address || '',
                    height: patientData.height || '',
                    weight: patientData.weight || '',
                    bmi: patientData.bmi || '',
                    patientConsent: false,
                });
            } catch (error) {
                console.error('Error fetching patient profile:', error);
            }
        };

        fetchPatientData();
    }, [dispatch]);

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
            const dateField = field.split('.')[1] as 'day' | 'month' | 'year';
            const updatedDateOfBirth = {
                ...formValues.dateOfBirth,
                [dateField]: value,
            };

            setFormValues((prevValues) => ({
                ...prevValues,
                dateOfBirth: updatedDateOfBirth,
            }));

            const { day, month, year } = updatedDateOfBirth;
            if (day && month && year) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    dateOfBirth: '',
                }));
            }
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                [field]: value,
            }));
        }
    };

    const handleFormSuccessModal = async () => {
        let hasError = false;

        // Validate fields
        if (!formValues.firstName) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                firstName: 'First name is required',
            }));
            hasError = true;
        }

        if (!formValues.lastName) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                lastName: 'Last name is required',
            }));
            hasError = true;
        }

        if (!formValues.phoneNumber) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                phoneNumber: 'Phone number is required',
            }));
            hasError = true;
        }

        if (!formValues.email) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Email is required',
            }));
            hasError = true;
        }

        if (!formValues.gender) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                gender: 'Gender is required',
            }));
            hasError = true;
        }

        if (
            !formValues.dateOfBirth.day ||
            !formValues.dateOfBirth.month ||
            !formValues.dateOfBirth.year
        ) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                dateOfBirth: 'Date of birth is required',
            }));
            hasError = true;
        }

        if (!formValues.address) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                address: 'Address is required',
            }));
            hasError = true;
        }

        if (!formValues.height) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                height: 'Height is required',
            }));
            hasError = true;
        }

        if (!formValues.weight) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                weight: 'Weight is required',
            }));
            hasError = true;
        }

        if (!formValues.patientConsent) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                consent: 'Patient consent is required',
            }));
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const formattedDay = formValues.dateOfBirth.day.padStart(2, '0');
        const formattedMonth = formValues.dateOfBirth.month.padStart(2, '0');
        const dob = `${formValues.dateOfBirth.year}-${formattedMonth}-${formattedDay}`;

        const patientData: EditPatientData = {
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
            console.log('Patient Data:', JSON.stringify(patientData));

            //const result = await dispatch(addNewPatient(patientData)).unwrap();

            // const patientId = result.data.id;

            // console.log('Result:', result.data.id);
            // console.log('Patient ID:', patientId);
            // await sentInvite(patientId);

            toast.success('Patient profile created and invite sent.');

            setOpenModal(true);
        } catch (error) {
            console.error('Error adding patient or sending invite:', error);
            toast.error('Failed to create patient profile or send invite.');
        }
    };

    const handleCancel = () => {
        setFormValues({
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

        setFormErrors({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            gender: '',
            dateOfBirth: '',
            address: '',
            height: '',
            weight: '',
            consent: '',
        });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/careteam');
    };

    return (
        <>
            <SidebarPatient />
            <div className={classNames(styles['create-team-wrapper'], className)}>
                <div>
                    <h2>Edit Patient Profile</h2>
                    <br />
                    <div className={styles['form-grid-layout']}>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="First name" />
                            <InputField
                                id="first-name"
                                name="First name"
                                placeholder={formValues.firstName || 'First name'}
                                type="text"
                                value={formValues.firstName}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({
                                        ...prevErrors,
                                        firstName: '',
                                    }));
                                    handleChange('firstName', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.firstName,
                                })}
                            />
                            {formErrors.firstName && (
                                <div className={styles['error-message']}>
                                    {formErrors.firstName}
                                </div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Last name" />
                            <InputField
                                id="last-name"
                                name="Last name"
                                placeholder={formValues.lastName || 'Last name'}
                                type="text"
                                value={formValues.lastName}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({
                                        ...prevErrors,
                                        lastName: '',
                                    }));
                                    handleChange('lastName', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.lastName,
                                })}
                            />
                            {formErrors.lastName && (
                                <div className={styles['error-message']}>{formErrors.lastName}</div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Phone number" />
                            <InputField
                                id="phone-number"
                                name="Phone number"
                                placeholder={formValues.phoneNumber || 'Phone number'}
                                type="text"
                                value={formValues.phoneNumber}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({
                                        ...prevErrors,
                                        phoneNumber: '',
                                    }));
                                    handleChange('phoneNumber', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.phoneNumber,
                                })}
                            />
                            {formErrors.phoneNumber && (
                                <div className={styles['error-message']}>
                                    {formErrors.phoneNumber}
                                </div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Email address" />
                            <InputField
                                id="email-address"
                                name="Email address"
                                placeholder={formValues.email || 'Email address'}
                                type="email"
                                value={formValues.email}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                                    handleChange('email', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.email,
                                })}
                            />
                            {formErrors.email && (
                                <div className={styles['error-message']}>{formErrors.email}</div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Gender" />
                            <CustomizedSelects
                                id="gender"
                                value={formValues.gender}
                                displayEmpty
                                onChange={(e) => {
                                    handleChange('gender', e.target.value);
                                    if (e.target.value) {
                                        setFormErrors((prevErrors) => ({
                                            ...prevErrors,
                                            gender: '',
                                        }));
                                    }
                                }}
                                MenuProps={MenuProps}
                                className={classNames({
                                    'Mui-error': !!formErrors.gender,
                                })}
                                renderValue={(selected: unknown) => {
                                    if (!selected || selected === '') {
                                        return (
                                            <span className={styles['placeholder']}>Gender</span>
                                        );
                                    }
                                    return String(selected);
                                }}
                            >
                                {['Male', 'Female', 'Non-Binary'].map((option) => (
                                    <CoustomMenuItem key={option} value={option}>
                                        {option}
                                    </CoustomMenuItem>
                                ))}
                            </CustomizedSelects>

                            {formErrors.gender && (
                                <div className={styles['error-message']}>{formErrors.gender}</div>
                            )}
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
                                    className={classNames(styles['dob-input'], {
                                        [styles['error-field']]: formErrors.dateOfBirth,
                                    })}
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
                                    className={classNames(styles['dob-input'], {
                                        [styles['error-field']]: formErrors.dateOfBirth,
                                    })}
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
                                    className={classNames(styles['dob-input'], {
                                        [styles['error-field']]: formErrors.dateOfBirth,
                                    })}
                                />
                            </div>
                            {formErrors.dateOfBirth && (
                                <div className={styles['error-message']}>
                                    {formErrors.dateOfBirth}
                                </div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Address" />
                            <InputField
                                id="address"
                                name="Address"
                                placeholder={formValues.address || 'Address'}
                                type="text"
                                value={formValues.address}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({ ...prevErrors, address: '' }));
                                    handleChange('address', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.address,
                                })}
                            />
                            {formErrors.address && (
                                <div className={styles['error-message']}>{formErrors.address}</div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Height (cm)" />
                            <InputField
                                id="height"
                                name="Height"
                                placeholder={formValues.height || 'Height'}
                                type="text"
                                value={formValues.height}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({ ...prevErrors, height: '' }));
                                    handleChange('height', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.height,
                                })}
                            />
                            {formErrors.height && (
                                <div className={styles['error-message']}>{formErrors.height}</div>
                            )}
                        </div>

                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Weight (kg)" />
                            <InputField
                                id="weight"
                                name="Weight"
                                placeholder={formValues.weight || 'Weight'}
                                type="text"
                                value={formValues.weight}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({ ...prevErrors, weight: '' }));
                                    handleChange('weight', e.target.value);
                                }}
                                className={classNames({
                                    [styles['error-field']]: formErrors.weight,
                                })}
                            />
                            {formErrors.weight && (
                                <div className={styles['error-message']}>{formErrors.weight}</div>
                            )}
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
                        onChange={(e) => {
                            setFormErrors((prevErrors) => ({ ...prevErrors, consent: '' }));
                            handleChange('patientConsent', e.target.checked);
                        }}
                        color="primary"
                    />
                    <label htmlFor="patient-consent" className={styles['consent-label-djnin']}>
                        I confirm that I have the patient’s consent to edit their details with Alpha
                        according to the&nbsp;
                        <span className={styles['nowrap']}>
                            <a href="#" className={styles['terms-link']}>
                                Terms & Conditions of Alpha.
                            </a>
                        </span>
                    </label>
                </div>

                <div className={styles['button-action-wrapper']}>
                    <AppButton buttonText="Cancel" onButtonClick={handleCancel} />
                    <AppButton buttonText="Save Patient" onButtonClick={handleFormSuccessModal} />
                </div>
            </div>

            {openModal && (
                <FormSucessModal
                    open={openModal}
                    descriptionText="Profile has been successfully created and the sign-up link sent to the patient."
                    title="Profile created & link sent"
                    closeModal={handleCloseModal}
                    handleButton={() => navigate('/patient-profile')}
                />
            )}
        </>
    );
};

