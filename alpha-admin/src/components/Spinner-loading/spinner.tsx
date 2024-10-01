import classNames from 'classnames';
import styles from './spinner.module.scss';
import { CustomDialog } from '../mui-dialog-style';
import { CircularProgress } from '@mui/material'; // Import spinner from Material UI or any other spinner component

export interface SpinnerProps {
    className?: string;
    open: boolean;
    closeModal?: () => void;
}

export const Spinner = ({
    className,
    open,
    closeModal,
}: SpinnerProps) => {
    return (
        <CustomDialog
            onClose={closeModal}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
                maxWidth: '150px !important',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: 'transparent', // Remove background from modal
                boxShadow: 'none', // Remove shadow to make it fully transparent
            }}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent', // Ensure the modal paper is transparent
                    boxShadow: 'none',
                },
            }}
        >
            <div className={styles['modal-spinner-body']}>
                <CircularProgress sx={{ color: 'white' }} /> {/* Use Material UI spinner */}
            </div>
        </CustomDialog>
    );
};
