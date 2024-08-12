import classNames from 'classnames';
import styles from './setting.module.scss'
import { Outlet } from 'react-router-dom';
import { TopNavigation } from '../../top-navigation/top-navigation';
import { SettingDashboard } from '../../setting-dashboard/setting-dashboard';


export interface SettingLayoutProps {
    className?: string;
}
/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SettingLayout = ({ className }: SettingLayoutProps) => {
    return (
        <>
            <main className={styles['main-wrapper']}>
                <TopNavigation />
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
