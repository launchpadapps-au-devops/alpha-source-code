import classNames from 'classnames';
import styles from './remove-lifestyle-modal.module.scss';
import { CustomDialog } from '../../../../../mui-dialog-style';
import { Icon } from '../../../../../icon/icon';
import { AppButton } from '../../../../../app-button/app-button';
import AppButton_module from '../../../../../app-button/app-button.module.scss';
import { DialogActions } from '@mui/material';

export interface RemoveLifestyleProps {
    className?: string;
    title?: string;
    open: boolean;
    descriptionText?: string;
    closeModal?: () => void;
    handleButton?: () => void;
}

export const RemoveLifestyle = ({
    className,
    title,
    open,
    descriptionText,
    closeModal,
    handleButton,
}: RemoveLifestyleProps) => {
    return (
        <CustomDialog
            onClose={closeModal}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
                maxWidth: '312px !important',
            }}
        >
            <div className={styles['modal-content-body']}>
                <div className={styles['circular-wrapper']}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                            fill="#146CFD"
                        />
                    </svg>
                </div>
                <div className={classNames(styles['modal-desc-wrapper'])}>
                    <h3 id="customized-dialog-title">Remove lifestyle plan?</h3>
                    <p>Are you sure you wish to remove the lifestyle plan from this patient?</p>
                </div>
                <DialogActions
                    sx={{
                        display: 'flex',
                        flexDirection: 'column !important',
                        gap: '16px',
                    }}
                >
                    <AppButton
                        className={classNames(AppButton_module['button-outlined'])}
                        buttonText="No, cancel"
                        onButtonClick={handleButton}
                    />
                    <AppButton buttonText="Yes, remove" onButtonClick={handleButton} />
                </DialogActions>
            </div>
        </CustomDialog>
    );
};
