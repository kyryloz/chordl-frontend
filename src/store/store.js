import {createStore, compse} from "redux";
import {syncHistoryWithStore} from "react-router-redux";
import {browserHistory} from "react-router";
import rootReducer from "../reducers/rootReducer";
import AuthStore from "./authStore";

const authStore = new AuthStore;

const defaultState = {
    authReducer: {
        isAuthenticated: false
    }
};

const store = createStore(rootReducer, defaultState,
    window.devToolsExtension && window.devToolsExtension());

export const history = syncHistoryWithStore(browserHistory, store);
export default store;