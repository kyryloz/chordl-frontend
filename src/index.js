import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import PerformerBox from "./components/PerformerBox"
import Header from "./components/Header"
import MainMenu from './components/MainMenu';

injectTapEventPlugin();

const Home = () => (
    <div className="column">
        <div className="columnContent">
            <PerformerBox url="http://localhost:8081/api/performers"/>
        </div>
    </div>
);

const AddPage = () => <h1>Add new song here</h1>;

const AllSongsPage = () => <h1>All songs</h1>;

const AboutPage = () => <h1>Chords for guitar</h1>;

const NotFound = () => ( <h1>404!</h1>);

const Container = (props) => (
    <div className="mainContainer">
        <div className="header"><Header/></div>
        <div className="wrapper">
            <div className="menuLeft"><MainMenu/></div>
            <div className="content">
                {props.children}
            </div>
        </div>
    </div>
);

const App = () => (
    <MuiThemeProvider>
        <Router history={hashHistory}>
            <Route path='/' component={Container}>
                <IndexRoute component={Home}/>
                <Route path='/add' component={AddPage}/>
                <Route path='/all' component={AllSongsPage}/>
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