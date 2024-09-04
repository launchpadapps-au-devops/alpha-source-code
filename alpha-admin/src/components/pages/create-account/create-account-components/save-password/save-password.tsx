import classNames from 'classnames';
import styles from './save-password.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import AppButton_module from '../../../../app-button/app-button.module.scss';
import { CustomDialog, CustomDialogContent, CustomDialogTitle } from '../../../../mui-dialog-style';
import { Icon } from '../../../../icon/icon';
import { useNavigate } from 'react-router-dom';

export interface SavePasswordProps {
    className?: string;
    open?: boolean;
    //closeModal?: () => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SavePassword = ({ className, open = false, }: SavePasswordProps) => {
    const navigate = useNavigate();
    return <>
        <CustomDialog
            //onClose={closeModal}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
                maxWidth: '312px !important',
            }}
        >
            <CustomDialogTitle id="customized-dialog-title">
                <div className={styles['save-password-header']}>
                    <div className={styles['icon-wrapper']}>
                        <Icon glyph={'check'} width={24} height={24} />
                    </div>
                    <div className={styles['save-password-heading-wrapper']}>
                        New password saved
                        <span>Your password has been successfully saved.</span>
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
