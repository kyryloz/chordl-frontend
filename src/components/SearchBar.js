import React from "react";
import TextField from 'material-ui/TextField';

export default class SearchBar extends React.Component {
    render() {
        return (
            <TextField
                hintText="Search database"
                style={this.props.style}
            />
        )
    }
}