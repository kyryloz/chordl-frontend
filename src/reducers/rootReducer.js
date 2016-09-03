import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
    authReducer,
    routing: routerReducer
});

export default rootReducer;