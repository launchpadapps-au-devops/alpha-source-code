import classNames from 'classnames';
import styles from './navigation-link.module.scss';
import { NavLink } from 'react-router-dom';
import { Glyph, Icon } from '../../../icon/icon';

export interface NavigationLinkProps {
    className?: string;
    icon?: Glyph;
    navText?: string;
    linkTo?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NavigationLink = ({ className, icon, navText, linkTo }: NavigationLinkProps) => {
    return <>
        <NavLink to={linkTo || '/'}
            className={({ isActive, isPending }) =>
                classNames(styles["nav-link-wrapper"], className, {
                    [styles.active]: isActive,
                    pending: isPending,
                })
            }
        >
            <div className={styles['icon-wrapper']}>
                <Icon glyph={icon || 'add'} width={18} height={18} />
            </div>
            {navText}
        </NavLink>
    </>;
};
