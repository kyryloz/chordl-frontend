import * as React from "react";
import * as $ from "jquery";

export default class PerformerForm extends React.Component {
    constructor() {
        super();
        this.state = {name: ''};
    }

    handleNameChange = (e) => {
        this.setState({name: e.target.value})
    };

    handleSubmit = (e) => {
        e.preventDefault();
        var name = this.state.name.trim();
        if (!name) {
            return;
        }
        this.handlePerformerSubmit({name: name});
        this.setState({name: ''});
    };

    handlePerformerSubmit(performer) {
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
                console.log("Submit success")
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    };

    render() {
        return (
            <form className="performerForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Performer title"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />
                <input type="submit" value="Add performer"/>
            </form>
        );
    }
}