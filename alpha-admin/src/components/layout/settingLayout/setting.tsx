import classNames from 'classnames';
import styles from './setting.module.scss'
import { Outlet } from 'react-router-dom';
import { TopNavigation } from '../../top-navigation/top-navigation';
import { SettingDashboard } from '../../setting-dashboard/setting-dashboard';
import { TopNavigationStaff } from '../../top-navigation/top-navigation-staff';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';


export interface SettingLayoutProps {
    className?: string;
}
/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SettingLayout = ({ className }: SettingLayoutProps) => {
    const { userType } = useSelector((state: RootState) => state.login); // Use 'login' instead of 'auth'
    return (
        <>
            <main className={styles['main-wrapper']}>
            {userType === 'admin' ? (  // Conditionally render the TopNavigation
                    <TopNavigation />
                ) : (
                    <TopNavigationStaff showLeftWrapper={true} showRightWrapper={true} />
                )}
                <div className={styles['setting-layout-main-wrapper']}>
                    <div className={styles['setting-layout-left-wrapper']}>
                        <SettingDashboard />
                    </div>
                    <div className={styles['setting-layout-right-wrapper']}>
                        <Outlet></Outlet>
                    </div>
                </div>

            </main>
        </>
    );
};
