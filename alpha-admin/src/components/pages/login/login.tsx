import classNames from 'classnames';
import styles from './login.module.scss';
import { InputFieldLabel } from '../../input-field-label/input-field-label';
import { InputField } from '../../input-field/input-field';
import { AppButton } from '../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../../../app/store'; // Import the type for the dispatch
import { LoginSliceState, loginThunk } from './loginSlice';
import { Spinner } from '../../Spinner-loading/spinner';

export interface LoginProps {
    className?: string;
}

export const Login = ({ className }: LoginProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { loggedIn, loading, error } = useSelector(
        (state: { login: LoginSliceState }) => state.login
    );

    console.log(error, 'error');

    useEffect(() => {
        if (loggedIn) {
            navigate('/dashboard'); // or wherever you want to navigate after successful login
        }
    }, [loggedIn, navigate]);

    const dispatch = useDispatch<AppDispatch>();

    const validateFields = () => {
        let fieldErrors: any = {};
        if (!email) {
            fieldErrors.email = 'Email is required';
        } else if (!isValidEmail) {
            fieldErrors.email = 'Invalid email';
        }
        if (!password) {
            fieldErrors.password = 'Password is required';
        } else if (password.length < 8) {
            fieldErrors.password = 'Password must be at least 8 characters';
        }
        setErrors(fieldErrors);

        return Object.keys(fieldErrors).length === 0;
    };

    const handleFormSubmit = (e: any) => {
        // console.log(isLoggedIn,"isLoggedIn")
        e.preventDefault();
        if (validateFields()) {
            dispatch(loginThunk({ userEmail: email, password }));
        } else {
            console.log('Validation failed', errors);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setIsValidEmail(validateEmail(value));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    return (
        <div className={styles['login-main-wrapper']}>
            <div className={styles['page-padding']}>
                <div className={styles['container']}>
                    <div className={styles['login-content-main-wrapper']}>
                        <h2 className={styles['login-heading']}>Log in</h2>
                        <div className={styles['input-field-wrapper']}>
                            <InputFieldLabel labelText="Email" />
                            <InputField
                                id="email"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={classNames({  [styles.errorborder]: errors.email || error?.message, })}
                            />
                            {errors.email && (
                                <div className={styles.errormessage}>{errors.email}</div>
                            )}
                        </div>
                        <div className={styles['input-field-wrapper']}>
                            <div className={styles['input-field-label-main-wrapper']}>
                                <InputFieldLabel labelText="Password" />
                                <div
                                    className={styles['forgot-password']}
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot password?
                                </div>
                            </div>
                            <InputField
                                id="password"
                                placeholder="Enter your password"
                                isTypePassword
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={classNames({  [styles.errorborder]: errors.password || error?.message, })}
                            />
                            {errors.password && (
                                <div className={styles.errormessage}>{errors.password}</div>
                            )}
                            {error && (
                                <div className={styles['errormessage']}>
                                    <p>{error.message}</p>
                                    {/* <p>Status Code: {error.code}</p>
                                    <p>Path: {error.urlPath}</p>
                                    <p>Timestamp: {error.timestamp}</p> */}
                                </div>
                            )}
                        </div>
                        <AppButton
                            buttonText="Log In"
                            showLeftIcon={false}
                            showRightIcon={false}
                            onButtonClick={handleFormSubmit}
                        />
                    </div>
                </div>
            </div>
            {loading && <Spinner open={true} />}
        </div>
    );
};
