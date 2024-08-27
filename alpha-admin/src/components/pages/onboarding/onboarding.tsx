import '../../../styles/global.scss';
import classNames from 'classnames';
import styles from './onboarding.module.scss';
import { OnboardingSlides } from './onboarding-components/onboarding-slides/onboarding-slides';
import { AppButton } from '../../app-button/app-button';
import AppButton_module from '../../app-button/app-button.module.scss';
import { useNavigate } from 'react-router-dom';

export interface OnboardingProps {
    className?: string;
}

export const Onboarding = ({ className }: OnboardingProps) => {
    const navigate = useNavigate();
    return (
        <>
            <div className={styles['main-wrapper']}>
                <div className={styles['page-padding']} >
                    <div className={styles['container']}>
                        <div className={styles['onboarding-main-wrapper']}>
                            <OnboardingSlides />
                            <div className={styles['buttons-wrapper']}>
                                <AppButton buttonText="Log in"
                                    showLeftIcon={false}
                                    showRightIcon={false} onButtonClick={() => navigate('/login')} />
                                <AppButton className={classNames(AppButton_module['button-outlined'])}
                                    buttonText="Create an account"
                                    showLeftIcon={false}
                                    showRightIcon={false} onButtonClick={() => navigate('/create-account')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
