import classNames from 'classnames';
import styles from './setting-dashboard.module.scss';
import { SettingDashboardItem } from './setting-components/setting-dashboard-item/setting-dashboard-item';

export interface SettingDashboardProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SettingDashboard = ({ className }: SettingDashboardProps) => {
    return (
        <>
            <div className={styles['main-wrapper']}>
                <SettingDashboardItem navText='Manage password' icon='key' linkTo='/manage-password' />
                <SettingDashboardItem navText='Terms & conditions' icon='article' linkTo='/terms-and-condition' />
                <SettingDashboardItem navText='Privacy policy' icon='shield' linkTo='/privacy-policy' />
            </div>
        </>
    );
};
