import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { login } from './loginAPI'; // Assuming this is the login function you've implemented to call the login API
import { config } from '../../../config/config';

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
    userType: string | null; // Added userType to the state
}

const initialState: LoginSliceState = {
    userDetails: {
        accessToken: '',
        accessTokenExpiresAt: '',
        refreshToken: '',
        refreshTokenExpiresAt: '',
    },
    loggedIn: false,
    loading: false,
    error: null,
    accessToken: '',
    refreshTokenExpiresAt: '',
    refreshToken: '',
    accessTokenExpiresAt: '',
    userType: null, // Initialize userType as null
};

// Thunk for logging in and fetching user profile
export const loginThunk = createAsyncThunk(
    'auth/login',
    async (userData: { userEmail: string; password: string }, { rejectWithValue }) => {
        try {
            // First, call the login API
            const response = await login(userData.userEmail, userData.password);
            console.log(response.data, 'response.data');

            // Save tokens in local storage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('accessTokenExpiresAt', response.data.accessTokenExpiresAt);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('refreshTokenExpiresAt', response.data.refreshTokenExpiresAt);

            // Get access token for the next API call
            const accessToken = response.data.accessToken;

            // Second, call the profile API to fetch user details
            const profileResponse = await axios.get(
                `${config.BASE_URL}/gateway/v1/staff/my-profile`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Pass the access token in the header
                        accept: 'application/json',
                    },
                }
            );

            // Extract userType from profile response
            const { id, userType } = profileResponse.data.data;

            // Save loggedUserID (id) in local storage
            localStorage.setItem('loggedUserID', id);

            // Return the combined response data (tokens and userType)
            return { ...response.data, userType };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Create the auth slice
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
                    refreshTokenExpiresAt,
                };
                state.loggedIn = true;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setLoggedOut: (state) => {
            state.userDetails = {
                accessToken: '',
                accessTokenExpiresAt: '',
                refreshToken: '',
                refreshTokenExpiresAt: '',
            };
            state.loggedIn = false;
            state.userType = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.userDetails = {
                    accessToken: action.payload.accessToken,
                    accessTokenExpiresAt: action.payload.accessTokenExpiresAt,
                    refreshToken: action.payload.refreshToken,
                    refreshTokenExpiresAt: action.payload.refreshTokenExpiresAt,
                };
                state.loggedIn = true;
                state.loading = false;
                state.error = null;
                state.userType = action.payload.userType;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Export the actions and reducer
export const { initializeUser, setLoading, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
