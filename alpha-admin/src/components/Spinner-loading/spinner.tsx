import classNames from 'classnames';
import styles from './spinner.module.scss';
import { CustomDialog } from '../mui-dialog-style';
import { CircularProgress } from '@mui/material'; // Import spinner from Material UI or any other spinner component
import { PuffLoader } from 'react-spinners';

export interface SpinnerProps {
    className?: string;
}

export const Spinner = ({
    className
}: SpinnerProps) => {
    return (
        <div className={styles.loaderOverlay}>    
        <PuffLoader color="#007bff" />
        </div> 
    );
};
