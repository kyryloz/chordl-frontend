import React from "react";
import * as $ from "jquery";
import FlatButton from 'material-ui/FlatButton';
import { hashHistory } from 'react-router';
import update from "react-addons-update";
import TextField from "material-ui/TextField"

const urlSong = 'http://localhost:8081/api/songs/';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

export default class SongPage extends React.Component {

    constructor(props) {
        super(props);

        this.urlGetSong = urlSong + this.props.params.id;

        this.state = {song: {
            title: "",
            lyrics: ""
        }}
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        $.ajax({
            url: this.urlGetSong,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({song: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    updateSong() {
        $.ajax({
            url: this.urlGetSong,
            type: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.state.song),
            success: function (data) {
                this.handleCancel();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    }

    handleSave = () => {
        this.updateSong();
    };

    handleCancel = () => {
        hashHistory.replace("/song/" + this.state.song.id)
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
        this.setState(newState);
    };

    render() {
        return (
            <div style={styles.page}>
                <div style={{float: 'left', minWidth: 460, marginTop: 70}}>
                    <TextField
                        floatingLabelText="Title"
                        floatingLabelFixed={true}
                        fullWidth={true}
                        value={this.state.song.title}
                        onChange={this.handleTitleChange}
                    /><br/>
                    <br/>
                    <TextField
                        floatingLabelText="Lyrics"
                        floatingLabelFixed={true}
                        fullWidth={true}
                        multiLine={true}
                        rows={10}
                        value={this.state.song.lyrics}
                        onChange={this.handleLyricsChange}
                    />
                </div>
                <div style={{float: 'right', marginTop: 10}}>
                    <FlatButton
                        label="Save"
                        primary={true}
                        disabled={!this.state.song.title && !this.state.song.lyrics}
                        onTouchTap={this.handleSave}
                    />
                    <FlatButton
                        label="Cancel"
                        labelStyle={{color: 'red'}}
                        onTouchTap={this.handleCancel}
                    />
                </div>
            </div>
        )
    }
}