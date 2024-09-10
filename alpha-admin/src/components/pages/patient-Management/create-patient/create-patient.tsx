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
            // Define dateField as 'day' | 'month' | 'year'
            const dateField = field.split('.')[1] as 'day' | 'month' | 'year';

            // Create a temporary object to hold the updated value
            const updatedDateOfBirth = {
                ...formValues.dateOfBirth,
                [dateField]: value, // Update the correct part of the dateOfBirth
            };

            setFormValues((prevValues) => ({
                ...prevValues,
                dateOfBirth: updatedDateOfBirth,
            }));

            // Check if all parts of the date of birth are filled
            const { day, month, year } = updatedDateOfBirth;

            if (day && month && year) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    dateOfBirth: '', // Clear error when all date fields are filled
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
            return; // Do not proceed if there are errors
        }

        const formattedDay = formValues.dateOfBirth.day.padStart(2, '0');
        const formattedMonth = formValues.dateOfBirth.month.padStart(2, '0');
        const dob = `${formValues.dateOfBirth.year}-${formattedMonth}-${formattedDay}`;

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
            const response = await dispatch(addNewPatient(patientData)).unwrap();

            if (response) {
                toast.success('Patient profile created.');
                navigate('/patient-profile');
                setOpenModal(true);
            }
        } catch (error: any) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                phoneNumber: 'Phone number already exists',
            }));
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
                                placeholder="Last name"
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
                                placeholder="Phone number"
                                type="text"
                                value={formValues.phoneNumber}
                                onChange={(e) => {
                                    setFormErrors((prevErrors) => ({
                                        ...prevErrors,
                                        phoneNumber: '', // Clear error when user types
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
                                placeholder="Email address"
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
                                        })); // Clear error when value is selected
                                    }
                                }}
                                MenuProps={MenuProps}
                                className={classNames({
                                    'Mui-error': !!formErrors.gender, // Apply the error class if there’s an error
                                })}
                                renderValue={(selected: unknown) => {
                                    if (!selected || selected === '') {
                                        return (
                                            <span className={styles['placeholder']}>Gender</span>
                                        ); // Placeholder when no value is selected
                                    }
                                    return String(selected); // Display the selected value
                                }}
                            >
                                {['Male', 'Female', 'Non-Binary'].map((option) => (
                                    <CoustomMenuItem key={option} value={option}>
                                        {option}
                                    </CoustomMenuItem>
                                ))}
                            </CustomizedSelects>

                            {formErrors.gender && ( // Only render the error message once
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
                                        [styles['error-field']]: formErrors.dateOfBirth, // Highlight error if there’s an error
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
                                placeholder="Address"
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
                                placeholder="Height"
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
                                placeholder="Weight"
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
                            setFormErrors((prevErrors) => ({ ...prevErrors, consent: '' })); // Clear error
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
                    handleButton={() => navigate('/careteam/editcareteam')}
                />
            )}
        </>
    );
};
