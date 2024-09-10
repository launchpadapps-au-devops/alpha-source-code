import React, { useEffect } from 'react';
import styles from './notificationBanner.module.scss';

type NotificationBannerProps = {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    type?: 'success' | 'error'; // Adding type to distinguish between success and error messages
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({ isVisible, message, onClose, type = 'success' }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 2000);
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
            <span className={styles.notificationBannerMessage}>{message}</span>
        </div>
    );
};

export default NotificationBanner;
