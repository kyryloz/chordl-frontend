import "./style/css/bootstrap.min.css";
import "./style/index.css";
import React from "react";
import ReactDOM from "react-dom";
import Routes from "./config/Routes";
import facebookInitializer from "./config/FacebookInitializer";

facebookInitializer();

ReactDOM.render(
    <Routes />,
    document.getElementById('root')
);