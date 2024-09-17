import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPatients, addPatientAPI, PatientsResponse, Patient, MetaData, updatePatientProfile } from './patientsAPI';
import { CreatePatientData } from './create-patient/create-patient';
import { EditPatientData } from './edit-patient/editPatient';


// Define the state interface
export interface PatientsState {
    loading: boolean;
    loadingMore: boolean;
    errorMessage: string | null;
    patients: Patient[];
    meta: MetaData | null;
    currentPage: number;
    updatedPatient?: Patient | null;  // Add this to handle updated patient state
}

// Initial state for the slice
const initialState: PatientsState = {
    loading: false,
    loadingMore: false,
    errorMessage: null,
    patients: [],
    meta: null,
    currentPage: 1,
    updatedPatient: null,
};

// Thunk to fetch patients with pagination
export const fetchPatients = createAsyncThunk(
    'patients/getPatients',
    async (
        { page = 1, sortField = '', searchKey, searchValue }: 
        { page?: number; sortField?: string; searchKey?: string; searchValue?: string }, 
        { rejectWithValue }
    ) => {
        try {
            const limit = 10;
            const response: PatientsResponse = await getPatients(page, limit, sortField, searchKey, searchValue);
            return response;
        } catch (error) {
            console.log('Response ERROR', error);
            return rejectWithValue(error);
        }
    }
);

// Thunk to update patient details
export const updatePatient = createAsyncThunk(
    'patients/updatePatient',
    async ({ patientData, id }: { patientData: EditPatientData; id: string }, { rejectWithValue }) => {
        try {
            const response = await updatePatientProfile(patientData, id);
            return response; // Return the updated patient data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message); // Handle the error
        }
    }
);
// Thunk to add a new patient
export const addNewPatient = createAsyncThunk(
    'patients/addPatient',
    async (patientData: CreatePatientData, { rejectWithValue }) => {
        try {
            const response: PatientsResponse = await addPatientAPI(patientData);
            return response;
        } catch (error) {
            console.error('Add Patient ERROR', error);
            return rejectWithValue(error);
        }
    }
);

// Slice for managing patients state
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
            // Fetch patients
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<PatientsResponse>) => {
                state.loading = false;
                state.loadingMore = false;
                state.patients = action.payload.data; // Replace the state with new data for the selected page
                state.meta = action.payload.meta;
                state.errorMessage = null;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                state.errorMessage = action.payload as string;
            })
            
            // Add new patient
            .addCase(addNewPatient.pending, (state) => {
                state.loading = true;
            })
            .addCase(addNewPatient.fulfilled, (state, action: PayloadAction<PatientsResponse>) => {
                state.loading = false;
                state.patients.push(action.payload.data[0]); // Assuming response includes the newly added patient
                state.errorMessage = null;
            })
            .addCase(addNewPatient.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            
            // Update patient details
            .addCase(updatePatient.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePatient.fulfilled, (state, action: PayloadAction<Patient>) => {
                state.loading = false;
                state.updatedPatient = action.payload; // Store updated patient details
                state.errorMessage = null;
            })
            .addCase(updatePatient.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

// Export actions and reducer
export const { addPatient } = patientsSlice.actions;
export default patientsSlice.reducer;
