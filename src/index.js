import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./index.css";

var PerformerBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function () {
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
    },

    handlePerformerSubmit: function (performer) {
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
            success: function(data) {
                performersOriginal.push(data);
                this.setState({data: performersOriginal});
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({data: performersOriginal});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div className="performerBox">
                <h1>All performers:</h1>
                <PerformerList data={this.state.data} />
                <PerformerForm onPerformerSubmit={this.handlePerformerSubmit}/>
            </div>
        );
    }
});

var PerformerList = React.createClass({
    render: function () {
        var performerNodes = this.props.data.map(function (performer) {
            return (
                <Performer name={performer.name} key={performer.id}>
                    {/*{performer.songs}*/}
                </Performer>
            );
        });

        return (
            <div className="performerList">
                {performerNodes}
            </div>
        );
    }
});

var PerformerForm = React.createClass({
    getInitialState: function() {
        return {name: ''};
    },
    
    handleNameChange: function (e) {
        this.setState({name: e.target.value})
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        if (!name) {
            return;
        }
        this.props.onPerformerSubmit({name: name});
        this.setState({name: ''});
    },

    render: function () {
        return (
            <form className="performerForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Performer title"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />
                <input type="submit" value="Add performer" />
            </form>
        );
    }
});

var Performer = React.createClass({
    render: function () {
        return (
            <div className="performer">
                <h2 className="performerName">
                    {this.props.name}
                </h2>
            </div>
        );
    }
});

ReactDOM.render(
    <PerformerBox url="http://localhost:8081/api/performers" />,
    document.getElementById('root')
);
