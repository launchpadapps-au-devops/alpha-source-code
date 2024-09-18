import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import addNewStaffService, { getStaff, inviteStaff } from './create-care-teamAPI';
import { getStaffRole } from './create-care-teamAPI';

export interface staffState {
    loading: boolean;
    errorMessage: string | null;
    staff: any[];
}

export interface staffRoleState {
    roleLoading: boolean;
    roleErrorMessage: string | null;
    roleStaff: any[];
}

const initialState: staffState = {
    loading: false,
    errorMessage: null,
    staff: [],
};

const initialRoleState: staffRoleState = {
    roleLoading: false,
    roleErrorMessage: null,
    roleStaff: [],
};

interface staffFormData {
    userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        roleId: number;
    };
    permissions: Array<any>;
}

export const staffThunk = createAsyncThunk('staff/getStaff', async (page:any, { rejectWithValue }) => {
    try {
        const response = await getStaff(page);
        return response;
    } catch (error) {
        console.log('Response ERROR ', error);
        return rejectWithValue(error);
    }
});

export const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        addStaffMember: (state, action: PayloadAction<any>) => {
            state.staff.push(action.payload.data);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(staffThunk.pending, (state) => {
                state.loading = true;
            })

            .addCase(staffThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload.data;
                state.errorMessage = null;
            })

            .addCase(staffThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const { addStaffMember } = staffSlice.actions;

export const addNewStaffThunk = createAsyncThunk(
    'addNewStaff/addNewStaffThunk',
    async (formData: staffFormData, { dispatch, rejectWithValue }) => {
        try {
            console.log('formData', formData);
            const response = await addNewStaffService(formData);
            dispatch(addStaffMember(response));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getStaffRoleThunk = createAsyncThunk('staff/getStaffRole', async (staffId: any) => {
    try {
        const response = await getStaffRole(staffId);
        console.log('Response ', response);
        return response;
    } catch (error) {
        console.log('Response ERROR ', error);
        return error;
    }
});

export const getStaffRoleSlice = createSlice({
    name: 'staffRole',
    initialState: initialRoleState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStaffRoleThunk.pending, (state) => {
                state.roleLoading = true;
            })

            .addCase(getStaffRoleThunk.fulfilled, (state, action) => {
                state.roleLoading = false;
                state.roleStaff = action.payload.data;
                state.roleErrorMessage = null;
            })

            .addCase(getStaffRoleThunk.rejected, (state, action) => {
                state.roleLoading = false;
                state.roleErrorMessage = action.payload as string;
            });
    },
});

// Async thunk for inviting a staff member
export const inviteStaffThunk = createAsyncThunk(
  'staff/inviteStaff',
  async ({ staffId}: { staffId: string }, thunkAPI) => {
    try {
      const response = await inviteStaff(staffId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const rootReducer = combineReducers({
    staff: staffSlice.reducer,
    staffRole: getStaffRoleSlice.reducer,
});

export default rootReducer;
