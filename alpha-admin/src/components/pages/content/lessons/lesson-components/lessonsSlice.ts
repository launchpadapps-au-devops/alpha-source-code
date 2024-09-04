import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { getLessons, getLessonById, addLesson, addLessonsBulk, updateLesson } from './lessonsAPI';

export interface Lesson {
    id: number;
    title: string;
    content: string;
}

export interface LessonsState {
    loading: boolean;
    errorMessage: string | null;
    lessons: Lesson[];
}

export interface LessonState {
    loading: boolean;
    errorMessage: string | null;
    lesson: Lesson | null;
}

const initialLessonsState: LessonsState = {
    loading: false,
    errorMessage: null,
    lessons: [],
};

const initialLessonState: LessonState = {
    loading: false,
    errorMessage: null,
    lesson: null,
};

export const fetchLessonsThunk = createAsyncThunk(
    'lessons/getLessons',
    async (page:any, { rejectWithValue }) => {
        try {
            const response = await getLessons(page);
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const fetchLessonByIdThunk = createAsyncThunk(
    'lesson/getLessonById',
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await getLessonById(id);
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const addLessonThunk = createAsyncThunk(
    'lessons/addLesson',
    async (data: any, { dispatch, rejectWithValue }) => {
        try {
            const response = await addLesson(data);
            dispatch(fetchLessonsThunk(1));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const addLessonsBulkThunk = createAsyncThunk(
    'lessons/addLessonsBulk',
    async (lessons: { title: string; content: string }[], { dispatch, rejectWithValue }) => {
        try {
            const response = await addLessonsBulk(lessons);
            dispatch(fetchLessonsThunk(1));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateLessonThunk = createAsyncThunk(
    'lesson/updateLesson',
    async ({ id, data }: { id: any; data: any }, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateLesson(id, data);
            dispatch(fetchLessonsThunk(1));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const lessonsSlice = createSlice({
    name: 'lessons',
    initialState: initialLessonsState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLessonsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchLessonsThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const lessonSlice = createSlice({
    name: 'lesson',
    initialState: initialLessonState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLessonByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.lesson = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchLessonByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

const rootReducer = combineReducers({
    lessons: lessonsSlice.reducer,
    lesson: lessonSlice.reducer,
});

export default rootReducer;
