import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TaskEntity } from "../../domain/entities/TaskEntity";
import { AddTaskParams } from "../../domain/usecases/AddTask_Usecase";
import { UpdateTaskParams as DomainUpdateTaskParams } from "../../domain/usecases/UpdateTask_Usecase";
import { GetAllTask_Service, RemoveTask_Service, UpdateTask_Service, AddTask_Service} from "../services/taskServices";
import { RootState } from "../CreateStore";

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
    return response.sort((a,b) => a.id - b.id);
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
    async (taskId: number, { getState }) => {
        await RemoveTask_Service.execute(taskId);
        return taskId;
    }
);

export const updateExistingAppTask = createAsyncThunk(
    'appTasks/updateExistingAppTask',
    async (taskData: DomainUpdateTaskParams) => {
        const response = await UpdateTask_Service.execute(taskData);
        return response;
    }
);

export const deleteAllCompletedAppTasks = createAsyncThunk(
    'appTasks/deleteAllCompletedAppTasks',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const completedTasks = state.appTaskRTK.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) {
            return [];
        }

        const deletedTaskIds: number[] = [];
        for (const task of completedTasks) {
            await RemoveTask_Service.execute(task.id);
            deletedTaskIds.push(task.id);
        }
        return deletedTaskIds;
    }
);

const appTaskSlice = createSlice({
    name: 'appTaskRTK',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(addNewAppTask.pending, (state) => {
            })
            .addCase(addNewAppTask.fulfilled, (state, action: PayloadAction<TaskEntity>) => {
                state.status = 'succeeded';
                state.tasks.push(action.payload);
                state.tasks.sort((a,b) => a.id - b.id);
            })
            .addCase(addNewAppTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteAppTask.pending, (state) => {
            })
            .addCase(deleteAppTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(deleteAppTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateExistingAppTask.pending, (state) => {
            })
            .addCase(updateExistingAppTask.fulfilled, (state, action: PayloadAction<TaskEntity>) => {
              state.status = 'succeeded';
              const index = state.tasks.findIndex(task => task.id === action.payload.id);
              if (index !== -1) {
                state.tasks[index] = action.payload;
                state.tasks.sort((a,b) => a.id - b.id);
              }
            })
            .addCase(updateExistingAppTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteAllCompletedAppTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteAllCompletedAppTasks.fulfilled, (state, action: PayloadAction<number[]>) => {
                state.status = 'succeeded';
                state.tasks = state.tasks.filter(task => !action.payload.includes(task.id));
            })
            .addCase(deleteAllCompletedAppTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default appTaskSlice.reducer;