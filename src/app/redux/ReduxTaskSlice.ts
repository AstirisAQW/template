import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TaskEntity } from "../../domain/entities/TaskEntity";
import { AddTaskParams } from "../../domain/usecases/AddTask_Usecase";
import { GetAllTask_Service, GetTask_Service, RemoveTask_Service, UpdateTask_Service, AddTask_Service} from "../services/taskServices";

export interface AppTasksState {
    tasks: TaskEntity[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
}

const initialState: AppTasksState = {
    tasks: [],
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchAppTasks = createAsyncThunk('appTasks/fetchAppTasks', async () => {
    const response = await GetAllTask_Service.execute();
    return response; // This will be the action.payload in the fulfilled case
});

export const addNewAppTask = createAsyncThunk(
    'appTasks/addNewAppTask',
    async (taskData: AddTaskParams) => {
        const response = await AddTask_Service.execute(taskData);
        return response;
    }
);

export const deleteAppTask = createAsyncThunk(
    'appTasks/deleteAppTask',
    async (taskId: number) => {
        await RemoveTask_Service.execute(taskId);
        return taskId; // Return the id to use in the reducer
    }
);

export const updateExistingAppTask = createAsyncThunk(
    'appTasks/updateExistingAppTask',
    async (taskData: TaskEntity) => { // Or use UpdateTaskParams
        const response = await UpdateTask_Service.execute(taskData);
        return response;
    }
);

const appTasksSlice = createSlice({
    name: 'appTasks',
    initialState,
    reducers: {
        // You can add synchronous reducers here if needed
        // e.g., resetState, reorderTasks, etc.
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchAppTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAppTasks.fulfilled, (state, action: PayloadAction<TaskEntity[]>) => {
                state.status = 'succeeded';
                state.tasks = action.payload;
            })
            .addCase(fetchAppTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Add New Task
            .addCase(addNewAppTask.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addNewAppTask.fulfilled, (state, action: PayloadAction<TaskEntity>) => {
                state.status = 'succeeded';
                state.tasks.push(action.payload);
            })
            .addCase(addNewAppTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Delete Task
            .addCase(deleteAppTask.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteAppTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(deleteAppTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
            // Update Task (if implemented)
            // .addCase(updateExistingAppTask.fulfilled, (state, action: PayloadAction<TaskEntity>) => {
            //   state.status = 'succeeded';
            //   const index = state.tasks.findIndex(task => task.id === action.payload.id);
            //   if (index !== -1) {
            //     state.tasks[index] = action.payload;
            //   }
            // })
    },
});

// Export any synchronous actions if you created them in reducers: {}
// export const { someSyncAction } = appTasksSlice.actions;

export default appTasksSlice.reducer;