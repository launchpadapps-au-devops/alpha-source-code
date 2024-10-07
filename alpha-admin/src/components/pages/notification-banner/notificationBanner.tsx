import React, { useEffect } from 'react';
import styles from './notificationBanner.module.scss';

type NotificationBannerProps = {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    type?: 'success' | 'error' | 'delete'; // Adding type to distinguish between success and error messages
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({ isVisible, message, onClose, type = 'success' }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.notificationBanner} data-type={type}>
            {type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" className={styles.notificationBannerIcon}>
                    <path d="M8.00016 1.83331C4.32016 1.83331 1.3335 4.81998 1.3335 8.49998C1.3335 12.18 4.32016 15.1666 8.00016 15.1666C11.6802 15.1666 14.6668 12.18 14.6668 8.49998C14.6668 4.81998 11.6802 1.83331 8.00016 1.83331ZM6.66683 11.8333L3.3335 8.49998L4.2735 7.55998L6.66683 9.94665L11.7268 4.88665L12.6668 5.83331L6.66683 11.8333Z" fill="#31C440" />
                </svg>
            )}
            {type === 'error' && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.16602 11.4998H9.83268V13.1665H8.16602V11.4998ZM8.16602 4.83317H9.83268V9.83317H8.16602V4.83317ZM8.99102 0.666504C4.39102 0.666504 0.666016 4.39984 0.666016 8.99984C0.666016 13.5998 4.39102 17.3332 8.99102 17.3332C13.5993 17.3332 17.3327 13.5998 17.3327 8.99984C17.3327 4.39984 13.5993 0.666504 8.99102 0.666504ZM8.99935 15.6665C5.31602 15.6665 2.33268 12.6832 2.33268 8.99984C2.33268 5.3165 5.31602 2.33317 8.99935 2.33317C12.6827 2.33317 15.666 5.3165 15.666 8.99984C15.666 12.6832 12.6827 15.6665 8.99935 15.6665Z" fill="#630019"/>
                </svg>                
            )}
            {type === 'delete' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" className={styles.notificationBannerIcon}>
                    <path d="M8.00016 1.83331C4.32016 1.83331 1.3335 4.81998 1.3335 8.49998C1.3335 12.18 4.32016 15.1666 8.00016 15.1666C11.6802 15.1666 14.6668 12.18 14.6668 8.49998C14.6668 4.81998 11.6802 1.83331 8.00016 1.83331ZM6.66683 11.8333L3.3335 8.49998L4.2735 7.55998L6.66683 9.94665L11.7268 4.88665L12.6668 5.83331L6.66683 11.8333Z" fill="#c90c0c" />
                </svg>
            )}
            <span className={styles.notificationBannerMessage}>{message}</span>
        </div>
    );
};

export default NotificationBanner;
