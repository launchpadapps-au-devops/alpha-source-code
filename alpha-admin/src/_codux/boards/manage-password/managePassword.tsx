import classNames from 'classnames';
import styles from './managePassword.module.scss';
import { AppButton } from '../../../components/app-button/app-button';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { useState } from 'react';
import { matchUserPassword } from './managePasswordSlice';
import { InputFieldLabel } from '../../../components/input-field-label/input-field-label';
import { InputField } from '../../../components/input-field/input-field';
import { updatePasswordThunk } from '../../../components/pages/forgot-password/forgot-password-slice';
import { SaveResetPassword } from '../../../components/pages/forgot-password/forgot-password-components/save-reset-password/save-reset-password';
import { EditButton } from '../../../components/pages/content/content-components/edit-button/edit-button';

export interface CareTeamProfileProps {
    className?: string;
}

export const ManagePassword = ({ className }: CareTeamProfileProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const email = localStorage.getItem('LoggedInUserEmail'); // Get email from localStorage
    const firstName = localStorage.getItem('LoggedInUserFirstName'); // Get firstName from localStorage
    const lastName = localStorage.getItem('LoggedInUserLastName'); // Get lastName from localStorage
    const userType = localStorage.getItem('LoggedInUserType'); // Get userType from localStorage
    const role = localStorage.getItem('LoggedInUserRole'); // Get role from localStorage
    const accessToken = localStorage.getItem('accessToken'); // Get accessToken from localStorage
    // console.log('accessToken', accessToken);
    

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [saveModal, setSaveModal] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submit
    const handleFormSubmit = async () => {

        // Check if new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            setConfirmPasswordError(true);
            return;
        }

        if (email) {
            const resultAction = await dispatch(
                matchUserPassword({ email, password: currentPassword })
            );

            if (matchUserPassword.fulfilled.match(resultAction)) {
                const isMatched = resultAction.payload.data.isMatched;

                if (isMatched) {
                    if (!accessToken) {
                        console.error('No access token found');
                        return;
                    }

                    // Proceed to update password
                    const updateResultAction = await dispatch(
                        updatePasswordThunk({ password: confirmNewPassword, accessToken })
                    );

                    if (updatePasswordThunk.fulfilled.match(updateResultAction)) {
                        // Show save confirmation modal
                        setSaveModal(true);
                    } else {
                        console.error('Error resetting password');
                    }
                } else {
                    // If isMatched is false, turn the current password input field red and show an error message
                    setCurrentPasswordError(true);
                    setErrorMessage('Current password is incorrect.');
                }
            }
        }
    };

    // Update password on user input
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(event.target.value);
        // Reset the error when user starts typing again
        setCurrentPasswordError(false);
        setErrorMessage('');

        // Reset the error when user starts typing again
        setConfirmPasswordError(false);
    };

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmNewPassword(event.target.value);
        // Reset the error when user starts typing again
        setConfirmPasswordError(false);
    };

    return (
        <>
            <div className={classNames(styles['care-team-profile'], className)}>
                <div className={classNames(styles['top-header-block'])}>
                    <h2>Update password</h2>
                </div>
                <div className={classNames(styles['profile-detail-wrapper'])}>
                    <div className={styles['left-profile-block']}>
                        <Avatar
                            className={styles['profile-image']}
                            src="/static/images/avatar/1.jpg"
                        />
                        <div className={styles['profile-info']}>
                            <span className={styles['profile-name']}>
                                {firstName} {lastName}
                            </span>
                            <span className={styles['profile-role']}>{role}</span>
                        </div>
                        <div className={styles['profile-info']}>
                            <span className={styles['profile-workplace']}>Healthcare</span>
                            <span className={styles['profile-role']}>{userType}</span>
                        </div>
                    </div>
                    <div className={styles['right-profile-block']}>
                        <div className={styles['input-field-wrapper']}>
                            <div className={styles['input-field-label-main-wrapper']}>
                                <InputFieldLabel labelText="Current password" />
                                <div
                                    className={styles['forgot-password']}
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot password?
                                </div>
                            </div>
                            <InputField
                                id="current-password"
                                placeholder="Enter your current password"
                                isTypePassword
                                type="password"
                                value={currentPassword}
                                onChange={handlePasswordChange}
                                className={currentPasswordError ? styles['error-input'] : ''}
                            />
                            {currentPasswordError && <span className={styles['error-text']}>{errorMessage}</span>}
                        </div>
                        <div className={styles['input-field-wrapper']}>
                            <div className={styles['input-field-label-main-wrapper']}>
                                <InputFieldLabel labelText="New password" />
                            </div>
                            <InputField
                                id="new-password"
                                placeholder="Enter your new password"
                                isTypePassword
                                type="password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                            />
                        </div>
                        <div className={styles['input-field-wrapper']}>
                            <div className={styles['input-field-label-main-wrapper']}>
                                <InputFieldLabel labelText="Confirm new password" />
                            </div>
                            <InputField
                                id="confirm-new-password"
                                placeholder="Confirm your new password"
                                isTypePassword
                                type="password"
                                value={confirmNewPassword}
                                onChange={handleConfirmNewPasswordChange}
                                className={confirmPasswordError ? styles['error-input'] : ''}
                            />
                        {confirmPasswordError && (
                            <span className={styles['error-text']}>Passwords do not match.</span>
                        )}
                        </div>
                        <AppButton
                            buttonText="Save new password"
                            showLeftIcon={false}
                            showRightIcon={false}
                            onButtonClick={handleFormSubmit}
                        />
                        <EditButton
                            buttonText="Cancel"
                            showLeftIcon={false}
                            showRightIcon={false}
                            onButtonClick={() => navigate('/terms-and-condition')}
                        />
                        {saveModal && <SaveResetPassword open={saveModal} />}
                    </div>
                </div>
            </div>
        </>
    );
};
