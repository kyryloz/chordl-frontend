import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import Routes from "./config/Routes";
import facebookInitializer from "./config/FacebookInitializer";
import ajaxInitializer from "./config/AjaxInitializer";

facebookInitializer();
ajaxInitializer();

ReactDOM.render(
    <Routes />,
    document.getElementById('root')
);