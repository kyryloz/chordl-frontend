import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import {Router, Route, IndexRoute, browserHistory} from "react-router";
import AddNewSongPage from "./pages/AddNewSongPage";
import PerformerPage from "./pages/PerformerPage";
import SongPage from "./pages/SongPage";
import HomePage from "./pages/HomePage";
import EditPerformerPage from "./pages/EditPerformerPage";
import EditSongPage from "./pages/EditSongPage";
import SearchPage from "./pages/SearchPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import * as $ from "jquery";
import Store from "./store/store";
import {Provider} from "react-redux";
import store, {history} from "./store";
import App from "./components/App";

const auth = new Store;

injectTapEventPlugin();

$.ajaxSetup({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.createAuthorizationTokenHeader()}`
    },
});

window.fbAsyncInit = function () {
    FB.init({
        appId: '1086354088118124',
        xfbml: true,
        version: 'v2.7'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

const muiTheme = getMuiTheme({
    palette: {
        // TODO theme
    }
});


const NotFound = () => ( <div style={{textAlign: "center", marginTop: 32}}><h3>404. Not found :,(</h3></div>);


const Routes = () => (
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Router history={browserHistory} onUpdate={handleUpdate}>
                <Route path='/' component={App}>
                    <IndexRoute component={HomePage}/>
                    <Route path='/add' component={AddNewSongPage}/>
                    <Route path='/performer/:id' component={PerformerPage}/>
                    <Route path='/performer/:id/edit' component={EditPerformerPage}/>
                    <Route path='/song/:id' component={SongPage}/>
                    <Route path='/song/:id/edit' component={EditSongPage}/>
                    <Route path='/search' component={SearchPage}/>
                    <Route path='*' component={NotFound}/>
                </Route>
            </Router>
        </MuiThemeProvider>
    </Provider>
);


function handleUpdate() {
    const {action} = this.state.location;

    if (action === "PUSH") {
        window.scrollTo(0, 0);
    }
}

ReactDOM.render(
    <Routes />,
    document.getElementById('root')
);