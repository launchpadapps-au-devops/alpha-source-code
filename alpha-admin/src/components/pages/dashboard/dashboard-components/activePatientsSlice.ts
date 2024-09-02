import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { ActivePatientsResponse, getActivePatients } from './acticePatientAPI';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    age: number;
}

export interface ActivePatientsState {
    loading: boolean;
    errorMessage: string | null;
    users: User[];
    count: number;
}

const initialActivePatientsState: ActivePatientsState = {
    loading: false,
    errorMessage: null,
    users: [],
    count: 0,
};

export const fetchActivePatientsThunk = createAsyncThunk(
    'activePatients/getActivePatients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getActivePatients();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const activePatientsSlice = createSlice({
    name: 'activePatients',
    initialState: initialActivePatientsState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivePatientsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchActivePatientsThunk.fulfilled,
                (state, action: PayloadAction<ActivePatientsResponse>) => {
                    state.loading = false;
                    state.users = action.payload.data.users;
                    state.count = action.payload.data.count;
                    state.errorMessage = null;
                }
            )
            .addCase(fetchActivePatientsThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

const rootReducer = combineReducers({
    activePatients: activePatientsSlice.reducer,
});

export default rootReducer;
