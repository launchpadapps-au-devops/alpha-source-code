import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetPassword } from './resetPasswordAPI';

// Updated to include both email and token
export interface ForgotPasswordUser {
    email: string;
    token: string; // Ensure this is part of your interface if you need it
}

export interface ForgotAuthState {
    isForgotPassword: boolean;
    user: ForgotPasswordUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: ForgotAuthState = {
    isForgotPassword: false,
    user: null,
    loading: false,
    error: null,
};

export const resetPasswordThunk = createAsyncThunk(
    'auth/forgotPassword',
    async (data: { password: string; token: string }, { rejectWithValue }) => {
        try {
            const { password, token } = data;
            const response = await resetPassword( password, token);
            return { response };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const resetPasswordSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setloading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(resetPasswordThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.isForgotPassword = true;
            // Ensure the structure here matches the state definition
            // state.user = { email: action.payload.email, token: action.payload.token };
        });
        builder.addCase(resetPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setloading } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
