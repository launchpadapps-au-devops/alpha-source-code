import classNames from 'classnames';
import styles from './login.module.scss';
import { InputFieldLabel } from '../../input-field-label/input-field-label';
import { InputField } from '../../input-field/input-field';
import { AppButton } from '../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../../../app/store';  // Import the type for the dispatch
import {  LoginSliceState, loginThunk } from './loginSlice';



export interface LoginProps {
    className?: string;
}

export const Login = ({ className }: LoginProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const { loggedIn, loading, error, } = useSelector((state: { login: LoginSliceState }) => state.login);

    useEffect(() => {
     
        if (loggedIn) {
 
            navigate('/dashboard'); // or wherever you want to navigate after successful login
        }
    }, [loggedIn, navigate]);

    const dispatch = useDispatch<AppDispatch>();  

    const handleFormSubmit = (e: any) => {
        // console.log(isLoggedIn,"isLoggedIn")
        e.preventDefault();
        dispatch(loginThunk({ userEmail: email, password }));
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
                                type='email'
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className={styles['input-field-wrapper']}>
                            <div className={styles['input-field-label-main-wrapper']}>
                                <InputFieldLabel labelText="Password" />
                                <div className={styles['forgot-password']} onClick={() => navigate('/forgot-password')}>Forgot password?</div>
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
                            buttonText='Log In'
                            showLeftIcon={false}
                            showRightIcon={false} onButtonClick={handleFormSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};
