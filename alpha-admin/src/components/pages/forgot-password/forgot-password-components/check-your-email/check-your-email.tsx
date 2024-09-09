import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../app/store';
import { forgotPasswordOtpVerifyThunk } from './forgot-password-otp-verify-Slice';
import classNames from 'classnames';
import styles from './check-your-email.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { forgotPasswordThunk } from '../../forgot-password-slice';

export interface CheckYourEmailProps {
    className?: string;
}

export const CheckYourEmail = ({ className }: CheckYourEmailProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    // Retrieve the email from the location state
    const email = location.state?.email || ""; // Provide a fallback in case email is undefined

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setOtp(value);
        }
    };

    const handleVerifyOTP = async () => {
        setError(null); // Clear any existing error
        const data = {
            email,
            otp: parseInt(otp)
        };
        try {
            const resultAction = await dispatch(forgotPasswordOtpVerifyThunk(data));
    
            if (forgotPasswordOtpVerifyThunk.fulfilled.match(resultAction)) {
                // Access the response payload to get the accessToken
                const token = resultAction.payload?.accessToken;
    
                if (token) {
                    // Store the token or navigate with it
                    // localStorage.setItem('Token', token);
                    navigate('/reset-password', { state: { accessToken: token } });
                }

            } else {
                // If OTP verification failed, set the error message
                setError('Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };
    

    const handleResendOTP = async () => {
        // Resend OTP logic here
        await dispatch(forgotPasswordThunk(email));

    }

    return (
        <div className={styles['main-wrapper']}>
            <div className={styles['content-wrapper']}>
                <h2 className={styles['check-email-heading']}>
                    Enter One-time password
                </h2>
                <span>
                    Please check your email for the one-time password we’ve sent to you.
                </span>
                <span>
                    Enter the one-time password below to proceed with resetting your
                    password.
                </span>
                <div className={styles['input-field-wrapper']}>
                    <InputFieldLabel labelText="One-time password" />
                    <InputField
                        id="password"
                        placeholder="Enter one-time password"
                        isTypePassword
                        type="text"
                        maxLength={4}
                        value={otp}
                        onChange={handleOtpChange}
                    />
                </div>
                {error && <span className={styles['error-message']}>{error}</span>}
                <span>Can’t find the email? Check your spam folder or</span>
                <AppButton
                    className={classNames(
                        AppButton_module['button-vertical-padding'],
                        AppButton_module['button-no-decoration']
                    )}
                    buttonText="Verify OTP"
                    showLeftIcon={false}
                    showRightIcon={false}
                    onButtonClick={handleVerifyOTP}
                />
                <AppButton
                    className={classNames(
                        AppButton_module['button-vertical-padding'],
                        AppButton_module['button-no-decoration']
                    )}
                    buttonText="Resend OTP"
                    showLeftIcon={false}
                    showRightIcon={false}
                    onButtonClick={handleResendOTP}
                />
            </div>
        </div>
    );
};
