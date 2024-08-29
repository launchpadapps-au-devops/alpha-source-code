import classNames from 'classnames';
import styles from './dialog-modal.module.scss';
import { CustomDialog } from '../../../../../mui-dialog-style';
import { Icon } from '../../../../../icon/icon';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';

export interface DailogModalProps {
    className?: string;
    title?: string;
    open: boolean;
    descriptionText?: string;
    closeModal?: () => void;
    handleButton?: () => void;
}

export const DailogModal = ({
    className,
    title,
    open,
    descriptionText,
    closeModal,
    handleButton,
}: DailogModalProps) => {

    const navigate = useNavigate();

    const handleContinueButton = () => {
        
       navigate('/patient-dashboard');
    };
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
                    <Icon glyph="check" width={24} height={24} currentColor="currentColor" />
                </div>
                <div className={classNames(styles['modal-desc-wrapper'])}>
                    <h3 id="customized-dialog-title">{title}</h3>
                    <p>{descriptionText}</p>
                </div>
                <AppButton buttonText="Continue" onButtonClick={handleContinueButton} />
            </div>
        </CustomDialog>
    );
};
