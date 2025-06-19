import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";
import { appTaskReducer } from "./redux/ReduxTask.reducer";
import appTaskSliceReducer from "./redux/ReduxTaskSlice"

const rootReducer = combineReducers({
    appTask: appTaskReducer,
    appTaskRTK: appTaskSliceReducer,
});

export const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
