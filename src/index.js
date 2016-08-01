import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import PerformerBox from "./components/PerformerBox"

ReactDOM.render(
    <PerformerBox url="http://localhost:8081/api/performers"/>,
    document.getElementById('root')
);
