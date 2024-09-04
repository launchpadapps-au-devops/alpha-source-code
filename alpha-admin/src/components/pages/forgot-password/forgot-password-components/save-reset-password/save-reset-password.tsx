import classNames from 'classnames';
import styles from './save-reset-password.module.scss';
import { CustomDialog, CustomDialogContent, CustomDialogTitle } from '../../../../mui-dialog-style';
import { Icon } from '../../../../icon/icon';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../../../app-button/app-button';

export interface SaveResetPasswordProps {
    className?: string;
    open?: boolean;
    //closeModal?: () => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SaveResetPassword = ({ className, open = false }: SaveResetPasswordProps) => {
    const navigate = useNavigate();
    return <>
        <CustomDialog
            //onClose={closeModal}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
                maxWidth: '300px !important',
            }}
        >
            <CustomDialogTitle id="customized-dialog-title">
                <div className={styles['save-password-header']}>
                    <div className={styles['icon-wrapper']}>
                        <Icon glyph={'check'} width={24} height={24} />
                    </div>
                    <div className={styles['save-password-heading-wrapper']}>
                        Password reset
                        <span>Your password has been successfully reset.</span>
                    </div>

                </div>
            </CustomDialogTitle>
            <CustomDialogContent>
                <div className={styles['form-input-flex-block']}>
                    <div className={styles['input-wrapper']}>
                        <AppButton buttonText='Continue to Login'
                            showLeftIcon={false}
                            showRightIcon={false}
                            onButtonClick={() => navigate('/login')}
                        />
                    </div>
                </div>
            </CustomDialogContent>
        </CustomDialog>
    </>;
};
