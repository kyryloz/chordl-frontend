import React from "react";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import * as $ from "jquery";

const url = 'http://localhost:8081/api/songs';

const styles = {
    form: {
        marginLeft: '70px',
        marginRight: '70px'
    }
};

export default class AddNewSong extends React.Component {

    constructor() {
        super();
        this.state = {
            performerId: -1,
            performerName: "",
            title: "",
            lyrics: ""
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        var data = {
            performerId: this.state.performerId,
            performerName: this.state.performerName.trim(),
            title: this.state.title.trim(),
            lyrics: this.state.lyrics.trim(),
        };

        this.setState({
            performerId: -1,
            performerName: "",
            title: "",
            lyrics: ""
        });

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                console.log("Submit success")
            },
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    };

    handlePerformerChange = (e) => {
        this.setState({performerName: e.target.value, performerId: 1})
    };

    handleTitleChange = (e) => {
        this.setState({title: e.target.value})
    };

    handleLyricsChange = (e) => {
        this.setState({lyrics: e.target.value})
    };

    render() {
        return (
            <div style={styles.form}>
                <h3>Add new song</h3>
                <TextField
                    floatingLabelText="Artist"
                    fullWidth={true}
                    value={this.state.performerName}
                    onChange={this.handlePerformerChange}
                /><br/>
                <TextField
                    floatingLabelText="Title"
                    fullWidth={true}
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                /><br/>
                <TextField
                    floatingLabelText="Lyrics"
                    fullWidth={true}
                    multiLine={true}
                    rows={10}
                    value={this.state.lyrics}
                    onChange={this.handleLyricsChange}
                /><br/>
                <FlatButton onClick={this.handleSubmit} label="Submit" primary={true} />
            </div>
        )
    }
}