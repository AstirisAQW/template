// TaskEntity is implicitly updated via import
import {
    AppTaskState, AppTaskActionTypes,
    GET_APPTASK_REQUEST, GET_APPTASK_SUCCESS, GET_APPTASK_FAILURE,
    ADD_APPTASK_REQUEST, ADD_APPTASK_SUCCESS, ADD_APPTASK_FAILURE,
    REMOVE_APPTASK_REQUEST, REMOVE_APPTASK_SUCCESS, REMOVE_APPTASK_FAILURE,
    UPDATE_APPTASK_REQUEST, UPDATE_APPTASK_SUCCESS, UPDATE_APPTASK_FAILURE
} from "./ReduxTask.types";

const initialState: AppTaskState = {
    task: [],
    loading: false,
    error: null,
};

export const appTaskReducer = (state = initialState, action: AppTaskActionTypes): AppTaskState => {
    switch (action.type) {
        case GET_APPTASK_REQUEST:
        case ADD_APPTASK_REQUEST:
        case REMOVE_APPTASK_REQUEST:
        case UPDATE_APPTASK_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_APPTASK_SUCCESS:
            return { ...state, loading: false, task: action.payload.sort((a,b) => a.id - b.id) };
        case ADD_APPTASK_SUCCESS:
            return { ...state, loading: false, task: [...state.task, action.payload].sort((a,b) => a.id - b.id) };
        case REMOVE_APPTASK_SUCCESS:
            return {
                ...state,
                loading: false,
                task: state.task.filter(task => task.id !== action.payload), // sort not strictly needed if order is by addition
            };
        case UPDATE_APPTASK_SUCCESS:
            return {
                ...state,
                loading: false,
                task: state.task.map(t =>
                    t.id === action.payload.id ? action.payload : t
                ).sort((a,b) => a.id - b.id),
            };

        case GET_APPTASK_FAILURE:
        case ADD_APPTASK_FAILURE:
        case REMOVE_APPTASK_FAILURE:
        case UPDATE_APPTASK_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};