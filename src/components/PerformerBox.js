import * as React from "react";
import * as $ from "jquery";

import SearchBar from "./SearchBar";
import PerformerList from "./PerformerList";
import PerformerForm from "./PerformerForm";

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

    handlePerformerSubmit = (performer) => {
        var performersOriginal = this.state.data;
        var performersOptimistic = this.state.data.slice();

        performer.id = Date.now();
        performersOptimistic.push(performer);

        this.setState({data: performersOptimistic});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(performer),
            success: function (data) {
                performersOriginal.push(data);
                this.setState({data: performersOriginal});
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({data: performersOriginal});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    };

    render() {
        return (
            <div className="performerBox">
                <SearchBar/>
                <h1>All performers:</h1>
                <PerformerList data={this.state.data}/>
                <PerformerForm onPerformerSubmit={this.handlePerformerSubmit}/>
            </div>
        );
    }
}