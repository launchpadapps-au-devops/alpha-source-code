import classNames from 'classnames';
import styles from './create-account.module.scss';
import { InputFieldLabel } from '../../input-field-label/input-field-label';
import { InputField } from '../../input-field/input-field';
import { AppButton } from '../../app-button/app-button';
import { useNavigate } from 'react-router-dom';

export interface CreateAccountProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CreateAccount = ({ className }: CreateAccountProps) => {
    const navigate = useNavigate();
    return <>
        <div className={styles['password-main-wrapper']}>
            <div className={styles['page-padding']}>
                <div className={styles['container']}>
                    <div className={styles['password-content-main-wrapper']}>
                        <h2 className={styles['password-heading']}>Create account</h2>
                        <div className={styles['input-field-wrapper']}>
                            <InputFieldLabel labelText="Email" />
                            <InputField
                                placeholder="Enter your email"
                                type='email'
                            />
                        </div>
                        <div className={styles['input-field-wrapper']}>
                            <InputFieldLabel labelText="Temporary password" />
                            <InputField placeholder="Enter your temporary password"
                                isTypePassword
                                type="password" />
                        </div>
                        <AppButton
                            buttonText='Log In'
                            showLeftIcon={false}
                            showRightIcon={false} onButtonClick={() => navigate('/create-new-password')} />
                    </div>
                </div>
            </div>
        </div>
    </>;
};
