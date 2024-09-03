import { combineReducers, Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import authSlice from '../components/pages/login/loginSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
// import forgotPasswordReducer from '../components/pages/forgot-password-components/forgot-password-slice';
// import resetPasswordReducer from '../components/Pages/reset-password/reset-passwordSlice'
import staffReducer from '../components/pages/care-team/care-team-components/create-care-team/create-care-teamSlice';
import addNewStaffReducer from '../components/pages/care-team/care-team-components/create-care-team/create-care-teamSlice';
import removeStaffReducer from '../components/pages/care-team/care-team-components/create-care-team/create-care-teamSlice';
import editStaffReducer from '../components/pages/care-team/care-team-components/edit-care-team/edit-care-teamSlice';
import categoriesReducer from '../components/pages/content/categories/category-component/categorySlice';
import lessonsReducer from '../components/pages/content/lessons/lesson-components/lessonsSlice';
import tipsReducer from '../components/pages/content/dailytips/viewTipsSlice';
import fileUploadReducer from '../components/fileUpload/fileUploadSlice';
import patientsSlice from '../components/pages/patient-Management/patientsSlice';

//Dashboard
import activePatientReducer from '../components/pages/dashboard/dashboard-components/activePatientsSlice';

//Patient Platform
import getPatientDataOverviewReducer from '../components/pages/patient-platform/patientDataOverviewSlice';

const rootReducer = combineReducers({
    login: authSlice,
    // forgotPassword: forgotPasswordReducer,
    // resetPassword: resetPasswordReducer,
    staff: staffReducer,
    addNewStaff: addNewStaffReducer,
    removeStaff: removeStaffReducer,
    // resetPassword: resetPasswordReducer,
    editStaff: editStaffReducer,
    categories: categoriesReducer,
    lessons: lessonsReducer,
    tips: tipsReducer,
    fileUpload: fileUploadReducer,
    patients: patientsSlice,

    // Dashboard
    activePatients: activePatientReducer,

    //Patient Platform
    patientDataAnalyticsOverview: getPatientDataOverviewReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        preloadedState,
    });

    setupListeners(store.dispatch);
    return store;
};

export const store = makeStore();

export type AppStore = typeof store;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ThunReturnType = void> = ThunkAction<void, RootState, unknown, Action<string>>;
