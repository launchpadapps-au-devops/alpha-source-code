import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPatientDataOverview, PatientDataOverviewResponse } from './patientDataOverviewAPI';

interface StepsPerDay {
    date: string;
    steps: number;
}

interface PatientDataOverview {
    steps: number;
    averageStepsPerDay: number;
    stepsPerDay: StepsPerDay[];
    sleep: number;
    averageSleepPerDay: number;
    energy: number;
    averageEnergyPerDay: number;
    calories: number;
    averageCaloriesPerDay: number;
}

interface PatientDataOverviewState {
    loading: boolean;
    errorMessage: string | null;
    data: PatientDataOverview | null;
}

const initialPatientDataOverviewState: PatientDataOverviewState = {
    loading: false,
    errorMessage: null,
    data: null,
};

export const fetchPatientDataOverviewThunk = createAsyncThunk(
    'patientDataOverview/getPatientDataOverview',
    async (
        { id, fromDate, toDate }: { id: string; fromDate: string; toDate: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await getPatientDataOverview(id, fromDate, toDate);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const patientDataOverviewSlice = createSlice({
    name: 'patientDataOverview',
    initialState: initialPatientDataOverviewState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientDataOverviewThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchPatientDataOverviewThunk.fulfilled,
                (state, action: PayloadAction<PatientDataOverviewResponse>) => {
                    state.loading = false;
                    state.data = action.payload.data;
                    state.errorMessage = null;
                }
            )
            .addCase(fetchPatientDataOverviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export default patientDataOverviewSlice.reducer;
