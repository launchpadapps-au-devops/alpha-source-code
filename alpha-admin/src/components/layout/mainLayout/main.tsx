import classNames from 'classnames';
import styles from './main.module.scss';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from '../../top-navigation/top-navigation';
import { TopNavigationStaff } from '../../top-navigation/top-navigation-staff';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';


export interface MainLayoutProps {
    className?: string;
}

export const MainLayout = ({ className }: MainLayoutProps) => {
    const { userType } = useSelector((state: RootState) => state.login); // Use 'login' instead of 'auth'

    return (
        <>
            <main className={styles['main-wrapper']}>
                {userType === 'admin' ? (  // Conditionally render the TopNavigation
                    <TopNavigation />
                ) : (
                    <TopNavigationStaff showLeftWrapper={true} showRightWrapper={true} />
                )}
                <Outlet />
            </main>
        </>
    );
};

