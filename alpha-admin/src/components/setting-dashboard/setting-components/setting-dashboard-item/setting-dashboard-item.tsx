import classNames from 'classnames';
import styles from './setting-dashboard-item.module.scss';
import { NavLink } from 'react-router-dom';
import { Glyph, Icon } from '../../../icon/icon';

export interface SettingDashboardItemProps {
    className?: string;
    icon?: Glyph;
    navText?: string;
    linkTo?: any;
}



/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SettingDashboardItem = ({ className, icon, navText, linkTo }: SettingDashboardItemProps) => {
    return (
        <>
            <NavLink to={linkTo} className={({ isActive, isPending }) =>
                classNames(styles["setting-link-wrapper"], className, {
                    [styles.active]: isActive,
                    pending: isPending,
                })
            }
            >
                <div className={styles['icon-wrapper']}>
                    <Icon glyph={icon || 'add'} width={20} height={20} />
                </div>
                {navText}
            </NavLink>
        </>
    );
};
