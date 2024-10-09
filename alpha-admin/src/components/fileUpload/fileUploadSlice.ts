import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/config'; // Assume config contains your BASE_URL
import apiClient from '../pages/login/axios-setup';

interface FileUploadState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: FileUploadState = {
    loading: false,
    success: false,
    error: null,
};

// Create an async thunk to handle file upload
export const uploadFile = createAsyncThunk(
    'fileUpload/uploadFile',
    async (file: File, { rejectWithValue }) => {
        const accessToken = localStorage.getItem('accessToken');
        const apiURL = `${config.BASE_URL}/gateway/v1/file/upload`;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post(apiURL, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error: any) {
            console.error('Error', error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

const fileUploadSlice = createSlice({
    name: 'fileUpload',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadFile.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default fileUploadSlice.reducer;
