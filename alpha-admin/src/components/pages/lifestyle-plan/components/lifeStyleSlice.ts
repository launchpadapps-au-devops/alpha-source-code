import { createAsyncThunk, createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { getPlans, getPlanById, addPlan, updatePlan } from './lifeStyleAPI';

export interface Plan {
    id: number;
    name: string;
    description: string;
}

export interface PlansState {
    loading: boolean;
    errorMessage: string | null;
    plans: Plan[];
}

export interface PlanState {
    loading: boolean;
    errorMessage: string | null;
    plan: Plan | null;
}

const initialPlansState: PlansState = {
    loading: false,
    errorMessage: null,
    plans: [],
};

const initialPlanState: PlanState = {
    loading: false,
    errorMessage: null,
    plan: null,
};

export const fetchPlansThunk = createAsyncThunk(
    'plans/getPlans',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPlans();
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const fetchPlanByIdThunk = createAsyncThunk(
    'plan/getPlanById',
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await getPlanById(id);
            return response;
        } catch (error) {
            console.log('Response ERROR ', error);
            return rejectWithValue(error);
        }
    }
);

export const addPlanThunk = createAsyncThunk(
    'plans/addPlan',
    async (plan: any, { rejectWithValue }) => {
        try {
            const response = await addPlan(plan);
            // Fetch updated plans after adding a new one
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updatePlanThunk = createAsyncThunk(
    'plan/updatePlan',
    async (
        { id, plan }: { id: number; plan: { name: string; description: string } },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const response = await updatePlan(id, plan);
            dispatch(fetchPlansThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const plansSlice = createSlice({
    name: 'plans',
    initialState: initialPlansState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlansThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPlansThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchPlansThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const planSlice = createSlice({
    name: 'plan',
    initialState: initialPlanState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlanByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPlanByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.plan = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchPlanByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

const rootReducer = combineReducers({
    plans: plansSlice.reducer,
    plan: planSlice.reducer,
});

export default rootReducer;
