import classNames from 'classnames';
import styles from './root.module.scss';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigation } from '../../top-navigation/top-navigation';

export interface RootLayoutProps {
    className?: string;
}
/**
* This component was created using Codux's Default new component template.
* To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
*/
export const RootLayout = ({ className }: RootLayoutProps) => {
    const location = useLocation();
    const pathname = location.pathname;

    const showAlphaLogoOnly = pathname === '/';
    const showLeftWrapper = showAlphaLogoOnly || [
        '/login',
        '/forgot-password',
        '/check-your-email',
        '/reset-password',
        '/create-account',
        '/create-new-password'
    ].includes(pathname);
    const showRightWrapper = !showAlphaLogoOnly && ![
        '/login',
        '/forgot-password',
        '/check-your-email',
        '/reset-password',
        '/create-account',
        '/create-new-password'

    ].includes(pathname);


    return (
        <main className={styles['main-wrapper']}>
            <TopNavigation
                showLeftWrapper={showLeftWrapper}
                showRightWrapper={showRightWrapper}
                showLogosWrapperOnly={false}
                showAlphaLogoOnly={showAlphaLogoOnly}
            />
            <Outlet />
        </main>
    );
};