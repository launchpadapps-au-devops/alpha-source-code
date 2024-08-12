import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { getThemes, getThemeById, addTheme, updateTheme } from './themeAPI';

export interface Theme {
    id: number;
    name: string;
    description: string;
}

export interface ThemesState {
    loading: boolean;
    errorMessage: string | null;
    themes: Theme[];
}

export interface ThemeState {
    loading: boolean;
    errorMessage: string | null;
    theme: Theme | null;
}

const initialThemesState: ThemesState = {
    loading: false,
    errorMessage: null,
    themes: [],
};

const initialThemeState: ThemeState = {
    loading: false,
    errorMessage: null,
    theme: null,
};

export const fetchThemesThunk = createAsyncThunk(
    'themes/getThemes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getThemes();
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const fetchThemeByIdThunk = createAsyncThunk(
    'theme/getThemeById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await getThemeById(id);
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const addThemeThunk = createAsyncThunk(
    'themes/addTheme',
    async (theme: any, { rejectWithValue }) => {
        try {
            const response = await addTheme(theme);
            // Fetch updated themes after adding a new one
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateThemeThunk = createAsyncThunk(
    'theme/updateTheme',
    async (
        { id, theme }: { id: number; theme: { name: string; description: string } },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const response = await updateTheme(id, theme);
            dispatch(fetchThemesThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const themesSlice = createSlice({
    name: 'themes',
    initialState: initialThemesState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchThemesThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchThemesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.themes = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchThemesThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const themeSlice = createSlice({
    name: 'theme',
    initialState: initialThemeState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchThemeByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchThemeByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.theme = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchThemeByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

const rootReducer = combineReducers({
    themes: themesSlice.reducer,
    theme: themeSlice.reducer,
});

export default rootReducer;
