import { createAsyncThunk, createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';
import { getPatientDataOverview, UserDataOverviewResponse } from './userDataOverviewAPI';

// Define the data structure for the response
interface StepsPerDay {
    date: string;
    steps: number;
}

interface NutritionData {
    calories: number;
    protien: number;
    carbs: number;
    fats: number;
}

export interface userDataOverview {
    steps: number;
    averageStepsPerDay: number;
    stepsPerDay: StepsPerDay[];
    sleep: number;
    averageSleepPerDay: number;
    energy: number;
    averageEnergyPerDay: number;
    calories: number;
    averageCaloriesPerDay: number;
    nutritionData: NutritionData;
}

// Define the initial state
export interface UserDataOverviewState {
    loading: boolean;
    errorMessage: string | null;
    data: userDataOverview | null;
}

const initialPatientDataOverviewState: UserDataOverviewState = {
    loading: false,
    errorMessage: null,
    data: null,
};

// Async thunk to fetch patient data overview
export const fetchUserDataOverviewThunk = createAsyncThunk(
    'userDataOverview/getPatientDataOverview',
    async (patientId: string, { rejectWithValue }) => {
        try {
            const response = await getPatientDataOverview(patientId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Slice to manage state for the patient data overview
const userDataOverviewSlice = createSlice({
    name: 'userDataOverview',
    initialState: initialPatientDataOverviewState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDataOverviewThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchUserDataOverviewThunk.fulfilled,
                (state, action: PayloadAction<UserDataOverviewResponse>) => {
                    state.loading = false;
                    state.data = action.payload.data;
                    state.errorMessage = null;
                }
            )
            .addCase(fetchUserDataOverviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

const rootReducer = combineReducers({
    userDataOverview: userDataOverviewSlice.reducer,
});

export default rootReducer;
