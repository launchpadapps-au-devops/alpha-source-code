import classNames from 'classnames';
import styles from './main.module.scss';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from '../../top-navigation/top-navigation';

export interface MainLayoutProps {
    className?: string;
}
/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const MainLayout = ({ className }: MainLayoutProps) => {
    return (
        <>
            <main className={styles['main-wrapper']}>
                <TopNavigation showLeftWrapper={true} showRightWrapper={true} />
                <Outlet></Outlet>
            </main>
        </>
    );
};
