import { combineReducers, Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import authSlice from '../components/pages/login/loginSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import staffReducer from '../components/pages/care-team/care-team-components/create-care-team/create-care-teamSlice';
import addNewStaffReducer from '../components/pages/care-team/care-team-components/create-care-team/create-care-teamSlice';
import removeStaffReducer from '../components/pages/care-team/care-team-components/create-care-team/create-care-teamSlice';
import editStaffReducer from '../components/pages/care-team/care-team-components/edit-care-team/edit-care-teamSlice';
import categoriesReducer from '../components/pages/content/categories/category-component/categorySlice';
import lessonsReducer from '../components/pages/content/lessons/lesson-components/lessonsSlice';
import tipsReducer from '../components/pages/content/dailytips/viewTipsSlice';
import fileUploadReducer from '../components/fileUpload/fileUploadSlice';
import patientsSlice from '../components/pages/patient-Management/patientsSlice';
import passwordResetReducer from '../components/pages/forgot-password/forgot-password-slice';
import activePatientReducer from '../components/pages/dashboard/dashboard-components/activePatientsSlice';
import getPatientDataOverviewReducer from '../components/pages/patient-platform/patientDataOverviewSlice';
import getUserDataOverviewReducer from '../components/pages/dashboard/dashboard-components/user-data-overvie-store/userDataOverviewSlice';
import policyReducer from '../components/pages/terms-and-condition/privacyPolicySlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Combine all your reducers into a root reducer
const rootReducer = combineReducers({
    login: authSlice,
    passwordReset: passwordResetReducer,
    staff: staffReducer,
    addNewStaff: addNewStaffReducer,
    removeStaff: removeStaffReducer,
    editStaff: editStaffReducer,
    categories: categoriesReducer,
    lessons: lessonsReducer,
    tips: tipsReducer,
    fileUpload: fileUploadReducer,
    patients: patientsSlice,
    activePatients: activePatientReducer,
    userDataOverview: getUserDataOverviewReducer,
    patientDataAnalyticsOverview: getPatientDataOverviewReducer,
    policy: policyReducer,
});

// Configuration for redux-persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['login'], // Only persist the 'login' slice
};

// Apply the persistReducer to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

// Create a function to configure the store
export const makeStore = (preloadedState?: any) => {
    const store = configureStore({
        reducer: persistedReducer, // Use persisted reducer here
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore persist actions
            },
        }),
        preloadedState,
    });

    setupListeners(store.dispatch);
    return store;
};

// Create the store
export const store = makeStore();

// Create the persistor object for managing persisting and rehydrating
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunReturnType = void> = ThunkAction<void, RootState, unknown, Action<string>>;
