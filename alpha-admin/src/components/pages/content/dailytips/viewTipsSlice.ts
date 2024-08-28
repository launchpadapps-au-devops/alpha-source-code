import { createAsyncThunk, createSlice, combineReducers } from '@reduxjs/toolkit';
import { getTips, getTipByDay, addTip } from './viewTipsAPI';
import { ReactNode } from 'react';

export interface Tip {
    content: string;
    day: any;
    id: number;
    status: string;
    tip: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    date: string;
}

export interface TipsState {
    loading: boolean;
    errorMessage: string | null;
    tips: any;
}

export interface TipState {
    loading: boolean;
    errorMessage: string | null;
    tip: Tip | null;
}

const initialTipsState: TipsState = {
    loading: false,
    errorMessage: null,
    tips: [],
};

const initialTipState: TipState = {
    loading: false,
    errorMessage: null,
    tip: null,
};

export const fetchTipsThunk = createAsyncThunk('tips/getTips', async (_, { rejectWithValue }) => {
    try {
        const response = await getTips();
        return response;
    } catch (error: any) {
        console.error('Response ERROR', error);
        return rejectWithValue(error.toString());
    }
});

export const fetchTipByDayThunk = createAsyncThunk(
    'tip/getTipByDay',
    async (day: any, { rejectWithValue }) => {
        try {
            const response = await getTipByDay(day);
            return response;
        } catch (error: any) {
            console.error('Response ERROR', error);
            return rejectWithValue(error.toString());
        }
    }
);

export const addTipThunk = createAsyncThunk(
    'tips/addTip',
    async (tip: any, { dispatch, rejectWithValue }) => {
        try {
            const response = await addTip(tip);
            dispatch(fetchTipsThunk());
            return response;
        } catch (error: any) {
            return rejectWithValue(error.toString());
        }
    }
);

export const tipsSlice = createSlice({
    name: 'tips',
    initialState: initialTipsState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTipsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTipsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.tips = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchTipsThunk.rejected, (state, action) => {
                state.loading = false;
                // state.errorMessage = action.payload ?? 'Unknown error';
            });
    },
});

export const tipSlice = createSlice({
    name: 'tip',
    initialState: initialTipState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTipByDayThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTipByDayThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.tip = action.payload.data.data;
                state.errorMessage = null;
            })
            .addCase(fetchTipByDayThunk.rejected, (state, action) => {
                state.loading = false;
                // state.errorMessage = action.payload ?? 'Unknown error';
            });
    },
});

const rootReducer = combineReducers({
    tips: tipsSlice.reducer,
    tip: tipSlice.reducer,
});

export default rootReducer;
