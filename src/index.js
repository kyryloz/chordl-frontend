import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import ContentAdd from 'material-ui/svg-icons/content/add';
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

const styles = {
    header: {
        width: '100%'
    },

    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vmax',
        paddingBottom: 16,
        flexGrow: 1
    },

    menuLeft: {
        height: '1000px',
        width: '300px',
        borderRight: '1px solid #dedede'
    },

    fabAdd: {
        display: 'inline-block',
        position: 'fixed',
        bottom: '22px',
        right: '20px'
    },

    paper: {
        margin: '0 auto',
        display: 'inline-block',
        width: 800,
        flexGrow: 1
    }
};

const NotFound = () => ( <h1>Not found!</h1>);

const Container = (props) => (
    <div style={styles.main}>
        <div style={styles.header}><Header/></div>
        <Paper style={styles.paper} zDepth={1}>
            <div>
                {props.children}
                {!props.history.isActive('add') &&
                (<FloatingActionButton
                    style={styles.fabAdd}
                    href="#/add">
                    <ContentAdd />
                </FloatingActionButton>)
                }
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
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);