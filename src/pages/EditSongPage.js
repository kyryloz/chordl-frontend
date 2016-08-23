import React from "react";
import * as $ from "jquery";
import FlatButton from "material-ui/FlatButton";
import update from "react-addons-update";
import TextField from "material-ui/TextField";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";

export default class EditSongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

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
            url: `${api.songs}/${this.props.params.id}`,
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
            url: `${api.songs}/${this.props.params.id}`,
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
        this.context.router.replace("/song/" + this.state.song.id)
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

    renderHeader() {
        return (
            <TextField
                floatingLabelText="Title"
                floatingLabelFixed={true}
                fullWidth={true}
                value={this.state.song.title}
                onChange={this.handleTitleChange}
            />
        )
    }

    renderContent() {
        return (
            <div>
                <TextField
                    floatingLabelText="Lyrics"
                    floatingLabelFixed={true}
                    fullWidth={true}
                    multiLine={true}
                    rows={10}
                    value={this.state.song.lyrics}
                    onChange={this.handleLyricsChange}
                />
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

EditSongPage.contextTypes = {
    router: React.PropTypes.object
};