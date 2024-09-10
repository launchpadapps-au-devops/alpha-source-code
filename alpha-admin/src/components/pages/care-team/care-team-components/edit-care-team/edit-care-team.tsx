import classNames from 'classnames';
import styles from './edit-care-team.module.scss';
import { useEffect, useState } from 'react';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { CoustomMenuItem, CustomizedSelects, MenuProps } from '../../../../mui-select-style';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import { FormSucessModal } from '../../../../form-sucess-modal/form-sucess-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../app/store';
import { editStaffThunk } from './edit-care-teamSlice';
import { getStaffRoleThunk } from '../create-care-team/create-care-teamSlice';
import { BackButton } from '../../../../back-button/backButton';

export const ROLE = {
    Nurse: 'Nurse',
    MPA: 'MPA',
    'Content Creator': 'Content Creator',
    'Other role': 'Other role',
    GP: 'GP',
};

export const PERMISSION_LEVEL = {
    'Super admin': 'Super admin',
    'Care team member': 'Care team member',
};

export interface EditCareTeamProps {
    className?: string;
}
type Permission = { id: number; name: string };

export const EditCareTeam = ({ className }: EditCareTeamProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();

    const [openModal, setOpenModal] = useState(false);
    const [permissions, SetPermissions] = useState([
        { id: 1, name: 'Super Admin' },
        { id: 2, name: 'Care Team Member' },
    ]);

    const [formValues, setFormValues] = useState<{
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        roleId: string;
        permissions: Permission[];
    }>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        roleId: '',
        permissions: [],
    });

    useEffect(() => {
        dispatch(getStaffRoleThunk(params.id)).then((response) => {
            const data = response.payload.data;

            // Extract permissions names and role ID
            const permissions = data.permissions.map((permission: any) => permission);
            // console.log('Permissions:', permissions);
            const roleId = data.role.name;

            setFormValues({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                roleId: roleId,
                permissions: permissions,
            });

            console.log('Form Values Set:', {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                roleId: roleId,
                permissions: permissions,
            });
        });
    }, [dispatch, params.id]);

    // console.log('Current Form Values:', formValues);

    const handleChange = (field: string, value: any) => {
        console.log(`Field: ${field}, Value: ${value}`);
        if (field === 'permissions') {
            const permission = permissions.find((permission) => permission.id === value);
            if (permission) {
                // Check if permission is found
                setFormValues((prevValues) => ({
                    ...prevValues,
                    permissions: [permission],
                }));
            }
            return;
        }
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleformSucessModal = () => {
        setOpenModal(true);
        const newValues = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phone: formValues.phone,
            email: formValues.email,
            roleId: formValues.roleId,
            permissions: [formValues.permissions[0].id] ,
        }
        dispatch(editStaffThunk({ id: params.id, formData: newValues }));
        navigate('/careteam');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
            <BackButton onClick={handleBackClick} />
            <div className={classNames(styles['create-team-wrapper'], className)}>
                <div>
                    <h2>Edit care team member</h2>
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
                                value={formValues.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
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
                                value={formValues.roleId}
                                onChange={(e) => handleChange('roleId', e.target.value as string)}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                            >
                                <CoustomMenuItem value="" disabled>
                                    <em>Select role</em>
                                </CoustomMenuItem>
                                {Object.entries(ROLE).map(([code, label]) => (
                                    <CoustomMenuItem key={code} value={label}>
                                        {label}
                                    </CoustomMenuItem>
                                ))}
                            </CustomizedSelects>
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Permissions" />
                            <CustomizedSelects
                                value={formValues.permissions[0]?.id || ''}
                                onChange={(e) =>
                                    handleChange('permissions', e.target.value as string)
                                }
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                            >
                                <CoustomMenuItem value="" disabled>
                                    <em>Select permission level</em>
                                </CoustomMenuItem>
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
                        buttonText="Cancel"
                        className={classNames(AppButton_module['button-no-decoration'])}
                        onButtonClick={() => navigate('/careteam')}
                    />
                    <AppButton buttonText="Save profile" onButtonClick={handleformSucessModal} />
                </div>
            </div>
            {openModal && (
                <FormSucessModal
                    open={openModal}
                    descriptionText="Profile information successfully saved."
                    title="Profile Updated"
                    closeModal={handleCloseModal}
                    handleButton={() => navigate('/careteam')}
                />
            )}
        </>
    );
};
