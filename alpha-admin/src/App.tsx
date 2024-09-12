import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/rootLayout/root';
import { MainLayout } from './components/layout/mainLayout/main';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { Onboarding } from './components/pages/onboarding/onboarding';
import { Login } from './components/pages/login/login';
import { CareTeam } from './components/pages/care-team/care-team';
import { ForgotPassword } from './components/pages/forgot-password/forgot-password';
import { CheckYourEmail } from './components/pages/forgot-password/forgot-password-components/check-your-email/check-your-email';
import { ResetPassword } from './components/pages/forgot-password/forgot-password-components/reset-password/reset-password';
import { CreateAccount } from './components/pages/create-account/create-account';
import { CreateNewPassword } from './components/pages/create-account/create-account-components/create-new-password/create-new-password';
import { CreateCareTeam } from './components/pages/care-team/care-team-components/create-care-team/create-care-team';
import { CareTeamProfile } from './components/pages/care-team/care-team-components/care-team-profile/care-team-profile';
import { SettingLayout } from './components/layout/settingLayout/setting';
import { TermsAndCondition } from './components/pages/terms-and-condition/terms-and-condition';
import { SettingDashboard } from './components/setting-dashboard/setting-dashboard';
import { PrivacyPolicy } from './components/pages/privacy-policy/privacy-policy';
import { EditCareTeam } from './components/pages/care-team/care-team-components/edit-care-team/edit-care-team';
import { Themes } from './components/pages/content/themes/themes';
import { Categories } from './components/pages/content/categories/categories';
import { EditCategories } from './components/pages/content/categories/category-component/edit-categories/EditCategories';
import { ViewThemes } from './components/pages/content/themes/themes-components/view-theme/viewTheme';
import { CreateTheme } from './components/pages/content/themes/themes-components/create-theme/createTheme';
import { CreateCategories } from './components/pages/content/categories/category-component/create-category/create-category';
import { Lessons } from './components/pages/content/lessons/lessons';
import { ViewLessons } from './components/pages/content/lessons/lesson-components/view-lesson/viewLesson';
import { CreateNewLesson } from './components/pages/content/lessons/lesson-components/create-new-lesson/createNewLesson';
import { EditTheme } from './components/pages/content/themes/themes-components/edit-theme/editTheme';
import { ViewTips } from './components/pages/content/dailytips/view-tips/viewTips';
import { LifeStyle } from './components/pages/lifestyle-plan/view-lifestyle/LifeStyle';
import { ViewLifeStyle } from './components/pages/lifestyle-plan/components/view-lifestyle/viewLifestyle';
import { CreateLifestyle } from './components/pages/lifestyle-plan/components/create-lifestyle/createLifestyle';
import { DailyTips } from './components/pages/content/dailytips/dailyTips';
import { CreateDailyTips } from './components/pages/content/dailytips/createdailytips/createDailyTip';
import { PatientDashboard } from './components/pages/patient-platform/patient-dashboard/patient-dashboard';
import { Nutrition } from './components/pages/patient-platform/nutrition/nutrition';
import { Activity } from './components/pages/patient-platform/activity/activity';
import { SleepAnalysis } from './components/pages/patient-platform/sleep-analysis/sleep-analysis';
import { Assessments } from './components/pages/patient-platform/assessments/assessments';
import { Patients } from './components/pages/patient-Management/view-patients/patients';
import { CreatePatient } from './components/pages/patient-Management/create-patient/create-patient';
import { PatientProfile } from './components/pages/patient-Management/patient-profile/patient-profile';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';

import 'react-toastify/dist/ReactToastify.css';
import { PatientLifeStyle } from './components/pages/patient-platform/patient-lifestyle-plan/patient-lifestyle-plan';
import { EditPatient } from './components/pages/patient-Management/edit-patient/editPatient';
import { HealthCheckinResponse } from './components/pages/patient-platform/assessments/health-checkin/healthCheckIn';
import { HealthCheckDetail } from './components/pages/patient-platform/assessments/health-checkin/healthCheckinDetail';

