import classNames from 'classnames';
import styles from './edit-care-team.module.scss';
import { useEffect, useState } from 'react';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { CoustomMenuItem, CustomizedSelects, MenuProps } from '../../../../mui-select-style';
import { PERMISSION_LEVEL, ROLE } from '../../../../../constants/constant-option-values';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import { FormSucessModal } from '../../../../form-sucess-modal/form-sucess-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../app/store';
import { editStaffThunk } from './edit-care-teamSlice';
import { getStaffRoleThunk } from '../create-care-team/create-care-teamSlice';
export interface EditCareTeamProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const EditCareTeam = ({ className }: EditCareTeamProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();

    const [openModal, setOpenModal] = useState(false);

    var [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        roleId: '',
        permissions: [],
    });

    const dummydata = {
        id: 6,
        email: 'akshatha@launchpadapps.co',
        firstName: 'Smith',
        lastName: 'Jane',
        fullName: 'Smith undefined Jane',
        roles: [
            {
                id: 1,
                name: 'Practice Manager',
            },
        ],
    };

    useEffect(() => {
        dispatch(getStaffRoleThunk(params.id)).then((response) => {
            var data = response.payload.data;
            console.log('data', data);

            setFormValues(data);
        });
    }, [dispatch]);
    // This updates the form state for a given field.
    const handleChange = (field: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleformSucessModal = () => {
        // const data = {
        //     firstName: 'asdf',
        //     lastName: 'aad',
        //     fullName: 'asdsfsf',
        //     email: 'adad@gmail.com',
        //     password: '',
        //     roleIds: [2],
        //     isStaffAdmin: true,
        // }
        dispatch(editStaffThunk({ id: params.id, formData: formValues }));
        setOpenModal(true);
        navigate('/careteam');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
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
                                //    className={InputField_module['input-padding-medium']}
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
                                //    className={InputField_module['input-padding-medium']}
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
                                //    className={InputField_module['input-padding-medium']}
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
                                //    className={InputField_module['input-padding-medium']}
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
                                    <CoustomMenuItem key={code} value={code}>
                                        {label}
                                    </CoustomMenuItem>
                                ))}
                            </CustomizedSelects>
                        </div>
                        <div className={styles['input-wrapper']}>
                            <InputFieldLabel labelText="Permissions" />
                            <CustomizedSelects
                                value={formValues.permissions}
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
                                {Object.entries(PERMISSION_LEVEL).map(([code, label]) => (
                                    <CoustomMenuItem key={code} value={formValues.permissions}>
                                        {label}
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
