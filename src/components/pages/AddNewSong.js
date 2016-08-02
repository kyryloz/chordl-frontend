import React from "react";
import update from "react-addons-update";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import AutoComplete from "material-ui/AutoComplete";
import * as $ from "jquery";

const url = 'http://localhost:8081/api/songs';
const urlGetPerformers = 'http://localhost:8081/api/performers';

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
            song: {
                performerId: -1,
                performerName: "",
                title: "",
                lyrics: "",
            },
            performers: []
        };
    }

    componentDidMount() {
        this.loadAllPerformers();
    }

    loadAllPerformers() {
        $.ajax({
            url: urlGetPerformers,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performers: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        console.log(this.state);

        var data = {
            performerId: this.state.song.performerId,
            performerName: this.state.song.performerName.trim(),
            title: this.state.song.title.trim(),
            lyrics: this.state.song.lyrics.trim(),
        };

        this.setState({
            song: {
                performerId: -1,
                performerName: "",
                title: "",
                lyrics: ""
            }
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
                console.error(status, err.toString());
            }.bind(this)
        });
    };

    handlePerformerChange = (performer) => {
        var newState = update(this.state, {
            song: {
                performerName: {$set: performer.name},
                performerId: {$set: performer.id},
            }
        });
        this.setState(newState)
    };

    handleTitleChange = (e) => {
        var newState = update(this.state, {
            song: {
                title: {$set: e.target.value}
            }
        });
        this.setState(newState);
    };

    handleLyricsChange = (e) => {
        var newState = update(this.state, {
            song: {
                lyrics: {$set: e.target.value}
            }
        });
        this.setState(newState)
    };

    render() {
        return (
            <div style={styles.form}>
                <h3>Add new song</h3>
                <AutoComplete
                    floatingLabelText="Artist"
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.state.performers}
                    dataSourceConfig={{text: 'name', value: 'id'}}
                    maxSearchResults={5}
                    fullWidth={true}
                    onNewRequest={this.handlePerformerChange}
                /><br/>
                <TextField
                    floatingLabelText="Title"
                    fullWidth={true}
                    value={this.state.song.title}
                    onChange={this.handleTitleChange}
                /><br/>
                <TextField
                    floatingLabelText="Lyrics"
                    fullWidth={true}
                    multiLine={true}
                    rows={10}
                    value={this.state.song.lyrics}
                    onChange={this.handleLyricsChange}
                /><br/>
                <FlatButton onClick={this.handleSubmit} label="Submit" primary={true}/>
            </div>
        )
    }
}