import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Paper from "material-ui/Paper";
import FabAdd from "./components/FabAdd";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Header from "./components/Header";
import AddNewSongPage from "./pages/AddNewSongPage";
import PerformerPage from "./pages/PerformerPage";
import SongPage from "./pages/SongPage";
import HomePage from "./pages/HomePage";
import EditPerformerPage from "./pages/EditPerformerPage";
import EditSongPage from "./pages/EditSongPage";
import SearchPage from "./pages/SearchPage";

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        // TODO theme
    }
});

const styles = {
    header: {
        width: '100%'
    },

    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: 16,
        flexGrow: 1
    },

    menuLeft: {
        height: '1000px',
        width: '300px',
        borderRight: '1px solid #dedede'
    },

    paper: {
        margin: '0 auto',
        display: 'inline-block',
        paddingBottom: 32,
        width: 800,
        flexGrow: 1
    }
};

const NotFound = () => ( <div style={{textAlign: "center", marginTop: 32}}><h3>404. Not found :,(</h3></div>);

const Container = (props) => (
    <div style={styles.main}>
        <div style={styles.header}><Header/></div>
        <Paper style={styles.paper} zDepth={1}>
            <div>
                {props.children}
                {!props.history.isActive('add') && (<FabAdd/>) }
            </div>
        </Paper>
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
                <Route path='/search' component={SearchPage}/>
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);