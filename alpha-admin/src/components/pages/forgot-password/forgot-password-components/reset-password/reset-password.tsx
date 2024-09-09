import classNames from 'classnames';
import styles from './reset-password.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { AppButton } from '../../../../app-button/app-button';
import { useState } from 'react';
import { SaveResetPassword } from '../save-reset-password/save-reset-password';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../app/store';
import { resetPasswordThunk } from './resetPasswordSlice';
import { ForgotAuthState } from '../../forgot-password-slice';

export interface ResetPasswordProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ResetPassword = ({ className }: ResetPasswordProps) => {
    const [saveModal, setSaveModal] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const location = useLocation();
    const { user } = useSelector((state: { forgotPasswordOtpVerify: ForgotAuthState }) => state.forgotPasswordOtpVerify);
    console.log( 'user',user);
    const handleSaveModalOpen= async () => {
        const token = location.state?.token || '';
        await dispatch(resetPasswordThunk({ password, token }));
        setSaveModal(!saveModal);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
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
                                    onChange={handlePassword}
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
