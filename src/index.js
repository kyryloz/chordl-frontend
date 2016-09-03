import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {Router, Route, IndexRoute} from "react-router";
import AddNewSongPage from "./pages/AddNewSongPage";
import PerformerPage from "./pages/PerformerPage";
import SongPage from "./pages/SongPage";
import HomePage from "./pages/HomePage";
import EditPerformerPage from "./pages/EditPerformerPage";
import EditSongPage from "./pages/EditSongPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";
import {Provider} from "react-redux";
import App from "./components/App";
import facebookInitializer from "./config/FacebookInitializer";
import ajaxInitializer from "./config/AjaxInitializer";
import store, {history} from "./store/store";

injectTapEventPlugin();
facebookInitializer();
ajaxInitializer();


const muiTheme = getMuiTheme({
    palette: {
        // TODO theme
    }
});

// const UserIsAuthenticated = UserAuthWrapper({
//     authSelector: state => state.user,
//     redirectAction: routerActions.replace,
//     wrapperDisplayName: 'UserIsAuthenticated',
//     failureRedirectPath: "/"
// });

const Routes = () => (
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Router history={history} onUpdate={handleUpdate}>
                <Route path='/' component={App}>
                    <IndexRoute component={HomePage}/>
                    <Route path='/add' component={AddNewSongPage}/>
                    <Route path='/performer/:id' component={PerformerPage}/>
                    <Route path='/performer/:id/edit' component={EditPerformerPage}/>
                    <Route path='/song/:id' component={SongPage}/>
                    <Route path='/song/:id/edit' component={EditSongPage}/>
                    <Route path='/search' component={SearchPage}/>
                    <Route path='*' component={NotFoundPage}/>
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