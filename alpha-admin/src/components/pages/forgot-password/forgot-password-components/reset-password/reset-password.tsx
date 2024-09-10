// reset-password.tsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './reset-password.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { AppDispatch, RootState } from '../../../../../app/store';
import { updatePasswordThunk } from '../../forgot-password-slice';
import { SaveResetPassword } from '../save-reset-password/save-reset-password';

export interface ResetPasswordProps {
    className?: string;
}

export const ResetPassword = ({ className }: ResetPasswordProps) => {
    const [saveModal, setSaveModal] = useState(false);
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const accessToken = useSelector((state: RootState) => state.passwordReset.accessToken); // Get the access token
    const location = useLocation();
    const navigate = useNavigate();

    console.log('accessToken', accessToken);

    const handleSaveModalOpen = async () => {
        if (!accessToken) {
            // Handle the error when there's no access token
            console.error('No access token found');
            return;
        }

        const resultAction = await dispatch(updatePasswordThunk({ password, accessToken }));

        if (updatePasswordThunk.fulfilled.match(resultAction)) {
            // Handle success cases here
            setSaveModal(true);
        } else {
            // Handle error cases here
            console.error('Error reseting password');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <>
            <div className={styles['password-main-wrapper']}>
                <div className={styles['page-padding']}>
                    <div className={styles['container']}>
                        <div className={styles['password-content-main-wrapper']}>
                            <h2 className={styles['password-heading']}>Reset password</h2>
                            <span>
                                Your new password must be different from previous passwords.
                            </span>
                            <div className={styles['input-field-wrapper']}>
                                <div className={styles['input-field-label-main-wrapper']}>
                                    <InputFieldLabel labelText="Password" />
                                </div>
                                <InputField
                                    id="password"
                                    placeholder="Enter your password"
                                    isTypePassword
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <AppButton
                                buttonText="Save new password"
                                showLeftIcon={false}
                                showRightIcon={false}
                                onButtonClick={handleSaveModalOpen}
                            />
                            {saveModal && <SaveResetPassword open={saveModal} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
