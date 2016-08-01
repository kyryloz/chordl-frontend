import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import PerformerBox from "./components/PerformerBox"
import Header from "./components/Header"
import MainMenu from './components/MainMenu';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
        <div className="mainContainer">
            <div className="header"><Header/></div>
            <div className="wrapper">
                <div className="menuLeft"><MainMenu/></div>
                <div className="content">
                    <div className="column">
                        <div className="columnContent">
                            <PerformerBox url="http://localhost:8081/api/performers"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);