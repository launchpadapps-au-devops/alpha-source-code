import classNames from 'classnames';
import styles from './top-navigation.module.scss';
import Alpha from '../../assets/Alpha-text.svg';
import Nsw from '../../assets/NSW.svg';
import Wwest from '../../assets/ww-west.svg';
import { NavigationLink } from './navigation-component/navigation-link/navigation-link';
import { ProfileMenu } from './navigation-component/profile-menu/profile-menu';
import { useUnsavedChanges } from '../pages/content/lessons/lesson-components/unchanged-warning-hook-context';

export interface TopNavigationProps {
    className?: string;
    showLeftWrapper?: boolean;
    showRightWrapper?: boolean;
    showLogosWrapperOnly?: boolean;
    showAlphaLogoOnly?: boolean;
}

export const TopNavigationStaff = ({
    className,
    showLeftWrapper = true,
    showRightWrapper = true,
    showLogosWrapperOnly = false,
    showAlphaLogoOnly = false,
}: TopNavigationProps) => {
    const { dirty } = useUnsavedChanges(); // Use the dirty state from the context

    return (
        <>
            <div className={styles['top-navigation-main-wrapper']}>
                {showLeftWrapper && (
                    <div className={styles['top-navigation-left-wrapper']}>
                        {showAlphaLogoOnly ? (
                            <div className={styles['alpha-logo-wrapper']}>
                                <img src={Alpha} alt="Alpha Logo" />
                            </div>
                        ) : (
                            <>
                                <div className={styles['logos-wrapper']}>
                                    <img src={Nsw} alt="NSW Logo" />
                                    <img src={Wwest} alt="WWest Logo" />
                                </div>
                                <div className={styles['alpha-logo-wrapper']}>
                                    <img src={Alpha} alt="Alpha Logo" />
                                </div>
                            </>
                        )}
                    </div>
                )}
                {showRightWrapper && (
                    <div className={styles['top-navigation-right-wrapper']}>
                        <div className={styles['navlink-menu-wrapper']}>
                            <NavigationLink icon="dashboard" navText="Dashboard" linkTo="/dashboard" />
                            <NavigationLink icon="user" navText="Patient" linkTo="/patients" />
                        </div>
                        <div className={styles['profile-wrapper']}>
                            <ProfileMenu />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
