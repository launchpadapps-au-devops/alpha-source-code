import classNames from 'classnames';
import styles from './logout.module.scss';
import { CustomDialog, CustomDialogContent, CustomDialogTitle } from '../../mui-dialog-style';
import { Icon } from '../../icon/icon';
import { AppButton } from '../../app-button/app-button';
import AppButton_module from '../../app-button/app-button.module.scss';
import { useNavigate } from 'react-router-dom';

export interface LogoutProps {
    className?: string;
    open?: boolean;
    closeModal?: () => void;
}

export const Logout = ({ className, open = false, closeModal }: LogoutProps) => {
    const navigate = useNavigate();
    const handlelogout = () => {
        navigate('/login');
    };
    return (
        <>
            <CustomDialog
                onClose={closeModal}
                aria-labelledby="customized-dialog-title"
                open={open}
                sx={{
                    maxWidth: '312px !important',
                }}
            >
                <CustomDialogTitle id="customized-dialog-title">
                    <div className={styles['logout-header']}>
                        <div className={styles['icon-wrapper']}>
                            <Icon glyph={'alert'} width={24} height={22} />
                        </div>
                        Are you sure you want to log out?
                    </div>
                </CustomDialogTitle>
                <CustomDialogContent>
                    <div className={styles['form-input-flex-block']}>
                        <div className={styles['input-wrapper']}>
                            <AppButton
                                buttonText="No, cancel"
                                showLeftIcon={false}
                                showRightIcon={false}
                                onButtonClick={closeModal}
                            />
                            <AppButton
                                className={classNames(AppButton_module['button-outlined'])}
                                buttonText="Yes, log out"
                                showLeftIcon={false}
                                showRightIcon={false}
                                onButtonClick={handlelogout}
                            />
                        </div>
                    </div>
                </CustomDialogContent>
            </CustomDialog>
        </>
    );
};
