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
import AllSongsPage from "./pages/AllSongsPage";
import PerformerPage from "./pages/PerformerPage";
import SongPage from "./pages/SongPage";

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        // textColor: colors.primaryTextColor,
        // accentColor: colors.accentColor,
        // primary1Color: colors.defaultPrimaryColor,
        // primary2Color: colors.lightPrimaryColor,
        // primary3Color: colors.darkPrimaryColor,
        // accent1Color: colors.accentColor,
        // accent2Color: colors.accentColor,
        // accent3Color: colors.accentColor,
        // alternateTextColor: colors.secondaryTextColor,
        // borderColor: colors.dividerColor,
    }
});

const Home = () => (
    <h1>Home</h1>
);

const AboutPage = () => <h1>Chords for guitar</h1>;

const NotFound = () => ( <h1>404!</h1>);

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
                <IndexRoute component={Home}/>
                <Route path='/add' component={AddNewSongPage}/>
                <Route path='/all(/:symbol)' component={AllSongsPage}/>
                <Route path='/performer/:id' component={PerformerPage}/>
                <Route path='/song/:id' component={SongPage}/>
                <Route path='/about' component={AboutPage}/>
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);