// const router = createBrowserRouter([
//     { path: '/', element: <Home /> },
//     {}
// ]);

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Onboarding />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: '/check-your-email',
                element: <CheckYourEmail />,
            },
            {
                path: '/reset-password',
                element: <ResetPassword />,
            },
            {
                path: '/create-account',
                element: <CreateAccount />,
            },
            {
                path: '/create-new-password',
                element: <CreateNewPassword />,
            },
        ],
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/careteam',
                element: <CareTeam />,
            },
            {
                path: '/careteam/addcareteam',
                element: <CreateCareTeam />,
            },
            {
                path: '/careteam/careteamprofile/:id',
                element: <CareTeamProfile />,
            },
            {
                path: '/careteam/editteamcare/:id',
                element: <EditCareTeam />,
            },
            {
                path: '/setting-dashboard',
                element: <SettingDashboard />,
            },
            {
                path: '/content',
                element: <Categories />,
            },
            {
                path: '/content/categories',
                element: <Categories />,
            },
            {
                path: '/content/createcategories',
                element: <CreateCategories />,
            },
            {
                path: '/content/editcategories',
                element: <EditCategories />,
            },
            {
                path: '/content/themes',
                element: <Themes />,
            },
            {
                path: '/content/themes/viewtheme/:id',
                element: <ViewThemes />,
            },
            {
                path: '/content/themes/editTheme/:id',
                element: <EditTheme />,
            },
            {
                path: '/content/dailytips',
                element: <DailyTips />,
            },
            {
                path: '/content/dailytips/createdailytips',
                element: <CreateDailyTips />,
            },
            {
                path: '/content/themes/createtheme',
                element: <CreateTheme />,
            },
            {
                path: '/content/lessons',
                element: <Lessons />,
            },
            {
                path: '/content/lessons/viewlesson/:id',
                element: <ViewLessons />,
            },
            {
                path: '/content/lessons/createlesson',
                element: <CreateNewLesson />,
            },
            {
                path: '/content/lessons/editlesson/:id',
                element: <CreateNewLesson />,
            },
            {
                path: '/lifestyle-plan',
                element: <LifeStyle />,
            },
            {
                path: '/lifestyle-plan/view/:id',
                element: <ViewLifeStyle />,
            },
            {
                path: '/lifestyle-plan/new',
                element: <CreateLifestyle />,
            },
            {
                path: '/lifestyle-plan/edit/:id',
                element: <CreateLifestyle />,
            },

            {
                path: '/patient-dashboard',
                element: <PatientDashboard />,
            },
            {
                path: '/patient-dashboard/nutrition',
                element: <Nutrition />,
            },
            {
                path: '/patient-dashboard/activity',
                element: <Activity />,
            },
            {
                path: '/patient-dashboard/sleep-analysis',
                element: <SleepAnalysis />,
            },
            {
                path: '/patient-dashboard/assessments',
                element: <Assessments />,
            },

            {
                path: '/patient-dashboard/patient-lifestyle-plan',
                element: <PatientLifeStyle />,
            },
            {
                path: '/patients',
                element: <Patients />,
            },
            {
                path: '/create-patient',
                element: <CreatePatient />,
            },
            {
                path: '/patient-profile',
                element: <PatientProfile />,
            },
            {
                path: '/edit-patient',
                element: <EditPatient />,
            },
        ],
    },
    {
        path: '/',
        element: <SettingLayout />,
        children: [
            {
                path: '/terms-and-condition',
                element: <TermsAndCondition />,
            },
            {
                path: '/privacy-policy',
                element: <PrivacyPolicy />,
            },
            {
                path:'/Health/Check/In',
                element:<HealthCheckinResponse/>
            },
            {
                path: '/health-check-detail',
                element: <HealthCheckDetail />,
            }

        ],
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer />
        </>
    );
}

export default App;
