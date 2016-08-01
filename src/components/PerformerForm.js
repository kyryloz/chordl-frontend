import * as React from "react";

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
        this.props.onPerformerSubmit({name: name});
        this.setState({name: ''});
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