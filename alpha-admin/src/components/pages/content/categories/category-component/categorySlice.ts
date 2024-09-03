import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import {
    getCategories,
    getCategoryById,
    addCategory,
    addCategoriesBulk,
    updateCategory,
} from './CategoryAPI';

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CategoriesResponse {
    data: Category[];
}

export interface CategoryResponse {
    data: Category;
}

export interface CategoriesState {
    loading: boolean;
    errorMessage: string | null;
    categories: Category[];
}

export interface CategoryState {
    loading: boolean;
    errorMessage: string | null;
    category: Category | null;
}

const initialCategoriesState: CategoriesState = {
    loading: false,
    errorMessage: null,
    categories: [],
};

const initialCategoryState: CategoryState = {
    loading: false,
    errorMessage: null,
    category: null,
};

export const fetchCategoriesThunk = createAsyncThunk<CategoriesResponse,any>(
    'categories/getCategories',
    async (page: any,{ rejectWithValue }) => {
        try {
            const response = await getCategories(page);
            console.log('Response ', response);
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const fetchCategoryByIdThunk = createAsyncThunk<CategoryResponse, number>(
    'category/getCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getCategoryById(id);
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

// Added thunks for category operations
export const addCategoryThunk = createAsyncThunk(
    'categories/addCategory',
    async (name: string, { dispatch, rejectWithValue }) => {
        try {
            const newCategory = {
                name: name,
                image: 'https://sample.com/sample.jpg',
                status: 'active',
                isPublished: true,
                description: 'description',
                metadata: {
                    key: 'value',
                },
            };
            const response = await addCategory(newCategory);
            dispatch(fetchCategoriesThunk(1));

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const addCategoriesBulkThunk = createAsyncThunk(
    'categories/addCategoriesBulk',
    async (categories: { name: string; description: string }[], { dispatch, rejectWithValue }) => {
        try {
            const response = await addCategoriesBulk(categories);
            dispatch(fetchCategoriesThunk(1));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateCategoryThunk = createAsyncThunk(
    'category/updateCategory',
    async ({ id, data }: { id: number; data: any }, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateCategory(id, data);
            dispatch(fetchCategoriesThunk(1));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const deleteCategoryThunk = createAsyncThunk(
    'category/updateCategory',
    async ({ id, name }: { id: number; name: string }, { dispatch, rejectWithValue }) => {
        try {
            const newCategory = {
                name: name,
                image: 'https://sample.com/sample.jpg',
                status: 'Inactive',
                isPublished: true,
                description: 'Category Description',
                metadata: {
                    key: 'value',
                },
                id: id,
            };
            const response = await updateCategory(id, newCategory);
            dispatch(fetchCategoriesThunk(1));
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: initialCategoriesState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchCategoriesThunk.fulfilled,
                (state, action: PayloadAction<CategoriesResponse>) => {
                    state.loading = false;
                    state.categories = action.payload.data;
                    state.errorMessage = null;
                }
            )
            .addCase(fetchCategoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Handling additional category operations
            .addCase(addCategoryThunk.fulfilled, (state) => {
                state.loading = false;
                // re-fetch categories to reflect changes
            })
            .addCase(addCategoriesBulkThunk.fulfilled, (state) => {
                state.loading = false;
                // re-fetch categories to reflect changes
            });
    },
});

export const categorySlice = createSlice({
    name: 'category',
    initialState: initialCategoryState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchCategoryByIdThunk.fulfilled,
                (state, action: PayloadAction<CategoryResponse>) => {
                    state.loading = false;
                    state.category = action.payload.data;
                    state.errorMessage = null;
                }
            )
            .addCase(fetchCategoryByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

const rootReducer = combineReducers({
    categories: categoriesSlice.reducer,
    category: categorySlice.reducer,
});

export default rootReducer;
