import {createStore, compse} from "redux";
import {syncHistoryWithStore} from "react-router-redux";
import {browserHistory} from "react-router";
import rootReducer from "../reducers/index";

const defaultState = {
    posts: [],
    comments: []
};

const store = createStore(rootReducer, defaultState,
    window.devToolsExtension && window.devToolsExtension());

export const history = syncHistoryWithStore(browserHistory, store);
export default store;