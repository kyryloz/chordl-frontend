import {createStore, applyMiddleware, compose} from "redux";
import {syncHistoryWithStore, routerMiddleware} from "react-router-redux";
import {browserHistory} from "react-router";
import rootReducer from "../reducers/rootReducer";

const defaultState = {
    authReducer: {
        user: {
            username: "anon"
        }
    }
};

const routingMiddleware = routerMiddleware(browserHistory);

const store = createStore(rootReducer, defaultState, compose(
    applyMiddleware(routingMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
));

export const history = syncHistoryWithStore(browserHistory, store);
export default store;