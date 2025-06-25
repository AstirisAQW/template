import { TaskEntity } from "../../domain/entities/TaskEntity";

export const GET_APPTASK_REQUEST = "GET_APPTASK_REQUEST";
export const GET_APPTASK_SUCCESS = "GET_APPTASK_SUCCESS";
export const GET_APPTASK_FAILURE = "GET_APPTASK_FAILURE";

export const ADD_APPTASK_REQUEST = "ADD_APPTASK_REQUEST";
export const ADD_APPTASK_SUCCESS = "ADD_APPTASK_SUCCESS";
export const ADD_APPTASK_FAILURE = "ADD_APPTASK_FAILURE";

export const REMOVE_APPTASK_REQUEST = "REMOVE_APPTASK_REQUEST";
export const REMOVE_APPTASK_SUCCESS = "REMOVE_APPTASK_SUCCESS";
export const REMOVE_APPTASK_FAILURE = "REMOVE_APPTASK_FAILURE";

// New actions for updating a task
export const UPDATE_APPTASK_REQUEST = "UPDATE_APPTASK_REQUEST";
export const UPDATE_APPTASK_SUCCESS = "UPDATE_APPTASK_SUCCESS";
export const UPDATE_APPTASK_FAILURE = "UPDATE_APPTASK_FAILURE";

// Actions for deleting all completed tasks (though thunk might handle multiple REMOVE actions)
// For simplicity, we might not need specific types if handled by a thunk that dispatches existing actions
// or a new thunk that directly modifies state based on service calls.

export interface AppTaskState{
    task: TaskEntity[]; // TaskEntity now has 'completed'
    loading:boolean;
    error:string | null;
}

interface GetAppTasksRequestAction { type: typeof GET_APPTASK_REQUEST; }
interface GetAppTasksSuccessAction { type: typeof GET_APPTASK_SUCCESS; payload: TaskEntity[]; }
interface GetAppTasksFailureAction { type: typeof GET_APPTASK_FAILURE; payload: string; }

interface AddAppTaskRequestAction { type: typeof ADD_APPTASK_REQUEST; }
interface AddAppTaskSuccessAction { type: typeof ADD_APPTASK_SUCCESS; payload: TaskEntity; }
interface AddAppTaskFailureAction { type: typeof ADD_APPTASK_FAILURE; payload: string; }

interface RemoveAppTaskRequestAction { type: typeof REMOVE_APPTASK_REQUEST; }
interface RemoveAppTaskSuccessAction { type: typeof REMOVE_APPTASK_SUCCESS; payload: number; } // payload is ID
interface RemoveAppTaskFailureAction { type: typeof REMOVE_APPTASK_FAILURE; payload: string; }

interface UpdateAppTaskRequestAction { type: typeof UPDATE_APPTASK_REQUEST; }
interface UpdateAppTaskSuccessAction { type: typeof UPDATE_APPTASK_SUCCESS; payload: TaskEntity; } // payload is updated TaskEntity
interface UpdateAppTaskFailureAction { type: typeof UPDATE_APPTASK_FAILURE; payload: string; }

export type AppTaskActionTypes =
    | GetAppTasksRequestAction | GetAppTasksSuccessAction | GetAppTasksFailureAction
    | AddAppTaskRequestAction | AddAppTaskSuccessAction | AddAppTaskFailureAction
    | RemoveAppTaskRequestAction | RemoveAppTaskSuccessAction | RemoveAppTaskFailureAction
    | UpdateAppTaskRequestAction | UpdateAppTaskSuccessAction | UpdateAppTaskFailureAction;