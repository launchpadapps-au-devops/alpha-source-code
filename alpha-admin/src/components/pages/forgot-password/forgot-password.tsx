import classNames from 'classnames';
import styles from './forgot-password.module.scss';
import { InputFieldLabel } from '../../input-field-label/input-field-label';
import { InputField } from '../../input-field/input-field';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../app-button/app-button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { useState } from 'react';
import { sendOTPThunk } from './forgot-password-slice';
// import { forgotPasswordThunk } from './forgot-password-slice';



export interface ForgotPasswordProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ForgotPassword = ({ className }: ForgotPasswordProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState('');
    // const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    // const { isForgotPassword, loading, error } = useSelector((state: RootState) => state.forgotPassword);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('Dispatching forgotPassword API');
        await dispatch(sendOTPThunk(email));
        navigate('/check-your-email', { state: { email } });
        // Add your submit logic here
    };

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    return <>
        <div className={styles['password-main-wrapper']}>
            <div className={styles['page-padding']}>
                <div className={styles['container']}>
                    <div className={styles['password-content-main-wrapper']}>
                        <h2 className={styles['password-heading']}>Forgot password</h2>
                        <span>Enter the email associated with your account.</span>
                        <div className={styles['input-field-wrapper']}>
                            <InputFieldLabel labelText="Email" />
                            <InputField
                                id="email"
                                placeholder="Enter your email"
                                type='email'
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {/* <div className={styles['input-field-wrapper']}>
                            <div className={styles['input-field-label-main-wrapper']}>
                                <InputFieldLabel labelText="Password" />
                                <div className={styles['forgot-password']} onClick={() => navigate('/check-your-email')}>Forgot password?</div>
                            </div>
                            {/* <InputField 
                                // id="password"
                                // placeholder="Enter your password"
                                // isTypePassword
                                // type="password" /> */}
                        {/* </div> */}
                        <AppButton
                            buttonText='Send'
                            showLeftIcon={false}
                            showRightIcon={false} onButtonClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    </>;
};
