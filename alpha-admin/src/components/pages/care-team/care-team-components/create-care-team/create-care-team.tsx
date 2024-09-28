import classNames from 'classnames';
import styles from './create-care-team.module.scss';
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
import { addNewStaffThunk, inviteStaffThunk } from './create-care-teamSlice';
import { BackButton } from '../../../../back-button/backButton';
import React from 'react';

export interface CreateCareTeamProps {
    className?: string;
}

export const CreateCareTeam = ({ className }: CreateCareTeamProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [roles, SetRoles] = useState([{ id: 1, name: 'Nurse', description: 'Nurse role' },
        { id: 2, name: 'MPA', description: 'Medical Practitioner Assistant role' },
        { id: 3, name: 'Content Creator', description: 'Content Creator role' },
        { id: 4, name: 'GP', description: 'General Practitioner role' },]);

    const [permissions, SetPermissions] = useState([{ id: 1, name: 'Super Admin' },
        { id: 2, name: 'Care Team Member' }]);

    const [openModal, setOpenModal] = useState(false);
    const [errors, setErrors] = React.useState<any>({});

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        permission: '',
    });

    const roleId = formValues.role ? parseInt(formValues.role, 10) : null;
    const permissionId = formValues.permission ? parseInt(formValues.permission, 10) : null;

    console.log(`Role ID: ${roleId}, Permission ID: ${permissionId}`);

    const handleChange = (field: string, value: string) => {
        console.log(`Field: ${field}, Value: ${value}`);
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const validateFields = () => {
        let fieldErrors: any = {};

        if (!formValues.firstName) {
            fieldErrors = { ...fieldErrors, firstName: 'First name is required' };
        }
        if (!formValues.lastName) {
            fieldErrors = { ...fieldErrors, lastName: 'Last name is required' };
        }
        if (!formValues.email) {
            fieldErrors = { ...fieldErrors, email: 'Email is required' };
        }
        if (!formValues.phoneNumber) {
            fieldErrors = { ...fieldErrors, phoneNumber: 'Phone number is required' };
        }
        if (!roleId) {
            fieldErrors = { ...fieldErrors, role: 'Role is required' };
        }
        if (!permissionId) {
            fieldErrors = { ...fieldErrors, permission: 'Permission is required' };
        }
        setErrors(fieldErrors);

        return Object.keys(fieldErrors).length === 0;
    }

    const handleFormSuccessModal = () => {
            // Validate fields before submitting
    if (!validateFields()) {
        // Validation failed, show errors
        console.log('Validation failed', errors);
        return; // Prevent submission if validation fails
    }


    
        if (roleId === null || permissionId === null) {
            // alert('Please select a valid role and permission');
            return;
        }
    
        const data = {
            userData: {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                email: formValues.email,
                phone: formValues.phoneNumber,
                roleId: roleId,
            },
            permissions: [permissionId],
        };
        console.log('Payload data:', data);


        // Validate fields before submitting
        if (!validateFields()) {
        // Dispatch addNewStaffThunk and handle the response to get staffId
        dispatch(addNewStaffThunk(data)).then((response: any) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const staffId = response.payload.data?.id;
                console.log('Staff ID:', staffId); // Log the staff ID to ensure it's correct
    
                // Ensure staffId is not undefined and convert to string
                if (staffId) {
                    // Pass staffId as an object
                    dispatch(inviteStaffThunk({ staffId: String(staffId) })).then((inviteResponse: any) => {
                        if (inviteResponse.meta.requestStatus === 'fulfilled') {
                            setOpenModal(true); // Open the modal after both APIs are successful
                        } else {
                            alert('Failed to send the invitation. Please try again.');
                        }
                    });
                } else {
                    alert('Failed to retrieve staff ID.');
                }
            } else {
                alert('Failed to create profile. Please try again.');
            }
        });
        } else {
            // Validation failed, show errors
            console.log('Validation failed', errors);
        }
    };
    
    
    

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/careteam');
    };

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
        <BackButton onClick={handleBackClick}/>
            <div className={classNames(styles['create-team-wrapper'], className)}>
                <div>
                    <h2>Create new care team member</h2>
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
                                className={errors.firstName ? styles.errorBorder : ''}
                                required
                            />
                            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
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
                                className={errors.lastName ? styles.errorBorder : ''}
                                required
                            />
                            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
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
                                className={errors.phoneNumber ? styles.errorBorder : ''}
                                required
                            />
                            {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
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
                                className={errors.email ? styles.errorBorder : ''}
                                required
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Roles & Permissions</h2>
                    <div className={styles['form-grid-layout']}>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Role" />
                            <CustomizedSelects
                                value={formValues.role}
                                onChange={(e) => handleChange('role', e.target.value as string)}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                                className={errors.role ? styles.error : ''}
                                required
                            >
                                
                                <CoustomMenuItem value="" disabled>
                                    <em>Select role</em>
                                </CoustomMenuItem>
                                {/* {Object.entries(ROLE).map(([id, label]) => (
                                    <CoustomMenuItem key={id} value={id}>
                                        {label}
                                    </CoustomMenuItem>
                                ))} */}
                                {roles.map((role) => (
                                    <CoustomMenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </CoustomMenuItem>
                                ))}

                            </CustomizedSelects>
                            {errors.role && <span className={styles.errorText}>{errors.role}</span>}
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Permissions" />
                            <CustomizedSelects
                                value={formValues.permission}
                                onChange={(e) =>
                                    handleChange('permission', e.target.value as string)
                                }
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                                className={errors.permission ? styles.error : ''}
                                required
                            >
                                
                                <CoustomMenuItem value="" disabled>
                                    <em>Select permission level</em>
                                </CoustomMenuItem>
                                {/* {Object.entries(PERMISSION_LEVEL).map(([id, label]) => (
                                    <CoustomMenuItem key={id} value={id}>
                                        {label}
                                    </CoustomMenuItem>
                                ))} */}
                                {permissions.map((permission) => (
                                    <CoustomMenuItem key={permission.id} value={permission.id}>
                                        {permission.name}
                                    </CoustomMenuItem>
                                ))}
                            </CustomizedSelects>
                            {errors.permission && <span className={styles.errorText}>{errors.permission}</span>}
                        </div>
                    </div>
                </div>
                <div className={styles['button-action-wrapper']}>
                    <AppButton
                        buttonText="Cancel" onButtonClick={() => navigate('/careteam')}
                        className={classNames(AppButton_module['button-no-decoration'])}
                    />
                    <AppButton buttonText="Create profile" onButtonClick={handleFormSuccessModal} />
                </div>
            </div>
            {openModal && (
                <FormSucessModal
                    open={openModal}
                    descriptionText="Profile has been successfully created and the sign up link sent to the patient."
                    title="Profile created & link sent"
                    closeModal={handleCloseModal}
                    handleButton={() => navigate('/careteam')}
                />
            )}
        </>
    );
};
