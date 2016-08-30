import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Paper from "material-ui/Paper";
import FabAdd from "./components/FabAdd";
import {Router, Route, IndexRoute, browserHistory} from "react-router";
import Header from "./components/Header";
import AddNewSongPage from "./pages/AddNewSongPage";
import PerformerPage from "./pages/PerformerPage";
import SongPage from "./pages/SongPage";
import HomePage from "./pages/HomePage";
import EditPerformerPage from "./pages/EditPerformerPage";
import EditSongPage from "./pages/EditSongPage";
import SearchPage from "./pages/SearchPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import {StickyContainer, Sticky} from 'react-sticky';
import * as $ from "jquery";
import Store from "./store/store";

const store = new Store;

injectTapEventPlugin();

$.ajaxSetup({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${store.createAuthorizationTokenHeader()}`
    },
});

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1086354088118124',
        xfbml      : true,
        version    : 'v2.7'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

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
        paddingBottom: 32,
        width: 800,
        flexGrow: 1
    }
};

const NotFound = () => ( <div style={{textAlign: "center", marginTop: 32}}><h3>404. Not found :,(</h3></div>);

const Container = (props) => (
    <div>
        <StickyContainer style={styles.main}>
            <Sticky isActive={false}>
                <header>
                    <div style={styles.header}><Header/></div>
                </header>
            </Sticky>
            <Paper style={styles.paper} zDepth={1}>
                <div>
                    {props.children}
                    {!props.history.isActive('add') && (<FabAdd/>) }
                </div>
            </Paper>
        </StickyContainer>
    </div>
);

const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory} onUpdate={handleUpdate}>
            <Route path='/' component={Container}>
                <IndexRoute component={HomePage}/>
                <Route path='/add' component={AddNewSongPage}/>
                <Route path='/index(/:symbol)' component={HomePage}/>
                <Route path='/performer/:id' component={PerformerPage}/>
                <Route path='/performer/:id/edit' component={EditPerformerPage}/>
                <Route path='/song/:id' component={SongPage}/>
                <Route path='/song/:id/edit' component={EditSongPage}/>
                <Route path='/search' component={SearchPage}/>
                <Route path='/register' component={SignUpPage}/>
                <Route path='/login' component={LoginPage}/>
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);


function handleUpdate() {
    const {action} = this.state.location;

    if (action === "PUSH") {
        window.scrollTo(0, 0);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);