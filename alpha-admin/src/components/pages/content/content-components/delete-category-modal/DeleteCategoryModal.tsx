import classNames from 'classnames';
import styles from './delete-category-modal.module.scss';
import { CustomDialog } from '../../../../mui-dialog-style';
import { Icon } from '../../../../icon/icon';
import { AppButton } from '../../../../app-button/app-button';
import { EditButton } from '../edit-button/edit-button';

export interface DeleteCategoryModalProps {
    className?: string;
    title?: string;
    open: boolean;
    descriptionText?: React.ReactNode;
    closeModal?: () => void;
    handleDelete?: () => void;
    cancelButtonText?: string; // New prop for cancel button text
    deleteButtonText?: string; // New prop for delete button text
}

export const DeleteCategoryModal = ({
    className,
    title,
    open,
    descriptionText,
    closeModal,
    handleDelete,
    cancelButtonText = "Cancel", // Default value
    deleteButtonText = "Yes, delete category", // Default value
}: DeleteCategoryModalProps) => {
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
                    <EditButton buttonText={cancelButtonText} onButtonClick={closeModal}/>
                    <AppButton buttonText={deleteButtonText} onButtonClick={handleDelete} isDeleteButton/>
                </div>
            </div>
        </CustomDialog>
    );
};
