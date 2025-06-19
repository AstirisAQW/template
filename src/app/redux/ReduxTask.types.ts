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

export interface AppTaskState{
    task: TaskEntity[];
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
interface RemoveAppTaskSuccessAction { type: typeof REMOVE_APPTASK_SUCCESS; payload: number; }
interface RemoveAppTaskFailureAction { type: typeof REMOVE_APPTASK_FAILURE; payload: string; }

export type AppTaskActionTypes =
    | GetAppTasksRequestAction | GetAppTasksSuccessAction | GetAppTasksFailureAction
    | AddAppTaskRequestAction | AddAppTaskSuccessAction | AddAppTaskFailureAction
    | RemoveAppTaskRequestAction | RemoveAppTaskSuccessAction | RemoveAppTaskFailureAction;