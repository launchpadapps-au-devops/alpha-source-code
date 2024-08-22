import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { getPatients, PatientsResponse, Patient, MetaData } from './patientsAPI'; 
import { ReactNode } from 'react';
import { JSX } from 'react/jsx-runtime';

export interface PatientsState {
    loading: boolean;
    errorMessage: string | null;
    patients: Patient[];
    meta: MetaData | null;
}

const initialState: PatientsState = {
    loading: false,
    errorMessage: null,
    patients: [],
    meta: null,
};

export const fetchPatients = createAsyncThunk('patients/getPatients', async (_, { rejectWithValue }) => {
    try {
        const response: PatientsResponse = await getPatients();
        return response;
    } catch (error) {
        console.log('Response ERROR ', error);
        return rejectWithValue(error);
    }
});

export const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        addPatient: (state, action: PayloadAction<Patient>) => {
            state.patients.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<PatientsResponse>) => {
                state.loading = false;
                state.patients = action.payload.data;
                state.meta = action.payload.meta;
                state.errorMessage = null;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const { addPatient } = patientsSlice.actions;

const rootReducer = combineReducers({
    patients: patientsSlice.reducer,
});

export default rootReducer;
