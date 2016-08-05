import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Header from "./components/Header";
import MainMenu from "./components/MainMenu";
import AddNewSongPage from "./pages/AddNewSongPage";
import PerformerPage from "./pages/PerformerPage";
import SongPage from "./pages/SongPage";
import HomePage from "./pages/HomePage";
import EditPerformerPage from "./pages/EditPerformerPage";
import EditSongPage from "./pages/EditSongPage";

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        // TODO theme
    }
});

const NotFound = () => ( <h1>Not found!</h1>);

const Container = (props) => (
    <div className="mainContainer">
        <div className="header"><Header/></div>
        <div className="wrapper">
            <div className="menuLeft"><MainMenu history={props.history}/></div>
            <div className="content">
                {props.children}
            </div>
        </div>
    </div>
);

const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={hashHistory}>
            <Route path='/' component={Container}>
                <IndexRoute component={HomePage}/>
                <Route path='/add' component={AddNewSongPage}/>
                <Route path='/index(/:symbol)' component={HomePage}/>
                <Route path='/performer/:id' component={PerformerPage}/>
                <Route path='/performer/:id/edit' component={EditPerformerPage}/>
                <Route path='/song/:id' component={SongPage}/>
                <Route path='/song/:id/edit' component={EditSongPage}/>
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);