import * as React from "react";
import * as $ from "jquery";

import SearchBar from "./SearchBar";
import PerformerList from "./PerformerList";

export default class PerformerBox extends React.Component {

    constructor() {
        super();
        this.state = {data: []};
    }

    componentDidMount() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, error) {
                console.error(this.props.url, status, error.toString());
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="performerBox">
                <SearchBar/>
                <h1>All performers:</h1>
                <PerformerList data={this.state.data}/>
            </div>
        );
    }
}