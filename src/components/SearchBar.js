import React from "react";
import TextField from 'material-ui/TextField';

export default class SearchBar extends React.Component {
    render() {
        return (
            <TextField
                hintText="Search database"
                style={this.props.style}
                inputStyle={{
                    color: '#d7d7d7'
                }}
                hintStyle={{
                    color: '#7e98a5'
                }}
            />
        )
    }
}