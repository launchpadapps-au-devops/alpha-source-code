import classNames from 'classnames';
import styles from './PublishThemeModal.module.scss';
import { CustomDialog } from '../../../../../mui-dialog-style';
import { Icon } from '../../../../../icon/icon';
import { AppButton } from '../../../../../app-button/app-button';
import { EditButton } from '../../../content-components/edit-button/edit-button';

export interface PublishThemesModalProps {
    className?: string;
    title?: string;
    open: boolean;
    descriptionText?: React.ReactNode;
    closeModal?: () => void;
    handlePublish?: () => void;
}

export const PublishThemesModal = ({
    className,
    title,
    open,
    descriptionText,
    closeModal,
    handlePublish,
}: PublishThemesModalProps) => {
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
                    <Icon glyph="warning" width={24} height={24} currentColor='currentColor' />
                </div>
                <div className={classNames(styles['modal-desc-wrapper'])}>
                    <h3 id="customized-dialog-title">{title}</h3>
                    <p>{descriptionText}</p>
                </div>
                <div className={styles['button-group']}>
                    <EditButton buttonText="Cancel" onButtonClick={closeModal} />
                    <AppButton buttonText="Yes, publish" onButtonClick={handlePublish}/>
                </div>
            </div>
        </CustomDialog>
    );
};
