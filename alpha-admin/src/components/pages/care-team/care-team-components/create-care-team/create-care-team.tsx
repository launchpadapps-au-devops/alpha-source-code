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
import { addNewStaffThunk } from './create-care-teamSlice';

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
        { id: 2, name: 'Create Team Member' }]);

    const [openModal, setOpenModal] = useState(false);

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        permission: '',
    });

    const handleChange = (field: string, value: string) => {
        console.log(`Field: ${field}, Value: ${value}`);
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleFormSuccessModal = () => {
        const roleId = formValues.role ? parseInt(formValues.role, 10) : null;
        const permissionId = formValues.permission ? parseInt(formValues.permission, 10) : null;

        console.log(`Role ID: ${roleId}, Permission ID: ${permissionId}`);

        if (roleId === null || permissionId === null) {
            alert('Please select a valid role and permission');
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
            permissions: [permissionId]
        };
        console.log('Payload data:', data);
        dispatch(addNewStaffThunk(data));
        navigate('/careteam');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/careteam');
    };

    return (
        <>
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
                    handleButton={() => navigate('/careteam/editcareteam')}
                />
            )}
        </>
    );
};
