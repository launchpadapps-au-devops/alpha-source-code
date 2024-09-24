import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import styles from './setting.module.scss';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from '../../top-navigation/top-navigation';
import { TopNavigationStaff } from '../../top-navigation/top-navigation-staff';
import { SettingDashboard } from '../../setting-dashboard/setting-dashboard';
import { initializeUser } from '../../pages/login/loginSlice';


export const SettingLayout = () => {
    const dispatch = useDispatch();
    const { userType, loggedIn, loading } = useSelector((state: RootState) => state.login);

    useEffect(() => {
        // Initialize user state from localStorage on component mount
        console.log('userType setting', userType);  
        dispatch(initializeUser());
    }, [dispatch]);

    if (!userType || loading) { // If userType is not yet initialized or still loading
        return <div>Loading...</div>; // Show a loading state until userType is set
    }

    return (
        <main className={styles['main-wrapper']}>
            {userType === 'admin' ? (
                <TopNavigation />
            ) : (
                <TopNavigationStaff showLeftWrapper={true} showRightWrapper={true} />
            )}
            <div className={styles['setting-layout-main-wrapper']}>
                <div className={styles['setting-layout-left-wrapper']}>
                    <SettingDashboard />
                </div>
                <div className={styles['setting-layout-right-wrapper']}>
                    <Outlet />
                </div>
            </div>
        </main>
    );
};
