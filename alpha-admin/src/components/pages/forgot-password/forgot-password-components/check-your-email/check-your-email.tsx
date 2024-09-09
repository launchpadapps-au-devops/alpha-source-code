import classNames from 'classnames';
import styles from './check-your-email.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import { useNavigate } from 'react-router-dom';

export interface CheckYourEmailProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CheckYourEmail = ({ className }: CheckYourEmailProps) => {
    const navigate = useNavigate();
    return (
        <>
            <div className={styles['main-wrapper']}>
                <div className={styles['page-padding']}>
                    <div className={styles['container']}>
                        <div className={styles['content-wrapper']}>
                            <h2 className={styles['check-email-heading']}>Check your email</h2>
                            <span>We sent an email to example@gmail.com.</span>
                            <span>Click the link in the email to reset your password.</span>
                            <span>Can’t find the email? Check your spam folder or</span>
                            <AppButton
                                className={classNames(AppButton_module['button-vertical-padding'], AppButton_module['button-no-decoration'])}
                                buttonText="Resend email"
                                showLeftIcon={false}
                                showRightIcon={false}
                                onButtonClick={() => navigate('/reset-password')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
