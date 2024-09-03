import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import editStaffService from "./edit-care-teamAPI";


interface editStaffData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    roleId: string;
    permissions: Array<any>;
}

export interface editStaffState {
    loading: boolean;
    errorMessage: string | null;
    success: boolean;
    updatedStaffMember: any[];
}

const initialState: editStaffState = {
    loading: false,
    errorMessage: null,
    success: false,
    updatedStaffMember: [],
};

export const editStaffThunk = createAsyncThunk('editStaff/editStaffThunk',
    async ({ id, formData }: { id: string | undefined; formData: editStaffData }, { rejectWithValue }) => {
        try {
            console.log('formData', formData);
            const response = await editStaffService(id, formData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const editStaffSlice = createSlice({
    name: 'editStaff',
    initialState,
    reducers: {
        resetEditStaffInitial: (state) => {
            console.log('resetEditStaffInitial');
            state.loading = false;
            state.errorMessage = '';
            state.success = false;
            state.updatedStaffMember = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(editStaffThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(editStaffThunk.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = true;
                state.updatedStaffMember = action.payload;
            })
            .addCase(editStaffThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    }
});

export const { resetEditStaffInitial } = editStaffSlice.actions;
export default editStaffSlice.reducer;