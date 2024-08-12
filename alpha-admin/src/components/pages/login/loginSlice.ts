import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login } from "./loginAPI";

export interface UserDetails {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}

export interface LoginSliceState {
    refreshTokenExpiresAt: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    accessToken: string;
    userDetails: UserDetails;
    loggedIn: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: LoginSliceState = {
    userDetails: {
        accessToken: '',
        accessTokenExpiresAt: '',
        refreshToken: '',
        refreshTokenExpiresAt: ''
    },
    loggedIn: false,
    loading: false,
    error: null,
    accessToken: "",
    refreshTokenExpiresAt: "",
    refreshToken: "",
    accessTokenExpiresAt: ""
};

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (userData: { userEmail: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await login(userData.userEmail, userData.password);
            console.log(response.data, "response.data")
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('accessTokenExpiresAt', response.data.accessTokenExpiresAt);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('refreshTokenExpiresAt', response.data.refreshTokenExpiresAt);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        initializeUser: (state) => {
            const accessToken = localStorage.getItem('accessToken');
            const accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt');
            const refreshToken = localStorage.getItem('refreshToken');
            const refreshTokenExpiresAt = localStorage.getItem('refreshTokenExpiresAt');
            if (accessToken && accessTokenExpiresAt && refreshToken && refreshTokenExpiresAt) {
                state.userDetails = {
                    accessToken,
                    accessTokenExpiresAt,
                    refreshToken,
                    refreshTokenExpiresAt
                };
                state.loggedIn = true;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
               // state.userDetails = action.payload;
                state.loggedIn = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { initializeUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
