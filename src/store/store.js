import {createStore, applyMiddleware, compose} from "redux";
import {syncHistoryWithStore, routerMiddleware} from "react-router-redux";
import {browserHistory} from "react-router";
import reducers from "../reducers/reducers";
import thunk from "redux-thunk";

const defaultState = {
    auth: {}
};

const routingMiddleware = routerMiddleware(browserHistory);

const middleware = [routingMiddleware, thunk];

const store = createStore(reducers, defaultState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
));

export const history = syncHistoryWithStore(browserHistory, store);
export default store;