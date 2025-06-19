import { Dispatch } from "redux";
import { TaskEntity } from "../../domain/entities/TaskEntity";
import { GetAllTask_Service, GetTask_Service, RemoveTask_Service, UpdateTask_Service, AddTask_Service} from "../services/taskServices";
import { AddTaskParams } from "../../domain/usecases/AddTask_Usecase";

import {
    GET_APPTASK_REQUEST, GET_APPTASK_SUCCESS, GET_APPTASK_FAILURE,
    ADD_APPTASK_REQUEST, ADD_APPTASK_SUCCESS, ADD_APPTASK_FAILURE,
    REMOVE_APPTASK_REQUEST, REMOVE_APPTASK_SUCCESS, REMOVE_APPTASK_FAILURE,
    AppTaskActionTypes
} from "./ReduxTask.types";


export const fetchAppTasks = () => async (dispatch: Dispatch<AppTaskActionTypes>) => {
    dispatch({ type: GET_APPTASK_REQUEST });
    try {
        const tasks = await GetAllTask_Service.execute();
        dispatch({ type: GET_APPTASK_SUCCESS, payload: tasks });
    } catch (error: any) {
        dispatch({ type: GET_APPTASK_FAILURE, payload: error.message || "Failed to fetch tasks" });
    }
};

export const createAppTask = (taskData: AddTaskParams) => async (dispatch: Dispatch<AppTaskActionTypes>) => {
    dispatch({ type: ADD_APPTASK_REQUEST });
    try {
        const newTask = await AddTask_Service.execute(taskData);
        dispatch({ type: ADD_APPTASK_SUCCESS, payload: newTask });
    } catch (error: any) {
        dispatch({ type: ADD_APPTASK_FAILURE, payload: error.message || "Failed to add task" });
    }
};

export const deleteAppTask = (id: number) => async (dispatch: Dispatch<AppTaskActionTypes>) => {
    dispatch({ type: REMOVE_APPTASK_REQUEST });
    try {
        await RemoveTask_Service.execute(id);
        dispatch({ type: REMOVE_APPTASK_SUCCESS, payload: id });
    } catch (error: any) {
        dispatch({ type: REMOVE_APPTASK_FAILURE, payload: error.message || "Failed to remove task" });
    }
};